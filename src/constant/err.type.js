// 该常量模块，可定义一些错误类型等
module.exports = {
    // 用户模块相关100
    // 用户格式错误
    userFormateError: {
        code: '10001', // 1表示错误优先级，00表示User模块，01表示错误编号，01-99
        message: '用户名或密码或昵称为空',
        data: ''
    },

    // 用户名已经存在
    userAlreadyExited: {
        code: '10002',
        message: '用户名已经存在',
        data: ''
    },

    // 注册错误
    userRegisterError: {
        code: '10003',
        message: '用户注册失败',
        data: ''
    },

    // 用户不存在
    userDoseNotExist: {
        code: '10004',
        message: '用户不存在',
        data: ''
    },

    // 用户登录失败
    userLoginError: {
        code: '10005',
        message: '用户登录失败',
        data: ''
    },

    // 密码不匹配(错误)
    invalidPassword: {
        code: '10006',
        message: '密码不匹配',
        data: ''
    },
    // 修改密码失败
    updatePasswordError: {
        code: '10007',
        message: '修改密码失败',
        data: ''
    },

    // 用户上传头像失败
    fileUploadError: {
        code: '10008',
        message: '用户上传头像失败',
        data: ''
    },
    notUploadAvatar: {
        code: '10009',
        message: '您还没有上传图片',
        data: ''
    },
    // 上传文件格式有误
    unSupportedFileType: {
        code: '10010',
        message: '上传文件格式有误',
        data: ''
    },
    // 用户昵称已经存在
    userNickAlreadyExited: {
        code: '10011',
        message: '用户昵称已经存在',
        data: ''
    },
    userFormateError12: {
        code: '10012', // 1表示错误优先级，00表示User模块，01表示错误编号，01-99
        message: '用户名或密码为空',
        data: ''
    },
    updateUserInfoError: {
        code: '10013', 
        message: '修改用户信息失败',
        data: ''
    },
    updateNicknameError: {
        code: '10014', 
        message: '修改用户昵称失败',
        data: ''
    },


    // 授权模块相关101
    // token过期
    tokenExpiredError: {
        code: '10101',
        message: 'token已过期',
        data: ''
    },
    // 无效的token
    invalidToken: {
        code: '10102',
        message: '无效的token',
        data: ''
    },
    // 没有管理员权限
    hasNotAdminPermission: {
        code: '10103',
        message: '该用户没有管理员权限',
        data: ''
    },



    // 歌曲模块102
    uploadSongError: {
        code: '10201',
        message: '歌曲上传失败',
        data: ''
    },
    emptySongnameSidError: {
        code: '10202',
        message: '歌名不能为空',
        data: ''
    },
    notUploadSongImg: {
        code: '10203',
        message: '您还没上传歌曲封面',
        data: ''
    },
    notUploadSongMP3: {
        code: '10204',
        message: '您还没上传歌曲MP3文件',
        data: ''
    },
    notUploadSongLyc: {
        code: '10205',
        message: '您还没上传歌曲歌词文件',
        data: ''
    },
    uploadFileError: {
        code: '10206',
        message: '文件上传失败',
        data: ''
    },
    songAlreadyExited: {
        code: '10207',
        message: '歌曲已存在',
        data: ''
    },
    getSongError: {
        code: '10208',
        message: '获取歌曲信息失败',
        data: ''
    },
    getRecommendSongError: {
        code: '10209',
        message: '获取推荐歌曲信息失败',
        data: ''
    },
    getLyricError: {
        code: '10210',
        message: '获取歌词内容失败',
        data: ''
    },
    updateSongError: {
        code: '10211',
        message: '修改歌曲信息失败',
        data: ''
    },
    deleteSongError: {
        code: '10212',
        message: '删除歌曲失败',
        data: ''
    },
    songNotExitError: {
        code: '10213',
        message: '歌曲不存在',
        data: ''
    },



    // 不能提交有留空的表单103
    emptyParamsError: {
        code: '10301',
        message: '不能提交有留空的表单',
        data: ''
    },


    // 歌手模块104
    addSingerError: {
        code: '10401',
        message: '添加歌手失败',
        data: ''
    },
    getSingerError: {
        code: '10402',
        message: '获取歌手信息失败',
        data: ''
    },
    singerAlreadyExited: {
        code: '10403',
        message: '歌手已经存在',
        data: ''
    },
    updateSingerError: {
        code: '10404',
        message: '修改歌手信息失败',
        data: ''
    },
    singerNotExitError: {
        code: '10405',
        message: '歌手不存在',
        data: ''
    },
    deleteSingerError: {
        code: '10406',
        message: '删除歌手失败',
        data: ''
    },
    getSingerSongsError: {
        code: '10407',
        message: '获取歌手的歌曲信息失败',
        data: ''
    },



    // 歌单模块 105
    addListError: {
        code: '10501',
        message: '添加歌单失败',
        data: ''
    },
    listAlreadyExited:{
        code: '10502',
        message: '歌单已存在',
        data: ''
    },
    getlistError: {
        code: '10503',
        message: '获取歌单失败',
        data: ''
    },
    getListSongsError: {
        code: '10504',
        message: '获取歌单里的歌曲数据失败',
        data: ''
    },
    listNotExitError: {
        code: '10505',
        message: '歌单不存在',
        data: ''
    },
    updateListError: {
        code: '10506',
        message: '修改歌单信息失败',
        data: ''
    },
    deleteListError: {
        code: '10507',
        message: '删除歌单失败',
        data: ''
    },
    getAllListError: {
        code: '10508',
        message: '获取所有歌单数据失败',
        data: ''
    }
    
}