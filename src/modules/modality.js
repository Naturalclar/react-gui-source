/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { addEvent } from './addEvent';
import supportsDOM from './supportsDOM';
import supportsPointerEvent from './supportsPointerEvent';

export type Modality = 'keyboard' | 'mouse' | 'touch' | 'pen';

let activeModality = 'keyboard';
let modality = 'keyboard';
let previousModality;
let previousActiveModality;
let isEmulatingMouseEvents = false;
const listeners = new Set();

const KEYBOARD = 'keyboard';
const MOUSE = 'mouse';
const TOUCH = 'touch';

const BLUR = 'blur';
const CONTEXTMENU = 'contextmenu';
const FOCUS = 'focus';
const KEYDOWN = 'keydown';
const MOUSEDOWN = 'mousedown';
const MOUSEMOVE = 'mousemove';
const MOUSEOVER = 'mouseover';
const MOUSEUP = 'mouseup';
const POINTERDOWN = 'pointerdown';
const POINTERMOVE = 'pointermove';
const POINTEROVER = 'pointerover';
const SCROLL = 'scroll';
const SELECTIONCHANGE = 'selectionchange';
const TOUCHCANCEL = 'touchcancel';
const TOUCHMOVE = 'touchmove';
const TOUCHSTART = 'touchstart';
const VISIBILITYCHANGE = 'visibilitychange';

const captureOptions = { capture: true, passive: true };

function restoreModality() {
  if (previousModality != null || previousActiveModality != null) {
    if (previousModality != null) {
      modality = previousModality;
      previousModality = null;
    }
    if (previousActiveModality != null) {
      activeModality = previousActiveModality;
      previousActiveModality = null;
    }
    callListeners();
  }
}

function onBlurWindow() {
  previousModality = modality;
  previousActiveModality = activeModality;
  activeModality = KEYBOARD;
  modality = KEYBOARD;
  callListeners();
  // for fallback events
  isEmulatingMouseEvents = false;
}

function onFocusWindow() {
  restoreModality();
}

function onKeyDown(event) {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }
  if (modality !== KEYBOARD) {
    modality = KEYBOARD;
    activeModality = KEYBOARD;
    callListeners();
  }
}

function onVisibilityChange() {
  if (document.visibilityState !== 'hidden') {
    restoreModality();
  }
}

function onPointerish(event: any) {
  const eventType = event.type;

  if (supportsPointerEvent()) {
    if (eventType === POINTERDOWN) {
      if (activeModality !== event.pointerType) {
        modality = event.pointerType;
        activeModality = event.pointerType;
        callListeners();
      }
      return;
    }
    if (eventType === POINTERMOVE || eventType === POINTEROVER) {
      if (modality !== event.pointerType) {
        modality = event.pointerType;
        callListeners();
      }
      return;
    }
  }
  // Fallback for non-PointerEvent environment
  else {
    if (!isEmulatingMouseEvents) {
      if (eventType === MOUSEDOWN) {
        if (activeModality !== MOUSE) {
          modality = MOUSE;
          activeModality = MOUSE;
          callListeners();
        }
      }
      if (eventType === MOUSEMOVE || eventType === MOUSEOVER) {
        if (modality !== MOUSE) {
          modality = MOUSE;
          callListeners();
        }
      }
    }

    // Flag when browser may produce emulated events
    if (eventType === TOUCHSTART) {
      isEmulatingMouseEvents = true;
      if (event.touches && event.touches.length > 1) {
        isEmulatingMouseEvents = false;
      }
      if (activeModality !== TOUCH) {
        modality = TOUCH;
        activeModality = TOUCH;
        callListeners();
      }
      return;
    }

    // Remove flag after emulated events are finished or cancelled, and if an
    // event occurs that cuts short a touch event sequence.
    if (
      eventType === CONTEXTMENU ||
      eventType === MOUSEUP ||
      eventType === SELECTIONCHANGE ||
      eventType === SCROLL ||
      eventType === TOUCHCANCEL ||
      eventType === TOUCHMOVE
    ) {
      isEmulatingMouseEvents = false;
    }
  }
}

if (supportsDOM()) {
  addEvent(window, BLUR, onBlurWindow);
  addEvent(window, FOCUS, onFocusWindow);
  // Must be capture phase because 'stopPropagation' might prevent these
  // events bubbling to the document.
  addEvent(document, KEYDOWN, onKeyDown, captureOptions);
  addEvent(document, VISIBILITYCHANGE, onVisibilityChange, captureOptions);
  [
    POINTERDOWN,
    POINTERMOVE,
    POINTEROVER,
    // Fallbacks
    CONTEXTMENU,
    MOUSEDOWN,
    MOUSEMOVE,
    MOUSEOVER,
    MOUSEUP,
    SCROLL,
    SELECTIONCHANGE,
    TOUCHCANCEL,
    TOUCHMOVE,
    TOUCHSTART
  ].forEach((eventType) => {
    addEvent(document, eventType, onPointerish, captureOptions);
  });
}

function callListeners() {
  const value = { activeModality, modality };
  listeners.forEach((listener) => {
    listener(value);
  });
}

export function getActiveModality(): Modality {
  return activeModality;
}

export function getModality(): Modality {
  return modality;
}

export function addModalityListener(
  listener: ({ activeModality: Modality, modality: Modality }) => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function testOnly_resetActiveModality(): void {
  isEmulatingMouseEvents = false;
  activeModality = KEYBOARD;
  modality = KEYBOARD;
}
