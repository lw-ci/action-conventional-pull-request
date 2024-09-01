/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { it, describe, expect, spyOn, beforeEach } from 'bun:test';

import * as core from '@actions/core';
import * as main from '../main.js';

// Mock the action's main function
const runMock = spyOn(main, 'run');

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/;

// Mock the GitHub Actions core library
let debugMock = spyOn(core, 'debug').mockImplementation(() => '');
let errorMock = spyOn(core, 'error').mockImplementation(() => '');
let getInputMock = spyOn(core, 'getInput').mockImplementation(() => '');
let setFailedMock = spyOn(core, 'setFailed').mockImplementation(() => '');
let setOutputMock = spyOn(core, 'setOutput').mockImplementation(() => '');

function clearAllMocks() {
  debugMock.mockClear();
  errorMock.mockClear();
  getInputMock.mockClear();
  setFailedMock.mockClear();
  setOutputMock.mockClear();
}

describe.skip('action', () => {
  beforeEach(() => {
    clearAllMocks();

    debugMock = spyOn(core, 'debug').mockImplementation(() => '');
    errorMock = spyOn(core, 'error').mockImplementation(() => '');
    getInputMock = spyOn(core, 'getInput').mockImplementation(() => '');
    setFailedMock = spyOn(core, 'setFailed').mockImplementation(() => '');
    setOutputMock = spyOn(core, 'setOutput').mockImplementation(() => '');
  });

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'milliseconds':
          return '500';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Waiting 500 milliseconds ...'
    );
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(timeRegex)
    );
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(timeRegex)
    );
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'time',
      expect.stringMatching(timeRegex)
    );
    expect(errorMock).not.toHaveBeenCalled();
  });

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'milliseconds':
          return 'this is not a number';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'milliseconds not a number'
    );
    expect(errorMock).not.toHaveBeenCalled();
  });
});
