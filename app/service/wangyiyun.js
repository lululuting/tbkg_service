/*
 * @Author: your name
 * @Date: 2021-01-11 10:10:51
 * @LastEditTime: 2022-01-23 17:32:26
 * @LastEditors: TingGe
 * @Description: In User Settings Edit
 * @FilePath: /tingge_blog_zhongtai/app/service/wangyiyun.js
 */
'use strict';
const Service = require('egg').Service;

class Musicervice extends Service {

  async getMusicList(oId) {

    const res1 = await this.ctx.curl(
      `https://api.imjad.cn/cloudmusic/?type=playlist&id=${oId}`,
      {
        dataType: 'json',
        method: 'GET',
        data: {},
      }
    );

    if (!res1.data || res1.data.code !== 200) {
      return;
    }

    const ids = [];
    res1.data &&
      res1.data.privileges &&
      // eslint-disable-next-line array-callback-return
      res1.data.privileges.map((item, index) => {
        // 最多20条
        if (index + 1 <= 20) {
          ids.push(item.id);
        }
      });

    const res2 = await this.ctx.curl(
      `http://netease.1211210.xyz/song/detail?ids=${ids.join(',')}`,
      {
        dataType: 'json',
        method: 'GET',
      }
    );

    const res3 = await this.ctx.curl(
      `http://netease.1211210.xyz/song/url?id=${ids.join(',')}`,
      {
        dataType: 'json',
        method: 'GET',
      }
    );

    const songs = [];
    const urlArr = res3.data && res3.data.data || [];
    const detailArr = res2.data && res2.data.songs || [];

    for (let i = 0; i < urlArr.length; i++) {
      for (let j = 0; i < detailArr.length; j++) {
        if (urlArr[i].id === detailArr[j].id) {
          songs.push({
            name: detailArr[j].name,
            url: urlArr[i].url,
            artist: detailArr[j].ar[0].name,
            pic: detailArr[j].al.picUrl,
            // album: song.album.name, //专辑 没吊用 不需要
            // lrc: song.lyric.translate || song.lyric.base, // 歌词不需要
          });
          break;
        }
      }
    }
    return songs;
  }
}

module.exports = Musicervice;
