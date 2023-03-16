// 路由转发模块 之 歌曲song路由router层
const KoaRouter = require('koa-router')

// 导入中间件处理函数
const authMiddleware = require('../middleware/auth.middleware')
const songMiddleware = require('../middleware/song.middleware')
// 导入song的控制层
const songController = require('../controller/song.controller')

const router = new KoaRouter({ prefix: '/song' }) //配置统一访问前缀


/*
1管理员登录 上传（添加）歌曲 post 
参数：
song_songname
song_singerid
song_imgpath
song_filepath
song_lycpath
*/
router.post('/admin/upload', authMiddleware.author, authMiddleware.hadAdminPermission, songMiddleware.uploadValidator, songMiddleware.songValidator, songMiddleware.verifySong('post'), songController.upload)

// 2管理员登录 根据body参数 song_id 修改歌曲信息  songMiddleware.uploadValidator, songMiddleware.verifySong('put')
router.put('/admin/update', authMiddleware.author, authMiddleware.hadAdminPermission, songMiddleware.songValidator, songController.updateSong)

// 3管理员登录 删除歌曲
router.delete('/admin/delete/:song_id', authMiddleware.author, authMiddleware.hadAdminPermission, songMiddleware.verifySong('delete'), songController.deleteSong)

// 4. 获取（查询）所有(不要全部，默认10条，以后下拉刷新再接着展示)歌曲的基本信息（还可以根据歌曲名称 关键词模糊查询）query参数（可传可不传）
// 如果传，应该要根据 关键词与歌曲名称 的判断数据库中有没有该歌曲（直接在操作数据库时，如果返回是空数组就表明不存在）
// 根据 关键字模糊查询 获取歌曲信息
router.get('/', songController.getAllSongs)

// 下面有俩的位置不能更换，不然有bug，因为会先匹配动态参数，所以如果 '/rank' 放在 '/:song_id' 下面，就会触发'/:song_id'，它会把/rank里的rank当做:song_id的song_id，所以尽量将动态参数的放最后
// 5根据 song_rank 榜单名称 查询字符串 查找所有歌曲（默认10条，触底再发请求10条）
router.get('/rank', songController.getAllRankSongs)

// 6获取推荐歌曲（song_rank为空 或者 song_listid为空 或者 song_rank和song_listid都为空；那么就编入推荐歌曲）
router.get('/recommend', songMiddleware.verifySong('get'), songController.getRecommendSongs)

// 7根据歌曲id获取 歌词内容
router.get('/lyric/:song_id', songMiddleware.verifySong('get'), songController.getSongLyricById)

// 8根据歌曲id获取歌曲基本信息(无歌词，有时间)
router.get('/detail/:song_id', songMiddleware.verifySong('get'), songController.getSongById)

// 根据歌曲id获取mp3链接
router.get('/mp3src/:song_id', songMiddleware.verifySong('get'), songController.getSongMp3ById)


// 后台获取全部歌曲信息
router.get('/all', songController.getSongs)


module.exports = router