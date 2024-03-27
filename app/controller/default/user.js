'use strict';

const qs = require('qs');
const BaseController = require('../public/BaseController');
const bcryptjs = require('bcryptjs');

class UserController extends BaseController {

  async login() {
    const mobile = this.ctx.request.body.mobile;
    const password = this.ctx.request.body.password;

    const res = await this.app.mysql.get('user', {
      mobile,
    });

    if (res && bcryptjs.compareSync(password, res.password)) {

      // 数据整改和 删除 password 不暴漏出去
      res.userId = res.id;
      delete res.password;

      // 查文章  粉丝 赞
      const tSql = `
        SELECT
          (SELECT count(*) FROM fans as f WHERE f.userId = u.id AND f.status = 1) as fNum,
          (SELECT count(*) FROM article as a WHERE a.userId = u.id AND a.status = 1) as aNum,
          (SELECT
        count(ac.id) AS count
      FROM
        article_like AS ac
      LEFT JOIN article a ON a.id = ac.articleId
      LEFT JOIN user u ON u.id = a.userId
      WHERE u.id = ${res.userId} AND ac.status = 1 ) as cNum
        FROM
          user u
        WHERE u.id = ${res.userId}
      `;

      const tRes = await this.app.mysql.query(tSql);
      // 登录成功,进行toke
      const token = await this.returnToken(res);

      // 存入redis 作为登陆状态 时间为24小时
      await this.service.redis.set('loginUserId_' + res.id, token, 60 * 60 * 24);

      this.ctx.cookies.set('token', token, {
        // 设置cookie的有效期
        maxAge: 1000 * 3600 * 24,
        // // 只允许服务端访问cookie
        httpOnly: false,
        // 对cookie进行签名，防止用户修改cookie
        signed: true,
        // 是否对cookie进行加密
        // cookie加密后获取的时候要对cookie进行解密
        // cookie加密后就可以设置中文cookie
        // encrypt: true,
      });

      this.ctx.body = {
        code: 200,
        msg: '登录成功',
        data: {
          ...res,
          ...tRes[0],
        },
      };
    } else {
      this.ctx.body = {
        code: 500,
        msg: '账号或密码错误',
      };
    }
  }

  async logOut() {
    const userInfo = await this.getTokenInfo();
    // 移除存入redis记录
    const result = await this.service.redis.del('loginUserId_' + userInfo.userId);
    // 清除cookies
    this.ctx.cookies.set('token', null);

    if (result === 1) {
      this.ctx.body = {
        code: 200,
        msg: '退出成功',
      };
    }
  }

  async getIsLogin() {
    const userInfo = await this.getTokenInfo();
    if (!userInfo) {
      this.ctx.body = {
        code: 500,
        msg: '请登陆',
      };
      return;
    }
    this.ctx.body = {
      code: 200,
      data: userInfo,
    };
  }


  // 获取用户详细信息
  async getUserInfo() {
    const id = this.ctx.query.id * 1;
    const userInfo = await this.getTokenInfo();
    let fansStatus = null;

    // 如果登陆了，就查询是否是粉丝
    if (userInfo && userInfo.userId !== id) {
      const fansRes = await this.ctx.model.Fans.findOne({
        where: {
          userId: id,
          fansId: userInfo.userId,
        },
      });
      if (fansRes) {
        fansStatus = fansRes.status;
      } else {
        fansStatus = 0;
      }
    }

    const userRes = await this.ctx.model.User.findByPk(id, {
      attributes: {
        exclude: [ 'password' ],
      },
    });

    if (userRes) {
      const dataValues = userRes.dataValues;
      this.ctx.body = {
        code: 200,
        data: {
          ...dataValues,
          fansStatus,
        },
      };
    } else {
      this.ctx.body = {
        code: 500,
        msg: '没有该用户',
      };
    }
  }

  // 设置用户信息
  async updateUserInfo() {
    const tmp = this.ctx.request.body;
    if (tmp.mobile || tmp.password) {
      this.ctx.body = {
        code: 500,
        msg: '嘿，想干嘛呢？',
      };
      return;
    }

    const userInfo = await this.getTokenInfo();
    tmp.id = userInfo.userId;
    const result = await this.app.mysql.update('user', tmp);

    if (result.affectedRows === 1) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }

  // 密码test 自用接口
  async passwordTest() {
    const str = this.ctx.query.text;
    const res = bcryptjs.hashSync(str, 10);

    if (res) {
      this.ctx.body = {
        code: 200,
        data: res,
        msg: '嘻嘻嘻，秘密接口',
      };
    }
  }

