/* eslint-env jest */
'use strict';

// store required mocks here
let mocks = {};

// required modules
jest.mock('../temp');

describe('to-jest.identifier-no-parent.input.js tests', () => {
  beforeEach(() => {
    mocks = {};
    mocks.temp = require('../temp');
  });
  it('handles the default snapshot', () => {
    const lib = require('../to-jest.identifier-no-parent.input.js');
    expect(lib.default).toMatchSnapshot();
  });
});
