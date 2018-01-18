function sleep(time,callback){
	setTimeout(function(args) {
		callback()
	}, time*1000)
}

console.log(1);
sleep(3,function(){
	console.log(123)
})
console.log(2)