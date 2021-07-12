/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * PAN RESPONDER
 *
 * `PanResponder` uses the Responder System to reconcile several touches into
 * a single gesture. It makes single-touch gestures resilient to extra touches,
 * and can be used to recognize simple multi-touch gestures. For each handler,
 * it provides a `gestureState` object alongside the ResponderEvent object.
 *
 * By default, `PanResponder` holds an `InteractionManager` handle to block
 * long-running JS events from interrupting active gestures.
 *
 * A graphical explanation of the touch data flow:
 *
 * +----------------------------+             +--------------------------------+
 * | ResponderTouchHistoryStore |             |TouchHistoryMath                |
 * +----------------------------+             +----------+---------------------+
 * |Global store of touchHistory|             |Allocation-less math util       |
 * |including activeness, start |             |on touch history (centroids     |
 * |position, prev/cur position.|             |and multitouch movement etc)    |
 * |                            |             |                                |
 * +----^-----------------------+             +----^---------------------------+
 *      |                                          |
 *      | (records relevant history                |
 *      |  of touches relevant for                 |
 *      |  implementing higher level               |
 *      |  gestures)                               |
 *      |                                          |
 * +----+-----------------------+             +----|---------------------------+
 * | ResponderEventPlugin       |             |    |   Your App/Component      |
 * +----------------------------+             +----|---------------------------+
 * |Negotiates which view gets  | Low level   |    |             High level    |
 * |onResponderMove events.     | events w/   |  +-+-------+     events w/     |
 * |Also records history into   | touchHistory|  |   Pan   |     multitouch +  |
 * |ResponderTouchHistoryStore. +---------------->Responder+-----> accumulative|
 * +----------------------------+ attached to |  |         |     distance and  |
 *                                 each event |  +---------+     velocity.     |
 *                                            |                                |
 *                                            |                                |
 *                                            +--------------------------------+
 */

import type { CallbackRef } from '../../__types__';
import type { ResponderConfig } from '../use-responder/ResponderSystem';
import type { ResponderEvent } from '../use-responder/createResponderEvent';

import React, { useDebugValue } from 'react';
import TouchHistoryMath from './TouchHistoryMath';
import { addEvent } from '#internal/addEvent';
import { useMergeRefs } from '../use-merge-refs';
import { useResponder } from '../use-responder';

export type GestureState = {|
  // ID of the gestureState; persisted as long as there's a pointer on screen
  gestureID: number,
  // The latest screen coordinates of the gesture
  x: number,
  // The latest screen coordinates of the gesture
  y: number,
  // The screen coordinates of the responder grant
  initialX: number,
  // The screen coordinates of the responder grant
  initialY: number,
  // Accumulated distance of the gesture since it started
  deltaX: number,
  // Accumulated distance of the gesture since it started
  deltaY: number,
  // Current velocity of the gesture
  velocityX: number,
  // Current velocity of the gesture
  velocityY: number,
  // Number of touches currently on screen
  numberActiveTouches: number,
  _accountsForMovesUpTo: number
|};

type ActiveCallback = (
  event: ResponderEvent,
  gestureState: GestureState
) => boolean;
type PassiveCallback = (
  event: ResponderEvent,
  gestureState: GestureState
) => void;

type InteractionState = {
  shouldCancelClick: boolean,
  timeout: null | TimeoutID
};

export type PanConfig = {|
  // Negotiate for the responder
  onMoveShouldSetPan?: ?ActiveCallback,
  onMoveShouldSetPanCapture?: ?ActiveCallback,
  onStartShouldSetPan?: ?ActiveCallback,
  onStartShouldSetPanCapture?: ?ActiveCallback,
  onPanGrant?: ?PassiveCallback,
  onPanReject?: ?PassiveCallback,
  onPanStart?: ?PassiveCallback,
  onPanMove?: ?PassiveCallback,
  onPanEnd?: ?PassiveCallback,
  onPanRelease?: ?PassiveCallback,
  onPanTerminate?: ?PassiveCallback,
  onPanTerminationRequest?: ?ActiveCallback,
  touchAction?: $PropertyType<ResponderConfig, 'touchAction'>
|};

const {
  currentCentroidX,
  currentCentroidY,
  currentCentroidXOfTouchesChangedAfter,
  currentCentroidYOfTouchesChangedAfter,
  previousCentroidXOfTouchesChangedAfter,
  previousCentroidYOfTouchesChangedAfter
} = TouchHistoryMath;

function clearInteractionTimeout(interactionState: InteractionState) {
  clearTimeout(interactionState.timeout);
}

