import * as bloopy from 'mod1';
require('mod2');
require('./foo/mod3.js');
require('foo/mod4.js');
require('mod5.js');
require('./mod6');
require('../../mod7');

export const foo = () => 'fn-foo';
const bar = () => 'fn-bar';
export function baz() { return 'fn-baz'; }

const foobar1 = () => 'fn-foobar1';
const foobar2 = () => 'fn-foobar2';
const foobar3 = () => 'fn-foobar3';
const foobar4 = () => 'fn-foobar4';

export { bar }
export { foobar1 }
export { foobar2, foobar3 }
export default bar;

module.exports.foobar4 = foobar4;
module.exports.foobar5 = () => 'fn-foobar5';
exports.plainObject = 42;

module.exports = { wow: 5 };