  // 用户修改密码
  async updatePassword() {
    const oldPassword = this.ctx.request.body.oldPassword;
    const password = this.ctx.request.body.newPassword;
    const userInfo = await this.getTokenInfo();
    const res = await this.app.mysql.get('user', {
      id: userInfo.userId,
    });
    if (res && bcryptjs.compareSync(oldPassword, res.password)) {
      const result = await this.app.mysql.update('user', {
        id: userInfo.userId,
        password: bcryptjs.hashSync(password, 10),
      });
      if (result.affectedRows === 1) {
        this.ctx.body = {
          code: 200,
          msg: '修改成功!',
        };
      }
    } else {
      this.ctx.body = {
        code: 500,
        msg: '旧密码不正确!',
      };
    }
  }

  // 绑定手机号
  async updateMobile() {
    const mobile = this.ctx.request.body.mobile;
    const userInfo = await this.getTokenInfo();

    const isHas = await this.app.mysql.get('user', {
      mobile,
    });

    if (isHas) {
      this.ctx.body = {
        code: 500,
        msg: '该手机号已有绑定，请换一个试试!',
      };
      return;
    }

    const result = await this.app.mysql.update('user', {
      id: userInfo.userId,
      mobile,
    });

    if (result.affectedRows === 1) {
      this.ctx.body = {
        code: 200,
        msg: '绑定成功, 请重新登录!',
      };
    }
  }

  // 更改 网易云歌单id
  async updateSongs() {
    const songsId = this.ctx.request.body.songsId;
    const userInfo = await this.getTokenInfo();

    const result = await this.app.mysql.update('user', {
      id: userInfo.userId,
      songsId,
    });

    if (result.affectedRows === 1) {
      this.ctx.body = {
        code: 200,
        msg: '更改成功, 刷新页面即可生效!',
      };
    }

  }

  // 第三方微博登录
  async getWeiboUserInfo() {
    const code = this.ctx.query.code;
    let resData = null;
    const res1 = await this.service.weibo.getWeiboUserInfo(code);

    if (res1 && res1.uid) {
      resData = await this.app.mysql.get('user', {
        wbUid: res1.uid,
      });

      // 如果没有uid，则查询微博用户信息，绑上，然后生成token登录 再返回该用户信息
      if (!resData) {
        const res3 = await this.ctx.curl('https://api.weibo.com/2/users/show.json', {
          method: 'get',
          data: {
            access_token: res1.access_token,
            uid: res1.uid,
          },
        });

        const info = JSON.parse(res3.data); // 这里根据实际返回的数据进行格式化处理，最后返回一个对象
        const tmp = {
          wbUid: info.id,
          userName: info.name,
          avatar: info.profile_image_url,
          autograph: info.description,
        };
        const createUserRes = await this.app.mysql.insert('user', tmp);

        resData = {
          userId: createUserRes.insertId,
          ...tmp,
        };
      }
    }

    // 数据整改和 删除 password 不暴漏出去
    resData.userId = resData.id;
    delete resData.password;

    // 查文章  粉丝 赞
    const tSql = `
      SELECT
        (SELECT count(*) FROM fans as f WHERE f.userId = u.id) as fNum,
        (SELECT count(*) FROM article as a WHERE a.userId = u.id) as aNum,
				(SELECT
			count(ac.id) AS count
		FROM
			article_like AS ac
		LEFT JOIN article a ON a.id = ac.articleId
		LEFT JOIN user u ON u.id = a.userId
		WHERE u.id = ${resData.userId} AND ac.status = 1 ) as cNum
      FROM
        user u
      WHERE u.id = ${resData.userId}

    `;
    const tRes = await this.app.mysql.query(tSql);
    const token = await this.returnToken(resData);

    this.ctx.cookies.set('token', token, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: false,
      signed: true,
    });

    // 存入redis 作为登陆状态 时间为24小时
    await this.service.redis.set('loginUserId_' + resData.userId, token, 60 * 60 * 24);

