/*
 * @Author: your name
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2021-02-01 10:57:18
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/app/router/default.js
 */
module.exports = app => {
  const { router, controller, jwt } = app

  // 中间件 （路由守卫校验token）
  let adminAuth = app.middleware.adminAuth()

  router.get('/default/getBannerList', controller.default.home.getBannerList)
  router.get('/default/getListBanner', controller.default.home.getListBanner)
  router.get('/default/getDetailBanner', controller.default.home.getDetailBanner)
  router.get('/default/getSearchBanner', controller.default.home.getSearchBanner)
  router.get('/default/getArticleList', controller.default.home.getArticleList)
  router.get('/default/getTypeList', controller.default.home.getTypeList)
  router.get('/default/getUserList', controller.default.home.getUserList)
  router.get('/default/getAdvertList', controller.default.home.getAdvertList)
  router.get('/default/readingVolume', controller.default.home.readingVolume)
  router.get('/default/getRewardCode', controller.default.home.getRewardCode)
  router.post('/default/feedback', controller.default.home.feedback)
  router.get('/default/getSearchList', controller.default.home.getSearchList)
  router.get('/default/getUserArticleList', controller.default.home.getUserArticleList)
  router.get('/default/getUserArticleTotal', controller.default.home.getUserArticleTotal)

  router.post('/default/login', controller.default.user.login)
  router.get('/default/getWeiboUserInfo', controller.default.user.getWeiboUserInfo)
  router.get('/default/getMsg', jwt, controller.default.user.getMsg)
  router.get('/default/getMsgList', jwt, controller.default.user.getMsgList)
  router.get('/default/setFollow', jwt, controller.default.user.setFollow)
  router.get('/default/getUserInfo', controller.default.user.getUserInfo)
  router.post('/default/updateUserInfo', jwt, controller.default.user.updateUserInfo)
  router.post('/default/updatePassword', jwt, controller.default.user.updatePassword)
  router.post('/default/updateMobile', jwt, controller.default.user.updateMobile)
  router.post('/default/updateSongs', jwt, controller.default.user.updateSongs)

  router.get('/default/passwordTest', controller.default.user.passwordTest)
  router.post('/default/addEditContact',jwt, controller.default.user.addEditContact)
  router.post('/default/delContact', jwt, controller.default.user.delContact)
  router.post('/default/addEditReward', jwt, controller.default.user.addEditReward)
  
  router.get('/default/getFollowList', controller.default.user.getFollowList)
  router.get('/default/getFansList', controller.default.user.getFansList)

  
  router.get('/default/getArticleInfo', controller.default.article.getArticleInfo)
  router.get('/default/getArticleComment', controller.default.article.getArticleComment)
  router.post('/default/setArticleComment', jwt, controller.default.article.setArticleComment)
  router.post('/default/commentClickLike', jwt, controller.default.article.commentClickLike)
  router.get('/default/articleClickLike', jwt, controller.default.article.articleClickLike) 
  router.get('/default/getLikeStatus', jwt, controller.default.article.getLikeStatus)
  router.get('/default/getVerify', controller.default.article.getVerify)
  
  // 七牛云token
  router.get('/default/getQiniuToken',jwt, controller.public.qiniu.getQiniuToken)
  // 和风天气
  router.get('/default/getWeather', controller.default.home.getWeather)
  // 网易云歌单
  router.get('/default/getMusicList', controller.default.home.getMusicList)
  // 每日一句
  router.get('/default/getYitu', controller.default.home.getYitu)
  
}