const KoaRouter = require('koa-router');

// 导入中间件处理函数
const authMiddleware = require('../middleware/auth.middleware')
const listMiddleware = require('../middleware/list.middleware')
// // 导入list的控制层
const listController = require('../controller/list.controller')

const router = new KoaRouter({ prefix: '/list' })

/*
1管理员 上传（添加）歌单
参数：
*/
router.post('/admin/add', authMiddleware.author, authMiddleware.hadAdminPermission, listMiddleware.verifyListUpload, listMiddleware.listValidator, listMiddleware.verifylist('post'),listController.addList)

/*
2是否登录，是否为管理员  根据歌单id 修改 对应歌单的基本信息（id等这些参数都在body中）
参数：
*/
router.put('/admin/update', authMiddleware.author, authMiddleware.hadAdminPermission, listMiddleware.verifyListUpload, listMiddleware.listValidator, listMiddleware.verifylist('put'), listController.updateList)

/*
3管理员 根据歌单id 删除 歌单（参数在ctx.request.params中）删除的同时应该也要把本地图片等资源也删除
参数：
*/
router.delete('/admin/delete/:list_id', authMiddleware.author, authMiddleware.hadAdminPermission, listMiddleware.verifylist('delete'), listController.deleteList)

/*
4简单获取 所有歌单的基本信息(默认是最新创建的那四个歌单)
参数：可以关键词模糊查询
*/
router.get('/', listController.getAllLists)

/*
5根据歌单id，动态路由，获取 指定歌单的基本信息（有时间）
参数：
*/
router.get('/:list_id', listMiddleware.verifylist('get'), listController.getListById)

// 6根据 歌单id 获取 歌单中的所有歌曲信息(不包括歌词，歌词可以用歌曲id来获取)
// 默认展示 第一页的10条数据，之后触底再发请求获取第二页的数据
router.get('/songs/:list_id', listMiddleware.verifylist('get'), listController.getListSongsById)

// 7. 获取所有歌单标题 及 id
router.get('/all/name/id', listController.getLists)



module.exports = router