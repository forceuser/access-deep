const test = require('ava');
const accessDeep = require('../index');

test('general test', t => {
	var o = {};
	var p = accessDeep(o);
	p.a.b.c = 12;
	t.is(JSON.stringify(o), '{"a":{"b":{"c":12}}}');
});
