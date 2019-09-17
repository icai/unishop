<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="model" v-if="modelShow">
  <view class="inner">
    <view class="title">用户未授权</view>
    <view class="image">
      <image :src="imgUrl + 'plugin/app/static/images/wxapp/shouquan.png'"></image>
    </view>
    <view class="subtitle">您需要先开启【用户信息】，才能使用此功能哦~</view>
    <view class="model-btns">
      <view class="cancel" @tap="cancelclick">取消</view>
      <view class="confirm" @tap="confirmclick">去设置</view>
    </view>
  </view>
  <!-- <include src="/pages/index/openauth.wxml"/> -->
</view>
<block v-if="diypages.page.type==3">
  <view class="member page" :style="'background:' + diypages.page.background + ';'">
    <include src="/pages/diy/index.wxml"></include>
  </view>
</block>
<view class="page member" v-if="show && diypages.page.type!=3">
  <view :style="'overflow: hidden;height:' + (member.usemembercard ? '360rpx' : '290rpx') + ';position: relative;background: #fff'">
    <view class="member-head" style="z-index:100;border: none;">
      <view class="child">
        <view class="title">{{member.moneytext}}</view>
        <view class="number">{{member.credit2}}</view>
        <navigator url="/pages/member/recharge/index" class="btn" hover-class="btn-hover" v-if="member.open_recharge" open-type="navigate">充值</navigator>
      </view>
      <view class="child userinfo">
        <view class="avatar">
          <image class="icon" :src="member.avatar||'/static/images/noface.png'"></image>
        </view>
        <view class="nickname">{{member.nickname||'未更新用户信息'}}</view>
        <view class="level">{{member.levelname}}</view>
      </view>
      <view class="child">
        <view class="title">{{member.credittext}}</view>
        <view class="number">{{member.credit1}}</view>
        <navigator v-if="member.open_creditshop" class="btn" hover-class="btn-hover" url="/pages/creditshop/index">兑换</navigator>
      </view>
    </view>
    <view class="member_header"></view>
    
    <!--会员卡  -->
    <block v-if="member.usemembercard">
      <navigator hover-class="none" open-type="navigate" :url="'/pages/member/membercard/index?hasmembercard=' + member.hasmembercard" class="member_card">
        <image src="/static/images/icon-huangguan.png" class="icon"></image>
        <view class="title">我的会员卡</view>
        <view class="card-num">已拥有{{member.hasbuycardnum}}张</view>
      </navigator>
      <image src="/static/images/cover.png" class="cover-img"></image>
    </block>
  </view>
  <view>
    <view class="fui-cell-group fui-cell-click" v-if="member.needbind==1">
      <navigator class="fui-cell" hover-class="none" url="/pages/member/bind/index" open-type="navigate">
        <!-- <image class="fui-cell-icon" src="{{icons.mobile}}" /> -->
        <view class="fui-cell-icon">
          <text class="icox icox-mobilephone"></text>
        </view>
        <view class="fui-cell-text">
          <p class="text text-danger">绑定手机号</p>
        </view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <view class="fui-cell-tip">{{ member.bindtext }}</view>
    </view>

    <!-- 订单 -->
    <view class="fui-cell-group fui-cell-click">
      <navigator class="fui-cell" hover-class="none" url="/pages/order/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-order"></text>
        </view>
        <view class="fui-cell-text">我的订单</view>
        <view class="fui-cell-remark">查看全部订单</view>
      </navigator>
      <view :class="'fui-icon-group col-' + ( iscycelbuy ? 5 : 4) + ' nomargin'">
        <navigator class="fui-icon-col" hover-class="none" url="/pages/order/index?status=0" open-type="navigate">
          <view class="badge" v-if="member.statics.order_0>0">{{member.statics.order_0}}</view>
          <text class="icox icox-payment"></text>
          <view class="text">待付款</view>
        </navigator>
        <navigator class="fui-icon-col" hover-class="none" url="/pages/order/index?status=1" open-type="navigate">
          <view class="badge" v-if="member.statics.order_1>0">{{member.statics.order_1}}</view>
          <text class="icox icox-shipment"></text>
          <view class="text">待发货</view>
        </navigator>
        <navigator class="fui-icon-col" hover-class="none" url="/pages/order/index?status=2" open-type="navigate">
          <view class="badge" v-if="member.statics.order_2>0">{{member.statics.order_2}}</view>
          <text class="icox icox-daishouhuo1-copy-copy"></text>
          <view class="text">待收货</view>
        </navigator>
        <navigator class="fui-icon-col" hover-class="none" url="/pages/order/index?status=4" open-type="navigate">
          <view class="badge" v-if="member.statics.order_4>0">{{member.statics.order_4}}</view>
          <text class="icox icox-return"></text>
          <view class="text">退换货</view>
        </navigator>
        <navigator class="fui-icon-col cycle" hover-class="none" url="/pages/order/cycle/order?iscycelbuy=1" open-type="navigate" v-if="iscycelbuy">
          <text class="icox icox-xiangmuzhouqi" style="color: #ff6a54;"></text>
          <view class="text">周期购</view>
        </navigator>
      </view>
    </view>

    <!--砍价-->
    <view class="fui-cell-group fui-cell-click" open-type="navigate">
    <navigator class="fui-cell" hover-class="none" url="/pages/member/membercard/index" v-if="member.usemembercard">
        <view class="fui-cell-icon">
          <text class="icox icox-bargain"></text>
        </view>
        <view class="fui-cell-text">我的会员卡</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <navigator class="fui-cell" hover-class="none" url="../../../bargain/index/index" v-if="member.bargain">
        <view class="fui-cell-icon">
          <text class="icox icox-bargain"></text>
        </view>
        <view class="fui-cell-text">砍价首页</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <navigator class="fui-cell" v-if="member.hassign" hover-class="none" :url="'/pages/web/index?module=sign&domain=' + member.sign_url_domain + '&params=' + member.sign_url_params + '&mid=' + member.id">
        <view class="fui-cell-icon">
          <text class="icox icox-qiandao"></text>
        </view>
        <view class="fui-cell-text">{{ member.sign_text }}</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <navigator class="fui-cell" hover-class="none" v-if="member.commission" :url="member.commission_url">
        <view class="fui-cell-icon">
          <text class="icox icox-distribution"></text>
        </view>
        <view class="fui-cell-text">{{ member.commission_text }}</view>
        <view class="fui-cell-remark"></view>
      </navigator>
    </view>

    <!--积分签到-->
    <!-- <view class="fui-cell-group fui-cell-click" wx:if="{{ member.hassign }}" open-type="navigate">
            <navigator class="fui-cell" hover-class="none" url="/pages/web/index?module=sign&domain={{ member.sign_url_domain }}&params={{ member.sign_url_params }}&mid={{member.id}}">
                <view class="fui-cell-icon">
                    <text class="icox icox-qiandao"></text>
                </view>
                <view class="fui-cell-text">{{ member.sign_text }}</view>
                <view class="fui-cell-remark"></view>
            </navigator>
        </view>

        <view class="fui-cell-group fui-cell-click" wx:if="{{ member.commission }}" open-type="navigate">
            <navigator class="fui-cell" hover-class="none" url="{{ member.commission_url }}">
                <view class="fui-cell-icon">
                    <text class="icox icox-distribution"></text>
                </view>
                <view class="fui-cell-text">{{ member.commission_text }}</view>
                <view class="fui-cell-remark"></view>
            </navigator>
        </view> -->

    <!--核销商品start-->
    <view class="fui-cell-group fui-cell-click" v-if="member.haveverifygoods">
      <navigator class="fui-cell external" url="/pages/verifygoods/index">
        <view class="fui-cell-icon">
          <i class="icox icox-qrcode"></i>
        </view>
        <view class="fui-cell-text">待使用商品信息</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <block v-if="member.verifygoods.length>0">
        <view class="fui-icon-group selecter" style="overflow-X: scroll;">
          <view class="banner-ul" :style="'width:' + member.verifygoods.length*170 + 'px'">
            <block v-for="(item, index) in member.verifygoods" :key="index">
              <view :class="'banner-li ' + (item.numlimit>0?'banner-li-blue':'')">
                <navigator :url="'/pages/verifygoods/detail/index?id=' + item.id" open-type="navigate">
                  <view></view>
                  <span>待使用</span>
                  <image :src="item.thumb" :alt="item.title"></image>
                  <p>{{item.title}}</p>
                </navigator>
              </view>
            </block>
          </view>
        </view>
      </block>
    </view>
    <view class="fui-cell-group fui-cell-click" v-if="member.hasdividend">
      <navigator class="fui-cell" hover-class="none" open-type="navigate" :url="(member.isheads ? '/dividend/pages/index/index' : '/dividend/pages/register/index')">
        <view class="fui-cell-icon">
          <text class="icox icox-coupons"></text>
        </view>
        <view class="fui-cell-text">{{member.isheads ? '分红中心':'申请成为队长'}}</view>
        <view class="fui-cell-remark"></view>
      </navigator>
    </view>
    <!--核销商品end-->
    <view class="fui-cell-group fui-cell-click" v-if="member.hascoupon">
      <navigator class="fui-cell" hover-class="none" open-type="navigate" url="/pages/sale/coupon/index/index" v-if="member.hascouponcenter">
        <view class="fui-cell-icon">
          <text class="icox icox-coupons"></text>
        </view>
        <view class="fui-cell-text">{{ member.coupon_text }}</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <navigator class="fui-cell" hover-class="none" url="/pages/sale/coupon/my/index/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-coupons"></text>
        </view>
        <view class="fui-cell-text">{{ member.couponcenter_text }}</view>
        <view class="fui-cell-remark">
          <text class="badge" v-if="member.statics.coupon>0">{{member.statics.coupon}}</text>
        </view>
      </navigator>
    </view>
    
    <!-- 列表 -->
    <view class="fui-cell-group fui-cell-click">
      <navigator class="fui-cell" hover-class="none" url="/pages/member/cart/index" open-type="switchTab">
        <view class="fui-cell-icon">
          <text class="icox icox-cart2"></text>
        </view>
        <view class="fui-cell-text">我的购物车</view>
        <view class="fui-cell-remark">
          <text class="badge" v-if="member.statics.cart>0">{{member.statics.cart}}</text>
        </view>
      </navigator>
      <navigator class="fui-cell" hover-class="none" url="/pages/member/favorite/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-like1"></text>
        </view>
        <view class="fui-cell-text">我的关注</view>
        <view class="fui-cell-remark">
          <text class="badge" v-if="member.statics.favorite>0">{{member.statics.favorite}}</text>
        </view>
      </navigator>
      <navigator class="fui-cell" hover-class="none" url="/pages/member/history/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-foot"></text>
        </view>
        <view class="fui-cell-text">我的足迹</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <!--要改条件的这个-->
      <navigator v-if="member.hasFullback" class="fui-cell" hover-class="none" url="../../../commission/pages/return/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-xiaofei1"></text>
        </view>
        <view class="fui-cell-text">我的{{ member.fullbacktext }}</view>
        <view class="fui-cell-remark"></view>
      </navigator>
    </view>

    <view class="fui-cell-group fui-cell-click">
      <navigator class="fui-cell" hover-class="none" open-type="navigate" url="/pages/member/withdraw/index" v-if="member.open_withdraw">
        <view class="fui-cell-icon">
          <text class="icox icox-details"></text>
        </view>
        <view class="fui-cell-text">{{ member.moneytext }}提现</view>
        <view class="fui-cell-remark"></view>
      </navigator>
      <navigator class="fui-cell" hover-class="none" url="/pages/member/log/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-details"></text>
        </view>
        <view class="fui-cell-text">{{ member.logtext }}</view>
        <view class="fui-cell-remark"></view>
      </navigator>
    </view>

    <view class="fui-cell-group fui-cell-click">
      <navigator class="fui-cell" hover-class="none" url="/pages/member/address/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-coordinates"></text>
        </view>
        <view class="fui-cell-text">收货地址管理</view>
      </navigator>
      <navigator class="fui-cell setting" hover-class="none" url="/pages/member/info/index" open-type="navigate">
        <view class="fui-cell-icon">
          <text class="icox icox-setup"></text>
        </view>
        <view class="fui-cell-text">会员资料设置</view>
      </navigator>
    </view>

    <!-- <include src="/pages/common/copyright.wxml" /> -->

    <include src="/pages/common/menu.wxml"></include>
  </view>

