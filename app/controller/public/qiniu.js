'use strict';

const BaseController = require('./BaseController');
const qiniu = require('qiniu');

// 自行配置oss
const accessKey = 'xxxx';
const secretKey = 'xxx';
const bucket = 'tingge-blog';

class QiniuController extends BaseController {
  // （获取七牛上传token）
  async getQiniuToken() {
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket,
      expires: 3600 * 24,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    if (uploadToken) {
      this.ctx.body = {
        code: 200,
        data: {
          uploadToken,
        },
      };
    }
  }
}

module.exports = QiniuController;
