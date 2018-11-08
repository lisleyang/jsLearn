# 一. 资源合并与压缩

* html,css,js的压缩
* css,js的合并

# 二. 图片优化

## 不同格式的图片常见的业务场景

* jpg有损压缩，压缩率高，不支持透明。适合大部分不需要透明图片的业务场景。
* png支持透明，浏览器兼容性好。适合大部分需要透明图片的业务场景。
* webp压缩程度更好(比jpg要小得多)，但在ios webview有兼容性问题。适合安卓全部。
* svg矢量图，代码内嵌，相对较小。适合图片样式相对简单的场景。
* gif支持动画

webp具有更优的图像数据压缩算法，能带来更小的图像体积，而且拥有肉眼识别无差异的图像质量，并且同时具备了无损和有损的压缩模式，Alpha透明以及动画的特性。

## 优化方法

* 图片压缩（tinypng.com,zhitu.isux.us,构建工具比如gulp-imagemin）。
* 雪碧图。注意不要把所有icon放到同一张图片上，否则会加载较慢，注意分成多个雪碧图。一般设计来处理。(线上生成雪碧图spritecow.com)
* Image Inline（gulp-base64）。image-inline实际会比单独img+原文件更大一点儿，但是会减少一次http请求。
* 矢量图。使用SVG进行矢量图的绘制；使用iconfont（www.iconfont.cn）解决icon的问题。

# 三. css与js的装载与执行过程中的优化

## ① html解析过程中的一些特点

#### 1. 并行加载，顺序执行。

1. 拿到html以后从上到下进行解析，生成dom树；html解析过程中遇到外部资源就去请求外部资源。
2. 拿到css以后进行解析，生成css树;
3. 两个树都生成完以后，进行页面的渲染；css的加载（如果还没加载回来）会阻塞页面的渲染（阻塞渲染不是阻塞解析），js的加载也会阻塞页面的渲染（除去async，defer）。`这就是为什么引用出问题的cdn，页面会一直不出来的原因，渲染被阻塞了`

对单个域名，并发加载数是有限的。这也是cdn存在的原因之一。

#### 2. 阻塞方式

##### 1. css阻塞

* css在head中，通过link引入的话，会阻塞页面的渲染。必须等相应的css加载完之后才会进行相应的渲染，这样渲染就会带样式了。（如果直接写在页面里就是页面渲染的一部分了）
* css会阻塞js的执行。在css加载完之前，后续js的执行是会被阻塞的。因为js可能会操作dom，会用到css。
* css不阻塞外部脚本的加载。加载是不会阻塞的，只会阻塞执行。

#### 2. js阻塞

* 直接引入js(即直接通过script src的方式，不加async，defer)会阻塞页面的渲染；因为js很可能回去修改文档结构，比如document.write。
* js不阻塞资源的加载（webkit有个类似预先扫描器的东西）
* js顺序执行，阻塞后续js逻辑的执行。是为了保证依赖关系。

#### 3. 引入方式

##### js引入方式

* 直接引入（不加async，defer）。会阻塞页面的渲染。
* defer。表明脚本在执行的时候不会影响页面的构造，也就不会阻塞页面渲染。脚本会被延迟到整个页面都解析完毕再运行。即相当于告诉浏览器立即下载，但延迟执行。同时与async不同的是，脚本是按顺序执行的。
* async。同defer，但是标记为async的脚本并不保证按照指定他们的先后顺序执行。要保证他们之间相互不依赖。
* 异步动态引入js

defer是在dom树构建完成后才回去执行代码，async则不保证，他是脚本加载完成以后立刻执行。

## ② 加载执行过程中的一些优化点

* css样式表置顶。会阻塞压面渲染，保证页面渲染过程中是有样式的。
* 用link代替import。import不会触发浏览器并发机制；同时在整个页面渲染完成之后才会去做import，相当于把css写在了页面最底端。@import一般用来做css的模块化，所以在构建工具中可用，会一起打包。
* js脚本置底。因为会阻塞。
* 合理使用js异步加载的能力。

# 四. 懒加载和预加载

## 懒加载

当我们的图片进入可视区域，去请求资源；

需要去监听scroll事件，去判断我们懒加载的图片是否进入可视区域

```html
<img src="" lazyload="true" data-origin="./a.jpg">
```
```javascript
var viewportHeight = document.documentElement.clientHeight; //可视区域高度
function lazyLoad(){
    var eles = document.querySelectorAll("img[lazyload=true][data-origin]");
    Array.prototype.forEach.apply(eles,function(item,index){
        var rect;
        if(item.dataset.origin=='') return;
        rect = item.getBoundingClientRect();

        //rect.top < viewportHeight说明进入了可视区域
        //rect.bottom>=0防止可视区域上方图片的加载
        if(rect.bottom>=0 && rect.top < viewportHeight){
            !function(){
                var img = new Image();
                img.src = item.dataset.url;
                img.onload = function(){
                    item.src = img.src;
                }
            }()
        }
    })
}

lazyLoad()
document.addEventListener("scroll",lazyLoad);
```

## 预加载

preload.js

方法一:

```javascript
var oImg = new Image();
oImg.src = "https://www.baidu.com/img/bd_logo1.png"
```

方法二: 使用XMLHttpRequest


# 重绘与回流
