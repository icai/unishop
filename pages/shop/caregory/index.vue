<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page navbar" v-if="show">
    <!--搜索start-->
    <view class="category-search">
        <view class="weui-flex">
            <view class="weui-flex__item category-search-form">
                <view class="flex-head-search" id="searchBar">
                    <navigator class="weui-search-bar__form" open-type="navigate" hover-class="none" url="/pages/goods/index/index?fromsearch=1">
                        <view class="weui-search-bar__box category-search-box">
                            <view class="flex-icon-search">

                                                    <i class="icox icox-search" style="color: #b4b4b4;"></i>
                            </view>
                            <view class="weui-search-bar__input flex-input">输入关键字进行搜索</view>
                            <navigator url="javascript:" class="weui-icon-clear" id="searchClear"></navigator>
                        </view>
                    </navigator>
                </view>
            </view>
        </view>
    </view>
    <!--搜索end-->
    <!--分类start-->
    <view class="category-content category-search-bar weui-flex">
        <block v-if="set.level>1">
            <view class="category-content-left">
                <scroll-view class="scroll-view_H" scroll-y="true" style="height: 100%;">
                    <view :class="'content-left-item ' + (selector==0?'active':'')" @tap="tabCategory" data-id="0" :data-src="set.advimg" :data-child="recommands">推荐分类</view>
                    <block v-for="(item, index) in category" :key="index">
                        <view :class="'content-left-item ' + (selector==item.id?'active':'')" @tap="tabCategory" :data-id="item.id" :data-src="item.advimg" :data-url="item.advurl" :data-child="item.child">
                                {{item.name}}
                        </view>
                    </block>
                </scroll-view>
            </view>
        </block>

        <view class="category-ceontet-right weui-flex__item">
            <scroll-view class="scroll-view_H" scroll-y="true" style="height:100%;">
                <view class="content-right-item">
                    <block v-if="set.level>1 && advimg">
                        <view class style="width:100%;display:block;margin-bottom:28rpx">
                            <navigator id="advurl" class="swipe external" :url="advurl">
                                <image id="advimg" :src="advimg" mode="widthFix"></image>
                            </navigator>
                        </view>
                    </block>
                    <block v-if="set.level==1">
                        <view class="fui-title">所有分类</view>
                        <view class="fui-icon-group col-3">  
                            <navigator class="fui-icon-col block" url="/pages/goods/index/index" open-type="navigate">
                                <view :class="'icon ' + (set.style==0?'radio':'')"><text class="icox icox-app"></text></view>
                                <view class="text">所有商品</view>
                            </navigator>
                            <block v-for="(item, index) in category" :key="index">
                                <navigator :url="'/pages/goods/index/index?cate=' + item.id" class="fui-icon-col" open-type="navigate">
                                    <view :class="'icon ' + (set.style==0?'radio':'')">
                                        <image :src="item.advimg"></image>
                                    </view>
                                    <view class="text">{{item.name}}</view>
                                </navigator>
                            </block>
                        </view>
                    </block>
                    <block v-if="set.level>1">
                        <view class="fui-icon-group col-3">  
                            <navigator class="fui-icon-col " v-if="selector==0 && back==0" url="/pages/goods/index/index" open-type="navigate">
                                <view :class="'icon ' + (set.style==0?'radio':'')"><text class="icox icox-app"></text></view>
                                <view class="text">所有商品</view>
                            </navigator>
                            <block v-if="set.level==2">
                                <block v-for="(item, index) in child" :key="index">
                                    <navigator :url="'/pages/goods/index/index?cate=' + item.id" open-type="navigate" class="fui-icon-col" v-if="set.level>=item.level">
                                        <view :class="'icon ' + (set.style==0?'radio':'')">
                                            <image :src="item.thumb||icons.nopic"></image>
                                        </view>
                                        <view class="text">{{item.name}}</view>
                                    </navigator>
                                </block>
                            </block>
                            <block v-if="set.level==3">
                              <block v-if="set.show==0">
                                    <block v-if="selector==0">
                                         <block v-if="back==1">
                                          <navigator class="fui-icon-col" @tap="backParent" :data-id="selector" :data-parent="parent">
                                              <view :class="'icon ' + (set.style==0?'radio':'')">
                                                  <text class="icox icox-toleft"></text>
                                              </view>
                                              <view class="text">返回上一级</view>
                                          </navigator>
                                        </block>
                                        <navigator :url="(item.child.length>0?'':'/pages/goods/index/index?cate='+item.id)" open-type="navigate" class="fui-icon-col" v-for="(item, index) in child" :key="index" @tap="item.child.length>0?'cateChild':''" :data-child="item.child" :data-parent="child">
                                          <view :class="'icon ' + (set.style==0?'radio':'')">
                                              <image :src="item.thumb||icons.nopic"></image>
                                          </view>
                                          <view class="text">{{item.name}}</view>
                                      </navigator>
                                    </block>
                                    <block v-else>
                                      <view v-for="(item, index) in child" :key="index" style="overflow:hidden">
                                          <view style="font-size:28rpx"> {{item.name}}</view> 
                                            <block v-for="(items, index2) in item.child" :key="index2">
                                            <navigator :url="'/pages/goods/index/index?cate=' + items.id" class="fui-icon-col str">
                                                <view :class="'icon ' + (set.style==0?'radio':'')">
                                                    <image :src="items.thumb||icons.nopic" @error="error"></image>
                                                </view>
                                                <view class="text" style="line-height:50px">{{items.name}}</view>
                                            </navigator> 
                                          </block>  
                                      </view> 
                                    </block>
                              </block>
                              <block v-else>
                                <block v-if="back==1">
                                  <navigator class="fui-icon-col" @tap="backParent" :data-id="selector" :data-parent="parent">
                                      <view :class="'icon ' + (set.style==0?'radio':'')">
                                          <text class="icox icox-toleft"></text>
                                      </view>
                                      <view class="text">返回上一级</view>
                                  </navigator>
                                </block>
                                <block v-for="(item, index) in child" :key="index">
                                    <navigator :url="(item.child.length>0?'':'/pages/goods/index/index?cate='+item.id)" class="fui-icon-col str" :data-child="item.child" :data-parent="child" @tap="item.child.length>0?'cateChild':''">
                                        <view :class="'icon ' + (set.style==0?'radio':'')">
                                            <image :src="item.thumb||icons.nopic" @error="error"></image>
                                        </view>
                                        <view class="text">{{item.name}}</view>
                                    </navigator> 
                                </block>
                              </block>  
                            </block>
                        </view>
                    </block>
                    
                </view>
            </scroll-view>
        </view>
    </view>
    <!--分类end-->

    <!--公用底部菜单-->
    <include src="/pages/common/menu.wxml"></include>
