/*
 * @Author: summer
 * @Date: 2019-08-04 12:50:27
 * @LastEditTime: 2019-08-04 19:08:13
 * @LastEditors: Do not edit
 * @Description: 
 */

const EventEmitter = require('events')

const http = require('http');

let context = require('./context');

let request = require('./request');

let response = require('./response');



class App extends EventEmitter {
    constructor(){
        super()
        this.middlewares = [];
        this.callbackFun;
        this.context = context;
        this.request = request;
        this.response = response;        
    }
    // 开启server 并传入callback
    listen(...arg){
        let server = http.createServer(this.callback())
        server.listen(...arg)
    }
    // 挂载 callback
    // use(fn){
    //     this.callbackFun = fn
    // }

    //  
    /**
     * @description: 挂载中间件
     * @param {type} 
     * @return: 
     */
    use(middleware){
        this.middlewares.push(middleware)
    }

    /**
     * @description:  中间件合并
     * @param {type} 
     * @return: 
     */
    compose(){
        // 将middlewares合并为一个函数，该函数接收一个ctx对象
        return async ctx => {
            function createNext(middleware, oldNext){
                return async () => {
                    await middleware(ctx, oldNext)
                }
            }
            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve()
            }
            for(let i=len - 1; i >= 0; i--){
                let currentMiddle = this.middlewares[i];
                next = createNext(currentMiddle, next)
            }
            await next()
        }
    }
    // http server callback
    callback(){
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            let onerror = (err) => this.onError(err, ctx)
            let fn = this.compose();
            return fn(ctx).then(respond).catch(onerror)
        }
    }
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    createContext(req, res){
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx
    }
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    responseBody(ctx){
        let content = ctx.body;
        if(typeof content === 'string'){
            ctx.res.end(content)
        }else if(typeof content === 'object'){
            ctx.res.end(JSON.stringify(content))
        }
    }
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    onError(err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        }
        else {
            ctx.status = 500;
        }
        let msg = err.message || 'Internal error';
        ctx.res.end(msg);
        // 触发error事件
        this.emit('error', err);
    }
}

module.exports = App 