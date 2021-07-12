/**
 * Copyright (c) Nicolas Gallagher
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * RESPONDER EVENT SYSTEM
 *
 * A single, global "interaction lock" on views. For a view to be the "responder" means
 * that pointer interactions are exclusive to that view and none other. The "interaction
 * lock" can be transferred (only) to ancestors of the current "responder" as long as
 * pointers continue to be active.
 *
 * Responder being granted:
 *
 * A view can become the "responder" after the following events:
 *  * "pointerdown" (implemented using "touchstart", "mousedown")
 *  * "pointermove" (implemented using "touchmove", "mousemove")
 *  * "scroll" (while a pointer is down)
 *  * "select" (while a pointer is down)
 *
 * If nothing is already the "responder", the event propagates to (capture) and from
 * (bubble) the event target until a view returns `true` for
 * `on*ShouldSetResponder(Capture)`.
 *
 * If something is already the responder, the event propagates to (capture) and from
 * (bubble) the lowest common ancestor of the event target and the current "responder".
 * Then negotiation happens between the current "responder" and a view that wants to
 * become the "responder": see the timing diagram below.
 *
 * (NOTE: Scrolled views either automatically become the "responder" or release the
 * "interaction lock". A native scroll view that isn't built on top of the responder
 * system must result in the current "responder" being notified that it no longer has
 * the "interaction lock" - the native system has taken over.
 *
 * Responder being released:
 *
 * As soon as there are no more active pointers that *started* inside descendants
 * of the *current* "responder", an `onResponderRelease` event is dispatched to the
 * current "responder", and the responder lock is released.
 *
 * Typical sequence of events:
 *  * startShouldSetResponder
 *  * responderGrant/Reject
 *  * responderStart
 *  * responderMove
 *  * responderEnd
 *  * responderRelease
 */

/*                                             Negotiation Performed
                                             +-----------------------+
                                            /                         \
Process low level events to    +     Current Responder      +   wantsResponderID
determine who to perform negot-|   (if any exists at all)   |
iation/transition              | Otherwise just pass through|
-------------------------------+----------------------------+------------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +--------------+          |                            |
     | onTouchStart |          |                            |
     +------+-------+    none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onStartShouldSetResponder|----->| onResponderStart (cur) |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | | onResponder            | |
            +------------------->|    TerminationRequest  | |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | | onResponderTerminate   |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderStart|
                               |                            | +----------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchMove |           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onMoveShouldSetResponder |----->| onResponderMove (cur)  |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderMove |
                               |                            | +----------------+
                               |                            |
                               |                            |
      Some active touch started|                            |
      inside current responder | +------------------------+ |
      +------------------------->|      onResponderEnd    | |
      |                        | +------------------------+ |
  +---+---------+              |                            |
  | onTouchEnd  |              |                            |
  +---+---------+              |                            |
      |                        | +------------------------+ |
      +------------------------->|     onResponderEnd     | |
      No active touches started| +-----------+------------+ |
      inside current responder |             |              |
                               |             v              |
                               | +------------------------+ |
                               | |    onResponderRelease  | |
                               | +------------------------+ |
                               |                            |
                               +                            + */

import type { ResponderEvent } from './createResponderEvent';
import type { TouchActionValue } from '../../__types__/styles';

import { addEvent } from '#internal/addEvent';
import createResponderEvent from './createResponderEvent';
import { getActiveModality } from '#internal/modality';
import supportsDOM from '#internal/supportsDOM';
import {
  isCancelish,
  isEndish,
  isMoveish,
  isScroll,
  isSelect,
  isStartish
} from './ResponderEventTypes';
import {
  getLowestCommonAncestor,
  getResponderEventPath,
  getResponderConfig,
  hasTargetTouches,
  isPrimaryPointerDown,
  setResponderConfig
} from './utils';
import ResponderTouchHistoryStore from './ResponderTouchHistoryStore';

/* ------------ TYPES ------------ */

type ActiveResponderInstance = {
  responderEventPath: Array<HTMLElement>,
  node: HTMLElement
};

type EmptyResponderInstance = {
  responderEventPath: null,
  node: null
};

type ResponderInstance = ActiveResponderInstance | EmptyResponderInstance;

export type ResponderConfig = {|
  // Direct responder events dispatched directly to responder. Do not bubble.
  onResponderEnd?: ?(e: ResponderEvent) => void,
  onResponderGrant?: ?(e: ResponderEvent) => void,
  onResponderMove?: ?(e: ResponderEvent) => void,
  onResponderRelease?: ?(e: ResponderEvent) => void,
  onResponderReject?: ?(e: ResponderEvent) => void,
  onResponderStart?: ?(e: ResponderEvent) => void,
  onResponderTerminate?: ?(e: ResponderEvent) => void,
  onResponderTerminationRequest?: ?(e: ResponderEvent) => boolean,
  // On pointer down, should this element become the responder?
  onStartShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onStartShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  // On pointer move, should this element become the responder?
  onMoveShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onMoveShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  // On scroll, should this element become the responder? Do no bubble
  onScrollShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onScrollShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  // On select, should this element become the responder?
  onSelectShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onSelectShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  touchAction?: TouchActionValue
|};

