<!-- 前置 -->
src/app文件夹： 主要业务管理模块，对 中间件 及 路由等 从入口文件main.js抽离到这
src/config文件夹： 配置文件，如环境变量
src/constant文件夹： 常量文件，如错误类型常量模块
src/controller文件夹： 控制层、业务层（解析数据、操作数据库、返回数据），还将操作数据库封装到service层
src/db文件夹： 连接数据库
src/middleware文件夹： 将在控制层的一些操作（如验证操作），封装成中间件函数，然后在router层使用，在进入控制层之前先验证
src/model文件夹： 模型层，将 数据表 抽象成类，字段抽象成类实例对象的属性
src/router文件夹： 各级路由模块，封装各类路由规则模块（/，何种请求等）将不同的url请求转发给 控制器的不同方法
src/service文件夹： 服务层，封装用于 操作数据库 的各种类 （对数据库数据的增删改查业务）
main.js文件： 项目入口文件
.env文件： 配置环境变量文件
.gitignore文件： git的忽略文件

流程：前端发请求 ——> 经过router层(导入controller层相应的方法) ——> 经过middleware层中间件的处理（会用到service层 和 constant常量层，且会在app中统一处理错误） ——> 经过controller层（导入Service层相应的方法） ——> 进入Service层（导入model层的数据表模型类，进而操作数据库）



npm init -y

git init
git add README.md
git commit -m "第一次提交"
git remote add origin https://github.com/linyf9/node-koa-api.git
git push -u origin master

npm install koa

npm i nodemon -D

npm run dev
"scripts": {
    "dev": "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },




npm install dotenv --save   // dotenv会去根目录下加载.env文件，把文件中的键值对写到环境变量中


npm i koa-router
npm i koa-body


Sequelize 是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。
Sequelize 遵从 语义版本控制。 支持 Node v10 及更高版本以便使用 ES6 功能。
请通过 Getting started - 入门 来学习更多相关内容. 如果你想要学习 Sequelize API 请通过 API 参考 (英文)。
ORM: 对象关系映射(面向对象的方式去操作数据库)
    数据表 映射(对应)一个类
    数据表中的数据行(记录) 对应一个对象
    数据表字段 对应对象的属性
    数据表的操作 对应对象的方法
npm i sequelize
npm i mysql2 