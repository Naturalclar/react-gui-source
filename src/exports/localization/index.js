/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import supportsDOM from '#internal/supportsDOM';

type LocalizationStatus = {
  allowRTL: (allowRTL: boolean) => void,
  forceRTL: (forceRTL: boolean) => void,
  isRTL: boolean,
  setPreferredLanguageRTL: (setRTL: boolean) => void
};

let isPreferredLanguageRTL = false;
let isRTLAllowed = true;
let isRTLForced = false;

const isRTL = () => {
  if (isRTLForced) {
    return true;
  }
  return isRTLAllowed && isPreferredLanguageRTL;
};

const onDirectionChange = () => {
  if (supportsDOM()) {
    if (document.documentElement && document.documentElement.setAttribute) {
      document.documentElement.setAttribute('dir', isRTL() ? 'rtl' : 'ltr');
    }
  }
};

export const Localization: LocalizationStatus = {
  allowRTL(bool) {
    isRTLAllowed = bool;
    onDirectionChange();
  },
  forceRTL(bool) {
    isRTLForced = bool;
    onDirectionChange();
  },
  setPreferredLanguageRTL(bool) {
    isPreferredLanguageRTL = bool;
    onDirectionChange();
  },
  get isRTL() {
    return isRTL();
  }
};
