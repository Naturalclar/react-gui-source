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

type FocusConfig = {
  disabled?: ?boolean,
  onBlur?: ?(e: any) => void,
  onBlurCapture?: ?(e: any) => void,
  onFocus?: ?(e: any) => void,
  onFocusCapture?: ?(e: any) => void,
  onFocusChange?: ?(isFocused: boolean, e: any) => void
};

/**
 * useFocusEvents implementation
 */

const bubbleOptions = { passive: true };
const captureOptions = { capture: true, passive: true };

export function useFocus(config: FocusConfig): CallbackRef {
  const {
    disabled,
    onBlur,
    onBlurCapture,
    onFocus,
    onFocusCapture,
    onFocusChange
  } = config;

  const refCallback = useCallback(
    (target) => {
      function blurListener(e) {
        if (disabled) {
          return;
        }
        if (onBlur != null) {
          onBlur(e);
        }
        if (onFocusChange != null) {
          onFocusChange(false, e);
        }
      }

      function focusListener(e) {
        if (disabled) {
          return;
        }
        if (onFocus != null) {
          onFocus(e);
        }
        if (onFocusChange != null) {
          onFocusChange(true, e);
        }
      }

      const attachedListeners = [
        addEvent(target, 'blur', blurListener, bubbleOptions),
        addEvent(target, 'focus', focusListener, bubbleOptions),
        addEvent(
          target,
          'blur',
          disabled ? null : onBlurCapture,
          captureOptions
        ),
        addEvent(
          target,
          'focus',
          disabled ? null : onFocusCapture,
          captureOptions
        )
      ];

      return () => {
        attachedListeners.forEach((removeListener) => {
          removeListener();
        });
      };
    },
    [disabled, onBlur, onBlurCapture, onFocus, onFocusCapture, onFocusChange]
  );

  return useRefCallback(refCallback);
}
