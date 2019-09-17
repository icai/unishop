<template>
<view>
<view :class="'poster ' + (full?'full':'')">
    <view v-if="!full" class="poster_box" @touchstart="touchStart" @touchmove="touchMove" catchtouchend="touchEnd" :style="'margin-left:' + -left + 'px;width:' + posterboxwidth + 'px'">
        <view v-for="(item, index) in posterArr" :key="index" class="posterimg poster_show" :style="'width:' + posterwidth + 'px'">
            <image class="image" :src="item.thumb" @load="loadImg" :data-index="index" :style="'display: ' + (item.thumbLoaded? 'block': 'none') + ';'" mode="widthFix"></image>
            <view v-if="!item.thumbLoaded" class="loading ">
                <view class="sk-three-bounce">
                    <view class="sk-child sk-bounce1"></view>
                    <view class="sk-child sk-bounce2"></view>
                    <view class="sk-child sk-bounce3"></view>
                </view>
            </view>
            <image v-if="item.thumbLoaded" class="check" :src="check" @click.stop="enlarge"></image>
        </view>
    </view>
    <view class="pre" @tap="pre" v-if="index >0">
        <text class="icox icox-qianjin-copy-copy"></text>
    </view>
    <view class="next" @tap="next" v-if="index<posterArr.length-1">
        <text class="icox icox-qianjin-copy"></text>
    </view>
    <view v-if="full" class="poster_box" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="'margin-left:' + -left + 'px;width:' + posterboxwidth + 'px'">
        <view v-for="(item, index) in posterArr" :key="index" class="posterimg poster_show" :style="'width:' + posterwidth + 'px;height:' + windowHeight + 'px'">
            <view v-if="!item.posterLoaded" class="loading ">
                <view class="sk-three-bounce">
                    <view class="sk-child sk-bounce1"></view>
                    <view class="sk-child sk-bounce2"></view>
                    <view class="sk-child sk-bounce3"></view>
                </view>
            </view>
            <image :src="item.poster" :data-index="index" data-poster="true" :style="'width:100%;height:' + lgimgheight + 'rpx; display: ' + (item.posterLoaded? 'block': 'none') + ';'" @load="loadImg" mode="widthFix"></image>
        </view>
    </view>
</view>

<view class="tips" v-if="!full">
    <view class="savepic" @tap="savePicture">保存图片</view>
    <text class="icox icox-zhuyi" style="color:#ffd800"></text>
    保存至相册
</view>
<view class="pos_bot" v-if="full">
    <text class="icox icox-zhuyi" style="color:#ffd800"></text>
    左右滑动切换模版
    <text class="btn btn-danger btn-sm" @tap="savePicture">保存图片</text>
    <text class="btn btn-danger-o btn-sm" @tap="ensmall">返回选择</text>
</view>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
    <view class="text">{{FoxUIToast.text}}</view>
</view>
</view>
</template>

<script>
// pages/commission/poster/index.js
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var touchDot = 0;
var startY = 0;
var time = 0;
var interval = "";

