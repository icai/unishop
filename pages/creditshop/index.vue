<template>
<view>
<loading :hidden="hidden" @change="loadingChange">
    加载中...
  </loading>  
<!--搜索start-->
<view class="category-search">
  <view class="weui-flex">
    <view class="weui-flex__item category-search-form">
      <view class="flex-head-search" id="searchBar">
        <navigator class="weui-search-bar__form" open-type="navigate" hover-class="none" url>
          <view class="weui-search-bar__box category-search-box">
            <view class="flex-icon-search">
              <i class="icox icox-search" style="color: #b4b4b4;"></i>
            </view>
            <input class="weui-search-bar__input flex-input" type="text" @focus="focus" @input="doinput" placeholder="输入关键字进行搜索"></input>
            <view :class="'searchbar-cancel searchbtn ' + showbtn" style="top: 0; right: 0" @tap="search">搜索</view>
            <navigator url="javascript:" class="weui-icon-clear" id="searchClear"></navigator>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</view>
<!--搜索end-->
<!--图片start-->
  <swiper class="con-pic" :indicatorDots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular">
      <block v-for="(item, index) in imgUrls" :key="index">
        <swiper-item>
          <image :src="item.thumb"></image>
        </swiper-item>
      </block>
  </swiper>
<!--图片end-->
<!--tab start-->
<view class="menu">
  <navigator class="item first" open-type="navigate" url="/pages/creditshop/creditlog/index">我的{{sysset.texts.credit || "积分"}}</navigator>
  <navigator class="item" open-type="navigate" url="/pages/creditshop/log/index">兑换记录</navigator>
</view>
<!--tab end-->

<!--分类按钮 start  -->
<view class="fui-icon-group noborder col-4" style="background: #ffffff">
  <block v-for="(item, index) in category" :key="index">
    <navigator class="fui-icon-col external" :url="'/pages/creditshop/lists/index?cate=' + item.id" data-nocache="true">
      <view class="icon">
        <image :src="item.thumb"></image>
      </view>
      <view class="text" style="color: #666666;">{{item.name}}</view>
    </navigator>
  </block>
</view>
<!--分类按钮 end  -->

<!--  -->
<view class="fui-cell-group fui-cell-click" style="margin-top: 20rpx; background-color: #ffffff;" v-if="lotterydraws.length > 0">
  <navigator class="fui-cell">
    <view class="fui-cell-text" style="color: #333333;">抽奖专区</view>
    <view class="fui-cell-remark" style="color: #888888;font-size: 26rpx;display:none;" @tap="changeTo" data-url="/pages/creditshop/lists/index">更多</view>
  </navigator>
</view>
<scroll-view scroll-x="true" class="fui-goods-group block" style="height: auto;white-space: nowrap;background: #fff;" v-if="lotterydraws.length > 0">
   <span class="fui-goods-item" style="display: inline-block;float: none;width:270rpx;padding:0;margin-right:20rpx" v-for="(item, index) in lotterydraws" :key="index" :data-gid="item.id" data-url="/pages/creditshop/detail/index" @tap="changeTo">
    <view class="image" data-text="推荐" :style="'background-image: url(' + item.thumb + ')'">
    </view>
    <view class="detail">
      <view class="name" style="color: #262626; white-space: initial;">{{item.title}} </view>
      <view class="price">
        <span class="text" style="color: #ed2822;font-size: 30rpx;">
          <p style="text-overflow:ellipsis;display: -webkit-box;overflow:hidden;-webkit-line-clamp: 1;-webkit-box-orient: vertical;word-break: break-all">{{item.credit}}
            <span style="font-size: 20rpx;">{{sysset.texts.credit || "积分"}}</span><span v-if="item.money>0">+￥{{item.money}}</span>
          </p>
        </span>
      </view>
    </view>
  </span>
</scroll-view>

<!--  -->
<view class="fui-cell-group fui-cell-click" style="margin-top: 20rpx; background-color: #ffffff;" v-if="exchanges.length > 0">
  <navigator class="fui-cell">
    <view class="fui-cell-text" style="color: #333333;">商品兑换</view>
    <view class="fui-cell-remark" style="color: #888888;font-size: 26rpx;display:none;" @tap="changeTo" data-url="/pages/creditshop/lists/index">更多</view>
  </navigator>