/* ------------ IMPLEMENTATION ------------ */

const startRegistration = [
  'onStartShouldSetResponderCapture',
  'onStartShouldSetResponder',
  { bubbles: true }
];
const moveRegistration = [
  'onMoveShouldSetResponderCapture',
  'onMoveShouldSetResponder',
  { bubbles: true }
];
const scrollRegistration = [
  'onScrollShouldSetResponderCapture',
  'onScrollShouldSetResponder',
  { bubbles: false }
];
const shouldSetResponderEvents = {
  touchstart: startRegistration,
  mousedown: startRegistration,
  touchmove: moveRegistration,
  mousemove: moveRegistration,
  scroll: scrollRegistration
};

const emptyResponder = { responderEventPath: null, node: null };

let trackedTouchCount = 0;
let currentResponder: ResponderInstance = {
  node: null,
  responderEventPath: null
};

function changeCurrentResponder(responder: ResponderInstance) {
  currentResponder = responder;
}

/**
 * Process native events
 *
 * A single event listener is used to manage the responder system.
 * All pointers are tracked in the ResponderTouchHistoryStore. Native events
 * are interpreted in terms of the Responder System and checked to see if
 * the responder should be transferred. Each host node that is attached to
 * the Responder System has an ID, which is used to look up its associated
 * callbacks.
 */
