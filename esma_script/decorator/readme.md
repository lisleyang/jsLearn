##### 修饰方法

```typescript
function leDecorator(target, propertyKey: string, descriptor: PropertyDescriptor): any {  
////装饰器的三个参数就是Object.defineProperty的三个参数
//// Object.defineProperty(obj,'name',{value:123})


  var oldValue = descriptor.value;  //descriptor.value 就是被装饰的函数或类
  console.log(oldValue) //welcome(arg1, arg2) {console.log(`Arguments Received are ${arg1} ${arg2}`); return `${arg1} ${arg2}`;}
  console.log(target);  //{constructor: f,welcome:f} 	//类
  console.log(propertyKey)  //welcome

  descriptor.value = function () {
    //这个时候的arguments就是调用时候的实参：["World","Hello"]
    console.log(`Calling "${propertyKey}" with`, arguments, target);
    let value = oldValue.apply(null, [arguments[1], arguments[0]]);

    console.log(`Function is executed`);
    return value + "; This is awesome";
  };

  return descriptor;
}

class JSMeetup {
  speaker = "Ruban";
  
  @leDecorator
  welcome(arg1, arg2) {
    console.log(`Arguments Received are ${arg1} ${arg2}`);
    return `${arg1} ${arg2}`;
  }
}

const meetup = new JSMeetup();

console.log(meetup.welcome("World", "Hello"));
```