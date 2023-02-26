// 1. 导入sequelize中的类型支持
const { DataTypes, Model } = require('sequelize')
// 2. 导入seq数据库对象（使用seq的define('自定义表名', {字段配置对象})方法 来创建 映射数据表的 模型对象(类)）
const seq = require('../db/seq')

const List = seq.define('ff_list', {
    // 配置对象中 的属性 对应着 ff_users表 的各个字段
    // id 不需要写，会自动生成
    list_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '歌单主键id'
    },
    list_title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌单标题'
    },
    list_details: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '歌单简介'
    },
    list_imgpath: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌单封面地址'
    }
}, {
    // timestamps: false //表示不会自动生成那俩个时间戳字段，一般为ture就是会自动生成
})

// List.sync({ force: true })

module.exports = List