* then 只是把callback拆分了；
* async/await才是最直接的同步的写法(没有回调函数)

可以理解为Promise做了一层封装，然后既可以使用then，也可以使用await；

谨记：任何写法的改变，都改变不了js单线程的本质（防止渲染冲突=>js单线程=>异步=>eventloop=>Promise/async/await）

then的写法

```js
//then拆分成两份
function loadImg(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}

loadImg('https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super').then(res=>{
    console.log(res)
    return loadImg('https://pic1.zhimg.com/v2-710f6f5f059fcc0d88e1e1c6ac91e564_im.jpg')
}).then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err)
})
```

async/await写法

```js
function loadImg(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}

const load = async function(){
    const result1 = await loadImg('https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super');
    console.log(result1)
    const result2 = await loadImg('https://pic1.zhimg.com/v2-710f6f5f059fcc0d88e1e1c6ac91e564_im.jpg');
    console.log(result2)
}

load()

```

* await后面跟的是Promise实例；
* 需要`babel-polyfill`