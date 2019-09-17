<template>
<view>
<!--pages/commission/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="page commission" v-if="show">
    <!--用户信息-->
    <view class="user-info">
        <view class="fui-list">
            <view class="fui-list-media">
                <image :src="member['avatar']"></image>
            </view>
            <view class="fui-list-inner">
                <view class="title">{{ member['nickname'] }}</view>
                <view class="text">{{ set['texts']['up'] }}：{{ agentname }}</view>
                <view class="subtitle">{{ levelname }}</view>
            </view>
        </view>
    </view>
    <view class="fui-cell-group" v-if="set['hideicode'] == 0">
        <view class="fui-cell">
            <view class="fui-cell-icon">
                <text class="icox icox-yaoqingma" style="color: #feb312;"></text>
            </view>
            <view class="fui-cell-text">我的{{ set['texts']['icode'] }}：{{ member['id'] }}</view>
        </view>
    </view>
    <!--佣金信息-->
    <view class="userblock">
        <view class="line total">
            <view class="num">{{ member['commission_pay'] }}</view>
            <view class="title">{{ set['texts']['commission_pay'] }}({{ set['texts']['yuan'] }})</view>
        </view>
        <view class="line able">
            <view class="text">
                <view class="num">{{ member['commission_ok'] }}</view>
                <view class="title">{{ set['texts']['commission_ok'] }}({{ set['texts']['yuan'] }})</view>
            </view>
            <navigator hover-class="none" :url="(member['commission_ok']==0?'':'./withdraw/index')" open-type="navigate" :class="'btn btn-warning pull-right ' + ( member['commission_ok']==0?' disabled':'' )">{{ set['texts']['commission'] }}{{ set['texts']['withdraw'] }}</navigator>
        </view>
    </view>
    <!--方块按钮组-->
    <view class="fui-block-group">
        <navigator class="fui-block-child" url="./withdraw/index">
            <view class="icon" style="color: #ff4357;">

                <i class="icox icox-qian"></i>
            </view>
            <view class="text">
                <view class="title">{{ set['texts']['commission1'] }}</view>
                <text>{{ member['commission_total'] }}</text>
                {{ set['texts']['yuan'] }}
            </view>
        </navigator>
        <navigator class="fui-block-child" url="./order/index">
            <view class="icon" style="color: #9ec9f4;">
                <i class="icox icox-dingdan2"></i>
            </view>
            <view class="text">
                <view class="title">{{ set['texts']['order'] }}</view>
                <text>{{ member['ordercount0'] }}</text>
                笔
            </view>
        </navigator>
        <navigator class="fui-block-child" url="./log/index">
            <view class="icon" style="color: #ffbe2e;">
                <i class="icox icox-tixian1"></i>
            </view>
            <view class="text">
                <view class="title">{{ set['texts']['commission_detail'] }}</view>
                <text>{{ member['applycount'] }}</text>
                笔
            </view>
        </navigator>
        <navigator class="fui-block-child" url="./down/index">
            <view class="icon" style="color: #ff6e02;">
                <i class="icox icox-heilongjiangtubiao11"></i>
            </view>
            <view class="text">
                <view class="title">{{ set['texts']['mydown'] }}</view>
                <text>{{ member['downcount'] }}</text>
                人
            </view>
        </navigator>

    </view>

    <navigator class="fui-cell-group" url="/dividend/pages/index/index" v-if="set.commissionshow ==1">
        <view class="fui-cell">
            <view class="fui-cell-icon">
                <text :class="'icox ' + (set.postercount>0? 'icox-zhuyi': 'icox-erweima1')" style="color: #feb312;"></text>
            </view>
            <view class="fui-cell-text">分红中心</view>
            <view class="fui-cell-remark" style="font-size: 20rpx;"></view>
        </view>
    </navigator>

    <navigator class="fui-cell-group" v-if="set.closed_qrcode==0 || set.postercount>0" :url="(set.postercount>0? './poster/index': './qrcode/index' )">
        <view class="fui-cell">
            <view class="fui-cell-icon">
                <text :class="'icox ' + (set.postercount>0? 'icox-zhuyi': 'icox-erweima1')" style="color: #feb312;"></text>
            </view>
            <view class="fui-cell-text">{{set.postercount>0? '邀请您的好友': '推广二维码'}}</view>
            <view class="fui-cell-remark" style="font-size: 20rpx;"></view>
        </view>
    </navigator>

</view>
</view>
</template>

