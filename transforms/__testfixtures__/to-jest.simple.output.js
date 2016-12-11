/* eslint-env jest */
'use strict';

// store required mocks here
let mocks = {};

// required modules
jest.mock('mod1');
jest.mock('mod2');
jest.mock('../foo/mod3.js');
jest.mock('../foo/mod4.js');
jest.mock('../mod5.js');
jest.mock('../mod6');
jest.mock('../../../mod7');

describe('to-jest.simple.input.js tests', () => {
  beforeEach(() => {
    mocks = {};
    mocks.mod1 = require('mod1');
    mocks.mod2 = require('mod2');
    mocks.mod3 = require('../foo/mod3.js');
    mocks.mod4 = require('../foo/mod4.js');
    mocks.mod5 = require('../mod5.js');
    mocks.mod6 = require('../mod6');
    mocks.mod7 = require('../../../mod7');
  });
  it('handles the bar() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.bar()).toMatchSnapshot();
  });
  it('handles the baz() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.baz()).toMatchSnapshot();
  });
  it('handles the default() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.default()).toMatchSnapshot();
  });
  it('handles the foo() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.foo()).toMatchSnapshot();
  });
  it('handles the foobar1() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.foobar1()).toMatchSnapshot();
  });
  it('handles the foobar2() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.foobar2()).toMatchSnapshot();
  });
  it('handles the foobar3() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.foobar3()).toMatchSnapshot();
  });
  it('handles the foobar4() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.foobar4()).toMatchSnapshot();
  });
  it('handles the foobar5() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.foobar5()).toMatchSnapshot();
  });
  it('handles the plainObject snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.plainObject).toMatchSnapshot();
  });
  it('handles the wow snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    expect(lib.wow).toMatchSnapshot();
  });
});
