<template>
<view class="page navbar">
  <!--发货状态  -->
  <view class="fui-list bg">
    <view class="row" style="font-size: 34rpx;"><view>等待付款</view></view>
    <view class="order-price">订单金额(含运费):¥<text>6.66</text></view>
  </view>

  <!--收货地址  -->
  <view class="fui-list-group" hover-class="none">
    <navigator class="fui-list">
      <view class="fui-list-media"><view class="fui-list-icon"><i class="icox icox-dingwei1"></i></view></view>
      <view class="fui-list-inner">
        <view style="font-size:14px;line-height: 1.2rem;height: 1.2rem;">小花花 15888888888</view>
        <view style="font-size:13px;color:#666">山东省青岛市市北区 101</view>
      </view>
    </navigator>
  </view>

  <!--商品信息  -->
  <view class="fui-list-group" style="padding-bottom: 20rpx;">
    <view class="fui-list-group-title">
      <view class="fui-list-icon"><i class="icox icox-dianpu1"></i></view>
      <view class="text">店铺名</view>
    </view>
    <navigator class="fui-list goods-item">
      <view class="fui-list-media">
        <image class="goods_img" src="https://api.clubmall.cn/attachment/images/7/2017/11/qg6S1Gb6DKM4I16KW4NMGDCkdcko1B.jpg"></image>
      </view>
      <view class="fui-list-inner" style="height: 140rpx;padding-right: 20rpx;">
        <view class="text">商品标题商品标题商品标题商品标题</view>
      </view>
      <view class="price text-right" style="height: 140rpx;">
        <view class="text-right"><text>价格</text></view>
        <view class="text-right" style="color: #999;">x<text>1</text></view>
      </view>
    </navigator>
  </view>

  <view class="fui-cell-group price-cell-group">
    <view class="fui-cell">
      <view class="fui-cell-label">商品小计</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">￥0.00</view>
    </view>
    <view class="fui-cell">
      <view class="fui-cell-label">运费</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">￥0.00</view>
    </view>
    <view class="fui-cell">
      <view class="fui-cell-label" style="width: 300rpx">实付款（含运费）</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark" style="color: #ff5555;">￥0.00</view>
    </view>
  </view>

  <!--订单信息  -->
  <view class="fui-cell-group">
    <view class="order-info">
      <view class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">订单编号：SH20180123091357834266</text>
      </view>
      <view class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">订单编号：SH20180123091357834266</text>
      </view>
      <view class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">订单编号：SH20180123091357834266</text>
      </view>
    </view>
  </view>

  <!--底部  -->
  <view class="fui-footer">
    <button class="btn btn-default btn-default-o pull-left">返回首页</button>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
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
@import "../../../../static/css/order.css";
.bg{
  background: -moz-linear-gradient(left, #ff795a 0%, #ff4141 100%);
    background: -webkit-linear-gradient(left, #ff795a 0%,#ff4141 100%);
    background: -o-linear-gradient(left, #ff795a 0%,#ff4141 100%);
    background: -ms-linear-gradient(left, #ff795a 0%,#ff4141 100%);
    background: linear-gradient(to right, #ff795a 0%,#ff4141 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ff795a, endColorstr=#ff4141,gradientType='1');
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
    height: 160rpx;
    color: #fff;
}

.order-info{
    padding: 20rpx 0
}
.order-info view{
    padding: 6rpx 25rpx;
    color: #666;
    font-size: 28rpx;
}
.btn{
  height:56rpx;
  line-height:52rpx;
  border-radius: 40rpx;
  padding: 0 26rpx;
  margin-top: 24rpx;
  font-size: 26rpx
}

.text-right{
  font-size: 26rpx;
}
</style>