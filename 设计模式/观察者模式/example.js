class Subject{
    constructor(){
        this.state = 0 ;
        this.observers = [];
    }

    getState(){
        return this.state;
    }

    setState(state){
        this.state = state;
        this.notifyAllObservers()
    }

    notifyAllObservers(){
        this.observers.forEach(observer=>{
            observer.update();
        })
    }

    //添加进来新的观察者
    attach(observer){
        this.observers.push(observer);
    }
}

//观察者的类
class Observer{
    constructor(name,subject){
        this.name = name;
        this.subject = subject;
        this.subject.attach(this);
    }

    update(){
        console.log(`${this.name} update , state: ${this.subject.getState()}`)
    }
}

let s  = new Subject();
let o1 = new Observer('o1',s);
let o2 = new Observer('o2',s);
s.setState(1)