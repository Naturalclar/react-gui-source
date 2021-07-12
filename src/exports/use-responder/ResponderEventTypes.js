/**
 * Copyright (c) Nicolas Gallagher
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export type Touch = {
  force: number,
  identifier: number,
  // The locationX and locationY properties are non-standard additions
  get locationX(): ?number,
  get locationY(): ?number,
  pageX: number,
  pageY: number,
  target: EventTarget,
  // Touches in a list have a timestamp property
  timeStamp: number
};

export type TouchEvent = {
  altKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean,
  shiftKey: boolean,
  // TouchList is an array in the Responder system
  changedTouches: Array<Touch>,
  force: number,
  // React Native adds properties to the "nativeEvent that are usually only found on W3C Touches ‾\_(ツ)_/‾
  identifier: number,
  get locationX(): ?number,
  get locationY(): ?number,
  pageX: number,
  pageY: number,
  target: EventTarget,
  timeStamp: number,
  // TouchList is an array in the Responder system
  touches: Array<Touch>
};

export const BLUR = 'blur';
export const CONTEXT_MENU = 'contextmenu';
export const FOCUS_OUT = 'focusout';
export const MOUSE_DOWN = 'mousedown';
export const MOUSE_MOVE = 'mousemove';
export const MOUSE_UP = 'mouseup';
export const MOUSE_CANCEL = 'dragstart';
export const TOUCH_START = 'touchstart';
export const TOUCH_MOVE = 'touchmove';
export const TOUCH_END = 'touchend';
export const TOUCH_CANCEL = 'touchcancel';
export const SCROLL = 'scroll';
export const SELECT = 'select';

export function isStartish(eventType: string): boolean {
  return eventType === TOUCH_START || eventType === MOUSE_DOWN;
}

export function isMoveish(eventType: string): boolean {
  return eventType === TOUCH_MOVE || eventType === MOUSE_MOVE;
}

export function isEndish(eventType: string): boolean {
  return (
    eventType === TOUCH_END || eventType === MOUSE_UP || isCancelish(eventType)
  );
}

export function isCancelish(eventType: string): boolean {
  return eventType === TOUCH_CANCEL || eventType === MOUSE_CANCEL;
}

export function isScroll(eventType: string): boolean {
  return eventType === SCROLL;
}

export function isSelect(eventType: string): boolean {
  return eventType === SELECT;
}
