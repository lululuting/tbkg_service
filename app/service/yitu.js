/*
 * @Author: your name
 * @Date: 2021-01-11 14:51:36
 * @LastEditTime: 2021-01-11 15:59:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/app/service/yitu.js
 */

const Service = require('egg').Service;
const dayjs = require('dayjs');
class YituService extends Service {
  async getYitu() {
    let dayjsTime = dayjs(`${new Date()}`).format('YYYY-MM-DD')
    const res = await this.ctx.curl(`http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=${dayjsTime}`,{
        dataType: 'json',
        method: 'GET',
        data: {}
    })
    return res.data
  }
}

module.exports = YituService;