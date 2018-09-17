class Email{
    public email : string;
    constructor(email:string){
        if(this.validateEmail(email)){
            this.email = email;
        }else{
            throw new Error('Invalid Email')
        }
        
    }
    validateEmail(email:string){
        return /^\S+@\S+\.\S+$/.test(email)
    }
}

class Person{
    public name :string;
    public age :number;
    public email : Email;
    constructor(name:string,age:number,email:Email){
        this.name = name;
        this.age = age;
        this.email = email;
    }
}

let zhangsan = new Person('张三',13,new Email('fff@fang.com'))