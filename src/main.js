// 入口文件
const koa = require('koa'); // koa是一个类
const { APP_PORT } = require('./config/config.default')

const app = new koa() //因此要new操作符来返回koa实例

// 在koa中app.use里只能写一个中间件函数(本质是一个函数)，而在express旧不一样
app.use((ctx, next) => {
    //ctx: context的简写，是http请求的上下文对象
    console.log(ctx);
    ctx.body = 'hello world' //向前端返回对应的内容
})


app.listen(APP_PORT, () => {
    console.log(`http://127.0.0.1:${APP_PORT}`);
})