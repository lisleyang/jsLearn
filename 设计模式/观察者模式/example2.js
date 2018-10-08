//EventEmitter是一个比较底层的东西 基本上不会手动调用

const EventEmitter = require('events').EventEmitter;

const emitter1 = new EventEmitter();

//监听some事件
emitter1.on('some',function(){
    console.log('sth isoccured 1')
})

//监听some事件
emitter1.on('some',function(){
    console.log('sth isoccured 2')
})

emitter1.emit('some')