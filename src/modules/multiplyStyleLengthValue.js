/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

type StrOrNum = string | number;

const CSS_UNIT_RE = /^[+-]?\d*(?:\.\d+)?(?:[Ee][+-]?\d+)?(%|\w*)/;

const getUnit = (str: string): string => {
  const match = str.match(CSS_UNIT_RE);
  return match != null ? match[1] : '';
};

const isNumeric = (n: string | number): boolean => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const multiplyStyleLengthValue = (
  value: StrOrNum,
  multiple: number
): StrOrNum => {
  const multi = multiple != null ? multiple : 1;

  if (typeof value === 'string') {
    const val = parseFloat(value);
    if (isNumeric(val)) {
      const number = val * multi;
      const unit = getUnit(value);
      return `${number}${unit}`;
    } else {
      return value;
    }
  }

  return value * multi;
};

export default multiplyStyleLengthValue;
