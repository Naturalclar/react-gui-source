/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import styleResolver from './styleResolver';

/**
 * A simple (and dangerous) CSS system.
 * The order of CSS rule insertion is not guaranteed.
 * Avoiding combining 2 or more classes that modify the same property.
 */
const css = {
  /**
   * const classes = css.create({ base: {}, extra: {} })
   */
  create(rules: { [key: string]: mixed }, group?: number) {
    return styleResolver.createCSS(rules, group);
  }
};

export default css;
