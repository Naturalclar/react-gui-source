/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

const emptyObject = {};

type EventInit = {
  bubbles?: boolean,
  cancelable?: boolean,
  detail?: { [key: string]: mixed }
};

export default function dispatchCustomEvent(
  target: EventTarget,
  type: string,
  payload?: EventInit
) {
  const event = document.createEvent('CustomEvent');
  const { bubbles = true, cancelable = true, detail } = payload || emptyObject;
  event.initCustomEvent(type, bubbles, cancelable, detail);
  target.dispatchEvent(event);
}
