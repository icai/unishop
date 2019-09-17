<template>
<view :class="'page header ' + ( type<2?'footer':'' )">
    <view class="fui-header">
        <view class="searchbar">
            <icon type="search" size="18"></icon>
            <input name="search" @focus="bindSearch" placeholder="输入关键字进行搜索" @input="search"></input>
        </view>
    </view>
    <view class="coupon-group" v-if="!loading && list.length>0">
          <!-- <view class="coupon-item" wx:for="{{ list }}"> 
             <i class="coupon-dot-top"></i>
            <i class="coupon-dot-bot"></i>
            <view class="thumb">
                <image src="{{ item.thumb }}"/>
            </view>
            <view class="inner">
                <view class="title">{{ item.couponname }}</view>
                <view class="text">{{ item.backstr }}{{ item.backpre?"￥":"" }}<text class="big">{{ item.backmoney }}</text></view>
            </view>
            <view class="right" bindtap="bindBtn" data-id="{{ item.id }}" data-name="{{ item.couponname }}">
                <text wx:if="{{ type<2 }}">立即使用</text>
                <text wx:else>立即领取</text>
            </view> 
          </view>  -->
              <view :class="'coupon-item ' + item.color" v-for="(item, index) in list" :key="index">
              <view class="coupon-dots">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
              </view>
              <view class="coupon-left">
                <view class="single"><span class="subtitle">{{ item.backpre?"￥":"" }}</span>{{ item.backmoney }}<span class="subtitle"></span></view>
              </view>
              <view class="coupon-right">
                <view class="title">{{ item.couponname }}</view>
                <view class="usetime">
                  <view class="text">有效期:{{ item.timestr }}</view>
                </view>
              </view>
              <view class="coupon-after" @tap="bindBtn" :data-id="item.id" :data-name="item.couponname">
                <view class="coupon-btn ling" v-if="type<2">立即使用</view>
                <view class="coupon-btn ling" v-else>立即领取</view>
              </view>
            </view>    
    </view>
    <view class="fui-loading" v-if="loading">
        <view class="icon"></view>
        <view class="text">正在加载</view>
    </view>
    <view class="fui-loading empty" v-if="list.length<1 && !loading">
        <view class="text">没有数据</view>
    </view>

    <view class="fui-footer text-center" @tap="bindBtn" v-if="type<2" data-id="0">
        <view class="tool nopadding">
            <view class="text text-center">不使用优惠券</view>
        </view>
    </view>

</view>
</template>

