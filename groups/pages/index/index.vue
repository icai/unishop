<template>
<!--pages/groups/imdex/index.wxml-->
<view class="page" :style="(isIpx?'padding-bottom:168rpx':'')">
<!--幻灯片  -->
  <!-- <view class='banner'>
   <swiper style='height:{{advheight}}rpx'>
     <block wx:for="{{res.advs}}">
        <swiper-item>
          <image src="{{item.thumb}}" class="slide-image" style='width:750rpx;height:auto' mode='widthFix' bindload='advheight' bindtap='navigate' data-link = "{{item.link}}"/>
        </swiper-item>
      </block>
   </swiper>
  </view> -->
<!--分类  -->
<block v-if="res.category.length>0 || res.recgoods.length>0">
  <view class="fui-icon-group noborder col-4">
    <navigator :url="'../category/index?id=' + item.id" class="fui-icon-col external" v-for="(item, index) in res.category" :key="index">
          <view class="icon">
            <image class="radius" :src="item.thumb">
            </image>
          </view> 
          <view class="text">
            {{item.name}}
          </view>
      </navigator>
  </view>
  <!--热卖  -->
  <view class="fui-list-group">
    <navigator class="fui-list" :url="'../goods/index?id=' + item.id" v-for="(item, index) in res.recgoods" :key="index">
      <view class="fui-list-media">
        <image class="radius" :src="item.thumb">
            </image>
      </view>
      <view class="fui-list-inner">
        <view class="des">
        <text class="person">{{item.is_ladder==1?"阶梯团":item.groupnum + "人团"}}</text>{{item.title}}
        </view>
        <text class="line">原价￥{{item.price}}</text>
        <view class="price">
          <text>￥{{item.groupsprice}}</text>
          <view class="groupbtn">去拼团</view>
        </view>
      </view>
    </navigator>
  </view>
</block>
<view class="backHome"></view>
<!--数据为空  -->
 <view class="empty" v-if="res.recgoods.length == 0">
  <image src="/static/images/search_empty.png"></image>
  <view class="text">未找到任何活动</view>
</view> 

<!--底部导航  -->
<view :class="'fui-navbar footer-nav ' + iphonexnavbar">
    <navigator url="/pages/index/index" class="nav-item" hover-class="none" open-type="switchTab">
      <span class="icox icox-back"></span>
      <span class="label">返回商城</span>
    </navigator>
    <navigator class="nav-item active" hover-class="none" open-type="reLaunch">
      <span class="icox icox-shouye1"></span>
      <span class="label">拼团首页</span>
    </navigator>
    <navigator url="../category/index" class="nav-item" hover-class="none" open-type="reLaunch">
      <span class="icox icox-quanbukanjia"></span>
      <span class="label">活动列表</span>
    </navigator>
    <navigator url="../order/index" class="nav-item" hover-class="none" open-type="reLaunch">  
      <span class="icox icox-kanjiazhong"></span>
      <span class="label">我的订单</span>
    </navigator>
    <navigator url="../mygroups/index" class="nav-item" hover-class="none" open-type="reLaunch">
      <span class="icox icox-yigoumai"></span>
      <span class="label">我的团</span>
    </navigator>
  </view>
  <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</template>

<script>
// pages/groups/imdex/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {};
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onReachBottom: function () {
    this.onPullDownRefresh();
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

    core.get('groups', {}, function (result) {
      $this.setData({
        res: result
      });
    });
  },
  onPullDownRefresh: function () {
    var $this = this;
    core.get('groups', {}, function (result) {
      if (result.error == 0) {
        $this.setData({
          res: result
        });
        wx.stopPullDownRefresh();
      }
    });
  },
  components: {},
  props: {},
  methods: {
    advheight: function (e) {
      var $this = this;
      var advratio = e.detail.width / e.detail.height;
      $this.setData({
        advheight: 750 / advratio
      });
    },
    navigate: function (e) {
      var link = core.pdata(e).link;
      wx.navigateTo({
        url: link,
        fail: function () {
          wx.switchTab({
            url: link
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
/* pages/groups/imdex/index.wxss */
.page{
  padding-bottom: 100rpx
}
/*分类  */
.fui-icon-group .fui-icon-col{
  padding: 32rpx 0 12rpx;
}
.fui-icon-group .fui-icon-col .icon image{
  height: 90rpx;
  width: 90rpx;
  border-radius: 50%
}
.fui-icon-group .fui-icon-col .text{
  line-height: 64rpx;
  color: #333;
  padding: 0
}

/*商品组  */
.fui-list-media image{
  width: 170rpx;
  height: 170rpx;
}
.fui-list{
  padding: 36rpx 24rpx;
}
.fui-list-inner{
  display: flex;
  height: 170rpx;
  flex-direction: column;
  justify-content: space-between
}
.fui-list-inner .des{
  font-size: 26rpx;
  line-height: 36rpx;
  color: #333;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: pre-wrap
}
.fui-list-inner .person{
  min-width: 90rpx;
  text-align: center;
  padding: 0 12rpx;
  box-shadow: 0 0 20rpx 0 rgba(255, 221, 221, 0.8);
  margin:0 10rpx;
  font-size: 22rpx;
  font-weight: bold;
  line-height: 34rpx;
  color: #ff6000;
  border-radius: 4rpx;
  display: inline-block;
  background-image: -webkit-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  background-image: -moz-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  background-image: -ms-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  background-image: -o-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.fui-list-inner .price{
  font-size: 36rpx;
  font-weight: bold;
  color: #ff5555;
  line-height: 36rpx
}
.fui-list-inner .price text{
  float: left
}
.fui-list-inner .line{
  font-size: 22rpx;
  color: #b2b2b2;
  font-weight: bold;
  text-decoration: line-through;
}
.fui-list-inner .price .groupbtn{
  width: 152rpx;
  line-height: 52rpx;
  background: #ff5555;
  color: #fff;
  text-align: center;
  border-radius: 10rpx;
  font-size: 24rpx;
  float: right;
   margin-top: -16rpx 
}
/*数据为空  */
.empty{
  text-align: center
}
.empty image{
  width: 240rpx;
  height: 240rpx;
  margin-top: 260rpx;
}
.empty .text{
  font-size: 28rpx;
  line-height: 110rpx;
  color: #999
}
.backHome{
  width: 
}
</style>