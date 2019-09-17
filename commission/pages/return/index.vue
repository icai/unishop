<template>
<view>
<loading v-if="!show">加载中...</loading>

    <view class="fui-tab fui-tab-danger">
        <view :class="'item ' + ( type==0?'active':'' )" @tap="myTab" data-type="0">未完成</view>
        <view :class="'item ' + ( type==1?'active':'' )" @tap="myTab" data-type="1">已完成</view>
    </view>
<view class="page com-log" v-if="true">
    <view class="fui-list-group" v-for="(item, index) in list" :key="index" wx-item="item" :-item="item">
        <view class="fui-list" style="font-size: 24rpx;color: #000;">
            <text style="margin-right:40rpx" selectable="true">每天返回￥{{item.priceevery}}，剩{{item.surplusday}}天</text>
        </view>
        <view class="fui-list" style="background: #f9f9f9">
            <view class="fui-list-media">
                <image :src="item.thumb"></image>
            </view>
            <view class="fui-list-inner" style="padding-right: 126rpx;">
                <view class="row">
                    <view class="row-text">{{item.title}}</view>
                    <!--<view class='text-warning'>状态这是</view>-->
                </view>
                <view class="subtitle">{{item.optionname}}</view>
            </view>
            <view class="fui-list-remark" style>
                <view class="text" style="color: #ffac1f;">
                	<block v-if="type == 0">进行中</block>
                	<block v-if="type == 1">已完成</block>
                </view>
            </view>
        </view>
        <view class="fui-list">
            <view class="fui-list-inner">
                <view class="subtitle2"><text selectable="true">总金额: ￥{{ item.price }}</text></view>
                <view class="subtitle2"><text selectable="true">已返金额: ￥{{ item.surplusprice}}</text></view>
                <view class="subtitle2"><text selectable="true">已返: {{item.fullbackday}}天</text></view>
                <view class="subtitle2"><text selectable="true">创建时间: {{item.createtime}} </text></view>
            </view>
        </view>
    </view>
    
    <view class="center" v-if="list.length<1">
        <view class="empty-tip">
            <image src="/static/images/icon/nolist.png" class="light"></image>
            <view class="text-cancel">暂时没有任何数据</view>
        </view>
    </view>
 
    <view class="fui-loading empty" v-if="loaded && list.length>0">
        <view class="text">没有更多了</view>
    </view> 

</view>
</view>
</template>

<script>
/**
 *
 * commission/return/index.js
 *
 * @create 2017-11-29
 * @author AHa
 *
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      type: 0,
      page: 1,
      list: []
    };
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.getList();
  },
  onLoad: function () {
    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this;
      core.get('member.fullback.get_list', {
        page: $this.data.page,
        type: $this.data.type
      }, function (ret) {
        var data = {
          total: ret.total,
          pagesize: ret.pagesize,
          list: ret.list,
          show: true
        };

        if (ret.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(ret.list);

          if (ret.list.length < ret.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
      });
    },
    myTab: function (e) {
      var $this = this;
      var type = e.currentTarget.dataset.type;
      $this.setData({
        type: type,
        page: 1,
        list: []
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
@import "../../../static/css/commission.css";
.fui-list .fui-list-inner .subtitle {
    font-size: 24rpx;
    color: #999;
}
.fui-list .fui-list-inner .row .row-text {
    font-size: 24rpx;
    color: #000;
}
.row-remark {
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left: 25rpx;
    font-size: 24rpx;
    color: #000;
    line-height: 1.5
}
.fui-list .fui-list-inner .subtitle2 {
    font-size: 22rpx;
    color: #999;
}
.fui-list .fui-list-remark{
	position: absolute;
	top: 38rpx;
	right: 50rpx;
	font-size: 24rpx;
}
.fui-tab{
	position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  border-top: 1rpx solid #ebebeb;
}
/*.fui-tab:after{
	content: " ";
	position: absolute;
	left: 0rpx;
	right: 0rpx;
	top: -1rpx;
	height: 1px;
	border-top: 1px solid #ebebeb;
	color: #ebebeb;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}*/
.fui-list-group:first-child{
  margin-top: 86rpx;
}
</style>