// 1. 导入sequelize中的类型支持
const { DataTypes, Model } = require('sequelize')
// 2. 导入seq数据库对象（使用seq的define('自定义表名', {字段配置对象})方法 来创建 映射数据表的 模型对象(类)）
const seq = require('../db/seq')
// 导入Singer模型
const Singer = require('./Singer.model')
const List = require('./list.model')

const Song = seq.define('ff_song', {
    song_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '歌曲主键id'
    },
    song_songname: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌名'
    },
    song_imgpath: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌曲封面路径'
    },
    song_filepath: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌曲mp3文件路径'
    },
    song_lycpath: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌曲歌词路径'
    },
    song_rank: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '所处的排行榜类别，可以为空'
    },
})

// 设置 歌手与歌曲 一对一的外键约束，外键设在歌曲中song_singerid  
Singer.hasOne(Song, {
    foreignKey: {
        name: 'song_singerid',
        allowNull: false
    }
})
Song.belongsTo(Singer, {
    foreignKey: {
        name: 'song_singerid',
        allowNull: false
    }
})

// 设置 歌单与歌曲 一对多 的外键约束，外键设在 歌曲 中 song_listid  外键在多的一方
// 可以为空，就是歌曲不一定要在某个歌单里，要插入到指定歌单的时候再设置值
List.hasMany(Song, {
    foreignKey: {
        name: 'song_listid',
    }
})
Song.belongsTo(List, {
    foreignKey: {
        name: 'song_listid',
    }
})

// 会截断表，强行重建表，覆盖已经存在的，每次生成后最好注释掉
// Song.sync( { force: true } )

// 导出 ff_songs表 的实体类（可以通过该类的方法操作ff_songs表）
module.exports = Song

