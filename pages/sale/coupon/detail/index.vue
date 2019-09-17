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
                    <view class="inner">{{ buying?'操作中...':detail.getstr }}</view>
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
                    <block v-if="detail.money>0 || detail.credit>0">
                        <view class="title">购买价格</view>
                        <view class="text">{{ detail.money }}元{{ detail.money>0&&detail.credit>0?'+':'' }}{{ detail.credit }}积分</view>
                    </block>
                    <view class="title">领取限制</view>
                    <view class="text" v-if="detail.islimitlevel==1">
                        <view>用户必须达到以下条件之一:</view>
                        <view class="text" v-if="detail.limitmemberlevels">{{ detail.limitmemberlevels }}</view>
                        <view class="text" v-if="detail.limitagentlevels">{{ detail.limitagentlevels }}</view>
                        <view class="text" v-if="detail.limitpartnerlevels">{{ detail.limitpartnerlevels }}</view>
                        <view class="text" v-if="detail.limitaagentlevels">{{ detail.limitaagentlevels }}</view>
                    </view>
                    <view class="text" v-else>无</view>
                    <view class="title">有效期限</view>
                    <view class="text" style="font-weight: bold; color:#000;">	{{ detail.usestr }} {{ detail.merchstr }}</view>
                </view>
                <view class="coupon-detail-content-info-top">
                    <view class="title">使用说明</view>
                    <view class="text wxParse" v-if="detail.desc!=''">
                        <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
                    </view>
                    <view class="text" v-else>无</view>
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
 * coupon\index\index.js
 *
 * @create 2017-02-04
 * @author 晚秋
 *
 * @update  晚秋 2017-02-06
 *
 */
var app = getApp();
var core = app.requirejs('core');
var fui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      id: 0,
      detail: {}
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
    getDetail: function () {
      var $this = this;
      core.get('sale/coupon/getdetail', {
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
          $this = this;

      if (this.buying) {
        fui.toast($this, "正在执行请稍后");
        return;
      }

      if (detail.canget != 1) {
        fui.toast($this, detail.getstr);
        return;
      }

      var text = "确认使用";

      if (detail.money > 0) {
        text += detail.money + "元";

        if (detail.credit > 0) {
          text += "+";
        }
      }

      if (detail.credit > 0) {
        text += detail.credit + "积分";
      }

      text += detail.gettypestr + "吗？";
      core.confirm(text, function () {
        $this.setData({
          buying: true
        });
        core.post('sale/coupon/pay', {
          id: $this.data.id
        }, function (ret) {
          if (ret.error > 0) {
            fui.toast($this, ret.message);
            $this.setData({
              buying: false
            });
            return;
          }

          $this.setData({
            logid: ret.logid
          });

          if (ret.wechat && ret.wechat.success) {
            core.pay(ret.wechat.payinfo, function (res) {
              if (res.errMsg == "requestPayment:ok") {
                $this.payResult();
              }
            });
          } else {
            $this.payResult();
          }

          $this.setData({
            buying: false
          });
        });
      });
    },
    payResult: function () {
      var $this = this,
          text,
          url;
      core.get('sale/coupon/payresult', {
        logid: this.logid
      }, function (ret) {
        if (ret.error > 0) {
          fui.toast($this, ret.message);
          return;
        }

        if (ret.coupontype == 0) {
          wx.redirectTo({
            url: "/pages/sale/coupon/my/showcoupons2/index?id=" + ret.dataid
          });
          return;
        }

        var url = "/pages/sale/coupon/my/index/index";

        if (ret.coupontype == 1) {
          url = "/pages/member/recharge/index";
        }

        core.confirm(ret.confirm_text, function () {
          wx.redirectTo({
            url: url
          });
        }, function () {
          wx.redirectTo({
            url: "/pages/sale/coupon/my/index/index"
          });
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
@import "../../../../static/css/coupon_detail.css";
</style>