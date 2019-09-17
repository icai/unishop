<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page">
	<view class="fui-picture" @tap="previewImage">
		<image :src="Image" @load="loadImg" v-if="Image.length>0"></image>
	</view>
	<view class="save-btn" @tap="savePicture">保存图片</view>
	<view class="explain-navbar">
		<i class="icox icox-zhuyi"></i>
		<view class="expl">保存至相册</view>
	</view>
	<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      show: false,
      accredit: '',
      errMsg: '',
      Image: ''
    };
  },

  onLoad: function (options) {
    options = options || {};

    if (!options.id) {
      wx.redirectTo({
        url: '/pages/goods/index/index'
      });
      return;
    }

    this.getImage(options.id);
  },
  components: {},
  props: {},
  methods: {
    // 获取图片
    getImage: function (goodsid) {
      var $this = this;
      core.json('goods/poster/getimage', {
        id: goodsid
      }, function (ret) {
        if (ret.error == 0) {
          $this.setData({
            Image: ret.url
          });
          return;
        }

        foxui.toast($this, ret.message);
      });
    },
    loadImg: function (e) {
      this.setData({
        show: true
      });
    },
    // 预览图片
    previewImage: function () {
      var $this = this;
      wx.previewImage({
        current: $this.data.Image,
        urls: [$this.data.Image]
      });
    },
    // 保存图片
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
              url: $this.data.Image,
              success: function (res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (ret) {
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
              success: function () {
                wx.showLoading({
                  title: '图片下载中...'
                });
                setTimeout(function () {
                  wx.hideLoading();
                }, 1000);
                wx.downloadFile({
                  url: $this.data.Image,
                  success: function (res) {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: function (ret) {
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
              },
              fail: function () {
                /*获取权限时点击了拒绝以后的弹窗*/
                wx.showModal({
                  title: '警告',
                  content: '您点击了拒绝授权，将无法正常使用保存图片或视频的功能体验，请删除小程序重新进入。'
                });
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
	background: #ff5555;
	border-radius: 43rpx;
	position: fixed;
	top:960rpx;
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