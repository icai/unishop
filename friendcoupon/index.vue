<template>
<view>
<view class="coupon-carve">
  <view class="coupon-model" v-if="invalidMessage">
    <view class="inner">
      <view class="title">提醒</view>
      <view class="content"><text>{{invalidMessage}}</text></view>
      <view class="btns">
        <view class="btn1 line" v-if="mylink" @tap="mycoupon">查看我的</view>
        <navigator open-type="reLaunch" hover-class="none" url="/pages/index/index" class="btn1">返回商城</navigator>
      </view>
    </view>
  </view>

<!-- <form bindsubmit='onFormSubmit' report-submit="true">
      <button formType="submit" class='es-footer-btn es-row-bg' bindtap='create'>提交订单</button>
    </form> -->


  <view class="header">
    <image src="/static/images/carve/coupon-share.png" style="width: 100%;height: 100%;position: absolute;z-index: 0;"></image>
    <image src="/static/images/carve/employ.png" v-if="data.coupon.used == 1" style="width: 194rpx;height: 194rpx;position: absolute;right: 78rpx;top: 320rpx;z-index: 6;"></image>
    <!--领取瓜分券-->
    <view class="get" style="position: relative;" v-if="data.isReceive == 0 && share_id == '' && !data.success">
      <view class="price">{{data.activitySetting.coupon_money}}<span>元</span></view>
      <form @submit="getCoupon" report-submit="true">
        <button formType="submit" class="receive">
          <image src="/static/images/carve/coupon-get.png"></image>
        </button>
      </form>
      <view class="txt">赶快邀请{{data.activitySetting.people_count - 1}}个好友共同瓜分红包吧！</view>
    </view>

    <!--被分享人领取-->
    <view class="share" style="position: relative;" v-if="data.isReceive == 0 && share_id != '' && !data.success">
      <view class="text">
        <view class="name">“{{data.share_user.nickname}}”</view>
        <view class="price">邀请你一起瓜分
          <span>{{data.activitySetting.coupon_money}}</span>元</view>
        <view class="txt">
          <span><block>{{time[0]}}天</block><block>{{time[1]}}时</block><block>{{time[2]}}分</block><block>{{time[3]}}秒</block></span>后结束</view>
      </view>
      <view class="btns">
        <navigator open-type="reLaunch" hover-class="none" url="/pages/index/index" class="btn">返回商城</navigator>
        <form report-submit="true" @submit="carve">
          <button form-type="submit" class="btn">立即瓜分</button>
        </form>
      </view>
    </view>

    <!--瓜分中-->
    <view class="underway share" style="position: relative;" v-if="data.isReceive == 1 && !data.success">
      <view class="text">
        <view class="price" style="margin-top: 0">还差<span>{{data.overPeople}}</span>人完成</view>
        <view class="price">邀请好友一起瓜分<span>{{data.activitySetting.coupon_money}}</span>元</view>
        <view class="txt"><span>{{time[0]}}天{{time[1]}}时{{time[2]}}分{{time[3]}}秒</span>后结束</view>
      </view>
      <view class="btns">
        <navigator open-type="reLaunch" hover-class="none" url="/pages/index/index" class="btn">返回商城</navigator>
        <button class="btn" open-type="share" hover-class="none" @tap="share">邀请好友瓜分</button>
      </view>
    </view>

    <!--领取成功-->
    <view class="success" style="position: relative;" v-if="data.isReceive == 1 && data.success">
      <view class="text">
        <view>恭喜您获得</view>
        <view class="price">{{data.currentActivityInfo.deduct}}<span>元</span></view>
        <view class="txt">{{data.currentActivityInfo.enough ? ('满￥' + data.currentActivityInfo.enough + '可用') : '无门槛优惠券'}}</view>
      </view>
      <view class="btns">
        <navigator open-type="reLaunch" hover-class="none" url="/pages/index/index" class="btn">返回商城</navigator>
        <navigator open-type="reLaunch" hover-class="none" :url="(data.coupon.used == 1 ? 0 : '/pages/index/index')" class="btn">立即使用</navigator>
      </view>
    </view>
  </view>
  <view class="carve-title">
    <image src="/static/images/carve/coupon-tip.png"></image>
    <span>好友手气</span>
    <image src="/static/images/carve/coupon-tip.png"></image>
  </view>

  <!--好友手气start-->
  <view class="content-card luck-list" v-if="activityList.length > 0">
    <view class="inner">
      <view class="item" v-for="(item, index) in activityList" :key="index">
        <image class="adver" :src="item.avatar"></image>
        <span class="name">{{item.nickname}}</span>
        <span>￥{{item.deduct}}</span>
      </view>
      <view class="look" @tap="more" v-if="data.activityData.length > 5">查看更多</view>
    </view>
  </view>
  <!--好友手气end-->

  <!--暂无好友瓜分start-->
  <view class="content-card coupon-blank" v-if="data.activityData.length < 1">
    <view class="inner">
      <image src="/static/images/carve/coupon-blank.png" class="coupon-blank-image"></image>
      <view class="text">暂时没有好友瓜分哦</view>
    </view>
  </view>
  <!--暂无好友瓜分end-->

  <view class="carve-title">
    <image src="/static/images/carve/coupon-tip.png"></image>
    <span>活动说明</span>
    <image src="/static/images/carve/coupon-tip.png"></image>
  </view>

  <!--活动说明start-->
  <view class="content-card explain">
    <view class="inner">
      <view class="explain-title">活动规则</view>
      <view class="explain-con" style="margin-bottom: 0;">
        <view>
          <span>活动时间：</span>{{data.activitySetting.activity_start_time}} 至 {{data.activitySetting.activity_end_time}}</view>
        <view>
          <span>活动时长：</span>{{data.activitySetting.duration}}小时</view>
        <view>
          <span>瓜分人数：</span>{{data.activitySetting.people_count}}人</view>
      </view>

      <view v-if="data.activitySetting.desc.length > 0" class="explain-title">瓜分步骤</view>
      <view class="explain-step" v-if="data.activitySetting.desc.length > 0">
        <view v-if="isArray">{{data.activitySetting.desc}}</view>
        <view v-if="!isArray" v-for="(item, index) in data.activitySetting.desc" :key="index">{{item}}</view>
      </view>
    </view>
  </view>
  <!--活动说明end-->
