'use strict';

const qs = require('qs');
const BaseController = require('../public/BaseController');

class HomeController extends BaseController {

  // 根据 id（0,1） 筛选列表 （最新最热）
  // async getArticleList() {
  //   const sort = this.ctx.query.sort * 1;
  //   const page = this.ctx.query.page * 1;
  //   const limit = this.ctx.query.limit * 1;
  //   const sql = `
  //     SELECT
  //       a.id AS id,
  //       a.typeId AS typeId,
  //       a.title AS title,
  //       a.introduce AS introduce,
  //       a.viewCount AS viewCount,
  //       a.createTime AS createTime,
  //       a.userId AS userId,
  //       a.tags AS tags,
  //       t.typeName AS typeName,
  //       u.userName AS userName,
  //       a.cover AS cover,
  //       COUNT(al.id) AS likeCount
  //     FROM
  //       article a
  //     LEFT JOIN type t ON a.typeId = t.Id
  //     LEFT JOIN user u ON a.userId = u.Id
  //     LEFT JOIN article_like al ON al.articleId = a.Id AND al.status = 1
  //     WHERE a.status = 1
  //     GROUP BY a.id
  //     ORDER BY ${sort === 0 ? 'createTime' : 'viewCount'} DESC
  //     LIMIT ${(page - 1) * limit},${limit}
  //   `;

  //   const result = await this.app.mysql.query(sql);

  //   this.ctx.body = {
  //     data: result,
  //   };
  // }

  // 获取banner
  async getHomeBannerList() {
    const Op = this.app.Sequelize.Op;
    const result1 = await this.app.mysql.select('banner', {
      where: { status: this.dict.commonStatus.yes, type: this.dict.bannerType.rotation },
      orders: [[ 'id', 'desc' ]],
      limit: 5,
    });
    const result2 = await this.app.mysql.select('banner', {
      where: { status: this.dict.commonStatus.yes, type: this.dict.bannerType.recommend },
      orders: [[ 'id', 'desc' ]],
      limit: 2,
    });
    const result3 = await this.app.mysql.select('banner', {
      where: { status: this.dict.commonStatus.yes, type: this.dict.bannerType.advertisement },
      orders: [[ 'id', 'desc' ]],
      limit: 2,
    });
    // const result4 = await this.app.mysql.select('banner', { status: 1, type: 4 });
    const result4 = await this.ctx.model.Banner.findAndCountAll({
      distinct: true,
      limit: 1,
      where: {
        status: this.dict.commonStatus.yes,
        type: {
          [Op.or]: [
            { [Op.eq]: this.dict.bannerType.home },
            { [Op.eq]: this.dict.bannerType.homeIframe },
          ],
        },
      },
    });
    this.ctx.body = {
      code: 200,
      data: {
        banner: result1,
        rightBanner: result2,
        advert: result3,
        topBanner: result4.rows[0],
      },
    };
  }

