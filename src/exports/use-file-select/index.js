/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import React from 'react';
import supportsDOM from '#internal/supportsDOM';
import useLayoutEffect from '#internal/useLayoutEffect';
import useStable from '#internal/useStable';

type AcceptTypes = $ReadOnlyArray<string>;

export type FileSelectConfig = $ReadOnly<{
  acceptMultiple?: boolean,
  acceptTypes?: AcceptTypes,
  onFilesChange: ($ReadOnlyArray<File>) => void,
  source?: 'environment' | 'user'
}>;

function createInput(): ?HTMLInputElement {
  if (supportsDOM()) {
    const input = document.createElement('input');
    input.type = 'file';
    return input;
  }
}

function clearInput(input: HTMLInputElement) {
  input.value = '';
}

function processAcceptTypes(acceptTypes: AcceptTypes): string {
  return acceptTypes
    .map((fileType) => {
      if (fileType.indexOf('/') !== -1 || fileType[0] === '.') {
        return fileType;
      }
      console.error(
        `useFileSelector: "acceptType" value of ${fileType} is not a valid MIME type or file extension.`,
        'File extensions must start with a "." character.'
      );
    })
    .join(',');
}

export function useFileSelect(config: FileSelectConfig): () => void {
  const { acceptMultiple, acceptTypes, onFilesChange, source } = config;

  const input: ?HTMLInputElement = useStable(createInput);
  const openFileSelector = React.useCallback(() => {
    if (input != null) {
      input.click();
    }
  }, [input]);

  const onChange = React.useCallback(
    (e: InputEvent) => {
      e.preventDefault();
      if (e.target instanceof HTMLInputElement) {
        onFilesChange(Array.from(e.target.files));
        if (input != null) {
          clearInput(input);
        }
      }
    },
    [input, onFilesChange]
  );

  useLayoutEffect(() => {
    if (input == null) {
      return;
    }
    const accept = acceptTypes != null ? processAcceptTypes(acceptTypes) : null;
    if (accept != null) {
      input.setAttribute('accept', accept);
    }
    if (source != null) {
      input.setAttribute('capture', source);
    }
    if (acceptMultiple != null) {
      input.setAttribute('multiple', String(acceptMultiple));
    }
    // $FlowExpectedError: sigh
    input.addEventListener('change', onChange);
    return () => {
      // $FlowExpectedError: sigh
      input.removeEventListener('change', onChange);
    };
  }, [acceptMultiple, acceptTypes, source, onChange, input]);

  return openFileSelector;
}
