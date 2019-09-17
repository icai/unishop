<template>
<view class="page">
  <navigator open-type="navigate" hover-class="none" class="my-list" v-for="(item, index) in list" :key="index">
    <view class="my-list-media">
      <image :src="item.avatar"></image>
    </view>
    <view class="my-list-inner">
      <view class="text">
        <view class="title">{{item.nickname}}</view>
        <view class="subtitle">注册时间：{{item.createtime}}</view>
      </view>
      <view class="nums">
        <view class="num">+{{item.moneycount}}</view>
        <view class="num-order">{{item.ordercount}}个订单</view>
      </view>
    </view>
    <view class="my-list-remark noremark"></view>
  </navigator>
  <view class="fui-loading" v-if="loading">
    <view class="icon"></view>
    <view class="text">正在加载</view>
  </view>
   <view class="fui-loading empty" v-if="list.length==total && total>0 && total > 10 && loading == false">
    <view class="text">没有更多了</view>
  </view> 
  <view class="fui-loading empty" v-if="total<=0 && !loading">
    <view class="text">暂时没有任何下线</view>
  </view>
</view>



<!-- <include src="/dividend/common/footbar.wxml" /> -->
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
      loading: false
    };
  },

  onLoad: function () {
    var $this = this;
    var args = {
      page: 1
    };
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
      console.error($this.data.loading);
      core.get('dividend/down', args, function (res) {
        console.error(res);

        if (res.error == 0) {
          if (res.list.length > 0) {
            var list = $this.data.list.concat(res.list);
            args.page = args.page + 1;
          }

          $this.setData({
            member: res.member,
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
page{
  background: #fff;
}
.nomargin{
  margin-top: 0;
}


.my-list{
  position: relative;
	display: flex;
	padding: 30rpx 24rpx;
	align-items: center;
	overflow: hidden;
}
.my-list-media image{
  border-radius: 50%;
  width: 80rpx;
  height: 80rpx;
}

.my-list-inner{
  padding-left: 24rpx;
  flex: 1;
  display: flex;
  justify-content: space-between;
}
.my-list-inner .text,.my-list-inner .nums{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.my-list-inner .title{
  font-size: 28rpx;
  color: #333;
}
.my-list-inner .subtitle{
  font-size: 24rpx;
  color: #666;
}
.my-list-inner .num{
  font-size: 24rpx;
  color: #000;
  text-align: right;
}
.my-list-inner .num-order{
  font-size: 24rpx;
  color: #666;
  text-align: right;
}
.my-list-remark{
  position: relative;
  /* width: 30rpx; */
}
.my-list-remark::before{
  position: absolute;
  content: " ";
	display: inline-block;
	transform: rotate(45deg);
	height: 16rpx;
	width: 16rpx;
	border-width: 1px 1px 0 0;
	border-color: #C8C8CD;
	border-style: solid;
	top: -1px;
	margin-left: .3em;
}
.my-list-remark.noremark::before{
  display: none;
}
.my-list:before{
  content: " ";
	position: absolute;
	bottom: 0;
	right: 0;
	height: 0;
	border-bottom: 1rpx solid #ebebeb;
	transform-origin: 0 0;
	transform: scaleY(0.5);
	left: 0;
}


.fui-loading.line .text,
.fui-loading.empty .text{
  background: #fff;
}
</style>