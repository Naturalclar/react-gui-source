/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import { testOnly_resetActiveModality } from '#internal/modality';
import { terminateResponder } from '../exports/use-responder/ResponderSystem';

/**
 * After each test run it's necessary to reset the state machines in event
 * trackers, as unit tests may only dispatch partial event sequences (e.g.,
 * a test completes or fails after 'touchstart' is dispatched).
 */
export function afterEach() {
  if (process.env.NODE_ENV === 'test') {
    // reset modality tracker
    testOnly_resetActiveModality();
    // reset the responder system
    terminateResponder();
  } else {
    console.error(
      'react-gui/test-utils: "afterEach" must only be used in unit tests'
    );
  }
}
