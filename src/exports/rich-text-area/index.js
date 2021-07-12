/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { RichTextAreaProps } from './types';

import * as React from 'react';
import { createElement, createStyleRules } from '../create-element';
import { SYSTEM_FONT_STACK } from '../style-sheet/constants';

export const RichTextArea: React.AbstractComponent<
  RichTextAreaProps,
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
    autoComplete,
    dataSet,
    defaultValue,
    direction = 'auto',
    disabled,
    enterKeyHint,
    inputMode,
    lang,
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
  const element = createElement('div', {
    accessibilityAutoComplete: autoComplete,
    accessibilityControls,
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityDisabled: disabled,
    accessibilityKeyShortcuts,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityMultiline: true,
    accessibilityPlaceholder: placeholder,
    accessibilityReadOnly: readOnly,
    accessibilityRequired: required,
    accessibilityRole,
    accessibilityRoleDescription,
    children: defaultValue || value,
    classList: defaultClassList,
    contentEditable: !disabled,
    dataSet,
    dir: direction,
    enterKeyHint,
    focusable: true,
    inputMode,
    lang,
    nativeID,
    ref,
    spellCheck,
    suppressContentEditableWarning: true,
    style,
    testID
  });

  return element;
});

RichTextArea.displayName = 'RichTextArea';

const classes = createStyleRules({
  richtextarea: {
    backgroundColor: 'transparent',
    border: '0 solid black',
    borderRadius: 0,
    boxSizing: 'border-box',
    font: `14px ${SYSTEM_FONT_STACK}`,
    margin: 0,
    minHeight: '2.75em',
    padding: 0
  }
});

const defaultClassList = [classes.richtextarea];

export type { RichTextAreaProps };
