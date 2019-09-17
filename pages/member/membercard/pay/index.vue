<template>
<view>
<loading v-if="!show">加载中...</loading> 
<view class="page" v-if="show">
    <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">订单编号</view>
            <view class="fui-cell-text textl"></view>
            <view class="fui-cell-remark noremark">{{ order.orderno }}</view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">订单金额</view>
            <view class="fui-cell-text textl"></view>
            <view class="text-danger">¥<text>{{ order.total }}</text></view>
        </view>
    </view>
       <view class="fui-list-group">

        <!-- <view class="btn btn-danger block"style="margin-top:1.25rem"  data-type="credit" bindtap="pay">
           确认支付
        </view> -->

        <view class="fui-list" v-if="wechat.success" data-type="wechat" @tap="pay">
            <view class="fui-list-media">
                <image src="/static/images/icon-white/wx.png" class="round"></image>
            </view>
            <view class="fui-list-inner">
                <view class="row">
                    <view class="row-text">微信支付</view>
                </view>
                <view class="subtitle"><image src="/static/images/icon-white/safe.png" alt style="height: 32rpx;width: 32rpx;vertical-align: text-bottom"></image>微信安全支付</view>
          </view>
           <view class="angle"></view>
        </view>

        <view class="fui-list" v-if="credit.success" data-type="credit" @tap="pay">
            <view class="fui-list-media">
                <image src="/static/images/icon-white/ye.png" class="round"></image>
            </view>
            <view class="fui-list-inner">
                <view class="row">
                    <view class="row-text">余额支付</view>
                </view>
                <view class="subtitle">当前余额：<text class="text-danger">¥<text>{{ credit.current }}</text></text></view>
            </view>
            <view class="angle"></view>
        </view>

        <view class="fui-list" v-if="list.cash.success && list.order.price!=0" data-type="cash" @tap="pay">
            <view class="fui-list-media">
                <image src="/static/images/icon-white/hdfk.png" class="round"></image>
            </view>
            <view class="fui-list-inner">
                <view class="row">
                    <view class="row-text">货到付款</view>
                </view>
                <view class="subtitle">收到商品后进行付款</view>
            </view>
            <view class="angle"></view>
        </view>

      </view> 
    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</view>
</template>

