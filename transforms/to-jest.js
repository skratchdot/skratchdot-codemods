'use strict';
const babel = require('babel-core');
const path = require('path');
const vm = require('vm');

const transform = (file) => {
  const filename = path.basename(file.path);
  const dirname = path.dirname(file.path);
  const description = `${filename} tests`;
  const transformed = babel.transform(`${file.source}
  __vm__.exports = Object.assign({}, exports, module.exports);`, {
    presets: ['latest', 'stage-0', 'react']
  });
  // see: https://nodejs.org/api/modules.html#modules_the_module_wrapper
  const sandbox = {};
  sandbox.__vm__ = {
    ids: [],
    exports: {}
  };
  sandbox.module = {
    children: [],
    exports: {},
    filename: filename,
    id: '',
    loaded: false,
    parent: {},
    require: function (id) {
      sandbox.__vm__.ids.push(id);
    }
  };
  sandbox.exports = sandbox.module.exports;
  sandbox.require = sandbox.module.require;
  sandbox.__filename = filename;
  sandbox.__dirname = dirname;
  vm.runInNewContext(transformed.code, sandbox, {
    filename: filename
  });
  const vmExports = sandbox.__vm__.exports;
  const required = sandbox.__vm__.ids.map((id) => {
    if (id.indexOf('.') >= 0 || id.indexOf('/') >= 0) {
      id = path.normalize(`../${id}`);
    }
    return `jest.mock('${id}');`;
  }).sort();
  const tests = Object.keys(vmExports).sort().map((testName) => {
    const isFunction = typeof vmExports[testName] === 'function';
    const testSuffix = isFunction ? '()' : '';
    const description = `handles the ${testName}${testSuffix} snapshot`;
    let testBody = `    expect(lib[libKey]${testSuffix}).toMatchSnapshot();`;
    return [
      `  it('${description}', () => {`,
      `    const lib = require('${path.normalize(`../${filename}`)}');`,
      `    const libKey = '${testName}';`,
      testBody,
      '  });'
    ].join('\n');
  });

  if (required.length) {
    required.unshift('// required modules');
    required.push('');
  }

  // build test
  return []
    .concat('/* eslint-env jest */')
    .concat('\'use strict\';')
    .concat('')
    .concat(required)
    .concat(`describe('${description}', () => {`)
    .concat(tests)
    .concat('});')
    .join('\n');
};

module.exports = transform;
