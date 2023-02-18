const Router = require('koa-router');
const router = new Router({ prefix: '/user' }) //配置请求前缀
const { register } = require('../controller/user.controller')

// 编写接口(resful风格)

//  Get  /user/
// router.get('/')
//  Post  /user/register
router.post('/register', register)

module.exports = router
