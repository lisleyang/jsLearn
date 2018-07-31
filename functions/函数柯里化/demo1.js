function curry(fn, args) {
    var length = fn.length;

    args = args || [];

    return function() {

        var _args = args.slice(0),

            arg, i;

        for (i = 0; i < arguments.length; i++) {

            arg = arguments[i];

            _args.push(arg);

        }
        if (_args.length < length) {
            //和参数数量不一样就递归
            return curry.call(this, fn, _args);
        }
        else {
            //和参数数量一样以后就执行回调函数
            return fn.apply(this, _args);
        }
    }
}


var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a")("b")("c") // ["a", "b", "c"]