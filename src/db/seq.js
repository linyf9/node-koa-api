const { Sequelize } = require('sequelize')
// 导入环境变量
const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DB,
} = require('../config/config.default')

// 连接数据库
// const seq = new Sequelize('数据库名','用户名','密码',{host:'localhost',dialect: 'mysql'})
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, { host: MYSQL_HOST, port: MYSQL_PORT, dialect: 'mysql' })

// 测试数据库是否链接成功
// seq.authenticate().then(() => {
//     console.log('数据库连接成功！');
// }).catch(err => {
//     console.log('数据库连接成功！', err);
// })

module.exports = seq

