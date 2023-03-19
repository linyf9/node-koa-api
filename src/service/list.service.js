// 操作 歌单模块 数据库 的类 （对数据库数据的增删改查业务）
// 导入 List 表类，操作它，它里面有很多方法可以操作该表
const { Op } = require('sequelize')
const List = require('../model/list.model')
const Song = require('../model/song.model')
const Singer = require('../model/singer.model')
// const Listsong = require('../../test/listsong.model')

class ListService{
    // 新增歌单
    async addList(list) {
        const { dataValues } = await List.create(list)
        const { updatedAt, createdAt, ...data } = dataValues
        return data
    }

    // 删除歌单（通过歌单的list_id来删除）除
    async deleteList(list_id) {
         const res = await List.destroy({
            where: {
                list_id
            }
        })
        // 单一删除，成功就返回数字res=1，然后我们返回出true或false
        // console.log(res); 
        return res === 1 ? true : false
    }

    // 根据list_id修改歌单信息
    async updateList({ list_id, list_title, list_details, list_imgpath }) {
        const whereOpt = { list_id }
        // 创建一个新歌单信息空对象，为了替换数据库中的歌手信息
        const newList = {}
        list_title && Object.assign(newList, { list_title })
        list_details && Object.assign(newList, { list_details })
        list_imgpath && Object.assign(newList, { list_imgpath })
        const res = await List.update(newList, { where: whereOpt })
        //输出一个数组 [ 1 ] ，通过判断数组下标第0项，如果它的值大于0（如1）表示更新成功，等于0失败
        // console.log(res); 
        return res[0] > 0 ? true : false
    }


    // 根据歌单id，动态路由，获取 指定歌单的基本信息 
    async getListInfoById(list_id) {
        let res = await List.findOne({
            where: {
                list_id
            }
        })
        // 歌单 创建时间和修改时间（但是返回的应该是时间戳）是要的，前台可以根据自己的情况来展示与否
        let { createdAt, updatedAt } = res.dataValues
        createdAt = new Date().getTime(createdAt)
        updatedAt = new Date().getTime(createdAt)
        res.dataValues = Object.assign(res.dataValues, { createdAt, updatedAt })
        return res ? res.dataValues : null
        
    }

    // 歌单歌手用户管理，不用获取歌曲的上传时间，而歌曲管理才需要获取歌曲的创建与修改时间；其他以此类推
    // 根据歌单id获取歌单里的歌曲数据
    async getListSongsById({ list_id, offset='1', limit='10' }) {
        if (offset === '') offset = '1';
        if (limit === '') limit = '10';
        const res = await Song.findAll({
            order: [['song_id','DESC']],
            offset: (offset-1)*limit,//减号本身就有隐式转换
            limit: +limit,
            where: {
                song_listid: list_id
            },
            include: [
                {
                    attributes: ['singer_name'],
                    model: Singer,
                }
            ]
        })
        if (res.length > 0) {
            const songs = res.map(song => {
                // let { ff_singer = {},createdAt,updatedAt,song_lycpath, ...song } = item.dataValues
                // song.singer_name = ff_singer.dataValues.singer_name || '无名歌手'
                // createdAt = new Date().getTime(createdAt)
                // updatedAt = new Date().getTime(createdAt)
                // song = Object.assign(song, { ...song, createdAt, updatedAt })
                
                let { ff_singer = {}, song_lycpath, createdAt, updatedAt, ...data } = song.dataValues
                data.singer_name = ff_singer.dataValues.singer_name || '无名歌手'
                createdAt = new Date().getTime(createdAt)
                updatedAt = new Date().getTime(createdAt)
                data = Object.assign(data, {...data, createdAt, updatedAt })
                return data
            })
            return songs
        }
        return []
    }

    // 获取所有歌单数据，默认获取第一页的三个歌单，推荐歌曲的话就不弄成歌单了，可以在歌单中获取部分歌曲，还有没有被安排进歌单的歌曲，这些就是推荐歌曲
    async getAllLists({ keyword = '',  offset = '1', limit = '10' }) {
        if (offset === '') offset = '1';
        if (limit === '') limit = '10';
        const resArr = await List.findAll({
            // order: [['list_id', 'DESC']],
            offset: (offset-1)*limit,
            limit: +limit,
            where: {
                list_title: {
                    [Op.substring]: keyword
                }
            }
        })
        if (resArr.length > 0) {
            const lists = resArr.map(list => {
                let { createdAt, updatedAt } = list.dataValues
                createdAt = new Date().getTime(createdAt)
                updatedAt = new Date().getTime(updatedAt)
                list.dataValues = Object.assign(list.dataValues, { createdAt, updatedAt })
                return list.dataValues
            })
            return lists
        }
        return []

    }


    // 通过条件 获取（查询）单一歌单（获取），可根据条件 获取单一歌单信息
    async getListInfo({list_id, list_title, list_details}) {
        const whereOpt = {} //查询条件对象，这里可以按照list_id, list_title, list_details来查询
        // 设置查询条件
        list_id && Object.assign(whereOpt, { list_id })
        list_title && Object.assign(whereOpt, { list_title })
        list_details && Object.assign(whereOpt, { list_details })
        const res = await List.findOne({
            where: whereOpt, //查询条件
        })
        if (res) {
            let { createdAt, updatedAt } = res.dataValues
            createdAt = new Date().getTime(createdAt)
            updatedAt = new Date().getTime(createdAt)
            res.dataValues = Object.assign(res.dataValues, { createdAt, updatedAt })
            return res.dataValues
        }
        return null
    }

    // 获取歌单总数
    async getAllListTotal() {
        const res = await List.findAll({
            attributes: ['list_id']
        });
        return res.length
    }

    // 9.获取 所有歌单标题 及 id
    async getLists() {
        const res = await List.findAll({
            attributes:['list_id', 'list_title']
        })
        const resArr = res.map(item => item.dataValues)
        console.log(resArr);
        return resArr.length>0 ? resArr : []
    }


    async getTitleAndSongs() {
        const res = await List.findAll({
            attributes: ['list_id','list_title'],
        })
        const listArr = res.map(item=>item.dataValues)
        console.log(listArr);
        let arr = []
        let r = await new Promise((resolve, reject) => {
            listArr.forEach(async item => {
                const resArr =  await Song.findAll({
                    where: {
                        song_listid: item.list_id
                    }
                })
                arr.push(resArr.length)
            })
            setTimeout(() => {
                resolve(arr)
            },200)
        })


        for (let i = 0; i < r.length; i++) {
            
        }

        const pieData = r.map((item, i) => {
            return {
                name: listArr[i].list_title,
                value: item
            }
        })
        return pieData.length && pieData
    }


    // 根据关键词获取歌单数量
    async getAllListOfKeywordTotal(keyword) {
        const res = await List.findAll({
            where: {
                list_title: {
                    [Op.substring]: keyword
                }
            },
            attributes: ['list_id']
        });
        console.log(res, '763454553');
        return res.length
    }

}

module.exports = new ListService()