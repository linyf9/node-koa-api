// 1. 导入sequelize中的类型支持
const { DataTypes, Model } = require('sequelize')
// 2. 导入seq数据库对象（使用seq的define('自定义表名', {字段配置对象})方法 来创建 映射数据表的 模型对象(类)）
const seq = require('../db/seq')

const Singer = seq.define('ff_singer', {
    singer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '歌手主键id'
    },
    singer_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌手名'
    },
    singer_details: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '歌手简介'
    },
    singer_avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌手头像地址'
    },
})

// Singer.sync({ force: true })

module.exports = Singer