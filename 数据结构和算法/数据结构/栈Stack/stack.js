function Stack(){
    this.dataStore = [];    //保存栈内元素
    //top相当于指针
    this.top = 0;   //标记可以插入新元素的位置（即栈顶的位置）进栈时变大 出栈时变小
    this.push = push;   //入栈
    this.pop = pop; //出栈
    this.peek = peek;   //返回栈顶元素
    this.clear = clear; //清空栈
    this.length = length;
}

function push(element){
    this.dataStore[this.top++] = element;
}
function pop(){
    return this.dataStore[--this.top];
}

function peek(){
    return this.dataStore[this.top-1];
}
function clear(){
    //因为有top作为指针 所以不用清空
    this.top = 0;
}
function length(){
    return this.top;
}

var s = new Stack();
s.push('小红1');
s.push('小李2');
s.push('小王3');

console.log('栈长度',s.length());
console.warn('栈顶',s.peek());
console.warn('出栈',s.pop());
console.log('栈长度',s.length());