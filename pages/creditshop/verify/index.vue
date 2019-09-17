<template>
<view>
<view class="title">请将二维码出示给核销员</view>
<view class="QR_code">
  <image :src="qrcode"></image>
</view>
<view class="exchange_code">核销码： {{eno}}</view>
<view class="hint">
  <view>如果无法扫码</view>
  <view>请使用消费码或自提码进行核销</view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var $ = app.requirejs('jquery'); // pages/creditshop/verify/index.js

export default {
  data() {
    return {
      eno: 0,
      qrcode: '',
      logid: 0,
      options: []
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var $this = this; // var specs = [];
    // var options = [];

    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      });
    }

    $this.getDetail();
    /*获取授权*/

    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        $this.setData({
          limits: limits
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    options = options || {};
    wx.getSystemInfo({
      success: function (result) {
        $this.setData({
          windowWidth: result.windowWidth,
          windowHeight: result.windowHeight
        });
      }
    });
    $this.setData({
      options: options,
      logid: options.id
    });
  },
  components: {},
  props: {},
  methods: {
    getDetail: function (id) {
      var $this = this;
      core.get('creditshop/exchange/qrcode', {
        id: $this.data.logid
      }, function (msg) {
        $this.setData({
          eno: msg.eno,
          qrcode: msg.qrcode
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
page{
  background: #fff;
}
.title{
  font-size: 30rpx;
  font-weight: 600;
  color: #000;
  text-align: center;
  line-height: 30rpx;
  padding: 128rpx 0 48rpx;
}
.QR_code{
  text-align: center;
}
.QR_code image{
  width: 324rpx;
  height: 324rpx;
}
.exchange_code{
  width: 400rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  margin: 40rpx auto 56rpx;
  background: #f7f7f7;
  font-size: 30rpx;
  color: #666;
}
.hint{
  text-align: center;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #ff5555;
}
</style>