/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { CallbackRef } from '../../__types__';

import { useCallback } from 'react';
import { addEvent, removeEvent } from '#internal/addEvent';
import dispatchCustomEvent from '#internal/dispatchCustomEvent';
import { getModality } from '#internal/modality';
import supportsPointerEvent from '#internal/supportsPointerEvent';
import { useRefCallback } from '#internal/useRefCallback';

/**
 * Types
 */

type HoverConfig = {
  bubbles?: ?boolean,
  disabled?: ?boolean,
  onHoverStart?: ?(e: any) => void,
  onHoverChange?: ?(bool: boolean) => void,
  onHoverUpdate?: ?(e: any) => void,
  onHoverEnd?: ?(e: any) => void
};

/**
 * Implementation
 */

const opts = { passive: true };
const lockEventType = 'react-gui:hover:lock';
const unlockEventType = 'react-gui:hover:unlock';

// This accounts for the non-PointerEvent fallback events.
function getPointerType(event) {
  const { pointerType } = event;
  return pointerType != null ? pointerType : getModality();
}

export function useHover(config: HoverConfig): CallbackRef {
  const {
    bubbles,
    disabled,
    onHoverStart,
    onHoverChange,
    onHoverUpdate,
    onHoverEnd
  } = config;

  const canUsePE = supportsPointerEvent();

  const refCallback = useCallback(
    (target) => {
      const enterEventType = canUsePE ? 'pointerenter' : 'mouseenter';
      const moveEventType = canUsePE ? 'pointermove' : 'mousemove';
      const leaveEventType = canUsePE ? 'pointerleave' : 'mouseleave';

      /**
       * "Bubbling" controllers
       */
      const lockListener = function (lockEvent) {
        if (disabled) {
          return;
        }
        if (lockEvent.target !== target) {
          hoverEnd(lockEvent.detail);
        }
      };

      const unlockListener = function (lockEvent) {
        if (disabled) {
          return;
        }
        if (lockEvent.target !== target) {
          hoverStart(lockEvent.detail);
        }
      };

      /**
       * Enter element
       */
      const enterListener = function (e) {
        if (disabled) {
          return;
        }
        if (getPointerType(e) !== 'touch') {
          if (bubbles === false) {
            dispatchCustomEvent(target, lockEventType, { detail: e });
          }
          hoverStart(e);
          // Attach listeners on demand
          addEvent(target, lockEventType, lockListener, opts);
          addEvent(target, unlockEventType, unlockListener, opts);
          if (onHoverUpdate != null) {
            addEvent(target, moveEventType, moveListener, opts);
          }
          addEvent(target, leaveEventType, leaveListener, opts);
        }
      };

      /**
       * Move within element
       */
      const moveListener = function (e) {
        if (disabled) {
          return;
        }
        if (getPointerType(e) !== 'touch') {
          if (onHoverUpdate != null) {
            // Not all browsers have these properties
            if (e.x == null) {
              e.x = e.clientX;
            }
            if (e.y == null) {
              e.y = e.clientY;
            }
            onHoverUpdate(e);
          }
        }
      };

      /**
       * Leave element
       */
      const leaveListener = function (e) {
        if (disabled) {
          return;
        }
        if (getPointerType(e) !== 'touch') {
          if (bubbles === false) {
            dispatchCustomEvent(target, unlockEventType, { detail: e });
          }
          hoverEnd(e);
          // Remove on-demand listeners
          removeEvent(target, lockEventType, lockListener, opts);
          removeEvent(target, unlockEventType, unlockListener, opts);
          if (onHoverUpdate != null) {
            removeEvent(target, moveEventType, moveListener, opts);
          }
          removeEvent(target, leaveEventType, leaveListener, opts);
        }
      };

      /**
       * Start the hover gesture
       */
      const hoverStart = function (e) {
        if (onHoverStart != null) {
          onHoverStart(e);
        }
        if (onHoverChange != null) {
          onHoverChange(true);
        }
      };

      /**
       * End the hover gesture
       */
      const hoverEnd = function (e) {
        if (onHoverEnd != null) {
          onHoverEnd(e);
        }
        if (onHoverChange != null) {
          onHoverChange(false);
        }
      };

      addEvent(target, enterEventType, enterListener, opts);

      return () => {
        removeEvent(target, lockEventType, lockListener, opts);
        removeEvent(target, unlockEventType, unlockListener, opts);
        removeEvent(target, enterEventType, enterListener, opts);
        removeEvent(target, moveEventType, moveListener, opts);
        removeEvent(target, leaveEventType, leaveListener, opts);
      };
    },
    [
      canUsePE,
      bubbles,
      disabled,
      onHoverStart,
      onHoverChange,
      onHoverUpdate,
      onHoverEnd
    ]
  );

  return useRefCallback(refCallback);
}
