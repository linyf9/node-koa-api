const Router = require('koa-router');

// 导入中间件（如在进入控制层之前，先进行验证）
const userMiddleware = require('../middleware/user.middleware')
// 导入user的控制层
const userController = require('../controller/user.controller')

const router = new Router({ prefix: '/user' }) //配置请求前缀

// 编写接口(resful风格)
// 注册接口 Post  /user/register
router.post('/register', userMiddleware.userValidator, userMiddleware.verifyUser,userController.register)
// 登录接口 Post  /user/login
router.post('/login', userController.login)

module.exports = router
