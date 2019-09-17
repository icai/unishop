<template>
<!--pages/groups/mygroups/index.wxml-->
<view class="page" :style="(isIpx?'padding-bottom:168rpx':'')">
  <view class="fui-tab fixed" scroll-x="true" style="overflow-x:scroll">
    <view :class="'item ' + (success=='' || success == 0 ?'active':'')" @tap="tab" data-success="0">组团中</view>
    <view :class="'item ' + (success=='1'?'active':'')" @tap="tab" data-success="1">组团成功</view>
    <view :class="'item ' + (success=='-1'?'active':'')" @tap="tab" data-success="-1">组团失败</view>
  </view>

  <!--数据为空  -->
   <view class="empty" v-if="list.length==0">
    <image src="/static/images/icon/nolist.png"></image>
    <view class="text">暂时没有参加任何团</view>
  </view> 

  <!--团列表  -->
  <view class="group-list-group" v-if="list.length>0">
    <navigator class="group-list" :url="'../groups_detail/index?teamid=' + item.teamid" v-for="(item, index) in list" :key="index">
      <view class="group-list-header">
        <view class="fl">{{item.orderno}}</view>
        <view class="fr remark text-primary" v-if="item.success == 0">团购中</view>
        <view class="fr remark text-success" v-if="item.success == 1">团购成功</view>
        <view class="fr remark text-fail" v-if="item.success == -1">团购失败</view>
      </view>
      <view class="group-list-content flex">
        <view class="media">
          <image :src="item.thumb"></image>
        </view>
        <view class="inner flex1">
          <view class="title">{{item.title}}</view>
          <view class="text" v-if="item.more_spec == 1">规格：{{item.option_name}}</view>
        </view>
        <view class="remark">
          <view>￥{{item.goods_price}}/{{item.goodsnum}}{{item.units}}</view>
          <view class="num">x1</view>
        </view>
      </view>
      <view class="group-list-footer">
      共1件商品 实付:<text>￥{{item.amount}}</text>
      </view>
    </navigator>

  </view>

      <!--底部导航  -->
<view :class="'fui-navbar footer-nav ' + iphonexnavbar">
    <navigator url="/pages/index/index" class="nav-item" hover-class="none" open-type="switchTab">
      <span class="icox icox-back"></span>
      <span class="label">返回商城</span>
    </navigator>
    <navigator class="nav-item" hover-class="none" url="../index/index" open-type="reLaunch">
      <span class="icox icox-shouye1"></span>
      <span class="label">拼团首页</span>
    </navigator> 
    <navigator url="../category/index" class="nav-item " hover-class="none" open-type="reLaunch">
      <span class="icox icox-quanbukanjia"></span>
      <span class="label">活动列表</span>
    </navigator>
    <navigator class="nav-item" hover-class="none" url="../order/index" open-type="reLaunch">  
      <span class="icox icox-kanjiazhong"></span>
      <span class="label">我的订单</span>
    </navigator>
    <navigator class="nav-item active" hover-class="none">
      <span class="icox icox-yigoumai"></span>
      <span class="label">我的团</span>
    </navigator>
  </view>
  <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</template>

<script>
// pages/groups/category/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      showtab: 'do',
      success: '',
      page: 1,
      list: []
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.page + 1
    });
    this.get_list();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      list: []
    });
    this.get_list();
  },

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

    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function (e) {
      var $this = this;
      core.get('groups/team', {
        success: $this.data.success,
        page: $this.data.page
      }, function (result) {
        if (result.error == 0) {
          $this.setData({
            list: $this.data.list.concat(result.list)
          });
          wx.stopPullDownRefresh();
        }
      });
    },
    tab: function (e) {
      if (this.success == e.target.dataset.success) {
        return;
      }

      this.setData({
        success: e.target.dataset.success,
        page: 1,
        list: []
      });
      this.get_list();
    },
    selected: function (e) {
      this.setData({
        showtab: e.currentTarget.dataset.type
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
/* pages/groups/mygroups/index.wxss */
.page{
  padding-bottom: 100rpx
}
.text-success{
  color: #2ed06f
}
.text-primary{
  color: #ff8314
}
.text-fail{
  color: #666
}
.fui-tab .item.active {
	transition-duration: 300ms;
	transition-property: border-color;
  border-color: #ff5555;
  color: #ff5555;
  position: relative;
  z-index: 2
}
/*数据为空  */
.empty{
  text-align: center
}
.empty image{
  width: 240rpx;
  height: 240rpx;
  margin-top: 250rpx;
}
.empty .text{
  font-size: 28rpx;
  line-height: 110rpx;
  color: #999
}
/*团列表  */
.group-list-group{
  margin-top: 80rpx
}
.group-list{
  background: #fff;
  padding: 0 24rpx;
  margin-bottom: 20rpx
}
.group-list-header{
  height: 80rpx;
  line-height: 80rpx;
  font-size: 24rpx;
  color: #999;
  border-bottom: 1px solid #e6e6e6
}
.group-list-header .remark{
  position: relative;
}
.group-list-header .remark:after{
  content: " ";
	display: inline-block;
	transform: rotate(45deg);
	height: 14rpx;
	width: 14rpx;
	border-width: 1px 1px 0 0;
	border-color: #999;
	border-style: solid;
	position: relative;
	top: 0px;
	margin-left: .3em;
}
.fr{
  float: right
}
.fl{
  float: left
}
.group-list-content{
  padding: 30rpx 0;
}
.group-list-content image{
  width: 160rpx;
  height: 160rpx;
}
.group-list-content .inner{
  padding: 6rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.group-list-content .inner .title{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.group-list-content .inner .text{
  color: #999;
   overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.group-list-content .remark{
  font-size: 26rpx;
  color: #333;
  text-align: right;
  line-height: 42rpx
}
.group-list-content .remark .num{
  color: #999
}
.group-list-footer{
  text-align: right;
  height: 86rpx;
  line-height: 86rpx;
  font-size: 26rpx;
  color: #333;
  border-top: 1px solid #e6e6e6
}
.group-list-footer text{
  color: #ff5555
}
</style>