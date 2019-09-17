<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
  <view class="fui-tab fixed fui-tab-danger">
      <view :class="'item ' + ( cate==''?'active':'' )" @tap="selected" data-cate>未完成</view>
      <view :class="'item ' + ( cate=='used'?'active':'' )" @tap="selected" data-cate="used">已完成</view>
      <view :class="'item ' + ( cate=='past'?'active':'' )" @tap="selected" data-cate="past">已过期</view>
  </view>
   <view class="coupon-list-group">
      <block v-for="(item, index) in list" :key="index">
        <navigator :class="'coupon-list ' + item.classstr" :url="'/pages/verifygoods/detail/index?id=' + item.id">
          <view class="coupon-left">
            <view class="coupon-title">
              <view class="coupon-list-media">
                <image :src="item.thumb"></image>
              </view>
              <view class="coupon-inner">
                <view>
                  {{item.title}}
                </view>
              </view>
            </view>
            <view class="coupon-time">
              有效日期：{{item.termofvalidity}}
            </view>
          </view>
          <view class="coupon-right">
              <view v-if="item.numlimit>0" class="text">可用次数</view>
              <view v-else class="text">剩余天数</view>
              <view class="num"><span style="font-size:40rpx;font-weight:bold;">{{item.surplusnum}}</span></view>
          </view>
        </navigator>
      </block>
    <!--数据显示-->
    <view class="fui-loading" v-if="loading">
        <view class="icon"></view>
        <view class="text">正在加载</view>
    </view>
    <view class="fui-loading empty" v-if="loaded && list.length>0">
        <view class="text">没有更多了</view>
    </view>
    <view class="fui-loading empty" v-if="total<=0 && !loading">
        <view class="text">没有数据</view>
    </view>
		</view>
    <!--公用底部菜单-->
    <include src="/pages/common/menu.wxml"></include>
</view>
</view>
</template>

<script>
// pages/verifygoods/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');

export default {
  data() {
    return {
      list: [],
      page: 1,
      cate: '',
      loaded: false,
      loading: true
    };
  },

  onReachBottom: function () {
    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.getList();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.get('verifygoods/get_list', {
        page: $this.data.page,
        cate: $this.data.cate
      }, function (result) {
        var data = {
          loading: false,
          total: result.total,
          show: true
        };

        if (!result.list) {
          result.list = [];
        }

        if (result.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(result.list);

          if (result.list.length < result.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
      });
    },
    selected: function (e) {
      var $this = this;
      var cate = e.currentTarget.dataset.cate;
      $this.setData({
        cate: cate,
        page: 1,
        list: [],
        loading: true
      });
      this.get_list();
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
/* pages/verifygoods/index.wxss */
.fui-tab .item.active {
	color: #ff5555;
	position: relative;
    z-index: 10;
}
.fui-tab .item.active:before {
	content: "";
	height: 4rpx;
	width: 100%;
	background: #fe5455;
	position: absolute;
	bottom: 0;
	left: 0;
    z-index: 1;
}
.coupon-list-group{
  padding: 100rpx 24rpx;
}

.coupon-list {
    width: 100%;
    height: 180rpx;
    border-radius: 8rpx;
    padding: 28rpx 24rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 20rpx;
    position: relative;
    box-sizing: border-box
}
.coupon-left {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.coupon-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #fff;
    height:72rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin: 0 0 20rpx 0;
}
.coupon-list-media {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
    float: left;
}
.coupon-list-media image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4rpx solid #fff;
}
.coupon-inner {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    -webkit-align-items: center;
    vertical-align: middle;
    line-height: 40rpx;
}
.coupon-inner view {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.coupon-time {
    font-size: 24rpx;
    color: #fff;
}
.coupon-right {
    width: 154rpx;
    text-align: center;
    color: #fff;
}
.coupon-right .text {
    font-size: 24rpx;
}
.coupon-right .num {
    font-size: 64rpx;
    line-height: 1.5
}
.coupon-list.gray {
    background: #ccc;
}
.coupon-list.green {
    background: #77cd44;
}
.coupon-list.blue{
    background: #68bfe7;
}
</style>