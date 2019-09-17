<template>
<view>
<!--index.wxml-->
<view class="moneytop">预计分红：+{{dividendcount}}元</view>
<view class="flex topnav">
  <view :class="(status == 'all' ? 'active' : '')" data-status="all" @tap="tab">所有</view>
  <view :class="(status == '1' ? 'active' : '')" data-status="1" @tap="tab">待审核</view>
  <view :class="(status == '2' ? 'active' : '')" data-status="2" @tap="tab">待打款</view>
  <view :class="(status == '3' ? 'active' : '')" data-status="3" @tap="tab">已打款</view>
  <view :class="(status == '-1' ? 'active' : '')" data-status="-1" @tap="tab">无效</view>
</view>
<!-- 列表 -->
<view class="orderitem">
  <navigator open-type="navigate" hover-class="none" :url="'/dividend/pages/log/detail/index?id=' + item.id" class="item" v-for="(item, index) in list" :key="index">
    <view class="text">
      <view class="type">
        <block v-if="item.type == 0">提现到余额</block>
        <block v-if="item.type == 1">提现到微信钱包</block>
        <block v-if="item.type == 2">提现到支付宝</block>
        <block v-if="item.type == 3">提现到银行卡</block>
      </view>
      <view class="inner"></view>
      <view class="price">+{{item.dividend}}</view>
    </view>
    <view class="text" style="margin-top:8rpx;">
      <view class="date">{{item.dealtime}}</view>
      <view class="inner"></view>
      <view :class="'status ' + (item.status == 0 ? 'status0' : '') + ' ' + (item.status == 1 ? 'status1': '') + ' ' + (item.status == 2 ? 'status2' : '') + ' ' + (item.status == 3 ? 'status3': '') + ' ' + (item.status == -1 || item.status == -2 ? 'lose': '')">
        <block v-if="item.status == 1">待审核</block>
        <block v-if="item.status == 2">待打款</block>
        <block v-if="item.status == 3">已打款</block>
        <block v-if="item.status == -1">无效</block>
        <block v-if="item.status == -2">驳回</block>
      </view>
    </view>
  </navigator>

</view>
<view class="fui-loading" v-if="loading">
  <view class="icon"></view>
  <view class="text">正在加载</view>
</view>
<!-- <view class="fui-loading empty" wx:if="{{list.length==total && total>0 && loading == false}}">
  <view class="text">没有更多了</view>
</view> -->
<!-- <view class="fui-loading empty" wx:if="{{total<=0 && !loading}}">
  <view class="text">暂时没有任何明细</view>
</view> -->
<view class="center" v-if="total<=0 && !loading">
  <view class="empty">
    <image src="/static/images/icon/nolist.png" class="light"></image>
    <view class="text-cancel">暂时没有任何明细</view>
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
      page: 1,
      status: ''
    };
    $this.getlist(args);
  },
  components: {},
  props: {},
  methods: {
    tab: function (e) {
      var status = e.currentTarget.dataset.status,
          args = {
        page: 1,
        status: status == 'all' ? '' : status
      };
      console.error(status);
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
      core.get('dividend/log/get_list', args, function (res) {
        console.error(res);

        if (res.error == 0) {
          if (res.list.length > 0) {
            var list = $this.data.list.concat(res.list);
            args.page = args.page + 1;
          }

          $this.setData({
            dividendcount: res.dividendcount,
            list: list,
            loading: false,
            total: res.total,
            page: args.page,
            stop: false
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
  overflow: auto;
}
.topnav view {
  width:150rpx;
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
.orderitem{
  margin-top: 20rpx;
  background: #fff;
}
.orderitem .item{
  position: relative;
  height: 112rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24rpx;
}
.orderitem .item::after{
  content: "";
  position: absolute;
  border-bottom: 1rpx solid #D9D9D9;
  height: 1rpx;
  bottom: 0;
  left: 24rpx;
  right: 24rpx;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.orderitem .item:last-child:after{
  display: none;
}
.orderitem .item .text{
  display: flex;
  font-size: 22rpx;
}
.orderitem .item .text .inner{
  flex: 1;
}
.orderitem .item .text .title{
  font-size: 26rpx;
  color: #333;
}
.orderitem .item .text .price{
  font-size: 30rpx;
  color: #333;
}
.orderitem .item .text .date{
  color: #999;
}
.orderitem .item .text .status.status0{
  color: #4371cf;
}
.orderitem .item .text .status.status1{
  color: #64cf43;
}
.orderitem .item .text .status.status2{
  color: #ec4a4a;
}
.lose{
  color: #999 !important;
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