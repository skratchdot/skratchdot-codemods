/* eslint-env jest */
'use strict';

// required modules
jest.mock('../temp');

describe('to-jest.identifier-no-parent.input.js tests', () => {
  it('handles the default snapshot', () => {
    const lib = require('../to-jest.identifier-no-parent.input.js');
    const libKey = 'default';
    expect(lib[libKey]).toMatchSnapshot();
  });
});
