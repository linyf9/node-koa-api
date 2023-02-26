const path = require('path')
const fs = require('fs')
// 获取歌词文件的内容
const readLrc = (fileName) => { //文件名包含后缀.lrc
    const filepath = path.join(__dirname, '../upload/', fileName)
    const fileContent = fs.readFileSync(filepath, { encoding: 'utf-8' })
    // console.log(fileContent);
    return fileContent
}

// readLrc('235ac344f47c643c8fc00e202.lrc')

module.exports = {
    readLrc
}