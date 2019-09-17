<template>
<view>
<view class="topmsg">
  <view class="money">{{msg.member.dividend_total}}</view>
  <view>{{msg.set.texts.dividend_total}}（{{msg.set.texts.yuan}}）</view>
</view>
<view class="overflow mar-top">
  <icon class="fl icox icox-ketixianyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_ok}}</text>
  <text class="gold fr">{{msg.member.dividend_ok}}{{msg.set.texts.yuan}}</text>
</view>
<view class="overflow mar-top">
  <icon class="fl icox icox-yishenqingyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_apply}}</text>
  <text class="moneyitem fr">{{msg.member.dividend_apply}}{{msg.set.texts.yuan}}</text>
</view>
<view class="overflow">
  <icon class="fl icox icox-daidakuanyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_check}}</text>
  <text class="moneyitem fr">{{msg.member.dividend_check}}{{msg.set.texts.yuan}}</text>
</view>
<view class="overflow">
  <icon class="fl icox icox-wuxiaoyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_fail}}</text>
  <text class="moneyitem fr">{{msg.member.dividend_fail}}{{msg.set.texts.yuan}}</text>
</view>
<view class="overflow">
  <icon class="fl icox icox-chenggongtixianyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_pay}}</text>
  <text class="moneyitem fr">{{msg.member.dividend_pay}}{{msg.set.texts.yuan}}</text>
</view>
<view class="overflow mar-top">
  <icon class="fl icox icox-daishouhuoyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_wait}}</text>
  <text class="moneyitem fr">{{msg.member.dividend_wait}}{{msg.set.texts.yuan}}</text>
</view>
<view class="overflow">
  <icon class="fl icox icox-weijiesuanyongjin"></icon>
  <text class="fl">{{msg.set.texts.dividend_lock}}</text>
  <text class="moneyitem fr">{{msg.member.dividend_lock}}{{msg.set.texts.yuan}}</text>
</view>
<view class="tips mar-top">
  <view>用户须知</view>
  <icon class="iconfont"></icon>
</view>
<view class="tipsitem">
  <view>卖家确认收货后，立即获得{{msg.set.texts.dividend1}}</view>
  <view><text></text>注意：可用{{msg.set.texts.dividend}}满<text>1{{msg.set.texts.yuan}}</text>后才能申请{{msg.set.texts.withdraw}}</view>
</view>
 
<view :data-price="msg.member.dividend_ok" :class="(msg.member.dividend_total == 0 ? 'gray' : '') + ' withdrawbtn ' + (isIpx? 'iphoneX':'')" @tap="submit">我要{{msg.set.texts.withdraw}}</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {};
  },

  onShow: function (options) {
    var $this = this;
    core.get('dividend/withdraw', '', function (res) {
      $this.setData({
        msg: res
      });
      wx.setNavigationBarTitle({
        title: res.set.texts.dividend + '佣金' || '分红佣金'
      });
    });
  },
  onLoad: function (options) {
    var $this = this;
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true
      });
    } else {
      $this.setData({
        isIpx: false
      });
    }

    core.get('dividend/withdraw', '', function (res) {
      $this.setData({
        msg: res
      });
    });
  },
  components: {},
  props: {},
  methods: {
    // 提现
    submit: function (e) {
      var price = e.currentTarget.dataset.price;

      if (price <= 0) {
        return;
      }

      wx.navigateTo({
        url: '/dividend/pages/apply/index'
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
/* pages/selfmsg/selfmsg.wxss */
page {
  background: #f1f1f1;
  padding-bottom: 158rpx;
}
.overflow {
  overflow: hidden;
  line-height: 84rpx;
  font-size: 26rpx;
  padding: 0 30rpx;
  background: #fff;
}
.overflow:after {
  content: '';
  width: 100%;
  margin: 0 auto;
  display: block;
  border-bottom: 1px solid #f1f1f1;
}
.fl {
  float: left;
}
.fl.icox{
  margin-right: 10rpx;
  color: #666;
}
.fr {
  float: right;
}
.mar-top {
  margin-top: 20rpx;
}
text.fl {
  color: #6d6d6d;
}
.iconfont.fl {
  color: #9e9e9e;
}
.gold {
  color: #caae33;
}
.topmsg {
  height: 222rpx;
  background: #19181d;
  color: #cfa943;
  text-align: center;
  font-size: 26rpx;
}
.topmsg .money {
  font-size: 60rpx;
  padding: 40rpx 0 20rpx 0;
}
.tips {
  display: flex;
  justify-content: space-between;
  background: #fff;
  font-size: 26rpx;
  color: #333;
  padding: 0 30rpx;
  line-height: 80rpx;
  height: 80rpx;
  position: relative;
}
.tips view {
  width: 300rpx;
  font-weight: bold;
}
.tipsitem {
  background: #fff;
  padding: 20rpx 30rpx;
  font-size: 24rpx;
  line-height: 40rpx;
  color: #686868;
}
.tipsitem text {
  color: #cfa943;
}
.tips:after {
  content: '';
  border-bottom: 1px solid #f1f1f1;
  position: absolute;
  bottom: 0;
  left: 30rpx;
  display: block;
  width: 92.5%;
  margin: 0 auto;
}
.withdrawbtn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #cfa943;
  background: #1c1b20;
  font-size: 30rpx;
  position: fixed;
  bottom: 0;
  left: 0;
}
.withdrawbtn.iphoneX{
  bottom: 68rpx;
}
.withdrawbtn.gray{
  background: #ddd;
  color: #fff;
}
</style>