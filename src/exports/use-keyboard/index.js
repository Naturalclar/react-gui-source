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
import { addEvent } from '#internal/addEvent';
import { useRefCallback } from '#internal/useRefCallback';

/**
 * Types
 */

type KeyboardEventsConfig = {
  disabled?: ?boolean,
  onKeyDown?: (e: any) => void,
  onKeyDownCapture?: (e: any) => void,
  onKeyUp?: (e: any) => void,
  onKeyUpCapture?: (e: any) => void
};

/**
 * useKeyboardEvents implementation
 */

const captureOptions = { capture: true };

// TODO: https://github.com/w3c/uievents/issues/202
export function useKeyboard(config: KeyboardEventsConfig): CallbackRef {
  const {
    disabled,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture
  } = config;

  const refCallback = useCallback(
    (target) => {
      const createKeyListener = (listener) => {
        return function keyListener(e) {
          if (disabled) {
            return;
          }
          // Ignore composition events
          if (!e.isComposing && e.keyCode !== 229) {
            if (listener != null) {
              listener(e);
            }
          }
        };
      };

      const keyDownListener = createKeyListener(onKeyDown);
      const keyUpListener = createKeyListener(onKeyUp);
      const keyDownCaptureListener = createKeyListener(onKeyDownCapture);
      const keyUpCaptureListener = createKeyListener(onKeyUpCapture);

      const attachedListeners = [
        addEvent(target, 'keydown', keyDownListener),
        addEvent(target, 'keyup', keyUpListener),
        addEvent(target, 'keydown', keyDownCaptureListener, captureOptions),
        addEvent(target, 'keyup', keyUpCaptureListener, captureOptions)
      ];

      return () => {
        attachedListeners.forEach((removeListener) => {
          removeListener();
        });
      };
    },
    [disabled, onKeyDown, onKeyDownCapture, onKeyUp, onKeyUpCapture]
  );

  return useRefCallback(refCallback);
}
