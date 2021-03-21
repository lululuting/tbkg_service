'use strict';

const BaseController = require('../public/BaseController');

const articleAuth = (articleId, userId) => {
	let sql = `
	SELECT
		*
		FROM
			article
		WHERE id = ${articleId} AND userId = ${userId}
	`
	return sql
}

class ArticleController extends BaseController {

	// 文章总数 
	async getArticleTotal() {
		let sql1 = `SELECT COUNT(id) as total FROM article WHERE typeId = 1`
		let sql2 = `SELECT COUNT(id) as total FROM article WHERE typeId = 2`
		let sql3 = `SELECT COUNT(id) as total FROM article WHERE typeId = 3`

		const total1 = await this.app.mysql.query(sql1)
		const total2 = await this.app.mysql.query(sql2)
		const total3 = await this.app.mysql.query(sql3)

		this.ctx.body = {
			code: 200,
			data: {
				js: total1[0].total,
				sy: total2[0].total,
				shh: total3[0].total,
			}
		}
	}


	// 文章列表 type（1,2,3） page limit 
	async getArticleList() {
		let type = this.ctx.query.type
		let page = this.ctx.query.page || 1
		let limit = this.ctx.query.limit || 10

		let sql = `
      SELECT
        article.id AS id,
        article.title AS title,
        article.introduce AS introduce,
        article.createTime AS createTime,
		article.viewCount AS viewCount,
        article.status AS status,
		COUNT(al.id) AS likeCount,
		article.cover AS cover,
        article.userId AS userId,
        type.id AS typeId,
        user.userName AS userName
        FROM
          article
          LEFT JOIN type ON article.typeId = type.Id
		  LEFT JOIN user ON article.userId = user.Id
		  LEFT JOIN articlelike al ON al.articleId = article.Id AND al.status = '1'
		  ${type && "WHERE article.typeId = " + type} 
		GROUP BY article.id
        ORDER BY createTime DESC
        LIMIT ${(page - 1) * limit},${limit}
      `
		let sql2 = `SELECT COUNT(id) as total FROM article ${type && 'WHERE typeId =' + type};`

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

	// 文章详情 id查询
	async getArticleInfo() {
		let userInfo = await this.getTokenInfo()

		const result = await this.app.mysql.get('article',{
			id: this.ctx.query.id
		})
		// 判断是否同是同个用户或者是 超级管理员 否就返回预览模字段
		if(!(~~userInfo.userId === ~~result.userId || ~~userInfo.auth == 2)){
			result.isPreview = true;
		}

		this.ctx.body = {
			code: 200,
			data: result
		}
	}


	//添加或修改文章
	async addEditArticle() {
		let tmpArticle = this.ctx.request.body
		let userInfo = await this.getTokenInfo()
		tmpArticle.userId = userInfo.userId

		let result;
		if (tmpArticle.id) {
			let sql = articleAuth(tmpArticle.id, tmpArticle.userId);
			const res = await this.app.mysql.query(sql)

			// 判断是否同是同个用户或者是 超级管理员 
			if (res.length > 0 || ~~userInfo.auth === 2) {
				delete tmpArticle.userId // userId不能更改

				result = await this.app.mysql.update('article', tmpArticle)
			} else {
				this.ctx.body = {
					code: 500,
					msg: '你无权修改他人文章！'
				}
				return
			}
		} else {
			result = await this.app.mysql.insert('article', tmpArticle)
		}

		if (result.affectedRows === 1) {
			this.ctx.body = {
				code: 200,
				msg: '操作成功!',
			}
		}
	}


	//删除文章
	async delArticle() {
		let id = this.ctx.request.body.id
		let userInfo = await this.getTokenInfo()
		let sql = articleAuth(id, userInfo.userId);

		const result = await this.app.mysql.query(sql);
		// 判断是否同是同个用户或者是 超级管理员
		if (result.length > 0 || ~~userInfo.auth === 2) {
			const res = await this.app.mysql.delete('article', {
				'id': id
			})

			if (insertSuccess = res.affectedRows === 1) {
				this.ctx.body = {
					code: 200,
					msg: '删除成功！'
				}
			}

		} else {
			this.ctx.body = {
				code: 500,
				msg: '你无权删除他人文章！'
			}
		}
	}

	// 上传文章图片 (本地上传图片的服务器 已弃用)
	async uploadArticleImg() {
		let {
			url
		} = await this.uploadFile('article')

		this.ctx.body = {
			code: 200,
			data: url
		}
	}


};

module.exports = ArticleController;