/* eslint-env jest */
'use strict';

// store required mocks here
let mocks = {};

// required modules
jest.mock('query-string');

describe('to-jest.url-test.input.js tests', () => {
  beforeEach(() => {
    mocks = {};
    mocks['query-string'] = require('query-string');
  });
  it('handles the getDataFromURI() snapshot', () => {
    const lib = require('../to-jest.url-test.input.js');
    expect(lib.getDataFromURI()).toMatchSnapshot();
  });
  it('handles the updateURI() snapshot', () => {
    const lib = require('../to-jest.url-test.input.js');
    expect(lib.updateURI()).toMatchSnapshot();
  });
});
