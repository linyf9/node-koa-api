// 用户认证授权中间件
const jwt = require('jsonwebtoken')
const { JWT_SECCET } = require('../config/config.default')
const errType = require('../constant/err.type')

// 用户认证授权 中间件 Middleware层
class AuthMiddleware {
    // 认证是否登录状态 （看有无token(未过期)认证）
    async auth(ctx, next) {
        const { authorization = '' } = ctx.header //如果没传authorization，就给authorization一个默认值
        console.log(ctx, '999');
        const token = authorization.replace('Bearer ','')
        console.log(token,'888');
        try {
            // 会拿到payload部分（id, username, is_admin）
            const user = jwt.verify(token, JWT_SECCET)
            console.log(user, '39546903984238947492');
            // 一般将user挂载到ctx.state.user中
            ctx.state.user = user //在之后的其他地方也可以通过ctx.state.user拿到用户信息
        } catch (error) {
            switch (error.name) {
                case 'TokenExpiredError':
                    console.error('token已过期，请重新登录', error);
                    return ctx.app.emit('error', errType.tokenExpiredError, ctx)
                case 'JsonWebTokenError':
                    console.error('无效的token，请先登录', error);
                    return ctx.app.emit('error', errType.invalidToken, ctx)
            }
        }
        await next()
    }

    // 是否拥有管理员权限 （授权）
    async hadAdminPermission(ctx, next) {
        // 从ctx.state.user解构出is_admin 判断是否为管理员
        const { is_admin } = ctx.state.user
        console.log(is_admin);
        //对于null类型，undefined，0，“” 都会转换为false，!是将它们取反变为true
        if (!is_admin) { //原来都是0（没权限），即false，取反为true才能进入if语句{}中，所以进来的是没有权限的
            console.error('该用户没有管理员权限', ctx.state.user);
            return ctx.app.emit('error', errType.hasNotAdminPermission, ctx)
        }
        // 有权限就放行
        await next()
    }

    // 后台认证是否登录状态 （看有无token(未过期)认证）添加歌曲等
    async author(ctx, next) {
        const { cookie = '' } = ctx.header //如果没传authorization，就给authorization一个默认值
        console.log(ctx.header.cookie, '9999999');
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJhZG1pbiIsInVzZXJfYXZhdGFyIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLzZjN2Q4YjY4NTcxZTczMmI2OTQ0ZjBkMDAuanBnIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTY3ODk0OTIwOSwiZXhwIjoxNjc5NTU0MDA5fQ.KP-FgBDbV0QgiBP19uqbZCpnDjZlkqx08BdbAxIl71E
        const cookieList = cookie.split('=')
        // console.log(cookieList[1]);
        // cookieList[1].replace('Bearer ', '')
        let token = cookieList[1].replace('Bearer ', '')
        // console.log(token, '000000');
        let tokenList = []
        if (token.indexOf(';') !== -1) {
            console.log(token.indexOf(';'));
            tokenList = token.split(';')
            token = tokenList[0]
            console.log(token,'000');
        } else {
            token = cookieList[1].replace('Bearer ', '')
            console.log(token,'777');
        }
        
        try {
            // 会拿到payload部分（id, username, is_admin）
            const user = jwt.verify(token, JWT_SECCET)
            console.log(user, '39546903984238947492');
            // 一般将user挂载到ctx.state.user中
            ctx.state.user = user //在之后的其他地方也可以通过ctx.state.user拿到用户信息
        } catch (error) {
            switch (error.name) {
                case 'TokenExpiredError':
                    console.error('token已过期，请重新登录', error);
                    return ctx.app.emit('error', errType.tokenExpiredError, ctx)
                case 'JsonWebTokenError':
                    console.error('无效的token，请先登录', error);
                    return ctx.app.emit('error', errType.invalidToken, ctx)
            }
        }
        await next()
    }
}

module.exports = new AuthMiddleware()