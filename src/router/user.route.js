// 路由转发模块 之 用户路由router层
const Router = require('koa-router');

// 导入中间件 实例对象（如在进入控制层之前，先进行验证）
const userMiddleware = require('../middleware/user.middleware')
const uploadMiddleware = require('../middleware/upload.middleware')
const authMiddleware = require('../middleware/auth.middleware')

// 导入user的控制层
const userController = require('../controller/user.controller')

const router = new Router({ prefix: '/user' }) //配置请求前缀

// 编写接口(resful风格)
// 1注册接口 Post  /user/register
router.post('/register', uploadMiddleware.verifyUserUpload, userMiddleware.userValidator, userMiddleware.verifyUser, userMiddleware.cryptPassword, userController.register)

// 2登录接口 Post  /user/login
router.post('/login', userMiddleware.verifyLogin, userController.login)

// 3修改用户密码的接口（要携带登录后的token信息）
router.put('/', authMiddleware.auth, userMiddleware.cryptPassword, userController.changePassword)

// 4用户修改头像（需要登录和有效的token，无权限要求）
router.post('/upload', authMiddleware.auth, uploadMiddleware.verifyUserUpload, userController.upload)

// 5根据 用户 user_id 修改用户昵称，body参数
router.post('/nickname', authMiddleware.auth, userMiddleware.verifyUser, userController.updateNickname)




module.exports = router
