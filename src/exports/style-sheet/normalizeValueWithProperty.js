/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import unitlessNumbers from '#internal/unitlessNumbers';

export default function normalizeValueWithProperty(
  value: any,
  property?: ?string
): any {
  let returnValue = value;
  if (typeof value === 'number') {
    if (property == null || !unitlessNumbers[property]) {
      returnValue = `${value}px`;
    }
  }
  return returnValue;
}
