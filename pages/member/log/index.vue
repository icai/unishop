<template>
<view>
<loading v-if="!show">加载中...</loading>
<view :class="'page navbar ' + ( isopen==1?'header':false )" v-if="show">

    <view class="fui-tab fixed fui-tab-danger" v-if="isopen==1">
        <view :class="'item ' + ( type==0?'active':'' )" @tap="myTab" data-type="0">充值记录</view>
        <view :class="'item ' + ( type==1?'active':'' )" @tap="myTab" data-type="1">提现记录</view>
    </view>
<view style="margin-top:20rpx">
    <view class="fui-list-group" v-if="list.length>0" v-for="(item, index) in list" :key="index">
        <view class="fui-list goods-item">
            <view class="fui-list-inner">
                <view class="title" v-if="item.rechargetype!=''">
                     <text v-if="item.rechargetype=='wechat'">微信充值</text>
                    <text v-if="item.rechargetype=='alipay'">支付充值</text>
                    <text v-if="item.rechargetype=='system'">后台充值</text>
                    <text v-if="item.rechargetype=='exchange'">后台充值</text>
                    <text v-if="item.rechargetype=='wxapp'">余额付款</text>
                </view>
                <view class="title" v-if="item.type==1">
                    提现到{{ item.typestr }}
                </view>
                <view class="text">{{ item.createtime }}</view>
            </view>
            <view class="fui-list-angle">
                <view style="font-size: 30rpx;color: #000;">+{{ item.money }}元</view>
                <view class="text-warning" v-if="item.status==0">{{ item.type==0?"未充值":"申请中" }}</view>
                <!-- <view class="fui-label fui-label-success" wx:if="{{ item.status==1 }}">成功</view> -->
                <!-- <view class="fui-label fui-label-danger" wx:if="{{ item.status==-1 && item.type==1 }}">成功</view> -->
                <view class="text-danger" v-if="item.status==3 && item.type==0">退款</view>
            </view>
        </view>
          <view class="fui-list" v-if="item.type==1" style="height: 36rpx;">
              <view class="fui-list-inner">
                  <view class="text" style="display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;"><view style="margin-right: 30rpx">实际{{ item.status==1?"到账":"金额" }}: {{ item.deductionmoney>0?item.realmoney:item.money }}元</view><view>手续费: {{ item.deductionmoney }}元</view></view>
              </view>
          </view>
    </view>
</view>
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

    <!--公用底部菜单-->
    <include src="/pages/common/menu.wxml"></include>

</view>
</view>
</template>

<script>
/**
 *
 * favorite\index.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-01-09
 *
 */
var app = getApp();
var core = app.requirejs('core');

export default {
  data() {
    return {
      icons: app.requirejs('icons'),
      type: 0,
      isopen: false,
      page: 1,
      loaded: false,
      loading: true,
      list: []
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
  onLoad: function (options) {
    if (options.type > 0) {
      this.setData({
        type: 1
      });
    }

    app.url(options);
    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.get('member/log/get_list', {
        type: $this.data.type,
        page: $this.data.page
      }, function (result) {
        var data = {
          loading: false,
          total: result.total,
          show: true
        };

        if ($this.data.page == 1) {
          data.isopen = result.isopen;
          var title = "充值记录";

          if (result.isopen == 1) {
            title = result.moneytext + "明细";
          }

          wx.setNavigationBarTitle({
            title: title
          });
        }

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
    myTab: function (event) {
      var $this = this;
      var type = core.pdata(event).type;
      $this.setData({
        type: type,
        page: 1,
        list: [],
        loading: true
      });
      $this.getList();
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
.fui-list-angle {
    text-align: right;
    font-size: 28rpx;
    color: #666;
    margin-right: 4rpx;
    line-height: 1.5
}
.fui-list.goods-item{
  height: 88rpx;
  padding: 16rpx 24rpx
}
.fui-list-group{
  margin-top: 0
}
.fui-list-group:first-of-type{
  margin-top: 20rpx
}
.fui-list-group::before{
  content: " ";
	position: absolute;
	top: 0;
	right: 20rpx;
	height: 0;
	border-top: 2rpx solid #ebebeb;
	transform-origin: 0 0;
	transform: scaleY(0.5);
	left: 20rpx;
}
.fui-list-group:first-of-type:before{
  display: none
}
</style>