</view>
</view>
</template>

<script>
// pages/shop/caregory/index.js
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      route: 'category',
      category: {},
      icons: app.requirejs('icons'),
      selector: 0,
      //当前分类
      advimg: '',
      //分类广告
      advurl: '',
      recommands: {},
      //推荐分类
      level: 0,
      //分类显示等级
      back: 0,
      //返回上一级
      child: {},
      parent: {}
    };
  },

  onShareAppMessage: function () {
    return core.onShareAppMessage();
  },
  onLoad: function (options) {
    app.url(options);
    this.getCategory();
  },
  onShow: function () {// 页面初始化
  },
  components: {},
  props: {},
  methods: {
    // 二级分类绑定事件
    tabCategory: function (event) {
      this.setData({
        selector: event.target.dataset.id,
        advimg: event.target.dataset.src,
        advurl: event.target.dataset.url,
        child: event.target.dataset.child,
        back: 0
      });

      if ($.isEmptyObject(event.target.dataset.child)) {
        this.setData({
          level: 0
        });
      } else {
        this.setData({
          level: 1
        });
      }
    },
    //三级分类绑定事件
    cateChild: function (event) {
      this.setData({
        parent: event.currentTarget.dataset.parent,
        child: event.currentTarget.dataset.child,
        back: 1
      });
    },
    //返回上一级
    backParent: function (event) {
      this.setData({
        child: event.currentTarget.dataset.parent,
        back: 0
      });
    },
    //
    getCategory: function () {
      var $this = this;
      core.get('shop/get_category', {}, function (result) {
        $this.setData({
          category: result.category,
          show: true,
          set: result.set,
          advimg: result.set.advimg,
          recommands: result.recommands,
          child: result.recommands
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
/**
 * 
 * category.css
 * 
 * @create 2017-01-06
 * @author 咖啡 
 * 
 * 
 */
.flex-head {
	}.flex-head .flex-head-item {
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
	/* overflow:hidden; */
	position:relative;
	text-align:center;
	/* text-overflow:ellipsis; */
	/* white-space:nowrap; */
  line-height: 46rpx;
    font-size: 26rpx;
    color: #000;
    padding: 24rpx 4rpx;
    /* height: 100rpx; */
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
.fui-goods-item .detail .price {
	position:relative;
	display:-webkit-box;
	display:-webkit-flex;
	display:-ms-flexbox;
	display:flex;
	-webkit-box-align:center;
	-webkit-align-items:center;
	-ms-flex-align:center;
	align-items:center;
	font-size:34rpx;
	margin-top:12rpx;
}
.fui-icon-group.col-3 .fui-icon-col {
  margin-right: 20rpx;
  box-sizing: border-box;
  width: 30%;
}
.content-right-item .fui-icon-group.col-3 .fui-icon-col:nth-of-type(3n) {
  margin-right: 0
}
.fui-icon-group .fui-icon-col .icon {
   height: 145rpx;
   line-height: 145rpx;
}
.fui-icon-group .fui-icon-col .icon.radio image{
  border-radius: 50%
}
.fui-icon-group .fui-icon-col .icon .icox {
  font-size: 80rpx;
  color: #ccc;
}
.fui-icon-group .fui-icon-col .icon wx-image {
  height: 145rpx ;
  width: 145rpx
}
.fui-icon-group .fui-icon-col .text{
  width: auto;
}
</style>