</view>
<button v-if="customer==1" class="suspended-service" :style="'background-color:' + customercolor" open-type="contact" session-from="weapp" show-message-card="true">
  <text class="icox icox-customerservice"></text>
</button>
<view class="phone" @tap="phone" v-if="phone==1" :style="'background-color:' + phonecolor">
  <text class="icox icox-dianhua"></text>
</view>
</view>
</template>

<script>
/**
 *
 * favorite\index.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-01-09
 *
 */
var app = getApp();
var core = app.requirejs('core');
var parser = app.requirejs('wxParse/wxParse');
var diypage = app.requirejs('biz/diypage');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      route: "member",
      icons: app.requirejs('icons'),
      member: {},
      diypages: {},
      audios: {},
      audiosObj: {},
      modelShow: false,
      //轮播
      autoplay: true,
      interval: 5000,
      duration: 500,
      swiperheight: 0,
      iscycelbuy: false,
      bargain: false,
      result: {}
    };
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.pauseOther();
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    this.pauseOther(); // this.setData({ modelShow: false })
  },
  onShareAppMessage: function () {
    return core.onShareAppMessage();
  },
  onShow: function () {
    app.checkAuth();
    var $this = this;
    this.getInfo();
    wx.getSystemInfo({
      success: function (result) {
        var swiperheight = result.windowWidth / 1.7;
        $this.setData({
          windowWidth: result.windowWidth,
          windowHeight: result.windowHeight,
          swiperheight: swiperheight
        });
      }
    }); // 店铺装修 会员中心

    $this.setData({
      imgUrl: app.globalData.approot
    });
    diypage.get(this, 'member', function (res) {});
  },
  onLoad: function (options) {
    app.checkAuth();
    var $this = this;
    $this.setData({
      options: options
    });
  },
  components: {},
  props: {},
  methods: {
    getInfo: function () {
      var $this = this;
      core.get('member', {}, function (result) {
        if (result.isblack == 1) {
          wx.showModal({
            title: '无法访问',
            content: '您在商城的黑名单中，无权访问！',
            success: function (res) {
              if (res.confirm) {
                $this.close();
              }

              if (res.cancel) {
                $this.close();
              }
            }
          });
        }

        if (result.error != 0) {
          // $this.setData({ modelShow: true });
          wx.redirectTo({
            url: '/pages/message/auth/index'
          });
        } else {
          $this.setData({
            member: result,
            show: true,
            customer: result.customer,
            customercolor: result.customercolor,
            phone: result.phone,
            phonecolor: result.phonecolor,
            phonenumber: result.phonenumber,
            iscycelbuy: result.iscycelbuy,
            bargain: result.bargain
          });
        }

        parser.wxParse('wxParseData', 'html', result.copyright, $this, '5');
      });
    },
    imagesHeight: function (e) {
      var width = e.detail.width,
          height = e.detail.height,
          type = e.target.dataset.type,
          $this = this;
      wx.getSystemInfo({
        success: function (res) {
          $this.data.result[type] = res.windowWidth / width * height;

          if (!$this.data[type] || $this.data[type] && result[type] < $this.data[type]) {
            $this.setData({
              result: $this.data.result
            });
          }
        }
      });
    },

    /*用户授权-取消*/
    cancelclick: function () {
      wx.switchTab({
        url: '/pages/index/index'
      });
    },

    /*用户授权-去设置*/
    confirmclick: function () {
      // this.setData({modelShow: false})
      wx.openSetting({
        success: function (res) {}
      });
    },
    phone: function () {
      var phoneNumber = this.phonenumber + '';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    play: function (e) {
      var item_id = e.target.dataset.id;
      var innerAudioContext = this.audiosObj[item_id] || false;

      if (!innerAudioContext) {
        innerAudioContext = wx.createInnerAudioContext('audio_' + item_id);
        var audiosObj = this.audiosObj;
        audiosObj[item_id] = innerAudioContext;
        this.setData({
          audiosObj: audiosObj
        });
      }

      var $this = this;
      innerAudioContext.onPlay(() => {
        var Time = setInterval(function () {
          var width = innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%';
          var minute = Math.floor(Math.ceil(innerAudioContext.currentTime) / 60); //分

          var second = (Math.ceil(innerAudioContext.currentTime) % 60 / 100).toFixed(2).slice(-2); //秒

          var seconds = Math.ceil(innerAudioContext.currentTime);
          var audioicon = '';

          if (minute < 10) {
            minute = "0" + minute;
          }

          var time = minute + ":" + second;
          var audios = $this.data.audios;
          audios[item_id].audiowidth = width;
          audios[item_id].Time = Time;
          audios[item_id].audiotime = time;
          audios[item_id].seconds = seconds;
          $this.setData({
            audios: audios
          });
        }, 1000);
      });
      var src = e.currentTarget.dataset.audio;
      var time = e.currentTarget.dataset.time;
      var pausestop = e.currentTarget.dataset.pausestop;
      var loopplay = e.currentTarget.dataset.loopplay;

      if (loopplay == 0) {
        innerAudioContext.onEnded(res => {
          audios[item_id].status = false;
          $this.setData({
            audios: audios
          });
        });
      }

      var audios = $this.data.audios;

      if (!audios[item_id]) {
        audios[item_id] = {};
      }

      if (innerAudioContext.paused && time == 0) {
        innerAudioContext.src = src;
        innerAudioContext.play();

        if (loopplay == 1) {
          innerAudioContext.loop = true;
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else if (innerAudioContext.paused && time > 0) {
        innerAudioContext.play();

        if (pausestop == 0) {
          innerAudioContext.seek(time);
        } else {
          innerAudioContext.seek(0);
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else {
        innerAudioContext.pause();
        audios[item_id].status = false;
      }

      $this.setData({
        audios: audios
      });
    },
    pauseOther: function (item_id) {
      var $this = this;
      $.each(this.audiosObj, function (id, obj) {
        if (id == item_id) {
          return;
        }

        obj.pause();
        var audios = $this.data.audios;

        if (audios[id]) {
          audios[id].status = false;
          $this.setData({
            audios: audios
          });
        }
      });
    },
    navigate: function (e) {
      var url = e.currentTarget.dataset.url;
      var phone = e.currentTarget.dataset.phone;
      var appid = e.currentTarget.dataset.appid;
      var appurl = e.currentTarget.dataset.appurl;

      if (url) {
        wx.navigateTo({
          url: url,
          fail: function () {
            wx.switchTab({
              url: url
            });
          }
        });
      }

      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        });
      }

      if (appid) {
        wx.navigateToMiniProgram({
          appId: appid,
          path: appurl
        });
      }
    },
    close: function () {
      app.globalDataClose.flag = true;
      wx.reLaunch({
        url: '/pages/index/index'
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
@import "../../custom/index.css";
/* @import "../../index/openauth.css"; */
.page{
  border-color: #ff5555;
}
.fui-copyright-group{
  text-align:center;
  padding: 20rpx 24rpx; 
  color: #cecece;
}
.fui-copyright-group image{
  width: 60rpx;
  height: 60rpx;
  vertical-align: middle;
  margin-right: 10rpx;
}
.fui-copyright2-group{
  text-align:center;
  padding: 10rpx 24rpx 0;
  color: #cecece;
}
.fui-copyright2-group image{
  width: 60rpx;
  height: 60rpx;
}
.notification{width:15px;height:15px;vertical-align:middle;margin:0px 0px 6px 5px;border-left:1px solid #efefef;padding-left:10rpx;}
.member-head {
    height: 260rpx;
    background: transparent;
    padding-top: 40rpx;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
}
.headinfo.style-2{
  padding:40rpx;
  background: #fe5455;
  border: none
}
.member .headinfo .setbtn{
  height: 60rpx;
  width: 60rpx;
  position: absolute;
  top: 8rpx;
  right: 10rpx;
  font-size: 48rpx;
  color: #fff;
  line-height: 48rpx;
  text-align: center;
}
.member .headinfo.style-2 .face{
  height: 160rpx;
  width: 160rpx;
  border-radius: 160rpx;
  float: left;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-shrink: 0;
  -webkit-box-lines: single;
  -moz-box-lines: single;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  box-sizing: border-box;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.member .headinfo.style-2 .face image{
  height: 160rpx;
  width: 160rpx;
  border-radius: 160rpx;
  display: block
}
.member .headinfo.style-2 .face.radius,.member .headinfo.style-2 .face.radius image{
  border-radius: 20rpx
}
.member .headinfo.style-2 .inner{
  height: auto;
  position: relative;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: block;
  padding-left:20rpx;
  color: #fff;
}
.member .headinfo.style-2 .inner .name{
  font-size: 36rpx;
  line-height: 40rpx;
}
.member .headinfo.style-2 .inner .level, .member .headinfo.style-2 .inner .credit{
  font-size: 28rpx;
  line-height: 36rpx;
}
.member .headinfo.style-2 .inner text{
  color: #fef31f
}
.headinfo{
  position: relative;
  height: auto;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.headinfo .icon-style2{
  display: inline-block;
  width: 230rpx;
  height: 72rpx;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 999;
}
.headinfo .icon-style2 image{
  width: 100%;
  height: 100%;
}
.member-head .setting {
    height:48rpx;
    width:48rpx;
    overflow: hidden;
    position: absolute;
    top: 10rpx;
    right:18rpx;
    background: none;
    border: 0;
    padding: 0;
}
.member-head .setting:after {
  display: none;
}
.member-head .setting image {
    height: 40rpx;
    width: 40rpx;
    vertical-align: top;
}
.member-head .child {
    width: 30%;
    text-align: center;
}
.member-head .child.userinfo {
    width: 40%;
    color: #fff;
    padding-top: 20rpx;
}
.member-head .child.userinfo .avatar {
    height: 96rpx;
    width: 96rpx;
    background: #fff;
    margin: auto;
    border-radius: 96rpx;
    border: 4rpx solid #fff;
}
.member-head .child.userinfo .avatar image {
    height: 96rpx;
    width: 96rpx;
    border-radius: 96rpx;
    display: block;
}
.member-head .child.userinfo .avatar.radius image,.member-head .child.userinfo .avatar.radius{
  border-radius: 20rpx
}
.member-head .child.userinfo .avatar.radius image,.member-head .child.userinfo .avatar.radius{
  border-radius: 20rpx
}
.member-head .child.userinfo .nickname {
    height: 40rpx;
    padding-top: 8rpx;
    font-size: 24rpx;
    color: inherit;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.member-head .child.userinfo .level {
    font-size: 24rpx;
    color: inherit;
    text-align: center;
}
.member-head .child .title {
    padding-top: 48rpx;
    font-size: 28rpx;
    color: #fff;
    text-align: center;
}
.member-head .child .number {
    font-size: 28rpx;
    color: #fef31f;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.member-head .child .btn {
    width: 104rpx;
    height: 40rpx;
    padding: 0;
    margin: 8rpx auto 0;
    color: #fff;
    font-size: 24rpx;
    line-height: 38rpx;
    text-align: center;
    border-radius: 40rpx;
    border: 2rpx solid #fff;
}
.fui-cell-group .fui-cell .fui-cell-remark {
color:#999;
text-align:right;
font-size:26rpx;
margin-right:8rpx;

}
.contact {
  background: red
}
.member_header {
    position: absolute;
    width: 280rpx;
    height: 120rpx;
    background: #ff5555;
    z-index: 80;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    bottom: 0;
    left: 50%;
    margin-left: -160rpx;
    overflow: hidden;
    transform: scale(10,10);
    transform-origin: center bottom;
    border: 2px solid #ff5555;
}

.fui-cell-group:nth-of-type(1){
    margin-top: 0;
}
.fui-icon-group .fui-icon-col .icox{
    color: #aaa;
    font-size: 48rpx;
    margin-top: 14rpx;
}
.fui-cell-group .fui-cell .fui-cell-text {
  line-height: 1
}
.fui-cell-tip{
  padding-top: 0;
  padding-bottom:24rpx 
}
.member .fui-icon-group .fui-icon-col .icox{
  font-size:60rpx;
  line-height:70rpx;
}
.fui-cell-group .fui-cell .fui-cell-icon .icox{
  font-size: 38rpx;
}
.fui-cell-group .fui-cell .fui-cell-icon {
  margin-right:20rpx
}
.banner-ul {
    padding: 28rpx 20rpx;
    overflow: hidden;
}
.banner-ul .banner-li:first-child {
    margin-left: 0;
}
.banner-ul .banner-li {
    border: 4rpx solid #77cd44;
    position: relative;
    overflow: hidden;
    width: 320rpx;
    border-radius: 8rpx;
    text-align: center;
    margin-left: 10rpx;
    float: left;
}

.banner-ul .banner-li view {
    width: 200rpx;
    height: 66rpx;
    position: absolute;
    top: 0;
    left: 0;
    background: #77cd44;
    transform: rotate(-25deg);
    transform-origin: left bottom;
}
.banner-ul .banner-li span {
    position: absolute;
    top: 4rpx;
    left: 4rpx;
    font-size: 20rpx;
    color: #fff;
}
.banner-ul .banner-li image {
    margin: 16rpx 0 16rpx;
    width: 42rpx;
    height: 42rpx;
    vertical-align: middle;
    border-radius: 50%
}
.banner-ul .banner-li p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 28rpx;
    padding: 0 28rpx;
    line-height: 1;
    padding-bottom:16rpx;
    display: block
}
.banner-ul .banner-li-blue{
    border:4rpx solid #68bfe7;
}
.banner-ul .banner-li-blue view{
    background:#68bfe7 ;
}
.banner-ul.style2 view {
    background: #77cd44;
    border: 0;
    padding: 2px;
}
.banner-ul.style2 .banner-li-blue view{
    background:#68bfe7 ;
}
.banner-ul.style2 view span {
    width: 40px;
    height: 18px;
    transform:rotate(0deg);
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 0;
    top: 8px;
}

.banner-ul.style2 view span {
    width: 40px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    top:8px;
    left: 0;
}
.banner-ul.style2 .banner-li-blue{
    background: #68bfe7;
}

/*授权弹窗*/
.model{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 199;
  display: none;
}
.model .inner{
	width: 624rpx;
	height: 600rpx;
	background: #fff;
	border-radius: 8rpx;
	margin: 260rpx auto;
	overflow: hidden;
}
.model .inner .title{
	font-size: 36rpx;
	color: #000;
	line-height: 100rpx;
	text-align: center;
	font-weight: 600;
  margin-top: 20rpx;
}
.model .inner .image{
	text-align: center;
  margin-top: 20rpx;
}
.model .inner image{
	width: 342rpx;
	height: 202rpx
}
.model .inner .subtitle{
	margin-top: 50rpx;
	padding: 0 80rpx;
	color: #888;
	font-size: 26rpx;
	line-height: 40rpx;
}
.model-btns{
	border-top: 1rpx solid #ebebeb;
	height: 100rpx;
	margin-top: 28rpx;
	display: flex;
	text-align: center;
	font-size: 30rpx;
	color: #000;
	line-height: 100rpx;
}
.model-btns .cancel{
	width: 50%;
	position: relative;
}
.model-btns .cancel:after{
	content: " ";
	position: absolute;
	top: -1rpx;
	right: 0;
	width: 1px;
	height: 210rpx;
	border-right: 1px solid #ebebeb;
	color: #ebebeb;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.model-btns .confirm{
	width: 50%;
	color: #50b33c;
}

/*新增周期购  */
.fui-icon-group .fui-icon-col{
  width: 20%;
}
.fui-icon-group .fui-icon-col.cycle:after{
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  bottom: 0;
  width: 1rpx;
  color: #d9d9d9;
  border-left: 1rpx solid #d9d9d9;
	transform: scaleY(0.5); 
}

.member_card{
  position: absolute;
  z-index: 99;
  left: 26rpx;
  bottom: 0;
  display: flex;
  width: 698rpx;
  height: 96rpx;
  margin: 0 auto 0;
  line-height: 96rpx;
  border-radius: 15rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  padding: 0 30rpx;
  color: #fff;
  align-items: center;
  background: linear-gradient(to right, #c1a167 , #e9d5aa);
}
.member_card .icon{
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}
.member_card .title{
  flex: 1;
  line-height: 1;
}
.member_card .card-num{
  min-width: 136rpx;
  opacity: 0.8;
  font-size: 26rpx;
  text-align: right;
  line-height: 1;
}
.cover-img{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 22rpx;
  z-index: 999;
  width: 100%;
}
</style>