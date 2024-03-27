/*
 * @Author: TingGe
 * @Date: 2021-02-04 09:59:42
 * @LastEditTime: 2022-05-04 04:03:12
 * @LastEditors: TingGe
 * @Description: 生产环境配置
 * @FilePath: /tingge_blog_zhongtai/config/config.prod.js
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
      port: '3388',
      user: 'root',
      password: 'xxxxx', // 生产mysql密码
      database: 'tingge_blog',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.sequelize = {
    dialect: 'mysql', // 表示使用mysql
    host: '127.0.0.1', // 连接的数据库主机地址
    port: 3388, // mysql服务端口
    database: 'tingge_blog', // 数据库名
    username: 'root', // 数据库用户名
    password: 'xxxxx', // 数据库密码
    define: { // model的全局配置
      timestamps: false, // 不添加create,update,delete时间戳
      paranoid: true, // 添加软删除
      freezeTableName: true, // 防止修改表名为复数
      underscored: false, // 防止驼峰式字段被默认转为下划线
    },
    timezone: '+08:00', // 由于orm用的UTC时间，这里必须加上东八区，否则取出来的时间相差8小时
    dialectOptions: { // 让读取date类型数据时返回字符串而不是UTC时间
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
  };

  return {
    ...config,
  };
};
