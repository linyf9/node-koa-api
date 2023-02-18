// 主要业务管理模块

// 导入Koa
const Koa = require('koa'); // Koa是一个类，大写表示类
const { koaBody } = require('koa-body');

const app = new Koa() //因此要new操作符来返回koa实例

// 在所有请求之前注册 koaBody中间件（作用：body参数解析，会把前端传递的body(请求体数据)挂载到ctx.request.body中，支持解析 文件上传、查询字符串、普通的json数据）
app.use(koaBody())

// 全局中间件
// 在koa中app.use里只能写一个中间件函数(本质是一个函数)，而在express旧不一样
app.use((ctx, next) => {
    //ctx: context的简写，是http请求的上下文对象
    // console.log(ctx);
    // ctx.body = 'hello world' //向前端返回对应的内容
    next()
})

// 导入 用户路由模块
const userRouter = require('../router/user.route');
app.use(userRouter.routes()).use(userRouter.allowedMethods());


module.exports = app