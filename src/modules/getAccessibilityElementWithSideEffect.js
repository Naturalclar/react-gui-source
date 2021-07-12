/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const roleToElementType = {
  article: 'article',
  banner: 'header',
  blockquote: 'blockquote',
  // TODO: enable once Firefox <63 support is not required
  // button: 'button',
  code: 'code',
  complementary: 'aside',
  contentinfo: 'footer',
  deletion: 'del',
  emphasis: 'em',
  figure: 'figure',
  insertion: 'ins',
  form: 'form',
  link: 'a',
  list: 'ul',
  listitem: 'li',
  main: 'main',
  navigation: 'nav',
  region: 'section',
  strong: 'strong'
};

const emptyObject = {};

/**
 * Converts accessibility props into native HTML semantics where possible, and mutates
 * the props to remove redundant information.
 */

// TODO: add 'label' and infer 'htmlFor' from 'labelledBy'
export default function getAccessibilityElementWithSideEffect(
  props: Object = emptyObject
): Object {
  let elementType;
  const { accessibilityLevel, accessibilityRole, href } = props;
  // Anything with an 'href' needs to be an anchor tag.
  // Return early so the accessibility role is not removed!
  if (href != null) {
    return 'a';
  }
  // Heading tags are determined from role and level (default is 'h2')
  else if (accessibilityRole === 'heading') {
    elementType = 'h2';
    if (
      accessibilityLevel != null &&
      typeof accessibilityLevel === 'number' &&
      accessibilityLevel < 7
    ) {
      elementType = `h${accessibilityLevel}`;
      props.accessibilityLevel = null;
    }
  }
  // Other roles may be converted to HTML tag equivalents
  else if (accessibilityRole != null) {
    elementType = roleToElementType[props.accessibilityRole];
  }
  if (elementType != null) {
    props.accessibilityRole = null;
  }
  return elementType;
}
