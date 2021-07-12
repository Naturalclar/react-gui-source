# Imperative methods

Methods for working imperatively with host elements.

### blur

Blur an element.

```js
import { blur } from 'react-gui';
import View from 'react-gui/view';

function Component() {
  const ref = React.useRef(null);

  function doSomething() {
    const node = ref.current;
    if (node != null && blurCondition) {
      blur(node);
    }
  });

  return <View ref={ref} />
}
```

### clear

Clear the text from a text input.

```js
import { clear } from 'react-gui';
import TextInput from 'react-gui/text-input';

function Component() {
  const ref = React.useRef(null);

  function doSomething() {
    const node = ref.current;
    if (node != null && clearCondition) {
      clear(node);
    }
  });

  return <TextInput ref={ref} />
}
```

### focus

Focus an element. Takes options as a second argument, which currently only supports preventing scroll from occuring on focus.

```js
import { focus } from 'react-gui';
import View from 'react-gui/view';

function Component() {
  const ref = React.useRef(null);

  function doSomething() {
    const node = ref.current;
    if (node != null && focusCondition) {
      focus(node, { preventScroll: true });
    }
  });

  return <View ref={ref} />
}
```

### getLayoutRect

Measure the layout and position (border-box dimensions) of an element. By default the dimension do not account for transforms. Pass `true` as the second argument to include CSS layout transforms in the result.

```js
import { getLayoutRect } from 'react-gui';
import View from 'react-gui/view';

function Component() {
  const ref = React.useRef(null);

  function doSomething() {
    const node = ref.current;
    if (node != null && getLayoutcondition) {
      const { x, y, width, height } = getLayoutRect(node, includeTransforms);
    }
  });

  return <View ref={ref} />
}
```

### getActiveModality()

Returns the modality last used to perform an interaction, e.g., `keyboard`, `mouse`, `touch`, `pen`.

```js
import { getActiveModality } from 'react-gui';

const activeModality = getActiveModality();
```

### getModality()

Returns the modality that was last used, e.g., `keyboard`, `mouse`, `touch`, `pen`.

```js
import { getModality } from 'react-gui';

const modality = getModality();
```