function setInteractionTimeout(interactionState: InteractionState) {
  interactionState.timeout = setTimeout(() => {
    interactionState.shouldCancelClick = false;
  }, 250);
}

/**
 * Reset the gesture state to its initial values
 */
function initializeGestureState(gestureState: GestureState) {
  gestureState.x = 0;
  gestureState.y = 0;
  gestureState.initialX = 0;
  gestureState.initialY = 0;
  gestureState.deltaX = 0;
  gestureState.deltaY = 0;
  gestureState.velocityX = 0;
  gestureState.velocityY = 0;
  gestureState.numberActiveTouches = 0;
  // All `gestureState` accounts for timeStamps up until:
  gestureState._accountsForMovesUpTo = 0;
}

/**
 * Take all recently moved touches, calculate how the centroid has changed just for those
 * recently moved touches, and append that change to an accumulator. This is
 * to (at least) handle the case where the user is moving three fingers, and
 * then one of the fingers stops but the other two continue.
 *
 * This is very different than taking all of the recently moved touches and
 * storing their centroid as `dx/dy`. For correctness, we must *accumulate
 * changes* in the centroid of recently moved touches.
 *
 * There is also some nuance with how we handle multiple moved touches in a
 * single event. Multiple touches generate two 'move' events, each of
 * them triggering `onResponderMove`. But with the way `PanResponder` works,
 * all of the gesture inference is performed on the first dispatch, since it
 * looks at all of the touches. Therefore, `PanResponder` does not call
 * `onResponderMove` passed the first dispatch. This diverges from the
 * typical responder callback pattern (without using `PanResponder`), but
 * avoids more dispatches than necessary.
 *
 * When moving two touches in opposite directions, the cumulative
 * distance is zero in each dimension. When two touches move in parallel five
 * pixels in the same direction, the cumulative distance is five, not ten. If
 * two touches start, one moves five in a direction, then stops and the other
 * touch moves fives in the same direction, the cumulative distance is ten.
 *
 * This logic requires a kind of processing of time "clusters" of touch events
 * so that two touch moves that essentially occur in parallel but move every
 * other frame respectively, are considered part of the same movement.
 *
 * x/y: If a move event has been observed, `(x, y)` is the centroid of the most
 * recently moved "cluster" of active touches.
 * deltaX/deltaY: Cumulative touch distance. Accounts for touch moves that are
 * clustered together in time, moving the same direction. Only valid when
 * currently responder (otherwise, it only represents the drag distance below
 * the threshold).
 */
function updateGestureStateOnMove(
  gestureState: GestureState,
  touchHistory: $PropertyType<ResponderEvent, 'touchHistory'>
) {
  const movedAfter = gestureState._accountsForMovesUpTo;
  // Previous values
  const prevX = previousCentroidXOfTouchesChangedAfter(
    touchHistory,
    movedAfter
  );
  const prevY = previousCentroidYOfTouchesChangedAfter(
    touchHistory,
    movedAfter
  );
  const prevDeltaX = gestureState.deltaX;
  const prevDeltaY = gestureState.deltaY;
  // Next values
  const x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
  const y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
  const deltaX = prevDeltaX + (x - prevX);
  const deltaY = prevDeltaY + (y - prevY);

  // TODO: This must be filtered intelligently.
  const dt = touchHistory.mostRecentTimeStamp - movedAfter;

  gestureState.deltaX = deltaX;
  gestureState.deltaY = deltaY;
  gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
  gestureState.velocityX = (deltaX - prevDeltaX) / dt;
  gestureState.velocityY = (deltaY - prevDeltaY) / dt;
  gestureState.x = x;
  gestureState.y = y;
  gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp;
}

function useClickCapture(listener) {
  return React.useCallback(
    (target) => {
      if (target != null) {
        addEvent(target, 'click', listener);
      }
    },
    [listener]
  );
}

