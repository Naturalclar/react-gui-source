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

export type ImageStyle = {
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
  filter?: ?string,
  imageRendering?: ?(
    | 'auto'
    | 'crisp-edges'
    | 'high-quality'
    | 'pixelated'
    | 'smooth'
  ),
  objectFit?: ?('cover' | 'contain' | 'scale-down' | 'fill' | 'none'),
  objectPosition?: ?string,
  opacity?: ?number,
  outlineColor?: ?ColorValue,
  outlineOffset?: ?NumberOrString,
  outlineStyle?: ?string,
  outlineWidth?: ?NumberOrString
};

type ImageLoadEvent = {
  naturalWidth: number,
  naturalHeight: number,
  width: number,
  height: number,
  currentSource: string
};
type ImageSourceObj = { uri: string, scale?: number };
type ImageSource = string | ImageSourceObj | Array<ImageSourceObj>;

export type ImageProps = {
  accessibilityDescribedBy?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityDescribedBy'
  >,
  accessibilityDetails?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityDetails'
  >,
  accessibilityHasPopup?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityHasPopup'
  >,
  accessibilityHidden?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityHidden'
  >,
  accessibilityLabel?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityLabel'
  >,
  accessibilityLabelledBy?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityLabelledBy'
  >,
  accessibilityOwns?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityOwns'
  >,
  accessibilityPressed?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityPressed'
  >,
  accessibilityRole?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityRole'
  >,
  accessibilityRoleDescription?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilityRoleDescription'
  >,
  accessibilitySelected?: $PropertyType<
    AccessibilityStyledProps,
    'accessibilitySelected'
  >,
  alternativeText?: ?string,
  crossOrigin?: 'anonymous' | 'use-credentials',
  dataSet?: { ... },
  decoding?: 'auto' | 'async' | 'sync',
  draggable?: ?boolean,
  focusable?: ?boolean,
  loading?: 'eager' | 'lazy',
  nativeID?: ?string,
  onError?: () => void,
  onLoad?: (e: ImageLoadEvent) => void,
  referrerPolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'unsafe-url',
  source?: ?ImageSource,
  style?: GenericStyleProp<ImageStyle>,
  testID?: ?string
};
