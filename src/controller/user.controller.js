const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const userService = require('../service/user.service')
const errType = require('../constant/err.type')
const { JWT_SECCET } = require('../config/config.default')
const { APP_DURL } = require('../config/config.default')

// 用户 控制器Controller层
// 定义 用户控制器 类，将对用户的所有操作(方法) 都封装到该 类的实例( new UserController() )上
class UserController {
    // 为什么要加上async呢，因为数据库操作是异步的
    // 1用户注册（需要校验用户名，密码，头像） 管理员另外设置
    async register(ctx, next) {
        try {
            // 1. 获取(解析)前端传递的数据(ctx.request.)
            // 注册时的 user对象{user_name, nickname, password, user_avatar}
            const { user_avatar } = ctx.request.files //拿到上传图片的字段,这里有s，表示可以同时上传多张
            const user = { is_admin: 0, ...ctx.request.body, user_avatar: `${APP_DURL + path.basename(user_avatar.filepath)}` }
            // console.log(user);

            // 2. 操作数据库(如果操作复杂，可以抽离到service文件夹中)
            //因为create方法返回的是一个Promise，所以可以等待成功的结果
            const res = await userService.createUser(user) 

            // 3. 向前端响应结果
            return ctx.body = {
                code: 200, //表示成功
                message: "用户注册成功",
                data: {
                    user_id: res.user_id,
                    user_name: res.user_name,
                    nickname: res.nickname,
                    user_avatar: res.user_avatar,
                    is_admin: res.is_admin //0表示不是管理员，1表示是管理员，布尔值
                }
            }
        } catch (error) {
            console.error('用户注册失败', error);
            // 提交错误
            return ctx.app.emit('error', errType.userRegisterError ,ctx)
        }

        
    }

    // 2用户登录
    async login(ctx, next) {
        const { user_name } = ctx.request.body
        try {
            // 1. 获取用户信息（在token的payload中，会记录id, username, is_admin）
            const res = await userService.getUserInfo({ user_name })
            // 从res中解构出俩部分，一部分是password，剩下属性都通过...放在resUser对象中
            // 也就是可以从返回的结果中剔除掉password
            const { password, ...resUser } = res 
            // console.log(resUser);
            return ctx.body = {
                code: 200,
                message: '登录成功',
                // jwt.sign(payload对象, 加密字符串, { expiresIn: '1d' }设置过期时间为1天) 方法会返回一个token字段（三部分组成，三部分刚好是jwt.sign方法的参数）
                token: jwt.sign(resUser, JWT_SECCET, { expiresIn: '90d' })
            }
        } catch (error) {
            console.error('用户登录失败', error);
            return ctx.app.emit('error', errType.userLoginError, ctx)
        }  
    }

    // 3用户通过用户id 修改 密码 （通过已登录的ctx.state.user.user_id的id来操作，所以要先登录）
    async changePassword(ctx, next){
        // 1. 获取数据
        const user_id = ctx.state.user.user_id
        const password = ctx.request.body.password //用户传入的密码，最新的加密密码
        // console.log(id, password);
        // 2. 操作数据库（当输入新密码时，根据这个用户登录后的id来修改密码）
        try {
            if (await userService.updateById({ user_id, password })) {
                // 3. 返回数据
                return ctx.body = {
                    code: 200,
                    message: '修改密码成功',
                    data: ''
                }
            }
        } catch (error) {
            console.error('修改密码失败', error);
            return ctx.app.emit('error', errType.updatePasswordError, ctx)
        }
        
    }

    // 管理员根据用户删除用户，删除的同时应该也要把本地图片等资源也删除（还是别删除用户了！）

    // 4用户 修改头像 （通过已登录的ctx.state.user.user_id的id来操作，所以要先登录）
    async upload(ctx, next) {
        // 这就要求前端，传入的参数是avatar头像字段名
        // console.log('sfdgfhjhgfsd',ctx.request.files);
        // console.log('tgcvgytghb',user_id,user_avatar );
        try {
            // 1. 拿到数据
            const user_id  = ctx.state.user.user_id //从登录后的用户，获取id，从而修改(上传)用户头像
            let { user_avatar } = ctx.request.files //拿到上传图片的字段,这里有s，表示可以同时上传多张
            user_avatar = `${APP_DURL + path.basename(user_avatar.filepath)}`
            // 2. 操作数据库
            if (await userService.updateById({ user_id, user_avatar })) {
                // 3. 返回数据
                return ctx.body = {
                    code: 200,
                    message: '头像上传成功',
                    data: {
                        user_avatar
                    },
                }
            }
            
        } catch (error) {
            console.error('头像上传失败', error);
            return ctx.app.emit('error', errType.fileUploadError, ctx)
        }

        
    }

    // 5用户通过用户id 修改 昵称 （通过已登录的ctx.state.user.user_id的id来操作，所以要先登录）
    async updateNickname(ctx, next) {
        try {
            // 拿到登录后的用户id
            const { user_id } = ctx.state.user
            const { nickname } = ctx.request.body
            if (nickname && nickname !== '') {
                if (await userService.updateById({ user_id, nickname })) {
                    return ctx.body = {
                        code: 200,
                        message: '修改用户昵称成功',
                        data: ''
                    }
                }
            }
        } catch (error) {
            console.error('修改用户昵称失败', error);
            return ctx.app.emit('error', errType.updateNicknameError, ctx)
        }
    }

    // 用户 查询（获取）歌曲收藏列表 信息（需要登录）前台去做吧
    // 用户 查询（获取）歌单收藏列表 信息（需要登录）前台去做吧

}


module.exports = new UserController()