/*
 * @Author: TingGe
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2021-03-21 17:37:56
 * @LastEditors: TingGe
 * @Description: 七牛云相关配置
 */
'use strict';

const BaseController = require('./BaseController');

const qiniu = require("qiniu");

const accessKey = "";
const secretKey = "";
const bucket = "";

class QiniuController extends BaseController {
    //（获取七牛上传token）
    async getQiniuToken() {
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let options = {
            scope: bucket,
            expires: 3600 * 24
        };
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);

        if (uploadToken) {
            this.ctx.body = {
                code: 200,
                data: {
                    uploadToken
                }
            }
        }
    }

};

module.exports = QiniuController;