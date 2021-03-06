//在mergePromise内部写出代码
//打印结果为 ： 1 2 3 done [1,2,3]

const timeout = ms=> new Promise(resolve=>{
	setTimeout(()=>{
		resolve()
	},ms)
});

const ajax1 = () => timeout(2000).then(()=>{
		console.log(1);
		return 1;
});

const ajax2 = () => timeout(1000).then(()=>{
	console.log(2);
	return 2;
})

const ajax3 = () => timeout(2000).then(()=>{
	console.log(3);
	return 3;
})

const mergePromise = async (ajaxArray)=>{
}

mergePromise([ajax1,ajax2,ajax3]).then(data=>{
	console.log('done');
	console.log(data);
})