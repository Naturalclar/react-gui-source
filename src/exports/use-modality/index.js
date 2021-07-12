/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import type { Modality } from '#internal/modality';

import React from 'react';
import {
  addModalityListener,
  getActiveModality,
  getModality
} from '#internal/modality';
import useLayoutEffect from '#internal/useLayoutEffect';

type Modalities = {
  activeModality: Modality,
  modality: Modality
};

export function useModality(): Modalities {
  const [modalities, setModalities] = React.useState({
    activeModality: getActiveModality(),
    modality: getModality()
  });

  useLayoutEffect(() => {
    const removeModalityListener = addModalityListener((modalities) => {
      setModalities(modalities);
    });
    return removeModalityListener;
  }, []);

  return modalities;
}
