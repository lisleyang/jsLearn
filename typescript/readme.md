**概念**

* Typescript通过向Javascript增加可选的静态类型声明来把Javscript变成强类型的程序语言
* 可选的静态类型声明可约束函数，变量，属性等程序实体，这样编译器和相应的开发工具就可以在开发过程中提供更好的正确性验证和智能感知

### 静态类型声明与静态类型推导
```javascript
var counter = 0;	/*没有类型声明，Typescript会根据赋值来推测变量的类型。自动推断出类型是number*/
counter = 'asd';	/*类型变了，会报错*/

let a:any = 0;
a = '你好啊';	/*会报错*/

var count;	/*无法推断，类型为any*/
```
### 基本类型

基本类型有boolean,number,string,**array**,void和所有用户自定义的enum类型。所有这些类型在Typescript中 ，都是一个唯一的顶层的Any Type类型的子类型，any关键字代表这种类型。

在Typescript中，我们不能把null或undefined当作类型使用

##### Array类型的声明

array类型的声明有两种写法。一是可以在数组元素的类型后面跟着[]来表示包含这种类型元素的数组
```typescript
var list:number[] = [1,2,3];
```
第二种是使用范型数组类型Array
```typescript
var list:Array<number> = [1,2,3]
```

如果数组里混合了各种类型
```typescript
var list:any[] = [1,'asd',true];
list[1] = 100

//也可以这么写（联合类型）
var list:Array<number|string|boolean> = [1,'asd',true];
```

##### enum类型的声明
enum类型是为了给一个数字集合更友好的命名。enum类型中的成员默认从0开始，但你也可以手动设置成员中的值来更改这种默认行为。
```typescript
enum Color {Red,Green,Blue}
var c:Color =Color.Green
```
会编译为如下代码
```typescript
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;

/*{0: "Red", 1: "Green", 2: "Blue", Red: 0, Green: 1, Blue: 2}*/
```

##### 从某种程度上，any的对立面就是void，即所有类型都不存在的时候。你会在一个函数没有返回值的时候看到它。
```typescript
function warnUser:void(){
	alert('asd');
}
```
### 联合类型 

Typescript允许联合类型
```typescript
var path:string[]|string;
path = '/temp'
path = ['/temp','/temp1'];
path = 1 	/*错误*/
```

### 类型别名

Typescript允许使用type关键字声明类型别名
```typescript
type PrimitiveArray = Array<string|number|boolean>;
type myNumber = number;
type CallBack = ()=>void;
```

### 环境声明

环境声明允许在Typescript中创建一个**不会被编译到Javascript中的变量。**

```typescript
customerConsole.log('asd'); //报错 Can't find name customerConsole
```
```typescript
interface ICustomerConsle{
    log(arg:string):void
}
declare var customeConsole:ICustomerConsle;

customeConsole.log('asd')
```



## jQuery拓展插件声明文件

```javascript
/*这是$.myPlugin静态方法的拓展*/

interface MyPlugin {
    settings: MyPluginSettings;
    
    (behavior: 'enable'): JQuery;
    (settings?: MyPluginSettings): JQuery;
}

interface MyPluginSettings {
    title?: string;
}

interface JQueryStatic {
    myPlugin: MyPlugin;
}

$.myPlugin({title:'asd'})

/*这是$().实例方法的拓展*/
interface JQuery{
    cxCalendar():void
}
$("#box").cxCalendar()
```