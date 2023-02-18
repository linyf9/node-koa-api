const { createUser } = require('../service/user.service')
// 定义 用户控制器 类，将对用户的所有操作(方法) 都封装到该 类的实例( new UserController() )上
class UserController {
    // 为什么要加上async呢，因为数据库操作是异步的
    async register(ctx, next) {
        // 1. 获取前端传递的数据(ctx.request.)
        console.log(ctx.request.body);
        const { username, password } = ctx.request.body

        // 2. 操作数据库(如果操作复杂，可以抽离到service文件夹中)
        //因为create方法返回的是一个Promise，所以可以等待成功的结果
        const res = await createUser(username, password) 

        // 3. 向前端返回结果
        ctx.body = res
    }
}


module.exports = new UserController()