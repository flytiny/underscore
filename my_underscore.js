/**
 * Created by flytinychen on 2016/10/4.
 */
(function(){
    var root = this; //windows
    var __ = function(){};
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = __;
        }
        exports.__ = __;
    } else {
        root.__ = __;
    }

    __.each = __.foreach =  function(obj, fn){
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for(var i = 0; i < length; i++){
            var currentKey = keys ? keys[i] : i;
            fn(obj[currentKey], currentKey, obj);
        }
    };
    __.map = __.collect = function(obj, fn){
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        var results = Array(length);
        for(var i = 0; i < length; i++){
            var currentKey = keys ? keys[i] : i;
            results[i] = fn(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    var createReduce = function(dir){
        var reducer = function(obj, fn, initial){
            var keys = !isArrayLike(obj) && __.keys(obj);
            var length = (keys || obj).length;
            var index = dir > 0 ? 0 : length - 1;
            if(!initial){
                initial = obj[keys ? keys[index] : index];
                index += dir;
            }
            for(; index >= 0 && index < length; index += dir){
                var currentKey = keys ? keys[index] : index;
                initial = fn(initial ,obj[currentKey], currentKey, obj);
            }
            return initial;
        };
        return function(obj, fn, initial){
            return reducer(obj, fn, initial)
        }
    };

    __.reduce  = __.foldl = __.inject = createReduce(1);
    __.reduceRight = __.foldr = createReduce(-1);

    __.find = function(obj, fn){
        var key = isArrayLike(obj) ? __.findIndex(obj, fn) : __.findKey(obj, fn);
        if(key !== void 0 && key > -1) return obj[key];
    };

    __.filter = function(obj, fn){
        var results = [];
        __.each(obj, function(value, index, list){
            if(fn(value, index, list)) results.push(value);
        });
        return results;
    };

    __.reject = function(obj, fn){
        return __.filter(obj, __.negate(fn));
    };

    __.every = function(obj, fn){
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for(var i = 0; i < length; i++){
            var currentKey = keys ? keys[i] : i;
            if(!fn(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    __.some = __.any = function(obj, fn){
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for(var i = 0; i < length; i++){
            var currentKey = keys ? keys[i] : i;
            if(fn(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    //老版的遍历
    __.contains = __.include = __.includes = function(obj, item, fromIndex){
        var keys = !isArrayLike(obj) && __.keys(obj);
        var length = (keys || obj).length;
        for(var i = 0; i < length; i++){
            var currentKey = keys ? keys[i] : i;
            if(item === obj[currentKey]) return true;
        }
        return false;
    };

    __.negate = function(fn){
        return function(){
            return !fn.apply(this,arguments);
        }
    };

    //这两个方法限定了ArrayLike
    var createPredicateIndexFinder = function(dir){
        var finder = function(array, fn){
            var length = array['length'];
            var index = dir > 0 ? 0 : length - 1;
            for(; index >= 0 && index < length; index += dir){
                if(fn(array[index], index, array)) return index;
            }
            return -1;
        };
        return function(array, fn){
            return finder(array, fn);
        }
    };

    __.findIndex = createPredicateIndexFinder(1);
    __.findLastIndex = createPredicateIndexFinder(-1);

    __.findKey = function(obj, fn){
        var keys = __.keys(obj);
        var length  = keys.length;
        for(var index = 0; index < length; index++){
            if(fn(obj[keys[index]], keys[index], obj)) return keys[index];
        }
    };

    var isArrayLike = function(obj){
        var length = obj['length'];
        return length && typeof length == 'number' && length >= 0;
    };

    __.keys = function(obj){
        if(!__.isObject(obj)) return [];
        if(Object.keys) return Object.keys(obj);
        var results = [];
        for(var index in obj){
            if (__.has(obj, key)) keys.push(key);
        }
        return results;
    };

    __.values = function(obj){
        var keys = __.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    __.allKeys = function(obj){
        if(__.isObject(obj)) return [];
        if(object.keys) return object.keys(obj);
        var results = [];
        for(var index in obj){
            results.push(index);
        }
        return results;
    };

    __.has = function(obj, keys){
        return obj != null && obj.hasOwnProperty(keys);
    };

    __.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
})();