/*
 * @Author: your name
 * @Date: 2020-12-10 20:43:16
 * @LastEditTime: 2022-05-04 04:59:41
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/config/config.default.js
 */
/* eslint valid-jsdoc: "off" */

'use strict';

const publicConfig = require('./publicConfig.js');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578275460678_7382';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    myAppName: 'tgbk',
  };


  // egg-jwt token机制 设置密钥
  config.jwt = {
    secret: publicConfig.tokenKey, // 自己设置的值
  };

  // 解除文件上传大小限制
  config.bodyParser = {
    jsonLimit: '100mb',
    formLimit: '100mb',
  };

  // 配置上传
  config.multipart = {
    fileSize: '50mb',
    mode: 'stream',
    fileExtensions: [ '.jpg', '.png', '.gif', '.jpeg' ], // 扩展几种上传的文件格式
  };

  // 配置中间件， 数组的顺序为中间件执行的顺序
  config.middleware = [
    // 'isAuth',
    'msgFormat',
  ];

  // 跨域设置
  config.security = {
    csrf: {
      enable: false, // 前后端分离，post请求不方便携带_csrf ，关闭安全策略，才可以使用post请求
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };

  config.cors = {
    // origin: '*', // 只允许这个域进行访问接口 ，前面 【*】覆盖了 可以不写， 写了就覆盖domainWhiteList了
    credentials: true, // 允许Cookie可以跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  // # 注意，开启此模式后，应用就默认自己处于反向代理之后，
  // # 会支持通过解析约定的请求头来获取用户真实的 IP，协议和域名。
  // # 如果你的服务未部署在反向代理之后，请不要开启此配置，以防被恶意用户伪造请求 IP 等信息。
  config.proxy = true;

  return {
    ...config,
    ...userConfig,
  };
};
