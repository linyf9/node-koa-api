// 导入 User 数据库表ff_users模型类，里面就封装了大量的操作数据库的方法（是插入语句、查询语句等的简写封装）
const User = require('../model/user.model')
// 操作 用户模块 数据库 的类 （对数据库数据的增删改查业务）
class UserService {
    // 为什么要加上async呢，因为数据库操作是异步的

    // 创建用户（增）如果参数超过3个，建议写成对象
    async createUser(username, password) {
        // 将前端发送的数据 插入数据库ff_users表中，操作是异步的，是基于Promise的
        try {
            // 操作成功
            const res = await User.create({ username, password })
            // console.log(res);
            return res.dataValues; //返回传递res也是一个Promise，我们要返回的只是成功与否的记录值
        } catch (error) {
            // 操作失败
            console.log(error.message);
            return error.message;
        }
    }

    // 查询用户（查），可根据条件判断用户是否存在等等
    async getUserInfo({id, username, password, is_admin}) {
        const whereOpt = {} //查询条件对象
        id && Object.assign(whereOpt, { id })
        username && Object.assign(whereOpt, { username })
        password && Object.assign(whereOpt, { password })
        is_admin && Object.assign(whereOpt, { is_admin })
        const res = await User.findOne({
            attributes: ['id', 'username', 'password', 'is_admin'], //设置要查询到的字段
            where: whereOpt, //查询条件
        })
        return res ? res.dataValues : null
    }

}

module.exports = new UserService()