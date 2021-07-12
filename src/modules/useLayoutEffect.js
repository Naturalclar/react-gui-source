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

import { useEffect, useLayoutEffect } from 'react';
import supportsDOM from '#internal/supportsDOM';

const useLayoutEffectImpl: typeof useLayoutEffect = supportsDOM()
  ? useLayoutEffect
  : useEffect;

export default useLayoutEffectImpl;
