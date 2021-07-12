/**
 * Copyright (c) Nicolas Gallagher
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * Hook for integrating the Responder System into React
 *
 *   function SomeComponent({ onStartShouldSetResponder }) {
 *     const ref = useRef(null);
 *     useResponderEvents(ref, { onStartShouldSetResponder });
 *     return <div ref={ref} />
 *   }
 */

import type { CallbackRef } from '../../__types__';
import type { ResponderConfig } from './ResponderSystem';

import ResponderSystem from './ResponderSystem';
import { useCallback, useDebugValue } from 'react';
import { useRefCallback } from '#internal/useRefCallback';

export function terminateResponder() {
  ResponderSystem.terminateResponder();
}

export function useResponder(config: ?ResponderConfig): CallbackRef {
  useDebugValue(config);

  // Set the config as necessary
  const refCallback = useCallback(
    (target) => {
      ResponderSystem.attachListeners();
      ResponderSystem.setConfig(target, config);
    },
    [config]
  );

  return useRefCallback(refCallback);
}
