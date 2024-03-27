/*
 * @Author: your name
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2021-09-01 11:20:33
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/app/service/weather.js
 */
'use strict';
const Service = require('egg').Service;

// 自行配置 和风天气 key
const keys = {
  prod: {
    url: 'https://api.heweather.net',
    key: 'xxxx',
  },
  dev: {
    url: 'https://devapi.heweather.net',
    key: 'xxxx',
  },
};

class WeatherService extends Service {
  async getWeather(params) {
    let serviceType;
    const isBaipiao = true; // 是否白嫖
    if (!isBaipiao) {
      serviceType = keys.prod;
    } else {
      serviceType = keys.dev;
    }
    params.key = serviceType.key;

    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    const nowDate = year + '' + month + '' + day;

    const res1 = await this.ctx.curl(`${serviceType.url}/v7/weather/now`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    });

    const res2 = await this.ctx.curl(`${serviceType.url}/v7/weather/24h`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    });

    const res3 = await this.ctx.curl(`${serviceType.url}/v7/weather/7d`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    });

    const res4 = await this.ctx.curl(`${serviceType.url}/v7/astronomy/sunmoon`, {
      dataType: 'json',
      method: 'GET',
      data: {
        ...params,
        date: nowDate,
      },
    });

    const res5 = await this.ctx.curl(`${serviceType.url}/v7/minutely/5m`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    });


    const res6 = await this.ctx.curl(`${serviceType.url}/v7/warning/now`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    });


    const { now, updateTime } = res1.data;
    const { hourly } = res2.data;
    const { daily } = res3.data;
    const { sunrise, sunset } = res4.data;
    const { summary } = res5.data;
    const { warning } = res6.data;

    const res = {
      now,
      updateTime,
      hourly,
      daily,
      sunmoon: {
        sunrise,
        sunset,
      },
      summary,
      warning,
    };

    return res;
  }
}

module.exports = WeatherService;
