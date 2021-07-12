/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ImageProps } from './types';

import * as React from 'react';
import { addEvent, removeEvent } from '#internal/addEvent';
import { createElement, createStyleRules } from '../create-element';
import { useMergeRefs } from '../use-merge-refs';
import TextAncestorContext from '../text/TextAncestorContext';

const ERROR_PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

const errorEventType = 'error';
const loadEventType = 'load';

function getImageData(image: HTMLImageElement) {
  const { naturalWidth, naturalHeight, width, height, currentSrc, src } = image;

  return {
    naturalWidth,
    naturalHeight,
    width,
    height,
    currentSource: currentSrc != null ? currentSrc : src
  };
}

export const Image: React.AbstractComponent<
  ImageProps,
  HTMLElement
> = React.forwardRef((props, forwardedRef) => {
  const {
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityHasPopup,
    accessibilityHidden,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityOwns,
    accessibilityPressed,
    accessibilityRole,
    accessibilityRoleDescription,
    accessibilitySelected,
    alternativeText,
    crossOrigin,
    dataSet,
    decoding = 'auto',
    draggable = false,
    focusable,
    loading,
    nativeID,
    onError,
    onLoad,
    referrerPolicy,
    source,
    style,
    testID
  } = props;

  const attachedNode = React.useRef(null);
  const hasTextAncestor = React.useContext(TextAncestorContext);

  const internalImageRef = React.useCallback(
    (target) => {
      const errorListener = function () {
        // If the image fails to load, browsers will display a "broken" icon.
        // To avoid this we replace the image with a transparent gif.
        setManagedSrc(ERROR_PLACEHOLDER);
        if (onError != null) {
          onError();
        }
      };

      const loadListener = function (e) {
        const { target: image } = e;
        if (image.src === ERROR_PLACEHOLDER) {
          // Prevent the placeholder from triggering a 'load' event that event
          // listeners would otherwise receive.
          e.stopImmediatePropagation();
        } else if (onLoad != null) {
          onLoad(getImageData(image));
        }
      };

      if (target !== null) {
        attachedNode.current = target;
        addEvent(target, errorEventType, errorListener);
        addEvent(target, loadEventType, loadListener);
        // If the image is loaded before JS loads (e.g., SSR), then we manually
        // call onLoad
        if (onLoad != null && target.complete) {
          onLoad(getImageData(target));
        }
      } else if (attachedNode.current != null) {
        const node = attachedNode.current;
        removeEvent(node, errorEventType, errorListener);
        removeEvent(node, loadEventType, loadListener);
        attachedNode.current = null;
      }
    },
    [onError, onLoad]
  );

  const ref = useMergeRefs<HTMLImageElement | null>(
    internalImageRef,
    forwardedRef
  );

  let src;
  let srcSet;
  if (typeof source === 'string') {
    src = source;
  } else if (Array.isArray(source)) {
    src = source[0].uri;
    srcSet = source.map(({ uri, scale }) => `${uri} ${scale || 1}x`);
  } else if (source != null && source.uri) {
    src = source.uri;
  }

  const [managedSrc, setManagedSrc] = React.useState(src);

  // Construct the element
  const element = createElement('img', {
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityHasPopup,
    accessibilityHidden,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityOwns,
    accessibilityPressed,
    accessibilityRole,
    accessibilityRoleDescription,
    accessibilitySelected,
    alt: alternativeText,
    classList: hasTextAncestor ? inlineClassList : defaultClassList,
    crossOrigin,
    dataSet,
    decoding,
    draggable,
    focusable,
    loading,
    nativeID,
    ref,
    referrerPolicy,
    src: managedSrc,
    srcSet:
      srcSet != null && managedSrc !== ERROR_PLACEHOLDER
        ? srcSet.join(',')
        : null,
    style,
    testID
  });

  return element;
});

Image.displayName = 'Image';

const classes = createStyleRules({
  image: {
    backgroundColor: 'transparent',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    objectFit: 'cover',
    padding: 0,
    position: 'relative',
    zIndex: 0
  },
  inlineImage: {
    display: 'inline-flex'
  }
});

const defaultClassList = [classes.image];
const inlineClassList = [classes.image, classes.inlineImage];

export type { ImageProps };
