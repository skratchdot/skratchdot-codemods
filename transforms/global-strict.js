'use strict';
const noStrictTransform = require('./no-strict');
module.exports = (file, api, options) => {
  const source = noStrictTransform(file, api, options);
  return `'use strict';\n${source}`;
};
