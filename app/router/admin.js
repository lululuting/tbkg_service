module.exports = app => {
  const { router, controller, jwt } = app

  // 中间件 （路由守卫校验token）
  let adminAuth = app.middleware.adminAuth()

  // 用户模块 登录不校验token 其他都要
  router.post('/admin/login', controller.admin.user.login)

  router.get('/admin/getUserInfo',jwt, controller.admin.user.getUserInfo)
  router.post('/admin/updateUserInfo',jwt, controller.admin.user.updateUserInfo)
  router.get('/admin/getUserArticleList',jwt, controller.admin.user.getUserArticleList)
  router.get('/admin/getUserArticleTotal',jwt, controller.admin.user.getUserArticleTotal)
  router.post('/admin/updatePassword',jwt, controller.admin.user.updatePassword)
  router.post('/admin/uploadAvatar',jwt, controller.admin.user.uploadAvatar)

  router.post('/admin/uploadCode',jwt, controller.admin.user.uploadCode)
  router.post('/admin/addEditContact',jwt, controller.admin.user.addEditContact)
  router.post('/admin/delContact',jwt, controller.admin.user.delContact)
  router.post('/admin/uploadRewardCode',jwt, controller.admin.user.uploadRewardCode)
  router.post('/admin/addEditReward',jwt, controller.admin.user.addEditReward)
  

  // 七牛云token
  router.get('/admin/getQiniuToken',jwt, controller.public.qiniu.getQiniuToken)

  // 文章模块
  router.get('/admin/getArticleTotal',jwt, controller.admin.article.getArticleTotal)
  router.get('/admin/getArticleList',jwt, controller.admin.article.getArticleList)
  router.get('/admin/getArticleInfo',jwt, controller.admin.article.getArticleInfo)
  router.post('/admin/delArticle',jwt, controller.admin.article.delArticle)
  router.post('/admin/addEditArticle',jwt, controller.admin.article.addEditArticle)
  router.post('/admin/uploadArticleImg',jwt, controller.admin.article.uploadArticleImg)
  

  // banner模块
  router.get('/admin/getBannerList',jwt, controller.admin.banner.getBannerList)
  router.get('/admin/getPreviewBanner',jwt, controller.admin.banner.getPreviewBanner)
  router.post('/admin/delBanner',jwt, controller.admin.banner.delBanner)
  router.post('/admin/addEditBanner',jwt, controller.admin.banner.addEditBanner)
  router.post('/admin/uploadBanner',jwt, controller.admin.banner.uploadBanner)


  // 问题反馈模块
  router.get('/admin/getFeedbackList',jwt, controller.admin.feedback.getFeedbackList)
}