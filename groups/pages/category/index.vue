<template>
<!--pages/groups/category/index.wxml-->
 <view class="page groups" :style="(isIpx?'padding-bottom:168rpx':'')">
  <view class="fui-header flex">
    <view class="searchbar flex1">
        <text class="icox icox-search"></text>
        <input name="search" @confirm="bindSearch" @input="bindInput" @focus="bindFocus" placeholder="输入关键字进行搜索" :value="params.keywords" :focus="focusin"></input>
    </view>
    <view v-if="fromsearch" class="cancel" @tap="bindback">取消</view>
  </view>
  <!--热卖  -->
 <view class="fui-list-group" v-if="!empty">
  <navigator :url="'../goods/index?id=' + item.id" class="fui-list" v-for="(item, index) in list" :key="index">
    <view class="fui-list-media">
       <image class="radius" :src="item.thumb">
      </image>
    </view>
    <view class="fui-list-inner">
      <view class="des">
      <text class="person">{{item.groupnum}}人团</text>{{item.title}}
      </view>
      <text class="line">原价￥{{item.price}}</text>
      <view class="price">
        <text>￥{{item.groupsprice}}</text>
        <view class="groupbtn">去拼团</view>
      </view>
    </view>
  </navigator>
</view> 

<!--数据为空  -->
 <view class="empty" v-if="empty">
  <image src="/static/images/search_empty.png"></image>
  <view class="text">未找到任何活动</view>
  <view hover-class="none" class="btn btn-danger-o" @tap="back">返回上一页</view>
  <navigator url="../index/index" hover-class="none" class="btn btn-danger">去首页</navigator>
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
    <navigator url="../category/index" class="nav-item active" hover-class="none" open-type="reLaunch">
      <span class="icox icox-quanbukanjia"></span>
      <span class="label">活动列表</span>
    </navigator>
    <navigator class="nav-item" hover-class="none" url="../order/index" open-type="reLaunch">  
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
// pages/groups/category/index.js
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      page: 1,
      list: [],
      defaults: {
        keywords: '',
        isrecommand: '',
        ishot: '',
        isnew: '',
        isdiscount: '',
        issendfree: '',
        istime: '',
        cate: '',
        order: '',
        by: 'desc',
        merchid: 0
      }
    };
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

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
  onReachBottom: function () {
    if (this.loaded || this.res.list.length == this.total) {
      return;
    }

    this.getList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar',
        options: options
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: '',
        options: options
      });
    }

    var id = $this.data.options.id || '';
    $this.getList();
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this;
      core.post('groups.list', {
        category: $this.data.options.id,
        page: $this.data.page
      }, function (result) {
        if (result.error == 0) {
          if (result.list.length <= 0) {
            $this.setData({
              res: result,
              empty: true
            });
          } else {
            $this.setData({
              page: $this.data.page + 1,
              res: result,
              list: $this.data.list.concat(result.list),
              empty: false
            });
          }

          if (result.list.length < result.pagesize) {
            $this.setData({
              loaded: true
            });
          }
        } else {}
      });
    },
    bindSearch: function (e) {
      var $this = this;
      var keywords = e.detail.value;
      core.get('groups.list', {
        keyword: keywords
      }, function (res) {
        if (res.list.length <= 0) {
          $this.setData({
            empty: true
          });
        } else {
          $this.setData({
            empty: false
          });
        }

        $this.setData({
          list: res.list
        });
      });
    },
    back: function () {
      wx.navigateBack({
        delta: 1
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
/* pages/groups/category/index.wxss */
.page{
  padding-bottom: 100rpx
}
.fui-header::after{
  display: none
}

.fui-header .searchbar{
  position: relative
}
.fui-header .cancel{
  width: 80rpx;
}
.fui-header .searchbar text.icox {
    height: 36rpx;
    vertical-align: middle;
    position: absolute;
    top: 15rpx;
    left: 30rpx;
    color: #999;
}
.fui-header .searchbar input {
    background: #fff;
    border-radius: 8rpx;
    padding-left: 62rpx;
    font-size: 24rpx;
    color:#999999;
    height: 60rpx;
    line-height:60rpx;
    border: none;
    margin: 0 20rpx;
}
.fui-header .icon {
    padding-right: 4rpx;
}
.fui-header .cancel {
    font-size: 30rpx;
    color: #666;
}
.groups .fui-list-group{
  margin-top: 88rpx;
  padding: 0;
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
  line-height: 40rpx;
  color: #333;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  margin-top: 30rpx
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
.empty .btn{
  width: 300rpx;
  height: 72rpx;
  border-radius: 72rpx;
  line-height: 72rpx
}
</style>