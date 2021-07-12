/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

'use strict';

import supportsDOM from './supportsDOM';

export default function supportsCSS(supportCondition: string): boolean {
  return (
    supportsDOM() &&
    window.CSS != null &&
    window.CSS.supports != null &&
    window.CSS.supports(supportCondition)
  );
}
