<template>
<view>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
    <view class="text">{{FoxUIToast.text}}</view>
  </view>
<view :class="'fui-modal ' + (isdeal ? 'in': '')">
    <view class="inner-con">
        <view class="qrcode">
            <view class="inner1">
                <view class="title">{{message.set.applytitle}}</view>
                <view class="text"><rich-text :nodes="message.set.applycontent" @tap="tap"></rich-text></view>
            </view>
            <view class="inner-btn" style="padding: 20rpx;">
                <view class="btn btn-danger" style="width: 100%; margin: 0;" @tap="close">我已阅读</view>
            </view>
        </view>
    </view>
    <view class="close" @tap="close"><i class="icon icon-roundclose"></i></view>
</view>
 <image :src="message.set.regbg || ( imgUrl + 'plugin/app/static/images/wxapp/banner.png')" mode="widthFix" class="applybanner"></image>

<view class="content-info" v-if="message.member.headsstatus == 1 && message.member.isheads == 1">
  <i class="icon icon-roundcheck text-success"></i>
  <view class="text">您的申请已经审核通过！</view>
  <navigator open-type="switchTab" url="/pages/index/index" hover-class="none" class="btn block">去商城逛逛</navigator> 
</view>
<view class="content-info" v-if="message.member.headsstatus == 0 && message.member.isheads == 1">
  <i class="icon icon-time"></i>
  <view class="text">谢谢您的支持，请等待审核！</view>
   <navigator open-type="switchTab" url="/pages/index/index" hover-class="none" class="btn block">去商城逛逛</navigator> 
</view>

<block v-if="message.status == 0 && message.member.isheads == 0 && (message.set.condition == 1 || message.set.condition == 2 || message.set.condition == 3 ||message.set.condition == 4)">
  <view class="fui-list-group">
    <view class="fui-list-group-title"><i class="icon icon-lights"></i> 友情提醒</view>
    <view class="fui-list" v-if="message.set.condition == 1 && message.status==0">
      <view class="fui-list-inner">
        <view class="text">本店累计招募一级下线
          <text style="color: #cfa943;" class=" text-bold">{{message.member_totalcount || '0'}}</text>人， 才可成为
          <text style="color: #cfa943;" class=" text-bold">{{message.sysset.shopname}}</text>购物中心团队分红队长，您已招募了
          <text style="color: #cfa943; " class=" text-bold">{{message.member_count || '0' }}</text> 人，请继续努力！</view>
      </view>
    </view>

    <view class="fui-list" v-if="message.set.condition == 2 && message.status==0">
      <view class="fui-list-inner">
        <view class="text">本店累计招募一级下线分销商
          <text style="color: #cfa943;" class=" text-bold">{{message.commissiondownline_totalcount || '0'}}</text>人， 才可成为
          <text style="color: #cfa943;" class=" text-bold">{{message.sysset.shopname}}</text>购物中心团队分红队长，您已有
          <text style="color: #cfa943; " class=" text-bold">{{message.commissiondownline_count || '0'}}</text> 一级下线成为分销商，请继续努力！</view>
      </view>
    </view>

    <view class="fui-list" v-if="message.set.condition == 3 && message.status==0">
      <view class="fui-list-inner">
        <view class="text">本店累计佣金总额为
          <text style="color: #cfa943;" class=" text-bold">{{message.total_commission_totalcount || '0'}}</text>{{message.set.texts.yuan}}，才可成为
          <text style="color: #cfa943;" class=" text-bold">{{message.sysset.shopname}}</text>购物中心团队分红队长，您已拥有
          <text style="color: #cfa943; " class=" text-bold">{{message.total_commission_count || '0'}}</text>{{message.set.texts.yuan}}佣金，请继续努力！</view>
      </view>
    </view>

    <view class="fui-list" v-if="message.set.condition == 4 && message.status==0">
      <view class="fui-list-inner">
        <view class="text">本店累计提现佣金
          <text style="color: #cfa943;" class=" text-bold">{{message.cash_commission_totalcount || '0'}}</text>{{message.set.texts.yuan}}，才可成为
          <text style="color: #cfa943;" class=" text-bold">{{message.sysset.shopname}}</text>购物中心团队分红队长，您已有
          <text style="color: #cfa943; " class=" text-bold">{{message.cash_commission_count || '0'}}</text>{{message.set.texts.yuan}}佣金，请继续努力！</view>
      </view>
    </view>

  </view>
  <navigator url="../../../commission/pages/index" hover-class="none" open-type="navigate" class="btn block" style="background: #1b1a20; color: #cfa943; border-color: #1b1a20;">继续去招募</navigator>
</block>



