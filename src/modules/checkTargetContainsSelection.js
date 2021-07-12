/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export default function checkTargetContainsSelection(
  target?: HTMLElement
): boolean {
  const node = target == null ? document : target;
  if (window.getSelection != null) {
    const selection = window.getSelection();
    const string = selection.toString();
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    const isTextNode =
      (anchorNode && anchorNode.nodeType === window.Node.TEXT_NODE) ||
      (focusNode && focusNode.nodeType === window.Node.TEXT_NODE);
    const targetContainsSelection =
      node.contains(anchorNode) && node.contains(focusNode);
    return (
      string.length >= 1 &&
      string !== '\n' &&
      isTextNode &&
      targetContainsSelection
    );
  } else {
    return false;
  }
}
