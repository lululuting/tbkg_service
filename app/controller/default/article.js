'use strict';

const qs = require('qs');
const DeviceDetector = require('node-device-detector');
const BaseController = require('../public/BaseController');

class ArticleController extends BaseController {
  // 文章列表  规则：未登陆和非本人只能查看正常文章， 管理员和本人可以查看到隐藏和冻结的文章
  async getArticleList() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { type, userId, title, admin } = qs.parse(filters);
    const { order } = qs.parse(orderBy);
    const where = {
      status: 1,
      state: 1,
    };

    if (type * 1) {
      where.typeId = type * 1;
    }
    if (userId * 1) {
      where.userId = userId * 1;
    }

    // 模糊查询
    if (title) {
      where.title = {
        [this.app.Sequelize.Op.like]: '%' + title + '%',
      };
    }

    const userInfo = await this.getTokenInfo();
    const isSuper = await this.isSuper(false);
    let isOwn = true;
    if (!userInfo || userInfo.userId !== where.userId) {
      isOwn = false;
    }

    // 当有id参数时 不是超管或者自己 不能看到 自己隐藏的文章和被冻结的文章
    if ((userId || admin) && (isSuper || isOwn)) {
      delete where.status;
      delete where.state;
    }

    const result = await this.ctx.model.Article.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      attributes: { include: [[ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('al.id')), 'likeCount' ]] },
      include: [
        {
          model: this.ctx.model.ArticleLike,
          as: 'al',
          duplicating: false,
          distinct: true,
          attributes: [],
          where: { status: 1 },
          required: false,
        },
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: [ 'id', 'userName' ],
        },
        {
          model: this.ctx.model.Type,
          as: 'type',
        },
      ],
      group: [ 'article.id' ],
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

    // 原生sql
    // const sql = `
    //   SELECT
    //   a.id AS id,
    //   a.typeId AS typeId,
    //   a.title AS title,
    //   a.introduce AS introduce,
    //   a.viewCount AS viewCount,
    //   a.createTime AS createTime,
    //   a.userId AS userId,
    //   a.tags AS tags,
    //   a.cover AS cover,
    //   t.typeName as typeName,
    //   u.userName AS userName,
    //   COUNT(al.id) AS likeCount
    // FROM article a
    //   LEFT JOIN type t ON a.typeId = t.Id
    //   LEFT JOIN user u ON a.userId = u.Id
    //   LEFT JOIN article_like al ON al.articleId = a.Id AND al.status = 1
    //   WHERE a.status = 1 ${type ? 'AND typeId=' + type : ''}
    //   GROUP BY a.id
    //   ORDER BY ${orderBy || 'id'} ${sort || 'DESC'}
    //   LIMIT ${(page - 1) * limit},${limit}
    // `;
  }


  // 文章总数
  async getUserArticleTotal() {

    const userInfo = await this.getTokenInfo();
    const isSuper = await this.isSuper(false);
    const { id } = this.ctx.query;

    const where = {
      userId: id,
    };
    let isOwn = true;
    if (!userInfo || userInfo.userId !== where.userId) {
      isOwn = false;
    }
    if (!isSuper && !isOwn) {
      where.status = 1;
      where.state = 1;
    }
    const total1 = await this.ctx.model.Article.count({
      where: {
        typeId: 1,
        ...where,
      },
    });
    const total2 = await this.ctx.model.Article.count({
      where: {
        typeId: 2,
        ...where,
      },
    });
    const total3 = await this.ctx.model.Article.count({
      where: {
        typeId: 3,
        ...where,
      },
    });

    this.ctx.body = {
      code: 200,
      data: {
        js: total1,
        sy: total2,
        shh: total3,
      },
    };
  }

  // 根据id获取文章详情
  async getArticleInfo() {
    const { id } = this.ctx.query;
    const userInfo = await this.getTokenInfo();
    const include = [
      [ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('al.id')), 'likeCount' ],
    ];

    // 查点赞状态
    if (userInfo && userInfo.userId) {
      include.push([
        [ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('al.id')), 'likeCount' ],
      ]);
    }

    const result = await this.ctx.model.Article.findByPk(id, {
      attributes: {
        include,
      },
      include: [
        {
          model: this.ctx.model.ArticleLike,
          as: 'al',
          duplicating: false,
          distinct: true,
          where: { status: 1 },
          attributes: [],
        },
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: [ 'id', 'userName', 'avatar' ],
        },
      ],
    });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 根据id获取文章详情(简陋信息)
  async getArticleDetail() {
    // 先配置路由的动态传值，然后再接收值
    const id = this.ctx.query.id * 1;
    const result = await this.app.mysql.get('article', {
      id,
    });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 获取文章评论 （还是先不做分页）
  async getArticleComment() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { id } = qs.parse(filters);
    const { order } = qs.parse(orderBy);

    const result = await this.ctx.model.Comment.findAndCountAll({
      distinct: true,
      // offset: ((page * 1) - 1) * limit,
      // limit: limit * 1,
      attributes: { include: [
        [ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('cl.id')), 'likeCount' ],
        [ this.app.Sequelize.col('user.userName'), 'userName' ],
        [ this.app.Sequelize.col('user.avatar'), 'avatar' ],
      ] },
      include: [
        {
          model: this.ctx.model.CommentLike,
          as: 'cl',
          duplicating: false,
          distinct: true,
          attributes: [],
          where: { status: 1 },
          required: false,
        },
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: [],
        },
      ],
      group: [ 'comment.id' ],
      where: {
        status: 1,
        articleId: id,
        // pid: null,
      },
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

  // 评论
  async setArticleComment(req) {
    const param = this.ctx.request.body;
    // 全转大写，效果：验证码不区分大小写
    if (param.code.toUpperCase() !== this.ctx.session.code.toUpperCase()) {
      this.ctx.body = {
        code: 200,
        success: false,
        msg: '验证码不正确',
      };
      return;
    }
    delete param.code; // 验证码正确后删掉code，不然会阻止后面sql写数据

    const userInfo = await this.getTokenInfo();
    if (userInfo) {
      param.userId = userInfo.userId;
    }

    let callUser = null; // 通知谁
    if (param.articleId) {
      callUser = await this.app.mysql.get('article', {
        id: param.articleId,
      });
    } else {
      callUser = await this.app.mysql.get('comment', {
        id: param.commentId,
      });
      param.articleId = callUser.articleId;
    }

    // 回复评论 设置pid
    if (param.commentId) {
      param.pid = param.commentId;
      delete param.commentId;
    }

    // ip地理信息
    const position = await this.service.map.getPosition(req.ip); // '116.23.186.225'
    // 设备信息
    const detector = new DeviceDetector();
    const userAgent = detector.detect(req.headers['user-agent']);

    param.equipmentInfo = JSON.stringify({
      ip: req.ip,
      position,
      userAgent,
    });

    const result = await this.app.mysql.insert('comment', param);
    const insertSuccess = result.affectedRows === 1;

    // 没有callUser.userId的为游客 游客不需要通知
    if (insertSuccess && callUser.userId) {
      // 带commentId就是回复 没带就是评论
      await this.setMsg({
        type: callUser.cover ? this.dict.msgType.commentArticle : this.dict.msgType.commentReply,
        userId: userInfo ? userInfo.userId : 0,
        callUserId: callUser.userId,
        content: param.content,
        source: callUser.cover ? callUser.cover : callUser.content,
        sourceId: callUser.cover ? callUser.id : callUser.articleId,
        commentId: result.insertId,
      });
    }

    this.ctx.body = {
      code: 200,
      success: true,
      msg: '评论成功，等待审核中',
    };
  }

  // 验证码
  async getVerify() {
    const {
      ctx,
    } = this;
    // 服务里面的方法
    const verify = await this.service.verify.getVerify();
    // 返回的类型
    ctx.response.type = 'image/svg+xml';
    // {data: '<svg.../svg>', text: 'abcd'}
    ctx.body = verify.data;
  }

  // 查询文章点赞状态
  async getLikeStatus() {
    const userInfo = await this.getTokenInfo();
    const result = await this.app.mysql.get('article_like', {
      userId: userInfo.userId,
      articleId: this.ctx.query.id,
    });

    const sql = `SELECT COUNT(id) as count FROM article_like WHERE articleId = ${this.ctx.query.id} AND status = 1`;
    const countRes = await this.app.mysql.query(sql);

    this.ctx.body = {
      code: 200,
      data: {
        count: countRes[0].count,
        status: result ? result.status : 0,
      },
    };
  }

  // 文章点赞
  async articleClickLike() {
    const userInfo = await this.getTokenInfo();

    const articleInfo = await this.app.mysql.get('article', {
      id: this.ctx.query.id,
    });

    const queryIsHas = await this.app.mysql.get('article_like', {
      userId: userInfo.userId,
      articleId: this.ctx.query.id,
    });

    if (!queryIsHas) {
      const result = await this.app.mysql.insert('article_like', {
        userId: userInfo.userId,
        articleId: this.ctx.query.id,
      });

      if (result.affectedRows === 1) {
        this.ctx.body = {
          code: 200,
          msg: '谢谢老铁!',
        };

        await this.setMsg({
          type: 3,
          userId: userInfo.userId,
          callUserId: articleInfo.userId,
          source: articleInfo.cover ? articleInfo.cover : articleInfo.title,
          sourceId: articleInfo.id,
        });
      }

    } else {
      const result = await this.app.mysql.update('article_like', {
        id: queryIsHas.id,
        status: queryIsHas.status === 1 ? 0 : 1,
      });

      if (result.affectedRows === 1) {
        this.ctx.body = {
          code: 200,
          msg: '修改成功!',
        };
      }
    }
  }

  // 评论点赞
  async commentClickLike() {
    const param = this.ctx.request.body;
    const userInfo = await this.getTokenInfo();

    const commentInfo = await this.app.mysql.get('comment', {
      id: param.commentId,
    });

    const queryIsHas = await this.app.mysql.get('comment_like', {
      userId: userInfo.userId,
      articleId: commentInfo.articleId,
      commentId: param.commentId,
    });

    if (!queryIsHas) {
      const result = await this.app.mysql.insert('comment_like', {
        commentId: param.commentId,
        userId: userInfo.userId,
        articleId: commentInfo.articleId,
      });

      await this.setMsg({
        type: 4,
        userId: userInfo.userId,
        callUserId: commentInfo.userId,
        source: commentInfo.content,
        sourceId: commentInfo.articleId,
      });

      if (result.affectedRows === 1) {
        this.ctx.body = {
          code: 200,
          msg: '点赞成功!',
        };
      }

    } else {

      if (queryIsHas.status === 1) {
        const result = await this.app.mysql.update('comment_like', {
          id: queryIsHas.id,
          status: 0,
        });
        if (result.affectedRows === 1) {
          this.ctx.body = {
            code: 200,
            msg: '取消点赞成功!',
          };
        }
      } else {
        const result = await this.app.mysql.update('comment_like', {
          id: queryIsHas.id,
          status: 1,
        });
        if (result.affectedRows === 1) {
          this.ctx.body = {
            code: 200,
            msg: '点赞成功!',
          };
        }
      }
    }
  }


  // 添加或修改文章
  async addEditArticle() {
    const tmpArticle = this.ctx.request.body;
    const userInfo = await this.getTokenInfo();
    const isSuper = await this.isSuper(false);
    let isOwn = true;

    tmpArticle.userId = userInfo.userId;

    let result = false;
    if (tmpArticle.id) {
      // 获取文章详情
      const articleInfo = await this.ctx.model.Article.findByPk(tmpArticle.id);
      if (userInfo.userId !== articleInfo.userId) {
        isOwn = false;
      }

      // 判断是否同是同个用户或者是 超级管理员
      if (isOwn || isSuper) {
        delete tmpArticle.userId; // userId不能更改
        result = await this.app.model.Article.update(tmpArticle, {
          where: {
            id: tmpArticle.id,
          },
        });
      } else {
        this.ctx.body = {
          code: 500,
          msg: '无权操作！',
        };
        return;
      }
    } else {
      result = await this.app.model.Article.create(tmpArticle);
    }

    if (result) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }


  // 删除文章
  async delArticle() {
    const { ids } = this.ctx.request.body;
    const userInfo = await this.getTokenInfo();
    const isSuper = await this.isSuper(false);

    let isOwn = true;
    const errArr = [];

    for (let i = 0; i < ids.length; i++) {
      // 获取文章详情
      const articleInfo = await this.ctx.model.Article.findByPk(ids[i]);
      if (userInfo.userId !== articleInfo.userId) {
        isOwn = false;
      }

      // 判断是否同是同个用户或者是超级管理员
      if (isOwn || isSuper) {
        const delResult = await this.ctx.model.Article.destroy({
          where: {
            id: ids[i],
          },
        });

        if (!delResult) {
          errArr.push(ids[i]);
        }
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，删除失败，其余成功！` : '删除成功！',
    };
  }


  // 冻结文章
  async frozenArticle() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.Article.update({ state: 0 }, {
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


  // 解冻文章
  async thawArticle() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.Article.update({ state: 1 }, {
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


  // 获取文章评论
  async getCommentList() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { type, status } = qs.parse(filters);
    const { order } = qs.parse(orderBy);
    const where = {};

    if (type) {
      where.typeId = type * 1;
    }

    if (status) {
      where.status = status * 1;
    }

    const result = await this.ctx.model.Comment.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      attributes: { include: [[ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('cl.id')), 'likeCount' ]] },
      include: [
        {
          model: this.ctx.model.CommentLike,
          as: 'cl',
          duplicating: false,
          distinct: true,
          attributes: [],
        },
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: [ 'id', 'userName' ],
        },
        {
          model: this.ctx.model.Article,
          as: 'article',
          attributes: [ 'id', 'title' ],
        },
      ],
      group: [ 'comment.id' ],
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


  // 删除评论
  async delComment() {
    const { ids } = this.ctx.request.body;
    const userInfo = await this.getTokenInfo();
    const isSuper = await this.isSuper(false);

    let isOwn = true;
    const errArr = [];

    for (let i = 0; i < ids.length; i++) {
      // 获取文章详情
      const articleInfo = await this.ctx.model.Comment.findByPk(ids[i]);
      if (userInfo.userId !== articleInfo.userId) {
        isOwn = false;
      }

      // 判断是否同是同个用户或者是超级管理员
      if (isOwn || isSuper) {
        const delResult = await this.ctx.model.Comment.destroy({
          where: {
            id: ids[i],
          },
        });

        if (!delResult) {
          errArr.push(ids[i]);
        }
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，删除失败，其余成功！` : '删除成功！',
    };
  }


  // 冻结评论
  async frozenComment() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.Comment.update({ status: 0 }, {
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


  // 解冻评论
  async thawComment() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.Comment.update({ status: 1 }, {
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
}

module.exports = ArticleController;
