/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { TextAreaProps } from './types';

import * as React from 'react';
import { createElement, createStyleRules } from '../create-element';
import { SYSTEM_FONT_STACK } from '../style-sheet/constants';

const emptyFunction = () => {};

export const TextArea: React.AbstractComponent<
  TextAreaProps,
  HTMLElement
> = React.forwardRef((props, ref) => {
  const {
    accessibilityControls,
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityKeyShortcuts,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityRole,
    accessibilityRoleDescription,
    autoCapitalize = 'sentences',
    autoComplete,
    autoCorrect = 'off',
    dataSet,
    defaultValue,
    direction = 'auto',
    disabled,
    enterKeyHint,
    inputMode,
    lang,
    maxLength,
    nativeID,
    placeholder,
    readOnly,
    required,
    spellCheck,
    style,
    testID,
    value
  } = props;

  // Construct the element
  const element = createElement('textarea', {
    accessibilityControls,
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityKeyShortcuts,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityRole,
    accessibilityRoleDescription,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    classList: defaultClassList,
    dataSet,
    defaultValue,
    dir: direction,
    disabled,
    enterKeyHint,
    inputMode,
    lang,
    maxLength,
    nativeID,
    placeholder,
    readOnly,
    ref,
    required,
    spellCheck,
    style,
    testID,
    value,
    // Suppress React DOM warning when 'value' is set without 'onChange'
    onChange: emptyFunction
  });

  return element;
});

TextArea.displayName = 'TextArea';

const classes = createStyleRules({
  textarea: {
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

const defaultClassList = [classes.textarea];

export type { TextAreaProps };
