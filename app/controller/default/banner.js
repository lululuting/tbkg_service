'use strict';

const BaseController = require('../public/BaseController');
const qs = require('qs');

class BannerController extends BaseController {
  // banner列表
  async getBannerList() {
    const { page, limit, orderBy, filters } = this.ctx.query;
    const { type, status } = qs.parse(filters);
    const { order } = qs.parse(orderBy);

    const where = {};
    if (type) {
      where.type = type * 1;
    }
    if (status) {
      where.status = status * 1;
    }

    const result = await this.ctx.model.Banner.findAndCountAll({
      distinct: true,
      offset: ((page * 1) - 1) * limit,
      limit: limit * 1,
      include: [{
        model: this.ctx.model.User,
        as: 'user',
        attributes: [ 'id', 'userName' ],
      }],
      where,
      order,
    });

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

  // 删除banner (ids)
  async delBanner() {
    const ids = this.ctx.request.body.ids;

    const isSuper = await this.isSuper();
    if (!isSuper) {
      return;
    }

    const errArr = [];
    for (let i = 0; i < ids.length; i++) {
      try {
        await this.ctx.model.Banner.destroy({
          where: {
            id: ids[i],
          },
        });
      } catch (e) {
        errArr.push(i);
      }
    }

    this.ctx.body = {
      code: errArr.length ? 500 : 200,
      msg: errArr.length ? `id为[${errArr.join(',')}]的数据，删除失败！` : '删除成功！',
    };
  }

  // 添加或修改banner
  async addEditBanner() {
    const tmp = this.ctx.request.body;
    const userInfo = await this.isSuper();
    if (!userInfo) {
      return;
    }

    tmp.userId = userInfo.userId;

    if (tmp.id) {
      await this.ctx.model.Banner.update(tmp, {
        where: {
          id: tmp.id,
        },
      });
    } else {
      await this.ctx.model.Banner.create(tmp);
    }

    this.ctx.body = {
      code: 200,
      msg: '操作成功!',
    };

  }

}

module.exports = BannerController;
