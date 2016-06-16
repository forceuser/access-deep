# access-deep
Safe access to the nested object's properties with ES6 Proxy object

<a href="https://travis-ci.org/forceuser/access-deep" target="_blank">![Build Status](https://travis-ci.org/forceuser/access-deep.svg?branch=master)</a>
<a href="https://coveralls.io/github/forceuser/access-deep?branch=master" target="_blank">![Coverage Status](https://coveralls.io/repos/github/forceuser/access-deep/badge.svg?branch=master)</a>
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

accessor.foo.bar.baz = 'quux';
console.log(JSON.stringify(obj)); // {"foo":{"bar":{"baz":"quux"}}}

```

## Compatibility

Node.js version 6 and higher

Browser support http://caniuse.com/#feat=proxy

## Warning

This is only experiment, use it at your own risk
