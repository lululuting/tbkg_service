'use strict';

const BaseController = require('../public/BaseController');

class feedbackController extends BaseController {

    async getFeedbackList() {
        let type = this.ctx.query.type
        let page = this.ctx.query.page || 1
        let limit = this.ctx.query.limit || 10

        let sql = `
      SELECT
       *
        FROM
        feedback
        ORDER BY 'createTime' DESC
        LIMIT ${(page - 1) * limit},${limit}
      `
        let sql2 = `SELECT COUNT(id) as total FROM feedback`

        const result = await this.app.mysql.query(sql)
        const total = await this.app.mysql.query(sql2)


        this.ctx.body = {
            code: 200,
            data: {
                list: result,
                total: total[0].total,
            }
        }
    }
};

module.exports = feedbackController;