// 将在控制层的一些操作（如验证操作），封装成中间件函数，然后在router层使用，在进入控制层之前先验证
const path = require('path')
const fs = require('fs')
const bcrypt = require("bcryptjs")
const userService = require('../service/user.service')
const errType = require('../constant/err.type')

// 用户 中间件 Middleware层
// 操作用户的 中间件函数
class UserMiddleware {
    // 注册时，验证用户名 或 密码 或 昵称为空 是否为空 的中间件函数
    async userValidator(ctx, next) {
        // 注册时的 user对象{user_name, nickname, password, user_avatar}
        const { user_name, password, nickname } = ctx.request.body
        const { user_avatar='' } = ctx.request.files
        // 合法性
        if (!user_name || !password || !nickname) {
            console.error('用户名或密码或昵称为空', ctx.request.body);
            fs.unlinkSync(path.join(__dirname, '../upload', path.basename(user_avatar.filepath)))
            // ctx.app.emit提交错误('error', 错误对象内容，上下文对象)，会提交到app，index.js中被app.on监听
            return ctx.app.emit('error', errType.userFormateError, ctx)
        }
        // 如果没有出现错误，就交由下一个中间件处理（这里是异步的）
        await next()
    }

    // 验证 用户是否存在的 中间件
    async verifyUser(ctx, next) {
        try {
            // 合理性
            
            const { user_name, nickname } = ctx.request.body
            if (user_name && user_name !== '') {
                // 按名字查找 如果存在就不进行更下面的操作
                const res1 = await userService.getUserInfo({ user_name })
                if (res1) {
                    // 后端打印错误日志
                    console.error('用户名已经存在', { user_name });
                    return ctx.app.emit('error', errType.userAlreadyExited, ctx)
                }
            }
            
            if (nickname && nickname !== '') {
                const res2 = await userService.getUserInfo({ nickname })
                if (res2) {
                    // 后端打印错误日志
                    console.error('用户昵称已经存在', { nickname });
                    return ctx.app.emit('error', errType.userNickAlreadyExited, ctx)
                }
            }
            
        } catch (error) {
            console.error('获取用户信息失败', error);
            // 提交错误
            return ctx.app.emit('error', errType.userRegisterError, ctx)
            // 出现错误之后，让它不要再执行下一个中间件
        }

        await next()
    }

    // 将 注册或登录时 的 明文密码 进行加密 的中间件
    async cryptPassword(ctx, next) {
        const { password } = ctx.request.body;
        // 加密的俩步骤
        const salt = bcrypt.genSaltSync(10); //加盐10次
        const hash = bcrypt.hashSync(password, salt); //传入明文密码和加盐，合并为hash（密文）
        ctx.request.body.password = hash

        // 再交给下一个中间件
        await next()
    }

    // 验证 用户名 是否存在，密码 是否正确 才登录
    async verifyLogin(ctx, next) {
        const { user_name, password } = ctx.request.body
        try {
            if (!user_name || !password) {
                console.error('用户名或密码为空', ctx.request.body);
                // ctx.app.emit提交错误('error', 错误对象内容，上下文对象)，会提交到app，index.js中被app.on监听
                return ctx.app.emit('error', errType.userFormateError12, ctx)
            }
            // 判断用户是否存在（不存在就报错）可以根据用户名去查找
            const res = await userService.getUserInfo({ user_name })
            if (!res) {
                console.error('用户名不存在', { user_name });
                return ctx.app.emit('error', errType.userDoseNotExist, ctx)
            }
            // 判断用户密码是否与数据库中的匹配（不匹配就报错）
            if (!bcrypt.compareSync(password, res.password)) { //表示与不匹配
                return ctx.app.emit('error', errType.invalidPassword, ctx)
            }
        } catch (error) {
            console.error('用户登录失败', error);
            return ctx.app.emit('error', errType.userLoginError, ctx)
        }
        await next()
    }

}
module.exports = new UserMiddleware()