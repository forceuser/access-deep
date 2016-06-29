const test = require('ava');
const accessDeep = require('../index');

test('general test', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b.c = 12;
	t.is(p.a.b.c.$val, 12);
	t.is(JSON.stringify(o), '{"a":{"b":{"c":12}}}');
	t.is(JSON.stringify(p), '{"a":{"b":{"c":12}}}');
	t.notThrows(() => accessDeep.surrogate());
});

test('array assignment', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b[1].c = 12;
	t.is(JSON.stringify(o), '{"a":{"b":[null,{"c":12}]}}');
});

test('$val parameter', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b.c = 12;
	t.is(p.a.b.c.$val, 12);
	t.is(p.a.b.x.$val, undefined);
});

test('$path parameter', t => {
	const o = {};
	const p = accessDeep(o);

	t.is(p.a.b.c.$path, 'a.b.c');
	t.is(p.a.b.c[1][2].dasd.$path, 'a.b.c[1][2].dasd');
});

test('valueOf', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b.c = 12;
	t.is(+p.a.b.c, 12, 'type conversion');
	t.is(p.a.b.c.valueOf(), 12, 'direct valueOf()');
	t.true(Number.isNaN(+p.a.b.x), 'check for NaN');
});

test('toString', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b.c = 12;
	t.is(p.a.b.c + '', '12');
	t.is(p.a.b.c.toString(), '12');
	t.is(p.a.b.x + '', 'undefined');
	t.is(p.a.b.x.toString(), 'undefined');
});

test('$get method', t => {
	const o = {};
	const p = accessDeep(o);

	function callback (accessor) {
		return accessor.$val ? accessor.$val + 1 : 'none';
	}

	// undefined
	t.is(p.a.b.c.$get(), undefined);
	t.is(p.a.b.c.$get('test'), 'test');
	t.is(p.a.b.c.$get(callback, true), 'none');
	t.is(p.a.b.c.$get(callback), callback);
	// value
	p.a.b.c = 12;
	t.is(p.a.b.c.$get(), 12);
	t.is(p.a.b.c.$get('test'), 12);
	t.is(p.a.b.c.$get(callback, true), 13);
	t.is(p.a.b.c.$get(callback), 12);
});

test('$set method', t => {
	const o = {};
	const p = accessDeep(o);

	function callback (accessor) {
		return accessor.$val + 1;
	}

	t.is(p.a.b.c.$set(12).$val, 12);
	t.is(p.foo.bar.$set(callback).$val, callback);
	p.foo.bar = 12;
	t.is(p.foo.bar.$set(callback, true).$val, 13);
});

test('$up method', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b.c = 12;
	t.is(JSON.stringify(p.a.b.c.$up()), '{"c":12}');
	t.is(JSON.stringify(p.a.b.c.$up(2)), '{"b":{"c":12}}');
});

// test('$exists method', t => {
// 	const o = {};
// 	const p = accessDeep(o);

// 	p.a.b.c = 12;
// 	t.true(p.a.b.c.$exists());
// 	t.false(p.a.b.some.$exists());
// 	t.false(p.foo.bar.some.$exists());
// });

test('has ("in" operator)', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.b.c = 12;
	t.true('c' in p.a.b);
	t.false('some' in p.a.b);
	t.false('some' in p.foo.bar);
});

test('apply (function call)', t => {
	const o = {};
	const p = accessDeep(o);

	p.a.f = function () {
		return 12;
	};
	t.is(p.a.f(), 12);
	t.notThrows(() => p.a.x());
});
