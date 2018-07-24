
'use strict';

//koa主要干了两件事
//一是处理中间件
//二是处理context/request/response，封装http.createServer

/**
 * Module dependencies.
 */

const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const isJSON = require('koa-is-json');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert'); //把Generatoe中间件转化成Promise中间件
const deprecate = require('depd')('koa');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

module.exports = class Application extends Emitter {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  constructor() {
    super();

    this.proxy = false;
    //存放所有中间件的数组
    this.middleware = [];

    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    //实例上的3个重要属性
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);

    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

   //app.listen就是对http.createServer的一个封装
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  //用法
  // app.use(async (ctx, next) => {
  //     // 中间件函数
  // });

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    //判断是不是Generator函数（async语法）通过Function.prototype.toString(针对function*(){})和Object.prototype.toString(针对async function(){})
    if (isGeneratorFunction(fn)) {
      //声明弃用api
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    //调试时打印日志
    debug('use %s', fn._name || fn.name || '-');
    //把中间件推到middleware数组里面
    this.middleware.push(fn);
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  //这个函数的作用是
  //为原生的http.createServer方法准备回调函数
  //原生的如下
  // http.createServer(function (request, response){
  //   response.writeHead(200, {'Content-Type': 'text/plain'});
  //   response.write("Hello World");
  //   response.end();
  // }).listen(8080, '127.0.0.1');
  callback() {
    //compose的返回结果是返回一个生成resolve状态的promise的函数，需要传递参数ctx
    //执行compose的时候 中间件还没有开始执行
    //看这个方法和下面的 handleRequest方法中的fnMiddleware 一起看
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res); //生成context
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);  //执行res.end等一系列操作；在中间件执行完之后执行
    onFinished(res, onerror);//响应结束时出发onerror回调函数（这个回调函数只是绑定了onerror事件，并没有触发）

    //在fnMiddleware(ctx)的时候执行中间件，即koa-compose中的dispatch(0)
    //fnMiddleware(ctx)的返回值是dispatch(0)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);  //这个request是koa构造的request
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;   //这个req是nodejs原生http.createServer的形参
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) { //body是空的 204/304 204:服务器成功处理，但没返回任何内容 304 not modified
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) { //类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    body = ctx.message || String(code);
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