</view>

<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
  <view class="text">{{FoxUIToast.text}}</view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      activity_setting: {},
      shareid: '',
      id: '',
      share_id: '',
      time: ['00', '00', '00', '00'],
      listlength: false,
      pindex: 6
    };
  },

  // 分享
  onShareAppMessage(res) {
    var $this = this;
    var title = $this.data.data.activitySetting.title;
    var url = '/friendcoupon/index?share_id=' + $this.data.shareid + '&id=' + $this.data.id;
    return core.onShareAppMessage(url, title);
  },

  onLoad: function (options) {
    app.url(options);
    var $this = this;

    if (options.share_id) {
      $this.setData({
        share_id: options.share_id
      });
    }

    if (options.id) {
      $this.setData({
        id: options.id
      });
    }

    $this.getList();
  },
  components: {},
  props: {},
  methods: {
    // onShow: function() {
    //   var $this = this;
    //   $this.getList();
    // },
    // 领取优惠券
    getCoupon: function (e) {
      var $this = this;

      if ($this.data.isGet) {
        return;
      }

      var args = {
        id: $this.data.id,
        share_id: $this.data.share_id,
        form_id: e.detail.formId
      };

      if (!$this.data.isLogin) {
        app.checkAuth();
        return;
      }

      $this.setData({
        isGet: true
      });
      core.get('friendcoupon/receive', args, function (ret) {
        if (ret.error == 0) {
          foxui.toast($this, '领取成功');
          $this.getList();
          $this.setData({
            isGet: false
          });
        } else {
          $this.setData({
            invalidMessage: ret.message.replace('<br>', "\n"),
            isGet: false
          });
        }
      });
    },
    // 参与瓜分  
    carve: function (e) {
      var $this = this;
      var args = {
        id: $this.data.id,
        share_id: $this.data.share_id,
        form_id: e.detail.formId
      };

      if (!$this.data.isLogin) {
        app.checkAuth();
        return;
      }

      core.get('friendcoupon/divide', args, function (ret) {
        if (ret.error == 0) {
          foxui.toast($this, ret.message);
          $this.getList();
        } else {
          foxui.toast($this, ret.message);
          $this.getList();
        }
      });
    },
    // 查看我的
    mycoupon: function () {
      this.setData({
        id: this.data.currentActivityInfo.activity_id,
        share_id: this.data.currentActivityInfo.headerid
      });
      this.getList();
    },
    // 查看更多
    more: function () {
      var $this = this;
      var activityList = $this.data.activityList;
      core.get('friendcoupon/more', {
        id: $this.data.id,
        share_id: $this.data.shareid,
        pindex: $this.data.pindex
      }, function (ret) {
        if (ret.result.list.length === 0) {
          foxui.toast($this, "没有更多了");
        } else {
          $this.setData({
            activityList: activityList.concat(ret.result.list),
            pindex: $this.data.pindex + 10
          });
        }
      }); // core.get('friendcoupon/more', {id: $this.data.id, share_id: $this.data.share_id, pindex: $this.data.data.activityData.length}, function (ret) {
      //     console.log(ret)
      // })
    },

    // 获取数据
    getList() {
      var $this = this;
      core.get('friendcoupon', {
        id: $this.data.id,
        share_id: $this.data.share_id
      }, function (ret) {
        if (ret.error == 0) {
          if (ret.currentActivityInfo) {
            ret.currentActivityInfo.enough = Number(ret.currentActivityInfo.enough);
          }

          if (typeof ret.activitySetting.desc == 'string') {
            $this.setData({
              isArray: true
            });
          } //接口里activityData字段返回了所有数据，超过五条时我只需要显示五条，所以赋值给另一数组来显示


          $this.setData({
            activityData: ret.activityData,
            activityList: ret.activityData.length > 5 ? ret.activityData.slice(0, 5) : ret.activityData,
            data: ret,
            isLogin: ret.isLogin,
            mylink: ret.mylink,
            invalidMessage: ret.invalidMessage,
            shareid: ret.currentActivityInfo ? ret.currentActivityInfo.headerid : ''
          }); // 活动还没有结束的时候显示倒计时

          if (+ret.overTime + 3 > Math.round(+new Date() / 1000)) {
            let timer = setInterval(function () {
              $this.setData({
                time: core.countDown(+ret.overTime + 3)
              });

              if (!$this.data.time) {
                clearInterval(timer);
                $this.getList();
              }
            }, 1000);
          }
        } else {
          foxui.toast($this, ret.message);
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
.coupon-carve {
  background: #ff3c00;
  padding-bottom: 50rpx;
}

.coupon-carve .header {
  height: 838rpx;
  position: relative;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}

/*公用title*/

.carve-title {
  text-align: center;
  font-size: 30rpx;
  color: #fff;
  font-weight: bold;
  height: 110rpx;
  line-height: 110rpx;
}

.carve-title image {
  display: inline-block;
  width: 35rpx;
  height: 35rpx;
  vertical-align: middle;
}

.carve-title span {
  margin: 0 28rpx;
  position: relative;
  top: 2rpx;
}

/*卡片式 */

.content-card {
  width: 686rpx;
  height: auto;
  padding: 20rpx;
  margin: 0 auto;
  border-radius: 20rpx;
  box-shadow: 0 16rpx 16rpx rgba(228, 69, 65, 0.5);
  background: linear-gradient(to bottom, #ff6f47, #ff4746) !important;
}

.content-card .inner {
  background: #fff8f2;
  border-radius: 20rpx;
}

/*暂无好友瓜分*/

.coupon-blank .inner {
  height: 280rpx;
  text-align: center;
}

.coupon-blank-image {
  width: 129rpx;
  height: 126rpx;
  margin: 48rpx auto 0;
}

.coupon-blank .inner .text {
  font-size: 26rpx;
  color: #9e6d35;
  margin-top: 24rpx;
}

/*好友瓜分记录*/

.luck-list .inner {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
}

.luck-list .item {
  display: flex;
  line-height: 80rpx;
  font-size: 26rpx;
  color: #9e6d35;
  padding: 12rpx 76rpx 12rpx 40rpx;
}

.luck-list .item .adver {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 40rpx;
}

.luck-list .item .name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.luck-list .look {
  width: 280rpx;
  height: 70rpx;
  font-size: 30rpx;
  text-align: center;
  line-height: 70rpx;
  color: #ff4946;
  font-weight: bold;
  margin: 30rpx auto 0;
  border-radius: 36rpx;
  border: 1px solid #ff4946;
  margin-bottom: 16rpx;
}

/*活动说明*/

.explain .inner {
  padding-top: 32rpx;
  padding-bottom: 1rpx;
}

.explain .explain-title {
  width: 163rpx;
  height: 46rpx;
  line-height: 46rpx;
  border-radius: 23rpx;
  text-align: center;
  color: #fff;
  font-size: 26rpx;
  font-weight: bold;
  margin: 0 auto 30rpx;
  background: linear-gradient(to bottom, #ff6f47, #ff4746) !important;
}

.explain .explain-con view {
  font-size: 24rpx;
  color: #666;
  padding: 0 28rpx;
  line-height: 38rpx;
}

.explain .explain-con view span {
  color: #ca3a0e;
}

.explain-step {
  font-size: 24rpx;
  color: #666;
  line-height: 38rpx;
  margin-bottom: 24rpx;
  padding: 0 28rpx;
}

/*领取*/

.header .get {
  width: 610rpx;
  margin: 0 auto;
  padding-top: 336rpx;
  text-align: center;
}

.header .get image {
  width: 169rpx;
  height: 167rpx;
}

.header .get .price {
  font-size: 88rpx;
  color: #ff3c00;
  height: 192rpx;
  box-sizing: border-box;
  padding-top: 75rpx;
}

.header .get .price span {
  display: inline-block;
  font-size: 26rpx;
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  margin-left: 8rpx;
  color: #fff;
  text-align: center;
  line-height: 42rpx;
  position: relative;
  top: -10rpx;
  background: linear-gradient(to bottom, #fb6238, #ff3c00) !important;
}

.header .get .txt {
  font-size: 30rpx;
  color: #fff3b3;
}

/*领取成功*/

.header .success {
  width: 610rpx;
  margin: 0 auto;
  padding-top: 336rpx;
  text-align: center;
}

.header .success .text {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff4746;
  padding-top: 68rpx;
}

.header .success .text .price {
  font-size: 60rpx;
  color: #ff3c00;
}

.header .success .text .price span {
  font-size: 26rpx;
  color: #ff3c00;
}

.header .success .text .txt {
  font-size: 26rpx;
  color: #9e6d35;
}

.header .success .btns {
  display: flex;
  margin-top: 90rpx;
}

.header .success .btns .btn, .header .share .btns .btn {
  width: 260rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  border: none;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(to bottom, #ffd235, #fd842c) !important;
}

/*领取成功*/

.header .share {
  width: 610rpx;
  margin: 0 auto;
  padding-top: 336rpx;
  text-align: center;
}

.header .share .text {
  padding-top: 80rpx;
  position: relative;
}

.header .share .text .name {
  font-size: 30rpx;
  color: #ff4746;
  font-weight: bold;
}

.header .share .text .price {
  font-size: 30rpx;
  color: #9e6035;
  margin-top: 16rpx;
}

.header .share .text .price span, .header .share .text .txt span {
  color: #ff3c00;
}

.header .share .text .txt {
  font-size: 26rpx;
  color: #9e6035;
  margin-top: 16rpx;
}

.header .share .btns {
  display: flex;
  justify-content: space-between;
  margin-top: 75rpx;
}


/*提示弹窗*/
    .coupon-model{
        background: rgba(0,0,0,.5);
        position: fixed;
        top: 0;
        left:0;
        bottom:0;
        right: 0;
        z-index: 101;
    }
    .coupon-model .inner{
        width: 630rpx;
        height: 340rpx;
        border-radius: 16rpx;
        background: #fff;
        margin: 320rpx auto 0;
        position: relative;
    }

    .coupon-model .inner .title{
        font-size: 34rpx;
        color: #333;
        font-weight: bold;
        line-height: 1;
        padding-top: 52rpx;
        text-align: center;
    }
    .coupon-model .inner .content{
        height: 164rpx;
        font-size: 28rpx;
        color: #666;
        text-align: center;
        padding: 0 120rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .coupon-model .inner .btns{
        display: flex;
        position: relative;
    }
    .coupon-model .inner .btns:before{
        content: "";
        position: absolute;
        border-top: 1rpx solid #ededed;
        top:0;
        left: 0;
        right: 0;
    }
    .coupon-model .inner .btns .btn1{
        flex: 1;
        text-align: center;
        line-height: 90rpx;
        color: #333;
        font-size: 30rpx;
        height: 90rpx;
        position: relative;
    }
    .coupon-model .inner .btns .btn1.line:after{
        content: "";
        position: absolute;
        border-right: 1rpx solid #ededed;
        top:0;
        right: 0;
        bottom: 0;
    }
    .receive {
      border:none;
      background:none;
      display: inline-block;
    }
    .receive::after,.receive::before{
      display: none;
    }
</style>