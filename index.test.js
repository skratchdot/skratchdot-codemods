/* eslint-env jest */
'use strict';

describe('index.js', () => {
  it('exports the correct transforms', () => {
    const transforms = require('./index').transforms;
    const expectedTransforms = [
      'amd-to-commonjs',
      'global-strict',
      'no-strict'
    ];
    expectedTransforms.forEach((transformName) => {
      expect(transforms[transformName]).toBeInstanceOf(Function);
    });
    expect(Object.keys(transforms)).toEqual(expectedTransforms);
  });
});
