const path = require('path')
const fs = require('fs')
const errType = require('../constant/err.type')
const { APP_DURL } = require('../config/config.default')
const listService = require('../service/list.service')

const getAllListTotal = async () =>{
        try {
            let total = await listService.getAllListTotal()
            return total
        } catch (error) {
            console.log('获取总数失败');
        }
}
// 歌单 控制器Controller层
class ListController {

    // 1管理员 添加歌单
    async addList(ctx, next) {
        try {
            // 1. 获取数据
            let { list_title, list_details,} = ctx.request.body
            let { list_imgpath } = ctx.request.files
            list_imgpath = APP_DURL + path.basename(list_imgpath.filepath)
            const list = {list_title, list_details, list_imgpath}
            // 2. 操作数据库
            const res = await listService.addList(list)
            // const res = await singerService.addSinger(singer)
            // console.log(res);
            if (res) {
                // 3. 返回数据
                return ctx.body = {
                    code: 200,
                    message: '添加歌单成功',
                    data: res
                }
            }
            
        } catch (error) {
            console.error('添加歌单成功失败', error);
            // 提交错误
            return ctx.app.emit('error', errType.addListError ,ctx)
        }
    }

    // 2管理员 修改歌单信息（通过歌单的list_id来修改）
    async updateList(ctx, next) {
        try {
            const { list_id,list_title,list_details } = ctx.request.body
            let { list_imgpath } = ctx.request.files
            list_imgpath = APP_DURL + path.basename(list_imgpath.filepath)
            if (await listService.updateList({ list_id, list_title, list_details, list_imgpath })) {
                return ctx.body = {
                    code: 200,
                    message: '修改歌单信息成功',
                    data: ''
                }
            }
        } catch (error) {
            console.error('修改歌单信息失败', error);
            return ctx.app.emit('error', errType.updateListError,ctx)
        }
    }

    // 3管理员 删除歌单（通过歌单的list_id来删除）
    async deleteList(ctx, next) {
        try {
            // 1.获取歌单list_id，这个动态参数
            const { list_id } = ctx.request.params
            // 先获取歌单封面，删除本地图片，再去做删除操作
            const res = await listService.getListInfoById(list_id)
            res.list_imgpath && fs.unlinkSync(path.join(__dirname, '../upload/', res.list_imgpath.split('0/')[1]))
            // 2. 操作数据库 返回true 或 false
            if (await listService.deleteList(list_id)) {
                // 3. 返回数据数据
                return ctx.body = {
                    code: 200,
                    message: '删除歌单成功',
                    data: ''
                }
            }
        } catch (error) {
            console.error('删除歌单失败', error);
            return ctx.app.emit('error', errType.deleteListError,ctx)
        }
    }

    // 4获取（查询）根据歌单id，动态路由，获取 指定歌单基本信息 
    async getListById(ctx, next) {
        try {
            const { list_id } = ctx.request.params
            const res = await listService.getListInfoById(list_id)
            return ctx.body = {
                code: 200,
                message: '获取歌单成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌单失败', error);
            return ctx.app.emit('error', errType.getlistError, ctx)
        }
    }

    // 5根据 歌单id 获取 歌单中的所有歌曲信息(不包括歌词，歌词可以用歌曲id来获取)
    // 默认展示 第一页的10条数据，之后触底再发请求获取第二页的数据
    async getListSongsById(ctx, next) {
        try {
            const { list_id } = ctx.request.params
            const { offset, limit } = ctx.request.query
            const res = await listService.getListSongsById({list_id, offset, limit})
            return ctx.body = {
                code: 200,
                message: '获取歌单中的歌曲数据成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌单里的歌曲数据失败', error);
            return ctx.app.emit('error', errType.getListSongsError,ctx)
        }
    }

    // 6获取 所有歌单基本信息
    async getAllLists(ctx, next) {
        try {
            const { offset, limit } = ctx.request.query
            const res = await listService.getAllLists({ offset, limit })
            let total = await getAllListTotal()
            return ctx.body = {
                code: 200,
                message: '获取所有歌单数据成功',
                total,
                data: res
            }
        } catch (error) {
            console.error('获取所有歌单数据失败', error);
            return ctx.app.emit('error', errType.getAllListError,ctx)
        }
    }

    // 获取所有歌单名称 及 id
    async getLists(ctx, next) {
        try {
            const res = await listService.getLists()
            return ctx.body = {
                code: 200,
                message: '获取所有歌单信息(名字及id)成功',
                data: res
            }
        } catch (error) {
            console.log('获取所有歌单信息(名字及id)失败');
        }
    }


}

module.exports = new ListController()