</view>
<scroll-view scroll-x="true" class="fui-goods-group block" style="height: auto;white-space: nowrap;background: #fff;" v-if="exchanges.length > 0">

   <span class="fui-goods-item" style="display: inline-block;float: none;width:270rpx;padding:0;margin-right:20rpx" v-for="(item, index) in exchanges" :key="index" :data-gid="item.id" data-url="/pages/creditshop/detail/index" @tap="changeTo">
    <view class="image" data-text="推荐" :style="'background-image: url(' + item.thumb + ')'">
    </view>
    <view class="detail">
      <view class="name" style="color: #262626; white-space: initial;">{{item.title}} </view>
      <view class="price">
        <span class="text" style="color: #ed2822;font-size: 30rpx;">
          <p style="text-overflow:ellipsis;display: -webkit-box;overflow:hidden;-webkit-line-clamp: 1;-webkit-box-orient: vertical;word-break: break-all">{{item.credit}}
            <span style="font-size: 20rpx;">{{sysset.texts.credit || "积分"}}</span><span v-if="item.money>0">+￥{{item.money}}</span>
          </p>
        </span>
      </view>
    </view>
  </span>

</scroll-view>

<view class="fui-cell-group fui-cell-click" style="margin-top: 20rpx; background-color: #ffffff;" v-if="coupons.length > 0">
  <navigator class="fui-cell">
    <view class="fui-cell-text" style="color: #333333;">商城优惠券</view>
    <view class="fui-cell-remark" style="color: #888888;font-size: 26rpx;display:none;" @tap="changeTo" data-url="/pages/creditshop/lists/index">更多</view>
  </navigator>
</view>
<scroll-view scroll-x="true" class="fui-goods-group block" style="height: auto;white-space: nowrap;background: #fff;" v-if="coupons.length > 0">
   <span class="fui-goods-item" style="display: inline-block;float: none;width:270rpx;padding:0;margin-right:20rpx" v-for="(item, index) in coupons" :key="index" :data-gid="item.id" data-url="/pages/creditshop/detail/index" @tap="changeTo">
    <view class="image" data-text="推荐" :style="'background-image: url(' + item.thumb + ')'">
    </view>
    <view class="detail">
      <view class="name" style="color: #262626; white-space: initial;">{{item.title}} </view>
      <view class="price">
        <span class="text" style="color: #ed2822;font-size: 30rpx;">
          <p style="text-overflow:ellipsis;display: -webkit-box;overflow:hidden;-webkit-line-clamp: 1;-webkit-box-orient: vertical;word-break: break-all">{{item.credit}}
            <span style="font-size: 20rpx;">{{sysset.texts.credit || "积分"}}</span><span v-if="item.money>0">+￥{{item.money}}</span>
          </p>
        </span>
      </view>
    </view>
  </span>
</scroll-view>

<view class="fui-cell-group fui-cell-click" style="margin-top: 20rpx; background-color: #ffffff;" v-if="balances.length > 0">
  <navigator class="fui-cell">
    <view class="fui-cell-text" style="color: #333333;">余额兑换</view>
    <view class="fui-cell-remark" style="color: #888888;font-size: 26rpx;display:none;" @tap="changeTo" data-url="/pages/creditshop/lists/index">更多</view>
  </navigator>
</view>
<scroll-view scroll-x="true" class="fui-goods-group block" style="height: auto;white-space: nowrap;background: #fff;" v-if="balances.length > 0">
  <block v-for="(item, index) in balances" :key="index">
    <navigator :url="'/pages/creditshop/detail/index?id=' + item.id" class="fui-goods-item" style="display: inline-block;float: none;width:270rpx;padding:0;margin-right:20rpx" hover-class="none" open-type="navigate">
      <view class="image" data-text="推荐" :style="'background-image: url(' + item.thumb + ')'"></view>
      <view class="detail">
        <view class="name" style="color: #262626; white-space: initial;">{{item.title}} </view>
        <view class="price">
          <span class="text" style="color: #ed2822;font-size: 30rpx;">
            <p style="text-overflow:ellipsis;display: -webkit-box;overflow:hidden;-webkit-line-clamp: 1;-webkit-box-orient: vertical;word-break: break-all">{{item.credit}}
              <span style="font-size: 20rpx;">{{sysset.texts.credit || "积分"}}</span><span v-if="item.money>0">+￥{{item.money}}</span>
            </p>
          </span>
        </view>
      </view>
    </navigator>
  </block>
