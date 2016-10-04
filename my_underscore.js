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
        var index = !isArrayLike(obj) && __.keys(obj);
        var length = (index || obj).length;
        for(var i = 0; i < length; i++){
            var currentKey = index ? index[i] : i;
            fn(obj[currentKey], currentKey, obj);
        }
    };
    __.map = __.collect = function(obj, fn){
        var index = !isArrayLike(obj) && __.keys(obj);
        var length = (index || obj).length;
        var results = Array(length);
        for(var i = 0; i < length; i++){
            var currentKey = index ? index[i] : i;
            results[i] = fn(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    var createReduce = function(obj, fn){
        var index = !isArrayLike(obj) && __.keys(obj);
        var length = (index || obj).length;
        var results;
        for(var i = 0; i < length; i++){
            var currentKey = index ? index[i] : i;
            results = fn(results ,obj[currentKey], currentKey, obj);
        }
        return results;
    };

    __.reduce = createReduce;

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