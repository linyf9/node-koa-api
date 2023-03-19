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
// 1.注册接口 Post  /user/register （但是真正的后台管理员是不用注册的，这只是方便插条管理员的数据到数据库中，前台登录的话可以不用上传头像）
router.post('/register', uploadMiddleware.verifyUserUpload, userMiddleware.userValidator, userMiddleware.verifyUsername, userMiddleware.verifyUser, userMiddleware.cryptPassword, userController.register)

// 后台添加用户（会默认设置密码为123456）
// router.post('/register', uploadMiddleware.verifyUserUpload, userMiddleware.userValidator, userMiddleware.verifyUsername, userMiddleware.verifyUser, userMiddleware.cryptPassword, userController.register)

// 1.1前台注册接口
router.post('/front/register', userMiddleware.frontuserValidator, userMiddleware.frontverifyUsername, userMiddleware.frontverifyUser, userMiddleware.frontcryptPassword, userController.frontRegister)

// 2.登录接口 Post  /user/login
router.post('/login', userMiddleware.userLoginValidator, userMiddleware.verifyUsername, userMiddleware.verifyLogin, userController.login)

// 3. 后台用户登录后，修改头像（需要登录和有效的token，无权限要求）
router.post('/upload', authMiddleware.auth, uploadMiddleware.verifyUserUpload, userController.upload)

// 4. 登录后，修改用户密码的接口（要携带登录后的token信息）
// router.put('/', authMiddleware.auth, userMiddleware.cryptPassword, userController.changePassword)
// 通过手机号，进行修改密码
router.put('/', authMiddleware.auth, userMiddleware.cryptPassword, userController.updatePassword)

// 5. 根据 用户 user_id 修改用户昵称，body参数
router.post('/nickname', authMiddleware.auth, userMiddleware.verifyUser, userController.updateNickname)

// 6. 未登录，但是有账号，用户忘记密码了，点击忘记密码，通过手机号，进行修改密码
router.post('/update/password', userMiddleware.cryptPassword, userController.updatePassword)


// 7. 后台修改 用户名或昵称
router.post('/admin/update', authMiddleware.author, userMiddleware.frontverifyUsername, userController.updateName)

// 8. 删除用户
router.delete('/admin/delete/:user_id',authMiddleware.author,userController.deleteUser)

// 9. 后台获取所有用户信息（除了管理员）
router.get('/all', userController.getAllUsers)



module.exports = router