  // 获取广告
  async getAdvertList() {
    const result = await this.app.mysql.select('banner', {
      where: { status: this.dict.commonStatus.yes, type: this.dict.bannerType.advertisement },
      orders: [[ 'createTime', 'desc' ], [ 'id', 'desc' ]],
      limit: 2,
    });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 获取listBanner
  async getListBanner() {
    const result = await this.app.mysql.get('banner', { status: this.dict.commonStatus.yes, type: this.dict.bannerType.list });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 获取detailBanner
  async getDetailBanner() {
    const result = await this.app.mysql.get('banner', { status: this.dict.commonStatus.yes, type: this.dict.bannerType.detail });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 获取searchBanner
  async getSearchBanner() {
    const result = await this.app.mysql.get('banner', { status: this.dict.commonStatus.yes, type: this.dict.bannerType.search });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 阅读量
  async readingVolume() {
    const tmp = this.ctx.query;
    const result = await this.app.mysql.get('article', { id: tmp.id });
    tmp.viewCount = result.viewCount + 1;

    const result1 = await this.app.mysql.update('article', tmp);
    const insertSuccess = result1.affectedRows === 1;

    if (insertSuccess) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }

  // 反馈 (弃用)
  async feedback() {
    const tmp = this.ctx.request.body;

    if (!tmp.title || !tmp.description) {
      this.ctx.body = {
        code: 500,
        msg: '参数错误!',
      };
      return;
    }

    const result = await this.app.mysql.insert('feedback', tmp);
    const insertSuccess = result.affectedRows === 1;

    if (insertSuccess) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }

  // 赞赏码
  async getRewardCode() {
    const id = this.ctx.query.id * 1;
    const result = await this.app.mysql.select('user', {
      where: { id },
    });
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 搜索列表 文章
  async getSearchList() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { type, searchVal } = qs.parse(filters);
    const { order } = qs.parse(orderBy);
    let result = {};

    if (type === 'article') {
      result = await this.ctx.model.Article.findAndCountAll({
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
        where: {
          status: 1,
          state: 1,
          title: {
            [this.app.Sequelize.Op.like]: '%' + searchVal + '%',
          },
        },
        order,
      });
    } else {
      result = await this.ctx.model.User.findAndCountAll({
        distinct: true,
        offset: ((page * 1) - 1) * limit,
        limit: limit * 1,
        attributes: [ 'id', 'userName', 'autograph', 'avatar' ],
        where: {
          status: 1,
          userName: {
            [this.app.Sequelize.Op.like]: '%' + searchVal + '%',
          },
        },
        order,
      });
    }

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


  // 当前用户发表的文章列表 type（1,2,3） page limit orderBy sort
  async getUserArticleList() {
    const type = this.ctx.query.type * 1;
    const id = this.ctx.query.id * 1;
    const page = this.ctx.query.page * 1;
    const limit = this.ctx.query.limit * 1;
    const orderBy = this.ctx.query.orderBy;
    const sort = this.ctx.query.sort;

    const sql = `
      SELECT
        article.*,
        type.id AS typeId,
        user.userName AS userName,
        COUNT(al.id) AS likeCount
      FROM
        article
        LEFT JOIN type ON article.typeId = type.Id
        LEFT JOIN user ON article.userId = user.Id
        LEFT JOIN article_like al ON al.articleId = article.Id AND al.status = 1
      WHERE article.userId = ${id} AND article.status = 1
        ${type ? 'AND article.typeId = ' + type : ''}
      GROUP BY article.id
      ORDER BY ${orderBy || 'id'} ${sort || 'DESC'}
      LIMIT ${(page - 1) * limit},${limit}
    `;
    const result = await this.app.mysql.query(sql);

    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 和风天气
  async getWeather() {
    const param = {
      key: this.ctx.query.key,
      location: this.ctx.query.location,
      lang: this.ctx.query.lang || 'cn',
    };
    const result = await this.service.weather.getWeather(param);

    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 网易云歌单（弃用）
  async getMusicList() {
    const id = this.ctx.query.id;
    const result = await this.service.wangyiyun.getMusicList(id);
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 每日一句
  async getYitu() {
    const result = await this.service.yitu.getYitu();
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 公告
  async notice() {
    const sql = 'SELECT * FROM notice where endTime >= now()';
    const result = await this.app.mysql.query(sql);
    this.ctx.body = {
      code: 200,
      data: result,
    };
  }

  // 公告列表
  async getNoticeList() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { order } = qs.parse(orderBy);
    const where = { ...qs.parse(filters) };
    const Op = this.app.Sequelize.Op;

    if (where.status) {
      where.status = where.status * 1;
    }

    if (where.endTime) {
      where.endTime = {
        [Op.gte]: where.endTime,
      };
    }

    const result = await this.app.model.Notice.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      where,
      order,
    });

    if (result) {
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
  }

  // 添加/修改 公告
  async addEditNotice() {
    const tmp = this.ctx.request.body;
    const userInfo = await this.isSuper();
    if (!userInfo) { return; }

    let result;
    if (tmp.id) {
      result = await this.app.model.Notice.update(tmp, {
        where: {
          id: tmp.id,
        },
      });
    } else {
      result = await this.app.model.Notice.create(tmp);
    }

    if (result) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }

  // 删除公告
  async delNotice() {
    const { ids } = this.ctx.request.body;
    const isSuper = await this.isSuper();
    if (!isSuper) { return; }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      const delResult = await this.ctx.model.Notice.destroy({
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

  async getFunctionList() {
    const result = await this.app.model.Config.findAll();
    if (result) {
      this.ctx.body = {
        code: 200,
        data: result,
      };
    }
  }

  async setFunction() {
    const tmp = this.ctx.request.body;
    const userInfo = await this.isSuper();
    if (!userInfo) { return; }
    const result = await this.app.model.Config.update({ status: tmp.status }, {
      where: {
        id: tmp.id,
      },
    });
    if (result) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      };
    }
  }

}

module.exports = HomeController;
