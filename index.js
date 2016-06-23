module.exports = accessDeep;

function surrogate() {}

function formatPath(path, source) {
	var res = '';
	var i = 0;
	var p;
	var step = source;
	while (i < path.length) {
		p = path[i];
		res += ((!step && isNumeric(p.prop)) || Array.isArray(step) || (typeof p.prop === 'symbol')) ? '[' + p.prop.toString() + ']' : (res ? '.' : '') + p.prop.toString();
		step = step && step[p.prop];
		i++;
	}
	return res;
}

function isObject(obj) {
	return obj === Object(obj);
}

function isNumeric(val) {
	return !isNaN(parseFloat(val)) && isFinite(val);
}

accessDeep.formatPath = formatPath;
accessDeep.surrogate = surrogate;

function accessDeep(source) {
	var rootAccessor = accessDeepSub(source, []);
	return rootAccessor;

	function accessDeepSub(obj, path) {
		var accessor;
		accessor = new Proxy(obj, {
			get: function (obj, prop) {
				var val = source;

				for (var i = 0; i < path.length; i++) {
					try {
						val = val[path[i].prop];
					} catch (err) {
						val = undefined;
					}
				}

				var $path;
				var context = path[path.length - 1];

				if (prop === 'valueOf' || prop === Symbol.toPrimitive || prop === 'inspect') {
					return function () {
						var val = context.accessor[context.prop].$val;
						if (typeof val !== 'undefined' && val !== null) {
							return val.valueOf();
						}
						return val;
					};
				}
				if (prop === 'toJSON') {
					return function () {
						return val;
					};
				}

				if (prop === 'toString') {
					return function () {
						var val = context.accessor[context.prop].$val;
						if (typeof val !== 'undefined' && val !== null) {
							return val.toString();
						}
						return val + '';
					};
				}

				if (prop === '$path') {
					return formatPath(path, source);
				}

				if (prop === '$val') {
					return val;
				}

				$path = Array.apply(null, path); // clone array
				$path.push({
					prop: prop,
					accessor: accessor
				});
				return accessDeepSub(surrogate, $path);
			},
			set: function (obj, prop, val) {
				var p;
				var step = source;
				var i = 0;

				while (i < path.length) {
					p = path[i];
					if (!isObject(step[p.prop])) {
						step[p.prop] = (path[i + 1] && isNumeric(path[i + 1].prop)) ? [] : {};
					}
					step = step[p.prop];
					i++;
				}

				step[prop] = val;
				return true;
			},
			has: function (obj, prop) {
				var val = source;

				for (var i = 0; i < path.length; i++) {
					try {
						val = val[path[i].prop];
					} catch (err) {
						val = undefined;
					}
				}

				return isObject(val) && prop in val;
			},
			apply: function (obj, self, args) {
				var call;
				var context;

				call = path[path.length - 1];
				context = path[path.length - 2];

				if (call.prop === '$up') {
					return path[path.length - Math.max(args[0] || 1, 1) - 1].accessor;
				}
				if (call.prop === '$exists') {
					return context.prop in context.accessor;
				}
				if (call.prop === '$set') {
					if (typeof args[0] === 'function' && args[1]) {
						context.accessor[context.prop] = args[0](call.accessor);
					} else {
						context.accessor[context.prop] = args[0];
					}
					return context.accessor[context.prop];
				}
				if (call.prop === '$get') {
					if (typeof args[0] === 'function' && args[1]) {
						return args[0](call.accessor);
					}

					if (!(context.prop in context.accessor)) {
						return args[0];
					}

					return call.accessor.$val;
				}

				var target = call.accessor[call.prop].$val;

				if (typeof target !== 'function') {
					console.warn('Path "' + formatPath(path, source) + '" cannot be called as a function!');
					return;
				}

				return target.apply(self, args);
			}
		});

		return accessor;
	}
}
