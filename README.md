# access-deep
Safe access to the nested object's properties with ES6 Proxy object

<a href="https://travis-ci.org/forceuser/access-deep" target="_blank">![Build Status](https://travis-ci.org/forceuser/access-deep.svg?branch=master)</a>
<a href="https://codecov.io/gh/forceuser/access-deep" target="_blank">![Coverage Status](https://codecov.io/gh/forceuser/access-deep/branch/master/graph/badge.svg)</a>
<a href="https://www.npmjs.com/package/access-deep" target="_blank">![dependency Status](https://img.shields.io/npm/v/access-deep.svg)</a>
<a href="https://david-dm.org/forceuser/access-deep" target="_blank">![dependency Status](https://david-dm.org/forceuser/access-deep.svg)</a>
<a href="https://david-dm.org/forceuser/access-deep#info=devDependencies" target="_blank">![devDependency Status](https://david-dm.org/forceuser/access-deep/dev-status.svg)</a>

## Install

```bash
$ npm install access-deep
```

## Usage

```js
var accessDeep = require('access-deep');

var obj = {};
var accessor = accessDeep(obj);

accessor.foo.bar.baz = 'quux'; // nested objects are automatically created
console.log(JSON.stringify(obj)); // {"foo":{"bar":{"baz":"quux"}}}

accessor.foo.list[2] = 12;
console.log(JSON.stringify(obj)); // {"foo":{"bar":{"baz":"quux"},"list":[null,12]}}

console.log(accessor.foo.list[2].$val); // 12

```

## Compatibility

Node.js version 6 and higher

Browser support http://caniuse.com/#feat=proxy

## Warning

This is only experiment, use it at your own risk
