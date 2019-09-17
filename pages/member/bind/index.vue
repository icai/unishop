<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">

    <view class="fui-cell-group">
        <view class="fui-cell must">
            <view class="fui-cell-label">手机号</view>
            <view class="fui-cell-info"><input type="number" class="fui-input" maxlength="11" placeholder="请输入您的手机号" :value="postData.mobile" @input="inputChange" data-type="mobile"></input></view>
        </view>
        <view class="fui-cell must" v-if="smsimgcode==1">
            <view class="fui-cell-label">图形验证码</view>
            <view class="fui-cell-info"><input type="number" class="fui-input" maxlength="5" placeholder="请输入图形验证码" :value="postData.verifyImg" @input="inputChange" data-type="verifyImg"></input></view>
            <view class="fui-cell-remark noremark">
                <image :src="verifycode_img" @tap="imageChange"></image>
            </view>
        </view>
        <view class="fui-cell must">
            <view class="fui-cell-label">验证码</view>
            <view class="fui-cell-info"><input type="number" class="fui-input" maxlength="5" placeholder="5位验证码" :value="postData.code" @input="inputChange" data-type="code"></input></view>
            <view class="fui-cell-remark noremark">
                <text :class="'btn btn-default btn-default-o btn-sm ' + ( endtime>0?'disabled':'' )" @tap="getCode">{{ endtime>0?endtime+'秒后重发':'获取验证码' }}</text>
            </view>
        </view>
        <view class="fui-cell must">
            <view class="fui-cell-label">登录密码</view>
            <view class="fui-cell-info">
                <input type="password" class="fui-input" placeholder="请输入您的登录密码" :value="postData.password" @input="inputChange" data-type="password"></input>
            </view>
        </view>
        <view class="fui-cell must">
            <view class="fui-cell-label">确认密码</view>
            <view class="fui-cell-info">
                <input type="password" class="fui-input" placeholder="请输入确认登录密码" :value="postData.password1" @input="inputChange" data-type="password1"></input>
            </view>
        </view>
    </view>

    <view class="btn btn-danger block" @tap="submit">{{ subtext }}</view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>

</view>
</view>
</template>

<script>
/**
 *
 * bind\index.js
 *
 * @create 2017-01-11
 * @author 晚秋
 *
 * @update  晚秋 2017-01-12
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      member: {},
      binded: false,
      endtime: 0,
      postData: {},
      submit: false,
      subtext: "立即绑定",
      smsimgcode: '',
      verifycode_img: ''
    };
  },

  onLoad: function (options) {
    app.url(options);
    core.loading();
    this.getInfo();
  },
  components: {},
  props: {},
  methods: {
    getInfo: function () {
      var $this = this,
          title;
      core.get('member/bind', {}, function (result) {
        if (result.error) {
          wx.redirectTo({
            url: "/pages/member/index/index"
          });
          return;
        }

        var data = {
          member: result.member,
          binded: result.binded,
          endtime: result.endtime,
          show: true,
          smsimgcode: result.smsimgcode,
          verifycode_img: result.verifycode_img
        };
        data.postData = {
          mobile: result.member.mobile,
          code: '',
          password: '',
          password1: ''
        };
        $this.setData(data);

        if (result.endtime > 0) {
          $this.endTime();
        }

        if (result.binded) {
          title = "更换绑定手机号";
        } else {
          title = "绑定手机号";
        }

        wx.setNavigationBarTitle({
          title: title
        });
      }, true, true, true);
    },
    endTime: function () {
      var $this = this;
      var endtime = $this.data.endtime;

      if (endtime > 0) {
        $this.setData({
          endtime: endtime - 1
        });
        var end = setTimeout(function () {
          $this.endTime();
        }, 1000);
      }

      return;
    },
    inputChange: function (event) {
      var postData = this.postData;
      var type = core.pdata(event).type;
      var value = event.detail.value;
      postData[type] = $.trim(value);
      this.setData({
        postData: postData
      });
    },
    getCode: function (event) {
      var $this = this;

      if ($this.data.endtime > 0) {
        return;
      }

      var mobile = $this.data.postData.mobile;

      if (!$.isMobile(mobile)) {
        foxui.toast($this, "请填写正确的手机号");
        return;
      }

      if ($this.data.smsimgcode == 1) {
        var verifyImg = $this.data.postData.verifyImg;

        if (verifyImg == undefined) {
          foxui.toast($this, "请填写图形验证码");
          return;
        }
      }

      core.get('sms/changemobile', {
        mobile: mobile,
        verifyImgCode: verifyImg,
        smsimgcode: $this.data.smsimgcode
      }, function (result) {
        if (result.error != 0) {
          foxui.toast($this, result.message);
          return;
        }

        foxui.toast($this, "短信发送成功");
        $this.setData({
          endtime: 60
        });
        $this.endTime();
        return;
      }, true, true, true);
    },
    submit: function (event) {
      if (this.submit) {
        return;
      }

      var $this = this;
      var postData = this.postData;

      if (!$.isMobile(postData.mobile)) {
        foxui.toast(this, "请填写正确的手机号");
        return;
      }

      if (postData.code.length != 5) {
        foxui.toast(this, "请填写5位短信验证码");
        return;
      }

      if (!postData.password || postData.password == '') {
        foxui.toast(this, "请填写登录密码");
        return;
      }

      if (!postData.password1 || postData.password1 == '') {
        foxui.toast(this, "请确认登录密码");
        return;
      }

      if (postData.password != postData.password1) {
        foxui.toast(this, "两次输入的密码不一致");
        return;
      }

      this.setData({
        submit: true,
        subtext: "正在绑定..."
      });
      core.post('member/bind/submit', postData, function (ret) {
        if (ret.error == 92001 || ret.error == 92002) {
          core.confirm(ret.message, function () {
            postData.confirm = 1;
            core.post('member/bind/submit', postData, function (ret2) {
              if (ret2.error > 0) {
                foxui.toast($this, ret2.message);
              } else {
                wx.navigateBack();
              }

              $this.setData({
                submit: false,
                subtext: "立即绑定",
                "postData.confirm": 0
              });
            }, true, true, true);
          });
          return;
        } else if (ret.error != 0) {
          foxui.toast($this, ret.message);
          $this.setData({
            submit: false,
            subtext: "立即绑定"
          });
          return;
        }

        wx.navigateBack();
      }, true, true, true);
    },
    imageChange: function () {
      var $this = this;
      core.get('member/bind/imageChange', {}, function (result) {
        $this.setData({
          verifycode_img: result.verifycode_img
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
.fui-picker {
    height: 300rpx;
    background: red;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translate3d(0, 100%, 0);
    transition-property: transform;
}

.fui-picker.in {
    transform: translate3d(0, 0, 0);
    transition-duration: 300ms;
}

.fui-picker.out{
    transition-duration: 300ms;
    transform: translate3d(0, 100%, 0);
}

.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ff3300;
}
</style>