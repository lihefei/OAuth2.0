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

class userController {
    static async register(ctx) {
        const filePath = path.resolve(__dirname, '../../data/user.json');
        let response = {};

        const readResult = await readFile(filePath);

        if (readResult.err) {
            response.code = 1001;
            response.msg = readResult.err;
        } else {
            const userList = JSON.parse(readResult.data);
            userList.push(ctx.request.body);
            const writeContent = JSON.stringify(userList);

            const writeResult = await writeFile(filePath, writeContent);
            if (writeResult.err) {
                response.code = 1002;
                response.msg = writeResult.err;
            }

            response.code = 0;
            response.msg = '注册成功';
        }

        ctx.body = response;
    }

    static async login(ctx) {
        const filePath = path.resolve(__dirname, '../../data/user.json');
        const readResult = await readFile(filePath);
        let response = {};
        if (readResult.err) {
            response.code = 1001;
            response.msg = readResult.err;
        } else {
            const userList = JSON.parse(readResult.data);
            const name = ctx.request.body.name;
            const pswd = ctx.request.body.pswd;

            let flag = false;
            for (let i = 0; i < userList.length; i++) {
                console.log(userList[i].name, userList[i].pswd);
                console.log(userList[i].name === name && userList[i].pswd === pswd);

                if (userList[i].name === name && userList[i].pswd === pswd) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                response.code = 1004;
                response.msg = '用户名或密码错误';
            } else {
                response.code = 0;
                response.msg = '登录成功';
                response.token = 'xxxxxxxxxx';
            }
        }

        ctx.body = response;
    }
}

module.exports = userController;
