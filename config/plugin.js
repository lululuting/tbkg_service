/*
 * @Author: your name
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2021-01-03 23:38:24
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/config/plugin.js
 */
'use strict';

//配置mysql
exports.mysql = {
  enable: true,
  package: 'egg-mysql'
}

exports.cors = {
  enable: true,
  package: 'egg-cors'
}

// egg-jwt token机制
exports.jwt = {
  enable: true,
  package: "egg-jwt"
};