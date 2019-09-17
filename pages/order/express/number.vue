<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="fui-cell-group">
        <view class="fui-cell">
            填写快递单号
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">快递公司</view>
            <view class="fui-cell-info">
              <picker @change="inputPrickChange" :value="index" :range="express_list" range-key="name">
                  {{ express_list[index].name || '其他快递' }}
              </picker>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">快递单号</view>
            <view class="fui-cell-info">
                <input type="text" class="fui-input" placeholder="请输入快递单号" :value="express_number" @input="inputChange" data-type="express_number"></input>
            </view>
        </view>
    </view>

    <view class="fui-footer text-right">
       <block>
           <view class="btn btn-danger-o btn-sm btn-submit" :data-refund="options.refundid" @tap="submit">提交快递单号</view>
           <view class="btn btn-default-o btn-sm btn-default-o back" @tap="back">返回</view>
       </block>
    </view>
    
    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</view>
</template>

<script>
/**
 *
 * order/express/number.js
 *
 * @create 2018-5-7
 * @author Liugt
 *
 *
 */
var app = getApp(),
    core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      express: '',
      expresscom: '',
      express_number: ''
    };
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options
    });
    app.url(options);
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;

      if (typeof $this.data.options.singlerefund == 'undefined') {
        core.get('order/express_number', $this.data.options, function (list) {
          if (list.error == 0) {
            list.show = true;
            $this.setData(list);
          } else {
            core.toast(list.message, 'loading');
          }
        });
      } else {
        core.get('order/single_express_number', $this.data.options, function (list) {
          if (list.error == 0) {
            list.show = true;
            $this.setData(list);
          } else {
            core.toast(list.message, 'loading');
          }
        });
      }
    },
    inputPrickChange: function (e) {
      var $this = this;
      var express_list = $this.data.express_list;
      var index = e.detail.value;
      var expresscom = express_list[index].name;
      var express = express_list[index].express;
      $this.setData({
        expresscom: expresscom,
        express: express,
        index: index
      });
    },
    inputChange: function (e) {
      var express_number = e.detail.value;
      this.setData({
        express_number: express_number
      });
    },
    back: function () {
      wx.navigateBack();
    },
    submit: function (e) {
      var $this = this;
      var refundid = e.currentTarget.dataset.refund;
      var express_number = $this.data.express_number;
      var refundid = $this.data.options.refundid;
      var orderid = $this.data.options.id;

      if (express_number == "") {
        foxui.toast($this, "请填写快递单号");
        return;
      }

      var express = $this.data.express;
      var expresscom = $this.data.expresscom;

      if (typeof $this.data.options.singlerefund == 'undefined') {
        core.get('order/express_number', {
          submit: 1,
          refundid: refundid,
          orderid: orderid,
          express_number: express_number,
          express: express,
          expresscom: expresscom
        }, function (result) {
          if (result.error == 0) {
            wx.navigateTo({
              url: '/pages/order/detail/index?id=' + orderid
            });
          }
        });
      } else {
        core.get('order/single_express_number', {
          submit: 1,
          refundid: refundid,
          orderid: orderid,
          express_number: express_number,
          express: express,
          expresscom: expresscom
        }, function (result) {
          if (result.error == 0) {
            wx.navigateTo({
              url: '/pages/order/detail/index?id=' + orderid
            });
          }
        });
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
/* pages/order/express/number.wxss */
.fui-footer .btn{
    border-radius:40rpx;
    margin-top: 24rpx;
    width: auto;
    margin-right: 24rpx
}
</style>