<block v-if="message.member.headsstatus==0 &&  message.member.isheads==0 && message.set.condition==0">
  <view class="welcome">欢迎加入
    <text>{{message.set.texts.agent}}</text>，请填写申请信息</view>
  <view class="applymsg">
    <view class="flex msgitem line" v-if="!message.template_flag">
      <view>姓名</view>
      <input type="text" placeholder="请填写真实姓名，用于结算" placeholder-style="color:#ccc" @input="changeinput" data-input="realname"></input>
    </view>
    <view class="flex msgitem line" v-if="!message.template_flag">
      <view>手机号</view>
      <input type="number" placeholder="请填写手机号" placeholder-style="color:#ccc" @input="changeinput" data-input="mobile"></input>
    </view>
    <include src="/pages/common/diyform.wxml"></include> 
    <view v-if="message.set.open_protocol == 1" class="flex msgitem line" style="border: none">
      <view>我已阅读并了解
        <text @tap="opendeal">【{{message.set.applytitle}}】</text>
      </view>
      <radio color="#cfa943" :data-checked="checked" :checked="( checked == 1 ? true: false )" @tap="selected"></radio>
    </view>
  </view>
  <view v-if="message.set.open_protocol == 1" :class="(checked ? 'agreebtn' : 'agreebtn noagree')" :data-open_protocol="message.set.open_protocol" @tap="submit">申请{{message.set.texts.become}}</view>
  <view v-if="message.set.open_protocol == 0" class="agreebtn" :data-open_protocol="message.set.open_protocol" @tap="submit">申请{{message.set.texts.become}}</view>

  <view class="specialadvan">
    <view v-if="message.set.register_bottom == 0">
      <view class="specialitem">
        <icon class="icox icox-tequan" style="margin-right: 12rpx;color: #cfa943;"></icon>
        <text>队长特权</text>
      </view>
      <view class="flex">
        <icon class="icox icox-yishenqingyongjin" style="margin-right: 12rpx;color: #cfa943;"></icon>
        <view>
          <view>销售拿{{message.set.texts.dividend}}</view>
          <view class="smallfont">{{message.set.texts.become}}后下线卖出商品，您可以获得{{message.set.texts.dividend}}</view>
        </view>
      </view>
    </view>

    <view v-if="message.set.register_bottom == 1">
      <view class="flex">
        <icon class="icox icox-tequan" style="margin-right: 12rpx;color: #cfa943;"></icon>
        <view>
          <view>{{ message.set.register_bottom_title1 }}</view>
          <view class="smallfont">{{message.set.register_bottom_content1}}</view>
        </view>
      </view>
      <view class="flex">
        <icon class="icox icox-yishenqingyongjin" style="margin-right: 12rpx;color: #cfa943;"></icon>
        <view>
          <view>{{ message.set.register_bottom_title2 }}</view>
          <view class="smallfont">{{message.set.register_bottom_content2}}</view>
        </view>
      </view>
    </view>
     <view v-if="message.set.register_bottom == 2">
      <view>
        <rich-text :nodes="message.set.register_bottom_content"></rich-text>
      </view>
    </view>
  </view>
</block>
<include src="/pages/common/city-picker.wxml"></include>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var foxui = app.requirejs('/foxui');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');

