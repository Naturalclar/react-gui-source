/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { AccessibilityStyledProps } from './createAccessibilityStyledProps';

export type { AccessibilityStyledProps };

import * as React from 'react';
import createAccessibilityStyledProps, {
  filterProps
} from './createAccessibilityStyledProps';
import css from '../style-sheet/css';

const createStyleRules = css.create;

export { createStyleRules, filterProps };

export function createElement(
  componentType: React.ElementType,
  props: any,
  ...children: any
): React.Node {
  const accessibilityStyledProps = createAccessibilityStyledProps(
    componentType,
    props
  );
  return React.createElement(
    componentType,
    accessibilityStyledProps,
    ...children
  );
}
