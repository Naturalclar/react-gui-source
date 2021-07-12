/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ViewProps } from './types';

import * as React from 'react';
import {
  createElement,
  createStyleRules,
  filterProps
} from '../create-element';
import getAccessibilityElementWithSideEffect from '#internal/getAccessibilityElementWithSideEffect';
import TextAncestorContext from '../text/TextAncestorContext';

export const View: React.AbstractComponent<
  ViewProps,
  HTMLElement
> = React.forwardRef((props, ref) => {
  const { children, direction, href, hrefAttrs } = props;

  // TODO: replace with DOM APIs to pierce React component boundaries
  // istanbul ignore next
  if (process.env.NODE_ENV !== 'production') {
    React.Children.toArray(children).forEach((item) => {
      if (typeof item === 'string') {
        console.error(
          `Unexpected text node: ${item}. A text node cannot be a child of a <View>.`
        );
      }
    });
  }

  const hasTextAncestor = React.useContext(TextAncestorContext);

  // Construct the props
  const elementProps = filterProps(props);
  elementProps.children = children;
  elementProps.classList = hasTextAncestor ? inlineClassList : defaultClassList;
  elementProps.dir = direction;
  elementProps.ref = ref;
  if (href) {
    elementProps.href = href;
    if (hrefAttrs != null) {
      const { download, rel, target } = hrefAttrs;
      if (download != null) {
        elementProps.download = download;
      }
      if (rel != null) {
        elementProps.rel = rel;
      }
      if (typeof target === 'string') {
        elementProps.target = target.charAt(0) !== '_' ? '_' + target : target;
      }
    }
  }

  // Construct the element
  const accessibilityElementType = getAccessibilityElementWithSideEffect(
    elementProps
  );
  const elementType = accessibilityElementType || 'div';
  const element = createElement(elementType, elementProps);

  // Reset the context for views nested within text
  return hasTextAncestor ? (
    <TextAncestorContext.Provider value={false}>
      {element}
    </TextAncestorContext.Provider>
  ) : (
    element
  );
});

View.displayName = 'View';

const classes = createStyleRules({
  view: {
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: 'relative',
    textDecoration: 'none',
    zIndex: 0
  },
  inlineView: {
    display: 'inline-flex'
  }
});

const defaultClassList = [classes.view];
const inlineClassList = [classes.view, classes.inlineView];

export type { ViewProps };
