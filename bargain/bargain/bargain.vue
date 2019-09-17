<template>
<view>
<view class="page navbar nobuy" style>
<!--商品信息  -->
 <view class="bargain-shop">
   <view class="user">
    <image :src="list.head_image"></image>
    <text>{{ list.nickname }}</text>
  </view>
  <navigator class="goodsinfo flex" :url="'../detail/detail?id=' + bargain.id">
    <view class="image">
      <image mode="aspectFit" :src="bargain.thumb"></image>
    </view>
    <view class="goodsinner">
      <view class="title">{{ bargain.title }}</view>
      <view class="price">原价:{{ bargain.start_price }}</view>
      <view class="status">库存{{ bargain.stock }} | 已售{{ bargain.sold }}</view>
    </view>
  </navigator>
  <view class="prices">
    <view class="current">
      ￥{{ list.now_price }}<text>当前价</text>
    </view>
    <view class="cut">
      已砍金额<text>￥{{ list.bargain_price }}</text>
    </view>
     <view class="time" v-if="istime == 1 && timeout == 0">
      {{ istimeTitle }}<text v-for="(item, index) in time" :key="index" class="number">{{item}}{{index==0?'天': ''}}{{index==1?'时': ''}}{{index==2?'分': ''}}{{index==3?'秒': ''}}</text>
    </view> 
    <!--活动已结束或者过期  -->
     <view class="time" v-if="istime ==2 || timeout == 1" style="background:#999">
      活动已结束
    </view>  
  </view>
 </view>
 <!--tab切换  -->
 <view class="fui-cell-group">
        <view class="title">
            <view id="tab" class="fui-tab fui-tab-danger">
              <view :class="'item ' + (showtab=='family'?'active':'')" @tap="goodsTab" data-tap="family">亲友团</view>
              <view :class="'item ' + (showtab=='info'?'active':'')" @tap="goodsTab" data-tap="info">商品详情</view>
              <view :class="'item ' + (showtab=='rule'?'active':'')" @tap="goodsTab" data-tap="rule">活动规则</view>
              <view :class="'item ' + (showtab=='join'?'active':'')" v-if="bargain_set.partin > -10000" @tap="goodsTab" data-tap="join">参与榜</view>
            </view>
        </view>
        <!--tab内容  -->
        <view>
        <!--亲友团  -->
            <view v-if="showtab=='family'">
                <view class="fui-cell" v-for="(item, index) in bargain_record" :key="index">
                  <view class="fui-cell-label">
                    <image :src="item.head_image"></image>
                  </view>
                  <view class="fui-cell-info">
                    <view class="title">{{ item.nickname }}</view>
                    <view class="text">{{ item.bargain_time }}</view>
                  </view>
                   <view class="fui-cell-remark noremark danger">
                   <text v-if="item.bargain_price <= 0">{{ item.bargain_price }}</text>
                   <text v-if="item.bargain_price > 0">+{{ item.bargain_price }}</text>
                   </view>
                </view>
            </view>
            <!--详情  -->
            <view v-if="showtab=='info'">
              <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
            </view>
            <!--规则  -->
            <view v-if="showtab=='rule'">
              <component :wxParseData="wxParseDataRule.nodes" :is="wxParse"></component>
            </view>
            <!--参与榜  -->
            <view v-if="showtab=='join' && bargain_set.partin > -10000">
              <view class="fui-cell" v-for="(item, index) in bargain_actor" :key="index">
                  <view class="fui-cell-label">
                    <image :src="item.head_image"></image>
                  </view>
                  <view class="fui-cell-info">
                    <view class="title">{{ item.nickname }}</view>
                    <view class="text">{{ item.update_time }}</view>
                  </view>
                  <view class="fui-cell-remark noremark danger">
                    <text v-if="item.bargain_price <= 0">{{ item.bargain_price }}</text>
                    <text v-if="item.bargain_price > 0">+{{ item.bargain_price }}</text>
                  </view>
              </view>
            </view>
        </view>
    </view>

    <view class="buytips" :style="(isIpx?'bottom:168rpx':'')" v-if="trade_swi != 1 && myself_swi == 0 && istime == 1 && timeout == 0">{{ marked_words }}</view>
     <!--还未到底底部按钮  -->
      <view :class="'fui-navbar flex ' + iphonexnavbar" v-if="swi == 111 && istime == 1 && timeout == 0">
       <navigator class="buybtn" v-if="trade_swi == 5 && trade_swi != 0 && arrived == 0" :url="'/pages/order/create/index?bargainid=' + list.id">立即购买</navigator>
       <view class="buybtn" v-if="trade_swi == 2">已经结束</view>
       <view class="buybtn" v-if="trade_swi == 3">库存不足</view>
        <view class="buybtn" v-if="trade_swi == 4">没到底价</view> 
       <view class="bargainBuy" v-if="trade_swi != 1 && myself_swi == 1" @tap="cutPrice">立即砍价</view>
        <button class="bargainBuy" v-if="trade_swi != 0 && myself_swi == 0 && arrived == 0" @tap="seekHelp" open-type="share">找人帮砍</button> 
      </view>
      <view :class="'fui-navbar flex ' + iphonexnavbar" v-if="swi == '222' && istime == 1 && timeout == 0">
       <navigator class="buybtn" :url="'../detail/detail?id=' + bargain.id">我也要砍</navigator>
       <view class="bargainBuy" @tap="cutPrice">帮砍一刀</view>
      </view>
      <!--已到底底部按钮 -->
       <view :class="'fui-navbar ' + iphonexnavbar" v-if="swi == 111 && arrived == 1 && (trade_swi == 0 || trade_swi == 5) && myself_swi == 0">
        <navigator class="bargainBuy" :url="'/pages/order/create/index?bargainid=' + list.id">立即购买</navigator>
      </view> 

      <!--立即购买 -->
        <!-- <view class='fui-navbar {{iphonexnavbar}}' wx:if="{{ trade_swi == 5 }}">
        <navigator class='bargainBuy'url="/pages/order/create/index?bargainid={{ list.id }}">立即购买</navigator>
      </view>   -->

      <!-- 查看订单 -->
      <view :class="'fui-navbar ' + iphonexnavbar" v-if="trade_swi == 1">
        <navigator class="bargainBuy" :url="'/pages/order/detail/index?id=' + list.order">查看订单</navigator>
      </view>
      <view :class="(isIpx?'fui-iphonex-button':'')"></view>

      <!--砍价弹窗  -->
      <view class="layer" v-if="layer" @tap="closeLayer">
          <view class="content">
            <view class="icox icox-close"></view>
            <image src="/static/images/success.png"></image>
            <view style="line-height:82rpx;font-size:28rpx">恭喜你成功砍掉</view>
            <view style="line-height:70rpx;font-size:66rpx;font-weight:bold;color:#ff5555">{{ cutPrice }}元</view>
            <view class="layerbtn">知道了</view>
          </view>
      </view>
      <view class="layer" v-if="error_hint">
         <view class="showModal">
            <view class="inner">{{ error_hint_title }}</view>
            <view class="operate flex">
              <view class="flex1" @tap="closeError">确定</view>
            </view>
          </view>  
      </view>
