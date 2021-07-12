/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { AccessibilityProps } from '../../__types__/Accessibility';
import type { ElementType } from 'react';

import { omit, pick } from '#internal/filterObjectProperties';
import hyphenateString from '#internal/hyphenateString';
import { StyleSheet } from '../style-sheet';

export type AccessibilityStyledProps = {|
  ...AccessibilityProps,
  classList?: ?Array<string>,
  style?: any,
  testID?: ?string
|};

type Props = Object;

const hasOwnProperty = Object.prototype.hasOwnProperty;
const isArray = Array.isArray;

const passList = {
  accessibilityActiveDescendant: true,
  accessibilityAtomic: true,
  accessibilityAutoComplete: true,
  accessibilityBusy: true,
  accessibilityChecked: true,
  accessibilityColumnCount: true,
  accessibilityColumnIndex: true,
  accessibilityColumnSpan: true,
  accessibilityControls: true,
  accessibilityCurrent: true,
  accessibilityDescribedBy: true,
  accessibilityDetails: true,
  accessibilityDisabled: true,
  accessibilityErrorMessage: true,
  accessibilityExpanded: true,
  accessibilityFlowTo: true,
  accessibilityHasPopup: true,
  accessibilityHidden: true,
  accessibilityInvalid: true,
  accessibilityKeyShortcuts: true,
  accessibilityLabel: true,
  accessibilityLabelledBy: true,
  accessibilityLevel: true,
  accessibilityLiveRegion: true,
  accessibilityModal: true,
  accessibilityMultiline: true,
  accessibilityMultiSelectable: true,
  accessibilityOrientation: true,
  accessibilityOwns: true,
  accessibilityPlaceholder: true,
  accessibilityPosInSet: true,
  accessibilityPressed: true,
  accessibilityReadOnly: true,
  accessibilityRequired: true,
  accessibilityRole: true,
  accessibilityRoleDescription: true,
  accessibilityRowCount: true,
  accessibilityRowIndex: true,
  accessibilityRowSpan: true,
  accessibilitySelected: true,
  accessibilitySetSize: true,
  accessibilitySort: true,
  accessibilityValueMax: true,
  accessibilityValueMin: true,
  accessibilityValueNow: true,
  accessibilityValueText: true,
  focusable: true,
  dataSet: true,
  nativeID: true,
  style: true,
  testID: true
};

export function filterProps(props: Props): Props {
  return pick(props, passList);
}

function excludeProps(props: Props): Props {
  return omit(props, passList);
}

function flattenIDRefList(idRefList: string | Array<string>): string {
  if (typeof idRefList === 'string') {
    return idRefList;
  }
  return idRefList.join(' ');
}

