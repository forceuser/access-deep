module.exports = accessDeep;

accessDeep.REWRITE = 1;
accessDeep.CONVERT = 2;
accessDeep.ERROR = 3;

function isenum(prop, obj) {// is property enumerable, including inherited props
  for (var p in obj) {
    if (p === prop) return true;
  }
  return false;
}

function toObject(val) { // convert primitive type to object
  return ({}).valueOf.call(val);
}

function accessDeep(obj, mode) {
  return accessDeepSub.apply(this, arguments);
  
  function accessDeepSub(obj, path) {
    path = path || [];
    obj = obj || {};
    return new Proxy(obj, {
      get: function (obj, prop) {	
	var val = obj[prop];
	
	if (isenum(prop, obj)) {
	  val = toObject(val); 
	}
	else if (!(prop in obj)) {
	  val = {};
	}
	else {
	  return val;
	}
	
	path.push({
	  obj: obj,
	  prop: prop
	});
	return accessDeepSub(val, path);
      },
      set: function (obj, prop, val) {
	var p, step = obj;
	
	obj[prop] = val;
	
	while (path.length) {
	  p = path.pop();
	  p.obj[p.prop] = step;
	  step = p.obj;
	}
      }
    });
  }
  
}
