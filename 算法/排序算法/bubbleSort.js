//冒泡排序
//第一轮开始：6比5大，往右浮动；6比3大，继续往右浮动...6比8小，6不动，8往右浮动；8比2大，8往右浮动.....
//第一轮比较完为[5,3,1,6,7,2,4,8]
// 第二轮开始: 5比3大，往右浮动....以此类推
let arr = [6,5,3,1,8,7,2,4]

function swap(arr,index1,index2){
	let tmp;
	tmp = arr[index1];
	arr[index1] = arr[index2];
	arr[index2] = tmp;
}

for(var j=arr.length;j>=0;j--){	//外圈只是控制循环次数
	for(var i=0;i<=j-1;i++){
		if(arr[i]>arr[i+1]){
			swap(arr,i,i+1);
		}
		console.log(arr)
	}
	console.log('this turn')
	console.log(arr);
	console.log('--------')
}

console.log('final result')
console.log(arr)
console.log('-------------')