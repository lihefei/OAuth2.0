const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const api = require('../api');
const ctrls = require('../controllers');

/* 默认进入登录页面 */
const index = ctx => {
    ctx.type = 'html';
    const defaultPath = path.join(__dirname, '../public/login.html');
    ctx.body = fs.createReadStream(defaultPath);
};

const routes = router
    .get('/', index)
    /* 用户模块 */
    .post(api.user.register, ctrls.user.register) //注册
    .post(api.user.login, ctrls.user.login) //登录
    .post(api.user.getAppName, ctrls.user.getAppName)

    /* 应用模块 */
    .post(api.application.add, ctrls.application.add) //添加
    .get(api.application.list, ctrls.application.list) //列表

    /* 鉴权模块 */
    .post(api.authorize.token, ctrls.authorize.token)

    .routes();

module.exports = routes;
