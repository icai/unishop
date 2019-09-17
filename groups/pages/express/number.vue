<template>
<!--pages/groups/express/number.wxml-->
<view class="page">
    <view class="fui-cell-group">
        <view class="fui-cell">
            填写快递单号
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">快递公司</view>
            <view class="fui-cell-info">
              <picker @change="inputPrickChange" :value="index" :range="express_list" range-key="name">
                  {{ express_list[index].name || refund.expresscom || '其他快递' }}
              </picker>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">快递单号</view>
            <view class="fui-cell-info">
                <input type="text" class="fui-input" placeholder="请输入快递单号" :value="refund.expresssn" @input="inputChange" data-type="express_number"></input>
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
</template>

<script>
var app = getApp(),
    core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      express: '',
      expresscom: '',
      expresssn: '',
      orderid: ''
    };
  },

  onLoad: function (options) {
    var $this = this; // 页面初始化 options为页面跳转所带来的参数

    core.post('groups.refund', {
      orderid: options.orderid
    }, function (list) {
      if (list.error == 0) {
        list.show = true;
        $this.setData(list);
        $this.setData({
          options: options
        });
      } else {
        core.toast(list.message, 'loading');
      }
    });
  },
  components: {},
  props: {},
  methods: {
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
      var expresssn = e.detail.value;
      this.setData({
        expresssn: expresssn
      });
    },
    back: function () {
      wx.navigateBack();
    },
    submit: function (e) {
      var $this = this;
      var expresssn = $this.data.expresssn;
      var refundid = $this.data.options.refundid;
      var orderid = $this.data.options.orderid;

      if (expresssn == "") {
        wx.showToast({
          title: '请填写快递单号',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      var express = $this.data.express;
      var expresscom = $this.data.expresscom;
      var data = {
        express: express,
        expresscom: expresscom,
        expresssn: expresssn,
        orderid: orderid
      };
      core.post('groups.refund.express', data, function (list) {
        if (list.error == 0) {
          wx.navigateBack();
        } else {
          wx.showToast({
            title: list.error,
            icon: 'none',
            duration: 2000
          });
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
/* pages/groups/express/number.wxss */
.fui-footer .btn{
    border-radius:40rpx;
    margin-top: 24rpx;
    width: auto;
    margin-right: 24rpx
}
</style>