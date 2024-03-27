'use strict';

const Service = require('egg').Service;
class RedisService extends Service {
  // 设置
  async set(key, value, seconds) {
    // seconds 有效时长
    const { redis } = this.app;
    value = JSON.stringify(value);

    // 设置有效时间 默认一小时
    await redis.set(key, value, 'EX', seconds || (60 * 60));
  }

  // 获取
  async get(key) {
    const { redis } = this.app;
    let data = await redis.get(key);
    if (!data) return;
    data = JSON.parse(data);
    return data;
  }

  // 删除
  async del(key) {
    const { redis } = this.app;
    return redis.del(key);
  }

  // 清空redis
  async flushall() {
    const { redis } = this.app;
    redis.flushall();
    return;
  }
}
module.exports = RedisService;
