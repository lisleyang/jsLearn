## 介绍

* 将new操作符单独封装
* 遇到new时，就应该考虑是否使用工厂模式

## 代码演示

```js

class Product{
    constructor(name){
        this.name = name;
    }
    init(){
        alert('init')
    }
    fn1(){
        alert('fn1')
    }
    fn2(){
        alert('fn2')
    }
}

//Creator就是个工厂
class Creator{
    constructor(name){
        return new Product(name)
    }
}
let create = new Creator()

```

## 应用场景

#### 场景一： jQuery

```js
clas jQuery{
    constructor(selector){

    }

    append(){

    }

    addClass(){

    }
}

window.$ = jQuery = function( selector, context ) {
    return new jQuery( selector, context );
}

```

$()与new $()的区别

* 书写麻烦，jquery的链式操作将成为噩梦
* 一旦jQuery的名称发生变化，结果将是灾难性的

#### 场景二： React

```js

class Vnode{

}

React.createElement = function(tag,attrs,children){
    return new Vnode()
}

```