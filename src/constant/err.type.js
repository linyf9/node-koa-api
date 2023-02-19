// 该常量模块，可定义一些错误类型等
module.exports = {
    // 用户格式错误
    userFormateError: {
        code: '10001', // 1表示错误优先级，00表示User模块，01表示错误编号，01-99
        message: '用户名或密码为空',
        data: ''
    },

    // 用户已经存在
    userAlreadyExited: {
        code: '10002',
        message: '用户已经存在',
        data: ''
    },

    // 注册错误
    userRegisterError: {
        code: '10003',
        message: '用户注册错误',
        data: ''
    }
}