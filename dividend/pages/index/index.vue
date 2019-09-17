<template>
<view>
<loading v-if="loading">加载中...</loading>
<image :src="imgUrl + '/demo/logo.jpg'"></image> 
<view class="page">
  <view class="member-header">
    <view class="img">
      <image :src="message.member.avatar || (imgUrl + 'plugin/app/static/images/wxapp/demo/logo.jpg')"></image>  
    </view>
    <view class="inner">
      <view class="title">{{message.member.nickname || '未更新'}}</view>
      <view>
        <text class="subtitle">队长</text>
        <!-- <text wx:if="{{message.member.levelname}}" class='subtitle'>{{message.member.levelname}}</text> -->
      </view>
    </view>
  </view>
<block v-if="message.isbuild == 0">
  <view class="member-group">
    <view class="member-cell">
      <view class="member-cell-inner column">
        <text>请先点击创建团队。</text>
        <text>团队创建后才能获得{{message.set.texts.dividend}}收益。</text>
      </view>
    </view>
  </view>
  <view class="btn block setteam" style="background: #1b1a20; color: #cfa943; border-color: #1b1a20;margin-top: 40rpx" @tap="found">创建团队</view>
</block>
  <block v-else>
  <navigator open-type="navigate" hover-class="none" url="/dividend/pages/order/index" class="member-group">
    <view class="member-cell">
      <view class="member-cell-inner column">{{message.set.texts.dividend}}订单</view>
      <view class="member-cell-remark column"></view>
    </view>
  </navigator>

  <navigator open-type="navigate" hover-class="none" url="/dividend/pages/withdraw/index" class="member-group">
    <view class="member-cell">
      <view class="member-cell-inner column">{{message.set.texts.dividend}}佣金</view>
      <view class="member-cell-remark column"></view>
    </view>
  </navigator>

  <view class="member-group">
    <view class="member-cell">
      <view class="member-cell-inner column">{{message.set.texts.dividend_ok}}({{message.set.texts.yuan}})</view>
      <view class="member-cell-remark noremark column">￥{{message.member.dividend_pay}}</view>
    </view>
    <view class="member-cell">
      <view class="member-cell-inner column">可{{message.set.texts.withdraw}}{{message.set.texts.dividend}}({{message.set.texts.yuan}})</view>
      <view class="member-cell-remark noremark column">￥{{message.member.dividend_ok}}</view>
    </view>
  </view>

  <view class="member-group card">

    <navigator open-type="navigate" hover-class="none" url="/dividend/pages/log/index" class="item">
      <view class="item-icon column">
        <text class="icox icox-tixianmingxi"></text>
      </view>
      <view class="item-inner column">
        <view class="title">{{message.set.texts.withdraw}}明细</view>
        <view class="subtitle">{{ message.member.applycount }}单</view>
      </view>
    </navigator>

    <navigator open-type="navigate" hover-class="none" url="/dividend/pages/down/index" class="item">
      <view class="item-icon column">
        <text class="icox icox-wodetuandui"></text>
      </view>
      <view class="item-inner column">
        <view class="title">一级下线</view>
        <view class="subtitle">{{message.member.groupscount}}个</view>
      </view>
    </navigator>
  </view>
  </block>
</view>
  <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
    <view class="text">{{FoxUIToast.text}}</view>
  </view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var foxui = app.requirejs('/foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      loading: false
    };
  },

  onLoad: function (options) {
    var $this = this;
    $this.setData({
      imgUrl: app.globalData.approot
    });
    $this.getlist();
  },
  components: {},
  props: {},
  methods: {
    getlist: function () {
      var $this = this;
      core.get('dividend', '', function (res) {
        if (res.error == 1) {
          console.error(res.message);
          foxui.toast($this, res.message);
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1000); // return
        }

        $this.setData({
          message: res
        });

        if (!res.member) {
          wx.redirectTo({
            url: '/dividend/pages/register/index'
          });
        } else {
          wx.setNavigationBarTitle({
            title: res.set.texts.center || '分红中心'
          });
        }
      });
    },
    // 创建团队
    found: function () {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.post('dividend/createTeam', '', function (res) {
        if (res.error == 0) {
          $this.setData({
            loading: false
          });
          foxui.toast($this, '创建完成');
          $this.getlist();
        }
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
.column{
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.member-header{
  height: 193rpx;
  background:#1c1b20;
  position: relative; 
  display: flex;
  padding: 0 24rpx;
}
.member-header .img{
  width: 120rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.member-header .img image{
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}

.inner{
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
  padding-left: 24rpx;
}
.inner .title{
  font-weight: bold;
}
.inner .subtitle{
  display: inline-block;
  height: 32rpx;
  font-size: 22rpx;
  color: #cfa943;
  border: 1rpx solid #cfa943;
  border-radius: 16rpx;
  line-height: 32rpx;
  padding: 0 12rpx;
  margin-top: 22rpx;
  margin-right: 20rpx; 
}
.set{
  width: 85rpx;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  color: #fff;
  padding: 22rpx 26rpx 0 0;
  font-size: 36rpx;
  text-align: right;
}

/*邀请码  */
.member-group{
  margin-top: 20rpx;
}
.member-cell{
  height: 108rpx;
  padding: 0 24rpx;
  background: #fff;
  display: flex;
  position: relative;
}
.member-cell::after{
  content: " ";
	position: absolute;
	left: 24rpx;
  right: 24rpx;
	bottom: 0;
	height: 0;
	border-bottom: 1rpx solid #D9D9D9;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.member-cell:last-child:after{
  display: none;
}
.member-cell-inner{
  color: #333;
  font-size: 28rpx;
  flex: 1;
}

.member-cell-remark{
  margin-right: 0;
  position: relative;
  font-size: 40rpx;
  color: #cfa943;
  text-align: right;
}
 .member-cell-remark::before{
  position: absolute;
  content: " ";
	display: inline-block;
	transform: rotate(45deg);
	height: 16rpx;
	width: 16rpx;
	border-width: 1px 1px 0 0;
	border-color: #C8C8CD;
	border-style: solid;
	top: 50%;
  right: 8rpx;
	margin-top: -8rpx;
} 
 .member-cell-remark.noremark::before{
   display: none
 }
.fui-cell-icon text{
  color: #999;
}

.member-group.card{
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.member-group .item{
  display: flex;
  background: #fff;
  width: 50%;
  height: 148rpx;
}
.member-group .item text{
  font-size: 54rpx;
  color: #cfa943;
  margin: 0 36rpx;
}
.member-group .item .item-inner{
  font-size: 28rpx;
  color: #333;
}
.member-group .item .item-inner .subtitle{
  font-size: 24rpx;
  color: #999;
}

.member-group.card::after{
  position: absolute;
  border-top: 1rpx solid #ededed;
  left: 24rpx;
  right: 24rpx;
  top: 50rpx;
  z-index: 2;
}

.member-group.card::before{
  content: " ";
	position: absolute;
	left: 24rpx;
  right: 24rpx;
	top: 50%;
	height: 0;
	border-top: 1rpx solid #D9D9D9;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
  display: none;
}
.member-group.card::after{
  content: " ";
	position: absolute;
	top: 24rpx;
  bottom: 24rpx;
	left: 50%;
	width: 0;
	border-left: 1rpx solid #D9D9D9;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleX(0.5);
}
</style>