<script>
/**
 *
 * order/pay/index.js
 *
 * @create 2017-1-5
 * @author Young
 *
 * @update  Young 2017-01-10
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      icons: app.requirejs('icons'),
      success: false,
      successData: {},
      coupon: false,
      show: true
    };
  },

  onShow: function () {
    this.get_list();
  },
  onLoad: function (options) {
    var $this = this;
    this.setData({
      options: options
    });
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      this.setData({
        order_id: $this.data.options.order_id
      });
      core.post('membercard.order.pay', {
        order_id: $this.data.options.order_id
      }, function (res) {
        console.error(res);

        if (res.error == 1) {
          core.alert(res.message);
        }

        $this.setData({
          wechat: res.wechat,
          credit: res.credit,
          order: res.order,
          show: true
        });
        return;
      });
    },
    pay: function (e) {
      var type = core.pdata(e).type,
          $this = this,
          wechat = this.wechat;

      if (type == 'wechat') {
        core.pay(wechat.payinfo, function (res) {
          if (res.errMsg == "requestPayment:ok") {
            $this.complete(type);
          }
        });
      } else if (type == 'credit') {
        core.confirm('确认要支付吗?', function () {
          $this.complete(type);
        }, function () {});
      } else {
        $this.complete(type);
      }
    },
    complete: function (type) {
      var $this = this;
      core.post('membercard/order/complete', {
        id: $this.data.order.id,
        type: type
      }, function (ret) {
        if (ret.error != 0) {
          foxui.toast($this, ret.message);
          return;
        }

        if (ret.error == 0) {
          wx.setNavigationBarTitle({
            title: '支付成功'
          });
          $this.setData({
            success: true,
            pay_type: ret.type,
            pay_fee: ret.fee,
            orderno: ret.orderno,
            pay_msg: ret.msg
          });
        }

        foxui.toast($this, ret.msg);
        setTimeout(function () {
          wx.reLaunch({
            url: '/pages/member/membercard/index?cate=my'
          });
        }, 500);
      }, true, true);
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
.fui-list-inner .subtitle{
    color: #999;
    font-size: 26rpx;
}
.fui-list{
    padding:20rpx 10rpx;
}
.fui-list.success{
    background: -moz-linear-gradient(left, #ffb43e 0%, #fd9526 100%);
    background: -webkit-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: -o-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: -ms-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: linear-gradient(to right, #ffb43e 0%,#fd9526 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffb43e, endColorstr=#fd9526,gradientType='1');
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    font-size: 26rpx;
    line-height: 48rpx;
    height: 160rpx;
    color: #fff;
}
.red .fui-list.success{
    background:#fc664c;
    background:linear-gradient(to right, #fdad89 0%,#f94444 100%);
    background: -webkit-linear-gradient(left, #fdad89 0%,#f94444 100%);
}
.blue .fui-list.success{
    background:#4e87ee;
    background:linear-gradient(to right, #4fbaee 0%,#4e87ee 100%);
    background: -webkit-linear-gradient(left, #4fbaee 0%,#4e87ee 100%);
}
.purple .fui-list.success{
    background:#a839fa;
    background:linear-gradient(to right, #6a60ff 0%,#a839fa 100%);
    background: -webkit-linear-gradient(left, #6a60ff 0%,#a839fa 100%);
}
.orange .fui-list.success{
    background:#ff8c1e;
    background:linear-gradient(to right, #ffb81e 0%,#ff8c1e 100%);
    background: -webkit-linear-gradient(left, #ffb81e 0%,#ff8c1e 100%);
}
.pink .fui-list.success{
    background:#ff7e95;
    background:linear-gradient(to right, #ffacd0 0%,#ff7e95 100%);
    background: -webkit-linear-gradient(left, #ffacd0 0%,#ff7e95 100%);
}
.fui-list-inner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 100%;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-justify-content: space-around;
    justify-content: space-around;
}
.credit,.wechat,.car{
    height: 90rpx;
    width: 90rpx;
    display: flex;
    justify-content: center;
    border-radius:10rpx
}
.credit{
    background:#e2cb04;
}
.wechat{
    background:#04ab02;
}
.car{
    background:#0291bf;
}
.credit image,.wechat image,.car image{
    width: 60rpx;
    height:60rpx;
}
.success{
    background:#ff9326;
    margin-top: 0;
    color: #fff;
}
.row{
    font-size: 40rpx;
}
.adress{
    font-size: 27rpx;
    color: #666;
}
.operate{
    display: flex;
}
.operate navigator{
    flex: 1;
    border-radius:40rpx;
    margin:40rpx;

}
.send-code{display: none;}
.fui-cell-group.toggleSend-group .send-code{display: block;font-size: 26rpx}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.image-48{
    margin: 8rpx 0
}
.num{
    font-size: 24rpx;
    color: #fff;
    background: #ff9326;
    border-radius: 50%;
    padding: 4rpx 10rpx;
    text-align: center
}
.fui-list-media {
    margin-right: 30rpx;
    width: 92rpx;
    height: 68rpx;
    position: relative;
}
.fui-list-media wx-image {
    width: 100%;
    height:100%;
    margin-right: 24rpx;
}
.fui-list-media:after {
    content: "";
    display: inline-block;
    position: absolute;
    width: 1rpx;
    top: 4rpx;
    bottom: 4rpx;
    right: 0;
    border-right: 1rpx solid #ebebeb;
    color: #ebebeb;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
}

.page .fui-cell-group .fui-cell .fui-cell-icon {
    margin-right:24rpx;
    width:32rpx;
    height:32rpx;
    color:#999;
    text-align:center;
}


/*购物送券  */
.coupon-shade{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 101;
}
.coupon-shade .pop{
    position:fixed;
    height: 460rpx;
    width:100%;
    bottom:0rpx;
    text-align: center;
    color: #fff;
    background: -webkit-linear-gradient(top, #ff426a 0%,#ff4343 100%);
    z-index: 1050;
}
.pop1{
    padding-top: 46rpx
}
.pop2{
    width: 626rpx;
    height: 80rpx;
    background: #ffeb43;
    line-height: 80rpx;
    margin: 0 auto;
    border-radius: 10rpx;
    margin-top: 0;
    color: #ff4174;
    font-size: 32rpx;
}

</style>