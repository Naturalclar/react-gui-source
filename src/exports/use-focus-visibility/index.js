/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import { useModality } from '../use-modality';

/**
 * Respond to changes in *visibile* focus. Focus is visible whenever a keyboard is used.
 */
export function useFocusVisibility(): boolean {
  const { activeModality } = useModality();
  return activeModality === 'keyboard';
}
