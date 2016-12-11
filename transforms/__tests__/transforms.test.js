/* eslint-env jest */
'use strict';

jest.autoMockOff();
jest.mock('mkdirp');

// libs
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const fs = require('fs');

// config
const testDir = __dirname;
const fixturesDir = `${__dirname}/../__testfixtures__/`;
const options = null;

const prefixes = [];
const files = fs.readdirSync(fixturesDir);
files.forEach((file) => {
  const prefix = file
    .replace('.input.js', '')
    .replace('.output.js', '');
  if (prefixes.indexOf(prefix) === -1) {
    prefixes.push(prefix);
  }
});
prefixes.forEach((prefix) => {
  const parts = prefix.split('.');
  const transformName = parts[0];
  defineTest(testDir, transformName, options, prefix);
});
