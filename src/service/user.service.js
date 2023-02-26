// 用户 服务Service层
// 操作 用户模块 数据库 的类 （对数据库数据的增删改查业务）
// 导入 User 数据库表ff_users模型类，里面就封装了大量的操作数据库的方法（是插入语句、查询语句等的简写封装）
const User = require('../model/user.model')
class UserService {
    // 为什么要加上async呢，因为数据库操作是异步的

    // 创建用户（增）如果参数超过3个，建议写成对象（用户注册）
    // user对象【user_name, password, avatar】
    async createUser(user) {
        // 将前端发送的数据 插入数据库ff_users表中，操作是异步的，是基于Promise的
        try {
            // 操作成功，自动生成的就不用管了，传递没有自动生成的即可
            const res = await User.create(user)
            // console.log(res.dataValues);
            return res.dataValues; //返回传递res也是一个Promise，我们要返回的只是成功与否的记录值
        } catch (error) {
            // 操作失败
            console.log(error.message);
            return error.message;
        }
    }

    // 查询用户（获取），可根据条件 获取用户信息 等等
    async getUserInfo({user_id, user_name, nickname, password, is_admin}) {
        const whereOpt = {} //查询条件对象，这里可以按照user_id，用户名，昵称，密码，是否为管理员来查询
        user_id && Object.assign(whereOpt, { user_id })
        user_name && Object.assign(whereOpt, { user_name })
        nickname && Object.assign(whereOpt, { nickname })
        password && Object.assign(whereOpt, { password })
        is_admin && Object.assign(whereOpt, { is_admin })
        const res = await User.findOne({
            attributes: ['user_id', 'user_name', 'nickname', 'password', 'is_admin'], //设置要查询到的字段
            where: whereOpt, //查询条件
        })
        // console.log(res); // Singer.findOne方法查询得到的res是一个对象，res.dataValues为查询到的那条数据
        return res ? res.dataValues : null
    }

    // 根据user_id修改指定字段（修改用户名【手机号】，昵称，密码，用户头像，权限）
    async updateById({user_id, user_name, nickname, password, user_avatar, is_admin}) {
        const whereOpt = { user_id } //查询条件对象，因为是根据user_id，所以一定必须有user_id属性
        const newUser = {} //创建一个新用户空对象，
        user_name && Object.assign(newUser, { user_name });
        nickname && Object.assign(newUser, { nickname });
        password && Object.assign(newUser, { password });
        user_avatar && Object.assign(newUser, { user_avatar });
        is_admin && Object.assign(newUser, { is_admin });
        const res = await User.update(newUser, { where: whereOpt })
        // console.log(res); //输出一个数组 [ 1 ] ，通过判断数组下标为0的一项，如果大于0表示更新成功，等于0失败
        return res[0] > 0 ? true : false
    }

    

}

module.exports = new UserService()