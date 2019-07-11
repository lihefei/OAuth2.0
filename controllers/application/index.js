const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const moment = require('moment');
const Utils = require('../../libs/utils');

/**
 * 读取json文件
 * @param {Stirng} filePath 文件路径
 * @returns {Object} 返回读取数据或错误信息
 */
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', function(err, data) {
            if (err) {
                reject({ err });
            } else {
                resolve({ data: data || '[]' });
            }
        });
    });
}

/**
 * 写入json文件
 * @param {Stirng} filePath 文件路径
 * @param {Stirng} content 需要写入的内容
 * @returns {Object} 返回读取数据或错误信息
 */
function writeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, function(err) {
            if (err) {
                console.log(err);
                reject({ err });
            } else {
                console.log('文件创建成功，地址：' + filePath);
                resolve({});
            }
        });
    });
}

/**
 * id递归去重
 * @param {Stirng} id 创建的id
 * @param {Array} list 数据库中的id列表
 * @returns {Stirng} 返回唯一id
 */
function filterRepeatId(id, list) {
    let resultId = id;
    for (let i = 0; i < list.length; i++) {
        if (id === list[i].client_id) {
            resultId = filterRepeatId(Utils.createUniqueId(20), list);
            return resultId;
        }
    }
    return resultId;
}

class ApplicationController {
    /**
     *查询应用列表
     *@returns {Object} 返回查询结果，列表数据包含在list中
     */
    static async list(ctx) {
        const filePath = path.resolve(__dirname, '../../data/application.json');
        let response = {};

        const readResult = await readFile(filePath);

        if (readResult.err) {
            response.code = 1001;
            response.msg = readResult.err;
        } else {
            response.code = 0;
            response.msg = '查询成功';
            response.data = readResult.data;
        }

        ctx.body = response;
    }

    static async add(ctx) {
        const filePath = path.resolve(__dirname, '../../data/application.json');
        const readResult = await readFile(filePath);
        let response = {};
        if (readResult.err) {
            response.code = 1001;
            response.msg = readResult.err;
        } else {
            const requestResult = Object.assign({}, ctx.request.body);
            const key = 'ABC';

            const list = JSON.parse(readResult.data);

            let id = filterRepeatId(Utils.createUniqueId(20), list);
            requestResult.client_id = id;
            requestResult.client_secret = md5(id + key);
            requestResult.createTime = moment().format('YYYY-MM-DD HH:mm:ss');

            list.push(requestResult);

            const writeContent = JSON.stringify(list);

            if (writeContent === '[]') {
                response.code = 1005;
                response.msg = '保存失败';
            } else {
                const writeResult = await writeFile(filePath, writeContent);
                if (writeResult.err) {
                    response.code = 1002;
                    response.msg = writeResult.err;
                }
                response.code = 0;
                response.msg = '保存成功';
            }
        }

        ctx.body = response;
    }
}

module.exports = ApplicationController;
