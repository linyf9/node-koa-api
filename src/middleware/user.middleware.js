// 将在控制层的一些操作（如验证操作），封装成中间件函数，然后在router层使用，在进入控制层之前先验证
const userService = require('../service/user.service')
const errType = require('../constant/err.type')
// 操作用户的 中间件函数
class userMiddleware {
    // 验证用户是否存在 的中间件函数
    async userValidator(ctx, next) {
        const { username, password } = ctx.request.body
        // 合法性
        if (!username || !password) {
            console.error('用户名或密码为空', ctx.request.body);
            // ctx.app.emit提交错误('error', 错误对象内容，上下文对象)，会提交到app，index.js中被app.on监听
            ctx.app.emit('error', errType.userFormateError, ctx)
            return
        }
        // 如果没有出现错误，就交由下一个中间件处理（这里是异步的）
        await next()
    }

    // 
    async verifyUser(ctx, next) {
        try {
            // 合理性
            const { username } = ctx.request.body
            // 按名字查找 如果存在就不进行更下面的操作
            const res = await userService.getUserInfo({ username })
            if (res) {
                // 后端打印错误日志
                console.error('用户名已经存在', { username });
                ctx.app.emit('error', errType.userAlreadyExited, ctx)
                return
            }
        } catch (error) {
            console.error('获取用户信息错误', error);
            // 提交错误
            ctx.app.emit('error', errType.userRegisterError, ctx)
            // 出现错误之后，让它不要再执行下一个中间件
            return
        }

        await next()
    }

}
module.exports = new userMiddleware()