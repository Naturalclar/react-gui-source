/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import focusWithOptions from '#internal/focusWithOptions';
import { getActiveModality, getModality } from '#internal/modality';

const focusableElements = {
  A: true,
  BUTTON: true,
  INPUT: true,
  SELECT: true,
  TEXTAREA: true
};

/**
 * Blur an element
 */
export function blur(node: HTMLElement): void {
  if (node != null) {
    try {
      node.blur();
    } catch (err) {}
  }
}

/**
 * Clear the text from an input
 */
export function clear(node: HTMLInputElement | HTMLTextAreaElement): void {
  if (node != null && typeof node.value === 'string') {
    node.value = '';
  }
}

/**
 * Focus an element
 */
export function focus(
  node: HTMLElement,
  options?: {| preventScroll?: boolean |}
): void {
  if (node != null) {
    try {
      const name = node.nodeName;
      // A tabIndex of -1 allows the element to be programmatically focused but prevents keyboard
      // focus, so we don't want to set the value on elements configured to receive keyboard focus.
      if (
        focusableElements[name] == null &&
        node.getAttribute('tabIndex') == null
      ) {
        node.setAttribute('tabIndex', '-1');
      }
      focusWithOptions(node, options);
    } catch (err) {}
  }
}

/**
 * Measure the layout of an element
 */
export function getLayoutRect(
  node: HTMLElement,
  includeTransforms: boolean
): ?ClientRect {
  if (node != null) {
    return node.getBoundingClientRect();
  }
}

/**
 * Get the current modalities
 */
export { getActiveModality, getModality };