export default {
  data() {
    return {
      checked: false,
      diyform: {},
      msg: {},
      showPicker: false,
      pvalOld: [0, 0, 0],
      pval: [0, 0, 0],
      areas: [],
      street: [],
      streetIndex: 0,
      noArea: false
    };
  },

  onShow: function () {
    var $this = this;
    $this.getlist();
  },
  onLoad: function (options) {
    var $this = this;
    $this.setData({
      imgUrl: app.globalData.approot
    });
    setTimeout(function () {
      $this.setData({
        areas: app.getCache("cacheset").areas
      });
    }, 1000);
  },
  components: {},
  props: {},
  methods: {
    changeinput: function (e) {
      var $this = this,
          val = e.detail.value,
          key = e.target.dataset.input,
          msg = $this.data.msg;
      msg[key] = val;
      $this.setData({
        msg: msg
      });
    },
    selected: function (e) {
      var checked = e.currentTarget.dataset.checked == true ? false : true;
      this.setData({
        checked: checked
      });
    },
    getlist: function () {
      var $this = this;
      core.get('dividend/register', '', function (res) {
        if (res.error == 1) {
          console.error(res.message);
          foxui.toast($this, res.message);
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1000); // return
        }

        if (res.error == 82025) {
          wx.redirectTo({
            url: '../../../commission/pages/register/index'
          });
        }

        wx.setNavigationBarTitle({
          title: "申请" + res.set.texts.become || '申请成为队长'
        });

        if (res.error == 0) {
          $this.setData({
            message: res,
            diyform: {
              f_data: res.f_data,
              fields: res.fields
            }
          });
        }
      });
    },
    opendeal: function () {
      this.setData({
        isdeal: true
      });
    },
    close: function () {
      this.setData({
        isdeal: false
      });
    },
    submit: function (e) {
      var $this = this,
          msg = $this.data.msg,
          checked = $this.data.checked,
          open_protocol = e.currentTarget.dataset.open_protocol;

      if (!checked && open_protocol == 1) {
        return;
      }

      if (!$this.data.message.template_flag) {
        if (!msg.realname) {
          foxui.toast($this, '请输入姓名');
          return;
        }

        if (!msg.mobile) {
          foxui.toast($this, '请输入手机号');
          return;
        }
      } else {
        // 自定义表单
        var memberdata = this.diyform;
        var verify = diyform.verify(this, memberdata);

        if (!verify) {
          return;
        }

        msg = {
          'memberdata': this.diyform.f_data
        };
      }

      core.post('dividend/register', msg, function (res) {
        if (res.error != 0) {
          foxui.toast($this, res.message);
          return;
        }

        $this.getlist();
      });
    },
    DiyFormHandler: function (e) {
      return diyform.DiyFormHandler(this, e);
    },
    selectArea: function (e) {
      return diyform.selectArea(this, e);
    },
    getIndex: function (str, areas) {
      return diyform.getIndex(str, areas);
    },
    onCancel: function (e) {
      return diyform.onCancel(this, e);
    },
    bindChange: function (e) {
      return diyform.bindChange(this, e);
    },
    onConfirm: function (e) {
      return diyform.onConfirm(this, e);
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
/* pages/ppt/ppt.wxss */

@import "../../../pages/common/city-picker.css";
radio{
  transform: scale(0.8)
}
.flex {
  display: flex;
}
page {
  background: #f3f3f3;
}
.fui-cell{
  padding: 26rpx 0 !important;
}
.fui-cell .fui-cell-label{
  color: #333 !important;
  /* line-height: 28rpx; */
}
.applybanner {
  display: block;
  width: 100%;
  /* height: 250rpx; */
}
.welcome {
  background: #f3f3f3;
  line-height: 60rpx;
  font-size: 22rpx;
  color: #999;
  padding-left: 22rpx;
}
.welcome text,.msgitem text {
  color: #cfa943;
}
.msgitem {
  font-size: 28rpx;
  line-height: 88rpx;
  height: 88rpx;
  justify-content: space-between;
}
.msgitem input {
  font-size: 28rpx;
  width: 500rpx;
  display: block;
  text-align: right;
  height: 88rpx;
  line-height: 88rpx;
}
.applymsg {
  background: #fff;
  padding: 0 22rpx;
  color: #333;
}
.msgitem icon {
  margin-top: 22rpx;
}
.msgitem .circle {
  border-radius: 50%;
  border: 1px solid #bbb;
  width: 30rpx;
  height: 30rpx;
  margin-top: 28rpx;
}
.agreebtn {
  width: 94%;
  border-radius: 10rpx;
  background: #1b1a20;
  color: #cfa943;
  text-align: center;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 28rpx;
  margin: 36rpx auto;
}
.noagree {
  color: #fff;
  background: #ddd;
  pointer-events: none;
}
.specialadvan {
  background: #fff;
  font-size: 24rpx;
  padding: 0 22rpx;
  color: #666;
}
.specialitem {
  line-height: 88rpx;
  border-bottom: 1px solid #eee;
}
.specialadvan .flex {
  line-height: 40rpx;
  padding: 10rpx 0;
}
.smallfont {
  font-size: 22rpx;
  color: #999;
}

.content-info{
  text-align: center;
  height: auto;
  padding-top: 60rpx;
  font-size: 30rpx;
  color: #666;
}
.content-info i{
  font-size: 200rpx;
}
.content-info .btn{
  margin-top: 40rpx;
  background: #1b1a20; 
  color: #cfa943; 
  border-color: #1b1a20;
}

/*申请分销商协议*/
.fui-modal{
    position: fixed;
    background: rgba(0,0,0,0.6);
    left:0;
    top:0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: none; 
}
.fui-modal.in{
  display: block;
}
.fui-modal .inner-con{
    background: #fff;
    border-radius: 10rpx;
    width: 628rpx;
    height: 662rpx;
    margin: 200rpx auto 0;
    text-align: center;
}
.fui-modal .inner-con .inner1{
    height: 510rpx;
    padding: 0 40rpx;
}

.fui-modal .inner-con .inner1 .title{
   font-size: 30rpx;
    color: #333;
    line-height: 40rpx;
    padding-top: 30rpx;
}
.fui-modal .inner-con .inner1 .text{
    font-size: 26rpx;
    color: #666;
    line-height: 40rpx;
    padding-top: 8rpx;
    height: 400rpx;
    overflow: scroll;
}
.fui-modal .close{
    text-align: center;
    margin-top: 40rpx;

}
.fui-modal .close i{
    font-size: 60rpx;
    color: #fff;
    font-weight: 400;
}
.msgitem.line{
  position: relative;
}
.msgitem.line:before{
  content: " ";
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 1px;
	border-top: 1px solid #ebebeb;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.fui-cell-group .fui-cell:before {
  left: 0;
	right: 0;
}
</style>