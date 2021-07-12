/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

const uppercasePattern = /[A-Z]/g;

function toHyphenLower(match) {
  return '-' + match.toLowerCase();
}

export default function hyphenateString(str: string): string {
  return str.replace(uppercasePattern, toHyphenLower);
}
