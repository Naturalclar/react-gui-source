/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * useLayoutEffect throws an error on the server. On the few occasions where is
 * problematic, use this hook.
 *
 * @flow strict
 */

import type { TCallbackRef } from '../__types__';

import { useCallback, useRef } from 'react';

type OptionalCleanup = (() => void) | void;

/**
 * Constructs a callback ref with easy cleanup functionality. The supplied
 * callback is called with non-null host elements.
 *
 * When a new callback is supplied, the previous callbacks cleanup function
 * will be called first.
 *
 * WARNING: The callback should be stable (e.g. using `useCallback`).
 */
export function useRefCallback<T>(
  callback: (T) => OptionalCleanup
): TCallbackRef<T | null> {
  const cleanupRef = useRef<OptionalCleanup>(undefined);
  return useCallback(
    (target) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
      if (target != null) {
        cleanupRef.current = callback(target);
      }
    },
    [callback]
  );
}
