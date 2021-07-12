/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { TextInputProps } from './types';

import * as React from 'react';
import {
  createElement,
  createStyleRules,
  filterProps
} from '../create-element';
import { SYSTEM_FONT_STACK } from '../style-sheet/constants';

const emptyFunction = () => {};

export const TextInput: React.AbstractComponent<
  TextInputProps,
  HTMLElement
> = React.forwardRef((props, ref) => {
  const {
    autoCapitalize = 'sentences',
    autoComplete,
    autoCorrect = 'off',
    defaultValue,
    direction = 'auto',
    disabled,
    enterKeyHint,
    inputMode,
    lang,
    maxLength,
    placeholder,
    readOnly,
    required,
    secureTextEntry,
    spellCheck,
    value
  } = props;

  // Construct the props
  const elementProps = filterProps(props);
  elementProps.autoCapitalize = autoCapitalize;
  elementProps.autoComplete = autoComplete;
  elementProps.autoCorrect = autoCorrect;
  elementProps.classList = defaultClassList;
  elementProps.defaultValue = defaultValue;
  elementProps.dir = direction;
  elementProps.disabled = disabled;
  elementProps.enterKeyHint = enterKeyHint;
  elementProps.inputMode = inputMode;
  elementProps.lang = lang;
  elementProps.maxLength = maxLength;
  elementProps.placeholder = placeholder;
  elementProps.readOnly = readOnly;
  elementProps.ref = ref;
  elementProps.required = required;
  elementProps.spellCheck = spellCheck;
  elementProps.type = secureTextEntry
    ? 'password'
    : inputMode === 'email'
    ? 'email'
    : 'text';
  elementProps.value = value;
  // Suppress React DOM warning when 'value' is set without 'onChange'
  elementProps.onChange = emptyFunction;

  // Construct the element
  const element = createElement('input', elementProps);

  return element;
});

TextInput.displayName = 'TextInput';

const classes = createStyleRules({
  textinput: {
    backgroundColor: 'transparent',
    border: '0 solid black',
    borderRadius: 0,
    boxSizing: 'border-box',
    font: `14px ${SYSTEM_FONT_STACK}`,
    margin: 0,
    padding: 0,
    resize: 'none'
  }
});

const defaultClassList = [classes.textinput];

export type { TextInputProps };
