throttle 和 debounce 是解决请求和响应速度不匹配问题的两个方案。二者的差异在于选择不同的策略。

假设间隔都是15s；

throttle : 每隔15s执行一次；
第一次请求进来马上执行。从第二次请求开始，如果下一次与上一次执行的间隔不到15s，则不执行；否则就执行。

如果间隔不够，抛弃的是后面的请求。保证每 X 毫秒恒定的执行次数，比如每200ms检查下滚动位置，并触发 CSS 动画。

debounce ： 
每次请求进来，都要等待15s，确定15s后没有新请求进来再执行。

如果有新请求，抛弃前面的请求。把触发非常频繁的事件（比如按键）合并成一次执行。

### 使用场景

debounce : input搜索框输入  调整页面大小resize

重点： 我们只关心最后一次的输入

throttle : 页面滚动检测距离底部距离，然后加载数据

这种情况下，不可能只关注最后一次即用户不再滑动的情况，而应该去限制请求的次数

```javascript
/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 * 
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数   
 */

_.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  // 上次执行时间点
  var previous = 0;
  if (!options) options = {};
  // 延迟执行函数
  var later = function() {
    // 若设定了开始边界不执行选项，上次执行时间始终为0
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = _.now();
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    if (!previous && options.leading === false) previous = now;
    // 延迟执行时间间隔
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口，应立即执行
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    //trailing=false的情况，如果不满足时间间隔，直接放弃这次请求，什么都不做
    //trailing!==false的情况，如果不满足时间间隔，等到remaining时间之后，继续这次请求；除非此时已经有请求在等待（timeout有值）
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    //这儿还有一个else 就是wait>remaining>0，并且timeout不等于null的情况
    //因为什么都不需要做，所以没有写
    return result;
  };
};

```

```javascript

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
_.debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    // 据上一次触发时间间隔
    // 频繁调用的时候，timestamp一直在更新
    var last = _.now() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
      	// 频繁调用的时候，context和args也一直在更新
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = _.now();
    var callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};


```