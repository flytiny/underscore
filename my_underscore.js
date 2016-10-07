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

    var cb = function(value) {
        if (__.isFunction(value)) return value;
        if (__.isObject(value)) return __.matcher(value);
        return __.property(value);
    };

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

    // var createReduce = function(obj, fn) {
    //     var keys = !isArrayLike(obj) && __.keys(obj);
    //     var length = (keys || obj).length;
    //     var index = 0;
    //     var results = obj[keys ? keys[index] : index];
    //     index++;
    //     for (; index >= 0 && index < length; index++) {
    //         var currentKey = keys ? keys[index] : index;
    //         results = fn(results, obj[currentKey], currentKey, obj);
    //     }
    //     return results;
    // };

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

    // __.find = function(obj, fn) {
    //     var keys = !isArrayLike(obj) && __.keys(obj);
    //     var length = (keys || obj).length;
    //     var results = Array(length);
    //     for (var i = 0; i < length; i++) {
    //         var currentKey = keys ? keys[i] : i;
    //         if (fn(obj[currentKey], currentKey, obj)) {
    //             return obj[currentKey];
    //         }
    //     }
    //     return void 0;
    // };

    __.find = function(obj, fn) {
        var key = isArrayLike(obj) ? __.findIndex(obj, fn) : __.findKey(obj, fn);
        if (key !== void 0 && key > -1) return obj[key];
    };

    // __.filter = function(obj, fn) {
    //     var isArray = isArrayLike(obj),
    //         results;
    //     results = isArray ? [] : {};
    //     __.each(obj, function(value, index, list) {
    //         if (fn(value, index, list)) {
    //             var temp = isArray ? results.push(value) : results[index] = value;
    //         }
    //     });
    //     return results;
    // };

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

    // __.contains = __.include = __.includes = function(obj, item, fromIndex) {
    //     var keys = !isArrayLike(obj) && __.keys(obj);
    //     var length = (keys || obj).length;
    //     for (var i = 0; i < length; i++) {
    //         var currentKey = keys ? keys[i] : i;
    //         if (item === obj[currentKey]) return true;
    //     }
    //     return false;
    // };

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

    // the min method is similar to the max method
    // __.max = function(obj, iteratee) {
    //     var result;
    //     var resultIndex

    //     __.each(obj, function(value, index) {
    //         if (result == void 0) {
    //             result = value;
    //             resultIndex = index;
    //         }
    //         var temp = __.isFunction(iteratee) ? iteratee(value, index, obj) : value;
    //         var resultTemp = __.isFunction(iteratee) ? iteratee(result, resultIndex, obj) : result;

    //         if (temp > resultTemp) result = value;
    //     })
    //     return result;
    // };

    __.max = function(obj, iteratee) {
        var result = -Infinity,
            lastComputed = -Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : __.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value > result) {
                    result = value;
                }
            }
        } else {
            __.each(obj, function(v, index, list) {
                computed = iteratee(v, index, list);
                if (computed > lastComputed || result === -Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    __.min = function(obj, iteratee) {
        var result = Infinity,
            lastComputed = Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : __.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value < result) {
                    result = value;
                }
            }
        } else {
            __.each(obj, function(v, index, list) {
                computed = iteratee(v, index, list);
                if (computed < lastComputed || result === Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    __.sample = function(obj, n) {
        if (n == null) {
            if (!isArrayLike(obj)) obj = __.values(obj);
            return obj[__.random(obj.length - 1)];
        }
        //prevent changing the origin obj
        var sample = isArrayLike(obj) ? __.clone(obj) : __.values(obj);
        var length = sample['length'];
        for (var index = 0; index < length; index++) {
            var temp = sample[index];
            var random = __.random(sample.length - 1);
            sample[index] = sample[random];
            sample[random] = temp;
        }
        return sample.slice(0, n);
    };

    __.shuffle = function(obj) {
        return __.sample(obj, Infinity);
    };

    __.sortBy = function(obj, iteratee) {
        iteratee = cb(iteratee);
        var index = 0;
        return __.pluck(__.map(obj, function(value, key, list) {
            return {
                value: value,
                index: index++,
                criteria: iteratee(value, key, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    //groupBy / indexBy / countBy is vary similar
    // __.groupBy = function(obj, iteratee){
    //     iteratee = cb(iteratee);
    //     var result = {};
    //     __.each(obj, function(value, item){
    //         var temp = iteratee(value);
    //         if(!result[temp]) result[temp] = [];
    //         result[temp].push(value);
    //     });
    //     return result;
    // }

    var group = function(fn, returnArray) {
        return function(obj, iteratee) {
            iteratee = cb(iteratee);
            var result = returnArray ? [] : {};
            __.each(obj, function(value, index) {
                var key = iteratee(value, index, obj);
                fn(result, value, key);
            });
            return result;
        }
    }

    __.groupBy = group(function(result, value, key) {
        if (!_.has(result, key)) result[key] = [];
        result[key].push(value);
    });

    __.indexBy = group(function(result, value, key) {
        result[key] = value;
    });

    __.countBy = group(function(result, value, key) {
        if (!_.has(result, key)) result[key] = 0;
        result[key]++;
    });

    __.partition = group(function(result, value, key) {
        if (result[0] == null) result[0] = [];
        if (result[1] == null) result[1] = [];
        result[value ? 0 : 1].push(value);
    }, true);

    __.matcher = __.matches = function(attrs) {
        attrs = __.extendOwn({}, attrs);
        return function(obj) {
            return __.isMatch(obj, attrs);
        };
    };

    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

    __.toArray = function(obj) {
        if (!obj) return [];
        if (__.isArray(obj)) return slice.call(obj);
        if (__.isString(obj)) return obj.match(reStrSymbol);
        if (isArrayLike(obj)) return __.map(obj, __.identity);
        return __.values(obj);
    };

    __.size = function(obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : __.keys(obj).length;
    };


    //begin Array method
    __.first = __.head = __.take = function(array, n){
        if(array == null || array.length < 1) return void 0;
        if(n == null) return array[0];
        return array.slice(0,n);
    };

    __.initial = function(array, n){
        return array.slice(0, Math.max(0, array.length - (n == null ? 1 : n)));
    };

    __.last = function(array, n){
        if(array == null || array.length < 1) return void 0;
        if(n == null) return array[array.length - 1];
        return array.slice(array.length - n);
    };

    __.rest = function(array, n){
        return array.slice(Math.max(0, (n == null ? 1 :n)));
    };

    __.compact  = function(array){
        return __.filter(array, Boolean);
    };

    var flatten = function(){};

    __.flatten = flatten();


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

    var isArrayLike = function(obj) {
        var length = obj['length'];
        return length && typeof length == 'number' && length >= 0;
    };

    __.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
        __['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    __.keys = function(obj) {
        if (!__.isObject(obj)) return [];
        if (Object.keys) return Object.keys(obj);
        var results = [];
        for (var index in obj) {
            if (__.has(obj, key)) keys.push(key);
        }
        return results;
    };

    __.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.round(Math.random() * (max - min));
    };

    __.clone = function(obj) {
        if (!__.isObject(obj)) return obj;
        return __.isArray(obj) ? obj.slice() : __.extend({}, obj);
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

    //this method must be behind to the allKeys and keys
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

    __.identity = function(value) {
        return value;
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

    __.isArray = Array.isArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    __.has = function(obj, keys) {
        return obj != null && obj.hasOwnProperty(keys);
    };

    __.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

})();