export default function createAccessibilityStyledProps(
  elementType: ElementType,
  props: ?Props
): Object {
  if (props == null) {
    return {};
  }

  const {
    accessibilityActiveDescendant,
    accessibilityAtomic,
    accessibilityAutoComplete,
    accessibilityBusy,
    accessibilityChecked,
    accessibilityColumnCount,
    accessibilityColumnIndex,
    accessibilityColumnSpan,
    accessibilityControls,
    accessibilityCurrent,
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityDisabled,
    accessibilityErrorMessage,
    accessibilityExpanded,
    accessibilityFlowTo,
    accessibilityHasPopup,
    accessibilityHidden,
    accessibilityInvalid,
    accessibilityKeyShortcuts,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityLevel,
    accessibilityLiveRegion,
    accessibilityModal,
    accessibilityMultiline,
    accessibilityMultiSelectable,
    accessibilityOrientation,
    accessibilityOwns,
    accessibilityPlaceholder,
    accessibilityPosInSet,
    accessibilityPressed,
    accessibilityReadOnly,
    accessibilityRequired,
    accessibilityRole,
    accessibilityRoleDescription,
    accessibilityRowCount,
    accessibilityRowIndex,
    accessibilityRowSpan,
    accessibilitySelected,
    accessibilitySetSize,
    accessibilitySort,
    accessibilityValueMax,
    accessibilityValueMin,
    accessibilityValueNow,
    accessibilityValueText,
    classList,
    focusable,
    dataSet,
    nativeID,
    style,
    testID
  } = props;

  const forwardedProps: any = excludeProps(props);
  delete forwardedProps.classList;

  if (accessibilityActiveDescendant != null) {
    forwardedProps['aria-activedescendant'] = accessibilityActiveDescendant;
  }
  if (accessibilityAtomic != null) {
    forwardedProps['aria-atomic'] = accessibilityAtomic;
  }
  if (accessibilityAutoComplete != null) {
    forwardedProps['aria-autocomplete'] = accessibilityAutoComplete;
  }
  if (accessibilityBusy != null) {
    forwardedProps['aria-busy'] = accessibilityBusy;
  }
  if (accessibilityChecked != null) {
    forwardedProps['aria-checked'] = accessibilityChecked;
  }
  if (accessibilityColumnCount != null) {
    forwardedProps['aria-colcount'] = accessibilityColumnCount;
  }
  if (accessibilityColumnIndex != null) {
    forwardedProps['aria-colindex'] = accessibilityColumnIndex;
  }
  if (accessibilityColumnSpan != null) {
    forwardedProps['aria-colspan'] = accessibilityColumnSpan;
  }
  if (accessibilityControls != null) {
    forwardedProps['aria-controls'] = flattenIDRefList(accessibilityControls);
  }
  if (accessibilityCurrent != null) {
    forwardedProps['aria-current'] = accessibilityCurrent;
  }
  if (accessibilityDescribedBy != null) {
    forwardedProps['aria-describedby'] = flattenIDRefList(
      accessibilityDescribedBy
    );
  }
  if (accessibilityDetails != null) {
    forwardedProps['aria-details'] = accessibilityDetails;
  }
  if (accessibilityDisabled === true) {
    forwardedProps['aria-disabled'] = true;
    // Enhance with native semantics
    if (
      elementType === 'button' ||
      elementType === 'form' ||
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      forwardedProps.disabled = true;
    }
  }
  if (accessibilityErrorMessage != null) {
    forwardedProps['aria-errormessage'] = accessibilityErrorMessage;
  }
  if (accessibilityExpanded != null) {
    forwardedProps['aria-expanded'] = accessibilityExpanded;
  }
  if (accessibilityFlowTo != null) {
    forwardedProps['aria-flowto'] = flattenIDRefList(accessibilityFlowTo);
  }
  if (accessibilityHasPopup != null) {
    forwardedProps['aria-haspopup'] = accessibilityHasPopup;
  }
  if (accessibilityHidden === true) {
    forwardedProps['aria-hidden'] = accessibilityHidden;
  }
  if (accessibilityInvalid != null) {
    forwardedProps['aria-invalid'] = accessibilityInvalid;
  }
  if (accessibilityKeyShortcuts != null && isArray(accessibilityKeyShortcuts)) {
    forwardedProps['aria-keyshortcuts'] = accessibilityKeyShortcuts.join(' ');
  }
  if (accessibilityLabel != null) {
    forwardedProps['aria-label'] = accessibilityLabel;
  }
  if (accessibilityLabelledBy != null) {
    forwardedProps['aria-labelledby'] = flattenIDRefList(
      accessibilityLabelledBy
    );
  }
  if (accessibilityLevel != null) {
    forwardedProps['aria-level'] = accessibilityLevel;
  }
  if (accessibilityLiveRegion != null) {
    forwardedProps['aria-live'] = accessibilityLiveRegion;
  }
  if (accessibilityModal != null) {
    forwardedProps['aria-modal'] = accessibilityModal;
  }
  if (accessibilityMultiline != null) {
    forwardedProps['aria-multiline'] = accessibilityMultiline;
  }
  if (accessibilityMultiSelectable != null) {
    forwardedProps['aria-multiselectable'] = accessibilityMultiSelectable;
  }
  if (accessibilityOrientation != null) {
    forwardedProps['aria-orientation'] = accessibilityOrientation;
  }
  if (accessibilityOwns != null) {
    forwardedProps['aria-owns'] = flattenIDRefList(accessibilityOwns);
  }
  if (accessibilityPlaceholder != null) {
    forwardedProps['aria-placeholder'] = accessibilityPlaceholder;
  }
  if (accessibilityPosInSet != null) {
    forwardedProps['aria-posinset'] = accessibilityPosInSet;
  }
  if (accessibilityPressed != null) {
    forwardedProps['aria-pressed'] = accessibilityPressed;
  }
  if (accessibilityReadOnly != null) {
    forwardedProps['aria-readonly'] = accessibilityReadOnly;
    // Enhance with native semantics
    if (
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      forwardedProps.readOnly = true;
    }
  }
  if (accessibilityRequired != null) {
    forwardedProps['aria-required'] = accessibilityRequired;
    // Enhance with native semantics
    if (
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      forwardedProps.required = true;
    }
  }
  if (accessibilityRole != null) {
    // 'presentation' synonym has wider browser support
    const role =
      accessibilityRole === 'none' ? 'presentation' : accessibilityRole;
    forwardedProps['role'] = role;
  }
  if (accessibilityRoleDescription != null) {
    forwardedProps['aria-roledescription'] = accessibilityRoleDescription;
  }
  if (accessibilityRowCount != null) {
    forwardedProps['aria-rowcount'] = accessibilityRowCount;
  }
  if (accessibilityRowIndex != null) {
    forwardedProps['aria-rowindex'] = accessibilityRowIndex;
  }
  if (accessibilityRowSpan != null) {
    forwardedProps['aria-rowspan'] = accessibilityRowSpan;
  }
  if (accessibilitySelected != null) {
    forwardedProps['aria-selected'] = accessibilitySelected;
  }
  if (accessibilitySetSize != null) {
    forwardedProps['aria-setsize'] = accessibilitySetSize;
  }
  if (accessibilitySort != null) {
    forwardedProps['aria-sort'] = accessibilitySort;
  }
  if (accessibilityValueMax != null) {
    forwardedProps['aria-valuemax'] = accessibilityValueMax;
  }
  if (accessibilityValueMin != null) {
    forwardedProps['aria-valuemin'] = accessibilityValueMin;
  }
  if (accessibilityValueNow != null) {
    forwardedProps['aria-valuenow'] = accessibilityValueNow;
  }
  if (accessibilityValueText != null) {
    forwardedProps['aria-valuetext'] = accessibilityValueText;
  }

  // "dataSet" replaced with "data-*"
  if (dataSet != null) {
    for (const dataProp in dataSet) {
      if (hasOwnProperty.call(dataSet, dataProp)) {
        const dataName = hyphenateString(dataProp);
        const dataValue = dataSet[dataProp];
        if (dataValue != null) {
          forwardedProps[`data-${dataName}`] = dataValue;
        }
      }
    }
  }

  // "focusable" indicates that an element is a keyboard tab-stop.
  if (focusable != null) {
    forwardedProps.tabIndex = focusable ? '0' : '-1';
  }

  // "nativeID" replaced with "id"
  if (nativeID != null) {
    forwardedProps.id = nativeID;
  }

  // "classList" & "style" replaced with native "className" & "style"
  const resolvedStyleProps = StyleSheet.resolve(style, classList);
  const { className } = resolvedStyleProps;
  if (className != null && className !== '') {
    forwardedProps.className = className;
  }
  if (resolvedStyleProps.style) {
    forwardedProps.style = resolvedStyleProps.style;
  }

  // DEV-only
  if (process.env.NODE_ENV !== 'production') {
    // "testID" replaced with "data-testid"
    if (testID != null) {
      forwardedProps['data-testid'] = testID;
    }
  }

  return forwardedProps;
}
