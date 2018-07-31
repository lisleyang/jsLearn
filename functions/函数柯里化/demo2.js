//要求满足 plus(1)(1)(2)(3)(5).toString() == 12;
//plus(1)(4)(2)(3).toString() = 10；

// function plus(num){
// 	//必须采用闭包来保存之前运算结果
// 	let arr = [];
// 	arr.push(num)

// 	let _adder = function(){
// 		arr = [].concat.call( arr, [].slice.call(arguments,0));
// 		console.log([].slice.call(arguments,0))

// 		return _adder
// 	}
// 	//必须有这么个toString函数 因为之前返回的都是function 不是数字
// 	_adder.toString = function(){
// 		return arr.reduce((prev,curr)=>prev + curr);
// 	}

// 	return _adder;
// }

// console.log(plus(1)(2)(3).toString())

function plus(num) {
    var _args = [];
    var _adder = function _adder() {
        [].push.apply(_args, [].slice.call(arguments));
        return _adder;
    };

    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }

    return _adder(num);
}
console.log(plus(1)(2)(3).toString())

module.exports = plus;