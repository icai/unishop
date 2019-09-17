<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page navbar com-down" v-if="show">
     <view class="fui-tab fui-tab-warning">
        <view :class="'item ' + ( level==item.level?'active':'' )" @tap="myTab" :data-level="item.level" v-for="(item, index) in levels" :key="index">{{ item.name }}(<text>{{ item.total }}</text>)</view>
    </view>

    <view class="fui-title" v-if="list.length>0">
    <i class="icox icox-star text-danger"></i> 代表已成为{{ textagent }}的下线
    </view>

    <view class="fui-list-group" v-if="list.length>0">
        <view class="fui-list" v-for="(item, index) in list" :key="index">
            <view class="fui-list-media">
                <image :src="item.avatar"></image>
            </view>
            <view class="fui-list-inner">
                <view class="row">
                  <view class="row-text">
                  <i class="icox icox-star text-danger" v-if="item.isagent==1&&item.status==1"></i>{{ item.nickname||'未获取' }}
                  </view>
                </view>
                <view class="subtitle" v-if="item.isagent==1&&item.status==1">成为{{ textagent }}时间: {{ item.agenttime }}</view>
                <view class="subtitle" v-else>注册时间: {{ item.createtime }}</view>
            </view>
            <view class="row-remark" v-if="item.isagent==1&&item.status==1">
                <view>+{{ item.commission_total }}</view>
                <view>{{ item.agentcount }}个成员</view>
            </view>
            <view class="row-remark" v-else>
                <view>消费: {{ item.moneycount+textyuan }}</view>
                <view>{{ item.ordercount }}个订单</view>
            </view>
        </view>
    </view>

    <view class="center" v-if="list.length<1">
        <view class="empty-tip">
            <image src="/static/images/icon/nomeb.png" class="light"></image>
            <view class="text-cancel">暂时没有任何数据</view>
        </view>
    </view>

    <!-- <view class="fui-loading empty" wx:if="{{loaded && list.length>0}}">
        <view class="text">没有更多了</view>
    </view> -->

</view>
</view>
</template>

<script>
/**
 *
 * commission/down/index.js
 *
 * @create 2017-02-09
 * @author 晚秋
 *
 * @update  晚秋 2017-02-09
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      level: 1,
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
    this.getSet();
    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getSet: function () {
      var $this = this;
      core.get('commission/down/get_set', {}, function (ret) {
        wx.setNavigationBarTitle({
          title: ret.textdown + "(" + ret.total + ")"
        });
        delete ret.error;
        ret.show = true;
        $this.setData(ret);
      });
    },
    getList: function () {
      var $this = this;
      core.get('commission/down/get_list', {
        page: $this.data.page,
        level: $this.data.level
      }, function (result) {
        var data = {
          total: result.total,
          pagesize: result.pagesize
        };

        if (result.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(result.list);

          if (result.list.length < result.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
      }, this.show);
    },
    myTab: function (e) {
      var $this = this;
      var level = core.pdata(e).level;
      $this.setData({
        level: level,
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
/* pages/commission/down/index.wxss */
@import "../../../static/css/commission.css";
.com-down .subtitle{
    font-size: 24rpx;
    color: #999
}
.com-down .image-32{
    width: 32rpx;
    height: 32rpx
}
wx-image{
    vertical-align: top
}
.com-down .fui-list-media wx-image {
    width:80rpx;
    height:80rpx;
    border-radius:50%;
}
.com-down .fui-list-inner .row {
    font-size:28rpx;
}
.com-down  .row-remark {
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left: 25rpx;
    min-width: 150rpx;
    color: #000;
    font-size: 24rpx
}

</style>