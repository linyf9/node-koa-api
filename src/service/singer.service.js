// 操作 歌曲模块 数据库 的类 （对数据库数据的增删改查业务）
const { Op,fn,col } = require("sequelize");
// 导入 Singer 表类，操作它，它里面有很多方法可以操作该表
const Singer = require('../model/singer.model')
const Song = require('../model/song.model')
class SingerService{
    // 1.管理员新增歌手
    async addSinger(singer) {
        const { dataValues } = await Singer.create(singer)
        const { updatedAt, createdAt, ...data } = dataValues
        return data
    }

    // 2.管理员删除歌手（不要拿真实数据删，最好是用测试数据）
    async deleteSinger(singer_id) {
        const res = await Singer.destroy({
            where: {
                singer_id
            }
        })
        // 单一删除，成功就返回数字res=1，然后我们返回出true或false
        // console.log(res); 
        return res === 1 ? true : false
    }

    // 3.管理员登录 通过歌手id 修改（更新）歌手信息
    async updateSinger({ singer_id, singer_name, singer_details, singer_avatar }) {
        const whereOpt = { singer_id }
        // 创建一个新歌手信息空对象，为了替换数据库中的歌手信息
        const newSinger = {}
        singer_name && Object.assign(newSinger, { singer_name })
        singer_details && Object.assign(newSinger, { singer_details })
        singer_avatar && Object.assign(newSinger, { singer_avatar })
        const res = await Singer.update(newSinger, { where: whereOpt })
        //输出一个数组 [ 1 ] ，通过判断数组下标第0项，如果它的值大于0（如1）表示更新成功，等于0失败
        // console.log(res); 
        return res[0] > 0 ? true : false
    }

    // 4.查询歌手（获取），可根据条件 获取歌手基本信息（不包含歌曲）
    async getSingerInfo({singer_id, singer_name, singer_details}) {
        const whereOpt = {} //查询条件对象，这里可以按照user_id，用户名，昵称，密码，是否为管理员来查询
        // 设置查询条件
        singer_id && Object.assign(whereOpt, { singer_id })
        singer_name && Object.assign(whereOpt, { singer_name })
        singer_details && Object.assign(whereOpt, { singer_details })
        const res = await Singer.findOne({
            // attributes: ['singer_id', 'singer_name', 'singer_details', 'singer_avatar'], //设置要查询（获取）到的字段
            where: whereOpt, //查询条件
        })
        if (res) {
            let { createdAt, updatedAt, ...singer } = res.dataValues
            createdAt = new Date().getTime(createdAt)
            updatedAt = new Date().getTime(createdAt)
            singer = Object.assign(singer, { createdAt, updatedAt })
            return singer
        }
        return null
    }

    // 5.根据歌手id获取歌手的基本信息
    async getSingerInfoById(singer_id) {
        let res = await Singer.findOne({
            where: {
                singer_id
            },
        })
        let { createdAt, updatedAt } = res.dataValues
        createdAt = new Date().getTime(createdAt)
        updatedAt = new Date().getTime(createdAt)
        res.dataValues = Object.assign(res.dataValues, { createdAt, updatedAt })
        return res ? res.dataValues : null
    }

    // 6. 根据歌手id获取歌手的所有歌曲（默认展示最新的10首歌曲，触底刷新）；分开查询（注意歌曲的歌词部分）
    async getSingerSongsById({ singer_id, offset = '1', limit = '10' }) {
        if (offset === '') {
            offset = '1';
        }
        if (limit === '') {
            limit = '10';
        }
        let res = await Song.findAll({
            order: [['song_id','DESC']],
            offset: (+(offset) - 1)*limit, //表示跳过的数量，所以这里应该乘上limit来表示第几页的数据
            limit: +limit,
            where: {
                song_singerid: singer_id
            },
            attributes: ['song_id', 'song_songname', 'song_singerid', 'song_imgpath', 'song_filepath', 'song_rank']
        })
        if (res) {
            const songs = res.map(song => song.dataValues)
            return songs
        }
        return []
    }

    // 7.获取全部歌手的基本信息，如果keyword不传，则是获取(查询)所有歌手，如果传，就根据这个关键词来锁定singer_name进行模糊匹配。
    async getAllSinger({ keyword='', offset = '1', limit = '10' }) {
        if (offset === '') {
            offset = '1';
        }
        if (limit === '') {
            limit = '10';
        }
        const res = await Singer.findAll({
            order: [['singer_id','DESC']],
            offset: (offset*1 - 1)*limit, //表示跳过的数量，所以这里应该乘上limit来表示第几页的数据
            limit: limit*1,
            where: {
                singer_name: {
                    [Op.substring]: keyword
                }
            }
        })
        // if(res.length === 0) return [] //根据关键词查不到对应歌手名字
        if (res.length > 0) {
            const resArr = res.map(singer => { 
                let { createdAt, updatedAt, ...sin } = singer.dataValues
                createdAt = new Date().getTime(createdAt)
                updatedAt = new Date().getTime(createdAt)
                sin = Object.assign(sin, { createdAt, updatedAt })
                return sin
            })
            return resArr
        }
        return []
        
    }

    // 8.获取歌手总数
    async getAllSingerTotal() {
        // 这个更短,并且更不易出错. 如果以后在模型中添加/删除属性,它仍然可以正常工作
        const res = await Singer.findAll({
            attributes: ['singer_id']
        });
        // console.log(res,'999999');
        return res.length
    }

    // 9.获取 所有歌手名称 及 id
    async getAllSingers() {
        const res = await Singer.findAll({
            attributes:['singer_id', 'singer_name']
        })
        const resArr = res.map(item => item.dataValues)
        console.log(resArr);
        return resArr.length>0 ? resArr : []
    }

    // 根据关键词获取歌手数量
    async getAllSingerOfKeywordTotal(keyword) {
        // 这个更短,并且更不易出错. 如果以后在模型中添加/删除属性,它仍然可以正常工作
        const res = await Singer.findAll({
            where: {
                singer_name: {
                    [Op.substring]: keyword
                }
            },
            attributes: ['singer_id']
        });
        return res.length
    }

}

module.exports = new SingerService()