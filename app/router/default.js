/*
 * @Author: your name
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2022-05-04 02:58:52
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/app/router/default.js
 */
'use strict';
module.exports = app => {
  const { router, controller } = app;

  app.middleware.msgFormat();

  // 中间件 （路由守卫校验token）
  const isAuth = app.middleware.isAuth({}, app);

  router.get('/default/getHomeBannerList', controller.default.home.getHomeBannerList);
  router.get('/default/getListBanner', controller.default.home.getListBanner);
  router.get('/default/getDetailBanner', controller.default.home.getDetailBanner);
  router.get('/default/getSearchBanner', controller.default.home.getSearchBanner);
  // router.get('/default/getUserList', controller.default.home.getUserList);
  router.get('/default/getAdvertList', controller.default.home.getAdvertList);
  router.get('/default/readingVolume', controller.default.home.readingVolume);
  router.get('/default/getRewardCode', controller.default.home.getRewardCode);
  router.post('/default/feedback', controller.default.home.feedback);
  router.get('/default/getSearchList', controller.default.home.getSearchList);
  router.get('/default/getUserArticleList', controller.default.home.getUserArticleList);
  router.get('/default/getHotUserList', controller.default.user.getHotUserList);

  router.post('/default/login', controller.default.user.login);
  router.get('/default/logOut', isAuth, controller.default.user.logOut);
  router.get('/default/getIsLogin', controller.default.user.getIsLogin);
  router.get('/default/getWeiboUserInfo', controller.default.user.getWeiboUserInfo);
  router.get('/default/getMsg', isAuth, controller.default.user.getMsg);
  router.get('/default/getMsgList', isAuth, controller.default.user.getMsgList);
  router.get('/default/setFollow', isAuth, controller.default.user.setFollow);
  router.get('/default/getUserInfo', controller.default.user.getUserInfo);
  router.post('/default/updateUserInfo', isAuth, controller.default.user.updateUserInfo);
  router.post('/default/updatePassword', isAuth, controller.default.user.updatePassword);
  router.post('/default/updateMobile', isAuth, controller.default.user.updateMobile);
  router.post('/default/updateSongs', isAuth, controller.default.user.updateSongs);

  router.get('/default/passwordTest', controller.default.user.passwordTest);

  router.get('/default/getFollowList', controller.default.user.getFollowList);
  router.get('/default/getFansList', controller.default.user.getFansList);
  router.get('/default/getUserList', controller.default.user.getUserList);

  router.post('/default/addEditUser', isAuth, controller.default.user.addEditUser);
  router.post('/default/delUser', isAuth, controller.default.user.delUser);
  router.post('/default/frozenUser', isAuth, controller.default.user.frozenUser);
  router.post('/default/thawUser', isAuth, controller.default.user.thawUser);
  router.post('/default/resetPassword', isAuth, controller.default.user.resetPassword);

  router.get('/default/getArticleList', controller.default.article.getArticleList);
  router.get('/default/getArticleInfo', controller.default.article.getArticleInfo);
  router.get('/default/getArticleDetail', controller.default.article.getArticleDetail);
  router.get('/default/getArticleComment', controller.default.article.getArticleComment);
  router.post('/default/setArticleComment', controller.default.article.setArticleComment);
  router.post('/default/commentClickLike', isAuth, controller.default.article.commentClickLike);
  router.get('/default/articleClickLike', isAuth, controller.default.article.articleClickLike);
  router.get('/default/getLikeStatus', isAuth, controller.default.article.getLikeStatus);
  router.get('/default/getVerify', controller.default.article.getVerify);

  router.get('/default/getUserArticleTotal', controller.default.article.getUserArticleTotal);
  router.post('/default/addEditArticle', isAuth, controller.default.article.addEditArticle);
  router.post('/default/delArticle', isAuth, controller.default.article.delArticle);
  router.post('/default/frozenArticle', isAuth, controller.default.article.frozenArticle);
  router.post('/default/thawArticle', isAuth, controller.default.article.thawArticle);

  // 评论
  router.get('/default/getCommentList', controller.default.article.getCommentList);
  router.post('/default/delComment', isAuth, controller.default.article.delComment);
  router.post('/default/frozenComment', isAuth, controller.default.article.frozenComment);
  router.post('/default/thawComment', isAuth, controller.default.article.thawComment);

  // banner
  router.get('/default/getBannerList', controller.default.banner.getBannerList);
  router.post('/default/delBanner', isAuth, controller.default.banner.delBanner);
  router.post('/default/addEditBanner', isAuth, controller.default.banner.addEditBanner);

  // 公告
  router.get('/default/notice', controller.default.home.notice);
  router.get('/default/getNoticeList', controller.default.home.getNoticeList);
  router.post('/default/addEditNotice', isAuth, controller.default.home.addEditNotice);
  router.post('/default/delNotice', isAuth, controller.default.home.delNotice);

  // 功能
  router.get('/default/getFunctionList', isAuth, controller.default.home.getFunctionList);
  router.post('/default/setFunction', isAuth, controller.default.home.setFunction);


  // 七牛云token
  router.get('/default/getQiniuToken', isAuth, controller.public.qiniu.getQiniuToken);
  // 和风天气
  router.get('/default/getWeather', controller.default.home.getWeather);
  // 网易云歌单
  router.get('/default/getMusicList', controller.default.home.getMusicList);
  // 每日一句
  router.get('/default/getYitu', controller.default.home.getYitu);

};
