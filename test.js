/**
 * Created by flytinychen on 2016/10/4.
 */

var a = [1,2,3,4,5,6];
var b = {
    'hello' : 'qwe',
    'zxc' : 13,
    'cvb' : true
};
document.querySelector('#test1').innerHTML = _.map(a, function(value){return ++value;});
document.querySelector('#test2').innerHTML = __.map(a, function(value){return --value;});
document.querySelector('#test3').innerHTML = __.reduce(a, function(a,b){return a+b;});