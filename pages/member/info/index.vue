<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page navbar" v-if="show">

    <view class="fui-cell-group" v-if="openbind">
        <view class="fui-cell must">
            <view class="fui-cell-label">手机号</view>
            <view class="fui-cell-info">{{ member.mobile }}({{ member.mobileverify==1?"已绑定":"未绑定" }})</view>
            <navigator class="fui-cell-remark" url="/pages/member/bind/index" hover-class="none">{{ member.mobileverify==1?"更换绑定":"立即绑定" }}</navigator>
        </view>
    </view>

    <block v-if="!diyform.template_flag">
        <view class="fui-cell-group">
            <view class="fui-cell must ">
                <view class="fui-cell-label ">姓名</view>
                <view class="fui-cell-info">
                    <input class="fui-input" placeholder="请输入您的姓名" :value="postData.realname" @input="onChange" data-type="realname"></input>
                </view>
            </view>
            <view class="fui-cell must" v-if="!openbind">
                <view class="fui-cell-label">手机号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" type="number" maxlength="11" placeholder="请输入您的手机号" :value="postData.mobile" @input="onChange" data-type="mobile"></input></view>
            </view>
            <view class="fui-cell">
                <view class="fui-cell-label">微信号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" placeholder="请输入您的微信号" :value="postData.weixin" @input="onChange" data-type="weixin"></input></view>
            </view>
            <view class="fui-cell">
                <view class="fui-cell-label">出生日期</view>
                <view class="fui-cell-info">
                    <picker mode="date" :value="postData.birthday" @change="onChange" data-type="birthday">
                        <view>{{ postData.birthday||"选择出生日期" }}</view>
                    </picker>
                </view>
            </view>
            <view class="fui-cell">
                <view class="fui-cell-label ">所在城市</view>
                <view class="fui-cell-info" @tap="selectArea" :data-area="postData.city">{{ !postData.city?"请选择所在城市":postData.city }}</view>
            </view>
        </view>
    </block>

    <block v-else>
        <include src="/pages/common/diyform.wxml"></include>
    </block>

    <include src="/pages/common/city-picker.wxml"></include>
    <view :class="'fui-mask ' + ( showPicker?'show':'' )"></view>

    <view class="btn btn-danger block mtop" @tap="submit">确认修改</view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>

</view>
</view>
</template>

<script>
/**
 *
 * member\info\index.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-01-10
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var diyform = app.requirejs('biz/diyform');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      icons: app.requirejs('icons'),
      member: {},
      diyform: {},
      postData: {},
      openbind: false,
      index: 0,
      submit: false,
      showPicker: false,
      pvalOld: [0, 0, 0],
      pval: [0, 0, 0],
      areas: [],
      noArea: true
    };
  },

  onShow: function () {
    this.getInfo();
  },
  onLoad: function (options) {
    app.url(options);
    var $this = this;
    setTimeout(function () {
      $this.setData({
        areas: app.getCache("cacheset").areas
      });
    }, 1000);
  },
  components: {},
  props: {},
  methods: {
    getInfo: function () {
      var $this = this;
      core.get('member/info', {}, function (result) {
        var member = result.member;
        var data = {
          member: member,
          diyform: result.diyform,
          openbind: result.openbind,
          show: true
        };

        if (result.diyform.template_flag == 0) {
          data.postData = {
            realname: member.realname,
            mobile: member.mobile,
            weixin: member.weixin,
            birthday: member.birthday,
            city: member.city
          };
        }

        $this.setData(data);
      });
    },
    onChange: function (event) {
      var value = event.detail.value;
      var type = core.pdata(event).type;
      var postData = this.postData;
      postData[type] = $.trim(value);
      this.setData({
        postData: postData
      });
    },
    DiyFormHandler: function (e) {
      return diyform.DiyFormHandler(this, e);
    },
    submit: function () {
      if (this.submit) {
        return;
      }

      var $this = this;
      var data = $this.data;
      var diydata = data.diyform;

      if (diydata.template_flag == 0) {
        if (!data.postData.realname) {
          foxui.toast($this, "请填写姓名");
          return;
        }

        if (!$.isMobile(data.postData.mobile) && !data.openbind) {
          foxui.toast($this, "请填写正确手机号码");
          return;
        }
      } else {
        var verify = diyform.verify(this, diydata);

        if (!verify) {
          return;
        }
      }

      $this.setData({
        submit: true
      });
      var postData = {
        memberdata: data.postData
      };

      if (diydata.template_flag) {
        postData.memberdata = diydata.f_data;
      }

      core.post('member/info/submit', postData, function (result) {
        if (result.error != 0) {
          foxui.toast($this, result.message);
          return;
        }

        $this.setData({
          submit: false
        });
        foxui.toast($this, "修改成功");
        setTimeout(function () {
          wx.navigateBack();
        }, 500);
      });
    },
    selectArea: function (e) {
      return diyform.selectArea(this, e);
    },
    bindChange: function (e) {
      return diyform.bindChange(this, e);
    },
    onCancel: function (e) {
      return diyform.onCancel(this, e);
    },
    onConfirm: function (e) {
      if (!this.diyform.template_flag) {
        var val = this.pval;
        var areas = this.areas;
        var postData = this.postData;
        postData.city = areas[val[0]].name + " " + areas[val[0]].city[val[1]].name;
        this.setData({
          postData: postData,
          showPicker: false
        });
      } else {
        return diyform.onConfirm(this, e);
      }
    },
    getIndex: function (str, areas) {
      return diyform.getIndex(str, areas);
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
@import "../../common/city-picker.css";
checkbox-group text {
    padding-right: 15rpx;
}
.picker-group {
    display: flex;
}
.picker-group picker {
    width: 40%;
}
.btn{
    font-size: 32rpx
}
</style>