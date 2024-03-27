// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportIsAuth = require('../../../app/middleware/isAuth');
import ExportMsgFormat = require('../../../app/middleware/msgFormat');

declare module 'egg' {
  interface IMiddleware {
    isAuth: typeof ExportIsAuth;
    msgFormat: typeof ExportMsgFormat;
  }
}
