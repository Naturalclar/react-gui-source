/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Copyright (c) 2018 Juan Valencia (https://github.com/calvellido/focus-options-polyfill/blob/master/LICENSE)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import supportsFocusOptions from './supportsFocusOptions';

const canUseFocusOptions = supportsFocusOptions();

type FocusOptions = {| preventScroll?: boolean |};
type ScrollPositions = Array<[Element, number, number]>;

/**
 * Record the current scroll positions of all scrollable ancestors
 * of the element.
 */
function getScrollPositions(node: HTMLElement): ScrollPositions {
  const scrollablePositions = [];
  const rootScrollable = document.documentElement;
  let parentNode = node.parentElement;

  while (parentNode != null && parentNode !== rootScrollable) {
    if (
      // $FlowFixMe: flow is wrong
      parentNode.offsetHeight < parentNode.scrollHeight ||
      // $FlowFixMe: flow is wrong
      parentNode.offsetWidth < parentNode.scrollWidth
    ) {
      scrollablePositions.push([
        parentNode,
        parentNode.scrollTop,
        parentNode.scrollLeft
      ]);
    }
    parentNode = parentNode.parentElement;
  }

  if (rootScrollable != null) {
    scrollablePositions.push([
      rootScrollable,
      rootScrollable.scrollTop,
      rootScrollable.scrollLeft
    ]);
  }

  return scrollablePositions;
}

/**
 * Restore the scroll positions of each element in the records.
 */
function restoreScrollPositions(scrollPositions: ScrollPositions): void {
  for (let i = 0; i < scrollPositions.length; i++) {
    const scrollRecord = scrollPositions[i];
    const [node, scrollTop, scrollLeft] = scrollRecord;
    node.scrollTop = scrollTop;
    node.scrollLeft = scrollLeft;
  }
}

/**
 * A "polyfill" for element.focus({preventScroll: true});
 * https://caniuse.com/#feat=mdn-api_htmlelement_focus_preventscroll_option
 */
export default function focusWithOptions(
  node: HTMLElement,
  options?: FocusOptions
) {
  if (canUseFocusOptions) {
    node.focus(options);
  } else {
    let scrollPositions;
    if (options != null && options.preventScroll === true) {
      scrollPositions = getScrollPositions(node);
    }
    node.focus();
    if (scrollPositions != null) {
      restoreScrollPositions(scrollPositions);
    }
  }
}
