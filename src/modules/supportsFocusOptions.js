/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

'use strict';

import supportsDOM from '#internal/supportsDOM';

const canUseDOM = supportsDOM();

export default function supportsFocusOptions(): boolean {
  let supported = false;

  // Check if browser supports focus with options
  if (canUseDOM) {
    try {
      const element = document.createElement('div');
      const options = {};
      Object.defineProperty(options, 'preventScroll', {
        get() {
          supported = true;
          return false;
        }
      });
      element.focus(options);
    } catch (e) {}
  }

  return supported;
}
