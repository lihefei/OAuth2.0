const router = require('koa-router')();
const api = require('../api');
const ctrls = require('../controllers');

const routes = router
    .post(api.user.register, ctrls.user.register)
    .post(api.user.login, ctrls.user.login)
    .routes();

module.exports = routes;