function eventListener(domEvent: any) {
  const eventType = domEvent.type;
  const eventTarget = domEvent.target;

  // Ignore browser emulated mouse events
  if (
    eventType === 'mousedown' ||
    eventType === 'mousemove' ||
    eventType === 'mouseup'
  ) {
    if (getActiveModality() !== 'mouse') {
      return;
    }
  }
  // Ignore mousemove if a mousedown didn't occur first
  if (eventType === 'mousemove' && trackedTouchCount < 1) {
    return;
  }

  const isStartEvent = isStartish(eventType) && isPrimaryPointerDown(domEvent);
  const isMoveEvent = isMoveish(eventType);
  const isEndEvent = isEndish(eventType);
  const isScrollEvent = isScroll(eventType);
  const isSelectEvent = isSelect(eventType);
  const responderEvent = createResponderEvent(domEvent);

  /**
   * Record the state of active pointers
   */

  if (isStartEvent || isMoveEvent || isEndEvent) {
    if (domEvent.touches) {
      trackedTouchCount = domEvent.touches.length;
    } else {
      if (isStartEvent) {
        trackedTouchCount = 1;
      } else if (isEndEvent) {
        trackedTouchCount = 0;
      }
    }
    ResponderTouchHistoryStore.recordTouchTrack(
      eventType,
      responderEvent.nativeEvent
    );
  }

  /**
   * Responder System logic
   */

  let responderEventPath = getResponderEventPath(domEvent);
  let wasNegotiated = false;
  let wantsResponder;

  // If an event occured that might change the current responder...
  if (isStartEvent || isMoveEvent || (isScrollEvent && trackedTouchCount > 0)) {
    // If there is already a responder, prune the event paths to the lowest common ancestor
    // of the existing responder and deepest target of the event.
    const currentResponderEventPath = currentResponder.responderEventPath;

    if (currentResponderEventPath != null && responderEventPath != null) {
      const lowestCommonAncestor = getLowestCommonAncestor(
        currentResponderEventPath,
        responderEventPath
      );
      const indexOfLowestCommonAncestor = responderEventPath.indexOf(
        lowestCommonAncestor
      );

      // If there is a common ancestor, skip the current responder in the negotiation path so
      // it doesn't receive unexpected "shouldSet" events. Otherwise, skip negotiation
      if (indexOfLowestCommonAncestor !== -1) {
        const index =
          indexOfLowestCommonAncestor +
          (lowestCommonAncestor === currentResponder.node ? 1 : 0);
        responderEventPath = responderEventPath.slice(index);
      } else {
        responderEventPath = null;
      }
    }

    // Skip negotation if there is no path from the target to a common ancestor of the
    // current responder.
    if (responderEventPath != null) {
      responderEvent.bubbles = true;
      responderEvent.cancelable = true;
      wantsResponder = findWantsResponder(
        domEvent,
        responderEvent,
        responderEventPath
      );
      if (wantsResponder != null) {
        // Sets responder if none exists, or negotates transfers with existing responder
        attemptTransfer(responderEvent, wantsResponder);
        wasNegotiated = true;
      }
    }
  }

  // If there is now a responder, invoke its callbacks for the lifecycle of the gesture.
  if (currentResponder.node != null) {
    const { node } = currentResponder;
    const config = getResponderConfig(node);

    const {
      onResponderStart,
      onResponderMove,
      onResponderEnd,
      onResponderRelease,
      onResponderTerminate,
      onResponderTerminationRequest
    } = config;

    responderEvent.bubbles = false;
    responderEvent.cancelable = false;
    responderEvent.currentTarget = node;
    // Start
    if (isStartEvent) {
      if (onResponderStart != null) {
        responderEvent.dispatchConfig.registrationName = 'onResponderStart';
        onResponderStart(responderEvent);
      }
    }
    // Move
    else if (isMoveEvent) {
      if (onResponderMove != null) {
        responderEvent.dispatchConfig.registrationName = 'onResponderMove';
        onResponderMove(responderEvent);
      }
    } else {
      const isTerminateEvent =
        isCancelish(eventType) ||
        // native context menu
        eventType === 'contextmenu' ||
        // window blur
        (eventType === 'blur' && eventTarget === window) ||
        // responder (or ancestors) blur
        (eventType === 'blur' &&
          eventTarget.contains(node) &&
          domEvent.relatedTarget !== node) ||
        // native scroll without using a pointer
        (isScrollEvent && trackedTouchCount === 0) ||
        // native scroll on node that is parent of the responder (allow siblings to scroll)
        (isScrollEvent && eventTarget.contains(node) && eventTarget !== node) ||
        // native select on node
        isSelectEvent;

      const isReleaseEvent =
        isEndEvent &&
        !isTerminateEvent &&
        !hasTargetTouches(node, domEvent.touches);

      // End
      if (isEndEvent) {
        if (onResponderEnd != null) {
          responderEvent.dispatchConfig.registrationName = 'onResponderEnd';
          onResponderEnd(responderEvent);
        }
      }
      // Release
      if (isReleaseEvent) {
        if (onResponderRelease != null) {
          responderEvent.dispatchConfig.registrationName = 'onResponderRelease';
          onResponderRelease(responderEvent);
        }
        changeCurrentResponder(emptyResponder);
      }
      // Terminate
      if (isTerminateEvent) {
        let shouldTerminate = true;

        // Responders can still avoid termination but only for these events.
        if (
          eventType === 'contextmenu' ||
          eventType === 'scroll' ||
          eventType === 'select'
        ) {
          // Only call this function is it wasn't already called during negotiation.
          if (wasNegotiated) {
            shouldTerminate = false;
          } else if (onResponderTerminationRequest != null) {
            responderEvent.dispatchConfig.registrationName =
              'onResponderTerminationRequest';
            if (onResponderTerminationRequest(responderEvent) === false) {
              shouldTerminate = false;
            }
          }
        }

        if (shouldTerminate) {
          if (onResponderTerminate != null) {
            responderEvent.dispatchConfig.registrationName =
              'onResponderTerminate';
            onResponderTerminate(responderEvent);
          }
          changeCurrentResponder(emptyResponder);
          trackedTouchCount = 0;
        }
      }
    }
  }
}

/**
 * Walk the event path to/from the target node. At each node, stop and call the
 * relevant "shouldSet" functions for the given event type. If any of those functions
 * call "stopPropagation" on the event, stop searching for a responder.
 */
function findWantsResponder(domEvent, responderEvent, responderEventPath) {
  const shouldSetCallbacks = shouldSetResponderEvents[(domEvent.type: any)]; // for Flow

  if (shouldSetCallbacks != null) {
    const shouldSetCallbackCaptureName = shouldSetCallbacks[0];
    const shouldSetCallbackBubbleName = shouldSetCallbacks[1];
    const { bubbles } = shouldSetCallbacks[2];

    const check = function (node, callbackName) {
      const config = getResponderConfig(node);
      const shouldSetCallback = config[callbackName];
      if (shouldSetCallback != null) {
        responderEvent.currentTarget = node;
        if (shouldSetCallback(responderEvent) === true) {
          // Start the path from the potential responder
          const prunedResponderEventPath = responderEventPath.slice(
            responderEventPath.indexOf(node)
          );
          return { node, responderEventPath: prunedResponderEventPath };
        }
      }
    };

    // capture
    for (let i = responderEventPath.length - 1; i >= 0; i--) {
      const node = responderEventPath[i];
      const result = check(node, shouldSetCallbackCaptureName);
      if (result != null) {
        return result;
      }
      if (responderEvent.isPropagationStopped() === true) {
        return;
      }
    }

    // bubble
    if (bubbles) {
      for (let i = 0; i < responderEventPath.length; i++) {
        const node = responderEventPath[i];
        const result = check(node, shouldSetCallbackBubbleName);
        if (result != null) {
          return result;
        }
        if (responderEvent.isPropagationStopped() === true) {
          return;
        }
      }
    } else {
      const node = responderEventPath[0];
      const target = domEvent.target;
      if (target === node) {
        return check(node, shouldSetCallbackBubbleName);
      }
    }
  }
}

