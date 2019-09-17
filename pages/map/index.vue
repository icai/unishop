<template>
<view class="fui-page">
  <map id="myMap" :longitude="lng" :latitude="lat" :scale="scale" @controltap="controltap" :markers="markers" @markertap="markertap" :polyline="polyline" :circles="circles" @regionchange="regionchange" @updated="bindupdated" show-location style="width: 100%;">
  </map>
<view :class="'fui-list-group fui-list-group1 ' + listout" style="margin-top: 0;">
			<a class="fui-list order-list title-b" data-nocache="true">
				<view class="fui-list-media">
					<image :src="logo"></image>
				</view>
				<view class="fui-list-inner">
					<view class="row">
						<view class="row-text title">{{name}}</view>
					</view>
					<view class="row">
						<view class="row-text" style="color: #666">{{address}}</view>
					</view>
				</view>
				<view class="angle" @tap="call">
            <i class="icox icox-phone" style="color: #21ca4d;font-size:50rpx;"></i>
        </view>
			</a>
	</view>

	<view :class="'fui-list-group fui-list-group2 ' + listin" style="margin-top: 0;">
			<view class="inner">
       <block v-if="tel1">
		    <view class="fui-tell" @tap="callup" :data-tel="tel1">{{tel1}}</view>
      </block>
      <block v-if="tel2">
		    <view class="fui-tell after" @tap="callup" :data-tel="tel2">{{tel2}}</view>
      </block>
		    <view class="fui-tell after" @tap="calldown" style="background: #fafafa;font-size: 26rpx;color: #999;">关闭</view>
		  </view>
	</view>
</view>
</template>

<script>
/*
 * 
 * *
 * @create 2017-1-12
 * @author AHa
 * 
 * 
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      lng: 0,
      lat: 0,
      scale: 13,
      name: '未填写',
      address: '地址：未填写',
      tel1: '',
      tel2: '',
      logo: '/static/images/noface.png',
      markers: [{
        iconPath: "/static/images/location.png",
        id: 0,
        longitude: 0,
        latitude: 0,
        width: 30,
        height: 30,
        label: {
          content: '未填写',
          color: '#666666',
          fontSize: 12,
          borderRadius: 10,
          bgColor: '#ffffff',
          padding: 5,
          display: 'ALWAYS',
          textAlign: 'center',
          x: -20,
          y: -60
        }
      }],
      circles: [{
        longitude: 0,
        latitude: 0,
        color: '#4e73f1DD',
        fillColor: '#4e73f1AA',
        radius: 15,
        strokeWidth: 1
      }]
    };
  },

  onLoad: function (options) {
    var $this = this;
    core.get('shop.cityexpress.map', {}, function (res) {
      $this.setData({
        lng: res.cityexpress.lng,
        lat: res.cityexpress.lat,
        scale: res.cityexpress.zoom,
        name: res.cityexpress.name,
        address: res.cityexpress.address,
        tel1: res.cityexpress.tel1,
        tel2: res.cityexpress.tel2,
        logo: res.cityexpress.logo,
        'markers[0].longitude': res.cityexpress.lng,
        'markers[0].latitude': res.cityexpress.lat,
        'markers[0].label.content': res.cityexpress.name,
        'circles[0].longitude': res.cityexpress.lng,
        'circles[0].latitude': res.cityexpress.lat,
        'circles[0].radius': parseInt(res.cityexpress.range)
      });
    });
  },
  components: {},
  props: {},
  methods: {
    label: {
      content: '未填写',
      color: '#666666',
      fontSize: 12,
      borderRadius: 10,
      bgColor: '#ffffff',
      padding: 5,
      display: 'ALWAYS',
      textAlign: 'center',
      x: -20,
      y: -60
    },
    get_list: function () {},

    regionchange(e) {},

    markertap(e) {},

    controltap(e) {},

    //打开电话列表
    call: function () {
      var $this = this;

      if ($this.data.tel1 == '' || $this.data.tel2 == '') {
        if ($this.data.tel1 != '') {
          wx.makePhoneCall({
            phoneNumber: $this.data.tel1
          });
        }

        if ($this.data.tel2 != '') {
          wx.makePhoneCall({
            phoneNumber: $this.data.tel2
          });
        }
      } else {
        $this.setData({
          listout: 'out',
          listin: 'in'
        });
      }
    },
    //关闭电话列表
    calldown: function () {
      var $this = this;
      $this.setData({
        listout: '',
        listin: ''
      });
    },
    //拨打电话
    callup: function (e) {
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.tel
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
.fui-page{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: fixed;
}
map{
  flex: 1
}
.fui-list .angle:after,
.fui-list-group-title .angle:after{
  display: none;
}
.fui-list-group1{
	display: block;
}
.fui-list-group1.out{
	display: none;
}
.fui-list-group2{
	display: none;
}
.fui-list-group2.in{
	display: block;
}


.inner{
  width: 100%;
  background: #fff;
}
.fui-tell{
  width: 100%;
  height:86rpx;
  text-align: center;
  line-height: 86rpx;
  color: #000;
  font-size: 28rpx;
  position: relative;
}
.fui-tell:after{
  content: " ";
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 1px;
	border-top: 1px solid #ebebeb;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
</style>