'use strict';

// 配置mysql
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

// egg-jwt token机制
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

// redis
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

// egg-sequelize
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
