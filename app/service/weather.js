/*
 * @Author: your name
 * @Date: 2020-09-09 00:22:39
 * @LastEditTime: 2021-03-21 17:34:35
 * @LastEditors: TingGe
 * @Description: 天气相关接口
 * @FilePath: /github项目/tbkg-service/app/service/weather.js
 */
const Service = require('egg').Service;

class WeatherService extends Service {
    async getWeather(params) {
        params.key = 'xxxxxx' // 和风天气key 自行申请

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        const nowDate = year + "" + month + "" + day;


        const res1 = await this.ctx.curl(`https://devapi.heweather.net/v7/weather/now`, {
            dataType: 'json',
            method: 'GET',
            data: params
        })

        const res2 = await this.ctx.curl(`https://devapi.heweather.net/v7/weather/24h`, {
            dataType: 'json',
            method: 'GET',
            data: params
        })

        const res3 = await this.ctx.curl(`https://devapi.heweather.net/v7/weather/7d`, {
            dataType: 'json',
            method: 'GET',
            data: params
        })

        const res4 = await this.ctx.curl(`https://devapi.heweather.net/v7/astronomy/sunmoon`, {
            dataType: 'json',
            method: 'GET',
            data: {
                ...params,
                date: nowDate
            }
        })

        const res5 = await this.ctx.curl(`https://devapi.heweather.net/v7/minutely/5m`, {
            dataType: 'json',
            method: 'GET',
            data: params,
        })


        const res6 = await this.ctx.curl(`https://devapi.heweather.net/v7/warning/now`, {
            dataType: 'json',
            method: 'GET',
            data: params,
        })



        let {
            now,
            updateTime
        } = res1.data;
        let {
            hourly
        } = res2.data;
        let {
            daily
        } = res3.data;
        let {
            sunrise,
            sunset
        } = res4.data;
        let {
            summary
        } = res5.data;
        let {
            warning
        } = res6.data;


        const res = {
            now,
            updateTime,
            hourly,
            daily,
            sunmoon: {
                sunrise,
                sunset
            },
            summary,
            warning
        }

        return res;
    }
}

module.exports = WeatherService;