'use strict';

const buildRequire = (j, v, r) => {
  let code = '';
  if (v && v.type === 'Identifier' && v.name.length) {
    code += `const ${v.name}`;
  }
  if (r && r.type === 'Literal' && r.value.length) {
    if (code.length) {
      code += ' = ';
    }
    code += `require('${r.value}')`;
  }
  code += ';';
  if (code === ';') {
    code = '';
  }
  return code;
};

const checkPathForValidNodeExpression = (path, argNumber) => [
  'FunctionExpression', 'ArrowFunctionExpression'
].indexOf(path.node.expression.arguments[argNumber].type) >= 0;

module.exports = function (file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.ExpressionStatement)
    .filter(
      (path) =>
        path.parentPath.node.type === 'Program' &&
        path.node.expression.type === 'CallExpression' &&
        path.node.expression.callee.type === 'Identifier' &&
        path.node.expression.callee.name === 'define'
    )
    .replaceWith((path) => {
      let arrayExpression;
      let functionExpression;
      if (
        path.node.expression.arguments.length === 2 &&
        path.node.expression.arguments[0].type === 'ArrayExpression' &&
        checkPathForValidNodeExpression(path, 1)
      ) {
        arrayExpression = path.node.expression.arguments[0];
        functionExpression = path.node.expression.arguments[1];
      } else if (checkPathForValidNodeExpression(path, 0)) {
        functionExpression = path.node.expression.arguments[0];
      } else {
        // do nothing. return early
        return path.node;
      }

      const comments = path.node.comments;
      const result = [];
      const statementSize = Math.max(
        functionExpression.params.length,
        arrayExpression ? arrayExpression.elements.length : 0
      );
      for (let i = 0; i < statementSize; i++) {
        result.push(
          buildRequire(
            j,
            functionExpression.params[i],
            arrayExpression.elements[i]
          )
        );
      }
      if (result.length && comments && comments.length) {
        const firstNode = j(result[0]).get().value.program.body[0];
        firstNode.comments = [];
        comments.forEach((comment) => {
          switch (comment.type) {
          case 'CommentLine':
            firstNode.comments.push(
                j.commentLine(comment.value, comment.leading, comment.trailing)
              );
            break;
          case 'CommentBlock':
            firstNode.comments.push(
                j.commentBlock(comment.value, comment.leading, comment.trailing)
              );
            break;
          }
        });
        result[0] = firstNode;
      }
      const leading = [];
      let isLeading = true;
      functionExpression.body.body.forEach((item) => {
        if (
          isLeading &&
          item.type === 'ExpressionStatement' &&
          item.expression.type === 'Literal'
        ) {
          leading.push(item);
        } else if (item.type === 'ReturnStatement') {
          const returnStatement = j(item)
            .toSource()
            .replace('return ', 'module.exports = ');
          isLeading = false;
          result.push(returnStatement);
        } else {
          isLeading = false;
          result.push(item);
        }
      });
      return leading.concat(result);
    })
    .toSource();
};
