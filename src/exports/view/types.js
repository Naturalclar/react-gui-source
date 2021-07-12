/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { AccessibilityStyledProps } from '../create-element';
import type { ColorValue, GenericStyleProp } from '../../__types__';

import type {
  AnimationStyles,
  BorderStyles,
  InteractionStyles,
  LayoutStyles,
  TransformStyles
} from '../../__types__/styles';

type NumberOrString = number | string;

type OverscrollBehaviorValue = 'auto' | 'contain' | 'none';

export type ViewStyle = {
  ...AnimationStyles,
  ...BorderStyles,
  ...InteractionStyles,
  ...LayoutStyles,
  ...TransformStyles,
  backdropFilter?: ?string,
  backgroundAttachment?: ?string,
  backgroundBlendMode?: ?string,
  backgroundClip?: ?string,
  backgroundColor?: ?ColorValue,
  backgroundImage?: ?string,
  backgroundOrigin?: 'border-box' | 'content-box' | 'padding-box',
  backgroundPosition?: ?string,
  backgroundRepeat?: ?string,
  backgroundSize?: ?string,
  boxShadow?: ?string,
  clip?: ?string,
  filter?: ?string,
  opacity?: ?number,
  outlineColor?: ?ColorValue,
  outlineOffset?: ?NumberOrString,
  outlineStyle?: ?string,
  outlineWidth?: ?NumberOrString,
  overscrollBehavior?: ?OverscrollBehaviorValue,
  overscrollBehaviorX?: ?OverscrollBehaviorValue,
  overscrollBehaviorY?: ?OverscrollBehaviorValue,
  scrollbarWidth?: 'auto' | 'none' | 'thin',
  scrollSnapAlign?: ?string,
  scrollSnapType?: ?string,
  WebkitMaskImage?: ?string,
  WebkitOverflowScrolling?: 'auto' | 'touch'
};

export type ViewProps = {
  ...$Diff<AccessibilityStyledProps, { classList: any }>,
  children?: ?any,
  dataSet?: { ... },
  direction?: 'auto' | 'ltr' | 'rtl',
  focusable?: ?boolean,
  href?: ?string,
  hrefAttrs?: ?{|
    download?: ?boolean,
    rel?: ?string,
    target?: 'blank' | 'self'
  |},
  nativeID?: ?string,
  style?: GenericStyleProp<ViewStyle>,
  testID?: ?string
};
