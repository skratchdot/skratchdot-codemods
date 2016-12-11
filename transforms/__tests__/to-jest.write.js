/* eslint-env jest */
'use strict';

jest.mock('fs');
jest.mock('mkdirp', () => jest.fn((dir, cb) => cb()));
jest.mock('../to-jest');

describe('to-jest-write tests', () => {
  it('should handle isTestFolder(dirname)', () => {
    const isTestFolder = require('../to-jest-write').isTestFolder;
    expect(isTestFolder('../foo/')).toEqual(false);
    expect(isTestFolder('../foo')).toEqual(false);
    expect(isTestFolder('./cool/neat/foo/')).toEqual(false);
    expect(isTestFolder('./cool/neat/foo/__tests__/')).toEqual(true);
    expect(isTestFolder('./cool/neat/foo/__testfixtures__')).toEqual(true);
  });
  it('should create tests folder and write test files', () => {
    const toJestMock = require('../to-jest');
    const mkdirpMock = require('mkdirp');
    const fsMock = require('fs');
    const transform = require('../to-jest-write');
    const file = {
      source: 'test-source',
      path: '/test-path/mock.js'
    };
    const api = jest.fn();
    const options = jest.fn();
    transform(file, api, options);
    expect(toJestMock.mock.calls.length).toEqual(1);
    expect(mkdirpMock.mock.calls.length).toEqual(1);
    expect(fsMock.writeFile.mock.calls.length).toEqual(1);
    expect(fsMock.writeFile.mock.calls[0][0]).toEqual(
      '/test-path/__tests__/mock-test.js');
  });
});
