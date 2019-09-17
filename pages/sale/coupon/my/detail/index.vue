<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="coupon-detail">
        <view :class="'coupon-detail-head ' + detail.color">
            <view class="coupon-detail-head-title">
                <view class="title">{{ detail.name }}</view>
                <view class="subtitle">有效期: {{ detail.usestr }} {{ detail.merchstr }}</view>
            </view>
            <view class="coupon-detail-head-info">
                <view class="useprice">{{ detail.title2 }}{{ detail.title3 }}</view>
                <view class="receive" @tap="receive">
                    <view class="inner">{{ detail.getstr }}</view>
                </view>
            </view>
            <view class="coupon-detal-bot">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </view>
        </view>
        <view class="coupon-detail-content">
            <view class="coupon-detail-content-info">
                <view class="coupon-detail-content-info-top">
                    <view class="title">拥有数量</view>
                    <view class="text">共 {{ detail.num }} 张</view>
                    <view class="title">领取限制</view>
                </view>
                <view class="coupon-detail-content-info-top">
                    <view class="title">使用说明</view>
                    <view class="text wxParse" v-if="detail.desc!=''">
                        <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
                    </view>
                    <view v-else>无</view>
                </view>
                <view class="coupon-detail-content-info-bot">
                    <view class="title">使用限制</view>
                    <view class="text" v-if="detail.coupontype==2">本优惠卷只能在收银台中使用</view>
                    <view class="text" v-if="detail.limitdiscounttype==1">不允许与促销优惠同时使用</view>
                    <view class="text" v-else-if="detail.limitdiscounttype==2">不允许与会员折扣同时使用</view>
                    <view class="text" v-else-if="detail.limitdiscounttype==3">不允许与促销优惠和会员折扣同时使用</view>
                    <view class="text" v-if="detail.limitgoodtype==1">
                        <view class="text">允许以下商品使用:</view>
                        <view class="text" v-for="(item, index) in detail.limitgoods" :key="index">{{ item.title }} </view>
                    </view>
                    <view class="text" v-if="detail.limitgoodcatetype==1">
                        <view class="text">允许以下商品分类使用:</view>
                        <view class="text" v-for="(item, index) in detail.limitcates" :key="index">{{ item.name }} </view>
                    </view>
                    <view v-if="detail.limitgoodtype=='0'&&detail.limitgoodcatetype=='0'&&detail.limitdiscounttype=='0'&&detail.coupontype!='2'">无</view>
                </view>
            </view>
        </view>
    </view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>

</view>
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
    return {};
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
    getDetail: function () {
      var $this = this;
      core.get('sale/coupon/my/getdetail', {
        id: this.id
      }, function (ret) {
        if (ret.error > 0) {
          wx.navigateBack();
        } else {
          parser.wxParse('wxParseData', 'html', ret.detail.desc, $this, '5');
          $this.setData({
            detail: ret.detail,
            show: true
          });
        }
      });
    },
    receive: function (e) {
      var detail = this.detail,
          url;

      if (detail.coupontype == 0) {
        wx.switchTab({
          url: '/pages/index/index'
        });
        return;
      } else if (detail.coupontype == 1) {
        url = "/pages/member/recharge/index";
      } else if (detail.coupontype == 2) {
        url = "/pages/sale/coupon/my/index";
      }

      wx.redirectTo({
        url: url
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
@import "../../../../../static/css/coupon_detail.css";
</style>