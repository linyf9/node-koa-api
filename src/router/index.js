// 该模块管理所有路由模块的统一导出
const fs = require('fs')
const Router = require('koa-router')
const router = new Router()

// fs.readFileSync(__dirname) 读取当前目录下的所有文件，但是要排除index.js
fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        let r = require('./' + file)
        router.use(r.routes())
    }
})

module.exports = router