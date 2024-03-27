// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle = require('../../../app/model/article');
import ExportArticleLike = require('../../../app/model/article_like');
import ExportBanner = require('../../../app/model/banner');
import ExportClickLike = require('../../../app/model/click_like');
import ExportComment = require('../../../app/model/comment');
import ExportCommentLike = require('../../../app/model/comment_like');
import ExportConfig = require('../../../app/model/config');
import ExportFans = require('../../../app/model/fans');
import ExportFeedback = require('../../../app/model/feedback');
import ExportMsg = require('../../../app/model/msg');
import ExportNotice = require('../../../app/model/notice');
import ExportType = require('../../../app/model/type');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Article: ReturnType<typeof ExportArticle>;
    ArticleLike: ReturnType<typeof ExportArticleLike>;
    Banner: ReturnType<typeof ExportBanner>;
    ClickLike: ReturnType<typeof ExportClickLike>;
    Comment: ReturnType<typeof ExportComment>;
    CommentLike: ReturnType<typeof ExportCommentLike>;
    Config: ReturnType<typeof ExportConfig>;
    Fans: ReturnType<typeof ExportFans>;
    Feedback: ReturnType<typeof ExportFeedback>;
    Msg: ReturnType<typeof ExportMsg>;
    Notice: ReturnType<typeof ExportNotice>;
    Type: ReturnType<typeof ExportType>;
    User: ReturnType<typeof ExportUser>;
  }
}