export function usePan(config: PanConfig): CallbackRef {
  const {
    onStartShouldSetPan,
    onStartShouldSetPanCapture,
    onMoveShouldSetPan,
    onMoveShouldSetPanCapture,
    onPanGrant,
    onPanStart,
    onPanMove,
    onPanEnd,
    onPanRelease,
    onPanReject,
    onPanTerminate,
    onPanTerminationRequest,
    touchAction
  } = config;

  const interactionStateRef = React.useRef<InteractionState>({
    shouldCancelClick: false,
    timeout: null
  });

  const gestureStateRef = React.useRef<GestureState>({
    // Useful for debugging
    gestureID: Math.random(),
    x: 0,
    y: 0,
    initialX: 0,
    initialY: 0,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    numberActiveTouches: 0,
    _accountsForMovesUpTo: 0
  });

  const responderConfig = {
    onStartShouldSetResponder(event: ResponderEvent): boolean {
      const gestureState = gestureStateRef.current;
      return onStartShouldSetPan != null
        ? onStartShouldSetPan(event, gestureState)
        : false;
    },
    onMoveShouldSetResponder(event: ResponderEvent): boolean {
      const gestureState = gestureStateRef.current;
      return onMoveShouldSetPan != null
        ? onMoveShouldSetPan(event, gestureState)
        : false;
    },
    onStartShouldSetResponderCapture(event: ResponderEvent): boolean {
      const gestureState = gestureStateRef.current;
      const touchHistory = event.touchHistory;
      // TODO: Actually, we should reinitialize the state any time
      // touches.length increases from 0 active to > 0 active.
      if (event.nativeEvent.touches.length === 1) {
        initializeGestureState(gestureState);
      }
      gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
      return onStartShouldSetPanCapture != null
        ? onStartShouldSetPanCapture(event, gestureState)
        : false;
    },
    onMoveShouldSetResponderCapture(event: ResponderEvent): boolean {
      const gestureState = gestureStateRef.current;
      const touchHistory = event.touchHistory;
      updateGestureStateOnMove(gestureState, touchHistory);
      return onMoveShouldSetPanCapture != null
        ? onMoveShouldSetPanCapture(event, gestureState)
        : false;
    },
    onResponderGrant(event: ResponderEvent): void {
      const interactionState = interactionStateRef.current;
      if (interactionState.timeout) {
        clearInteractionTimeout(interactionState);
      }
      interactionState.shouldCancelClick = true;

      const gestureState = gestureStateRef.current;
      gestureState.initialX = currentCentroidX(event.touchHistory);
      gestureState.initialY = currentCentroidY(event.touchHistory);
      gestureState.deltaX = 0;
      gestureState.deltaY = 0;
      if (onPanGrant != null) {
        onPanGrant(event, gestureState);
      }
    },
    onResponderReject(event: ResponderEvent): void {
      if (onPanReject != null) {
        const gestureState = gestureStateRef.current;
        onPanReject(event, gestureState);
      }
    },
    onResponderStart(event: ResponderEvent): void {
      const gestureState = gestureStateRef.current;
      const { numberActiveTouches } = event.touchHistory;
      gestureState.numberActiveTouches = numberActiveTouches;
      if (onPanStart != null) {
        onPanStart(event, gestureState);
      }
    },
    onResponderMove(event: ResponderEvent): void {
      const gestureState = gestureStateRef.current;
      const touchHistory = event.touchHistory;
      // Filter out any touch moves past the first one - we would have
      // already processed multi-touch geometry during the first event.
      updateGestureStateOnMove(gestureState, touchHistory);
      if (onPanMove != null) {
        onPanMove(event, gestureState);
      }
    },
    onResponderEnd(event: ResponderEvent): void {
      const gestureState = gestureStateRef.current;
      const { numberActiveTouches } = event.touchHistory;
      gestureState.numberActiveTouches = numberActiveTouches;
      if (onPanEnd != null) {
        onPanEnd(event, gestureState);
      }
    },
    onResponderRelease(event: ResponderEvent): void {
      const gestureState = gestureStateRef.current;
      if (onPanRelease != null) {
        onPanRelease(event, gestureState);
      }
      setInteractionTimeout(interactionStateRef.current);
      initializeGestureState(gestureState);
    },
    onResponderTerminate(event: ResponderEvent): void {
      const gestureState = gestureStateRef.current;
      if (onPanTerminate != null) {
        onPanTerminate(event, gestureState);
      }
      setInteractionTimeout(interactionStateRef.current);
      initializeGestureState(gestureState);
    },
    onResponderTerminationRequest(event: ResponderEvent): boolean {
      const gestureState = gestureStateRef.current;
      return onPanTerminationRequest != null
        ? onPanTerminationRequest(event, gestureState)
        : true;
    },
    touchAction
  };

  useDebugValue(config);

  const responderRef = useResponder(responderConfig);

  // We do not want to trigger 'click' activated gestures or native behaviors
  // on any pan target that is under a mouse cursor when it is released.
  // Browsers will natively cancel 'click' events on a target if a non-mouse
  // active pointer moves.
  const clickRef = useClickCapture(
    React.useCallback(
      (event) => {
        const { shouldCancelClick } = interactionStateRef.current;
        if (shouldCancelClick === true) {
          event.stopPropagation();
          event.preventDefault();
        }
      },
      [interactionStateRef]
    )
  );

  return useMergeRefs(responderRef, clickRef);
}
