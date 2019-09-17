<template>
<view class="fui-content">
  <image class="coin" :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg7s.png'"></image>
  <image class="contentbj" mode="widthFix" :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/sbg2.png'"></image>
  <view class="content">
    <view class="title">恭喜您,获得了3张优惠券!</view>
    <scroll-view scroll-y="true" class="coupon-list">
      <view class="item">
        <image class="itembj" :src="imgUrl + '/coupon/bg4.png'"></image>
        <view class="item-con">
          <view class="item-inner">
            <span style="font-size:30rpx;">￥</span>500</view>
          <view class="item-remark">
            <view class="t">店铺优惠券</view>
            <view class="b">满100元可用</view>
          </view>
        </view>
      </view>

      <view class="item">
        <image class="itembj" :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg4.png'"></image>
        <view class="item-con">
          <view class="item-inner">
            <span style="font-size:30rpx;">￥</span>500</view>
          <view class="item-remark">
            <view class="t">店铺优惠券</view>
            <view class="b">满100元可用</view>
          </view>
        </view>
      </view>

      <view class="item">
        <image class="itembj" :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg4.png'"></image>
        <view class="item-con">
          <view class="item-inner">
            <span style="font-size:30rpx;">￥</span>500</view>
          <view class="item-remark">
            <view class="t">店铺优惠券</view>
            <view class="b">满100元可用</view>
          </view>
        </view>
      </view>

      <view class="item">
        <image class="itembj" :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg4.png'"></image>
        <view class="item-con">
          <view class="item-inner">
            <span style="font-size:30rpx;">￥</span>500</view>
          <view class="item-remark">
            <view class="t">店铺优惠券</view>
            <view class="b">满100元可用</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="btnlook">
      <image class="lookbj" :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg4.png'"></image>
      <view class="look-con">立即查看</view>
    </view>
  </view>

  <view class="record">
    <view class="title">
      <image :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/circle.png'"></image> 看朋友们手气如何
      <image :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/circle.png'"></image>
    </view>
    <view class="record-list" style>
      <view class="item">
        <view class="firend_contents_logo">
          <image src="https://wx.qlogo.cn/mmopen/8ibw9tp1l4iaNFVotnNciaYicoO8WlXickrib7iccC0Ijiav0FOblUic7KroF12qmbgiciaEakiasUUfTAahRof4eBcQ8MTzstpdXShhddNY/132" width="100%" height="100%"></image>
        </view>
        <view class="firend_contents_info">
          <view style="width:100%;height:50%;line-height: 80rpx;">
            <span style="float:left;max-width:45%;height:100%;font-size: 30rpx;;color:#ffeb43;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">AHa~</span>
            <span style="width:50%;height:100%;color:#FCE3E4;float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left: 24rpx;">01-19 13:40</span>
          </view>
          <view style="width:100%;height:50%;color:#FCE3E4;font-size: 26rpx;line-height: 64rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" class="motto">不肯花大钱就买不来贵重东西!</view>
        </view>
        <view class="firend_contents_price">
          50元
        </view>
      </view>

      <view class="item">
        <view class="firend_contents_logo">
          <image src="https://wx.qlogo.cn/mmopen/8ibw9tp1l4iaNFVotnNciaYicoO8WlXickrib7iccC0Ijiav0FOblUic7KroF12qmbgiciaEakiasUUfTAahRof4eBcQ8MTzstpdXShhddNY/132" width="100%" height="100%"></image>
        </view>
        <view class="firend_contents_info">
          <view style="width:100%;height:50%;line-height: 80rpx;">
            <span style="float:left;max-width:45%;height:100%;font-size: 30rpx;;color:#ffeb43;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">123~</span>
            <span style="width:50%;height:100%;color:#FCE3E4;float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left: 24rpx;">01-19 13:40</span>
          </view>
          <view style="width:100%;height:50%;color:#FCE3E4;font-size: 26rpx;line-height: 64rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" class="motto">不肯花大钱就买不来贵重东西!</view>
        </view>

        <view class="firend_contents_price">
          50元
        </view>
      </view>
    </view>
  </view>
</view>
</template>

<script>

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
  onLoad: function (options) {},
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
page{
  height: 100%;
}
.fui-content {
  background: -webkit-linear-gradient(#ff426a, #ff4343);
  height: auto;
}

.coin{
  width: 100%;
  height: 210rpx;
  margin-top: 30rpx;
}
.contentbj{
  position: absolute;
  top: 240rpx;
  left: 50%;
  margin-left: -335rpx;
  width: 670rpx;
  height: 720rpx;
  z-index: 1;
} 
.content{
  position: absolute;
  top: 240rpx;
  left: 50%;
  margin-left: -335rpx;
  width: 670rpx;
  height: 720rpx;
  z-index: 2;
} 
.content .title{
  text-align: center;
  margin-top: 48rpx;
  margin-bottom: 24rpx;
  font-size: 36rpx;
  font-weight: 600;
}
.coupon-list{
  width: 604rpx;
  margin: 0 auto;
  height: 540rpx;
}
.coupon-list .item{
  width: 510rpx;
  height: 180rpx;
  margin: 0 auto;
  position: relative;
}
.coupon-list .item .itembj{
  width: 510rpx;
  height: 180rpx;
  position: absolute;
  z-index: 3;
}
.coupon-list .item .item-con{
  width: 416rpx;
  height: 120rpx;
  position: absolute;
  z-index: 4;
  padding: 28rpx 50rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-inner{
  font-size: 70rpx;
  color: #d0a762;
}
.item-remark{
  text-align: center;
  font-size: 26rpx;
  color: #333;
  position: relative;
}
.item-remark:after{
  content: "";
  border-left: 1rpx dashed #d0d0d0;
  position: absolute;
	height: 95rpx;
	width: 40rpx;
	top: -10rpx;
  left: -30rpx;
	margin-left: 0;
}
.btnlook{
  text-align: center;
  margin-top: 20rpx;
  height: 114rpx;
  width: 100%;
}
.btnlook .lookbj{
  width: 564rpx;
  height: 114rpx;
  position: absolute;
  left: 50%;
  margin-left: -282rpx;
  z-index: 5;
}
.btnlook .look-con{
  text-align: center;
  z-index: 6;
  color: #fe4d4e;
  position: absolute;
  width: 100%;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 80rpx;
}

.record{
  margin-top: 800rpx;
}
.record .title{
  width: 100%;
  text-align: center;
  vertical-align: center;
  font-size: 30rpx;
  color: #fff;
}
.record .title image{
  width: 32rpx;
  height: 32rpx;
  margin-top: -6rpx;
}

.record-list .item{
  height: 170rpx;
  border-bottom: 1px solid #ff8a8a;
  width: 90%;
  margin: 0 auto;
}

.firend_contents_logo{width:94rpx;height:90rpx;border-radius:47rpx;float:left;margin-top:40rpx;overflow: hidden;}
.firend_contents_info{width:70%;height:136rpx;float:left;margin-top:20rpx;margin-left:24rpx;}
.firend_contents_price{float:right;padding-top:19.2rpx;color:#FCE3E4;line-height: 80rpx;text-align: right;font-size: 34rpx}

</style>