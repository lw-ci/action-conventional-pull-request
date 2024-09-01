/**
 * Unit tests for the action's entrypoint, src/index.ts
 */
import { it, describe, expect, spyOn } from 'bun:test';

import * as main from '../main.js';

// Mock the action's entrypoint
const runMock = spyOn(main, 'run').mockImplementation(async () =>
  console.log('running')
);

describe('index', () => {
  it('calls run when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../index');

    expect(runMock).toHaveBeenCalled();
  });
});
