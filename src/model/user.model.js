// sequelize导入 对应数据库 类型一致的对象 DataTypes
const { DataTypes } = require('sequelize')

// 导入seq
const seq = require('../db/seq')

// 使用 seq.define() 来创建 映射数据表的 模型对象(类)；ff_user会被解析为ff_users表名，配置对象即为字段
const User = seq.define('ff_user', {
    // 配置对象中 的属性 对应着 ff_users表 的各个字段
    // id 不需要写，会自动生成
    username: {
        type: DataTypes.STRING,
        allowNull: false, // 是否可以为空，false表示不可以为空
        unique: true, // 值唯一
        comment: '用户名 唯一' // 字段描述信息
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false, // 是否可以为空，false表示不可以为空
        comment: '密码' // 字段描述信息
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: "是否为管理员，0不是管理员(默认值); 1是管理员"
    }
}, {
    // timestamps: false //表示不会自动生成那俩个时间戳字段，一般为ture就是会自动生成
})

// 强制同步数据库（创建数据表，一般创建好了(看看数据库中表的结构对不对)，就注释掉）
// 以上模型定义好之后，会执行sync方法（模型同步），自动会在数据库中新建一张ff_users表
// User.sync({ force: true }); // {force:true}表示如果数据库中有表，则强行删除，新建之。
/*
G:\koa-server> node .\src\model\user.model.js
Executing (default): DROP TABLE IF EXISTS `ff_users`;
Executing (default): CREATE TABLE IF NOT EXISTS `ff_users` (`id` INTEGER NOT NULL auto_increment , `username` VARCHAR(255) NOT NULL UNIQUE COMMENT '用户名 唯一', `password` VARCHAR(255) NOT NULL COMMENT '密码', `is_admin` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否为 
管理员，0不是管理员(默认值); 1是管理员', PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `ff_users`
*/

// 导出User模型类
module.exports = User


