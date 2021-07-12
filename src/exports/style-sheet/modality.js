/**
 * Adapts focus styles based on the user's active input modality (i.e., how
 * they are interacting with the UI right now).
 *
 * Focus styles are only relevant when using the keyboard to interact with the
 * page. If we only show the focus ring when relevant, we can avoid user
 * confusion without compromising accessibility.
 *
 * The script uses two heuristics to determine whether the keyboard is being used:
 *
 * 1. a keydown event occurred immediately before a focus event;
 * 2. a focus event happened on an element which requires keyboard interaction (e.g., a text field);
 *
 * This software or document includes material copied from or derived from https://github.com/WICG/focus-visible.
 * Copyright © 2018 W3C® (MIT, ERCIM, Keio, Beihang).
 * W3C Software Notice and License: https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @noflow
 */

import { addModalityListener, getModality } from '#internal/modality';
import supportsDOM from '#internal/supportsDOM';

const focusVisibleAttributeName = 'data-focusvisible-polyfill';

const rule = `:focus:not([${focusVisibleAttributeName}]){outline: none;}`;

const modality = (insertRule) => {
  insertRule(rule);

  if (!supportsDOM()) {
    return;
  }

  const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    'datetime-local': true
  };

  /**
   * Helper function for legacy browsers and iframes which sometimes focus
   * elements like document, body, and non-interactive SVG.
   */
  function isValidFocusTarget(el) {
    if (
      el &&
      el !== document &&
      el.nodeName !== 'HTML' &&
      el.nodeName !== 'BODY' &&
      'classList' in el &&
      'contains' in el.classList
    ) {
      return true;
    }
    return false;
  }

  /**
   * Computes whether the given element should automatically trigger the
   * `focus-visible` attribute being added, i.e. whether it should always match
   * `:focus-visible` when focused.
   */
  function focusTriggersKeyboardModality(el) {
    const type = el.type;
    const tagName = el.tagName;
    const isReadOnly = el.readOnly;
    if (tagName === 'INPUT' && inputTypesWhitelist[type] && !isReadOnly) {
      return true;
    }
    if (tagName === 'TEXTAREA' && !isReadOnly) {
      return true;
    }
    if (el.isContentEditable) {
      return true;
    }
    return false;
  }

  /**
   * Add the `focus-visible` attribute to the given element if it was not added by
   * the author.
   */
  function addFocusVisibleAttribute(el) {
    if (el.hasAttribute(focusVisibleAttributeName)) {
      return;
    }
    el.setAttribute(focusVisibleAttributeName, true);
  }

  /**
   * Remove the `focus-visible` attribute from the given element.
   */
  function removeFocusVisibleAttribute(el) {
    el.removeAttribute(focusVisibleAttributeName);
  }

  /**
   * Remove the `focus-visible` attribute from all elements in the document.
   */
  function removeAllFocusVisibleAttributes() {
    const list = document.querySelectorAll(`[${focusVisibleAttributeName}]`);
    for (let i = 0; i < list.length; i += 1) {
      removeFocusVisibleAttribute(list[i]);
    }
  }

  /**
   * On `focus`, add the `focus-visible` attribute to the target if:
   */
  function onFocus(e) {
    const { target } = e;
    if (!isValidFocusTarget(target)) {
      return;
    }
    if (getModality() === 'keyboard' || focusTriggersKeyboardModality(target)) {
      addFocusVisibleAttribute(target);
    }
  }

  /**
   * On `blur`, remove the `focus-visible` attribute from the target.
   */
  function onBlur(e) {
    const { target } = e;
    if (!isValidFocusTarget(target)) {
      return;
    }
    if (target.hasAttribute(focusVisibleAttributeName)) {
      removeFocusVisibleAttribute(target);
    }
  }

  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
  addModalityListener(({ activeModality }) => {
    if (activeModality === 'keyboard') {
      if (isValidFocusTarget(document.activeElement)) {
        addFocusVisibleAttribute(document.activeElement);
      }
    } else {
      removeAllFocusVisibleAttributes();
    }
  });
};

export default modality;
