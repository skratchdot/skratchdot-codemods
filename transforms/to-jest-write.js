'use strict';
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const jestTransform = require('./to-jest');
const testFolderName = '__tests__';

const isTestFolder = (dirname) => {
  let result = false;
  return dirname.split('/').reduce((prev, curr) => {
    if (curr.indexOf('__test') >= 0) {
      result = true;
    }
    return result;
  }, result);
};

const transform = (file, api, options) => {
  const source = jestTransform(file, api, options);
  const dirname = path.dirname(file.path);
  if (!isTestFolder(dirname) && !options.dry) {
    const parsedPath = path.parse(file.path);
    const newFile = path.normalize(path.join(
      dirname,
      testFolderName,
      `${parsedPath.name}-test.js`
    ));
    // write file
    mkdirp(path.dirname(newFile), () => {
      fs.writeFile(`${newFile}`, source, 'utf8');
    });
  }
  return file.source;
};

transform.isTestFolder = isTestFolder;
module.exports = transform;
