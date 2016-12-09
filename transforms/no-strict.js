'use strict';
module.exports = (file, api) => {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.ExpressionStatement)
    .filter((path) => path.value.expression.value === 'use strict')
    .remove()
    .toSource();
};
