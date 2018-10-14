# skratchdot-codemods

[![NPM version](https://badge.fury.io/js/skratchdot-codemods.svg)](http://badge.fury.io/js/skratchdot-codemods)
[![Build Status](https://travis-ci.org/skratchdot/skratchdot-codemods.png?branch=master)](https://travis-ci.org/skratchdot/skratchdot-codemods)
[![Code Climate](https://codeclimate.com/github/skratchdot/skratchdot-codemods.png)](https://codeclimate.com/github/skratchdot/skratchdot-codemods)
[![Coverage Status](https://coveralls.io/repos/skratchdot/skratchdot-codemods/badge.svg?branch=master&service=github)](https://coveralls.io/github/skratchdot/skratchdot-codemods?branch=master)

[![Dependency Status](https://david-dm.org/skratchdot/skratchdot-codemods.svg)](https://david-dm.org/skratchdot/skratchdot-codemods)
[![devDependency Status](https://david-dm.org/skratchdot/skratchdot-codemods/dev-status.svg)](https://david-dm.org/skratchdot/skratchdot-codemods#info=devDependencies)

[![NPM](https://nodei.co/npm/skratchdot-codemods.png)](https://npmjs.org/package/skratchdot-codemods)


## Description

A collection of utility codemods that I find useful.


## Getting Started

```bash
npm install jscodeshift
npm install skratchdot-codemods
jscodeshift -t ./node_modules/skratchdot-codemods/transforms/amd-to-commonjs.js /path/to/files/*.js
jscodeshift -t ./node_modules/skratchdot-codemods/transforms/global-strict.js /path/to/files/*.js
```
See all the available
[transforms here](https://github.com/skratchdot/skratchdot-codemods/tree/master/transforms).


## Links

- [Source Code](https://github.com/skratchdot/skratchdot-codemods)
- [jscodeshift](https://github.com/facebook/jscodeshift)
- [AST Explorer](https://astexplorer.net/)


## License

Copyright (c) 2016 [skratchdot](https://www.skratchdot.com/)  
Licensed under the
[MIT license](https://github.com/skratchdot/skratchdot-codemods/blob/master/LICENSE-MIT).
