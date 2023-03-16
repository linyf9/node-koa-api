// 主要业务管理模块
const path = require('path')
// 导入Koa
const Koa = require('koa'); // Koa是一个类，大写表示类
const cors = require('koa2-cors');
const KoaStatic = require('koa-static');
const { koaBody } = require('koa-body');

const app = new Koa() //因此要new操作符来返回koa实例

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
  await next();
});

app.use(cors({
      origin: function(ctx) { //设置允许来自指定域名请求
        //   if (ctx.url === '/test') {
              return '*'; // 允许来自所有域名请求
        //   }
        //   return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
      },
    //   maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, //是否允许发送Cookie
    //   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    //   allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
})
)

// 导入统一处理错误的中间件函数
const errHandler = require('./errHandler')

// 导入统一处理的路由模块，并注册（实现了自动加载所有路由）
const router = require('../router/index')



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