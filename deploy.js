/*
 * @Author: TingGe
 * @Date: 2021-01-31 15:17:50
 * @LastEditTime: 2021-03-21 17:50:21
 * @LastEditors: TingGe
 * @Description: 老马自动化部署脚本 详情 npm搜索 m-ssh-deploy
 * @FilePath: /github项目/tbkg-service/deploy.js
 */

const deploy = require('m-ssh-deploy')

const deployConfig = {
  name: 'xxx博客后台服务', // 部署名称
  // 选择列表
  choices: [{
    name: '正式环境',
    value: 'pro',
  }, ],

  // 配置列表
  deployList: [{
    VALUE: 'pro', // 提供选择，跟choices的value
    SERVER_PATH: '', // ssh地址 服务器地址
    SSH_USER: '', // ssh 用户名
    PASSWORD: '', // 用密码连接服务器
    PATH: '', // 需要上传的服务器目录地址 如 /usr/local/nginx/html
    SERVER_CMD: ['builtIn:5', 'git pull -u origin master', 'yarn install', 'npm run stop', 'npm run start', ], // 自定义在服务器上执行的指令，从左到右执行
    RUN_MODEL: 4, // 1:只打包 2:打包和压缩zip 3:打包、压缩zip、上传服务器 默认是 4，自定义
  }, ],
}

deploy(deployConfig) // 运行