</scroll-view>

<view class="fui-cell-group fui-cell-click" style="margin-top: 20rpx; background-color: #ffffff;" v-if="redbags.length > 0">
  <navigator class="fui-cell">
    <view class="fui-cell-text" style="color: #333333;">红包兑换</view>
    <view class="fui-cell-remark" style="color: #888888;font-size: 26rpx;display:none;" @tap="changeTo" data-url="/pages/creditshop/lists/index">更多</view>
  </navigator>
</view>
<scroll-view scroll-x="true" class="fui-goods-group block" style="height: auto;white-space: nowrap;background: #fff;" v-if="redbags.length > 0">
   <span class="fui-goods-item" style="display: inline-block;float: none;width:270rpx;padding:0;margin-right:20rpx" v-for="(item, index) in redbags" :key="index" :data-gid="item.id" data-url="/pages/creditshop/detail/index" @tap="changeTo">
    <view class="image" data-text="推荐" :style="'background-image: url(' + item.thumb + ')'">
    </view>
    <view class="detail">
      <view class="name" style="color: #262626; white-space: initial;">{{item.title}} </view>
      <view class="price">
        <span class="text" style="color: #ed2822;font-size: 30rpx;">
          <p style="text-overflow:ellipsis;display: -webkit-box;overflow:hidden;-webkit-line-clamp: 1;-webkit-box-orient: vertical;word-break: break-all">{{item.credit}}
            <span style="font-size: 20rpx;">{{sysset.texts.credit || "积分"}}</span><span v-if="item.money>0">+￥{{item.money}}</span>
          </p>
        </span>
      </view>
    </view>
  </span>
