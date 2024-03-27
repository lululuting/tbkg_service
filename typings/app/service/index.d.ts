// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportMap = require('../../../app/service/map');
import ExportQiniu = require('../../../app/service/qiniu');
import ExportRedis = require('../../../app/service/redis');
import ExportVerify = require('../../../app/service/verify');
import ExportWangyiyun = require('../../../app/service/wangyiyun');
import ExportWeather = require('../../../app/service/weather');
import ExportWeibo = require('../../../app/service/weibo');
import ExportYitu = require('../../../app/service/yitu');

declare module 'egg' {
  interface IService {
    map: AutoInstanceType<typeof ExportMap>;
    qiniu: AutoInstanceType<typeof ExportQiniu>;
    redis: AutoInstanceType<typeof ExportRedis>;
    verify: AutoInstanceType<typeof ExportVerify>;
    wangyiyun: AutoInstanceType<typeof ExportWangyiyun>;
    weather: AutoInstanceType<typeof ExportWeather>;
    weibo: AutoInstanceType<typeof ExportWeibo>;
    yitu: AutoInstanceType<typeof ExportYitu>;
  }
}
