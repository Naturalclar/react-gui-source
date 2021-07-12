/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import React from 'react';

opaque type UninitializedMarker = symbol | {||};

const UNINITIALIZED: UninitializedMarker =
  typeof Symbol === 'function' && typeof Symbol() === 'symbol'
    ? Symbol()
    : Object.freeze({});

export default function useStable<T>(getInitialValue: () => T): T {
  const ref = React.useRef(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = getInitialValue();
  }
  // $FlowIssue #64650789 Trouble refining types where `Symbol` is concerned.
  return ref.current;
}
