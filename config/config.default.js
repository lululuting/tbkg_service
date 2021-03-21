/*
 * @Author: your name
 * @Date: 2020-12-10 20:43:16
 * @LastEditTime: 2021-03-21 17:31:01
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /github项目/tbkg-service/config/config.default.js
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
  config.keys = appInfo.name + 'xxxxxxxxxx';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    myAppName: 'xxxx',
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
    fileExtensions: ['.jpg', '.png', '.gif', '.jpeg'], // 扩展几种上传的文件格式
  };

  // 配置中间件，注意login需要和app/middleware下的login.js对应
  config.middleware = [
    'adminAuth',
  ];

  // 跨域设置
  config.security = {
    csrf: {
      enable: false, // 前后端分离，post请求不方便携带_csrf
      ignoreJSON: true,
    },
    domainWhiteList: ['*'],
  };

  config.cors = {
    // origin: '*', // 只允许这个域进行访问接口 ，前面 【*】覆盖了 可以不写， 写了就覆盖domainWhiteList了
    credentials: true, // 允许Cookie可以跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  return {
    ...config,
    ...userConfig,
  };
};