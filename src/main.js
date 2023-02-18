// 入口文件
const { APP_PORT } = require('./config/config.default')

// 从app文件夹中的index.js导入 app
const app = require('./app')

app.listen(APP_PORT, () => {
    console.log(`http://127.0.0.1:${APP_PORT}`);
})