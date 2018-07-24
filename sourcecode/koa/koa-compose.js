'use strict'

/**
 * Expose compositor.
 */

module.exports = compose

//此模块可以将多个中间件合成为一个
/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  //context在application.js中的createContext中生成，并传过来
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)


    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      //fn：每个中间件函数
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        //中间件函数的第一个参数是context，第二个参数是next
        // const fn_logger = (ctx, next) => {
        //   console.log(`${Date.now()}`);
        //   next();
        // }
        //这儿是koa中间件的关键一步
        //用户只有手动调用next()方法,才会执行下一个中间件 
        //即用户在中间件执行next的时候，dispatch.bind(null, i + 1)执行
        //没有递归
        //因为next()执行完会自动执行下面的方法，所以会有控制权移交之前的中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }


  }
}
