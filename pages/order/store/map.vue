<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <map class="map" :longitude="store.lng" :latitude="store.lat" scale="16" :markers="markers" :controls="controls"></map>
    <view class="fui-footer map-item">
        <view class="media">
            <image :src="store.logo"></image>
        </view>
        <view class="inner">
            <view class="title">{{ store.storename }}</view>
            <view class="text">营业时间: {{ store.saletime }}</view>
            <view class="text">联系电话: {{ store.tel }}</view>
        </view>
        <view class="remark">
            <text class="icox icox-dianhua" @tap="phone" :data-phone="store.tel" style="font-size:40rpx"></text>
        </view>
    </view>
</view>
</view>
</template>

<script>
/**
 *
 * order/store/map.js
 *
 * @create 2017-1-16
 * @author 晚秋
 *
 * @update  晚秋 2017-01-16
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      storeid: 0,
      merchid: 0,
      markers: [],
      store: {}
    };
  },

  onLoad: function (options) {
    this.setData({
      storeid: options.id,
      merchid: options.merchid
    });
    this.getInfo();
  },
  components: {},
  props: {},
  methods: {
    getInfo: function () {
      var $this = this;
      core.get('store/map', {
        id: this.storeid,
        merchid: this.merchid
      }, function (result) {
        $this.setData({
          store: result.store,
          markers: [{
            id: 1,
            latitude: Number(result.store.lat),
            longitude: Number(result.store.lng)
          }],
          show: true
        });
      });
    },
    phone: function (e) {
      core.phone(e);
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
.map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 120rpx;
    height: auto;
    width: auto;
}
.fui-footer {
    height: 120rpx;
    padding: 0 15rpx;
}
.map-item {
    display: flex;
    align-items: center;
}
.map-item .media,
.map-item .media image {
    height: 90rpx;
    width: 90rpx;
    background: #eee;
}
.map-item .inner {
    flex: 1;
    padding-left: 20rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.map-item .inner .title {
    font-size: 34rpx;
    line-height: 42rpx;
    color: #333;
}
.map-item .inner .text {
    font-size: 25rpx;
    line-height: 28rpx;
    color: #666;
}
.map-item .remark {
    height: 90rpx;
    width: 90rpx;
    line-height: 90rpx;
    border-left: 1px solid #eee;
    padding-left: 20rpx;
}

.map-item .remark image {
    height: 50rpx;
    width: 50rpx;
    display: inline-block;
}
</style>