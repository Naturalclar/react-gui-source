/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import StyleObjectRegistry from './StyleObjectRegistry';

function getStyle(style) {
  if (typeof style === 'number') {
    return StyleObjectRegistry.getByID(style);
  }
  return style;
}

function flattenStyle(style: ?any): ?Object {
  if (!style) {
    return undefined;
  }

  if (process.env.NODE_ENV !== 'production') {
    if (style === true) {
      console.error('A "style" value may be false but not true');
    }
  }

  if (!Array.isArray(style)) {
    return getStyle(style);
  }

  const result = {};
  for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
    const computedStyle = flattenStyle(style[i]);
    if (computedStyle) {
      for (const key in computedStyle) {
        const value = computedStyle[key];
        result[key] = value;
      }
    }
  }
  return result;
}

export default flattenStyle;
