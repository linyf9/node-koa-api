const path = require('path')
const fs = require('fs')
const { APP_DURL } = require('../config/config.default')
const errType = require('../constant/err.type')
const songService = require('../service/song.service')
const sonService = require('../service/song.service')
const { readLrc } = require('../utils/read.lrc')

const getAllSongTotal = async () => {
    try {
        let total = await songService.getAllSongTotal()
        return total
    } catch (error) {
        console.log('获取总数失败');
    }
}
// 歌曲 控制器Controller层
class SongController {

    // 1管理员（添加）上传歌曲
    async upload(ctx, next) {
        try {
            // 1. 获取数据 song_songname、song_singerid、song_listid,song_imgpath、song_filepath、song_lycpath
            console.log(ctx.request.files);
            let { song_imgpath, song_filepath, song_lycpath } = ctx.request.files
            song_imgpath = APP_DURL + path.basename(song_imgpath.filepath)
            song_filepath = APP_DURL + path.basename(song_filepath.filepath)
            song_lycpath = path.basename(song_lycpath.filepath)
            let { song_songname, song_rank, song_listid, song_singerid } = ctx.request.body
            if (song_listid === '') song_listid = null;
            const song = { song_songname, song_imgpath, song_filepath, song_lycpath, song_rank, song_listid, song_singerid }

            // 2. 操作数据库 Service层
            let res = await sonService.addSong(song)
            // console.log(res);
            if (res) {
                let { song_lycpath, ...song } = res
                // 获取歌词文件的内容，再赋给 song.song_lyc
                song.song_lyc = readLrc(song_lycpath)
                // 3. 返回数据
                return ctx.body = {
                    code: 200,
                    message: '歌曲上传成功',
                    data: song
                }
            }
        } catch (error) {
            console.error('歌曲上传失败', error);
            return ctx.app.emit('error', errType.uploadSongError, ctx)
        }

    }

