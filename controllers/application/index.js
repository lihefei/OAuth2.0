const fs = require('fs');
const path = require('path');

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
            requestResult.client_id = requestResult.name + key;
            requestResult.client_secret = requestResult.name + key + key;
            console.log(readResult);

            const list = JSON.parse(readResult.data);
            list.push(requestResult);

            const writeContent = JSON.stringify(list);

            const writeResult = await writeFile(filePath, writeContent);
            if (writeResult.err) {
                response.code = 1002;
                response.msg = writeResult.err;
            }

            response.code = 0;
            response.msg = '保存成功';
        }

        ctx.body = response;
    }
}

module.exports = ApplicationController;
