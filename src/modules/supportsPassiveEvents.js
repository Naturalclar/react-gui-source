/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

'use strict';

import supportsDOM from '#internal/supportsDOM';

const canUseDOM = supportsDOM();

export default function supportsPassiveEvents(): boolean {
  let supported = false;

  // Check if browser supports event with passive listeners
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
  if (canUseDOM) {
    try {
      const options = {};
      Object.defineProperty(options, 'passive', {
        get() {
          supported = true;
          return false;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) {}
  }

  return supported;
}
