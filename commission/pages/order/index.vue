<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page navbar com-order" v-if="show">
    <view class="fui-cell-group" style="margin-top:0px;background: #fea23d;color: #fff;">
        <view class="fui-cell">
            <view class="fui-cell-info" style="width:auto;color: #fff;text-align:left">{{ textctotal }}<text>{{ comtotal }}</text>{{ textyuan }}</view>
        </view>
    </view>

    <view class="fui-tab fui-tab-warning">
        <view :class="'item ' + ( status==''?'active':'' )" @tap="myTab" data-status>所有</view>
        <view :class="'item ' + ( status=='0'?'active':'' )" @tap="myTab" data-status="0">待付款</view>
        <view :class="'item ' + ( status=='1'?'active':'' )" @tap="myTab" data-status="1">已付款</view>
        <view :class="'item ' + ( status=='3'?'active':'' )" @tap="myTab" data-status="3">已完成</view>
    </view>

    <!--列表区-->
    <view :class="'fui-cell-group ' + (item.code==1?'toggleSend-group':'')" v-for="(item, index) in list" :key="index">
             <view class="fui-list">
                    <view class="fui-list-media">
                        <image :src="item.buyer.avatar" class="round" style="width:1.4rem;height:1.4rem;border-radius: 50%"></image>
                    </view>
                    <view class="fui-list-inner">
                        <view class="row">
                            <view class="row-text" style="font-size: 24rpx">{{item.buyer.nickname}}</view>
                        </view>
                    </view>
                    <view class="fui-list-angle" :style="'margin: 0;font-size: 24rpx;color:#b2b2b2;' + (item.status=='已付款'?'color:#ff8000;':'') + ' ' + (item.status=='已完成'?'color:#04ab02;':'') + ' ' + (item.status=='待付款'?'color:#ff5555;':'')"> {{item.status}}</view>
                </view>
                                                
                <view class="fui-list no-border" v-for="(item, index2) in item.order_goods" :key="index2" style="background: #f9f9f9;margin-top: 4rpx">
                    <view class="fui-list-media">
                        <image :src="item.thumb" style="width:2.5rem;height:2.5rem;"></image>
                    </view>
                    <view class="fui-list-inner">
                        <view class="row">
                            <view class="row-text" style="font-size: 24rpx;color: #000">{{item.title}}</view>
                        </view>
                        <view class="subtitle" style="font-size: 24rpx;color: #999;">{{item.optionname}}</view>
                    </view>
                    <view class="row-remark">
                        <view>预计</view>
                        <view>+{{ item.commission }}</view>
                    </view>
                </view>
                
            <view class="fui-list" style="font-size: 22rpx;color: #999;line-height: 38rpx;display:block">
                    <view><text selectable="true">分销等级：{{ item.level }}</text></view>
                    <view><text selectable="true">订单编号：{{ item.ordersn }}</text></view>
                    <view><text selectable="true">下单时间：{{ item.createtime }}</text></view>
           </view> 
           <view class="fui-list" style="font-size: 22rpx;justify-content: flex-end;border-top: 1rpx solid #ebebeb;">
                预计佣金：<span class="right" style="font-size: 32rpx">+{{ item.commission }}</span>
          </view>
        
    </view>

    <!--没有任何数据-->
    <view class="center" v-if="list.length<1">
        <view class="empty-tip">
            <image src="/static/images/icon/nolist.png" class="light"></image>
            <view class="text-cancel">暂时没有任何数据</view>
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
      status: '',
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
    toggleSend: function (e) {
      if (!this.openorderdetail && !this.openorderbuyer) {
        return;
      }

      var index = e.currentTarget.dataset.index;
      var code = this.list[index].code;
      var list = this.list;

      if (code == 1) {
        list[index].code = 0;
      } else {
        list[index].code = 1;
      }

      this.setData({
        list: list
      });
    },
    getList: function () {
      var $this = this;
      core.get('commission/order/get_list', {
        page: $this.data.page,
        status: $this.data.status
      }, function (ret) {
        delete ret.error;
        var data = ret;
        data.show = true;

        if (ret.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(ret.list);

          if (ret.list.length < ret.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
        wx.setNavigationBarTitle({
          title: ret.textorder
        });
      }, this.show);
    },
    myTab: function (e) {
      var $this = this;
      var status = core.pdata(e).status;
      $this.setData({
        status: status,
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
/* pages/commission/order/index.wxss */
@import "../../../static/css/commission.css";
.com-order .fui-cell-group .fui-cell .fui-cell-label{
    width: auto;
     font-size: 28rpx;
}
.com-order .fui-cell-group .fui-cell .fui-cell-info{
    text-align: right;
    color: #333;
    font-size: 28rpx;
}


.com-order .fui-list .fui-list-inner .row .row-text{
    font-size: 28rpx
}
.com-order .fui-cell-group{
    margin-top: 20rpx
}
.com-order .fui-cell-group .details{
    display: none;
}
.com-order .fui-cell-group.toggleSend-group .details{
    display: flex;
    font-size:26rpx;
}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}



</style>