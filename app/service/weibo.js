/*
 * @Date: 2020-04-29 22:05:38
 * @LastEditors: TingGe
 * @LastEditTime: 2021-03-21 17:35:10
 * @FilePath: /github项目/tbkg-service/app/service/weibo.js
 */
const Service = require('egg').Service;

const client_id = 3392355539;
const client_secret = ''; // 微博lient_secret
const redirect_uri = ``; // 微博redirect_uri


class WeiboService extends Service {
    async getWeiboUserInfo(code) {
        const res = await this.ctx.curl(`https://api.weibo.com/oauth2/access_token`, {
            dataType: 'json',
            method: 'POST',
            data: {
                client_id,
                client_secret,
                redirect_uri,
                grant_type: 'authorization_code',
                code,
            }
        })

        return res.data
    }
}

module.exports = WeiboService;