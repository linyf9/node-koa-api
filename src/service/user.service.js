// 操作 用户模块 数据库 的类 （对数据库数据的增删改查业务）
class UserService {
    // 为什么要加上async呢，因为数据库操作是异步的

    // 创建用户（增）如果参数超过3个，建议写成对象
    async createUser(username, password) {
        // 写入数据库
        return new Promise((resolve, inject) => {
            return resolve('写入数据库成功！')
        })
    }
}

module.exports = new UserService()