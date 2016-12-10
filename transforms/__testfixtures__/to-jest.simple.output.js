/* eslint-env jest */
'use strict';

// required modules
jest.mock('../../../mod7');
jest.mock('../foo/mod3.js');
jest.mock('../foo/mod4.js');
jest.mock('../mod5.js');
jest.mock('../mod6');
jest.mock('mod1');
jest.mock('mod2');

describe('to-jest.simple.input.js tests', () => {
  it('handles the bar() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'bar';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the baz() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'baz';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the default() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'default';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the foo() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'foo';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the foobar1() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'foobar1';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the foobar2() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'foobar2';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the foobar3() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'foobar3';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the foobar4() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'foobar4';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the foobar5() snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'foobar5';
    expect(lib[libKey]()).toMatchSnapshot();
  });
  it('handles the plainObject snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'plainObject';
    expect(lib[libKey]).toMatchSnapshot();
  });
  it('handles the wow snapshot', () => {
    const lib = require('../to-jest.simple.input.js');
    const libKey = 'wow';
    expect(lib[libKey]).toMatchSnapshot();
  });
});
