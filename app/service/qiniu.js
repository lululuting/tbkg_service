/*
 * @Author: TingGe
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2021-02-01 10:51:34
 * @LastEditors: TingGe
 * @Description: 七牛云请求
 * @FilePath: /tingge_blog_zhongtai/app/service/qiniu.js
 */

const Service = require('egg').Service;

class QiniuService extends Service {
  async getToken() {
    const { config } = this;
    // config.url是接口的公共地址，推荐在app/config/config.default.js配置
    const re = await this.ctx.curl(`${config.url}/token`)

    const res = JSON.parse(re.data) // 这里根据实际返回的数据进行格式化处理，最后返回一个对象

    return res.result;
  }
}

module.exports = QiniuService;