<template>
<view :class="'fui-page seckill-page ' + seckill_style + ' ' + seckill_color + ' fui-page-current'" :style="'background:' + background_color">
    <view v-if="diypages" style="min-height:100%;height:100%;">
            <include src="/pages/custom/index.wxml"></include>
    </view>
    <view v-else>

    <view class="fui-content " v-if="list_error==0">
        <view class="assembly-container">
            <view class="assembly" :style="'width:' + room_num*170 + 'rpx'">
                <view v-for="(room, index) in rooms" :key="index" :class="( roomid==room.id?'active':'' )" @tap="selected" :data-id="room.id">{{room.title}}</view>
            </view>
        </view>

        <view class="swiper-container time-container" v-if="goods_error==0">
            <view class="swiper-wrapper" :style="'width:' + time_num*140 + 'rpx'">

                <view :class="'swiper-slide time-slide  ' + ( timeindex==index?'current':'' )" v-for="(time, index) in times" :key="index" @tap="current" :data-timeid="time.id" :data-index="index">
                    <view class="time">{{time.time}}:00</view>
                    <view class="text" v-if="time.status == 0">抢购中</view>
                    <view class="text" v-else-if="time.status == 1">即将开始</view>
                    <view class="text" v-else>已结束</view>
                </view>

            </view>
        </view>
        <!-- <view class="swiper-container adv-container" wx:if="{{ goods_error==0}}" >
            <view class="swiper-wrapper" style="width:{{ adv_num*268 }}rpx">
                <view class="swiper-slide adv-slide"  wx:for="{{ advs }}" wx:for-item="adv">
                    <navigator url="./index.php?i=12&amp;c=entry&amp;m=ewei_shopv2&amp;do=mobile&amp;r=goods.detail&amp;mid=12643&amp;id=9346"class="text " >
                        <image src="{{ adv.thumb }}" mode="widthFix"></image>
                     </navigator >
                </view>
            </view>
        </view> -->
        <view class="swiper-container goods-container swiper-container-horizontal" v-if="goods_error==0">
            <view class="swiper-wrapper">

                <view class="swiper-slide goods-slide swiper-slide-active " v-for="(time, index) in times" :key="index" v-if="timeindex==index" :data-starttime="time.starttime" :data-endtime="time.endtime" :data-status="time.status" :data-timeid="time.id">
                    <view class="fui-list-group noborder">

                        <view class="fui-list-group-title">
                            <view style="color:#666;font-size:26rpx">
                                <view class="text" v-if="time.status == -1">还可以继续抢购哦~</view>
                                <view class="text" v-if="time.status == 0">抢购中 先下单先得哦</view>
                                <view class="text" v-if="time.status == 1">即将开始 先下单先得哦</view>
                            </view>
                            <view class="timer" v-if="time.status>=0">
                                {{ time.status==1?'距开始':'距结束' }}<span class="time-hour">{{ hour }}</span>:<span class="time-min">{{ min }}</span>:<span class="time-sec">{{ sec }}</span>
                            </view>
                        </view>


                        <view class="fui-list align-start" v-for="(goods_item, index2) in goods" :key="index2">
                            <view class="fui-list-media">
                                <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid"><image :src="goods_item.thumb"></image></navigator>
                            </view>
                            <view class="fui-list-inner text-overflow2">
                                <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="text">{{ goods_item.title }}</navigator>
                                <view class="info-container1">
                                    <view class="info">
                                        <view v-if="time.status == 1">
                                            <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="btn btn-success btn-sm "> 等待抢购</navigator>
                                        </view>
                                        <view v-else-if="goods_item.percent >=100">
                                            <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="btn btn-default btn-sm "> 已抢空</navigator>
                                        </view>
                                        <view v-else>
                                            <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="btn btn-danger btn-sm "> 去抢购</navigator>
                                        </view>
                                        <view class="price" v-if="goods_item.price">¥{{ goods_item.price }}</view>
                                    </view>
                                    <view class="info info1" v-if="time.status != 1">
                                        <view class="process">
                                            <view class="inner" :style="'width:' + goods_item.percent + '%;'"></view>
                                        </view>
                                        <span class="process-text">已抢 <span>{{ goods_item.percent }}%</span></span>
                                        <view class="price1" v-if="goods_item.marketprice">¥{{ goods_item.marketprice }} </view>
                                    </view>
                                </view>
                                <view class="info-container2">
                                    <view class="info">
                                        <view class="price" v-if="goods_item.price">¥{{ goods_item.price }}</view>
                                        <view class="price1" v-if="goods_item.marketprice">¥{{ goods_item.marketprice }}</view>
                                    </view>
                                    <view class="info info1">
                                            <view v-if="time.status == 1">
                                                <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="btn btn-success btn-sm "> 等待抢购</navigator>
                                            </view>
                                            <view v-else-if="goods_item.percent >=100">
                                                <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="btn btn-default btn-sm "> 已抢空</navigator>
                                            </view>
                                            <view v-else>
                                                <navigator :url="'/pages/goods/detail/index?id=' + goods_item.goodsid" class="btn btn-danger btn-sm "> 去抢购</navigator>
                                            </view>
                                        <view class="process-container" v-if="time.status != 1">
                                            <view class="process">
                                                <view class="inner" :style="'width:' + goods_item.percent + '%;'"></view>
                                            </view>
                                            <view class="process-text">已抢 <span>{{ goods_item.percent }}%</span></view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>


            </view>
        </view>
    </view>
    </view>

    <view class="center" v-if="list_error==1 || goods_error==1">
      <view class="empty">
        <image src="/static/images/icon/nolist.png" class="light"></image>
        <view class="text-cancel">{{message}}</view>
        <navigator class="btn btn-danger-o" url="/pages/index/index" open-type="switchTab">去首页逛逛吧</navigator>
      </view>
    </view>

    <view :class="'fui-footer ' + seckill_color + ' '" :style="'height:' + height">
        <view class="fui-nav" data-url="/pages/index/index" @tap="navigate">
            <view>
                <text class="icox icox-shouye1"></text>返回商城
            </view>
        </view>
        <view class="fui-nav" @tap="onLoad">
            <view class="active">
                <text class="icox icox-miaoshashouye"></text>秒杀首页
            </view>
        </view>
        <view class="fui-nav" data-url="/pages/member/cart/index" @tap="navigate">
            <view>
                <text class="icox icox-gouwuche1"></text>购物车
            </view>
        </view>
        <view class="fui-nav" data-url="/pages/order/index" @tap="navigate">
            <view>
                <text class="icox icox-wodedingdan"></text>我的订单
            </view>
        </view>
    </view>