</view>
</view>
</template>

<script>
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      label: "/static/images/label.png",
      showtab: 'family',
      bargainid: '',
      layer: false,
      cutPrice: '',
      error_hint: false,
      error_hint_title: '',
      list: {},
      bargain: {},
      bargain_set: {},
      istimeTitle: '剩余时间',
      bargain_record: {},
      bargain_actor: {},
      swi: '',
      trade_swi: '',
      myself_swi: '',
      mid: '',
      randomHint: {
        0: '大王，您即将触及我的价格底线，不要放弃继续砍价吧～',
        1: '主人，达到价格底线就可以带我回家啦！等你哦～',
        2: '加把劲，再砍一刀，马上就到底价了哦～',
        3: '砍到底价才能购买哦，邀请小伙伴来帮忙吧！',
        4: '叫上您的小伙伴来砍价，我们的的目标是底价买买买！'
      },
      marked_words: '',
      arrived: '',
      timeout: 0
    };
  },

  onShareAppMessage: function (res) {
    var $this = this;
    var id = $this.data.bargainid;
    var mid = $this.data.mid;
    return {
      title: '帮砍价',
      path: '../bargain/bargain?id=' + id + '&mid=' + mid,
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },
  onLoad: function (options) {
    app.url(options);
    var $this = this;
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      });
    }

    core.get('bargain/bargain', options, function (result) {
      if (result.error == 1) {
        $this.setData({
          upper_limit: true,
          upper_limitTitle: result.message
        });
        return;
      }

      if (result.error == 0) {
        if (result.unequalMid == 1) {
          wx.navigateTo({
            url: '../bargain/bargain?id=' + result.id + '&mid=' + result.mid
          });
        }

        $this.setData({
          list: result.list,
          bargain: result.bargain,
          bargain_set: result.bargain_set,
          bargain_record: result.bargain_record,
          bargain_actor: result.bargain_actor,
          swi: result.swi,
          trade_swi: result.trade_swi,
          myself_swi: result.myself_swi,
          bargainid: result.list.id,
          mid: result.mid,
          arrived: result.arrived,
          timeout: result.timeout
        });
        parser.wxParse('wxParseData', 'html', result.bargain.content, $this, '0');

        if (result.bargain.rule == '' || result.bargain.rule == undefined) {
          parser.wxParse('wxParseDataRule', 'html', result.bargain_set.rule, $this, '0');
        } else {
          parser.wxParse('wxParseDataRule', 'html', result.bargain.rule, $this, '0');
        }

        $this.countDown(result.bargain.start_time, result.bargain.end_time, 'istime');
        clearInterval($this.data.timer);
        var timer = setInterval(function () {
          $this.countDown(result.bargain.start_time, result.bargain.end_time, 'istime');
        }, 1000);
        $this.setData({
          timer: timer
        });
      }
    });
    var num = Math.floor(Math.random() * 4);
    var hintwords = $this.data.randomHint[num];
    $this.setData({
      marked_words: hintwords
    });
  },
  components: {},
  props: {},
  methods: {
    goodsTab: function (e) {
      this.setData({
        showtab: e.currentTarget.dataset.tap
      });
    },
    cutPrice: function () {
      app.checkAuth();
      const url = '/pages/message/auth/index';
      var $this = this;
      var bargainid = $this.data.bargainid;
      var ajax = 151;
      var mid = $this.data.mid;
      core.get('bargain/bargain', {
        id: bargainid,
        ajax: ajax,
        mid: mid
      }, function (result) {
        // 未获取授权首先获取授权
        if (result.error == -1) {
          wx.redirectTo({
            url: url
          });
          return;
        }

        if (result.error == 1) {
          $this.setData({
            error_hint: true,
            error_hint_title: result.message
          });
          return;
        }

        if (result.error == 0 && result.cutPrice) {
          $this.setData({
            layer: true,
            cutPrice: result.cutPrice
          });
        } else {
          wx.redirectTo({
            url: url
          });
        }
      }); // this.setData({
      //   layer: true
      // })
    },
    closeLayer: function () {
      this.setData({
        layer: false
      });
      var id = this.bargainid;
      var mid = this.mid;
      this.onLoad({
        id: id,
        mid: mid
      });
    },
    goBackPrev: function () {
      wx.navigateBack({
        delta: 1
      });
    },

    /*倒计时js start
    timestart----开始时间
    timeend----结束时间
    type-------类型
    */
    countDown: function (timestart, timeend, type) {
      var now = parseInt(Date.now() / 1000);
      var endDate = timestart > now ? timestart : timeend;
      var leftTime = endDate - now;
      var leftsecond = parseInt(leftTime);
      var day = Math.floor(leftsecond / (60 * 60 * 24));
      var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
      var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
      var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
      var time = [day, hour, minute, second];
      this.setData({
        time: time
      });

      if (type = 'istime') {
        var istimeTitle = '';

        if (timestart > now) {
          istimeTitle = '未开始';
          this.setData({
            istime: 0
          });
        } else if (timestart <= now && timeend > now) {
          istimeTitle = '剩余时间';
          this.setData({
            istime: 1
          });
        } else {
          istimeTitle = '活动已经结束，下次早点来~';
          this.setData({
            istime: 2
          });
        }

        this.setData({
          istimeTitle: istimeTitle
        });
      }
    },
    closeError: function () {
      this.setData({
        error_hint: false
      });
    },
    seekHelp: function () {
      this.onShareAppMessage();
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
.page.navbar.nobuy{
  padding-bottom:180rpx
}

.bargain-shop{
  background: #fff;
  padding: 0 24rpx;
}
.user {
  font-size: 26rpx;
  color: #666;
  line-height: 100rpx
}
.user image{
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 20rpx;
  float: left;
  margin-top: 24rpx
}
.bargain-shop .goodsinfo{
  height: 228rpx;
  width: 100%;
  background: #f7f7f7;
  padding: 32rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  color: #333
}
.bargain-shop .goodsinfo .title{
  height: 50rpx;
  line-height: 50rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.bargain-shop .goodsinfo .price{
  height: 60rpx;
  line-height: 60rpx;
}
.bargain-shop .goodsinfo .status{
  height: 50rpx;
  line-height: 50rpx;
  font-size: 24rpx;
  color: #999;
}
.goodsinfo .image image{
  width: 160rpx;
  height: 160rpx;
  margin-right: 24rpx;
}
.flex{
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.bargain-shop .prices{
  text-align: center
}
.bargain-shop .prices .current{
  font-size: 70rpx;
  font-weight: bold;
  color: #ff5555;
  line-height: 76rpx;
  margin-top: 50rpx;
}
.bargain-shop .prices.delay .current{
  color: #666
}
.bargain-shop .prices.delay .current text{
  border: 1px solid #666;
}
.bargain-shop .prices.delay .time{
  background: #999
}
.bargain-shop .prices .current text{
  font-size: 18rpx;
  height: 30rpx;
  border: 1px solid #ff5555;
  font-weight: normal;
  display: inline-block;
  line-height: 30rpx;
  vertical-align: middle;
  margin-top: -6px
}
.bargain-shop .prices .cut{
  line-height: 50rpx;
  color: #999;
  font-size: 24rpx;
}
.bargain-shop .prices .cut text{
  font-weight: bold;
}
.bargain-shop .prices .time{
  min-width: 390rpx;
  display: inline-block;
  height: 64rpx;
  border-radius: 64rpx;
  font-size: 24rpx;
  color: #fff;
  line-height: 64rpx;
  padding: 0 48rpx;
  margin: 22rpx 0 44rpx;
  background: -moz-linear-gradient(left, #ff8955 0%, #f94343 100%);
  background: -webkit-linear-gradient(left, #ff8955 0%,#f94343 100%);
  background: -o-linear-gradient(left, #ff8955 0%,#f94343 100%);
  background: -ms-linear-gradient(left, #ff8955 0%,#f94343 100%);
  background: linear-gradient(to right, #ff8955 0%,#f94343 100%);
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff8955, endColorstr=#fff94343,gradientType='1');
}
.bargain-shop .prices .time.delay{
  background: #999;

}
.bargain-list{
  margin-top: 20rpx;
  background: #fff;
}
.fui-tab{
  margin-bottom: 0
}
.tabcontent{
  padding: 0 24rpx
}
.fui-cell-group .fui-cell .fui-cell-label{
  width: 80rpx;
}
.fui-cell-group .fui-cell .title{
  font-size: 26rpx;
  color: #666
}
.fui-cell-group .fui-cell .text{
  font-size: 20rpx;
  color: #ccc
}
.fui-cell .fui-cell-label image{
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%
}
.fui-cell-group .fui-cell .fui-cell-remark.noremark.danger{
  color: #ff5555
}
.fui-navbar .buybtn{
  width: 240rpx;
  height: 100%;
  line-height: 100rpx;
  color: #666;
  text-align: center;
  font-size: 28rpx
}
.fui-navbar .bargainBuy{
  background: #ff5555;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  text-align: center;
  line-height: 100rpx;
  color: #fff;
  font-size: 28rpx;
  border-radius: 0;
}
.buytips{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 100rpx;
  background: #fbf7dc;
  font-size: 22rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  color: #ff8c5a
}
.layer{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999
}
.layer .content{
  width:420rpx;
  height: 460rpx;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -210rpx;
  margin-top: -230rpx;
  border-radius: 10rpx;
  text-align: center
}
.layer .content .icox-close{
  position: absolute;
  right: 10rpx;
  top: 0;
  line-height: 52rpx;
  font-size: 24rpx;
  display: block
}
.layer .content image{
  width: 86rpx;
  height: 103rpx;
  margin-top: 56rpx
}
.layer .content .layerbtn{
  width: 300rpx;
  background: #ff5555;
  line-height: 72rpx;
  border-radius: 72rpx;
  color: #fff;
  margin: 0 auto;
  margin-top: 36rpx;
}
.layer .showModal{
  width: 560rpx;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -280rpx;
  margin-top: -196rpx;
}
.layer .showModal .inner{
  padding:58rpx 52rpx;
  font-size: 28rpx;
  line-height: 36rpx;
  border-bottom: 1px solid #eee
}
.layer .showModal .operate{
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
   font-size: 28rpx;
}
.layer .showModal .operate view:last-child{
  border-left: 1px solid #eee;
  color: #00c201;
}
</style>