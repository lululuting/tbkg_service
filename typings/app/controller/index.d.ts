// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDefaultArticle = require('../../../app/controller/default/article');
import ExportDefaultBanner = require('../../../app/controller/default/banner');
import ExportDefaultHome = require('../../../app/controller/default/home');
import ExportDefaultUser = require('../../../app/controller/default/user');
import ExportPublicBaseController = require('../../../app/controller/public/BaseController');
import ExportPublicQiniu = require('../../../app/controller/public/qiniu');

declare module 'egg' {
  interface IController {
    default: {
      article: ExportDefaultArticle;
      banner: ExportDefaultBanner;
      home: ExportDefaultHome;
      user: ExportDefaultUser;
    }
    public: {
      baseController: ExportPublicBaseController;
      qiniu: ExportPublicQiniu;
    }
  }
}
