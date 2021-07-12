/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import supportsPassiveEvents from './supportsPassiveEvents';

export type EventOptions = {
  capture?: boolean,
  passive?: boolean
};

export type Listener = (e: any) => void;

const canUsePassiveEvents = supportsPassiveEvents();
const emptyFunction = () => {};
const passiveByDefault = {
  touchstart: true,
  touchmove: true,
  scroll: true
};

/**
 * Normalize event options and default performance-sensitive events to passive.
 */
function getOptions(
  type: string,
  options: ?EventOptions
): EventOptions | boolean {
  if (options != null) {
    const { capture, passive } = options;
    if (canUsePassiveEvents) {
      return passive == null || passiveByDefault[type] === true
        ? { capture, passive: true }
        : options;
    } else {
      return Boolean(capture);
    }
  }
  return false;
}

/**
 * Add the event listener using options normalization, SyntheticEvent
 * compatibility, and returning a function to remove the event listener.
 */
export function addEvent(
  target: EventTarget,
  type: string,
  listener: ?Listener,
  options: ?EventOptions
): () => void {
  const opts = getOptions(type, options);
  if (typeof listener === 'function') {
    const element = (target: any);
    element.addEventListener(type, listener, opts);
    return function removeListener() {
      if (element != null) {
        element.removeEventListener(type, listener, opts);
      }
    };
  } else {
    return emptyFunction;
  }
}

export function removeEvent(
  target: EventTarget,
  type: string,
  listener: ?Listener,
  options: ?EventOptions
): void {
  const opts = getOptions(type, options);
  if (typeof listener === 'function') {
    const element = (target: any);
    element.removeEventListener(type, listener, opts);
  }
}