</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      audios: {},
      audiosObj: {},
      roomid: '0',
      timeindex: '0',
      taskid: '0',
      timeid: '0',
      timer: 0,
      goods: '',
      rooms: '',
      room_num: 0,
      times: '',
      time_num: 0,
      advs: '',
      adv_num: 0,
      list_error: 0,
      goods_error: 0,
      message: '',
      lasttime: 0,
      hour: '-',
      min: '-',
      sec: '-',
      diypages: '',
      seckill_style: '',
      seckill_color: '',
      color: {
        'red': '#ff5555',
        'blue': '#4e87ee',
        'purple': '#a839fa',
        'orange': '#ff8c1e',
        'pink': '#ff7e95'
      },
      swiperheight: ''
    };
  },

  onLoad: function () {
    var $this = this;
    wx.getSystemInfo({
      success: function (res) {
        var model = res.model;
        var iponeX = model.indexOf("iPhone X");

        if (iponeX == '0') {
          $this.setData({
            height: '168rpx'
          });
        } else {}

        var swiperheight = res.windowWidth / 1.7;
        $this.setData({
          swiperheight: swiperheight
        });
      }
    });
    core.get('seckill/get_list', {}, function (ret) {
      if (ret.error == 1) {
        $this.setData({
          list_error: 1,
          message: ret.message
        });
      } else {
        if (ret.diypages.items != undefined) {
          $.each(ret.diypages.items, function (id, item) {
            var data = {};

            if (item.id == 'seckill_advs') {
              data.adv_num = item.data.length;
            }

            data.diypages = ret.diypages;
            $this.setData(data);
          });
        }

        $this.setData({
          rooms: ret.rooms,
          room_num: ret.rooms.length,
          times: ret.times,
          time_num: ret.times.length,
          timeindex: ret.timeindex,
          roomid: ret.roomid,
          taskid: ret.taskid,
          timeid: ret.timeid,
          // advs: ret.advs,
          // adv_num: ret.advs.length,
          seckill_style: ret.seckill_style,
          seckill_color: ret.seckill_color,
          background_color: ret.diypages.background_color
        });

        if (ret.seckill_style == 'style2') {
          wx.setNavigationBarColor({
            frontColor: ret.diypages.titlebarcolor,
            backgroundColor: $this.data.color[ret.seckill_color]
          });
          wx.setNavigationBarTitle({
            title: ret.diypages.page_title
          });
        } else {
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
          });
        }

        $this.getGoods(ret.timeid);
      }
    });
  },
  components: {},
  props: {},
  methods: {
    selected: function (e) {
      var $this = this;
      $this.setData({
        roomid: e.currentTarget.dataset.id
      });
      var roomid = e.currentTarget.dataset.id;
      core.get('seckill/get_list', {
        roomid: roomid
      }, function (ret) {
        if (ret.error == 1) {
          $this.setData({
            list_error: 1,
            message: ret.message
          });
        } else {
          $this.setData({
            rooms: ret.rooms,
            times: ret.times,
            time_num: ret.times.length,
            timeindex: ret.timeindex
          });
        }

        $this.getGoods(ret.timeid);
      });
    },
    current: function (e) {
      var $this = this;
      $this.getGoods(e.currentTarget.dataset.timeid);
      $this.setData({
        timeindex: e.currentTarget.dataset.index
      });
    },
    getGoods: function (timeid) {
      var $this = this;
      core.get('seckill/get_goods', {
        taskid: $this.data.taskid,
        roomid: $this.data.roomid,
        timeid: timeid
      }, function (ret) {
        if (ret.error == 1) {
          $this.setData({
            goods_error: 1,
            message: ret.message
          });
        } else {
          $this.setData({
            goods_error: 0,
            goods: ret.goods
          });
          $this.initTimer(timeid);
        }
      });
    },
    initTimer: function (timeid) {
      var $this = this;
      var slide = '';
      $.each($this.data.times, function (i, item) {
        if (item.id === timeid) {
          slide = item;
        }
      });
      var status = parseInt(slide.status);
      var starttime = slide.starttime;
      var endtime = slide.endtime;
      clearInterval($this.data.timer);

      if (status != -1) {
        var lasttime = 0;
        var timer = 0;
        var approot = app.globalData.approot;
        wx.request({
          url: approot + 'map.json',
          success: function (x) {
            var currenttime = new Date(x.header.Date) / 1000;

            if (status == 0) {
              lasttime = endtime - currenttime;
            } else {
              lasttime = starttime - currenttime;
            }

            $this.setData({
              lasttime: lasttime
            });
            $this.setTimer(slide);
            timer = $this.setTimerInterval(slide);
            $this.setData({
              timer: timer
            });
          }
        });
      }
    },

    /*timer.js文件方法*/
    formatSeconds: function (value) {
      var theTime = parseInt(value);
      var theTime1 = 0;
      var theTime2 = 0;

      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);

        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }

      return {
        'hour': theTime2 < 10 ? '0' + theTime2 : theTime2,
        'min': theTime1 < 10 ? '0' + theTime1 : theTime1,
        'sec': theTime < 10 ? '0' + theTime : theTime
      };
    },
    setTimer: function (seckillinfo) {
      var $this = this;
      var lasttime = 0; //每十秒请求一次服务器，获取时间

      if (seckillinfo.status != -1) {
        if (parseInt($this.data.lasttime) % 10 == 0) {
          var approot = app.globalData.approot;
          wx.request({
            url: approot + 'map.json',
            success: function (x) {
              var currenttime = new Date(x.header.Date) / 1000;

              if (seckillinfo.status == 0) {
                lasttime = seckillinfo.endtime - currenttime;
              } else {
                lasttime = seckillinfo.starttime - currenttime;
              }

              $this.setData({
                lasttime: lasttime
              });
            }
          });
        }
      }

      lasttime = parseInt($this.data.lasttime) - 1;
      var times = $this.formatSeconds(lasttime);
      $this.setData({
        lasttime: lasttime,
        hour: times.hour,
        min: times.min,
        sec: times.sec
      });

      if (lasttime <= 0) {
        $this.onLoad();
      }
    },
    setTimerInterval: function (seckillinfo) {
      var $this = this;
      return setInterval(function () {
        $this.setTimer(seckillinfo);
      }, 1000);
    },
    play: function (e) {
      var item_id = e.target.dataset.id;
      var innerAudioContext = this.audiosObj[item_id] || false;

      if (!innerAudioContext) {
        innerAudioContext = wx.createInnerAudioContext('audio_' + item_id);
        var audiosObj = this.audiosObj;
        audiosObj[item_id] = innerAudioContext;
        this.setData({
          audiosObj: audiosObj
        });
      }

      var $this = this;
      innerAudioContext.onPlay(() => {
        var Time = setInterval(function () {
          var width = innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%';
          var minute = Math.floor(Math.ceil(innerAudioContext.currentTime) / 60); //分

          var second = (Math.ceil(innerAudioContext.currentTime) % 60 / 100).toFixed(2).slice(-2); //秒

          var seconds = Math.ceil(innerAudioContext.currentTime);
          var audioicon = '';

          if (minute < 10) {
            minute = "0" + minute;
          }

          var time = minute + ":" + second;
          var audios = $this.data.audios;
          audios[item_id].audiowidth = width;
          audios[item_id].Time = Time;
          audios[item_id].audiotime = time;
          audios[item_id].seconds = seconds;
          $this.setData({
            audios: audios
          });
        }, 1000);
      });
      var src = e.currentTarget.dataset.audio;
      var time = e.currentTarget.dataset.time;
      var pausestop = e.currentTarget.dataset.pausestop;
      var loopplay = e.currentTarget.dataset.loopplay;

      if (loopplay == 0) {
        innerAudioContext.onEnded(res => {
          audios[item_id].status = false;
          $this.setData({
            audios: audios
          });
        });
      }

      var audios = $this.data.audios;

      if (!audios[item_id]) {
        audios[item_id] = {};
      }

      if (innerAudioContext.paused && time == 0) {
        innerAudioContext.src = src;
        innerAudioContext.play();

        if (loopplay == 1) {
          innerAudioContext.loop = true;
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else if (innerAudioContext.paused && time > 0) {
        innerAudioContext.play();

        if (pausestop == 0) {
          innerAudioContext.seek(time);
        } else {
          innerAudioContext.seek(0);
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else {
        innerAudioContext.pause();
        audios[item_id].status = false;
      }

      $this.setData({
        audios: audios
      });
    },
    pauseOther: function (item_id) {
      var $this = this;
      $.each(this.audiosObj, function (id, obj) {
        if (id == item_id) {
          return;
        }

        obj.pause();
        var audios = $this.data.audios;

        if (audios[id]) {
          audios[id].status = false;
          $this.setData({
            audios: audios
          });
        }
      });
    },
    navigate: function (e) {
      var url = e.currentTarget.dataset.url;
      var phone = e.currentTarget.dataset.phone;
      var appid = e.currentTarget.dataset.appid;
      var appurl = e.currentTarget.dataset.appurl;

      if (url) {
        wx.navigateTo({
          url: url,
          fail: function () {
            wx.switchTab({
              url: url
            });
          }
        });
      }

      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        });
      }

      if (appid) {
        wx.navigateToMiniProgram({
          appId: appid,
          path: appurl
        });
      }
    },
    // 选项卡切换
    tabwidget: function (e) {
      var $this = this,
          diypages = $this.data.diypages,
          list = diypages.items,
          id = e.currentTarget.dataset.id,
          dataurl = e.currentTarget.dataset.url,
          type = e.currentTarget.dataset.type;

      if (dataurl == '' || dataurl == undefined) {
        return;
      }

      core.get('diypage/getInfo', {
        dataurl: dataurl
      }, function (ret) {
        for (var i in diypages.items) {
          if (i == id) {
            diypages.items[i].data[type].data = ret.goods.list;
            diypages.items[i].data[type].type = ret.type;
            diypages.items[i].type = ret.type;
            diypages.items[i].status = type;

            if (ret.goods.list.length <= 8) {
              diypages.items[i].data[type].showmore = true;
            }

            $this.setData({
              diypages: diypages
            });
          }
        } // $this.setData({ tabbarData: ret.goods, tabbarDataType:ret.type})

      });
    },
    setData: function (obj) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }

          data = data[key2];
        });
      });
    }
  }
};
</script>
<style>
@import "../../../pages/common/city-picker.css";
@import "../../../pages/custom/index.css";