<script>
/**
 *
 * plugin/coupon/index.js
 *
 * @create 2017-1-19
 * @author 晚秋
 *
 * @update  晚秋 2017-01-19
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');

export default {
  data() {
    return {
      type: 0,
      merchs: [],
      goodslist: [],
      goodsid: 0,
      money: 0,
      list: [],
      loading: true
    };
  },

  onLoad: function (options) {
    if (!Number(options.type)) {
      var goodsinfo = app.getCache('goodsInfo');
      this.setData({
        goodslist: goodsinfo.goodslist,
        merchs: goodsinfo.merchs
      });
    } else {
      this.setData({
        money: options.money
      });
    }

    this.setData({
      type: options.type
    });
    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this,
          data = this;

      for (var i = 0; i < data.goodslist.length; i++) {
        delete data.goodslist[i]['title'];
        delete data.goodslist[i]['optiontitle'];
        delete data.goodslist[i]['thumb'];
      }

      if (data.type < 2) {
        // 充值、购物
        core.get('sale/coupon/query', {
          type: data.type,
          money: data.money,
          goods: data.goodslist,
          merchs: data.merchs
        }, function (result) {
          $this.setData({
            list: result.list,
            loading: false
          });
        });
      } else {// 商品详情显示
      }
    },
    search: function (e) {
      var val = e.detail.value,
          old_list = this.old_list,
          list = this.list,
          new_list = [];

      if ($.isEmptyObject(old_list)) {
        old_list = list;
      }

      if (!$.isEmptyObject(old_list)) {
        $.each(old_list, function (index, item) {
          if (item.couponname.indexOf(val) != -1) {
            new_list.push(item);
          }
        });
      }

      this.setData({
        list: new_list,
        old_list: old_list
      });
    },
    bindBtn: function (e) {
      var $this = this,
          data = this,
          dataset = e.currentTarget.dataset;

      if (data.type < 2) {
        app.setCache("coupon", dataset, 20);
        wx.navigateBack();
      } else {// 商品详情 (请求领取)
      }
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
page {
    background: #f9f9f9;
}

.fui-header {
    background: #fff;
    z-index: 99;
    display: flex;
    padding: 0 15rpx;
}
.fui-header .searchbar {
    flex: 1;
    background: #efefef;
    border-radius: 8rpx;
    margin-right: 15rpx;
    display: flex;
    overflow: hidden;
    align-items:center;
}
.fui-header .searchbar icon {
    height: 36rpx;
    margin: 0 10rpx;
    vertical-align: middle;
}
.fui-header .searchbar input {
    border-radius: 8rpx;
    padding-right: 10rpx;
    width: 100%;
    font-size: 30rpx;
    background:transparent;
    color: #444;
    height: 60rpx;
    line-height:60rpx;
    border: none;
}
.fui-header .search-btn {
    color: #666;
}

.coupon-group {
    padding: 20rpx;
}
/* 
 .coupon-group .coupon-item {
    background: #fff;
    border-radius: 15rpx;
    display: flex;
    position: relative;
    margin-bottom: 20rpx;
}
.coupon-group .coupon-item .coupon-dot-top,
.coupon-group .coupon-item .coupon-dot-bot {
    height: 20rpx;
    width: 20rpx;
    border-radius: 20rpx;
    background: #fafafa;
    position: absolute;
    right: 80rpx;
    z-index: 2;
}

.coupon-group .coupon-item .coupon-dot-top {
    top: -10rpx;
}
.coupon-group .coupon-item .coupon-dot-bot {
    bottom: -10rpx;
}

.coupon-group .coupon-item .thumb {
    border: 1rpx solid #e6e6e6;
    margin: 20rpx;
}
.coupon-group .coupon-item .inner {
    flex: 1;
    padding: 20rpx 20rpx 20rpx 0;
}
.coupon-group .coupon-item .inner .title {
    position: relative;
    font-size: 30rpx;
    color: #444;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 50rpx;
    line-height: 50rpx;
}
.coupon-group .coupon-item .inner .text {
    position: relative;
    font-size: 26rpx;
    color: #666;
    height: 50rpx;
    line-height: 50rpx;
    color: #ff6c00;
}
.coupon-group .coupon-item .inner .text .big {
    font-size: 40rpx;
}
.coupon-group .coupon-item .right {
    width: 90rpx;
    position: relative;
    display: flex;
    align-items: center;
}
.coupon-group .coupon-item .right:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-left: 1px dashed #eeeeee;
    z-index: 1;
}
.coupon-group .coupon-item .right text {
    width: 40rpx;
    margin: auto;
    font-size: 26rpx;
    display: block;
    line-height: 28rpx;
    color: #666;
    text-align: center;
}

.btn{
    padding: 0 30rpx;
    border-radius: 0;
    height: 100rpx;
    line-height: 100rpx;
    margin: 0;
}  */
 .coupon-list {
    height: auto;
    padding: 0 20rpx 20rpx 20rpx;
    overflow: hidden;
}
.coupon-item {
    margin-top: 20rpx;
    background: #ffffff;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    overflow: hidden;
    height:140rpx;
}
.coupon-dots {
    height: inherit;
    width: 16rpx;
    position: absolute;
    top: 0;
    left: -10rpx;
    z-index: 10;
}
.coupon-dots i {
    height:16rpx;
    width: 16rpx;
    border-radius:16rpx;
    background: #f5f5f5;
    display: block;
}
.coupon-dots:before, .coupon-dots:after{
    content: "";
    height:20rpx;
    width:20rpx;
    background: #f5f5f5;
    border-radius:20rpx;
    position: absolute;
    left: 210rpx;
}
.coupon-dots:before{
    top: -10rpx;
}
.coupon-dots:after {
    bottom: -10rpx;
}
.coupon-item .coupon-left{
    height: inherit;
    width: 210rpx;
    background: #55b5ff;
    color: #fff;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
    -ms-justify-content: center;
    -moz-justify-content: center;
}
.coupon-item .coupon-left .single{
    font-size: 60rpx;
}
.coupon-item .coupon-left .subtitle{
    font-size: 24rpx;
}
.coupon-item .coupon-right{
    padding: 20rpx;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.coupon-item .coupon-right .title{
    font-size: 0.8rem;
    height: 48rpx;
    color: #1a1a1a;
    overflow: hidden;
}
.coupon-item .coupon-right .usetime {
    line-height: 56rpx;
    font-size: 24rpx;
    color: #999;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
.coupon-item .coupon-right .usetime .text {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.coupon-item .coupon-after {
    width:160rpx;
    padding-right: 20rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
    -ms-justify-content: center;
    -moz-justify-content: center;
}
.coupon-item .coupon-after .coupon-btn {
    width:140rpx;
    height: 60rpx;
    line-height: 60rpx;
    border: 1px solid #55b5ff;
    border-radius: 60rpx;
    color: #55b5ff;
    text-align: center;
    font-size:24rpx;
}
.coupon-item.pink .coupon-left, .coupon-item.pink .coupon-type{
  background: #fd72d4;
}
.coupon-item.pink .coupon-after .coupon-btn{
  border-color: #fd72d4;
  color: #fd72d4;
}
.coupon-item.red .coupon-left, .coupon-item.red .coupon-type {
    background: #fd5554;
}
.coupon-item.red .coupon-after .coupon-btn {
    border-color: #fd5554;
    color: #fd5554;
}
.coupon-item.org .coupon-left,.coupon-item.red .coupon-type {
    background: #ff913f;
}
.coupon-item.org .coupon-after .coupon-btn {
    border-color: #ff913f;
    color: #ff913f;
}
</style>