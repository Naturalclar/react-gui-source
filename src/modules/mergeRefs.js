/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type { TCallbackRef, TRef } from '../__types__';

export type ArrayOfRefs<T> = $ReadOnlyArray<TRef<T>>;
export type MergedRefs<T> = TCallbackRef<T>;

export default function mergeRefs<T>(...args: ArrayOfRefs<T>): MergedRefs<T> {
  return function forwardRef(node) {
    args.forEach((ref: TRef<T>) => {
      if (ref == null) {
        return;
      }
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      if (typeof ref === 'object') {
        ref.current = node;
        return;
      }
      console.error(
        `mergeRefs cannot handle refs of type boolean, number, or string. Received ref ${String(
          ref
        )}`
      );
    });
  };
}
