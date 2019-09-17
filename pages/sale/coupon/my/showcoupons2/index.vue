<template>
<view class="page">
  <view class="coupon-headblock">
    <view class="top-layer"></view>
    <view class="line-layer"></view>
    <view class="bottom-layer"></view>
    <view class="gold" :style="'background-image: url('' + approot + 'template/mobile/default/static/images/gold.png')'"></view>
    <view class="link-text">请至【
      <navigator class="inline" hover-class="none" url="/pages/sale/coupon/my/index/index" open-type="redirect">我的优惠券</navigator>】查看</view>
    <view class="paper">
      <view class="title">恭喜获得</view>
      <view class="text">
        <i class="d1"></i>
        <i class="d2"></i>
        <p class="t1">{{ detail.couponname }}</p>
      </view>
      <i class="line"></i>
      <i class="dot-top"></i>
      <i class="dot-left"></i>
      <i class="dot-right"></i>
      <i class="dot-1"></i>
      <i class="dot-2"></i>
      <i class="dot-3"></i>
      <i class="dot-4"></i>
      <i class="dot-5"></i>
      <i class="dot-6"></i>
    </view>
  </view>

  <view class="coupon-groupblock">
    <view class="group-top">
      <view class="inner">
        <view class="left" v-if="detail.backtype==0">
          <span>￥</span>{{ detail.deduct }}</view>
        <view class="left" v-else>{{ detail.title1 }}</view>
        <view class="right">
          <view class="title">优惠券</view>
          <view class="subtitle">{{ detail.title2 }}</view>
        </view>
      </view>
    </view>
    <scroll-view class="coupon-items" scroll-x="true">
      <view class="container1">
        <navigator class="item" hover-class="none" :url="'/pages/goods/detail/index?id=' + item.id" v-for="(item, index) in goods" :key="index" open-type="redirect">
          <view class="image">
            <image :src="item.thumb"></image>
          </view>
          <view class="title">{{ item.title }}</view>
          <view class="price">
            <view class="product">¥{{ item.minprice }}</view>
            <view class="market">¥{{ item.couponprice }}
              <span>用劵价</span>
            </view>
          </view>
        </navigator>
        <navigator class="item" hover-class="none" :url="'/pages/goods/index/index?id=' + detail.id" open-type="redirect">
          <view class="more">查看更多>></view>
        </navigator>
      </view>
    </scroll-view>
  </view>

  <navigator class="btn btn-danger block" hover-class="none" url="/pages/sale/coupon/index/index" open-type="redirect" style="margin: 0 20rpx 20rpx;">继续领取优惠券</navigator>

  <navigator class="btn btn-default block" hover-class="none" url="/pages/sale/coupon/my/index/index" open-type="redirect" style="margin: 0 20rpx 20rpx;">查看我的优惠券</navigator>
</view>
</template>

<script>
/**
 *
 * coupon\my\index\index.js
 *
 * @create 2017-02-07
 * @author 晚秋
 *
 * @update  晚秋 2017-02-07
 *
 */
