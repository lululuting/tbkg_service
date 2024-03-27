
/*
 * @Author: TingGe
 * @LastEditors: TingGe
 * @Description: 百度地图
 * @FilePath: /tingge_blog_zhongtai/app/service/map.js
 */
'use strict';
const config = require('../../config/publicConfig');
const Service = require('egg').Service;

class QiniuService extends Service {
  async getPosition(ip) {
    const res = await this.ctx.curl(`//api.map.baidu.com/location/ip?ak=${config.map.ak}&ip=${ip}&coor=${config.map.coor}`);
    const result = JSON.parse(res.data.toString());
    return result;
  }
}

module.exports = QiniuService;
