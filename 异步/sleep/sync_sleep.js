let sleep = function(time){
	let oDate  = new Date();
	console.log('sleeping');
	while(new Date() - oDate < time*1000){

	}
	return;
}

console.log('before Sleep');
sleep(3)
console.log('after Sleep');