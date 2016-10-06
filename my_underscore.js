/**
 * Created by flytinychen on 2016/10/4.
 */
(function() {
    var root = this; //windows
    var __ = function() {};
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = __;
        }
        exports.__ = __;
    } else {
        root.__ = __;
    }

    __.each = __.foreach = function(obj, fn) {
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for (var i = 0; i < length; i++) {
            var currentKey = keys ? keys[i] : i;
            fn(obj[currentKey], currentKey, obj);
        }
    };
    __.map = __.collect = function(obj, fn) {
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        var results = Array(length);
        for (var i = 0; i < length; i++) {
            var currentKey = keys ? keys[i] : i;
            results[i] = fn(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    var createReduce = function(dir) {
        var reducer = function(obj, fn, initial) {
            var keys = !isArrayLike(obj) && __.keys(obj);
            var length = (keys || obj).length;
            var index = dir > 0 ? 0 : length - 1;
            if (!initial) {
                initial = obj[keys ? keys[index] : index];
                index += dir;
            }
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                initial = fn(initial, obj[currentKey], currentKey, obj);
            }
            return initial;
        };
        return function(obj, fn, initial) {
            return reducer(obj, fn, initial)
        }
    };

    __.reduce = __.foldl = __.inject = createReduce(1);
    __.reduceRight = __.foldr = createReduce(-1);

    __.find = function(obj, fn) {
        var key = isArrayLike(obj) ? __.findIndex(obj, fn) : __.findKey(obj, fn);
        if (key !== void 0 && key > -1) return obj[key];
    };

    __.filter = function(obj, fn) {
        var results = [];
        __.each(obj, function(value, index, list) {
            if (fn(value, index, list)) results.push(value);
        });
        return results;
    };

    __.reject = function(obj, fn) {
        return __.filter(obj, __.negate(fn));
    };

    __.every = function(obj, fn) {
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for (var i = 0; i < length; i++) {
            var currentKey = keys ? keys[i] : i;
            if (!fn(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    __.some = __.any = function(obj, fn) {
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for (var i = 0; i < length; i++) {
            var currentKey = keys ? keys[i] : i;
            if (fn(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    __.contains = __.include = __.includes = function(obj, item, fromIndex) {
        if (!isArrayLike(obj)) obj = __.keys(obj);
        if (typeof fromIndex != 'number') fromIndex = 0;
        return __.indexOf(obj, item, fromIndex) >= 0;
    };

    //something goes wrong
    __.where = function(obj, attr) {
        return __.filter(obj, __.matcher(attr));
    };

    __.findWhere = function(obj, attr) {
        return _.find(obj, _.matcher(attrs));
    };

    __.pluck = function(obj, attrs) {
        return __.map(obj, __.property(attrs));
    };

    __.invoke = function(obj, method) {
        var isFunc = __.isFunction(method);
        return __.map(obj, function(value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value);
        });
    };

    
    __.max = function(obj, iteratee) {
        var result;
        var resultIndex

        __.each(obj, function(value, index) {
            if (index == 0) {
                result = value;
                resultIndex = 0;
            }
            var temp = __.isFunction(iteratee) ? iteratee(value, index, obj) : value;
            var resultTemp = __.isFunction(iteratee) ? iteratee(result, resultIndex, obj) : result;

            if (temp > resultTemp) result = value;
        })
        return result;
    }




    __.matcher = __.matches = function(attrs) {
        attrs = __.extendOwn({}, attrs);
        return function(obj) {
            return __.isMatch(obj, attrs);
        };
    };

    // 无法解决{c:2} == {c:2}为false的问题 待优化
    __.isMatch = function(object, attrs) {
        var keys = __.keys(attrs);
        var length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };

    var createAssigner = function(keysFunc) {
        return function(obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    __.extend = createAssigner(__.allKeys);
    __.extendOwn = __.assign = createAssigner(__.keys);

    __.negate = function(fn) {
        return function() {
            return !fn.apply(this, arguments);
        }
    };

    //这两个方法限定了ArrayLike
    var createPredicateIndexFinder = function(dir) {
        var finder = function(array, fn) {
            var length = array['length'];
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (fn(array[index], index, array)) return index;
            }
            return -1;
        };
        return function(array, fn) {
            return finder(array, fn);
        }
    };

    __.findIndex = createPredicateIndexFinder(1);
    __.findLastIndex = createPredicateIndexFinder(-1);

    __.findKey = function(obj, fn) {
        var keys = __.keys(obj);
        var length = keys.length;
        for (var index = 0; index < length; index++) {
            if (fn(obj[keys[index]], keys[index], obj)) return keys[index];
        }
    };

    var property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    __.property = property;

    // __.restArgs = restArgs;
    var isArrayLike = function(obj) {
        var length = obj['length'];
        return length && typeof length == 'number' && length >= 0;
    };

    __.keys = function(obj) {
        if (!__.isObject(obj)) return [];
        if (Object.keys) return Object.keys(obj);
        var results = [];
        for (var index in obj) {
            if (__.has(obj, key)) keys.push(key);
        }
        return results;
    };

    __.values = function(obj) {
        var keys = __.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    __.allKeys = function(obj) {
        if (__.isObject(obj)) return [];
        if (object.keys) return object.keys(obj);
        var results = [];
        for (var index in obj) {
            results.push(index);
        }
        return results;
    };

    __.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };

    __.isUndefined = function(obj) {
        return obj === void 0;
    };

    __.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    __.has = function(obj, keys) {
        return obj != null && obj.hasOwnProperty(keys);
    };

    __.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
})();
