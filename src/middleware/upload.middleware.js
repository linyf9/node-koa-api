const path = require('path')
const fs = require('fs')
const errType = require('../constant/err.type')

// 上传文件 中间件 Middleware层
class UploadMiddleware {

    // 校验用户上传头像(这里不需要权限)、图片
    async verifyUserUpload(ctx, next) {
        const { user_avatar='' } = ctx.request.files //拿到上传图片的字段,这里有s，表示可以同时上传多张
        // console.log('23456789', ctx.request.files);
        const fileTypes = ['image/jpeg', 'image/png']
        // 如果后台没有上传用户头像【改了，头像可以为空，为了配合前台】
        // if (!user_avatar) {
        //     console.error('您还没有上传图片', user_avatar);
        //     return ctx.app.emit('error', errType.notUploadAvatar, ctx)
        // }
        // 如果图片格式有误就提示错误信息
        if (user_avatar) {
            if (!fileTypes.includes(user_avatar.mimetype)) { //表示不在fileTypes数组中的文件格式
                // 删除upload中该上传有误的文件
                fs.unlinkSync(path.join(__dirname, '../upload', path.basename(user_avatar.filepath)))
                // 返回上传有误的提示信息
                return ctx.app.emit('error', errType.unSupportedFileType, ctx)
            } 
        } 
        // 没有错误就放行，交给下一个中间件处理
        await next()
    }

    // 校验 管理员登录 上传歌手头像
    async verifyAdminUpload(ctx, next) {
        // console.log(1);
        const { singer_avatar } = ctx.request.files //拿到上传图片的字段,这里有s，表示可以同时上传多张
        // console.log('23456789', ctx.request.files);
        const fileTypes = ['image/jpeg', 'image/png']
        // 如果没有上传图片
        if (!singer_avatar) {
            console.error('您没有上传图片', singer_avatar);
            return ctx.app.emit('error', errType.notUploadAvatar, ctx)
        }
        // 如果图片格式有误就提示错误信息
        if (singer_avatar) {
            if (!fileTypes.includes(singer_avatar.mimetype)) { //表示不在fileTypes数组中的文件格式
                // 删除upload中该上传有误的文件
                fs.unlinkSync(path.join(__dirname, '../upload', path.basename(singer_avatar.filepath)))
                // 返回上传有误的提示信息
                return ctx.app.emit('error', errType.unSupportedFileType, ctx)
            } 
        } 

        // 没有错误就放行，交给下一个中间件处理
        await next()
    }

    

}

module.exports = new UploadMiddleware()


