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

export type InteractOutsideConfig = {
  disabled?: ?boolean,
  onInteractOutside?: (e: any) => void
};

const clickEventType = 'click';

export function useInteractOutside(config: InteractOutsideConfig): CallbackRef {
  const { disabled, onInteractOutside } = config;

  const refCallback = useCallback(
    (target) => {
      // Determine if we should trigger an outside click
      const clickListener = (e) => {
        if (disabled) {
          return;
        }
        if (
          target != null &&
          target instanceof HTMLElement &&
          !target.contains(e.target)
        ) {
          if (onInteractOutside != null) {
            onInteractOutside(e);
          }
        }
      };

      const removeClick = addEvent(document, clickEventType, clickListener);

      () => {
        removeClick();
      };
    },
    [disabled, onInteractOutside]
  );

  return useRefCallback(refCallback);
}
