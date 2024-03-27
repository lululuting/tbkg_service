/*
* 基本类BaseController，公共方法类，继承egg的 Controller, 然后其他Controller继承 BaseController
* @Date: 2020-01-13 21:30:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-05-04 04:49:44
 * @FilePath: /tingge_blog_zhongtai/app/controller/public/BaseController.js
*/
'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const dayjs = require('dayjs');
const utility = require('utility'); // utlity md5 方法
const config = require('../../../config/publicConfig');
const dict = require('../../public/dict');

class BaseController extends Controller {
  constructor(props) {
    super(props);
    // 基本配置和一些字典
    this.baseConfig = config;
    this.dict = dict;
  }

  // 本地上传文件方法， 2020/3/8 已采用七牛云 此方法弃用。不删留作参考，不调用就是了。
  async uploadFile(category = '') {
    const ctx = this.ctx;
    // egg-multipart 已经帮我们处理文件二进制对象
    const stream = await ctx.getFileStream();

    // 基础的目录
    const uplaodBasePath = 'app/public/uploads';

    // 生成文件名
    const filename = utility.md5(stream.filename) + Date.now() + path.extname(stream.filename).toLocaleLowerCase();

    // 生成文件夹
    const dirname = dayjs(Date.now()).format('YYYY/MM/DD');

    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }

    }

    mkdirsSync(path.join(uplaodBasePath, category, dirname));

    // 生成写入路径
    const target = path.join(uplaodBasePath, category, dirname, filename);

    // 生成一个文件写入 文件流
    const writeStream = fs.createWriteStream(target);

    try {
      // 异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 如果出现错误，关闭管道
      await sendToWormhole(stream);
      throw err;
    }

    const host = 'http://' + ctx.request.header.host;

    return {
      url: host + path.join('/public/uploads', category, dirname, filename).replace(/\\/g, '/'),
    };
  }

  /*
  * 信息通知方法
  * tmp {type: 类型，1评论/回复评论  2点赞文章 3点赞评论 4粉丝关注 5系统通知}
  * tmp {userId: 发起的用户id}
  * tmp {content: 内容}
  * tmp {callUserId: 通知的用户id}
  * tmp {source: 出处 文章id 或者 评论id ，数据库为int型默认为0，选填}
  */
  async setMsg(tmp) {
    if (tmp.userId === tmp.callUserId) return; // 自己就不用给自己发消息了
    await this.app.mysql.insert('msg', tmp);
  }

  /* return toke token记录当前登录用户的信息
  * sign({根据什么生成token})
  * app.config.jwt.secret 配置的密钥
  * {expiresIn:'24h'} 过期时间 要与redis一致
  */
  async returnToken(userInfo) {
    const token = this.app.jwt.sign({
      ...userInfo,
    }, `${config.tokenKey}`, {
      expiresIn: '24h',
    });
    return token;
  }

  // token获取当前登录用户的信息 没有返回null
  async getTokenInfo(token) {
    const tokenStr = token || this.ctx.cookies.get('token');
    if (tokenStr) {
      return await this.ctx.app.jwt.verify(tokenStr, this.config.jwt.secret);
    }
    return null;
  }

  // 判断是否超管
  async isSuper(returnErr = true, msg = '无权操作！') {
    const userInfo = await this.getTokenInfo();
    if (!userInfo || userInfo.auth * 1 !== config.auth.super) {
      if (returnErr) {
        this.ctx.body = {
          code: 500,
          msg,
        };
      }
      return false;
    }
    return userInfo;
  }

  /*
  * 粗略的接口缓存 redis 包装
  * queryFnc mysql的异步查询方法
  * key redis存的key
  * seconds 缓存时间 秒
  */
  async setRedisInfo({ queryFnc, key, seconds }) {
    let result = await this.service.redis.get(key);
    if (!key) {
      result = await queryFnc();
      this.service.redis.set(key, result, seconds);
    }
    return result;
  }

}

module.exports = BaseController;
