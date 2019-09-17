<template>
<view class="page">
  <view class="fui-content">
		<view class="fui-list-group notop" style="background: #f2f5f7;">
			<view class="fui-list">
				<view class="fui-list-media">
					<image :src="verifygoods.thumb"></image>
				</view>
				<view class="fui-list-inner">
					<view class="title">{{verifygoods.title}}</view>
					<view class="subtitle">{{verifygoods.subtitle}}</view>
				</view>
				<!--<view class="fui-list-angle">
					<view>￥1.00</view>
				</view>-->
			</view>
		</view>
		<view class="code_box" v-if="canverify">
			<view class="p" v-if="canverify">请将二维码出示给核销员</view>
      
			<view class="img_box detail_code">
				<image :src="qrcode" alt></image>
			</view>
			<view class="cav_code">{{verifycode}}</view>
		</view>

  	<view class="fui-cell-group" v-if="!canverify">
	 
       <view class="fui-cell noborder">{{canverify_message}}
       </view>
		</view>

		<view class="fui-cell-group">
			<view class="fui-cell-title">核销详情</view>
      <view class="fui-cell noborder" v-if="store">
				<view class="fui-cell-info">
          核销门店：{{store.storename}}
        </view>
				<view class="fui-cell-remark noremark">
				</view>
			</view>
      
			<view class="fui-cell noborder">
				<view class="fui-cell-info">
          核销次数：
          <block v-if="verifygoods.limitnum>0">剩余：{{verifygoods.limitnum-verifynum}} / 总数: {{verifygoods.limitnum}}</block>
          <block v-else>不限次数</block>
        </view>
				<view class="fui-cell-remark noremark">
				</view>
			</view>
			<view class="fui-cell noborder">
				<view class="fui-cell-info">
					有效日期：{{limitdatestr}}前有效
				</view>
				<view class="fui-cell-remark noremark">
				</view>
			</view>
		</view>
    <view class="fui-cell-group">
			<view class="fui-cell-title">核销记录</view>
      <block v-if="verifygoodlogs.length==0">
        <view class="fui-cell noborder">
          <view style="margin: 45rpx auto;font-size:26rpx;color:#b2b2b2"><image src="/static/images/empty.png" style="width:73rpx;height:73rpx;vertical-align: middle;margin-right:12rpx"></image>暂时没有记录</view>
        </view>
      </block>
      <block v-else>
        <block v-for="(itemlog, index) in verifygoodlogs" :key="index">
          <view class="record">
            <view class="fui-cell noborder">
              <view class="fui-cell-label">核销员</view>
              <view class="fui-cell-info">{{itemlog.salername}}</view>
              <view class="fui-cell-remark noremark">{{itemlog.verifydate}}</view>
            </view>
            <view class="fui-cell noborder">
              <view class="fui-cell-label">核销门店</view>
              <view class="fui-cell-info">{{itemlog.storename}}</view>
            </view>
            <view class="fui-cell noborder">
              <view class="fui-cell-label">核销次数</view>
              <view class="fui-cell-info">{{itemlog.verifynum}}</view>
            </view>
             <view class="fui-cell noborder">
              <view class="fui-cell-label">备注</view>
              <view class="fui-cell-info">{{itemlog.remarks}}</view>
            </view>
          </view>
        </block>
      </block>
		</view>
	</view>
</view>
</template>

<script>
// pages/verifygoods/detail/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');

export default {
  data() {
    return {
      verifygoods: []
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

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
  onShow: function () {
    this.get_detail();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    });
    app.url(options);
  },
  components: {},
  props: {},
  methods: {
    get_detail: function () {
      var $this = this;
      core.get('verifygoods/get_detail', $this.data.options, function (result) {
        if (result.error == 0) {
          $this.setData({
            verifygoods: result.item,
            store: result.store,
            canverify: result.canverify,
            canverify_message: result.canverify_message,
            qrcode: result.qrcode,
            verifygoodlogs: result.verifygoodlogs,
            verifynum: result.verifynum,
            limitdatestr: result.limitdatestr,
            verifycode: result.verifycode
          });
        } else {
          if (result.error != 50000) {
            core.toast(result.message, 'loading');
          }

          wx.redirectTo({
            url: '/pages/verifygoods/index'
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
/* pages/verifygoods/detail/index.wxss */
.fui-list-group.notop {
  margin-top: 0
}
.fui-list-group.notop .fui-list{
  padding: 32rpx 24rpx
}
.fui-list-media {
  margin-right: 24rpx
}
.fui-list-group.notop .fui-list image{
  width: 90rpx;
  height:90rpx
}
.fui-list-inner .title {
  font-size: 26rpx;
  line-height: 1.5
}
.fui-list-inner .subtitle {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 10rpx
}
.fui-list-angle {
  margin: 0 0 0 54rpx;
  font-size: 26rpx;
  height:90rpx;
  line-height: 2
}
.code_box {
    text-align: center;
    background: #fff;
    height: 520rpx;
}
.code_box .p{
    font-size: 28rpx;
    color: #000;
    padding-top:45rpx;
    padding-bottom: 20rpx
}
.img_box {
  margin-top: 5rpx;
}
.img_box  image{
  width: 260rpx;
  height: 260rpx
}
.cav_code{
  width: 276rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  color: #666;
  border-radius: 8rpx;
  background: #f7f7f7;
  margin:32rpx auto 0
}
.fui-cell.noborder{
  padding: 30rpx 24rpx 0
}
.fui-cell.noborder:last-child{
  padding-bottom: 30rpx
}
.fui-cell-title {
  font-size: 28rpx;
  color: #999;
  position: relative
}
.fui-cell-title:after {
	content: "";
	position: absolute;
	left: 24rpx;
  right: 24rpx;
	bottom: 0;
	height: 0;
	border-bottom: 2rpx solid #D9D9D9;
	color: #D9D9D9;
	transform-origin: 0 100%;
	transform: scaleY(0.5);
}
.record{
  position: relative
}
.record:after {
	content: "";
	position: absolute;
	left: 24rpx;
  right: 24rpx;
	bottom: 0;
	height: 0;
	border-bottom: 2rpx solid #D9D9D9;
	color: #D9D9D9;
	transform-origin: 0 100%;
	transform: scaleY(0.5);
}
.record:last-child::after {
	display: none
}
.fui-cell-group .record .fui-cell .fui-cell-info,.fui-cell-group .record .fui-cell .fui-cell-label {
  color: #666
}
.fui-cell-group .record .fui-cell .fui-cell-remark.noremark {
  color:#b2b2b2;
}

</style>