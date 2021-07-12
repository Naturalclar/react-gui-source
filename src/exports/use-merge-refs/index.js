/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type { ArrayOfRefs, MergedRefs } from '#internal/mergeRefs';

import React from 'react';
import mergeRefs from '#internal/mergeRefs';

/**
 * Constructs a new ref that forwards new values to each of the given refs. The
 * given refs will always be invoked in the order that they are supplied.
 *
 * WARNING: A known problem of merging refs using this approach is that if any
 * of the given refs change, the returned callback ref will also be changed. If
 * the returned callback ref is supplied as a `ref` to a React element, this may
 * lead to problems with the given refs being invoked more times than desired.
 */
export function useMergeRefs<T>(...args: ArrayOfRefs<T>): MergedRefs<T> {
  return React.useMemo(
    () => mergeRefs(...args),
    // eslint-disable-next-line
    [...args]
  );
}