export default {
  data() {
    return {
      full: false,
      scrollleft: '',
      margin: '',
      showloading: true,
      accredit: '',
      index: 0,
      errMsg: '',
      check: "/static/images/check.png",
      posterArr: []
    };
  },

  onLoad: function () {
    var $this = this;
    wx.getSystemInfo({
      success: function (res) {
        var posterwidth = res.screenWidth;
        var windowHeight = res.windowHeight;
        $this.setData({
          posterwidth: posterwidth,
          windowHeight: windowHeight,
          index: 0
        });
      }
    });
    core.json('commission/poster', {}, function (ret) {
      if (ret.error == 0) {
        $this.setData({
          posterArr: ret.poster || [],
          posterboxwidth: $this.data.posterwidth * ret.poster.length
        });
        $this.getImage(0);
      } else if (ret.error == 70000) {
        wx.redirectTo({
          url: '../register/index'
        });
        return;
      } else if (ret.error == 70001) {
        wx.redirectTo({
          url: '/pages/member/info/index'
        });
        return;
      } else {
        foxui.toast($this, ret.message);
      }
    });
  },
  components: {},
  props: {},
  methods: {
    onshow: function () {
      this.setData({
        index: 0
      });
    },
    // 点击保存图片
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
              url: $this.data.posterArr[$this.data.index].poster,
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
    // 获取图片
    getImage: function (index) {
      var arr = this.posterArr,
          $this = this;
      setTimeout(function () {
        if ($this.data.full == true) {
          if (arr[index].poster) {
            return;
          }

          $this.requestImg(index);
        } else {
          if (arr[index].thumb) {
            return;
          }

          $this.requestImg(index);
        }
      }, 10);
    },
    // 请求 获取图片
    requestImg: function (index) {
      var arr = this.posterArr,
          $this = this;
      $this.setData({
        showloading: true
      });
      core.json('commission/poster/getimage', {
        id: arr[index].id
      }, function (ret) {
        if (ret.error == 0) {
          arr[index].thumb = ret.thumb;
          arr[index].poster = ret.poster;
          $this.setData({
            posterArr: arr
          });
        } else {
          foxui.toast($this, "保存图片失败");
        }
      });
    },
    // 触摸开始事件
    touchStart: function (e) {
      touchDot = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      interval = setInterval(function () {
        time++;
      }, 1000);
    },
    // 触摸移动事件
    touchMove: function (e) {
      var touchMove = e.touches[0].pageX;
      var moveY = e.touches[0].pageY;
      this.setData({
        moveY: moveY,
        touchMove: touchMove
      }); // 向左滑动

      if (touchMove - touchDot <= -60 && time < 10) {
        this.setData({
          diff: touchMove - touchDot,
          touchMove: touchMove
        });
      } // 向右滑动


      if (touchMove - touchDot >= 60 && time < 10) {
        this.setData({
          diff: touchMove - touchDot
        });
      }
    },
    // 触摸结束事件
    touchEnd: function (e) {
      var index = this.index;
      var endY = Math.abs(this.moveY - startY);
      var endX = Math.abs(this.touchMove - touchDot);
      var differ = endX - endY;
      clearInterval(interval);
      time = 0;

      if (this.diff > 40 && differ > 0) {
        if (index == 0) {
          index = 0;
        } else {
          index--;
        }
      } else if (this.diff < -40 && differ > 0) {
        if (index == this.posterArr.length - 1) {
          index = this.posterArr.length - 1;
        } else {
          index++;
        }
      }

      var left = index * this.posterwidth;
      this.setData({
        left: left,
        diff: 0,
        index: index
      });
      this.getImage(index);
    },
    pre: function () {
      var index = this.index;

      if (index == 0) {
        index = 0;
      } else {
        index--;
      }

      var left = index * this.posterwidth;
      this.setData({
        left: left,
        index: index
      });
      this.getImage(index);
    },
    next: function () {
      var index = this.index;

      if (index == this.posterArr.length - 1) {
        index = this.posterArr.length - 1;
      } else {
        index++;
      }

      var left = index * this.posterwidth;
      this.setData({
        left: left,
        index: index
      });
      this.getImage(index);
    },
    loadImg: function (e) {
      var arr = this.posterArr,
          lgimgheight = e.detail.height,
          index = core.pdata(e).index,
          poster = core.pdata(e).poster;

      if (poster) {
        arr[index].posterLoaded = true;
      } else {
        arr[index].thumbLoaded = true;
      }

      this.setData({
        lgimgheight: lgimgheight,
        showloading: false,
        posterArr: arr
      });
    },
    enlarge: function () {
      this.setData({
        full: true
      });
      this.getImage(this.index);
    },
    ensmall: function () {
      this.setData({
        full: false
      });
      this.getImage(this.index);
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
  height: 100%;
  background: #fff;
  -webkit-overflow-scrolling: touch; 
    position: fixed;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
}
.poster{
   background:#fffbec;
   padding-top: 90rpx;
   height: 946rpx;
   position: relative;
   width:100%;
   overflow: hidden

}
.posterimg{
  height:855rpx;
  display: block;
  position: relative;
  float: left;
}
.full .posterimg{
  overflow: auto 
}
.poster .check{
  width: 150rpx;
  height:150rpx;
   position: absolute;
  left: 50%;
  margin-left: -75rpx;
  top: 50%;
  margin-top: -75rpx;
}
.posterimg image{
 width: 480rpx;
  height: 100%;
  display: block;
  margin: auto
}
.posterimg .image{
    border-radius: 10rpx;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    background: #fff;
}
.loading{
  background: #fff;
  width:484rpx;
  height:100%;
  border-radius:10rpx;
  box-shadow:0 0 10px rgba(0, 0, 0, 0.3);
  display:block;
  margin: auto
}
.savepic{
  width: 306rpx;
  height: 86rpx;
  line-height: 86rpx;
  background: #ff5555;
  border-radius: 40rpx;
  text-align: center;
  color: #fff;
  position: absolute;
  top: -113rpx;
  left:50%;
  margin-left: -153rpx;
  margin-bottom: -43rpx;
  font-size: 30rpx;
}
.tips{
  margin-top: 70rpx;
  font-size: 26rpx;
  color: #999;
  text-align: center;
  position: relative
}
.poster_box{
  transition: margin-left 1s;
  -moz-transition: margin-left 1s; /* Firefox 4 */
  -webkit-transition: margin-left 1s; /* Safari 和 Chrome */
  -o-transition: margin-left 1s; /* Opera */
    /* -webkit-overflow-scrolling: touch;
    z-index: 1000 */
}
.poster.full{
  height: 100%;
  overflow-y: scroll;
  padding-top: 0
}
/*箭头 */
.pre,.next{
  position: absolute;
  top: 50%;
}
.pre text,.next text{
    font-size:60rpx;
    color: #fff;
    text-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2)
}
.pre{
  left:0;
  position:absolute;z-index:999;
  animation: pre 1.5s infinite ease-in-out;
}

.next{
  right: 0;
  position:absolute;z-index:999;
  animation: next 1.5s infinite ease-in-out;
}

@keyframes next {
	0%,30% {opacity: 0.8;transform: translate(-8px,0px);}
	60% {opacity:0.8;transform: translate(0px,0);}
	100% {opacity: 0.8;transform: translate(-8px,0px);}
}
@keyframes pre {
	0%,30% {opacity: 0.8;transform: translate(8px,0px);}
	60% {opacity: 0.8;transform: translate(0px,0);}
	100% {opacity: 0.8;transform: translate(8px,0px);}
}
.ani{
	position:absolute;
	}
.txt{
	position:absolute;
}

/*大图底部  */
.pos_bot{
  position: fixed;
  height: 100rpx;
  width: 100%;
  background:rgba(255, 255, 255, 0.8);
  bottom: 0;
  left: 0;
  line-height: 100rpx;
  padding: 0 0 0 15rpx;
  font-size: 26rpx;
  color: #999
}
.pos_bot .icox{
  margin-right: 10rpx
}
.pos_bot .btn-danger-o{
  border-radius: 50rpx;
  color: #ff5555;
  border: 1px solid #ff5555;
  height: 52rpx;
  float: right;
  margin-top: 24rpx
}
.pos_bot .btn-danger{
  border-radius: 50rpx;
  background-color: #ff5555;
    border-color: #ff5555;
  height: 52rpx;
  float: right;
  margin: 24rpx 25rpx 0 12rpx
}
.loading{
  width:484rpx;
  height:100%;
  border-radius:10rpx;
  box-shadow:0 0 10px rgba(0, 0, 0, 0.4);
  position: relative
}
.full .loading{
  box-shadow:none;
  background: #fffbec
}
/*loading  */
      .sk-three-bounce {
				position: absolute;
				top: 50%;
				left: 50%;
        width: 160rpx;
        margin-left: -80rpx;
        text-align: center;
			}
			.sk-three-bounce .sk-child {
				width: 20px;
				height: 20px;
				background-color: #333;
				border-radius: 100%;
				display: inline-block;
				-webkit-animation: sk-three-bounce 1.1s ease-in-out 0s infinite both;
				animation: sk-three-bounce 1.1s ease-in-out 0s infinite both;
			}
			.sk-three-bounce .sk-bounce1 {
				background:rgba(68,171,247,0.2);
			  	-webkit-animation-delay: -0.32s;
			  	animation-delay: -0.32s;
			}
			.sk-three-bounce .sk-bounce2 {
				background:rgba(68,171,247,0.2);
			  	-webkit-animation-delay: -0.16s;
			  	animation-delay: -0.16s;
			}
			.sk-three-bounce .sk-bounce3 {
			  	background:rgba(68,171,247,0.2);
			}
			@-webkit-keyframes sk-three-bounce {
			  0%, 80%, 100% {
			    -webkit-transform: scale(0);
			    transform: scale(0);
			    background:rgba(68,171,247,0.2);
			  }
			  40% {
			    -webkit-transform: scale(1);
			    transform: scale(1);
			    background:rgba(68,171,247,1); }

			  }

			@keyframes sk-three-bounce {
			  0%, 80%, 100% {
			    -webkit-transform: scale(0);
			    transform: scale(0);
			    background:rgba(68,171,247,0.2);
			  }
			  40% {
			    -webkit-transform: scale(1);
			    transform: scale(1);
			    background:rgba(68,171,247,1);
			  }
			}
</style>