    // 2管理员 修改 歌曲信息（通过歌单的song_id来修改，都在body或者files中）
    async updateSong(ctx, next) {
        try {
            // song_singerid不用修改，song_imgpath，song_filepath，song_lycpath，也不用修改
            const { song_id, song_songname, song_rank, song_listid } = ctx.request.body
            let { song_imgpath = '', song_filepath = '', song_lycpath = '' } = ctx.request.files
            // song_imgpath = APP_DURL + path.basename(song_imgpath.filepath)
            // song_filepath = APP_DURL + path.basename(song_filepath.filepath)
            // song_lycpath = path.basename(song_lycpath.filepath)

            const { song_singerid } = await songService.getSongInfo({ song_id })

            if (song_imgpath) {
                if (song_filepath) {
                    if (song_lycpath) { //全部都修改
                        console.log('全部都修改');
                        song_imgpath = APP_DURL + path.basename(song_imgpath.filepath)
                        song_filepath = APP_DURL + path.basename(song_filepath.filepath)
                        song_lycpath = path.basename(song_lycpath.filepath)
                        if (await songService.updateSong({ song_id, song_songname, song_imgpath, song_filepath, song_lycpath, song_rank, song_listid, song_singerid })) {
                            return ctx.body = {
                                code: 200,
                                message: '修改歌曲信息成功',
                                data: ''
                            }
                        }
                    } else { //只修改 封面 和 mp3
                        console.log('只修改 封面 和 mp3');
                        song_imgpath = APP_DURL + path.basename(song_imgpath.filepath)
                        song_filepath = APP_DURL + path.basename(song_filepath.filepath)
                        if (await songService.updateSong({ song_id, song_songname, song_imgpath, song_filepath, song_rank, song_listid, song_singerid })) {
                            return ctx.body = {
                                code: 200,
                                message: '修改歌曲信息成功',
                                data: ''
                            }
                        }
                    }
                } else if (song_lycpath) { //只修改封面 和 歌词
                    console.log('只修改封面 和 歌词');
                    song_imgpath = APP_DURL + path.basename(song_imgpath.filepath)
                    song_lycpath = path.basename(song_lycpath.filepath)
                    if (await songService.updateSong({ song_id, song_songname, song_imgpath, song_lycpath, song_rank, song_listid, song_singerid })) {
                        return ctx.body = {
                            code: 200,
                            message: '修改歌曲信息成功',
                            data: ''
                        }
                    }
                } else { // 只修改 封面
                    console.log('只修改 封面');
                    song_imgpath = APP_DURL + path.basename(song_imgpath.filepath)
                    if (await songService.updateSong({ song_id, song_songname, song_imgpath, song_rank, song_listid, song_singerid })) {
                        return ctx.body = {
                            code: 200,
                            message: '修改歌曲信息成功',
                            data: ''
                        }
                    }
                }
            } else if (song_filepath) {
                if (song_lycpath) { // 只修改 MP3 和 歌词
                    console.log('只修改 MP3 和 歌词');
                    song_filepath = APP_DURL + path.basename(song_filepath.filepath)
                    console.log(song_filepath,song_lycpath.filepath,'8765');
                    song_lycpath = path.basename(song_lycpath.filepath)
                    if (await songService.updateSong({ song_id, song_songname, song_lycpath, song_filepath, song_rank, song_listid, song_singerid })) {
                        return ctx.body = {
                            code: 200,
                            message: '修改歌曲信息成功',
                            data: ''
                        }
                    }
                } else {
                    console.log('只修改 MP3');
                    song_filepath = APP_DURL + path.basename(song_filepath.filepath)
                    if (await songService.updateSong({ song_id, song_songname, song_filepath, song_rank, song_listid, song_singerid })) {
                        return ctx.body = {
                            code: 200,
                            message: '修改歌曲信息成功',
                            data: ''
                        }
                    }
                }
            } else if (song_lycpath) { // 只修改歌词
                console.log('只修改歌词');
                song_lycpath = path.basename(song_lycpath.filepath)
                if (await songService.updateSong({ song_id, song_songname, song_lycpath, song_rank, song_listid, song_singerid })) {
                    return ctx.body = {
                        code: 200,
                        message: '修改歌曲信息成功',
                        data: ''
                    }
                }
            } else { //3个文件都不修改
                console.log('3个文件都不修改');
                if (await songService.updateSong({ song_id, song_songname, song_rank, song_listid, song_singerid })) {
                    return ctx.body = {
                        code: 200,
                        message: '修改歌曲信息成功',
                        data: ''
                    }
                }
            }


        } catch (error) {
            console.error('修改歌曲信息失败', error);
            return ctx.app.emit('error', errType.updateSongError, ctx)
        }
    }

    // 3管理员 删除 歌曲
    async deleteSong(ctx, next) {
        try {
            // 1.获取歌曲song_id，这个动态参数
            const { song_id } = ctx.request.params
            // 先获取歌单封面，删除本地图片，再去做删除操作
            const res = await songService.getSongInfo({ song_id })
            //  console.log(res);
            res.song_imgpath && fs.unlinkSync(path.join(__dirname, '../upload/', res.song_imgpath.split('0/')[1]))
            res.song_filepath && fs.unlinkSync(path.join(__dirname, '../upload/', res.song_filepath.split('0/')[1]))
            res.song_lycpath && fs.unlinkSync(path.join(__dirname, '../upload/', res.song_lycpath))
            // 2. 操作数据库 返回true 或 false
            if (await songService.deleteSong(song_id)) {
                // 3. 返回数据数据
                return ctx.body = {
                    code: 200,
                    message: '删除歌曲成功',
                    data: ''
                }
            }
        } catch (error) {
            console.error('删除歌曲失败', error);
            return ctx.app.emit('error', errType.deleteSongError, ctx)
        }
    }

