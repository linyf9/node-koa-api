// 导入dotenv，会去根目录下加载.env文件，把文件中的键值对写到环境变量中
const dotenv = require('dotenv');
dotenv.config()

// console.log(process.env.APP_PORT)
module.exports = process.env // process.env是环境变量对象，会把.env文件中的键值对挂载到env对象中