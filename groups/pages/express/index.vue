<template>
<view>
<!--pages/groups/express/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="fui-list-group">
        <view class="fui-list express-top">
            <view class="fui-list-media">
                <image :src="thumb"></image>
                <view class="goodsNum"><text>1</text>件商品</view>
            </view>
            <view class="fui-list-inner">
                <view class="fui-list-inner">
                    物流状态：<text class="text-success">{{ status }}</text>
                    <view class="text">快递公司：{{ com }}<text></text></view>
                    <view class="text">快递单号：{{ sn }}<text></text></view>
                </view>
            </view>
        </view>
        <view class="empty" v-if="!expresslist">
            <image src="/static/images/icon/deliver-48.png" class="light"></image>
            <view class="text-cancel">暂时没有物流信息</view>
        </view>
        <view class="fui-list-group express-list" v-if="expresslist">
            <view v-for="(item, index) in expresslist" :key="index" :class="'fui-list ' + ( index==0?'current':'' )">
                <view class="fui-list-inner">
                    <view class="text step">{{ item.step }}</view>
                    <view class="text time">{{ item.time }}</view>
                </view>
            </view>
        </view>
    </view>
</view>
</view>
</template>

<script>
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {};
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options
    });
    app.url(options);
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      core.get('groups/order/express', $this.data.options, function (list) {
        if (list.error == 0) {
          list.show = true;
          $this.setData(list);
        } else {
          core.toast(list.message, 'loading');
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
/* pages/groups/express/index.wxss */
/* pages/order/logistics/index.wxss */
.empty{
    padding: 150rpx;
    text-align: center
}
.light{
    height: 260rpx;
    width: 240rpx
}
.text-cancel{
    padding: 40rpx
}
.fui-list.express-top{
    padding: 20rpx 30rpx 0 30rpx;
}
.goodsNum{
    background: rgba(0,0,0,0.8);
    color: #fff;
    height: 40rpx;
    width: 130rpx;
    font-size: 24rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center

}
.fui-list-group.express-list .fui-list .fui-list-inner:before{
    content: " ";
    width: 0;
    height: 100%;
    position: absolute;
    border-left: 4rpx solid #c9c9c9;
    top: 0;
    left:40rpx;
    z-index: 9999;
}
.express-list .fui-list:first-child .fui-list-inner:before {
    top: 40rpx;
}
.express-list .fui-list:last-child .fui-list-inner:before {
    height: 40rpx;
}
.express-list .fui-list .fui-list-inner{
    padding:30rpx 70rpx;
}
.express-list .fui-list.current .fui-list-inner .text {
    color: #ef4f4f;
    font-size: 26rpx
}
.express-list .fui-list .fui-list-inner .text.step:before {
    content: " ";
    height: 16rpx;
    width: 16rpx;
    background: #aaa;
    border:2rpx solid #c9c9c9;
    border-radius: 050%;
    position: absolute;
    z-index: 9999;
    top: 10rpx;
    left: -37rpx;
}
.express-list .fui-list.current .fui-list-inner .text.step:before {
    background: #ef4f4f;
    border: 0.1rem solid #fd9797;
}
.express-list .fui-list{
    padding: 0
}
.fui-list-inner .text {
position:relative;
font-size:26rpx;
line-height: 34rpx;
color:#666;
}
.fui-list-media wx-image {
width:130rpx;
height:130rpx;
}

</style>