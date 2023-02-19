const userService = require('../service/user.service')
const errType = require('../constant/err.type')
// 定义 用户控制器 类，将对用户的所有操作(方法) 都封装到该 类的实例( new UserController() )上
class UserController {
    // 为什么要加上async呢，因为数据库操作是异步的
    // 用户注册
    async register(ctx, next) {
        try {
            // 1. 获取(解析)前端传递的数据(ctx.request.)
            // console.log(ctx.request.body);
            const { username, password } = ctx.request.body
            // 2. 操作数据库(如果操作复杂，可以抽离到service文件夹中)
            //因为create方法返回的是一个Promise，所以可以等待成功的结果
            const res = await userService.createUser(username, password) 
            // console.log(res);
            // console.log(ctx.body);
            // 3. 向前端响应结果
            return ctx.body = {
                code: 200, //表示成功
                message: "用户注册成功",
                data: {
                    id: res.id,
                    username: res.username
                }
            }
        } catch (error) {
            // 提交错误
            ctx.app.emit('error', errType.userRegisterError ,ctx)
        }

        
    }

    // 用户登录
    async login(ctx, next) {
        ctx.body = '登录成功'
    }
}


module.exports = new UserController()