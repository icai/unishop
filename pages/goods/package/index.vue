<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="fui-list-group" v-for="(item, index) in list" :key="index">
      <navigator class="fui-list goods-item" :url="'/pages/goods/package/detail/index?id=' + item.id" open-type="redirect">
          <view class="fui-list-media">
              <image class="goods_img" :src="item.thumb"></image>
          </view>
          <view class="fui-list-inner">
              <view class="name">{{item.title}}</view>
              <view class="orderprice">
							  商品总价：<span> ¥{{item.goodsprice}} </span>
              </view>
              <view class="price">
							  <span class="text">套餐价：¥{{item.price}}</span>
              </view>
          </view>
           <view class="fui-list-angle"><view class="angle"></view></view>
      </navigator>
      <view class="fui-cell-group fui-comment-group">
        <view id="package">
          <navigator id="package_list" hover-class="none" :style="'width:' + item.goods.length*220-20 + 'rpx'" :url="'/pages/goods/package/detail/index?id=' + item.id" open-type="redirect">
            <view class="package-goods package-goods3" v-for="(item2, index2) in item.goods" :key="index2">
              <image class="package-goods-img" :src="item2.thumb"></image>
              <p>{{item2.title}}</p>
              <text class="icox icox-tianjiazhuanhuan"></text>
            </view>
          </navigator>
        </view>
      </view>
    </view>
    <!--公用底部菜单-->
    <include src="/pages/common/menu.wxml"></include>
</view>
</view>
</template>

<script>
/**
 *
 * package\index.js
 *
 * @create 2017-11-22
 * @author 牟俊羽
 *
 */
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      show: true
    };
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
  onLoad: function (options) {
    var $this = this;
    core.get('package.get_list', {
      goodsid: options.id
    }, function (result) {
      $this.setData({
        list: result.list
      });
    });
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
/* pages/goods/package/index.wxss */
fui-list-group{
  padding: 26rpx 24rpx
}
.fui-list-media image {
	width:120rpx;
  height: 120rpx;
}
.fui-list-media {
  margin-right: 32rpx
}
.fui-list-group .fui-list .fui-list-inner .name {
    max-height: 80rpx;
    height: auto;
    line-height: 40rpx;
    overflow: hidden;
    color: #000;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 28rpx;
}
.fui-list-group .fui-list .fui-list-inner  .orderprice{
    font-size: 26rpx;
    color: #999
}
.fui-list-group .fui-list .fui-list-inner  .orderprice span{
    text-decoration: line-through;
}
.fui-list-group .fui-list .fui-list-inner  .price {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 28rpx;
    padding-top: 4rpx;
}
.fui-list-group .fui-list .fui-list-inner .price .text {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #ff5555;
    font-size: 28rpx;
}
.fui-comment-group {
    background: #f2f5f7;
    margin-top: 0;
    padding-top:20rpx;
    position: relative ;
    overflow: visible
}
.fui-comment-group:after {
    content:" ";
    display:inline-block;
    -webkit-transform:rotate(-45deg);
    -ms-transform:rotate(-45deg);
    transform:rotate(-45deg);
    height:20rpx;
    width:20rpx;
    position:absolute;
    top: -10rpx;
    left: 78rpx;
    background: #f2f5f7;
}
#package{
  padding: 10rpx 0 20rpx 24rpx;
  font-size: 24rpx;
  overflow: auto;
}
#package_list {
  overflow: hidden;
}
#package_list .package-goods{
  width: 180rpx;
  margin-left: 40rpx;
  float: left;
  position: relative;
}
#package_list .package-goods .icox{
  position: absolute;
  top: 76rpx;
  right: -34rpx;
  color: #ADBDC5;
  font-size: 28rpx
}
#package_list .package-goods:first-child{
  margin-left: 0
}
#package_list .package-goods:last-child .icox{
  display: none
}
#package_list .package-goods image{
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 20rpx
}
#package_list .package-goods p{
  text-align: center;
  line-height: 32rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  white-space:normal;
}
</style>