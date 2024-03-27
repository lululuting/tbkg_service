'use strict';
module.exports = (options, app) => {
  return async function isAuth(ctx, next) {
    const token = ctx.cookies.get('token');
    // 获取头部token信息， 如果不存在，表示没有登录，跳转到首页
    if (token) {
      try {
        const result = await ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
        const loginToken = await app.redis.get(`loginUserId_${result.userId}`);
        // 防止伪造，对比一下redis信息 存在了才让通过 redis 也是24小时过期
        if (!loginToken || JSON.stringify(token) !== loginToken) {
          // 清除cookies
          ctx.cookies.set('token', null);
          ctx.status = 401;
          ctx.body = ({ ctx, code: ctx.status, msg: '登录失效了哦，请重新登陆！' });
          return;
        }
      } catch (error) {
        // 清除cookies
        ctx.cookies.set('token', null);
        ctx.status = 401;
        ctx.body = ({ ctx, code: ctx.status, msg: '令牌错误，请重新登陆！' });
        return;
      }

      await next();
    } else {
      ctx.status = 401;
      ctx.body = ({ ctx, code: ctx.status, msg: '请登陆！' });
      return;
    }
  };
};