    this.ctx.body = {
      code: 200,
      data: {
        ...resData,
        ...tRes[0],
      },
    };
  }

  // 关注/取消关注
  async setFollow() {
    const userInfo = await this.getTokenInfo();

    const queryIsHas = await this.app.mysql.get('fans', {
      fansId: userInfo.userId,
      userId: this.ctx.query.id,
    });


    if (!queryIsHas) {
      const result = await this.app.mysql.insert('fans', {
        fansId: userInfo.userId,
        userId: this.ctx.query.id,
      });

      await this.setMsg({
        type: 5,
        userId: userInfo.userId,
        callUserId: this.ctx.query.id,
        source: null,
        sourceId: userInfo.userId,
      });

      if (result.affectedRows === 1) {
        this.ctx.body = {
          code: 200,
          msg: '关注成功!',
          status: true,
        };
      }

    } else {
      if (queryIsHas.status === 1) {
        const result = await this.app.mysql.update('fans', {
          id: queryIsHas.id,
          status: 0,
        });
        if (result.affectedRows === 1) {
          this.ctx.body = {
            code: 200,
            msg: '取消关注成功!',
            status: false,
          };
        }
      } else {
        const result = await this.app.mysql.update('fans', {
          id: queryIsHas.id,
          status: 1,
        });
        if (result.affectedRows === 1) {
          this.ctx.body = {
            code: 200,
            msg: '关注成功!',
            status: true,
          };
        }
      }
    }
  }

  // 轮询消息
  async getMsg() {
    const userInfo = await this.getTokenInfo();
    const sql = `
    SElECT 
      m.*,
      u.userName AS userName,
      u.avatar AS avatar
      FROM 
      msg m
      LEFT JOIN user u ON m.userId = u.id
      WHERE m.callUserId = '${userInfo.userId}' AND m.status = 0 AND m.userId != ${userInfo.userId}
    ORDER BY createTime DESC
    `;
    const res = await this.app.mysql.query(sql);

    this.ctx.body = {
      code: 200,
      data: res || [],
    };
  }

  // 轮询消息列表 不存入redux 本质跟前面接口一个样，只是多了一些参数，已读状态在此接口修改
  async getMsgList() {
    const Op = this.app.Sequelize.Op;
    const { page, limit, filters, orderBy } = this.ctx.query;
    const { type } = qs.parse(filters);
    const { order } = qs.parse(orderBy);
    const userInfo = await this.getTokenInfo();
    const where = {
      callUserId: userInfo.userId * 1,
      userId: {
        [Op.ne]: userInfo.userId * 1,
      },
    };

    if (type === (this.dict.msgType.likeArticle + '' + this.dict.msgType.likeComment)) {
      where.type = {
        [Op.or]: [
          { [Op.eq]: this.dict.msgType.likeArticle },
          { [Op.eq]: this.dict.msgType.likeComment },
        ],
      };
    } else if (type === (this.dict.msgType.commentArticle + '' + this.dict.msgType.commentReply)) {
      where.type = {
        [Op.or]: [
          { [Op.eq]: this.dict.msgType.commentArticle },
          { [Op.eq]: this.dict.msgType.commentReply },
        ],
      };
    } else if (type) {
      where.type = type;
    }

    const result = await this.ctx.model.Msg.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      include: [
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: [ 'id', 'avatar', 'userName' ],
        },
        {
          model: this.ctx.model.Comment,
          as: 'comment',
          attributes: [ 'id', 'visitorAvatar', 'visitorName' ],
        },
      ],
      where,
      order,
    });

    // 循环获取id
    const arr = [];
    result.rows.forEach(element => {
      if (element.status * 1 === 0) {
        arr.push(element.id);
      }
    });

    if (arr.length) {
      const sql1 = `
          UPDATE msg
              SET status = 1
          WHERE id IN (${arr.join()})
          `;
        // 更新状态为已读
      await this.app.mysql.query(sql1);
    }

    this.ctx.body = {
      code: 200,
      data: {
        list: result.rows,
        current: page * 1,
        pageSize: limit * 1,
        total: result.count,
      },
    };

  }

  // 用户关注列表
  async getFollowList() {
    const { page, limit, filters } = this.ctx.query;
    const { id } = qs.parse(filters);

    const result = await this.ctx.model.Fans.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      attributes: [
        'id',
        [ this.app.Sequelize.col('user.userName'), 'userName' ],
        [ this.app.Sequelize.col('user.id'), 'userId' ],
        [ this.app.Sequelize.col('user.autograph'), 'autograph' ],
        [ this.app.Sequelize.col('user.avatar'), 'avatar' ],
      ],
      include: [
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: [],
        },
      ],
      group: [ 'fans.id' ],
      where: {
        fansId: id,
        status: 1,
      },
    });

    this.ctx.body = {
      code: 200,
      data: {
        list: result.rows,
        current: page * 1,
        pageSize: limit * 1,
        total: result.count.length,
      },
    };
  }

  // 用户粉丝列表
  async getFansList() {
    const { page, limit, filters } = this.ctx.query;
    const { id } = qs.parse(filters);

    const result = await this.ctx.model.Fans.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      attributes: [
        'id',
        [ this.app.Sequelize.col('fansUser.userName'), 'userName' ],
        [ this.app.Sequelize.col('fansUser.id'), 'userId' ],
        [ this.app.Sequelize.col('fansUser.autograph'), 'autograph' ],
        [ this.app.Sequelize.col('fansUser.avatar'), 'avatar' ],
      ],
      include: [
        {
          model: this.ctx.model.User,
          as: 'fansUser',
          attributes: [],
        },
      ],
      group: [ 'fans.fansId' ],
      where: {
        userId: id,
        status: 1,
      },
    });

    this.ctx.body = {
      code: 200,
      data: {
        list: result.rows,
        current: page * 1,
        pageSize: limit * 1,
        total: result.count.length,
      },
    };
  }

  // 热门用户列表(bug)
  async getHotUserList() {
    const Op = this.app.Sequelize.Op;
    const result = await this.ctx.model.User.findAndCountAll({
      distinct: true,
      limit: 3,
      offset: 0,
      attributes: {
        exclude: [ 'password' ],
      },
      where: {
        status: this.dict.commonStatus.yes,
        auth: {
          [Op.or]: [
            { [Op.eq]: this.dict.auth.super },
            { [Op.eq]: this.dict.auth.blogger },
          ],
        },
      },
      order: [
        [ 'id', 'asc' ],
      ],
    });

    this.ctx.body = {
      code: 200,
      data: result.rows,
    };
  }

  // 用户列表
  async getUserList() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { auth, status } = qs.parse(filters);
    const { order } = qs.parse(orderBy);
    const where = {};

    if (auth) {
      where.auth = auth * 1;
    }

    if (status) {
      where.status = status * 1;
    }

    const result = await this.ctx.model.User.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      attributes: {
        exclude: [ 'password' ],
        include: [
          [
            this.app.Sequelize.literal(
              `(
                SELECT COUNT(*)
                  FROM article a
                WHERE
                  a.userId = user.id AND
                  a.status = 1 AND
                  a.state = 1
              )`
            ),
            'articleCount',
          ],
          [
            this.app.Sequelize.literal(
              `(
                SELECT COUNT(*)
                  FROM fans f
                WHERE
                  f.userId = user.id AND
                  f.status = 1
              )`
            ),
            'fansCount',
          ],
        ],
      },
      group: [ 'user.id' ],
      where,
      order,
    });

    this.ctx.body = {
      code: 200,
      data: {
        list: result.rows,
        current: page * 1,
        pageSize: limit * 1,
        total: result.count.length,
      },
    };
  }

  // 新增/编辑 用户
  async addEditUser() {
    const tmp = this.ctx.request.body;
    const userInfo = await this.getTokenInfo();
    const isSuper = await this.isSuper(false);
    let isOwn = true;

    tmp.userId = userInfo.userId;

    let result = false;
    if (tmp.id) {
      const tmpUserInfo = await this.ctx.model.User.findByPk(tmp.id);

      if (userInfo.userId !== tmp.id) {
        isOwn = false;
      }
      // 判断是否同是同个用户或者是 超级管理员
      if (isOwn || isSuper) {
        result = await this.app.model.User.update(tmp, {
          where: {
            id: tmp.id,
          },
        });

        if (result) {
          // 修改了手机号 要移除存入当前修改id的redis记录
          if (tmpUserInfo.mobile !== tmp.mobile) {
            await this.service.redis.del('loginUserId_' + tmp.id);
          }
        }
      } else {
        this.ctx.body = {
          code: 500,
          msg: '无权操作！',
        };
        return;
      }
    } else {
      result = await this.app.model.User.create(tmp);
    }

    if (result) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }


  // 删除
  async delUser() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.User.destroy({
        where: {
          id: ids[i],
        },
      });

      if (!delResult) {
        errArr.push(ids[i]);
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，删除失败，其余成功！` : '删除成功！',
    };
  }


  // 冻结
  async frozenUser() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.User.update({ state: 0 }, {
        where: {
          id: ids[i],
        },
      });
      if (!delResult) {
        errArr.push(ids[i]);
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，冻结失败，其余成功！` : '冻结成功！',
    };
  }


  // 解冻
  async thawUser() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.User.update({ state: 1 }, {
        where: {
          id: ids[i],
        },
      });
      if (!delResult) {
        errArr.push(ids[i]);
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，解冻失败，其余成功！` : '解冻成功！',
    };
  }

  // 重置密码
  async resetPassword() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }
    // 初始密码 123456
    const password = bcryptjs.hashSync('123456', 10);
    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.User.update({ password }, {
        where: {
          id: ids[i],
        },
      });

      // 重置密码 删除redis记录 触发退出登陆
      await this.service.redis.del('loginUserId_' + ids[i]);

      if (!delResult) {
        errArr.push(ids[i]);
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，重置失败，其余成功！` : '重置成功！',
    };
  }
}

module.exports = UserController;
