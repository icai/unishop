<template>
<view class="page navbar">
  <view class="fui-goods-group" v-if="goods">
    <navigator class="fui-goods-item" v-for="(item, index) in goods" :key="index" :url="'../bargain/bargain?id=' + item[0]['actor_id'] + '&mid=' + mid" hover-class="none" open-type="navigate">
        <view class="image" :style="'background-image:url(' + item[0]['thumb'] + ')'"></view>
      <view class="detail goods_list_detail">
        <view class="name">{{ item[0]['title'] }}</view>
        <view v-if="item[0]['type'] == 0">
          <view class="status success" v-if="item[0]['label_swi'] ==0">进行中</view>
          <view class="status default" v-if="item[0]['label_swi'] ==1">已超时</view>
          <view class="status default" v-if="item[0]['label_swi'] ==2">已结束</view>
          <view class="status danger" v-if="item[0]['label_swi'] ==3">已到底价</view>
        </view>
        <view v-if="item[0]['type'] == 1">
          <view class="status success" v-if="item[0]['label_swi'] ==0">进行中</view>
          <view class="status default" v-if="item[0]['label_swi'] ==1">已超时</view>
          <view class="status default" v-if="item[0]['label_swi'] ==2">已结束</view>
          <view class="status danger" v-if="item[0]['label_swi'] ==3">已到底价</view>
        </view>
        <view class="price">
          <!-- <view class="text"></view> -->
          <view class="text original">原价：￥{{ item[0]['start_price'] }}</view>
        </view>
        <view class="currentPrice">
          当前价:￥{{ item[0]['now_price'] }}
        <text class="floorPrice"></text>
        </view>
      </view>
      <view class="fui-goods-remark icox icox-qianjin-copy"></view>
    </navigator>
	</view>
  <view class="empty" v-if="!goods">
    <view>暂无砍价中商品</view>
  </view>  
   <!--底部导航  -->
  <view :class="'fui-navbar footer-nav ' + iphonexnavbar">
    <navigator url="/pages/index/index" class="nav-item" hover-class="none" open-type="switchTab">
      <span class="icox icox-shouye1"></span>
      <span class="label">商城首页</span>
    </navigator>
    <navigator url="../index/index" class="nav-item" hover-class="none" open-type="redirect">
      <span class="icox icox-quanbukanjia"></span>
      <span class="label">全部砍价</span>
    </navigator>
    <navigator url="../act/act" class="nav-item active" hover-class="none" open-type="redirect">
      <span class="icox icox-kanjiazhong"></span>
      <span class="label">砍价中</span>
    </navigator>
    <navigator url="../purchase/purchase" class="nav-item" hover-class="none" open-type="redirect">
      <span class="icox icox-yigoumai"></span>
      <span class="label">已购买</span>
    </navigator>
  </view>
  <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</template>

<script>
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      goods: {},
      mid: ''
    };
  },

  onLoad: function (options) {
    var $this = this;
    core.get('bargain/act', options, function (result) {
      $this.setData({
        goods: result.goods,
        mid: result.mid
      });
    });
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      });
    }
  },
  components: {},
  props: {},
  methods: {
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
.fui-goods-item .detail.goods_list_detail{
  padding-right: 30rpx
}
.fui-goods-item .detail.goods_list_detail .name{
  height: 46rpx;
  line-height: 46rpx;
  -webkit-line-clamp:1;
}
.fui-goods-item .detail.goods_list_detail .status{
  font-size: 20rpx;
  height: 30rpx;
  line-height: 30rpx;
  background: #999;
  display: inline-block;
  width: 98rpx;
  text-align: center;
  border-radius: 20rpx;
  color: #fff
}
.fui-goods-item .detail.goods_list_detail .status.success{
  background: #3fce0d
}
.fui-goods-item .detail.goods_list_detail .status.danger{
  background: #ff5555
}
.fui-goods-item .detail .price{
  margin-top: 0;
  height: 46rpx;
  line-height: 46rpx;
  font-size: 26rpx;
}
.fui-goods-item .detail .price .text{
   color: #999;
}
.fui-goods-item .detail .price .text.original{
  text-decoration: line-through;
}
.fui-goods-item .detail .currentPrice{
  height: 40rpx;
  line-height: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #ff5555
}
.fui-goods-remark{
  position: absolute;
  top: 50%;
  right: 26rpx;
  margin-left: 30rpx;
  font-size: 26rpx;
  color: #999
}
.fui-label{
  height: 30rpx;
  line-height: 32rpx;
  border-radius: 30rpx;
  font-size: 20rpx;
  color: #fff;
  width: 86rpx;
  text-align: center;
  background: #999;
  margin-top: 6rpx;
}
.floorPrice{
  float: right;
  margin-right:-104rpx;
  background:#ff5555;
  color:#fff;
  width:152rpx;
  text-align: center;
  line-height: 52rpx;
  border-radius: 52rpx;
  font-size: 24rpx;
  font-weight: normal;
  display: inline-block;
}
.navbar .empty{
  text-align: center;
  padding-top: 88rpx
}
.navbar .empty view{
  position: relative;
  font-size: 28rpx;
  color: #999;
  line-height: 128rpx;
  
}
.navbar .empty view:before{
  position: absolute;
  content: '';
  width: 140rpx;
  border-bottom: 1px solid #e5e5e5;
  top: 60rpx;
  left:130rpx
}
.navbar .empty view:after{
  position: absolute;
  content: '';
  width: 140rpx;
  border-bottom: 1px solid #e5e5e5;
  top: 60rpx;
  right:130rpx
}
</style>