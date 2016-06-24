module.exports = accessDeep;

function surrogate () {}

function isObject (obj) {
	return obj === Object(obj);
}

function isNumeric (val) {
	return !isNaN(parseFloat(val)) && isFinite(val);
}

function isSet (val) {
	return typeof val !== 'undefined' && val !== null;
}

accessDeep.surrogate = surrogate;

function accessDeep (source) {
	const rootAccessor = accessDeepSub(source, []);
	return rootAccessor;

	function formatPath (path) {
		let res = '';
		let i = 0;
		let p;
		let step = source;
		while (i < path.length) {
			p = path[i];
			res += ((!step && isNumeric(p.prop)) || Array.isArray(step) || (typeof p.prop === 'symbol')) ? '[' + p.prop.toString() + ']' : (res ? '.' : '') + p.prop.toString();
			step = step && step[p.prop];
			i++;
		}
		return res;
	}

	function accessDeepSub (obj, path) {
		function getVal () {
			let val = source;

			for (let i = 0; i < path.length; i++) {
				try {
					val = val[path[i].prop];
				} catch (err) {
					val = undefined;
				}
			}
			return val;
		}

		const accessor = new Proxy(obj, {
			get (obj, prop) {
				const context = path[path.length - 1];

				switch (prop) {
					case 'valueOf':
					case 'inspect':
					case Symbol.toPrimitive:
						return function () {
							const val = context.accessor[context.prop].$val;
							return isSet(val) ? val.valueOf() : val;
						};
					case 'toString':
						return function () {
							const val = context.accessor[context.prop].$val;
							return isSet(val) ? val.toString() : (val + '');
						};
					case 'toJSON':
						return getVal;
					case '$path':
						return formatPath(path);
					case '$val':
						return getVal();
					default:
				}

				const $path = Array.apply(null, path); // clone array
				$path.push({
					prop,
					accessor
				});

				return accessDeepSub(surrogate, $path);
			},
			set (obj, prop, val) {
				let p;
				let step = source;
				let i = 0;

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
			has (obj, prop) {
				const val = getVal();
				return isObject(val) && prop in val;
			},
			apply (obj, self, args) {
				const call = path[path.length - 1];
				const context = path[path.length - 2];

				switch (call.prop) {
					case '$up':
						return path[path.length - Math.max(args[0] || 1, 1) - 1].accessor;
					case '$exists':
						return context.prop in context.accessor;
					case '$set':
						if (typeof args[0] === 'function' && args[1]) {
							context.accessor[context.prop] = args[0](call.accessor);
						} else {
							context.accessor[context.prop] = args[0];
						}

						return context.accessor[context.prop];
					case '$get':
						if (typeof args[0] === 'function' && args[1]) {
							return args[0](call.accessor);
						}

						if (!(context.prop in context.accessor)) {
							return args[0];
						}

						return call.accessor.$val;
					default:
				}

				const target = call.accessor[call.prop].$val;

				if (typeof target !== 'function') {
					console.warn('Path "' + formatPath(path) + '" cannot be called as a function!');
					return;
				}

				return target.apply(self, args);
			}
		});

		return accessor;
	}
}
