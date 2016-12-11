'use strict';
const path = require('path');

const sortByName = (a, b) => a.name < b.name ? -1 : 1;

const getSafeProp = (id) => {
  const isSafe = id.replace(/[a-zA-Z0-9\_]/gi, '').length === 0;
  return isSafe ? `.${id}` : `['${id}']`;
};

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

  // ExportNamedDeclaration -> VariableDeclaration
  ast
    .find(j.ExportNamedDeclaration)
    .filter((p) => p.value &&
      p.value.declaration &&
      p.value.declaration.type === 'VariableDeclaration' &&
      p.value.declaration.declarations &&
      p.value.declaration.declarations.length &&
      p.value.declaration.declarations[0] &&
      p.value.declaration.declarations[0].id)
    .forEach((path) => {
      const dec = path.value.declaration.declarations[0].id;
      testInfo.push({
        name: dec.name,
        type: getTestType(dec, j(path.parent))
      });
    });

  // ExportNamedDeclaration -> FunctionDeclaration
  ast
    .find(j.ExportNamedDeclaration)
    .filter((p) => p.value &&
      p.value.declaration &&
      p.value.declaration.type === 'FunctionDeclaration')
    .forEach((path) => {
      const dec = path.value.declaration;
      testInfo.push({
        name: dec.id.name,
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
  const requiredLibs = getRequiredLibs(j, ast).map((id) => {
    if (id.indexOf('.') >= 0 || id.indexOf('/') >= 0) {
      id = path.normalize(`../${id}`);
    }
    return {
      name: path.parse(id).name,
      path: id
    };
  }).sort(sortByName);
  const jestMocks = requiredLibs.map((lib) => `jest.mock('${lib.path}');`);
  const requireJestMocks = requiredLibs.map((lib) => {
    return `    mocks${getSafeProp(lib.name)} = require('${lib.path}');`;
  });

  // add comment
  if (jestMocks.length) {
    jestMocks.unshift('// required modules');
    jestMocks.push('');
  }

  // setup tests
  const tests = getTestInfo(j, ast)
    .sort(sortByName)
    .map((testInfo) => {
      const testName = testInfo.name;
      const isFunction = testInfo.type === 'function';
      const testSuffix = isFunction ? '()' : '';
      const description = `handles the ${testName}${testSuffix} snapshot`;
      const safe = `${getSafeProp(testName)}${testSuffix}`;
      return [
        `  it('${description}', () => {`,
        `    const lib = require('${path.normalize(`../${filename}`)}');`,
        `    expect(lib${safe}).toMatchSnapshot();`,
        '  });'
      ].join('\n');
    });

  // build test
  return []
    .concat('/* eslint-env jest */')
    .concat('\'use strict\';')
    .concat('\n// store required mocks here\nlet mocks = {};\n')
    .concat(jestMocks)
    .concat(`describe('${description}', () => {`)
    .concat('  beforeEach(() => {')
    .concat('    mocks = {};')
    .concat(requireJestMocks)
    .concat('  });')
    .concat(tests)
    .concat('});')
    .join('\n');
};

module.exports = transform;
