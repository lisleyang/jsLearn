const EventEmitter = require('events').EventEmitter;

class Dog extends EventEmitter{
    constructor(name){
        super();
        this.name = name;
    }
}

let simon = new Dog('simon');
//因为继承了EventEmitter，所以可以直接使用 on 和 emit
simon.on('bark',function(){
    console.log(this.name + 'bark');
})

setTimeout(function(){
    simon.emit('bark')
},3000)