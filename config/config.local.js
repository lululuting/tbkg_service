/*
 * @Author: TingGe
 * @Date: 2021-02-04 09:59:42
 * @LastEditTime: 2021-03-21 16:20:35
 * @LastEditors: TingGe
 * @Description: 本地开发环境配置
 * @FilePath: /tingge_blog_zhongtai/config/config.local.js
 */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {{}}
     **/
    const config = exports = {};

    // 数据库连接配置
    config.mysql = {
        // database configuration
        client: {
            host: 'localhost', // 地址
            port: '3306', // 端口
            user: 'root', // 用户
            password: 'root', // 本地mysql密码
            database: 'tingge_blog', // 数据库名
        },
        // load into app, default is open
        app: true,
        // load into agent, default is close
        agent: false,
    };

    return {
        ...config,
    };
};