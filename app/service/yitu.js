/*
 * @Author: your name
 * @Date: 2021-01-11 14:51:36
 * @LastEditTime: 2021-09-01 10:11:54
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/app/service/yitu.js
 */
'use strict';
const Service = require('egg').Service;
const dayjs = require('dayjs');
class YituService extends Service {
  async getYitu() {
    const dayjsTime = dayjs(`${new Date()}`).format('YYYY-MM-DD');
    const res = await this.ctx.curl(`http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=${dayjsTime}`, {
      dataType: 'json',
      method: 'GET',
      data: {},
    });
    return res.data;
  }
}

module.exports = YituService;
