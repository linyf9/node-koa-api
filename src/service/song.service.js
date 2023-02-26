// 操作 歌曲模块 数据库 的类 （对数据库数据的增删改查业务）
// 导入 Song 表模型类，操作它，它里面有很多方法可以操作该表
const { Op } = require('sequelize')
const Song = require('../model/song.model')
const Singer = require('../model/singer.model')
// const List = require('../model/list.model')
// const Listsong = require('../../test/listsong.model')
const { readLrc } = require('../utils/read.lrc')
class SongService{
    // 1新增歌曲（上传歌曲）
    async addSong(song) {
        let { dataValues } = await Song.create(song)
        let { updatedAt, createdAt, ...dataVals } = dataValues
        return dataVals
    }

    // 2删除歌曲
    async deleteSong(song_id){
         const res = await Song.destroy({
            where: {
                song_id
            }
        })
        // 单一删除，成功就返回数字res=1，然后我们返回出true或false
        // console.log(res); 
        return res === 1 ? true : false
    }

    // 3修改歌曲信息
    async updateSong({ song_id, song_songname, song_rank, song_singerid, song_listid, song_imgpath, song_filepath, song_lycpath }) {
        const whereOpt = { song_id }
        // 创建一个新歌手信息空对象，为了替换数据库中的歌手信息
        // song_listid可以为空，就不属于如何歌单
        const newSong = {}
        song_songname && Object.assign(newSong, { song_songname })
        song_rank && Object.assign(newSong, { song_rank })
        song_singerid && Object.assign(newSong, { song_singerid })
        song_listid && Object.assign(newSong, { song_listid })
        song_imgpath && Object.assign(newSong, { song_imgpath })
        song_filepath && Object.assign(newSong, { song_filepath })
        song_lycpath && Object.assign(newSong, { song_lycpath })
        const res = await Song.update(newSong, { where: whereOpt })
        //输出一个数组 [ 1 ] ，通过判断数组下标第0项，如果它的值大于0（如1）表示更新成功，等于0失败
        // console.log(res); 
        return res[0] > 0 ? true : false
    }


    // 4根据歌曲id获取歌词
    async getSongLyricById(song_id) {
        let res = await Song.findOne({
            where: {
                song_id
            },
            attributes: ['song_lycpath'],
        })
        if (res.dataValues.song_lycpath) {
            let song_lycpath = readLrc(res.dataValues.song_lycpath)
            return song_lycpath ? song_lycpath : ''
        }
        
    }

    // 5获取单首歌曲信息
    // 可以根据 song_id, song_songname, song_singerid, song_rank 来获取歌曲信息
    async getSongInfo({ song_id, song_songname, song_singerid, song_rank }) {
        // 如果只是获取歌曲信息，前端请求可以不携带参数
        // 联查，根据歌手id查歌手信息，
        const whereOpt = {} 
        song_id && Object.assign(whereOpt, { song_id })
        song_songname && Object.assign(whereOpt, { song_songname })
        song_singerid && Object.assign(whereOpt, { song_singerid })
        song_rank && Object.assign(whereOpt, { song_rank })

        let res = await Song.findOne({
            where: whereOpt,
            include: [
                {
                    attributes: ['singer_name'],
                    model: Singer,
                }
            ]
        })
        if (res) {
            // 也就是 dataValues 基于获取本表的信息，而 dataValues.ff_singer.dataValues 中存放着关联表的查询信息
            let { ff_singer = {}, createdAt, updatedAt, ...dataVals } = res.dataValues
            createdAt = new Date().getTime(createdAt)
            updatedAt = new Date().getTime(createdAt)
            dataVals = Object.assign(dataVals, {
                singer_name: ff_singer.dataValues.singer_name || '无名歌手',
                createdAt,
                updatedAt
            })
            return dataVals
        }
        
        return false

    }

    // 6.获取推荐歌曲 song_listid: null 
    async getRecommendSongs({ offset='1', limit='10' }) {
        if (offset === '') offset = '1';
        if (offset === '') offset = '10';
        const res = await Song.findAll({
            order: [['song_id', 'DESC']],
            offset: (offset - 1) * limit,
            limit: limit*1,
            where: {
                song_listid: null
            },
            include: [
                {
                    attributes: ['singer_name'],
                    model: Singer,
                }
            ]
        })
        if (res) {
            const songs = res.map(item => {
                let { ff_singer = {},createdAt,updatedAt, ...song } = item.dataValues
                song.singer_name = ff_singer.dataValues.singer_name || '无名歌手'
                createdAt = new Date().getTime(createdAt)
                updatedAt = new Date().getTime(createdAt)
                song = Object.assign(song, {...song,createdAt,updatedAt})
                return song
            })
            return songs
        }
        return []
    }

    // 7.获取全部歌曲的基本信息，如果keyword不传，则是获取(查询)所有歌曲，如果传，就根据这个关键词来锁定song_songname进行模糊匹配。
    async getAllSong({ keyword = '', offset = '1', limit = '10' }) {
        if (offset === '') offset = '1';
        if (limit === '') limit = '10';
        const res = await Song.findAll({
            order: [['song_id', 'DESC']],
            offset: (offset - 1) * limit,
            limit: limit * 1,
            where: {
                song_songname: {
                    [Op.substring]: keyword
                }  
            },
            include: [
                {
                    attributes: ['singer_name'],
                    model: Singer,
                }
            ]
        })

        if (res) {
            const songs = res.map(item => {
                let { ff_singer = {},createdAt,updatedAt, ...song } = item.dataValues
                song.singer_name = ff_singer.dataValues.singer_name || '无名歌手'
                createdAt = new Date().getTime(createdAt)
                updatedAt = new Date().getTime(createdAt)
                song = Object.assign(song, {...song,createdAt,updatedAt})
                return song
            })
            return songs
        }
        return []
    }

    // 8. 根据 song_rank 获取 某类型榜单里的 歌曲
    async getAllRankSong({ song_rank='', offset='1', limit='10' }) {
        if (offset === '') offset = '1';
        if (limit === '') limit = '10';
        const res = await Song.findAll({
            order: [['song_id', 'DESC']],
            offset: (offset - 1) * limit,
            limit: limit * 1,
            where: {
                song_rank: song_rank
            },
            include: [
                {
                    attributes: ['singer_name'],
                    model: Singer,
                }
            ]
        })

        if (res) {
            const songs = res.map(item => {
                let { ff_singer = {},createdAt,updatedAt, ...song } = item.dataValues
                song.singer_name = ff_singer.dataValues.singer_name || '无名歌手'
                createdAt = new Date().getTime(createdAt)
                updatedAt = new Date().getTime(createdAt)
                song = Object.assign(song, {...song,createdAt,updatedAt})
                return song
            })
            return songs
        }
        return []
    }
    

}

module.exports = new SongService()