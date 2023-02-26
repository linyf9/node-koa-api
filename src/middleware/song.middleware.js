const path = require('path');
const fs = require('fs')
const errType = require('../constant/err.type')
const songService = require('../service/song.service')

// 歌曲 中间件 Middleware层
class SongMiddleware {

    // 验证 歌词文件、歌词封面、mp3文件 有没有上传，格式对不对
    async uploadValidator(ctx, next) {
        try {
            // console.log(ctx.request.files);
            let {song_imgpath='',song_filepath='',song_lycpath=''} = ctx.request.files
            const fileTypes = ['image/jpeg', 'image/png', 'audio/mpeg', 'application/octet-stream']

            // 1. 如果没有上传歌曲封面
            if (!song_imgpath) {
                if (fileTypes.includes(song_filepath.mimetype)) { //表示在fileTypes数组中的文件格式
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_filepath.filepath)))
                }
                if (fileTypes.includes(song_lycpath.mimetype)) { //表示在fileTypes数组中的文件格式
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_lycpath.filepath)))
                }
                console.error('您没有上传歌曲封面', song_imgpath);
                return ctx.app.emit('error', errType.notUploadSongImg, ctx)
            }
            // 1. 已上传，如果图片格式有误就提示错误信息
            if (song_imgpath) {
                if (!fileTypes.includes(song_imgpath.mimetype)) { //表示不在fileTypes数组中的文件格式
                    // 删除upload中该上传有误的文件
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_imgpath.filepath)))
                    // 返回上传有误的提示信息
                    return ctx.app.emit('error', errType.unSupportedFileType, ctx)
                } 
            } 

            // 2. 如果没有上传歌曲MP3文件
            if (!song_filepath) {
                if (fileTypes.includes(song_imgpath.mimetype)) { //表示在fileTypes数组中的文件格式
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_imgpath.filepath)))
                }
                if (fileTypes.includes(song_lycpath.mimetype)) { //表示在fileTypes数组中的文件格式
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_lycpath.filepath)))
                }
                console.error('您没有上传歌曲MP3文件', song_filepath);
                return ctx.app.emit('error', errType.notUploadSongMP3, ctx)
            }
            // 2. 已上传，如果图片格式有误就提示错误信息
            if (song_filepath) {
                if (!fileTypes.includes(song_filepath.mimetype)) { //表示不在fileTypes数组中的文件格式
                    // 删除upload中该上传有误的文件
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_filepath.filepath)))
                    // 返回上传有误的提示信息
                    return ctx.app.emit('error', errType.unSupportedFileType, ctx)
                } 
            } 

            // 3. 如果没有上传歌曲歌词文件
            if (!song_lycpath) {
                if (fileTypes.includes(song_imgpath.mimetype)) { //表示在fileTypes数组中的文件格式
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_imgpath.filepath)))
                }
                if (fileTypes.includes(song_filepath.mimetype)) { //表示在fileTypes数组中的文件格式
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_filepath.filepath)))
                }
                console.error('您没有上传歌曲歌词文件', song_lycpath);
                return ctx.app.emit('error', errType.notUploadSongLyc, ctx)
            }
            // 3. 已上传，如果图片格式有误就提示错误信息
            if (song_lycpath) {
                if (!fileTypes.includes(song_lycpath.mimetype)) { //表示不在fileTypes数组中的文件格式
                    // 删除upload中该上传有误的文件
                    fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_lycpath.filepath)))
                    // 返回上传有误的提示信息
                    return ctx.app.emit('error', errType.unSupportedFileType, ctx)
                } 
            }

        } catch (error) {
            console.error('上传文件失败', error);
            return ctx.app.emit('error', errType.uploadFileError, ctx)
        } 

        // 没有错误就放行，交给下一个中间件处理
        await next()
    }

    // 验证 song_songname是否为空，而song_rank是允许为空的
    async songValidator(ctx, next) {
        // 拿前端传递的数据
        const { song_songname } = ctx.request.body
        // 验证合法性（是否为空等）
        if (!song_songname) {
            console.error('歌名不能为空', { song_songname });
            // ctx.app.emit提交错误('error', 错误对象内容，上下文对象)，会提交到app，index.js中被app.on监听
            return ctx.app.emit('error', errType.emptySongnameSidError, ctx)
        }
        // 如果没有出现错误，就交由下一个中间件处理（这里是异步的）
        await next()
    }


    // 验证 歌名(曲) 是否在数据库中存在
    verifySong(type) {
        return async (ctx, next) => {
            try {
                let res
                if (type === 'post') {
                    const { song_songname } = ctx.request.body
                    const {song_imgpath,song_filepath,song_lycpath} = ctx.request.files
                    res = await songService.getSongInfo({ song_songname })
                    // console.log('erteee',res);
                    if (res) { //如果进得来，就说明歌曲已经存在
                        console.error('歌曲已经存在', res.song_songname);
                        // 歌曲已经存在, 删除upload中该上传的头像
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_imgpath.filepath)))
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_filepath.filepath)))
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_lycpath.filepath)))
                        return ctx.app.emit('error', errType.songAlreadyExited, ctx)
                    }
                }

                // 根据 song_id 修改歌曲信息
                if (type === 'put') { 
                    // 通过 song_id 查看 歌单是否在数据库中
                    const { song_id } = ctx.request.body
                    const { song_imgpath, song_filepath, song_lycpath } = ctx.request.files
                    res = await songService.getSongInfo({ song_id })
                    // 如果之前有这首歌曲，修改信息时，应该先查到该歌曲之前的封面，然后删掉本地之前的封面，换新的了
                    if (res) {
                        song_imgpath && fs.unlinkSync(path.join(__dirname, '../upload/', res.song_imgpath.split('0/')[1]))
                        song_filepath && fs.unlinkSync(path.join(__dirname, '../upload/', res.song_filepath.split('0/')[1]))
                        res.song_lycpath && fs.unlinkSync(path.join(__dirname, '../upload/', res.song_lycpath))
                    }
                    if (Object.prototype.toString.call(res) === '[object Boolean]') {
                       //如果 put 进得来，就说明歌曲不存在，不能修改歌曲信息
                        console.error('歌曲不存在', song_id);
                        // 歌曲不存在, 删除upload中该上传的文件
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_imgpath.filepath)))
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_filepath.filepath)))
                        fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_lycpath.filepath)))
                        return ctx.app.emit('error', errType.songNotExitError, ctx)
                    }
                }
                // 根据 song_id 删除单个，或获取单个
                if (type === 'delete' || type === 'get') {
                    const { song_id } = ctx.request.params
                    res = await songService.getSongInfo({ song_id })
                    if (Object.prototype.toString.call(res) === '[object Boolean]') {
                       //如果 delete 进得来，就说明歌曲不存在，删除失败
                        console.error('歌曲不存在', song_id);
                        return ctx.app.emit('error', errType.songNotExitError, ctx)
                    }
                    
                }



            } catch (error) {
                 console.error('获取歌曲信息失败', error);
            return ctx.app.emit('error', errType.getSongError, ctx)
            }
            await next()
        }
    }
    // async verifySong(ctx, next) {
    //     try {
    //         const { song_songname } = ctx.request.body
    //         const {song_imgpath,song_filepath,song_lycpath} = ctx.request.files
    //         const res = await songService.getSongInfo({ song_songname })
    //         // console.log('erteee',res);
    //         if (res) { //如果进得来，就说明歌手已经存在
    //             console.error('歌曲已经存在', res.song_songname);
    //             // 歌手已经存在, 删除upload中该上传的头像
    //             fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_imgpath.filepath)))
    //             fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_filepath.filepath)))
    //             fs.unlinkSync(path.join(__dirname, '../upload', path.basename(song_lycpath.filepath)))
    //             return ctx.app.emit('error', errType.songAlreadyExited, ctx)
    //         }
    //     } catch (error) {
    //         console.error('获取歌曲信息失败', error);
    //         return ctx.app.emit('error', errType.getSongError, ctx)
    //     }
    //     // 无误就继续走下去
    //     await next()
    // }

}

module.exports = new SongMiddleware()


