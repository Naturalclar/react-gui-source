/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, GenericStyleProp } from '../../__types__';
import type { ViewProps, ViewStyle } from '../view/types';

type FontWeightValue =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

type NumberOrString = number | string;

export type TextStyle = {
  ...ViewStyle,
  color?: ?ColorValue,
  direction?: 'auto' | 'ltr' | 'rtl',
  fontFamily?: ?string,
  fontFeatureSettings?: ?string,
  fontSize?: ?NumberOrString,
  fontStyle?: 'italic' | 'normal',
  fontWeight?: ?FontWeightValue,
  fontVariant?: ?string,
  letterSpacing?: ?NumberOrString,
  lineClamp?: ?number,
  lineHeight?: ?NumberOrString,
  textAlign?:
    | 'center'
    | 'end'
    | 'inherit'
    | 'justify'
    | 'justify-all'
    | 'left'
    | 'right'
    | 'start',
  textDecorationColor?: ?ColorValue,
  textDecorationLine?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through',
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed',
  textIndent?: ?NumberOrString,
  textOverflow?: ?string,
  textRendering?:
    | 'auto'
    | 'geometricPrecision'
    | 'optimizeLegibility'
    | 'optimizeSpeed',
  textShadow?: ?string,
  textTransform?: 'capitalize' | 'lowercase' | 'none' | 'uppercase',
  unicodeBidi?:
    | 'normal'
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'plaintext',
  verticalAlign?: ?string,
  whiteSpace?: ?string,
  wordBreak?: 'normal' | 'break-all' | 'break-word' | 'keep-all',
  wordWrap?: ?string,
  /* @platform web */
  // polyfill as 'fontSmoothing'
  MozOsxFontSmoothing?: ?string,
  WebkitFontSmoothing?: ?string
};

type AllowedViewProps = $Diff<ViewProps, { hitSlop: any }>;

export type TextProps = {
  ...AllowedViewProps,
  lang?: ?string, // TODO: lang codes
  style?: GenericStyleProp<TextStyle>
};
