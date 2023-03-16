// 路由转发模块 之 歌曲singer路由router层
const KoaRouter = require('koa-router')

// 导入中间件处理函数
const authMiddleware = require('../middleware/auth.middleware')
const singerMiddleware = require('../middleware/singer.middleware')
const uploadMiddleware = require('../middleware/upload.middleware')
// 导入singer的控制层
const singerController = require('../controller/singer.controller')
const router = new KoaRouter({prefix: '/singer'})

/*
1. 管理员登录 添加歌手 post /singer/
参数：
singer_name
singer_details
singer_avatar
*/
// 增
// router.post('/', authMiddleware.auth, authMiddleware.hadAdminPermission, uploadMiddleware.verifyAdminUpload, singerMiddleware.singerValidator, singerMiddleware.verifySinger('post'), singerController.addSinger)
// authMiddleware.author
router.post('/admin/add', authMiddleware.author, authMiddleware.hadAdminPermission, uploadMiddleware.verifyAdminUpload, singerMiddleware.singerValidator, singerMiddleware.verifySinger('post'), singerController.addSinger)
// router.post('/admin/add', singerController.addSinger)

// 2. 管理员登录 修改(更新)歌手信息 是否登录，是否管理员，是否上传图片，是否为空，存在就可以修改，不存在就不行
// 内容不能留空白，一定要全填，不能只填一个
// 根据歌手id 修改 对应歌手的基本信息
// 改
// router.put('/', authMiddleware.auth, authMiddleware.hadAdminPermission, uploadMiddleware.verifyAdminUpload, singerMiddleware.singerValidator, singerMiddleware.verifySinger('put'), singerController.updateSinger)
router.put('/admin/update', authMiddleware.author, authMiddleware.hadAdminPermission, uploadMiddleware.verifyAdminUpload, singerMiddleware.singerValidator, singerMiddleware.verifySinger('put'), singerController.updateSinger)

// 3. 管理员登录 删除歌手 通过歌手id删除歌手信息
// 删
router.delete('/admin/:singer_id', authMiddleware.author, authMiddleware.hadAdminPermission, singerMiddleware.verifySinger('delete'), singerController.deleteSinger)

// 查
// 无需登录

// 4. 获取（查询）所有(不要全部，默认10条，以后下拉刷新再接着展示)歌手的基本信息（还可以根据歌手名字关键词模糊查询）query参数（可传可不传）
// 如果传，应该要根据 关键词与歌手名字 的判断数据库中有没有该歌手（直接在操作数据库时，如果返回是空数组就表明不存在）
router.get('/', singerController.getAllSinger)
// 5. 获取（查询）根据id 获取指定 歌手信息（要有时间）
// 先判断 数据库中有没有该歌手，有才能获取对应的信息
router.get('/:singer_id', singerMiddleware.verifySinger('get'), singerController.getSingerById)
// 6. 根据歌手id获取歌手的全部歌曲（默认获取最新的10条）
router.get('/songs/:singer_id', singerMiddleware.verifySinger('get'), singerController.getSingerSongsById)

// 7. 获取所有歌手名称 及 id
router.get('/all/name/id', singerController.getSingers)


module.exports = router