</scroll-view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      swiperCurrent: 0,
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 800,
      circular: true,
      //轮播图url
      imgUrls: [],
      //轮播图链接
      links: [],
      //参数
      params: {},
      //积分抽奖
      lotterydraws: [],
      //积分兑换
      exchanges: [],
      //优惠券
      coupons: [],
      //余额兑换
      balances: [],
      //红包兑换
      //redbags:[],
      category: [],
      hidden: false,
      keywords: ''
    };
  },

  onReady: function () {
    var $this = this;
    $this.get_index();
  },
  onLoad: function (options) {
    var $this = this;
  },
  components: {},
  props: {},
  methods: {
    doinput: function (e) {
      this.setData({
        keywords: e.detail.value
      });
    },
    search: function () {
      var url = '/pages/creditshop/lists/index?keywords=' + this.keywords;
      wx.navigateTo({
        url: url
      });
    },
    focus: function () {
      this.setData({
        showbtn: 'in'
      });
    },
    changeTo: function (e) {
      var url = e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.gid;
      wx.navigateTo({
        url: url
      });
    },
    get_index: function () {
      var $this = this;
      core.post('creditshop/index', $this.data.params, function (msg) {
        if (msg.error == 0) {
          $this.setData({
            imgUrls: msg.data.advs,
            category: msg.data.category,
            lotterydraws: msg.data.lotterydraws,
            exchanges: msg.data.exchanges,
            coupons: msg.data.coupons,
            balances: msg.data.balances,
            redbags: msg.data.redbags,
            sysset: msg.sysset
          });
        }

        $this.setData({
          hidden: true
        });
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
 @import "../../static/css/diypage.css"; 
.flex-head .flex-head-item {
	padding:0 16rpx;
}
.flex-head-search {
position:relative;
display:-webkit-box;
display:-webkit-flex;
display:flex;
box-sizing:border-box;
background:#f1f1f2;
padding:10px 10px;
}
.flex-icon-search {
position:absolute;
width:30px;
height:30px;
left:0px;
top:0px;
line-height:30px;
text-align:center;

}
.flex-icon-search .icox{
  position:absolute;
font-size:36rpx;
color:#b4b4b4;
top:0;
left:12rpx;
line-height:56rpx;

}
.flex-search-bar {
	padding-top:80rpx;
}
.flex-input {
	height:56rpx;
	line-height:56rpx;
	display:block;
	overflow:hidden;
}
.category-search {
	position:fixed;
	left:0;
	top:0;
	width:100%;
	z-index:100;
}
.category-search::before {
	background:#fff;
position:relative;
z-index:10;
height:auto;
padding-right:20rpx;
padding-left:20rpx;
background-color:#f7f7f8;
-webkit-backface-visibility:hidden;
backface-visibility:hidden;
overflow:hidden;

}
.category-search-form {
	background:#fff;
}
.category-search-box {
	/* background:#efefef; */
  display: flex;
}
.searchbar-cancel.searchbtn{
  width: 80rpx;
  background: #f1f1f2;
  height: 56rpx;
  text-align: right;
  color: #5f646e;
  line-height: 56rpx;
  display: none;
}
.searchbar-cancel.searchbtn.in{
  display: block;
}
.category-content {
	background:#fff;
	width:100%;
	position:absolute;
	left:0;
	top:0rpx;
	bottom:0px;
}
.category-search-bar {
	padding-top:98rpx;
}
.category-content-left {
	width:210rpx;
	height:100%;
	background:#f8f8f8;
}
.content-left-item {
	overflow:hidden;
	position:relative;
	text-align:center;
	text-overflow:ellipsis;
	white-space:nowrap;
  line-height: 100rpx;
    font-size: 26rpx;
    color: #000;
    padding: 0 4rpx;
    height: 100rpx;
}
.content-left-item.active {
	background:#fff;
	color:#ff5555;
}
.content-left-item.active::before {
	position:absolute;
	content:'';
	left:0;
	top:0;
	right:auto;
	bottom:0;
	border-left:8rpx solid #ff5555;
  z-index: 2;
}
.fui-icon-group .fui-icon-col .text {
    font-size: 24rpx;
    line-height: 41rpx;
}
.fui-icon-group {
    border: 0;
    margin-top: 0
}
.content-right-item {
	height:100%;
	box-sizing:border-box;
	padding:32rpx;
}
.content-right-item .fui-icon-group .fui-icon-col::before {
	border:none;
}
#advimg {
	width:100%;
}
.block {
	display:block;
}
.none {
	display:none;
}
.weui-search-bar__input {
	text-align:left;
  color:#999999;
  background:none;
  line-height:30px;
  padding:0 10rpx 0 60rpx;
}
.con-pic{
  height: 427rpx;
  margin-top: 100rpx;
}
.con-pic image{
  width: 100%;
  height: 100%
}

.menu{
  height: 82rpx;
  display: flex;
  background: #fff;
  font-size: 24rpx;
  color: #666;
  position: relative;
}
.menu .item{
  flex: 1;
  text-align: center;
  line-height: 82rpx;
  position: relative;
}
.menu:after{
  content: " ";
	position: absolute;
	left: 20rpx;
	right: 20rpx;
	bottom: 0rpx;
	height: 1rpx;
	border-top: 1rpx solid #ebebeb;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.menu .item.first:after{
  content: " ";
	position: absolute;
	top: 20rpx;
	bottom: 20rpx;
	right: -1rpx;
	width: 1rpx;
  height: 80rpx;
	border-right: 1rpx solid #ebebeb;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}

.fui-icon-group .fui-icon-col .icon image {
    height: 88rpx;
    width: 88rpx;
}
.fui-icon-group .fui-icon-col .text {
    padding-top: 20rpx;
}

.fui-cell-group{
  border-bottom: 1rpx solid #ededed;
}

.weui-search-bar__form{
  border: none;
}

.fui-goods-item .detail .price{
  
}
.fui-goods-group.block{
  padding: 10rpx 0 10rpx 24rpx;
  width: 740rpx;
}
::-webkit-scrollbar{
  width: 0;
  height: 0;
  color: transparent
}
</style>