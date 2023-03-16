const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const userService = require('../service/user.service')
const errType = require('../constant/err.type')
const { JWT_SECCET } = require('../config/config.default')
const { APP_DURL } = require('../config/config.default')

const getAllUserTotal = async () =>{
        try {
            let total = await userService.getAllUserTotal()
            return total
        } catch (error) {
            console.log('获取总数失败');
        }
}
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
            let user = {}
            if (user_avatar) {
                 user = { is_admin: 0, ...ctx.request.body, user_avatar: `${APP_DURL + path.basename(user_avatar.filepath)}` }
            } else {
                user = { is_admin: 0, ...ctx.request.body}
            }
            console.log(ctx.request.body);
             
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

    // 前台注册接口
    async frontRegister(ctx, next) {
        try {
            // 1. 获取(解析)前端传递的数据(ctx.request.query)
            const user = { is_admin: 0, ...ctx.request.query}
            // console.log(ctx.request.query);
             
            // console.log(user);

            // 2. 操作数据库(如果操作复杂，可以抽离到service文件夹中)
            //因为create方法返回的是一个Promise，所以可以等待成功的结果
            const res = await userService.createUser(user) 

            // 3. 向前端响应结果
            return ctx.body = {
                code: 200, //表示成功
                message: "用户注册成功",
                data: {
                    code: 200,
                    user_id: res.user_id,
                    user_name: res.user_name,
                    nickname: res.nickname
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
            const { password,nickname, ...resUser } = res 
            // console.log(resUser);
            return ctx.body = {
                code: 200,
                message: '登录成功',
                // jwt.sign(payload对象, 加密字符串, { expiresIn: '1d' }设置过期时间为1天) 方法会返回一个token字段（三部分组成，三部分刚好是jwt.sign方法的参数）
                token: jwt.sign(resUser, JWT_SECCET, { expiresIn: '7d' }),
                // 前台通过 response.data，拿到
                data: {
                    code: 200,
                    message: '登录成功',
                    // jwt.sign(payload对象, 加密字符串, { expiresIn: '1d' }设置过期时间为1天) 方法会返回一个token字段（三部分组成，三部分刚好是jwt.sign方法的参数）
                    token: jwt.sign(resUser, JWT_SECCET, { expiresIn: '7d' }),
                    userInfo: {
                        nickname,
                        user_name,
                        user_avatar: resUser.user_avatar
                    }
                }
            }
        } catch (error) {
            console.error('用户登录失败', error);
            return ctx.app.emit('error', errType.userLoginError, ctx)
        }  
    }

    // 3.用户登录后，可通过用户id 修改 密码 （通过已登录的ctx.state.user.user_id的id来操作，所以要先登录）
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
                    data: {
                        code: 200,
                        message: '修改密码成功',
                    }
                }
            }
        } catch (error) {
            console.error('修改密码失败', error);
            return ctx.app.emit('error', errType.updatePasswordError, ctx)
        }
        
    }
    // 用户未登录，有账号，但是忘记密码了
    async updatePassword(ctx, next) {
        // 用户输入绑定的手机号，和最新的密码即可
        const { user_name = '', password } = ctx.request.body //用户传入的密码，最新的加密密码
        console.log(user_name);
        // 通过user_name获取user_id
        const res = await userService.getUserInfo({ user_name })
        console.log(res);
            // 2. 操作数据库（当输入新密码时，根据这个用户登录后的id来修改密码）
            try {
                // 用户存在才修改密码
                if (res) {
                    if (await userService.updateById({ user_id:res.user_id, password })) {
                        // 3. 返回数据
                        return ctx.body = {
                            code: 200,
                            message: '修改密码成功',
                            data: {
                                code: 200,
                                message: '修改密码成功',
                            }
                        }
                    }
                } else {
                    
                    console.error('用户不存在');
                    return ctx.app.emit('error', errType.userDoseNotExist, ctx)
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
            const { user_id, user_name } = ctx.state.user
            const { nickname } = ctx.request.body
            if (nickname && nickname !== '') {
                if (await userService.updateById({ user_id, nickname })) {
                    return ctx.body = {
                        code: 200,
                        message: '修改用户昵称成功',
                        data: {
                            code: 200,
                            message: '修改用户昵称成功',
                            userInfo: {
                                nickname,
                                user_name
                            }
                        }
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

    // 通过token获取用户信息
    // async getUserInfos(ctx, next) {
    //     try {
            
    //         const res = await userService.getUserInfo({ nickname })
    //         if (res) {
    //             // 后端打印错误日志
    //             console.error('用户昵称已经存在', { nickname });
    //             return ctx.app.emit('error', errType.userNickAlreadyExited, ctx)
    //         }
    //     } catch (error) {
    //         console.error('获取用户信息失败', { nickname });
    //     }
    // }

    // 获取所有用户信息（除了管理员）
    async getAllUsers(ctx, next) {
        try {
            const { offset, limit } = ctx.request.query
            const res = await userService.getAllUsersInfo({ offset, limit })
            console.log(res);
            let total = await getAllUserTotal()
            return ctx.body = {
                code: 200,
                message: '获取全部用户信息成功',
                total: total-1,
                data: res
            }
        } catch (error) {
             console.error('获取全部用户信息失败');
        }
    }

    // 根据id修改用户名或用户昵称
    async updateName(ctx, next) {
        try {
            // 获取所有用户信息中拿到user_id
            const { user_id, user_name, nickname } = ctx.request.query
                if (await userService.updateById({ user_id, user_name, nickname })) {
                    return ctx.body = {
                        code: 200,
                        message: '修改用户信息成功',
                        data: ''
                    }
                }
        } catch (error) {
            console.error('修改用户信息失败', error);
        }
    }

    // 删除用户
     // 3管理员 删除用户（通过用户的user_id来删除）
    async deleteUser(ctx, next) {
        try {
            // 1.获取用户user_id，这个动态参数
            const { user_id } = ctx.request.params
            // 2. 操作数据库 返回true 或 false
            if (await userService.deleteUser(user_id)) {
                // 3. 返回数据数据
                return ctx.body = {
                    code: 200,
                    message: '删除用户成功',
                    data: ''
                }
            }
        } catch (error) {
            console.error('删除用户失败', error);
        }
    }

}


module.exports = new UserController()