## 什么是virtual-dom

Dom操作是很昂贵的

* 用js模拟DOM结构
* Dom变化的对比，放到js层来做(diff算法)
* 提高重绘性能

```html
<ul id="list">
    <li class="item">Item1</li>  
    <li class="item">Item2</li>
</ul>
```
转化为virtual-dom

```javascript
{
    tag : 'ul',
    attrs : {
        id : 'list'
    },
    children : [
        {
            tag : 'li',
            attrs : {
                className : 'item'
            },
            children : ['Item1']
        },
        {
            tag : 'li',
            attrs : {
                className : 'item'
            },
            children : ['Item2']
        }
    ]
}

```

snabbdom里可以通过h方法直接生成Vdom，vue里面是先生成AST，然后转化成VDom的，然后在通过patch方法里的diff算法

## 为什么使用diff算法

* dom操作是昂贵的，因此必须减少dom操作；
* 找出本次dom必须更新的节点进行更新，其他的不更新
* 这个找出的过程，就是diff算法

## diff实现过程

* patch(container,vNode)和patch(vNode,newVnode)
* createElement
* updateChildren

## patch方法中，根据vnode创建真实dom节点（首次玄坛）

patch(elem,vNode)

```js
function createElement(vnode){
    var tag = vnode.tag;
    var attrs = vnode.attrs||{};
    var children = vnode.children||[]

    if(!tag){
        return null
    }

    var elem = document.createElement(tag);

    var attrName
    for(attrName in attrs){
        if(attrs.hasOwnProperty(attrName)){
            elem.setAttribute(attrName,attrs[attrName])
        }
    }

    children.forEach(childNode=>{
        //递归调用 创建子元素
        elem.append(createElement(childNode))
    })

    return elem;
}

```

## patch方法中，比较前后两次vnode并更新

主要就是遍历加递归

patch(vNode,newVnode)
```js
function updateChildren(vnode,newVnode){
    let children = vnode.children;
    let newChildren = newVnode.children;

    children.forEach(function(child,index){
        var newChild = newChildren[index];
        if(newChild==null) return;
        if(newChild.tag == child.tag){
            updateChildren(child,newChild)
        }else{
            replaceChild(child,newChild)
        }
    })

}
```