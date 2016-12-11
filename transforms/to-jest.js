'use strict';
const path = require('path');

const getRequiredLibs = (j, ast) => {
  const libs = [];
  ast
    .find(j.ImportDeclaration)
    .forEach((path) => {
      libs.push(path.value.source.value);
    });
  ast
    .find(j.CallExpression)
    .filter((p) => p.value &&
      p.value.callee &&
      p.value.callee.type === 'Identifier' &&
      p.value.callee.name === 'require' &&
      p.value.arguments &&
      p.value.arguments.length === 1 &&
      p.value.arguments[0].type === 'Literal')
    .forEach((path) => {
      libs.push(path.value.arguments[0].value);
    });
  return libs;
};

const isFunctionType = (ast) => {
  return ast && ast.type && [
    'ArrowFunctionExpression',
    'FunctionExpression'
  ].indexOf(ast.type) >= 0;
};

const getTestType = (ast, parent) => {
  let type = 'unknown';
  if (isFunctionType(ast)) {
    type = 'function';
  } else if (ast && ast.type === 'Identifier' && ast.name && parent) {
    const nodes = parent
      .getVariableDeclarators(() => ast.name)
      .nodes();
    if (nodes.length) {
      type = getTestType(nodes[0].init);
    }
  }
  return type;
};

const getTestInfo = (j, ast) => {
  const testInfo = [];

  // ExportDefaultDeclaration
  ast
    .find(j.ExportDefaultDeclaration)
    .forEach((path) => {
      testInfo.push({
        name: 'default',
        type: getTestType(path.value.declaration, j(path.parent))
      });
    });

  // ExportNamedDeclaration>VariableDeclaration
  ast
    .find(j.ExportNamedDeclaration)
    .find(j.VariableDeclaration)
    .forEach((path) => {
      const dec = path.value.declarations[0];
      testInfo.push({
        name: dec.id.name,
        type: getTestType(dec.init)
      });
    });

  // ExportNamedDeclaration>FunctionDeclaration
  ast
    .find(j.ExportNamedDeclaration)
    .find(j.FunctionDeclaration)
    .forEach((path) => {
      testInfo.push({
        name: path.value.id.name,
        type: 'function'
      });
    });

  // ExportNamedDeclaration>ExportSpecifier
  ast
    .find(j.ExportNamedDeclaration)
    .find(j.ExportSpecifier)
    .forEach((path) => {
      testInfo.push({
        name: path.value.exported.name,
        type: getTestType(path.value.local, j(path.parent))
      });
    });

  // AssignmentExpression
  // exports.foo = 42;
  ast
    .find(j.AssignmentExpression)
    .filter((p) => p.value &&
      p.value.left &&
      p.value.left.object &&
      p.value.left.object.name === 'exports')
    .forEach((path) => {
      testInfo.push({
        name: path.value.left.property.name,
        type: getTestType(path.value.right, j(path.parent))
      });
    });

  // AssignmentExpression
  // module.exports.foo = 42;
  ast
    .find(j.AssignmentExpression)
    .filter((p) => p.value &&
      p.value.left &&
      p.value.left.object &&
      p.value.left.object.type === 'MemberExpression' &&
      p.value.left.object.object &&
      p.value.left.object.object.name === 'module' &&
      p.value.left.object.property &&
      p.value.left.object.property.name === 'exports')
    .forEach((path) => {
      testInfo.push({
        name: path.value.left.property.name,
        type: getTestType(path.value.right, j(path.parent))
      });
    });

  // AssignmentExpression
  // module.exports = { a: 1, b: 2 };
  ast
    .find(j.AssignmentExpression)
    .filter((p) => p.value &&
      p.value.left &&
      p.value.left.object &&
      p.value.left.object.name === 'module' &&
      p.value.left.property &&
      p.value.left.property.name === 'exports' &&
      p.value.right &&
      p.value.right.type === 'ObjectExpression')
    .forEach((path) => {
      path.value.right.properties.forEach((n) => {
        testInfo.push({
          name: n.key.name,
          type: getTestType(n.value, j(path.parent))
        });
      });
    });

  return testInfo;
};

const transform = (file, api) => {
  const j = api.jscodeshift;
  const ast = j(file.source);
  const filename = path.basename(file.path);
  const description = `${filename} tests`;

  // setup required libs
  const required = getRequiredLibs(j, ast).map((id) => {
    if (id.indexOf('.') >= 0 || id.indexOf('/') >= 0) {
      id = path.normalize(`../${id}`);
    }
    return `jest.mock('${id}');`;
  }).sort();

  // add comment
  if (required.length) {
    required.unshift('// required modules');
    required.push('');
  }

  // setup tests
  const tests = getTestInfo(j, ast)
    .sort((a, b) => a.name < b.name ? -1 : 1)
    .map((testInfo) => {
      const testName = testInfo.name;
      const isFunction = testInfo.type === 'function';
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
