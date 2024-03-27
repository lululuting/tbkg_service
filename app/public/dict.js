'use strict';

const yes_no_dict = {
  // 是否的字典
  yes: 1,
  ___yes: '是',
  no: 0,
  ___no: '否',
};

// 用大写会合适一点， 但小写可读性高
module.exports = {
  // 是否字典，没特殊情况下 （true false 0 1） 在些状态都用这个判断
  commonStatus: {
    ...yes_no_dict,
  },
  searchType: {
    article: 'article',
    user: 'user',
    ___article: '文章',
    ___user: '用户',
  },
  articleType: {
    all: 0,
    skill: 1,
    photography: 2,
    life: 3,
    ___all: '全部',
    ___skill: '技术',
    ___photography: '摄影',
    ___life: '生活',
  },
  articleSort: {
    ...yes_no_dict,
    ___no: '按时间',
    ___yes: '按热门',
  },
  articleStatus: {
    ...yes_no_dict,
    ___no: '隐藏',
    ___yes: '公开',
    frozen: 2,
    ___frozen: '冻结',
  },
  articleState: {
    ...yes_no_dict,
    ___no: '冻结',
    ___yes: '正常',
  },
  // 1博主 2 超管 3用户
  auth: {
    user: 3,
    blogger: 1,
    super: 2,
    ___user: '用户',
    ___blogger: '博主',
    ___super: '超管',
  },
  bannerType: {
    rotation: 3,
    recommend: 2,
    advertisement: 1,
    home: 4,
    list: 5,
    detail: 6,
    search: 7,
    msg: 8,
    release: 9,
    homeIframe: 10,
    ___rotation: '轮播',
    ___recommend: '推荐',
    ___advertisement: '广告',
    ___home: '首页',
    ___list: '列表页',
    ___detail: '详情页',
    ___search: '搜索页',
    ___msg: '消息页',
    ___release: '发布页',
    ___homeIframe: '首页iframe',
  },
  commentStatus: {
    ...yes_no_dict,
    ___no: '控评',
    ___yes: '正常',
  },
  msgType: {
    commentArticle: 1,
    commentReply: 2,
    likeArticle: 3,
    likeComment: 4,
    follow: 5,
    system: 6,
    ___commentArticle: '评论了你的文章',
    ___commentReply: '回复了你的评论',
    ___likeArticle: '点赞了你的文章',
    ___likeComment: '点赞了你的评论',
    ___follow: '关注了你',
    ___system: '系统消息',
  },
};
