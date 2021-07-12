/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export type ColorValue = null | string;

export type DimensionValue = null | number | string;

export type EdgeInsetsValue = {|
  top: number,
  left: number,
  right: number,
  bottom: number
|};

export type GenericStyleProp<+T> =
  | null
  | void
  | T
  | false
  | ''
  | $ReadOnlyArray<GenericStyleProp<T>>;

export type ResizeEvent = {|
  blockSize: number,
  inlineSize: number
|};

export type PointValue = {|
  x: number,
  y: number
|};

export type CallbackRef = (node: HTMLElement | null) => mixed;
export type ObjectRef = { current: null | HTMLElement };
export type Ref = CallbackRef | ObjectRef;

export type TCallbackRef<T> = (T) => mixed;
export type TObjectRef<T> = { current: T, ... };
export type TRef<T> = TCallbackRef<T> | TObjectRef<T>;
