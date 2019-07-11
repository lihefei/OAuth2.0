const fs = require('fs');
const path = require('path');
const jwt = require('jwt');

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

class authorizeController {
    static async token(ctx) {
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
                console.log(
                    userList[i].name === name && userList[i].pswd === pswd
                );

                if (userList[i].name === name && userList[i].pswd === pswd) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                response.code = 1004;
                response.msg = '用户名或密码错误';
            } else {
                const appFilePath = path.resolve(
                    __dirname,
                    '../../data/application.json'
                );
                const readAppResult = await readFile(appFilePath);

                if (readAppResult.err) {
                    response.code = 1001;
                    response.msg = readResult.err;
                } else {
                    const appList = JSON.parse(readResult.data);
                    //const grant_type = ctx.request.body.grant_type;
                    const clientId = ctx.request.body.client_id;
                    const clientSecret = ctx.request.body.client_secret;

                    let appFlag = false;

                    for (let i = 0; i < appList.length; i++) {
                        console.log(appList[i].name, appList[i].pswd);

                        if (
                            appList[i].client_id === clientId &&
                            appList[i].client_secret === clientSecret
                        ) {
                            appFlag = true;
                            break;
                        }
                    }

                    if (!appFlag) {
                        response.code = 1007;
                        response.msg = 'client_id或client_secret错误';
                    } else {
                        const tokenFilePath = path.resolve(
                            __dirname,
                            '../../data/authorize.json'
                        );

                        const readTokenResult = await readFile(tokenFilePath);

                        if (readTokenResult.err) {
                            response.code = 1001;
                            response.msg = readResult.err;
                        } else {
                            const tokenList = JSON.parse(readTokenResult.data);
                            const token = jwt(token);
                            const tokenFlag = false;

                            for (let i = 0; i < tokenList.length; i++) {
                                //若果已经有历史token，则更新token
                                if (tokenList[i].client_id === clienId) {
                                    tokenList[i].token = token;
                                    tokenFlag = true;
                                    break;
                                }
                            }

                            if (!tokenFlag) {
                                //无历史token便新增token
                                tokenList.push({
                                    client_id: clienId,
                                    token: token
                                });
                            }

                            const writeContent = JSON.stringify(tokenList);

                            const writeResult = await writeFile(
                                tokenFilePath,
                                writeContent
                            );

                            if (writeResult.err) {
                                response.code = 1002;
                                response.msg = writeResult.err;
                            } else {
                                response.code = 0;
                                response.msg = '获取token成功';
                                response.token = token;
                            }
                        }
                    }
                }
            }
        }

        ctx.body = response;
    }
}

module.exports = authorizeController;
