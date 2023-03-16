const path = require('path')
const fs = require('fs')
const errType = require('../constant/err.type')
const singerService = require('../service/singer.service')

// 歌手 中间件 Middleware层
class SingerMiddleware {
    
    // 验证 body中的 singer_name, singer_details 是否为空
    async singerValidator(ctx, next) {
        // 拿前端传递的数据
        const { singer_name, singer_details } = ctx.request.body
        const { singer_avatar } = ctx.request.files
        // 验证合法性（是否为空等）
        if (!singer_name || !singer_details) {
            console.error('不能提交有留空的表单', ctx.request.body);
            fs.unlinkSync(path.join(__dirname, '../upload', path.basename(singer_avatar.filepath)))
            // ctx.app.emit提交错误('error', 错误对象内容，上下文对象)，会提交到app，index.js中被app.on监听
            return ctx.app.emit('error', errType.emptyParamsError, ctx)
        }
        // 如果没有出现错误，就交由下一个中间件处理（这里是异步的）
        await next()
    }

    // 验证 歌手 是否在数据库中存在，存在就可以修改歌手信息，不存在就添加，但不能修改
    verifySinger(type) { // 我传入的
        return async (ctx, next) => {
            try {
                // console.log(ctx, next ,type);
                let res
                // post 通过 判断歌手名字有没有在数据库中，有就不添加，无就添加
                if (type === 'post') {
                    const { singer_name } = ctx.request.body
                    const { singer_avatar } = ctx.request.files
                    res = await singerService.getSingerInfo({ singer_name })
                    // console.log(Object.prototype.toString.call(res));
                    if (res) {
                        console.error('歌手已经存在', singer_name);
                        // 歌手已经存在, 不能添加歌手，删除upload中该上传的头像
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(singer_avatar.filepath)))
                        return ctx.app.emit('error', errType.singerAlreadyExited, ctx)
                    }
                }

                // put 通过 歌手id 修改歌手信息之前，先通过id判断有没有在数据库中
                if (type === 'put') {
                    const { singer_name, singer_id } = ctx.request.body
                    const { singer_avatar } = ctx.request.files
                    res = await singerService.getSingerInfo({ singer_id })
                    if (res) {
                        // 如果之前有这名歌手，修改信息时，应该查到该歌手头像，然后删掉本地之前的头像，换新头
                        res.singer_avatar && fs.unlinkSync(path.join(__dirname, '../upload/', res.singer_avatar.split('0/')[1]))
                    }
                    // console.log(Object.prototype.toString.call(res));
                    if (Object.prototype.toString.call(res) === '[object Null]') {
                       //如果 put 进得来，就说明歌手不存在，不能修改歌手信息
                        console.error('歌手不存在', singer_name, singer_id);
                        // 歌手不存在存在, 删除upload中该上传的头像
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(singer_avatar.filepath)))
                        return ctx.app.emit('error', errType.singerNotExitError, ctx)
                    }
                }

                // 根据 singer_id 删除单个，或获取单个
                if (type === 'delete' || type === 'get') {
                    const { singer_id } = ctx.request.params
                    res = await singerService.getSingerInfo({ singer_id })
                    if (Object.prototype.toString.call(res) === '[object Null]') {
                       //如果 delete 进得来，就说明歌手不存在，删除失败，获取歌手信息失败
                        console.error('歌手不存在', singer_id);
                        return ctx.app.emit('error', errType.singerNotExitError, ctx)
                    }
                    
                }


                    
            } catch (error) {
                console.error('获取歌手信息失败', error);
                return ctx.app.emit('error', errType.getSingerError, ctx)
            }
            // 无误就继续走下去
            await next()
        }
    }

   


}

module.exports = new SingerMiddleware()


