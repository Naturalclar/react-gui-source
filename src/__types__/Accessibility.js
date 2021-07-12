/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

type idRef = string;
type idRefList = idRef | Array<idRef>;

type AccessibilityRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'caption'
  | 'cell'
  | 'checkbox'
  | 'code'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'deletion'
  | 'dialog'
  | 'document'
  | 'emphasis'
  | 'feed'
  | 'figure'
  | 'form'
  | 'generic'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'insertion'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'math'
  | 'meter'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'paragraph'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'range'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'strong'
  | 'subscript'
  | 'superscript'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'time'
  | 'timer'
  | 'toolbar'
  | 'tree'
  | 'treegrid'
  | 'treeitem';

export type AccessibilityProps = {|
  accessibilityActiveDescendant?: ?idRef,
  accessibilityAtomic?: ?boolean,
  accessibilityAutoComplete?: ?('none' | 'list' | 'inline' | 'both'),
  accessibilityBusy?: ?boolean,
  accessibilityChecked?: ?(boolean | 'mixed'),
  accessibilityColumnCount?: ?number,
  accessibilityColumnIndex?: ?number,
  accessibilityColumnSpan?: ?number,
  accessibilityControls?: ?idRefList,
  accessibilityCurrent?: ?(
    | boolean
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
  ),
  accessibilityDescribedBy?: ?idRefList,
  accessibilityDetails?: ?idRef,
  accessibilityDisabled?: ?boolean,
  accessibilityErrorMessage?: ?idRef,
  accessibilityExpanded?: ?boolean,
  accessibilityFlowTo?: ?idRefList,
  accessibilityHasPopup?: ?(
    | 'dialog'
    | 'grid'
    | 'listbox'
    | 'menu'
    | 'tree'
    | false
  ),
  accessibilityHidden?: ?boolean,
  accessibilityInvalid?: ?boolean,
  accessibilityKeyShortcuts?: ?Array<string>,
  accessibilityLabel?: ?string,
  accessibilityLabelledBy?: ?idRefList,
  accessibilityLevel?: ?number,
  accessibilityLiveRegion?: ?('assertive' | 'off' | 'polite'),
  accessibilityModal?: ?boolean,
  accessibilityMultiline?: ?boolean,
  accessibilityMultiSelectable?: ?boolean,
  accessibilityOrientation?: ?('horizontal' | 'vertical'),
  accessibilityOwns?: ?idRefList,
  accessibilityPlaceholder?: ?string,
  accessibilityPosInSet?: ?number,
  accessibilityPressed?: ?(boolean | 'mixed'),
  accessibilityReadOnly?: ?boolean,
  accessibilityRequired?: ?boolean,
  accessibilityRole?: ?AccessibilityRole,
  accessibilityRoleDescription?: ?string,
  accessibilityRowCount?: ?number,
  accessibilityRowIndex?: ?number,
  accessibilityRowSpan?: ?number,
  accessibilitySelected?: ?boolean,
  accessibilitySetSize?: ?number,
  accessibilitySort?: ?('ascending' | 'descending' | 'none' | 'other'),
  accessibilityValueMax?: ?number,
  accessibilityValueMin?: ?number,
  accessibilityValueNow?: ?number,
  accessibilityValueText?: ?string,
  dataSet?: { ... },
  focusable?: ?boolean,
  nativeID?: ?string
|};
