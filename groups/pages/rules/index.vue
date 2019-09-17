<template>
<!--pages/groups/rules/index.wxml-->
<view style="padding:0 24rpx">
  <rich-text :nodes="rules"></rich-text>
  <view class="process" v-if="!rule">
    <text class="icox icox-1"></text>下单开团/参团 <text class="line">-----------</text><text class="icox icox-2"></text>邀请好友参团 <text class="line">-----------</text><text class="icox icox-3"></text>人满拼团成功
  </view>
</view>
</template>

<script>
// pages/groups/rules/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {};
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    core.post('groups.goods.play', {}, function (result) {
      $this.setData({
        rules: result.rules
      });
    });
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
<style>
/* pages/groups/rules/index.wxss */
page{
  background: #fff
}
/*流程  */
.process{
  line-height: 80rpx;
  font-size: 20rpx;
  color: #666;
}
.process text.icox{
  font-size: 26rpx;
  vertical-align: middle
}
.process text.line{
  margin:0 25rpx;
  display:inline-block;
  width:70rpx;
  overflow:hidden;
  height:80rpx;
  vertical-align:middle;
}
</style>