    // 4根据歌曲id获取歌曲基本信息
    async getSongById(ctx, next) {
        try {
            const { song_id } = ctx.request.params
            const res = await songService.getSongInfo({ song_id })
            return ctx.body = {
                code: 200,
                message: '获取歌曲成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌曲失败', error);
            return ctx.app.emit('error', errType.getSongError, ctx)
        }
    }

    // 5根据歌曲id获取歌词内容
    async getSongLyricById(ctx, next) {
        try {
            const { song_id } = ctx.request.params
            const res = await songService.getSongLyricById(song_id)
            return ctx.body = {
                code: 200,
                message: '获取歌词内容成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌词内容失败', error);
            return ctx.app.emit('error', errType.getLyricError, ctx)
        }
    }

    // 6获取推荐歌曲
    async getRecommendSongs(ctx, next) {
        try {
            const { offset, limit } = ctx.request.query
            const res = await songService.getRecommendSongs({ offset, limit })
            return ctx.body = {
                code: 200,
                message: '获取推荐歌曲成功',
                data: res
            }

        } catch (error) {
            console.error('获取推荐歌曲失败', error);
            return ctx.app.emit('error', errType.getRecommendSongError, ctx)
        }
    }

    // 7获取（查询）所有(不要全部，默认10条，以后下拉刷新再接着展示)歌曲的基本信息
    // 还可以根据 歌曲名称关键词 模糊查询出所有匹配的歌曲
    // 根据 keyword 关键字，
    async getAllSongs(ctx, next) {
        try {
            let { keyword, offset, limit } = ctx.request.query
            const res = await songService.getAllSong({ keyword, offset, limit })
            // 如果返回的是空数组，则报歌曲不存在的提示
            if (res.length === 0) return ctx.app.emit('error', errType.songNotExitError, ctx)
            let total = await getAllSongTotal()
            return ctx.body = {
                code: 200,
                message: '获取全部歌曲信息成功',
                total,
                data: res
            }
        } catch (error) {
            console.error('获取全部歌曲信息失败', error);
            return ctx.app.emit('error', errType.getSongError, ctx)
        }
    }

    // 8根据 song_rank 榜单名称 查询字符串 查找所有歌曲（默认10条，触底再发请求10条）
    async getAllRankSongs(ctx, next) {
        try {
            let { song_rank, offset, limit } = ctx.request.query
            const res = await songService.getAllRankSong({ song_rank, offset, limit })
            // 如果返回的是空数组，则报歌曲不存在的提示
            // if(res.length === 0) return ctx.app.emit('error', errType.songNotExitError, ctx)
            return ctx.body = {
                code: 200,
                message: '获取全部歌曲信息成功',
                data: res
            }
        } catch (error) {
            console.error('获取全部歌曲信息失败', error);
            return ctx.app.emit('error', errType.getSongError, ctx)
        }
    }

    // 9. 根据歌曲id获取MP3链接
    async getSongMp3ById(ctx, next) {
        try {
            const { song_id } = ctx.request.params
            const res = await songService.getSongMp3ById(song_id)
            return ctx.body = {
                code: 200,
                message: '获取歌曲MP3链接成功',
                data: res
            }
        } catch (error) {
            console.error('获取歌曲MP3链接失败', error);
            return ctx.app.emit('error', errType.getMP3Error, ctx)
        }
    }


    // 10. 后台获取全部歌曲信息
    async getSongs(ctx, next) {
        try {
            let { keyword, offset, limit } = ctx.request.query
            const res = await songService.getAllSongs({ keyword, offset, limit })
            // 如果返回的是空数组，则报歌曲不存在的提示
            if (res.length === 0) return ctx.app.emit('error', errType.songNotExitError, ctx)
            let total = await getAllSongTotal()
            return ctx.body = {
                code: 200,
                message: '获取全部歌曲信息成功',
                total,
                data: res
            }
        } catch (error) {
            console.error('获取全部歌曲信息失败', error);
            return ctx.app.emit('error', errType.getSongError, ctx)
        }
    }

}

module.exports = new SongController()