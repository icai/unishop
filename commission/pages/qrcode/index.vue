<template>
<!--pages/commission/qrcode/index.wxml-->
<view class="page qrcode">
    <view class="fui-cell-group" v-if="!showimage">
        <view class="fui-cell">
            <view class="fui-cell-info text-center"><div class="fui-preloader"></div><br></br>正在生成海报，请稍后...</view>
        </view>
    </view>
    <view class="qrcode-img" v-if="showimage">
        <image :src="img" mode="widthFix"></image>
    </view>
    <view class="fui-title">{{ set['qrcode_title'] == "" ? '如何赚钱' : set['qrcode_title']}}</view>

    <view class="fui-list-group">
      <view wx-if="{{ set['qrcode'] == '' || (set['qrcode'] != '' && set['qrcode_content'] == '')}}">
        <view class="fui-list">
            <view class="fui-list-media">第一步</view>
            <view class="fui-list-inner">
                <view class="text">转发商品链接或商品图片给微信好友；</view>
            </view>
        </view>
        <view class="fui-list">
            <view class="fui-list-media">第二步</view>
            <view class="fui-list-inner">
                <view class="text">从您转发的链接或图片进入商城的好友，{{ set['become_child']==1 ? '如果您的好友下单，' : '' }}{{ set['become_child']==2 ? '如果您的好友下单并付款，' : '' }}系统将自动锁定成为您的客户, 他们在微信商城中购买任何商品，您都可以获得{{ set['texts']['commission1'] }}；</view>
            </view>
        </view>
        <view class="fui-list">
            <view class="fui-list-media">第三步</view>
            <view class="fui-list-inner">
                <view class="text">您可以在{{ set['texts']['center'] }}查看【{{ set['texts']['mydown'] }}】和【{{ set['texts']['order'] }}】，好友确认收货后{{ set['texts']['commission'] }}方可{{ set['texts']['withdraw'] }}。</view>
            </view>
        </view>
      </view>
      <view wx-if="{{ set['qrcode'] != '' && set['qrcode_content'] != '' }}">
        <view class="fui-list">
            <view class="fui-list-inner">
                <view class="text">{{ set['qrcode_content'] }}</view>
            </view>
        </view>
      </view>  
        <view class="fui-list" wx-if="{{ set['qrcode'] == '' || (set['qrcode'] != '' && set['qrcode_remark'] == '')}}">
            <view class="fui-card">
                    说明：分享后会带有独有的推荐码，您的好友访问之后，系统会自动检测并记录客户关系。如果您的好友已被其他人抢先发展成了客户，他就不能成为您的客户，以最早发展成为客户为准。
            </view>
        </view>
        <view class="fui-list" wx-if="{{ set['qrcode'] != '' && set['qrcode_remark'] != '' }}">
            <view class="fui-card">
                    说明：{{ set['qrcode_remark'] }}
            </view>
        </view>
    </view>
</view>
</template>

<script>
/**
 *
 * commission/index.js
 *
 * @create 2017-2-6
 * @author Young
 *
 * @update  Young 2017-2-6
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      showimage: false
    };
  },

  onShow: function () {
    this.getData();
  },
  onLoad: function (options) {//页面初始化 options为页面跳转所带来的参数
  },
  components: {},
  props: {},
  methods: {
    getData: function () {
      var $this = this;
      core.get('commission/qrcode', {}, function (json) {
        if (json.error == 70001) {
          wx.redirectTo({
            url: '/pages/member/info/index'
          });
          return;
        }

        json.show = true;
        $this.setData(json);
        $this.getImage();
      });
    },
    getImage: function () {
      var $this = this;
      core.post('commission/qrcode', {}, function (json) {
        if (json.error == 70001) {
          wx.redirectTo({
            url: '/pages/member/info/index'
          });
          return;
        }

        json.showimage = true;
        $this.setData(json);
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
/* pages/commission/qrcode/index.wxss */
.qrcode-img{
    height: auto;
}
.qrcode-img image{
    height: 1000rpx;
    width: 100%;
}
.qrcode .fui-card{
    background: #fe924a;
    color: #fff;
    box-shadow: 0 0.1rem 0.1rem rgba(204, 204, 204, 0.3);
    border: 1px solid #ccc;
    margin:20rpx;
    position: relative;
    border-radius: 6rpx;
    font-size:30rpx;
    padding:20rpx;
}
</style>