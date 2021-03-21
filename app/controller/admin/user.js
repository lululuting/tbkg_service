'use strict';

const BaseController = require('../public/BaseController');
const bcryptjs = require('bcryptjs');

class UserController extends BaseController {
  async index() {
    //首页的文章列表数据
    this.ctx.body = 'hi， 你好呀！'
  }

  async login() {
    let mobile = this.ctx.request.body.mobile;
    let password = this.ctx.request.body.password;

    const res = await this.app.mysql.get('user', {
      mobile: mobile
    })

    if (res && bcryptjs.compareSync(password, res.password)) {

      if(~~res.auth == 0){
        this.ctx.body = {
          code: 500,
          msg: '普通用户非博主，无权进后台',
        }
        return
      }

      //登录成功,进行toke
      let token = await this.returnToken(res)

      // 数据整改和 删除 password 不暴漏出去
      res.userId = res.id
      delete res.id
      delete res.password

      this.ctx.body = {
        'code': 200,
        'msg': '登录成功',
        data: {
          ...res,
          'token': token
        }
      }
    } else {
      this.ctx.body = {
        'code': 500,
        'msg': '账号或密码错误'
      }
    }
  }


  async getUserInfo() {
    let userInfo = await this.getTokenInfo()

    const res = await this.app.mysql.get('user',{
      id: userInfo.userId
    })
    delete res.password;
    
    const res1 = await this.app.mysql.get('contact',{
      userId: userInfo.userId
    })

    if (res) {
      this.ctx.body = {
        'code': 200,
        data: {
          ...res,
          contact: res1
        }
      }
    }
  }


  // 设置用户信息
  async updateUserInfo() {

    let tmp = this.ctx.request.body
    let userInfo = await this.getTokenInfo()

    tmp.id = userInfo.userId
    const result = await this.app.mysql.update('user', tmp)

    if (result.affectedRows === 1) {
      this.ctx.body = {
        code: 200,
        msg: '操作成功!',
      }
    }
  }


   // 用户修改密码
   async updatePassword() {
    let oldPassword = this.ctx.request.body.oldPassword
    let password = this.ctx.request.body.newPassword
    let userInfo = await this.getTokenInfo()

    const res = await this.app.mysql.get('user', {
      id: userInfo.userId
    })

    if (res && bcryptjs.compareSync(oldPassword, res.password)) {
      this.ctx.body = {
        code: 500,
        msg: '旧密码不正确!',
      }
    } else {
      const result = await this.app.mysql.update('user', {
        id: userInfo.userId,
        password: bcryptjs.hashSync(password, 10),
      })

      if (result.affectedRows === 1) {
        this.ctx.body = {
          code: 200,
          msg: '修改成功!',
        }
      }
    }
  }

  // 绑定手机号
  async updateMobile() {
    let mobile = this.ctx.request.body.mobile
    let userInfo = await this.getTokenInfo()

    const isHas = await this.app.mysql.get('user', {
      mobile: mobile
    })

    if(isHas) {
      this.ctx.body = {
        code: 500,
        msg: '该手机号已有绑定，请换一个试试!',
      }
      return 
    }

    const result = await this.app.mysql.update('user', {
      id: userInfo.userId,
      mobile: mobile,
    })

    if (result.affectedRows === 1) {
      this.ctx.body = {
        code: 200,
        msg: '绑定成功, 请重新登录!',
      }
    }
  }



  // 文章总数 
  async getUserArticleTotal() {
    let userInfo = await this.getTokenInfo()

    let sql1 = `SELECT COUNT(id) as total FROM article WHERE typeId = 1 AND article.userId = ${userInfo.userId}`
    let sql2 = `SELECT COUNT(id) as total FROM article WHERE typeId = 2 AND article.userId = ${userInfo.userId}`
    let sql3 = `SELECT COUNT(id) as total FROM article WHERE typeId = 3 AND article.userId = ${userInfo.userId}`

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

  // 当前用户发表的文章列表 type（1,2,3） page limit 
  async getUserArticleList() {
    // 先不做分页懒加载 后面数据多再优化
    // let page = this.ctx.query.page || 1
    // let limit = this.ctx.query.limit || 10
    // LIMIT ${(page - 1) * limit},${limit}
    let type = this.ctx.query.type
    let userInfo = await this.getTokenInfo()

    let sql = `
      SELECT
        article.*,
        type.id AS typeId,
        user.userName AS userName
        FROM
          article
          LEFT JOIN type ON article.typeId = type.Id
          LEFT JOIN user ON article.userId = user.Id
        WHERE article.userId = ${userInfo.userId}
        ${type && "AND article.typeId = " + type}  
        ORDER BY 'createTime' DESC
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


  // 老接口了 配合本地上传使用 现在改为7牛
	// 上传头像
  async uploadAvatar() {
    let {url} = await this.uploadFile('avatar')

    this.ctx.body = {
      code: 200,
      data: url
    }
  }

	// 上传联系方式二维码
  async uploadCode() {
    let {url} = await this.uploadFile('contactCode')

    this.ctx.body = {
      code: 200,
      data: url
    }
  }

  // 上传赞赏码
  async uploadRewardCode() {
    let {url} = await this.uploadFile('rewardCode')

    this.ctx.body = {
      code: 200,
      data: url
    }
  }



  //添加或修改联系方式
	async addEditContact() {
		let tmpArticle = this.ctx.request.body
    let userInfo = await this.getTokenInfo()
    tmpArticle.userId = userInfo.userId

		let result;
		if (tmpArticle.id) {
			result = await this.app.mysql.update('contact', tmpArticle)
		} else {
			result = await this.app.mysql.insert('contact', tmpArticle)
		}

		const insertSuccess = result.affectedRows === 1

		if (insertSuccess) {
			this.ctx.body = {
				code: 200,
				msg: '操作成功!',
			}
		}
	}


  
	//删除联系方式
	async delContact() {
		let id = this.ctx.request.body.id
    let userInfo = await this.getTokenInfo()


    const res = await this.app.mysql.delete('contact', { id, userId: userInfo.userId })
    
    const insertSuccess = res.affectedRows === 1
    if (insertSuccess) {
      this.ctx.body = {
        code: 200,
        msg: '删除成功！'
      }
    }
  }
  

  //添加或修改赞赏码
	async addEditReward() {
		let tmp = this.ctx.request.body
    let userInfo = await this.getTokenInfo()
    tmp.id = userInfo.userId
		let result = await this.app.mysql.update('user', tmp)
		if (result.affectedRows === 1) {
			this.ctx.body = {
				code: 200,
				msg: '操作成功!',
			}
		}
	}



};

module.exports = UserController;