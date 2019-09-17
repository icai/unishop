<template>
<view :style="(istopmenu == false ? '' : 'padding-top:' + topmenuheight +'rpx;')">
  <view v-for="(diyitem, index) in diypages.items" :key="index">
    <include src="/pages/diy/template/tpl.wxml"></include>
  </view>
</view>
</template>

<script>
// pages/diy/index.js
var app = getApp();
var icons = app.requirejs('icons');
var core = app.requirejs('core');
var Base64 = app.requirejs('base64');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      route: 'home',
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
      circular: true,
      hotimg: "/static/images/hotdot.jpg",
      saleout1: "/static/images/saleout-1.png",
      saleout2: "/static/images/saleout-2.png",
      saleout3: "/static/images/saleout-3.png",
      icons: app.requirejs('icons'),
      diypage: ''
    };
  },

  onUnload: function () {// 页面关闭
  },
  onHide: function () {// 页面隐藏
  },
  onShow: function () {
    var $this = this;
    core.get('diypage&id=1', {}, function (result) {
      var data = {
        loading: false,
        diypage: result.diypage
      };
      $this.setData(data);
    });
  },
  onReady: function () {// 页面渲染完成
  },
  components: {},
  props: {},
  methods: {
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
