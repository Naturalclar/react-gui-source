/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import supportsDOM from './supportsDOM';

// TODO: https://github.com/microsoft/fluentui/pull/8290/files
// TODO: https://stackoverflow.com/questions/25420219/find-focused-element-in-document-with-many-iframes
/**
 * Get the currently focused element
 */
export default function activeElement(): ?HTMLElement {
  return supportsDOM() ? document.activeElement : null;
}
