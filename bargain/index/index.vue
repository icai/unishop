<template>
<view class="page navbar bargain">
<!--顶部搜索  -->
  <view class="fui-header flex">
    <view class="searchbar flex1">
        <text class="icox icox-search"></text>
        <input name="search" @confirm="bindSearch" @input="bindInput" @focus="bindFocus" placeholder="输入关键字进行搜索" :value="params.keywords" :focus="focusin"></input>
    </view>
    <view v-if="fromsearch" class="cancel" @tap="bindback">取消</view>
  </view>
  <!--砍价商品列表  -->
   <view class="fui-goods-group block" v-if="list">
    <view class="fui-goods-item pull-left" v-for="(item, index) in list" :key="index">
      <navigator :url="'../detail/detail?id=' + item.id" hover-class="none" open-type="navigate">
        <view class="image" :style="'background-image:url(' + item.thumb + ')'"></view>
      </navigator>
      <view class="detail goods_list_detail">
        <navigator url hover-class="none" open-type="navigate">
          <view class="name"><image src="/static/images/label.png"></image>{{ item.title }}</view>
        </navigator>
        <view class="price">
          <view class="text">
            <text v-if="item.type == 1">￥{{ item.end_price }}</text>
            <text v-else>砍多少减多少</text>
          </view>
          <view class="original_price">¥{{ item.minprice }}</view>
        </view>
      </view>
    </view>
	</view>  
  <!-- 暂无砍价商品 -->
  <view class="empty" v-if="!list">
    <view>暂无砍价商品</view>
  </view>   
  <!--未搜索到相应砍价商品  -->
    <view class="searchEmpty" v-if="emptyHint">
    <image src="/static/images/search_empty.png"></image>
    <view class="text">暂时没有任何商品</view>
  </view>  
  <!--底部导航  -->
  <view :class="'fui-navbar footer-nav ' + iphonexnavbar">
    <navigator url="/pages/index/index" class="nav-item" hover-class="none" open-type="switchTab">
      <span class="icox icox-shouye1"></span>
      <span class="label">商城首页</span>
    </navigator>
    <navigator url="../index/index" class="nav-item active" hover-class="none" open-type="redirect">
      <span class="icox icox-quanbukanjia"></span>
      <span class="label">全部砍价</span>
    </navigator>
    <navigator url="../act/act" class="nav-item" hover-class="none" open-type="redirect"> 
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
      list: {},
      emptyHint: false,
      label: "/static/images/label.png"
    };
  },

  onLoad: function () {
    var $this = this;
    core.get('bargain/get_list', {}, function (ret) {
      $this.setData({
        list: ret.list
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
    bindFocus: function () {
      this.setData({
        fromsearch: true
      });
    },
    bindback: function () {
      this.setData({
        fromsearch: false
      });
      this.onLoad();
    },
    bindSearch: function (e) {
      var $this = this;
      var keywords = e.detail.value;
      core.get('bargain/get_list', {
        keywords: keywords
      }, function (ret) {
        if (ret.list.length <= 0) {
          $this.setData({
            emptyHint: true
          });
        } else {
          $this.setData({
            emptyHint: false
          });
        }

        $this.setData({
          list: ret.list
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
.bargain .fui-goods-group{
  margin-top: 88rpx;
  padding: 0;
}
.fui-goods-group.block .fui-goods-item{
  padding: 0;
  padding-bottom: 16rpx;
}

.fui-goods-group.block .fui-goods-item:nth-child(2n-1){
  padding-right: 8rpx;
}
.fui-goods-group.block .fui-goods-item:nth-child(2n){
  padding-left: 8rpx;
}
.bargain .fui-goods-group.block .fui-goods-item .detail{
  padding: 10px 24rpx 14rpx
}
.fui-goods-item .detail .price{
  font-size: 26rpx;
  margin-top:14rpx;
}
.fui-goods-item .detail .price .text{
  font-weight: bold;
}
.fui-goods-item .detail .price .original_price{
  color: #999;
  font-size: 24rpx;
  text-decoration: line-through;
  margin-top: 2rpx
}
.name image{
  display: inline-block;
  width: 50rpx;
  height: 24rpx;
  vertical-align: middle;
  margin-top: -5rpx;
  margin-right: 10rpx
}
.bargain .empty{
  text-align: center;
  padding-top: 88rpx
}
.bargain .empty view{
  position: relative;
  font-size: 28rpx;
  color: #999;
  line-height: 128rpx;
  
}
.bargain .empty view:before{
  position: absolute;
  content: '';
  width: 140rpx;
  border-bottom: 1px solid #e5e5e5;
  top: 60rpx;
  left:130rpx
}
.bargain .empty view:after{
  position: absolute;
  content: '';
  width: 140rpx;
  border-bottom: 1px solid #e5e5e5;
  top: 60rpx;
  right:130rpx
}
.searchEmpty{
  text-align: center;
  padding-top: 196rpx;
}
.searchEmpty image{
  width: 240rpx;
  height: 240rpx;
}
.searchEmpty .text{
  line-height: 105rpx;
  font-size: 28rpx;
  color: #999
}
.flex{
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.flex1{
 -webkit-box-flex: 1;
-webkit-flex: 1;
-ms-flex: 1;
flex: 1;
}

</style>