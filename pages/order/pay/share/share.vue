<template>
<view>
<view class="share_main">
  <view class="share_head_img">
    <image :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg7s.png'" alt mode="widthFix"></image>
  </view>
  <view class="content_bg" style="background: url(https://jqnyrv.ifkvip.com/addons/ewei_shopv2/template/mobile/default/static/sendticket/img/sbg2.png);background-size: 100% 100%;">
    <view class="share_title" style="padding-top: 24rpx">
      <span class="share_title_text" style="font-size: 0.95rem;"><b>您有1张优惠券待领取</b></span>
    </view>
    <view class="content_list">
      <ul>
        <li style="width:100%;height:40rpx;padding-top: 40rpx">
          <view style="width:100%;height:10%;text-align: center;line-height: 40rpx;font-size: 32rpx;color:#666">传递本页面给好友，与好友共享礼包</view>
        </li>
        <li style="width:100%;height:448rpx;padding-bottom: 120rpx;padding-top:40rpx">
          <view style="width:70%;text-align: center;font-size: 0.65rem;color:#999;margin:0 auto;margin-top: 2rem;">
            <image :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/share.png'" alt style="width: 472rpx;" mode="widthFix"></image>
          </view>
        </li>
      </ul>
      <view class="share_button">
        <view class="button_c text-center" @tap="transmit" style="background: url(https://jqnyrv.ifkvip.com/addons/ewei_shopv2/template/mobile/default/static/sendticket/img/sbtn.png); background-size: 100% 100%;">立即传递</view>
      </view>
    </view>
  </view>
</view>

<view class="paperplane" v-if="paperplane" @tap="hidepaperplane">
  <image :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/guide_1.png'" mode="widthFix"></image>
</view>
</view>
</template>

<script>
var app = getApp();

export default {
  data() {
    return {
      paperplane: false
    };
  },

  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.approot
    });
  },
  components: {},
  props: {},
  methods: {
    transmit: function () {
      this.setData({
        paperplane: true
      });
    },
    hidepaperplane: function () {
      this.setData({
        paperplane: false
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
page {
  background: -webkit-linear-gradient(#ff426a, #ff4343);
}

.share_main {
  width: 100%;
  height: auto;
}

.share_head_img {
  width: 90%;
  height: auto;
  margin: 0 auto;
}

.share_head_img image {
  width: 100%;
}

.share_title {
  width: 100%;
  height: 120rpx;
  margin: 0 auto;
  text-align: center;
  line-height: 140rpx;
  border-radius: 24rpx 24rpx 0 0;
}

.share_title_text {
  font-size: 32rpx;
  color: black;
}

.content_bg {
  width: 90%;
  height: 688rpx;
  margin: 0 auto;
  border-radius: 32rpx 32rpx 32rpx 32rpx;
}

.share_title {
  width: 100%;
  height: 120rpx;
  margin: 0 auto;
  text-align: center;
  line-height: 140rpx;
  border-radius: 24rpx 24rpx 0 0;
}

.share_title_text {
  font-size: 32rpx;
  color: black;
}

.content_list {
  width: 100%;
  height: 568rpx;
}

.content_list ul {
  width: 100%;
  height: 488rpx;
  margin: 0 auto;
}

.content_list ul li {
  width: 80%;
  height: 180rpx;
  margin: 0 auto;
}


.list_content1 {
  width: 50%;
  height: 60%;
  float: left;
  margin-left: 0.4rem;
  margin-top: 0.9rem;
  line-height: 3.2rem;
  color: #cca865;
  padding-left: 1.5rem;
}

.list_content1 div {
  width: 100%;
  height: 50%;
  line-height: 1.5rem;
}

.list_content2 {
  width: 38%;
  height: 60%;
  float: right;
  margin-right: 0.8rem;
  margin-top: 0.9rem;
  font-size: 0.8rem;
  color: black;
  border-left: 1px dashed #ccc;
  padding-right: 0.8rem;
  padding-left: 0.8rem;
}

.list_content2 div {
  width: 100%;
  line-height: 1.5rem;
}

.share_button {
  width: 100%;
  height: 2rem;
  margin: 0 auto;
}

.button_c {
  width: 86%;
  height: 120rpx;
  position: relative;
  left: 7%;
  top: 64rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #f24d4f;
}

.share_firend {
  width: 90%;
  height: auto;
  margin: 0 auto;
  margin-top: 2.2rem;
}

.paperplane{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.8)
}
.paperplane image{
  width: 70%;
  margin: 120rpx 15%;
}
</style>