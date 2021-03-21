/*
 * @Author: TingGe
 * @Date: 2021-02-04 09:59:42
 * @LastEditTime: 2021-03-21 17:32:23
 * @LastEditors: TingGe
 * @Description: 生产环境配置
 * @FilePath: /github项目/tbkg-service/config/config.prod.js
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
            host: 'localhost',
            port: '',
            user: '',
            password: '', // 生产mysql密码
            database: '',
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