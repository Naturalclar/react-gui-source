/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

function filterObjectProperties(
  obj: Object,
  list: { [string]: boolean },
  pick: boolean
): Object {
  const nextObj = {};
  if (obj != null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (pick) {
          if (list[key] === true) {
            nextObj[key] = obj[key];
          }
        } else if (list[key] !== true) {
          nextObj[key] = obj[key];
        }
      }
    }
  }
  return nextObj;
}

export function pick(obj: Object, list: { [string]: boolean }): Object {
  return filterObjectProperties(obj, list, true);
}

export function omit(obj: Object, list: { [string]: boolean }): Object {
  return filterObjectProperties(obj, list, false);
}
