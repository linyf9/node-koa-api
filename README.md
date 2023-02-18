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