<template>
<!--<loading wx:if="{{ !show }}">加载中...</loading>-->
<view class="page">
	<view class="fui-picture" @tap="previewImage">
		<image :src="Image"></image>
	</view>
	<view class="save-btn" @tap="savePicture">保存图片</view>
	<view class="explain-navbar">
		<i class="icox icox-zhuyi"></i>
		<view class="expl">保存至相册</view>
	</view>
	<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      accredit: '',
      errMsg: '',
      Image: 'https://api.clubmall.cn/attachment/images/7/2017/11/r13oT11buG60bn2ntVp1q4pe3B6EGQ.jpeg'
    };
  },

  onLoad: function (options) {},
  components: {},
  props: {},
  methods: {
    /*图片预览*/
    previewImage: function () {
      wx.previewImage({
        current: 'https://api.clubmall.cn/attachment/images/7/2017/11/r13oT11buG60bn2ntVp1q4pe3B6EGQ.jpeg',
        // 当前显示图片的http链接
        urls: ['https://api.clubmall.cn/attachment/images/7/2017/11/r13oT11buG60bn2ntVp1q4pe3B6EGQ.jpeg'] // 需要预览的图片http链接列表

      });
    },

    /*点击保存图片*/
    savePicture: function () {
      var $this = this;
      wx.getSetting({
        success: function (res) {
          var accredit = res.authSetting['scope.writePhotosAlbum'];

          if (accredit) {
            wx.showLoading({
              title: '图片下载中...'
            });
            setTimeout(function () {
              wx.hideLoading();
            }, 1000);
            wx.downloadFile({
              url: 'https://api.clubmall.cn/attachment/images/7/2017/11/r13oT11buG60bn2ntVp1q4pe3B6EGQ.jpeg',
              success: function (res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,

                  success(result) {
                    foxui.toast($this, "保存图片成功");
                  },

                  fail: function (ret) {
                    $this.setData({
                      errMsg: ret.errMsg
                    });
                    foxui.toast($this, "保存图片失败");
                  }
                });
              }
            });
          } else {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              fail: function () {
                app.getmsg('writePhotosAlbum', '使用保存图片功能');
              }
            });
          }
        }
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
/*
 * @amend 2017-11-01
 * @author ma
 * */
.page{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: #fff;
}
.fui-picture{
	width: 650rpx;
	height: 960rpx;
	border: 1rpx solid #fafafa;
	margin: 28rpx auto 0;
	box-shadow: #ccc 0px 0px 10px;
}
.fui-picture image{
	width: 650rpx;
	height: 960rpx;
}

.save-btn{
	width: 306rpx;
	height: 86rpx;
	background: #e13a3a;
	border-radius: 43rpx;
	position: fixed;
	bottom:155rpx;
	left: 50%;
	margin-left: -153rpx;
	font-size: 30rpx;
	color: #fff;
	text-align: center;
	line-height: 86rpx;
}
.explain-navbar{
	color: #999;
	margin-top: 108rpx;
	text-align: center;
}
.explain-navbar .expl{
	display: inline-block;
	font-size: 26rpx;
	color: #999;
	margin-top: -1rpx;
}
.explain-navbar i{
	font-size: 32rpx;
	color: #fed900;
	margin-right: 14rpx;
}

</style>