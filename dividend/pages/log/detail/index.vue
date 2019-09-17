<template>
<view class="page">
  <view class="fui-cell-group" v-for="(item, index) in list" :key="index">
    <view class="fui-cell-title">
      <view class="text">审核金额：<text class="status">{{item.orderpay}}{{set.texts.yuan}}</text></view>
      <view class="inner"></view>
      <view class="text status">
        <block v-if="item.dividend_status == 1">待审核</block>
        <block v-if="item.dividend_status == 2">待打款</block>
        <block v-if="item.dividend_status == 3">已打款</block>
        <block v-if="item.dividend_status == -1">无效</block>
        <block v-if="item.dividend_status == -2">驳回</block>
      </view>
    </view>
    <view class="fui-cell-content" v-for="(items, index2) in item.goods" :key="index2">
      <view class="img column"><image :src="items.thumb"></image></view>
      <view class="inner column">
        <view class="title">{{items.title}}</view>
        <view class="subtitle">
          <!-- <text class='text'>商品规格商品格商品规格商品格商品规格商品格商品规格商品格</text> -->
          <text class="num">x{{items.total}}</text>
        </view>
      </view>
    </view>
    <view class="fui-cell-footbar">
      <view class="item">订单编号：{{item.ordersn}}</view>
      <view class="item">订单金额： ￥{{item.goodsprice}}</view>
      <view class="item">申请{{set.texts.dividend}}： {{item.dividend_price}}{{set.texts.yuan}}</view>
      <view class="item">提现手续费： ￥{{item.deductionmoney}}</view>
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
      loading: false,
      args: {
        id: ''
      }
    };
  },

  // 上拉加载
  onReachBottom: function () {
    var $this = this,
        page = $this.data.page,
        status = $this.data.status,
        args = $this.data.args;
    $this.getlist(args);
  },
  onLoad: function (options) {
    var $this = this;
    var args = {
      id: options.id
    };
    $this.setData({
      'args.id': options.id
    });
    $this.getlist(args);
  },
  components: {},
  props: {},
  methods: {
    getlist: function (args) {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.get('dividend/log/orders', args, function (res) {
        console.error(res);

        if (res.error == 0) {
          if (res.list.length > 0 && $this.data.list.length < res.total) {
            var list = $this.data.list.concat(res.list);
            args.page = args.page + 1;
          }

          $this.setData({
            sysset: res.sysset,
            set: res.set,
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
.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fui-cell-title {
  display: flex;
  font-size: 26rpx;
  color: #333;
}

.fui-cell-title .inner {
  flex: 1;
}

.fui-cell-content {
  background: #f9f9f9;
  height: 130rpx;
  margin-bottom: 5rpx;
  display: flex;
  padding: 0 24rpx;
}

.fui-cell-content .img {
  height: auto;
}

.fui-cell-content .inner {
  flex: 1;
  padding-left: 16rpx;
  font-size: 24rpx;
  color: #333;
  position: relative;
}

.fui-cell-content .inner .title {
  width: 580rpx;
  margin-bottom: 10rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.fui-cell-content .inner .subtitle{
  display: flex;
}
.fui-cell-content .inner .subtitle .text {
  color: #999;
  flex: 1;
  font-size: 22rpx;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.fui-cell-content .inner .subtitle .num {
  color: #999;
  width: 216rpx;
  font-size: 22rpx;
  margin-bottom: 10rpx;
  /* text-align: right; */
  text-align: left;  
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}


.fui-cell-content .remark {
  width: 100rpx;
  padding-left: 16rpx;
  font-size: 24rpx;
  color: #999;
  text-align: right;
  position: relative;
}

.fui-cell-content .remark::before {
  content: "";
  position: absolute;
  top: 20rpx;
  bottom: 20rpx;
  border-left: 1rpx solid #ededed;
}

.fui-cell-content .remark .text {
  color: #333;
  margin-bottom: 10rpx;
}

.status {
  color: #cfa943 !important;
}

.fui-cell-footbar {
  padding: 20rpx 24rpx;
  font-size: 24rpx;
  color: #999;
  line-height: 40rpx;
}

</style>