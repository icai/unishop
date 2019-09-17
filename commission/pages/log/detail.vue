<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page log-detail" v-if="show">
    <view class="fui-list-group" v-for="(item, index) in list" :key="index">
        
        <view class="fui-list" style="font-size: 24rpx;color: #000;">
            <text style="margin-right:40rpx" selectable="true">申请{{ textcomm }}: {{ item.ordercommission+textyuan }}</text><text selectable="true">审核{{ textcomm }}: {{ item.orderpay+textyuan }}</text>
        </view>
        <view class="fui-list" v-for="(g, index2) in item.goods" :key="index2" style="background: #f9f9f9">
            <view class="fui-list-media">
                <image :src="g.thumb"></image>
            </view>
            <view class="fui-list-inner">
                <view class="row">
                    <view class="row-text">{{ g.title }}</view>
                </view>
                <view class="subtitle">{{ textcomm }}: {{ g.commission+textyuan }}</view>
            </view>
            <view class="row-remark">
                <view>{{ g.level }}级</view>
                <view class="text-danger">{{ g.statusstr }}</view>
            </view>
        </view>
        <view class="fui-list">
            <view class="fui-list-inner">
                <view class="subtitle2"><text selectable="true">订单编号: {{ item.ordersn }}</text></view>
                <view class="subtitle2"><text selectable="true">订单金额: {{ item.goodsprice+textyuan }}</text></view>
                <!-- <view class='subtitle'>申请{{ textcomm }}: {{ item.ordercommission+textyuan }} </view>
                <view class='subtitle'>审核{{ textcomm }}: {{ item.orderpay+textyuan }} </view> -->
            </view>
        </view>
    </view>
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
  onLoad: function (options) {
    if (options.id > 0) {
      this.setData({
        id: options.id
      });
    }

    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this;
      core.get('commission/log/detail_list', {
        page: $this.data.page,
        id: $this.data.id
      }, function (ret) {
        var data = {
          total: ret.total,
          pagesize: ret.pagesize,
          show: true,
          textyuan: ret.textyuan,
          textcomm: ret.textcomm
        };

        if (ret.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(ret.list);

          if (ret.list.length < ret.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
      }, this.show);
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
.log-detail .fui-list .fui-list-inner .subtitle {
    font-size: 24rpx;
    color: #000;
}
.log-detail .fui-list .fui-list-inner .row .row-text {
    font-size: 24rpx;
    color: #999;
}
.log-detail  .row-remark {
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left: 25rpx;
    font-size: 24rpx;
    color: #000;
    line-height: 1.5
}
.log-detail .fui-list .fui-list-inner .subtitle2 {
    font-size: 22rpx;
    color: #999;
    
}

</style>