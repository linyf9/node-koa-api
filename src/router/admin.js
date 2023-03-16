const path = require('path')
const fs = require('fs')
const KoaRouter = require('koa-router');
const { APP_DURL } = require('../config/config.default')
const router = new KoaRouter({ prefix: '/admin' })

const listService = require('../service/list.service')
const singerService = require('../service/singer.service')
const userService = require('../service/user.service');
const songService = require('../service/song.service');

router.post('/upload', (ctx, next) => {
    try {
        // 上传单个文件
    console.log(ctx.request.files);
    const {file} = ctx.request.files; // 获取上传文件
    // const filePath = APP_DURL + path.basename(singer_avatar.filepath)
    return ctx.body = {
        code: 200,
        message: "上传成功！",
        data: APP_DURL + path.basename(file.filepath)
    };
    // return ctx.body = "上传成功！";
    } catch (error) {
        console.log(error);
        return ctx.app.emit(error)
    }
});

// 歌手数量
// 歌单数量
// 歌曲数量
// 用户数量
router.get('/amount', async (ctx, next) => {
    try {
        // 获取歌手数量
        let singerAmount = await singerService.getAllSingerTotal()
        // 获取歌单数量
        let listAmount = await listService.getAllListTotal()
        // 获取歌曲数量
        let songAmount = await songService.getAllSongTotal()
        // 获取用户数量
        let userAmount = await userService.getAllUserTotal()

        // 获取歌单标题 及 每个歌单中有多少首歌
        let pieData = await listService.getTitleAndSongs()
        
        // 获取歌曲类型的数量
        let songRankAmountObj = await songService.getSongRankAmount()
        console.log(songRankAmountObj);
        return ctx.body = {
            code: 200,
            message: '获取数据成功',
            // 柱状图1数据
            barData: {
                // X轴数据
                xAxisData: ['歌手', '歌单', '歌曲', '用户'],
                // Y轴数据
                seriesData: [singerAmount,listAmount,songAmount,userAmount]
            },
            // 饼状图
            pieData,
            // 柱状图2数据
            bar2Data: {
                // X轴数据
                xAxisData: ['每日推荐', '热歌榜', '飙升榜', '中文dj榜'],
                // Y轴数据
                seriesData: [songRankAmountObj.dailyAmount,songRankAmountObj.hotAmount,songRankAmountObj.upAmount,songRankAmountObj.djAmount]
            },
        }
    } catch (error) {
        console.log('获取数据失败', error);
    }
})

// 各个类型里有几首歌

// 每个歌单里有几首歌

module.exports = router;