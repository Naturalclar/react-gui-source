/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import { MONOSPACE_FONT_STACK, STYLE_SHORT_FORM_EXPANSIONS } from './constants';
import normalizeValueWithProperty from './normalizeValueWithProperty';
import supportsCSS from '#internal/supportsCSS';

/**
 * The browser implements the CSS cascade, where the order of properties is a
 * factor in determining which styles to paint. React Native is different. It
 * gives giving precedence to the more specific style property. For example,
 * the value of `paddingTop` takes precedence over that of `padding`.
 *
 * This module creates mutally exclusive style declarations by expanding all of
 * React Native's supported shortform properties (e.g. `padding`) to their
 * longfrom equivalents.
 */

const emptyObject = {};

const supportsCSS3TextDecoration =
  supportsCSS('text-decoration-line: none') ||
  supportsCSS('-webkit-text-decoration-line: none');

/**
 * Reducer
 */

const createReactDOMStyle = (style: ?Object) => {
  if (!style) {
    return emptyObject;
  }

  const resolvedStyle = {};

  Object.keys(style)
    .sort()
    .forEach((prop) => {
      const value = normalizeValueWithProperty(style[prop], prop);

      // Ignore everything with a null value
      if (value == null) {
        return;
      }

      // TODO: remove once this issue is fixed
      // https://github.com/rofrischmann/inline-style-prefixer/issues/159
      if (prop === 'backgroundClip') {
        if (value === 'text') {
          resolvedStyle.backgroundClip = value;
          resolvedStyle.WebkitBackgroundClip = value;
        }
      } else if (prop === 'fontFamily') {
        if (value === 'monospace') {
          resolvedStyle[prop] = MONOSPACE_FONT_STACK;
        } else {
          resolvedStyle[prop] = value;
        }
      } else if (prop === 'textDecorationLine') {
        // use 'text-decoration' for browsers that only support CSS2
        // text-decoration (e.g., IE, Edge)
        if (!supportsCSS3TextDecoration) {
          resolvedStyle.textDecoration = value;
        } else {
          resolvedStyle.textDecorationLine = value;
        }
      } else {
        const longFormProperties = STYLE_SHORT_FORM_EXPANSIONS[prop];
        if (longFormProperties) {
          longFormProperties.forEach((longForm, i) => {
            // The value of any longform property in the original styles takes
            // precedence over the shortform's value.
            if (typeof style[longForm] === 'undefined') {
              resolvedStyle[longForm] = value;
            }
          });
        } else {
          if (prop === 'flex') {
            if (value != null && typeof value !== 'number') {
              throw new Error(
                'react-gui: value of "flex" style must be a number'
              );
            }
          }
          resolvedStyle[prop] = Array.isArray(value) ? value.join(',') : value;
        }
      }
    });

  return resolvedStyle;
};

export default createReactDOMStyle;
