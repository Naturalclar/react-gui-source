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
import type { GenericStyleProp } from '../../__types__';

export type TextInputProps = {
  ...$Diff<AccessibilityStyledProps, { classList: any }>,
  autoCapitalize?: ?string,
  autoComplete?: ?string,
  autoCorrect?: 'on' | 'off',
  dataSet?: { ... },
  defaultValue?: ?string,
  direction?: 'auto' | 'ltr' | 'rtl',
  disabled?: ?boolean,
  enterKeyHint?:
    | 'done'
    | 'enter'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send',
  inputMode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url',
  lang?: ?string,
  maxLength?: ?number,
  nativeID?: ?string,
  placeholder?: ?string,
  readOnly?: ?boolean,
  required?: ?boolean,
  secureTextEntry?: ?boolean,
  spellCheck?: ?boolean,
  style?: GenericStyleProp<any>,
  testID?: ?string,
  value?: ?string
};
