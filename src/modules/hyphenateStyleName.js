/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import hyphenateString from './hyphenateString';

const msPattern = /^ms-/;
const cache = {};

export default function hyphenateStyleName(name: string): string {
  if (cache.hasOwnProperty(name)) {
    return cache[name];
  }
  const hyphenatedName = hyphenateString(name);
  const result = msPattern.test(hyphenatedName)
    ? '-' + hyphenatedName
    : hyphenatedName;
  cache[name] = result;
  return result;
}
