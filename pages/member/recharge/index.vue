<template>
<view>
<!--pages/member/recharge/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view :class="'fui-cell-group ' + ( toggleStore?'toggleSend-group':'' )" v-if="acts.length">
        <view class="fui-cell" @tap="toggle" :data-id="toggleStore" data-type="toggleStore">
             <view class="fui-cell-label">
              充值活动
             </view>
            <view class="fui-cell-info" style="text-align: right;color: #666666;font-size: 26rpx;">
                <text class="store"> 充值满 <text class="text-danger">{{ acts[0].enough }}</text> 元立即送 <text class="text-danger">{{ acts[0].give }}</text> 元</text>
            </view>
            <view class="fui-cell-remark"></view>
        </view>
        <view class="send-code" v-if="acts.length>0">
            <view class="fui-cell-group  recharge" style="margin-top: 0;" v-for="(item, index) in acts" :key="index" v-if="index>=0">
                <view class="fui-cell" style="padding-left: 40rpx">
                    <view class="fui-cell-text">充值满
                        <text class="text-danger">{{ item.enough }}</text>元 立即送<text class="text-danger">{{ item.give }}</text>元
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">当前余额</view>
            <view class="fui-cell-info">¥{{ credit }}</view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">充值金额</view>
            <view class="fui-cell-info">
                <input type="digit" class="fui-input" :value="money" @input="money"></input>
            </view>
        </view>
    </view>

    <navigator class="fui-cell-group" hover-class="none" :url="'/pages/public/coupon/index?type=1&money=' + money" v-if="coupon.count>0" open-type="navigate">
        <view class="fui-cell">
            <view class="fui-cell-text">{{ !coupon.name?"请选择优惠券":"已选择优惠券："+coupon.name }}</view>
            <view class="fui-cell-remark">
                <div class="badge">{{ coupon.count }}</div>
            </view>
        </view>
    </navigator>

    

    <view :class="'btn btn-danger mtop block ' + ( disabled?'disabled':'' )" @tap="submit">微信支付</view>
</view>
</view>
</template>

<script>
/**
 *
 * favorite\index.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  Young 2017-01-18
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');

export default {
  data() {
    return {
      disabled: true,
      coupon: {
        count: 0
      }
    };
  },

  onShow: function () {
    var coupon = app.getCache("coupon");
    this.setData({
      "coupon.id": coupon.id,
      "coupon.name": coupon.name || ''
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    app.url(options);
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      core.get('member/recharge', {}, function (json) {
        json.show = true;
        $this.setData(json);
      });
    },
    toggle: function (e) {
      var data = core.pdata(e),
          id = data.id,
          type = data.type,
          d = {};
      id == 0 || typeof id == 'undefined' ? d[type] = 1 : d[type] = 0;
      this.setData(d);
    },
    money: function (e) {
      var disabled = true,
          money = $.trim(e.detail.value),
          $this = this;

      if (money >= this.minimumcharge) {
        disabled = false;
      }

      core.get('sale/coupon/query', {
        type: 1,
        money: money
      }, function (ret) {
        $this.setData({
          money: money,
          disabled: disabled,
          coupon: {
            id: 0,
            name: '',
            count: ret.count
          }
        });
      });
    },
    submit: function () {
      var money = $.toFixed(this.money, 2),
          data = {};

      if (this.disabled) {
        return;
      }

      if (typeof money == 'undefined' || isNaN(money)) {
        core.alert('请填写正确的充值金额!');
        return;
      }

      if (money <= 0 || this.disabled) {
        core.alert('最低充值金额为' + this.minimumcharge + '元!');
        return;
      }

      data.money = money;
      data.type = 'wechat';
      data.couponid = this.coupon.id;
      core.post('member/recharge/submit', data, function (json) {
        if (json.error == 0) {
          if (json.wechat.success) {
            core.pay(json.wechat.payinfo, function (res) {
              if (res.errMsg == "requestPayment:ok") {
                core.post('member/recharge/wechat_complete', {
                  logid: json.logid
                }, function (js) {
                  if (js.error == 0) {
                    wx.navigateBack();
                  } else {
                    core.alert(js.message);
                  }
                }, true);
              }
            });
          } else {
            core.alert(list.wechat.payinfo.message + '\n不能使用微信支付!');
          }
        } else {
          core.alert(json.message);
        }
      }, true);
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
/* pages/member/recharge/index.wxss */
@import "../../../static/css/order.css";
.toggleSend-group .fui-cell-info{
    filter: alpha(opacity=0);
    -moz-opacity: 0;
    -khtml-opacity: 0;
    opacity: 0;
}
.fui-cell-group.recharge{
    padding: 0 0;
}
.fui-cell-group.recharge .fui-cell {
    padding: 0;
    font-size: 24rpx;
    height: 40rpx;
    line-height: 40rpx;
}
.fui-cell-group.recharge .fui-cell .fui-cell-text{
    color: #666;
}
.send-code{
    padding: 24rpx 0;
    position: relative
}
.send-code:before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
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
</style>