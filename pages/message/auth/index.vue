<template>
<view class="page">
    <view class="inner">
        <!-- <image src="/static/images/icon/cry-220.png" class="icon" />
        <view class="text">{{ close!=1?"您取消了授权 >_<|||":text }}</view>
        <view class="text1" wx:if="{{ close!=1 }}">您可以在小程序列表删除并重新进入</view>
        <button open-type='{{shouquan}}' bindtap='haha'>重新授权</button> -->
        <view class="image"><image :src="imgUrl + '/plugin/app/static/images/wxapp/accredit.png'"></image></view>
        <view class="text" v-if="!close">小程序需要获取您的授权<text>\n</text>才能为您提供后续服务哦</view>
         <button class="btn" v-if="!close" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">点击授权</button>
        <view class="text" v-if="close">{{text}}</view>
    </view>
</view>
</template>

<script>
var app = getApp();
var core = require("../../../utils/core.js");

export default {
  data() {
    return {
      close: 0,
      text: '',
      imgUrl: ''
    };
  },

  onShow: function () {
    var name = app.getCache('sysset').shopname;
    wx.setNavigationBarTitle({
      title: name || '提示'
    });
  },
  onLoad: function (options) {
    this.setData({
      close: options.close,
      text: options.text,
      imgUrl: app.globalData.approot
    });
  },
  components: {},
  props: {},
  methods: {
    bind: function () {
      var $this = this;
      var timer = setInterval(function () {
        wx.getSetting({
          success: function (res) {
            var userInfo = res.authSetting['scope.userInfo'];

            if (userInfo) {
              wx.reLaunch({
                url: '/pages/index/index'
              });
              clearInterval(timer);
              $this.setData({
                userInfo: userInfo
              });
            } else {}
          }
        });
      }, 1000);
    },
    // 点击open-type="getUserInfo"时候的回调函数
    bindGetUserInfo: function (res) {
      const routeData = app.getCache('routeData');
      let {
        url,
        params
      } = routeData; // 拼接重新跳转的url

      let ret = '';
      Object.keys(params).forEach(key => {
        ret += key + '=' + params[key] + '&';
      });
      params = ret.substring(0, ret.length - 1);
      var redirectUrl = '/' + url + '?' + params;
      wx.login({
        success: function (ret) {
          core.post('wxapp/login', {
            code: ret.code
          }, function (login_res) {
            if (login_res.error) {
              core.alert('获取用户登录态失败:' + login_res.message);
              return;
            }

            core.get('wxapp/auth', {
              data: res.detail.encryptedData,
              iv: res.detail.iv,
              sessionKey: login_res.session_key
            }, function (auth_res) {
              if (auth_res.isblack == 1) {
                wx.showModal({
                  title: '无法访问',
                  content: '您在商城的黑名单中，无权访问！',
                  success: function (res) {
                    if (res.confirm) {
                      app.close();
                    }

                    if (res.cancel) {
                      app.close();
                    }
                  }
                });
              }

              res.detail.userInfo.openid = auth_res.openId;
              res.detail.userInfo.id = auth_res.id;
              res.detail.userInfo.uniacid = auth_res.uniacid;
              app.setCache('userinfo', res.detail.userInfo);
              app.setCache('userinfo_openid', res.detail.userInfo.openid);
              app.setCache('userinfo_id', auth_res.id);
              app.getSet();
              wx.reLaunch({
                url: redirectUrl
              });
            });
          });
        },
        fail: function () {
          core.alert('获取用户信息失败!');
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
.inner {
  text-align: center;
  margin: 240rpx auto 0;
}

.image image{
  width: 310rpx;
  height: 240rpx;  
}

.text{
  font-size: 30rpx;
  color: #666;
  line-height: 80rpx;
  margin-top: 20rpx;
}

.btn{
  margin-top: 36rpx;
  width: 364rpx;
  height: 84rpx;
  background: #ff5555;
  text-align: center;
  line-height: 84rpx;
  color: #fff;
  font-size: 28rpx;
  border: none;
  border-radius: 42rpx;
}
</style>