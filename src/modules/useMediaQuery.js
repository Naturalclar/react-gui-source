/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import React from 'react';
import supportsDOM from './supportsDOM';
import useLayoutEffect from './useLayoutEffect';

const canUseDOM = supportsDOM();

export default function useMediaQuery(query: string): boolean {
  const [state, setState] = React.useState(
    canUseDOM ? () => window.matchMedia(query).matches : false
  );

  useLayoutEffect(() => {
    if (canUseDOM) {
      const mediaQueryList: MediaQueryList = window.matchMedia(query);
      const listener = () => {
        setState(Boolean(mediaQueryList.matches));
      };
      mediaQueryList.addListener(listener);
      setState(mediaQueryList.matches);
      return () => {
        mediaQueryList.removeListener(listener);
      };
    }
  }, [query]);

  return state;
}