.seckill-page{
  padding-bottom: 100rpx
}
.seckill-page .swiper-container.room-container {
    width:100%;
    background:#fff;
    position:relative;
}
.text-overflow2 {
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.text-overflow1 {
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.seckill-page .swiper-container.room-container:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    -webkit-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
}

.seckill-page .swiper-container.room-container .room-slide {
    width:20%;
    text-align: center;
    font-size:28rpx;
    color:#666;
    padding:8rpx 0;
}
.seckill-page .swiper-container.room-container .room-slide.selected {
    color:#ef4f4f;
    border-bottom:2px solid #ef4f4f;
}
.seckill-page.style2 .swiper-container.time-container {
    background:#fd5454;
}
.blue.seckill-page.style2 .swiper-container.time-container {
  background:#4e87ee;
}
.purple.seckill-page.style2 .swiper-container.time-container {
  background:#a839fa;
}
.orange.seckill-page.style2 .swiper-container.time-container {
  background:#ff8c1e;
}
.pink.seckill-page.style2 .swiper-container.time-container {
  background:#ff7e95;
}
.seckill-page .swiper-container.time-container {
    width:100%;
    background:#fff;
    text-align: center;
    overflow: auto;
}
.seckill-page .swiper-slide.time-slide {
    width:140rpx;
    text-align: center;
    padding:8rpx 0;
    float: left;
    height: 100rpx
}
.seckill-page .swiper-slide.time-slide.current{
    background: #ffd1d1
}
.blue.seckill-page .swiper-slide.time-slide.current{
    background: #afcbff
}
.purple.seckill-page .swiper-slide.time-slide.current{
    background: #e0b7ff
}
.orange.seckill-page .swiper-slide.time-slide.current{
    background: #ffcb9a
}
.pink.seckill-page .swiper-slide.time-slide.current{
    background: #ffc8d2
}
.seckill-page.style2 .swiper-slide.time-slide.current{
    color:#fd5454;
    background: #fd5454
}
.blue.seckill-page.style2 .swiper-slide.time-slide.current{
  color:#4e87ee;
  background:#4e87ee;
}
.purple.seckill-page.style2 .swiper-slide.time-slide.current{
  color:#a839fa;
  background:#a839fa;
}
.orange.seckill-page.style2 .swiper-slide.time-slide.current{
  color:#ff8c1e;
  background:#ff8c1e;
}
.pink.seckill-page.style2 .swiper-slide.time-slide.current{
  color:#ff7e95;
  background:#ff7e95;
}
.seckill-page .swiper-slide.time-slide .text,
.seckill-page .swiper-slide.time-slide .time {
    display: block;
    -moz-transition-duration: 100ms;
    -webkit-transition-duration: 100ms;
    transition-duration: 100ms;
    -webkit-transition-property: color,font-size;
    transition-property: color,font-size;

}
.seckill-page .swiper-slide.time-slide .time {
    font-size:36rpx;
    height:48rpx;
    padding-top:14rpx;

}
.seckill-page .swiper-slide.time-slide .text {
    font-size:20rpx;
    height:40rpx;
    color: #b3b3b3
}
.seckill-page.style2 .swiper-slide.time-slide .time {
  color: #fff
}
.seckill-page.style2 .swiper-slide.time-slide .text {
  color: #ffd1d1
}
.blue.seckill-page.style2 .swiper-slide.time-slide .text {
  color:#afcbff;
}
.purple.seckill-page.style2 .swiper-slide.time-slide .text {
  color:#e0b7ff;
}
.orange.seckill-page.style2 .swiper-slide.time-slide .text {
  color:#ffcb9a;
}
.pink.seckill-page.style2 .swiper-slide.time-slide .text {
  color:#ffc8d2;
}
.seckill-page .swiper-slide.time-slide.current .time,
.seckill-page .swiper-slide.time-slide.current .text {
     color:#ff3300;
}
.blue.seckill-page .swiper-slide.time-slide.current .time,
.blue.seckill-page .swiper-slide.time-slide.current .text {
     color:#4e87ee;
}
.purple.seckill-page .swiper-slide.time-slide.current .time,
.purple.seckill-page .swiper-slide.time-slide.current .text {
  color: #a839fa;
}
.orange.seckill-page .swiper-slide.time-slide.current .time,
.orange.seckill-page .swiper-slide.time-slide.current .text {
  color: #ff8c1e;
}
.pink.seckill-page .swiper-slide.time-slide.current .time,
.pink.seckill-page .swiper-slide.time-slide.current .text {
  color: #ff7e95;
}

.seckill-page.style2 .swiper-slide.time-slide.current .time {
     color:#ff3300;
     background: #fff;
     border-radius: 8rpx 8rpx 0 0
}
.blue.seckill-page.style2 .swiper-slide.time-slide.current .time,.blue.seckill-page.style2 .swiper-slide.time-slide.current .text {
  color:#4e87ee;
}
.purple.seckill-page.style2 .swiper-slide.time-slide.current .time,.purple.seckill-page.style2 .swiper-slide.time-slide.current .text {
  color:#a839fa;
}
.orange.seckill-page.style2 .swiper-slide.time-slide.current .time,.orange.seckill-page.style2 .swiper-slide.time-slide.current .text {
  color:#ff8c1e;
}
.pink.seckill-page.style2 .swiper-slide.time-slide.current .time,.pink.seckill-page.style2 .swiper-slide.time-slide.current .text {
  color:#ff7e95;
}
.seckill-page.style2 .swiper-slide.time-slide.current .text {
    color:#ff5555;
    background: #fff;
    border-radius: 0 0 8rpx 8rpx
}
.seckill-page .swiper-container.adv-container {
    width:100%;
    overflow: auto;
    background: #fff
}
.seckill-page .swiper-container.adv-container .swiper-wrapper,
.seckill-page .swiper-container.room-container .swiper-wrapper,
.seckill-page .swiper-container.time-container .swiper-wrapper {
  height: 120rpx;
  width: 2000rpx
}
.seckill-page .swiper-container.adv-container .swiper-wrapper{
  width: 2000rpx;
  }
.seckill-page .swiper-slide.adv-slide {
    width:260rpx;
    text-align: center;
    background:#fff;
    padding:4rpx;
float: left
}
.seckill-page .swiper-slide.adv-slide image {
    width:100%;
}

.seckill-page .fui-list {
    width:100%;
    padding: 32rpx 24rpx;
    box-sizing: border-box
}
.seckill-page .fui-list .fui-list-media{
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    -ms-flex-align: start;
    align-items: start
}
.seckill-page .fui-list .fui-list-media image {
    width:190rpx;
    height:190rpx;
}
.seckill-page .fui-list .fui-list-inner .text{
    color: #000000;
    display: block;
    font-size:26rpx;
    line-height: 36rpx;
    margin-bottom:40rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.seckill-page.style2 .fui-list .fui-list-inner .text{
    margin-bottom:16rpx;
}
.seckill-page.style2 .info-container1{
  display: none
}
.seckill-page.style1 .info-container2{
  display: none
}
.seckill-page .fui-list  .fui-list-inner .info {
    display:block;
    width:100%;
}
.seckill-page .fui-list  .fui-list-inner .info .btn {
    float:right;
    margin-top:-8rpx;
    width: 152rpx;
    box-sizing: border-box
}
.blue.seckill-page .fui-list  .fui-list-inner .info .btn-danger {
  background:#4e87ee;
  border-color:#4e87ee;
}
.purple.seckill-page .fui-list  .fui-list-inner .info .btn-danger {
  background:#a839fa;
  border-color:#a839fa;
}
.orange.seckill-page .fui-list  .fui-list-inner .info .btn-danger {
  background:#ff8c1e;
  border-color:#ff8c1e;
}
.pink.seckill-page .fui-list  .fui-list-inner .info .btn-danger {
  background:#ff7e95;
  border-color:#ff7e95;
}
.seckill-page.style2 .fui-list  .fui-list-inner .info .btn {
    margin-top:0;
}
.seckill-page .fui-list  .fui-list-inner .info .price {
    color:#ff5555;
    font-size:36rpx;
} 
.blue.seckill-page .fui-list  .fui-list-inner .info .price {
  color:#4e87ee;
}
.purple.seckill-page .fui-list  .fui-list-inner .info .price {
  color:#a839fa;
}
.orange.seckill-page .fui-list  .fui-list-inner .info .price {
  color:#ff8c1e;
}
.pink.seckill-page .fui-list  .fui-list-inner .info .price {
  color:#ff7e95;
}
.seckill-page.style2 .fui-list  .fui-list-inner .info{
    overflow: hidden
}
.seckill-page.style2 .fui-list  .fui-list-inner .info .price {
    float: left
} 
.seckill-page.style2 .fui-list  .fui-list-inner .info .price1 {
    float: left;
    margin-top:10rpx;
    margin-left: 10rpx
} 
.seckill-page .fui-list  .fui-list-inner .info .price1 {
    color:#b3b3b3;
    font-size:24rpx;
    text-decoration: line-through;
}

.seckill-page .fui-list  .fui-list-inner .info.info1{
    height:16rpx;
    line-height:16rpx;
    margin-top: 10rpx
}
.seckill-page.style2 .fui-list  .fui-list-inner .info.info1{
    height:56rpx;
    line-height:1;
    margin-top: 0
}

.seckill-page .fui-list-group-title {
    background: #f0f2f5;
    justify-content: space-between;
    padding:0px 24rpx;
}
.seckill-page .fui-list-group-title .timer {
    float:right;
    color:#ff5555;
    width: 255rpx;
    font-size: 24rpx
}

 .seckill-page .fui-list-group-title .timer span {
    display: inline-block;
    background:#fc664c;
    background:linear-gradient(to right, #fdad89 0%,#f94444 100%);
    background: -webkit-linear-gradient(left, #fdad89 0%,#f94444 100%);
    color:#fff;
    width:38rpx;
    height:30rpx;
    border-radius: 4rpx;
    line-height:30rpx;
    text-align: center;
    padding-right: 6rpx
} 

.seckill-page .fui-list:before {

    left: 0;
    right:0;
}

.seckill-page .fui-list  .fui-list-inner .info .process-text {
    float:right;
    font-size:20rpx;
    color:#d0d1d2;
    padding-right:8rpx;
    padding-top:2rpx;
    height:20rpx;

}
.seckill-page.style2 .fui-list  .fui-list-inner .info .process-text {
    float: none
}
.seckill-page .fui-list  .fui-list-inner .info .process-text span{
  color: #ff5555
}
.blue.seckill-page .fui-list  .fui-list-inner .info .process-text span{
  color:#4e87ee;
}
.purple.seckill-page .fui-list  .fui-list-inner .info .process-text span{
  color:#a839fa;
}
.orange.seckill-page .fui-list  .fui-list-inner .info .process-text span{
  color:#ff8c1e;
}
.pink.seckill-page .fui-list  .fui-list-inner .info .process-text span{
  color:#ff7e95;
}
.seckill-page .fui-list  .fui-list-inner .info .process {
    float:right;
    width:152rpx;
    height:10rpx;
    border-radius: 20rpx;
    background: #f0f2f5;
    overflow:hidden;
    margin-top:4rpx;
}
.seckill-page.style2 .fui-list  .fui-list-inner .info .process {
    width:250rpx;
    height:16rpx;
    margin-top:10rpx;
    margin-bottom:10rpx;
    float: none
}
.seckill-page.style2 .fui-list  .fui-list-inner .info .process-container {
    overflow: hidden
}
.seckill-page .fui-list  .fui-list-inner .info .process .inner {
    width:152rpx;
    height:10rpx;
    background:#ffd1d1;
    border-radius: 20rpx
}
.blue.seckill-page .fui-list  .fui-list-inner .info .process .inner {
  background:#afcbff;
}
.purple.seckill-page .fui-list  .fui-list-inner .info .process .inner {
  background:#e0b7ff;
}
.orange.seckill-page .fui-list  .fui-list-inner .info .process .inner {
  background:#ffcb9a;
}
.pink.seckill-page .fui-list  .fui-list-inner .info .process .inner {
  background:#ffc8d2;
}
.seckill-page.style2 .fui-list  .fui-list-inner .info .process .inner {
    width:250rpx;
    height:16rpx;
}
.seckill-page .swiper-container.goods-container {
    width:100%;

}

.assembly-container{
  overflow: auto;
  background: #fff
}
.assembly{
  background: #fff;
  width: 2000rpx;
  height: 80rpx;
}
.assembly view{
  color: #000;
  height: 80rpx;
  line-height: 80rpx;
  float: left;
  width: 170rpx;
  text-align: center;
  border-bottom:2px solid #fff ;
}
.assembly view.active{
  color: #ff5555;
  border-bottom-color:#ff5555 ;
}
.blue .assembly view.active{
  color: #4e87ee;
  border-bottom-color:#4e87ee;
}
.purple .assembly view.active{
  color: #a839fa;
  border-bottom-color:#a839fa;
}
.orange .assembly view.active{
  color: #ff8c1e;
  border-bottom-color:#ff8c1e;
}
.pink .assembly view.active{
  color: #ff7e95;
  border-bottom-color:#ff7e95;
}
.fui-footer {
  border-top: 1rpx solid #ededed;
  box-shadow: none;
  height: 98rpx;
}
.fui-footer .fui-nav{
  width: 25%;
  text-align: center;
  float: left;
  height: 98rpx;
  font-size: 18rpx;
  color: #9a9a9a
}
.fui-footer .fui-nav .icox{
  display: block;
  padding: 16rpx  0 6rpx;
  font-size: 44rpx
}
.fui-footer .fui-nav .icox::before{
  border-radius: 50%;
  width: 48rpx;
  height: 48rpx;
  display: inline-block;
  line-height: 48rpx;
  text-align: center;
  color: #ccc
}
.fui-footer .fui-nav view.active .icox::before{
  color: #ff5555;
}
.fui-footer .fui-nav view.active{
  color: #ff5555;
}
.blue.fui-footer .fui-nav view.active .icox::before{
    color: #4e87ee
}
.purple.fui-footer .fui-nav view.active .icox::before{
    color: #a839fa
}
.orange.fui-footer .fui-nav view.active .icox::before{
    color: #ff8c1e
}
.pink.fui-footer .fui-nav view.active .icox::before{
    color: #ff7e95
}
.blue.fui-footer .fui-nav view.active{
    color: #4e87ee
}
.purple.fui-footer .fui-nav  view.active{
    color: #a839fa
}
.orange.fui-footer .fui-nav  view.active{
    color: #ff8c1e
}
.pink.fui-footer .fui-nav view.active{
    color: #ff7e95
}
.red.seckill-page .fui-list  .fui-list-inner .info .btn-success  {
    background:#ff8753 !important;
    border-color:#ff8753 !important;
}
.blue.seckill-page .fui-list  .fui-list-inner .info .btn-success  {
    background:#4fbaee !important;
    border-color:#4fbaee !important;
}
.purple.seckill-page .fui-list  .fui-list-inner .info .btn-success {
    background:#6a60ff !important;
    border-color:#6a60ff !important;
}
.orange.seckill-page .fui-list  .fui-list-inner .info .btn-success {
    background:#ffb81e !important;
    border-color:#ffb81e !important;
}
.pink.seckill-page .fui-list  .fui-list-inner .info .btn-success {
    background:#ffacd0 !important;
    border-color:#ffacd0 !important;
}
.seckill-page .fui-list  .fui-list-inner .info .btn.btn-default {
        color: rgb(111,111,111);
    background: rgb(242,242,242) !important;
}
.blue.seckill-page .fui-list-group-title .timer {
    color:#4e87ee;
}
.purple.seckill-page .fui-list-group-title .timer {
    color:#a839fa;
}
.orange.seckill-page .fui-list-group-title .timer {
    color:#ff8c1e;
}
.pink.seckill-page .fui-list-group-title .timer {
    color:#ff7e95;
}

.blue.seckill-page .fui-list-group-title .timer span {
    background:#4e87ee;
    background:linear-gradient(to right, #4fbaee 0%,#4e87ee 100%);
    background: -webkit-linear-gradient(left, #4fbaee 0%,#4e87ee 100%);
}
.purple.seckill-page .fui-list-group-title .timer  span{
    background:#a839fa;
    background:linear-gradient(to right, #6a60ff 0%,#a839fa 100%);
    background: -webkit-linear-gradient(left, #6a60ff 0%,#a839fa 100%);
}
.orange.seckill-page .fui-list-group-title .timer span {
    background:#ff8c1e;
    background:linear-gradient(to right, #ffb81e 0%,#ff8c1e 100%);
    background: -webkit-linear-gradient(left, #ffb81e 0%,#ff8c1e 100%);
}
.pink.seckill-page .fui-list-group-title .timer span {
    background:#ff7e95;
    background:linear-gradient(to right, #ffacd0 0%,#ff7e95 100%);
    background: -webkit-linear-gradient(left, #ffacd0 0%,#ff7e95 100%);
}


.empty{
    padding:260rpx 150rpx;
    font-size: 34rpx;
}
.empty .btn{
    margin: 0;
    border-radius: 100rpx;
    height: 76rpx;
    line-height:76rpx;
    width:  280rpx;
    font-size: 30rpx;
    padding:0
}
.light{
    height: 240rpx;
    width: 240rpx;
}
.text-cancel{
    padding: 10rpx;
    margin-bottom: 30rpx;
    margin-top:25rpx;
    font-size: 30rpx;
}

.seckill-page .info-container1 .skill-btn{
  position: absolute;top: 50%;right: 0;transform: translateY(-50%);
}
</style>