<script>
/**
 *
 * commission/index.js
 *
 * @create 2017-2-6
 * @author Young
 *
 * @update  Young 2017-2-6
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {};
  },

  onShow: function () {
    this.getData();
  },
  onLoad: function (options) {//页面初始化 options为页面跳转所带来的参数
  },
  components: {},
  props: {},
  methods: {
    getData: function () {
      var $this = this;
      core.get('commission/index', {}, function (json) {
        if (json.error == 70000) {
          wx.redirectTo({
            url: '/commission/pages/register/index'
          });
          return;
        }

        json.show = true;
        $this.setData(json);
        wx.setNavigationBarTitle({
          title: json.set.texts.center
        });
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
/* pages/commission/index.wxss */
/*@import "../../static/css/order.css";*/
/*用户信息*/
.commission .user-info{
    width: 100%;
    border-bottom:1px solid #fea23d;
    background:#fea23d;
    padding: 8rpx 0
}
.commission .user-info image{
    border-radius: 50%;
    width:120rpx;
    height:120rpx;

}
.commission .fui-list-media {
    margin-right: 28rpx
}
.commission .user-info .title{
    color: #fff;
    font-size: 28rpx;
    line-height:40rpx;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.commission .user-info .subtitle{
    color: #fff;
    font-size: 22rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: auto;
    display: inline-block;
    border: 1rpx solid #fff;
    border-radius: 34rpx;
    line-height: 32rpx;
    max-width: 100%;
    padding: 0 12rpx;
    box-sizing: border-box;
    height:36rpx;
}
.commission .user-info .text{
    color: #fff;
    font-size: 22rpx;
    line-height: 40rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
/*分销佣金*/
.commission .userblock{
    margin-top: 20rpx;
}
.commission .userblock .line{
    padding: 15rpx 0 15rpx 0 
}
.commission .userblock .line.total{
    height: 166rpx;
    background: #fff;
    padding: 32rpx 24rpx;
    box-sizing: border-box;
}
.commission .userblock .line.total .title {
    color: #000;
    font-size: 24rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.commission .userblock .line.total .num{
    font-size: 40rpx;
    color: #ff8000;
    line-height: 1.5
}
.commission .userblock .line.able{
    font-size: 27rpx;
    height: 166rpx;
    background: #fff;
    padding: 0 24rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
}
.commission .userblock .line.able .num{
    font-size: 40rpx;
    color: #ff8000;
    line-height: 1.5
}
.commission .userblock .line .text{
    padding-right: 230rpx
}
.commission .userblock .line .btn{
    width: auto;
    padding: 0 24rpx;
    border: 1px solid #fff;
    border-radius: 56rpx;
    height: 56rpx;
    line-height: 54rpx;
    margin-right: 0;
    font-size: 26rpx;
}
.commission .userblock .line.able:after {
    content: " ";
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    top: -1px;
    height: 1px;
    border-top: 1px solid #ebebeb;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
/*分销列表*/
.commission .fui-block-group{
}
.commission .fui-block-group:after {
    content: " ";
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    top: 50%;
    height: 1px;
    border-top: 1px solid #ebebeb;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
.commission .fui-block-group:before {
    content: " ";
    position: absolute;
    top: 20rpx;
    bottom: 20rpx;
    left: 50%;
    width: 1px;
    border-left: 1px solid #ebebeb;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleX(0.5);
    -ms-transform: scaleX(0.5);
    transform: scaleX(0.5);
    z-index: 2;
}
.commission .fui-block-group .fui-block-child {
    width: 50%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    padding-left: 24rpx;
    height: 148rpx;
    box-sizing: border-box
}
.fui-block-group .fui-block-child::after {
    display: none
}
.fui-block-group .fui-block-child::before {
    display: none
}
.commission .fui-block-group .fui-block-child .icon{
    height: auto;
    padding: 0
}
.fui-block-group .fui-block-child .icon i {
    font-size: 52rpx;
}
.commission .fui-block-group .fui-block-child .icon wx-image{
    width: 70rpx;
    height: 70rpx;
}
.commission .fui-block-group .fui-block-child .text {
    height: auto;
    line-height: 1.5;
    margin-left: 24rpx;
    font-size: 24rpx;
    color: #999;
    text-align: left;
}
.commission .fui-block-group .fui-block-child .title {
    height: auto;
    line-height: normal;
    font-size: 28rpx;
    color: #000;
    text-align: left;
}
.commission .fui-block-group .fui-block-child .text wx-text {
    color: #999
}
.edtion{
    width: 100%;
    position: fixed;
    bottom:100rpx;
    color: #999999;
    font-size: 14px;
    text-align: center;
    padding: 20rpx 0;
   
}
</style>