/**
 * Attempt to transfer the responder.
 */
function attemptTransfer(
  responderEvent: ResponderEvent,
  wantsResponder: ActiveResponderInstance
) {
  const { node: currentNode } = currentResponder;
  const { node } = wantsResponder;

  const config = getResponderConfig(node);
  const { onResponderGrant, onResponderReject } = config;

  // Set responder
  if (currentNode == null) {
    if (onResponderGrant != null) {
      responderEvent.currentTarget = node;
      responderEvent.dispatchConfig.registrationName = 'onResponderGrant';
      onResponderGrant(responderEvent);
    }
    changeCurrentResponder(wantsResponder);
  }
  // Negotiate with current responder
  else {
    const currentConfig = getResponderConfig(currentNode);
    const {
      onResponderTerminate,
      onResponderTerminationRequest
    } = currentConfig;

    let allowTransfer = true;
    if (onResponderTerminationRequest != null) {
      responderEvent.currentTarget = currentNode;
      responderEvent.dispatchConfig.registrationName =
        'onResponderTerminationRequest';
      if (onResponderTerminationRequest(responderEvent) === false) {
        allowTransfer = false;
      }
    }

    if (allowTransfer) {
      // Terminate existing responder
      if (onResponderTerminate != null) {
        responderEvent.currentTarget = currentNode;
        responderEvent.dispatchConfig.registrationName = 'onResponderTerminate';
        onResponderTerminate(responderEvent);
      }
      // Grant next responder
      if (onResponderGrant != null) {
        responderEvent.currentTarget = node;
        responderEvent.dispatchConfig.registrationName = 'onResponderGrant';
        onResponderGrant(responderEvent);
      }
      changeCurrentResponder(wantsResponder);
    } else {
      // Reject responder request
      if (onResponderReject != null) {
        responderEvent.currentTarget = node;
        responderEvent.dispatchConfig.registrationName = 'onResponderReject';
        onResponderReject(responderEvent);
      }
    }
  }
}

/* ------------ PUBLIC API ------------ */

/**
 * Attach Listeners
 *
 * Use native events as ReactDOM doesn't have a non-plugin API to implement
 * this system.
 */
export function attachListeners() {
  if (supportsDOM && window.__reactResponderSystemActive == null) {
    const captureOptions = { capture: true };
    const passiveOptions = { passive: true };
    addEvent(window, 'blur', eventListener);
    addEvent(document, 'mousedown', eventListener);
    addEvent(document, 'mousemove', eventListener);
    addEvent(document, 'mouseup', eventListener);
    addEvent(document, 'dragstart', eventListener);
    addEvent(document, 'touchstart', eventListener, passiveOptions);
    addEvent(document, 'touchmove', eventListener, passiveOptions);
    addEvent(document, 'touchend', eventListener, passiveOptions);
    addEvent(document, 'touchcancel', eventListener, passiveOptions);
    addEvent(document, 'contextmenu', eventListener);
    addEvent(document, 'select', eventListener);
    addEvent(document, 'blur', eventListener, captureOptions);
    addEvent(document, 'scroll', eventListener, captureOptions);
    window.__reactResponderSystemActive = true;
  }
}

/**
 * Register a config with node attached to the ResponderSystem.
 */
export function setConfig(node: EventTarget, config: ?ResponderConfig) {
  setResponderConfig(node, config);
}

/**
 * Allow the current responder to be terminated from within components to support
 * more complex requirements, such as use with other React libraries for working
 * with scroll views, input views, etc.
 */
export function terminateResponder() {
  const { node } = currentResponder;
  if (node != null) {
    const config = getResponderConfig(node);
    const { onResponderTerminate } = config;
    if (onResponderTerminate != null) {
      const event = createResponderEvent({});
      event.currentTarget = node;
      onResponderTerminate(event);
    }
    changeCurrentResponder(emptyResponder);
  }
  trackedTouchCount = 0;
}

/**
 * Allow unit tests to inspect the current responder in the system.
 * FOR TESTING ONLY.
 */
export function getResponderNode(): ?HTMLElement {
  return currentResponder.node;
}

const ResponderSystem = {
  attachListeners,
  setConfig,
  terminateResponder,
  getResponderNode
};

export default ResponderSystem;
