const path = require('path')
const fs = require('fs')
const errType = require('../constant/err.type')
const { APP_DURL } = require('../config/config.default')
const singerService = require('../service/singer.service')
// 歌手 控制器Controller层
class SingerController {

    // 1管理员 添加歌手
    async addSinger(ctx, next) {
        try {
            // 1. 获取数据
            // console.log('tuyjhsgavc',ctx.request.body);
            const { singer_name, singer_details } = ctx.request.body
            let { singer_avatar } = ctx.request.files
            singer_avatar = APP_DURL + path.basename(singer_avatar.filepath)
            const singer = { singer_name, singer_details, singer_avatar }
            // 2. 操作数据库
            const res = await singerService.addSinger(singer)
            // console.log(res);
            // 3. 返回数据
            return ctx.body = {
                code: 200,
                message: '添加歌手成功',
                data: res
            }
        } catch (error) {
            console.error('添加歌手成功失败', error);
            // 提交错误
            return ctx.app.emit('error', errType.addSingerError ,ctx)
        }
    }

    // 2管理员 根据歌手id 修改歌手信息（通过歌手的singer_id来修改）
    async updateSinger(ctx, next) {
        try {
            // 1. 获取数据 （歌手id 和 需要修改的数据）
            const { singer_id, singer_name, singer_details } = ctx.request.body
            let { singer_avatar } = ctx.request.files
            singer_avatar = APP_DURL + path.basename(singer_avatar.filepath)
            
            // 2. 操作数据库（修改、更新，返回布尔值）
            if (await singerService.updateSinger({ singer_id, singer_name, singer_details, singer_avatar })) {
                // 3. return返回数据
                return ctx.body = {
                    code: 200,
                    message: '修改歌手信息成功',
                    data:''
                }
            }
        } catch (error) {
            console.error('修改歌手信息失败', error);
            return ctx.app.emit('error', errType.updateSingerError,ctx)
        }
        

    }

    // 3管理员 删除歌手（通过歌手的singer_id来删除）
    async deleteSinger(ctx, next) {
        try {
            // 1.获取歌手singer_id，这个动态参数
            const { singer_id } = ctx.request.params
             // 先获取歌单封面，删除本地图片，再去做删除操作
            const res = await singerService.getSingerInfoById(singer_id)
            res.singer_avatar && fs.unlinkSync(path.join(__dirname, '../upload/', res.singer_avatar.split('0/')[1]))
            // 2. 操作数据库 返回true 或 false
            if (await singerService.deleteSinger(singer_id)) {
                // 3. 返回数据数据
                return ctx.body = {
                    code: 200,
                    message: '删除歌手成功',
                    data: ''
                }
            }
        } catch (error) {
            console.error('删除歌手失败', error);
            return ctx.app.emit('error', errType.deleteSingerError,ctx)
        }
    }

    // 4查询（获取） 指定id 歌手的信息（通过歌手的singer_id查询）
    async getSingerById(ctx, next) {
        try {
            const { singer_id } = ctx.request.params
            const res = await singerService.getSingerInfoById(singer_id)
            return ctx.body = {
                code: 200,
                message: '获取歌手信息成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌手信息失败', error);
            return ctx.app.emit('error', errType.getSingerError, ctx)
        }
    }

    // 5根据歌手id获取歌手的全部歌曲（默认获取最新的10条）可以根据offset++来获取接下来的数据
    async getSingerSongsById(ctx, next) {
        try {
            const { singer_id } = ctx.request.params
            let { offset, limit } = ctx.request.query
            const res = await singerService.getSingerSongsById({singer_id, offset, limit})
            return ctx.body = {
                code: 200,
                message: '获取歌手的歌曲信息成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌手的歌曲信息失败', error);
            return ctx.app.emit('error', errType.getSingerSongsError, ctx)
        }
    }

    // 6获取（查询）所有(不要全部，默认10条，以后下拉刷新再接着展示)歌手的基本信息 
    // 还可以根据 歌手名字关键词 模糊查询出所有歌手
    async getAllSinger(ctx, next) {
        try {
            let { keyword, offset, limit } = ctx.request.query
            const res = await singerService.getAllSinger({ keyword,offset,limit })
            // 如果返回的是空数组，则报歌手不存在的提示
            if(res.length === 0) return ctx.app.emit('error', errType.singerNotExitError, ctx)
            return ctx.body = {
                code: 200,
                message: '获取全部歌手信息成功',
                data: res
            }
        } catch (error) {
            console.error('获取全部歌手信息失败', error);
            return ctx.app.emit('error', errType.getSingerError, ctx)
        }
    }

}

module.exports = new SingerController()