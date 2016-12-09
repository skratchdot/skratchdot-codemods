'use strict';

module.exports.transforms = require('require-all')({
  dirname: `${__dirname}/transforms`,
  excludeDirs: /^\_\_.*$/
});