var app = getApp();
var core = app.requirejs('core');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      approot: app.globalData.approot
    };
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getDetail();
  },
  components: {},
  props: {},
  methods: {
    getDetail: function (e) {
      var $this = this;
      core.get('sale/coupon/my/showcoupon2', {
        id: this.id
      }, function (ret) {
        if (ret.error > 0) {
          wx.redirectTo({
            url: '/pages/sale/coupon/my/index/index'
          });
        } else {
          parser.wxParse('wxParseData', 'html', ret.detail.desc, $this, '5');
          $this.setData({
            detail: ret.detail,
            goods: ret.goods,
            show: true
          });
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
.coupon-headblock {
    position: relative;
    height: 480rpx;
    background: #fe5d5c;
    overflow: hidden;
}
.coupon-headblock .line-layer {
    width: 0;
    height: 110rpx;
    border-left: 800rpx solid #ffcf6f;
    border-right: 800rpx solid #ffcf6f;
    border-top: 100rpx solid transparent;
    position: absolute;
    left: 50%;
    margin-left: -800rpx;
    bottom: 0;
    z-index: 3;
}
.coupon-headblock .bottom-layer {
    width: 0;
    height: 110rpx;
    border-left: 800rpx solid #fe5d5c;
    border-right: 800rpx solid #fe5d5c;
    border-top: 100rpx solid transparent;
    position: absolute;
    left: 50%;
    margin-left: -800rpx;
    bottom: -10rpx;
    z-index: 4;
}
.coupon-headblock .top-layer {
    width: 0;
    height: 200rpx;
    border-left: 800rpx solid #f74a4a;
    border-right: 800rpx solid #f74a4a;
    border-bottom: 100rpx solid transparent;
    position: absolute;
    left: 50%;
    margin-left: -800rpx;
    top: 0;
    z-index: 1;
}
.coupon-headblock .gold {
    height: 100rpx;
    width: 100rpx;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    position: absolute;
    left: 50%;
    margin-left: -48rpx;
    bottom: 50rpx;
    z-index: 5;
}
.coupon-headblock .paper {
    height:320rpx;
    width:360rpx;
    background: #fff;
    position: absolute;
    top:80rpx;
    left: 50%;
    margin-left: -180rpx;
    z-index: 2;
}
.coupon-headblock .paper .line {
    height: 0;
    position: absolute;
    top:120rpx;
    left: 20rpx;
    right: 20rpx;
    border-bottom: 1px dashed #d5d5d5;
}
.coupon-headblock .paper .dot-1,
.coupon-headblock .paper .dot-2,
.coupon-headblock .paper .dot-3,
.coupon-headblock .paper .dot-4,
.coupon-headblock .paper .dot-5,
.coupon-headblock .paper .dot-6 {
    height: 24rpx;
    width: 24rpx;
    border-radius: 24rpx;
    background: #f74a4a;
    position: absolute;
    top: -14rpx;
    left: 12rpx;
}
.coupon-headblock .paper .dot-2 {
    left: 48rpx;
}
.coupon-headblock .paper .dot-3 {
    left: 84rpx;
}
.coupon-headblock .paper .dot-4 {
    left: auto;
    right: 84rpx;
}
.coupon-headblock .paper .dot-5 {
    left: auto;
    right: 48rpx;
}
.coupon-headblock .paper .dot-6 {
    left: auto;
    right: 12rpx;
}
.coupon-headblock .paper .dot-top {
    height:80rpx;
    width:80rpx;
    border-radius:80rpx;
    position: absolute;
    top: -60rpx;
    left: 50%;
    margin-left: -40rpx;
    background: #f74a4a;
}
.coupon-headblock .paper .dot-left,
.coupon-headblock .paper .dot-right {
    height: 28rpx;
    width: 28rpx;
    border-radius: 28rpx;
    background: #f74a4a;
    position: absolute;
    top: 108rpx;
    left: -14rpx;
}
.coupon-headblock .paper .dot-right {
    left: auto;
    right: -14rpx;
}
.coupon-headblock .paper .title {
    line-height: 144rpx;
    text-align: center;
    display: block;
    font-size: 48rpx;
    color: #f74a4a;
}
.coupon-headblock .paper .text {
    height:160rpx;
    left: 20rpx;
    right: 20rpx;
    top: 142rpx;
    position: absolute;
    border: 1px solid #fad64f;
    text-align: center;
    display: block;
}
.coupon-headblock .paper .text .t1 {
    font-size: 36rpx;
    color: #eb3d3f;
    line-height: 58rpx;
    padding-top: 16rpx;
}
.coupon-headblock .paper .text .t1 span {
    font-size: 56rpx;
}
.coupon-headblock .paper .text .d1 {
    height: 28rpx;
    width: 28rpx;
    border-radius: 28rpx;
    border-style: solid;
    border-color: #fad64f transparent transparent transparent;
    border-width: 1px;
    background: #fff;
    position: absolute;
    top: -16rpx;
    left: -16rpx;
    transform:rotate(135deg);
}
.coupon-headblock .paper .text .d2 {
    height: 28rpx;
    width: 28rpx;
    border-radius: 28rpx;
    border-style: solid;
    border-color: #fad64f transparent transparent transparent;
    border-width: 1px;
    background: #fff;
    position: absolute;
    top: -16rpx;
    right: -16rpx;
    transform:rotate(-135deg);
}
.coupon-headblock .link-text {
    position: absolute;
    bottom: 158rpx;
    left: 50%;
    z-index: 6;
    width:360rpx;
    text-align: center;
    font-size: 28rpx;
    line-height:40rpx;
    color: #e47c48;
    margin-left: -180rpx;
}
.coupon-headblock .link-text a {
    color: #e47c48;
}
.coupon-groupblock {
    height: auto;
    overflow: hidden;
    margin: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    border: 1.5px solid #dcdcdc;
    padding: 20rpx;
}
.coupon-groupblock .group-top {
    border-bottom: 1px dashed #d5d5d5;
    height: auto;
    overflow: hidden;
    padding-bottom: 20rpx;
}
.coupon-groupblock .group-top .inner {
    background: #f74a4a;
    float: left;
    color: #fff;
    padding: 0 8rpx;
    border-radius: 8rpx;
}
.coupon-groupblock .group-top .inner.blue {
    background: #42b5ff;
}
.coupon-groupblock .group-top .inner.pink {
    background: #f4558f;
}
.coupon-groupblock .group-top .inner.orange {
    background: #ff6c00;
}
.coupon-groupblock .group-top .inner.default {
    background: #bcbcbc;
}
.coupon-groupblock .group-top .inner .left {
    font-size: 56rpx;
    float: left;
}
.coupon-groupblock .group-top .inner .left span {
    font-size: 24rpx;
}
.coupon-groupblock .group-top .inner .right {
    float: left;
    padding-left: 12rpx;
    text-align: center;
}
.coupon-groupblock .group-top .inner .right .title {
    font-size: 32rpx;
    position: relative;
}
.coupon-groupblock .group-top .inner .right .title:before {
    content: "";
    position: absolute;
    height: 0;
    width: 100%;
    border-bottom: 1px solid #fff;
    left: 0;
    bottom: 2rpx;
}
.coupon-groupblock .group-top .inner .right .subtitle {
    font-size: 20rpx;
}
.coupon-groupblock .coupon-items {
    height:360rpx;
    background: #fff;
    overflow-y: hidden;
    overflow-x: auto;
    white-space: normal;
    position: relative;
    margin-top: 20rpx;
}
.coupon-groupblock .coupon-items .container1{
    z-index: -1;
    height: 376rpx;
    overflow: auto;
    white-space:nowrap;
}
.coupon-groupblock .coupon-items .item {
    height:360rpx;
    width:240rpx;
    overflow: hidden;
    text-decoration: none;
    color:#333;
    display: inline-block;
    font-size: 24rpx;
    margin-right: 8rpx;
    vertical-align:top;
}
.coupon-groupblock .coupon-items .item .image {
    height:240rpx;
    width:240rpx;
}
.coupon-groupblock .coupon-items .item .image image {
    height: 100%;
    width: 100%;
    border-radius: 8rpx;
    display: block;
}
.coupon-groupblock .coupon-items .item .title {
    height:40rpx;
    width:240rpx;
}
.coupon-groupblock .coupon-items .item .price .product {
    text-decoration: line-through;
    color: #999;
}
.coupon-groupblock .coupon-items .item .price .market {
    height: 28rpx;
    font-size: 28rpx;
    color: #fd5454;
    line-height: 28rpx;
}
.coupon-groupblock .coupon-items .item .price .market span {
    background: #fd5454;
    color: #fff;
    font-size: 22rpx;
    padding: 0 4rpx;
    border-radius: 4rpx;
    height:40rpx;
}
.coupon-groupblock .coupon-items .item .more {
    line-height:240rpx;
    background: #F4F4F4;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    border-radius: 8rpx;
}

</style>