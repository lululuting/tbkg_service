/*
 * @Author: TingGe
 * @Date: 2021-02-01 10:50:22
 * @LastEditTime: 2021-02-03 13:04:09
 * @LastEditors: TingGe
 * @Description: 验证码
 * @FilePath: /tingge_blog_zhongtai/app/service/verify.js
 */

'use strict';
const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');

// 验证码配置信息
const options = {
    size: 4, // 验证码长度(显示几个字符)
    fontSize: 40, // 验证码的字体大小
    width: 100, // 验证码的宽度
    height: 32, // 验证码的高度
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    // background: '#fff', // 验证码的背景颜色, 默认没有
};

class VerifyService extends Service {
    async getVerify() {
        // 第三方插件，实现验证码功能
        const verify = svgCaptcha.create(options);
        // 将验证码text文本保存到全局session中， 观察者/发布者订阅模式
        this.ctx.session.code = verify.text;
        return verify;
    }
}

module.exports = VerifyService;