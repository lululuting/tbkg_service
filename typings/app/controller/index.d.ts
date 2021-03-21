// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdminArticle = require('../../../app/controller/admin/article');
import ExportAdminBanner = require('../../../app/controller/admin/banner');
import ExportAdminFeedback = require('../../../app/controller/admin/feedback');
import ExportAdminUser = require('../../../app/controller/admin/user');
import ExportDefaultArticle = require('../../../app/controller/default/article');
import ExportDefaultHome = require('../../../app/controller/default/home');
import ExportDefaultUser = require('../../../app/controller/default/user');
import ExportPublicBaseController = require('../../../app/controller/public/BaseController');
import ExportPublicQiniu = require('../../../app/controller/public/qiniu');

declare module 'egg' {
  interface IController {
    admin: {
      article: ExportAdminArticle;
      banner: ExportAdminBanner;
      feedback: ExportAdminFeedback;
      user: ExportAdminUser;
    }
    default: {
      article: ExportDefaultArticle;
      home: ExportDefaultHome;
      user: ExportDefaultUser;
    }
    public: {
      baseController: ExportPublicBaseController;
      qiniu: ExportPublicQiniu;
    }
  }
}
