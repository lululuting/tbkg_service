/*
 * @Date: 2020-04-29 22:05:38
 * @LastEditors: TingGe
 * @LastEditTime: 2024-03-27 13:44:58
 * @FilePath: /ting_ge_blog/Users/shejishidediannao/Desktop/myProject/github/tbkg_service/app/service/weibo.js
 */
'use strict';
const Service = require('egg').Service;

// 自行配置
const client_id = 0;
const client_secret = 'xxxxx';
const redirect_uri = 'https://xxxx.com';


class WeiboService extends Service {
  async getWeiboUserInfo(code) {
    const res = await this.ctx.curl('https://api.weibo.com/oauth2/access_token', {
      dataType: 'json',
      method: 'POST',
      data: {
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
        code,
      },
    });

    return res.data;
  }
}

module.exports = WeiboService;
