'use strict';

// 状态消息处理中间件
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {

      app.emit('error', err, this);
      const status = err.status || 500;
      const error = status === 500
        ? '服务器错误，请联系挺哥！'
        : err.message;

      ctx.body = ({ code: status, msg: error });
      if (status === 401) {
        ctx.body = ({ ctx, code: status, msg: '登录失效了哦，请重新登陆！' });
      }
    }
  };
};

