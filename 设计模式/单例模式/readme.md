## 介绍

保证一个类仅有一个实例，并提供一个访问它的全局访问点。

## 实际应用场景

* 登录框
* 购物车
* redux和vuex中的store

## 代码演示

示例一 ：java实现一个完整的单例模式

```java
public class SingleObject{
    //私有化构造函数，只能内部new，不能外部new
    //目的是不让它通过new的方式来生成实例，而是通过getInstance
    private SingleObject(){

    }
    //唯一被new出来的对象
    private SingleObject instance = null;

    //获取对象的唯一接口
    public SingleObject getInstance(){
        if(instance == null){
            //只new一次
            return new SingleObject()
        }else{
            return instance;
        }
    }

    public void login(){
        
    }
}

public class SingletonPatternDemo{
    public static void main(String[] args){
        //注释部分为不合法的构造函数
        //编译时错误 ： 构造函数SingleObject是不可见的

        // SingleObject object = new SingleObject()

        //  获取唯一可用的对象
        SingleObject object = SingleObject.getInstance();

        object.login()
    }
}

```

示例二：js单例模式的简单实现

```javascript
class SingleObject{
    login(){
        console.log('loging in');
    }
}

SingleObject.getInstance = (function(){
    let instance;
    return function(){
        if(!instance){
            instance = new SingleObject()
        }

        return instance;
    }
})()

//以下这种写法是不可以的 因为重复执行了 let instance这句话
// SingleObject.getInstance = function(){
//     let instance;
//     return (function(){
//         if(!instance){
//             instance = new SingleObject()
//         }

//         return instance;
//     })()
// }

let obj1 = SingleObject.getInstance();
let obj2 = SingleObject.getInstance();
console.log(obj1 === obj2 )     //true

let obj3 = new SingleObject()   //js没有private，所以可以new
console.log(obj1 === obj3)      //false，并不是同一个实例

```

## 通用的单例模式(惰性)

```js
//参数fn里面的代码永远只执行一次
var getSingle = function(fn){
    var result;

    return function(){
        return result || (result = fn.apply(this,arguments))
    }
}

var createLoginContainer = function(){
    var div = document.createElement('div');
    div.innerHTML = '浮窗';
    div.style.display = "none";
    document.body.append(div);
    return div;
}

var createSingleLoginLayer = getSingle(createLoginContainer);

document.getElementById('loginBtn').onclick = function(){
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.dispplay = 'block';
}

```