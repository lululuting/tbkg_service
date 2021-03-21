/*
 * @Date: 2020-01-13 21:30:54
 * @LastEditors: TingGe
 * @LastEditTime: 2021-03-21 16:16:21
 * @FilePath: /tingge_blog_zhongtai/app/controller/public/BaseController.js
 */
'use strict';

//node.js 文件操作对象
const fs = require('fs');
//node.js 路径操作对象
const path = require('path');
//egg.js Controller
const Controller = require('egg').Controller;
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

const dayjs = require('dayjs');

// utlity md5 方法
const utility = require('utility');

const config = require('../../../config/publicConfig.js');


// 基本类BaseController，公共方法类，继承egg的 Controller, 然后其他Controller继承 BaseController


class BaseController extends Controller {
  // 2020/3/8 已采用七牛云  此本地上传文件方法 uploadFile弃用，但不删留作参考，不调用就是了
  async uploadFile(category = '') {
    const ctx = this.ctx;
    //egg-multipart 已经帮我们处理文件二进制对象
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
      } else {
        if (mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname);
          return true;
        }
      }
    }

    mkdirsSync(path.join(uplaodBasePath, category, dirname));

    // 生成写入路径
    const target = path.join(uplaodBasePath, category, dirname, filename);

    //生成一个文件写入 文件流
    const writeStream = fs.createWriteStream(target);

    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      //如果出现错误，关闭管道
      await sendToWormhole(stream);
      throw err;
    }

    const host = 'http://' + ctx.request.header.host

    return {
      url: host + path.join('/public/uploads', category, dirname, filename).replace(/\\/g, "/")
    }
  }


  // 信息通知方法
  /* tmp {type: 类型，1评论/回复评论  2点赞文章 3点赞评论 4粉丝关注 5系统通知}
   *  tmp {userId: 发起的用户id}
   *  tmp {content: 内容}
   *  tmp {callUserId: 通知的用户id}
   *  tmp {source: 出处 文章id 或者 评论id ，数据库为int型默认为0，选填}
   */
  async setMsg(tmp) {
    if (tmp.userId == tmp.callUserId) return // 自己就不用给自己发消息了
    await this.app.mysql.insert('msg', tmp)
  }


  //return toke token记录当前登录用户的信息
  /*
   * sign({根据什么生成token})
   * app.config.jwt.secret 配置的密钥
   * {expiresIn:'24h'} 过期时间
   */
  async returnToken(userInfo) {
    let token = this.app.jwt.sign({
      userId: userInfo.id,
      userName: userInfo.userName,
      mobile: userInfo.mobile,
      auth: userInfo.auth
    }, `${config.tokenKey}`, {
      expiresIn: '24h'
    })
    return token
  }

  // token获取当前登录用户的信息
  async getTokenInfo() {
    return await this.ctx.app.jwt.verify(this.ctx.request.header.authorization.split(' ')[1], this.config.jwt.secret)
  }
}

module.exports = BaseController;