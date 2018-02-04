function Queue(){
    this.dataStore = [];

    this.enQueue = enQueue;//入队
    this.quQueue = quQueue;//出队
    this.front = front; //查询队首
    this.back = back;   //查询队尾
    this.empty = empty; //是否为空队列
    this.toString = toString; //差看整个队列

    this.deQueue = deQueue;
}    
function enQueue(el){
    this.dataStore.push(el);
}

function quQueue(){
   return this.dataStore.shift();
}


function front(){
    return this.dataStore[0]
}


function back(){
   return this.dataStore[this.dataStore.length-1] 
}


function empty(){
    return this.dataStore.length==0;
}


function toString(){
    let resString = '';
    for(var i=0;i<this.dataStore.length;i++){
        resString+=this.dataStore[i] + '\n';
    }
    return resString;
}

/*var myQueue = new Queue();
myQueue.enQueue('小红');
myQueue.enQueue('小明');
myQueue.enQueue('小王');
console.log(myQueue.toString())*/


//优先队列

function Patient(name,code){
    this.name = name;
    this.code = code;
}

function deQueue(){
    var priority = 0;

    for(var i=0;i<this.dataStore.length;i++){
        if(this.dataStore[i].code>this.dataStore[priority].code){
            priority = i;
        }
    }

    return this.dataStore.splice(priority,1);

}

function toString(){
    let resString = '';
    for(var i=0;i<this.dataStore.length;i++){
        resString+=this.dataStore[i].name + ' code:'+this.dataStore[i].code + '\n';
    }
    return resString;
}

var myQueue1 = new Queue();
myQueue1.enQueue(new Patient('小红',5));
myQueue1.enQueue(new Patient('小明',2));
myQueue1.enQueue(new Patient('小王',8));
console.log(myQueue1.toString())
console.log(myQueue1.deQueue())
console.log(myQueue1.deQueue())
console.log(myQueue1.deQueue())