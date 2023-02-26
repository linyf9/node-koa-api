// 主要业务管理模块
const path = require('path')
// 导入Koa
const Koa = require('koa'); // Koa是一个类，大写表示类
const KoaStatic = require('koa-static');
const { koaBody } = require('koa-body');

// 导入统一处理错误的中间件函数
const errHandler = require('./errHandler')

// 导入统一处理的路由模块，并注册（实现了自动加载所有路由）
const router = require('../router/index')

const app = new Koa() //因此要new操作符来返回koa实例

// 在所有请求之前注册 koaBody中间件（作用：body参数解析，会把前端传递的body(请求体数据)挂载到ctx.request.body中，支持解析 文件上传、查询字符串、普通的json数据）
app.use(koaBody({
    multipart: true, //开启文件上传
    formidable: {
        uploadDir: path.join(__dirname, '../upload'), //文件上传后会保存到哪个文件夹中，这样写就是保存到当前文件的上一级upload文件夹中
        keepExtensions: true, //显示后缀名
    }
}))

// 将upload文件夹当做静态资源访问文件夹
app.use(KoaStatic(path.join(__dirname, '../upload')))

// 统一注册 所有路由模块
app.use(router.routes()).use(router.allowedMethods())

// 在最后这里，统一处理（监听error事件）错误
app.on('error', errHandler)

module.exports = app