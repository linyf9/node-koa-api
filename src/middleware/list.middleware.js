const path = require('path')
const fs = require('fs')
const errType = require('../constant/err.type')
const listService = require('../service/list.service')

// 歌单 中间件 Middleware层
class ListMiddleware {
    // 验证 files 中 歌单封面 是否为空 或者格式不对
    async verifyListUpload(ctx, next) {
        const { list_imgpath = '' } = ctx.request.files //拿到上传图片的字段,这里有s，表示可以同时上传多张
        // console.log('23456789', ctx.request.files);
        const fileTypes = ['image/jpeg', 'image/png']
        // 如果没有上传图片
        if (!list_imgpath) {
            console.error('您没有上传图片', list_imgpath);
            return ctx.app.emit('error', errType.notUploadAvatar, ctx)
        }
        // 如果图片格式有误就提示错误信息
        if (list_imgpath) {
            if (!fileTypes.includes(list_imgpath.mimetype)) { //表示不在fileTypes数组中的文件格式
                // 删除upload中该上传有误的文件
                fs.unlinkSync(path.join(__dirname, '../upload', path.basename(list_imgpath.filepath)))
                // 返回上传有误的提示信息
                return ctx.app.emit('error', errType.unSupportedFileType, ctx)
            } 
        } 
        // 没有错误就放行，交给下一个中间件处理
        await next()
    }
    
    // 验证 body中的 list_title, list_details 是否为空
    async listValidator(ctx, next) {
        // 拿前端传递的数据
        const { list_title, list_details} = ctx.request.body
        const { list_imgpath = '' } = ctx.request.files
        // 验证合法性（是否为空等）
        if (!list_title || !list_details) {
            console.error('不能提交有留空的表单', ctx.request.body);
            fs.unlinkSync(path.join(__dirname, '../upload', path.basename(list_imgpath.filepath)))
            // ctx.app.emit提交错误('error', 错误对象内容，上下文对象)，会提交到app，index.js中被app.on监听
            return ctx.app.emit('error', errType.emptyParamsError, ctx)
        }
        // 如果没有出现错误，就交由下一个中间件处理（这里是异步的）
        await next()
    }

    // 验证 歌单 是否在数据库中存在
    verifylist(type) {
        return async (ctx, next) => {
            try {
                let res
                if (type === 'post') { 
                    const { list_title } = ctx.request.body
                    const { list_imgpath } = ctx.request.files
                    res = await listService.getListInfo({ list_title })
                    if (res) { //如果进得来，就说明歌单已经存在，不得添加
                        console.error('歌单已经存在', list_title);
                        // 歌单已经存在, 删除upload中该上传的歌单封面
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(list_imgpath.filepath)))
                        return ctx.app.emit('error', errType.listAlreadyExited, ctx)
                    }
                }
                if (type === 'put') { 
                    // 通过 list_id 查看 歌单是否在数据库中
                    const { list_id } = ctx.request.body
                    const { list_imgpath } = ctx.request.files
                    res = await listService.getListInfo({ list_id })
                    // 如果之前有这名歌单，修改信息时，应该先查到该歌单之前的封面，然后删掉本地之前的封面，换新的了
                    if (res) {
                        // console.log(res.list_imgpath);
                        res.list_imgpath && fs.unlinkSync(path.join(__dirname, '../upload/', res.list_imgpath.split('0/')[1]))
                    }
                    // console.log(Object.prototype.toString.call(res));
                    if (Object.prototype.toString.call(res) === '[object Null]') {
                       //如果 put 进得来，就说明歌单不存在，不能修改歌单信息
                        console.error('歌单不存在', list_id);
                        // 歌单不存在存在, 删除upload中该上传的封面
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(list_imgpath.filepath)))
                        return ctx.app.emit('error', errType.listNotExitError, ctx)
                    }
                }
                // 根据 list_id 删除单个，或获取单个
                if (type === 'delete' || type === 'get') {
                    const { list_id } = ctx.request.params
                    res = await listService.getListInfo({ list_id })
                    if (Object.prototype.toString.call(res) === '[object Null]') {
                       //如果 delete 进得来，就说明歌单不存在，删除失败，获取歌单信息失败
                        console.error('歌单不存在', list_id);
                        return ctx.app.emit('error', errType.listNotExitError, ctx)
                    }
                    
                }
                
            } catch (error) {
                console.error('获取歌单信息失败', error);
                return ctx.app.emit('error', errType.getlistError, ctx)
            }
            // 无误就继续走下去
            await next()
        }
    }
    // async verifylist(ctx, next) {
    //     try {
    //         const { list_title } = ctx.request.body
    //         const { list_imgpath } = ctx.request.files
    //         const res = await listService.getListInfo({ list_title })
    //         if (res) { //如果进得来，就说明歌单已经存在
    //             console.error('歌单已经存在', list_title);
    //             // 歌单已经存在, 删除upload中该上传的歌单封面
    //             fs.unlinkSync(path.join(__dirname, '../upload', path.basename(list_imgpath.filepath)))
    //             return ctx.app.emit('error', errType.listAlreadyExited, ctx)
    //         }
    //     } catch (error) {
    //         console.error('获取歌单信息失败', error);
    //         return ctx.app.emit('error', errType.getlistError, ctx)
    //     }
    //     // 无误就继续走下去
    //     await next()
    // }

}

module.exports = new ListMiddleware()


