<template>
<view>
<!--index.wxml-->
<view class="moneytop">累计{{textdividend}}：+{{member.dividend_total}}{{textyuan}}</view>
<view class="flex topnav">
  <view :class="(status == 'all' ? 'active' : '')" data-status="all" @tap="tab">所有</view>
  <view :class="(status == '0' ? 'active' : '')" data-status="0" @tap="tab">待付款</view>
  <view :class="(status == '1' ? 'active' : '')" data-status="1" @tap="tab">已付款</view>
  <view :class="(status == '3' ? 'active' : '')" data-status="3" @tap="tab">已完成</view>
</view>
<!-- 订单 -->
<view class="orderitem" v-for="(item, index) in list" :key="index">
  <!-- 用户 -->
  <view class="umsg">
    <image :src="item.buyer.avatar"></image>
    <text>{{item.buyer.nickname}}</text>
    <view>
      
      <block>{{item.statusstr}}</block>
    </view>
  </view>
  <!-- 商品 -->
  <view class="goodsitem flex" v-for="(items, index2) in item.order_goods" :key="index2">
    <image :src="items.thumb"></image>
    <view class="goodsdetail">
      <view class="goodstit">{{items.title}}</view>
      <view class="goodsinfo">{{items.optionname}}</view>
    </view>
  </view>
  <!-- 订单信息 -->
  <view class="ordermsg">
    <view>订单编号：{{item.ordersn}}</view>
    <view>下单时间{{item.createtime}}</view>
  </view>
  <view class="moneytotal">预计分红：
    <text>+{{item.dividend_price}}</text>
  </view>
</view>

<view class="fui-loading" v-if="loading">
  <view class="icon"></view>
  <view class="text">正在加载</view>
</view>
<!-- <view class="fui-loading empty" wx:if="{{total<=0 && !loading}}">
  <view class="text">没有更多了</view>
</view> -->
<!-- <view class="fui-loading empty" wx:if="{{total<=0 && !loading}}">
  <view class="text">暂时没有任何订单</view>
</view> -->
<view class="center" v-if="ordercount<=0 && !loading">
  <view class="empty">
    <image src="/static/images/icon/nolist.png" class="light"></image>
    <view class="text-cancel">您暂时没有任何订单哦！</view>
  </view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      list: [],
      page: 1,
      status: 'all',
      loading: false
    };
  },

  // 上拉加载
  onReachBottom: function () {
    var $this = this,
        page = $this.data.page,
        status = $this.data.status;
    var args = {
      page: page,
      status: status
    };
    $this.getlist(args);
  },
  onLoad: function () {
    var $this = this;
    var args = {
      page: 1
    };
    $this.getlist(args);
  },
  components: {},
  props: {},
  methods: {
    //事件处理函数
    bindViewTap: function () {
      wx.navigateTo({
        url: '../logs/logs'
      });
    },
    // 跳转到快速购买
    goIndex: function () {
      wx.navigateTo({
        url: '/pages/quickbuy/index'
      });
    },
    tab: function (e) {
      var status = e.currentTarget.dataset.status,
          args = {
        page: 1,
        status: status == 'all' ? '' : status
      };
      this.setData({
        status: status,
        list: []
      });
      this.getlist(args);
    },
    getlist: function (args) {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.get('dividend/order', args, function (res) {
        if (res.error == 0) {
          if (res.list.length > 0) {
            var orderlist = $this.data.list.concat(res.list);
            args.page = args.page + 1;
          }

          wx.setNavigationBarTitle({
            title: res.textdividend + '订单' || '分红订单'
          });
          $this.setData({
            member: res.member,
            list: orderlist,
            loading: false,
            total: res.total,
            page: args.page,
            stop: false,
            ordercount: res.ordercount,
            textyuan: res.textyuan,
            textdividend: res.textdividend
          });
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
.flex {
  display: flex;
}
page {
  background: #f3f3f3;
}
.moneytop {
  line-height: 60rpx;
  background: #1b1b20;
  color: #cfa943;
  font-size: 22rpx;
  padding-left: 20rpx;
}
.topnav {
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
   white-space: nowrap;
  overflow-x: scroll;
}
.topnav view {
  width:25%;
  border-bottom: 4rpx solid transparent;
  text-align: center;
  font-size: 28rpx;
  color: #5b5b5b;
  line-height: 80rpx;
  flex-shrink: 0;
}
.topnav view.active {
  border-bottom: 4rpx solid #1b1b20;
  color: #1b1b20;
  font-weight: bold;
}
.umsg {
  line-height: 94rpx;
  font-size: 22rpx;
  overflow: hidden;
  padding: 0 22rpx;
}
.umsg view {
  float: right;
  color: #cfa943;
}
.umsg image {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  float: left;
  margin: 20rpx 20rpx 0 6rpx;
}
.umsg text {
  float: left;
  max-width: 500rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.orderitem {
  border-top: 20rpx solid #f3f3f3;
  background: #fff;
}
.goodsitem image {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}
.goodsitem {
  background: #f9f9f9;
  padding: 30rpx 22rpx;
  font-size: 22rpx;
  margin-bottom: 4rpx;
}
.goodsdetail view {
  width: 400rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 40rpx;
}
.goodstit {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 14rpx;
}
.goodsinfo {
  color: #959595;
}
.price {
  width: 166rpx;
  text-align: right;
  border-left: 1px solid #eaeaea;
  color: #666;
}
.pricenum {
  font-size: 24rpx;
  color: #333;
  margin-top: 10rpx;
}
.ordermsg {
  font-size: 24rpx;
  color: #959595;
  line-height: 44rpx;
  padding: 16rpx 22rpx;
  border-bottom: 1px solid #eaeaea;
}
.moneytotal {
  font-size: 22rpx;
  text-align: right;
  padding-right: 22rpx;
  line-height: 90rpx;
}
.moneytotal text {
  font-size: 32rpx;
  color: #333;
}

 .empty{
    padding:100rpx 150rpx;
    font-size: 34rpx;
}

 .light{
    height: 240rpx;
    width: 240rpx;
}
 .text-cancel{
    padding: 10rpx;
    margin-bottom: 30rpx;
    margin-top:25rpx;
    font-size: 30rpx;
}
</style>