'use strict';

const BaseController = require('../public/BaseController');
class BannerController extends BaseController {


	// banner列表 type（1,2,3,4,5,6） page limit 
	async getBannerList() {
		let type = this.ctx.query.type
		let page = this.ctx.query.page || 1
		let limit = this.ctx.query.limit || 10

		let sql = `
      SELECT
        banner.*,
        user.userName AS userName
        FROM
          banner
          LEFT JOIN user ON banner.userId = user.Id
        ${type && "WHERE banner.type = " + `'${type}'` } 
        ORDER BY 'createTime' DESC
        LIMIT ${(page - 1) * limit},${limit}
      `
		let sql2 = `SELECT COUNT(id) as total FROM banner ${type && 'WHERE type =' + type};`


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

	// 获取banner预览列表
	async getPreviewBanner() {
		let sql1 = `SELECT * FROM banner WHERE type = '1' AND status = '1' ORDER BY 'createTime' DESC LIMIT 5`
		let sql2 = `SELECT * FROM banner WHERE type = '2' AND status = '1' ORDER BY 'createTime' DESC LIMIT 2`
		let sql3 = `SELECT * FROM banner WHERE type= '3' AND status = '1' ORDER BY 'createTime' DESC LIMIT 2`

		const total1 = await this.app.mysql.query(sql1)
		const total2 = await this.app.mysql.query(sql2)
		const total3 = await this.app.mysql.query(sql3)

		this.ctx.body = {
			code: 200,
			data: {
				lb: total1,
				tj: total2,
				gg: total3,
			}
		}
	}


	//添加或修改banner
	async addEditBanner() {
		let tmp = this.ctx.request.body
		let userInfo = await this.getTokenInfo()
		tmp.userId = userInfo.userId

		// 权限非2 的用户不能修改
		if (~~userInfo.auth !== 2) {
			this.ctx.body = {
				code: 500,
				msg: '你无权修改banner',
			}
			return
		}

		let result;
		if (tmp.id) {
			result = await this.app.mysql.update('banner', tmp)
		} else {
			result = await this.app.mysql.insert('banner', tmp)
		}

		if (result.affectedRows === 1) {
			this.ctx.body = {
				code: 200,
				msg: '操作成功!',
			}
		}
	}


	// //删除banner
	async delBanner() {
		let id = this.ctx.request.body.id
		let userInfo = await this.getTokenInfo()
		// 权限非2 的用户不能修改
		if (~~userInfo.auth !== 2) {
			this.ctx.body = {
				code: 500,
				msg: '你无权修改banner',
			}
			return
		}

		const result = await this.app.mysql.delete('banner', {
			'id': id
		})

		if (result.affectedRows === 1) {
			this.ctx.body = {
				code: 200,
				msg: '删除成功！'
			}
		}
	}


	// 上传banner图片 (本地上传 已弃用)
	async uploadBanner() {
		let {
			url
		} = await this.uploadFile('banner')

		this.ctx.body = {
			code: 200,
			data: url
		}
	}

};

module.exports = BannerController;