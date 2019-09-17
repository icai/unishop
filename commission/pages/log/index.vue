<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page com-log" v-if="show">
   <view class="fui-cell-group" style="margin-top:0px;background: #fea23d;color: #fff;">
        <view class="fui-cell">
            <view class="fui-cell-info" style="width:auto;color: #fff;text-align:left">预计{{ textcomm }}<text>+{{ commissioncount }}</text>{{ textyuan }}</view>
        </view>
    </view>
    <view class="fui-tab fui-tab-warning">
        <view :class="'item ' + ( status==0?'active':'' )" @tap="myTab" data-status="0">所有</view>
        <view :class="'item ' + ( status==1?'active':'' )" @tap="myTab" data-status="1">待审核</view>
        <view :class="'item ' + ( status==2?'active':'' )" @tap="myTab" data-status="2">待打款</view>
        <view :class="'item ' + ( status==3?'active':'' )" @tap="myTab" data-status="3">已打款</view>
        <view :class="'item ' + ( status==4?'active':'' )" @tap="myTab" data-status="4">无效</view>
    </view>

    <view class="fui-list-group" v-if="list.length>0" style="background:#f3f3f3">
        <navigator v-for="(item, index) in list" :key="index" hover-class="none" :url="'../log/detail?id=' + item.id" open-type="navigate" style="background:#fff; display:block;margin-top: 20rpx;">
            <view class="fui-list">
              <view class="fui-list-inner">
                  <view class="row">
                    <view class="row-text" v-if="item.type==0">提现到余额</view>
                    <view class="row-text" v-if="item.type==1">提现到微信红包</view>
                    <view class="row-text" v-if="item.type==2">提现到支付宝</view>
                    <view class="row-text" v-if="item.type==3">提现到银行卡</view>
                  </view>
                  <view class="subtitle">{{ item.dealtime }}</view>
              </view>
              <view class="row-remark">
                  <view :style="'font-size: 30rpx;' + ( item.status==-1?'color:#b2b2b2;':'' ) + '' + ( item.status==-2?'color:#b2b2b2;':'' )">+{{ item.commission_pay }}</view>
                  <view :style="'color:#b2b2b2;' + ( item.status==1?'color:#ff8000;':'' ) + '' + ( item.status==2?'color:#ff5555;':'' ) + '' + ( item.status==3?'color:#04ab02;':'' )">{{ item.statusstr }}</view>
              </view>
            </view>
            <view class="fui-list particulars">
              <view class="div">
                  <view>申请{{ textcomm }}</view> <view style="color: #999">{{ item.commission }}</view>
              </view>
              <view class="div">
                  <view>实际金额</view> <view style="color: #999">{{ item.deductionmoney }}</view>
              </view>
              <view class="div">
                  <view>提现手续费</view> <view style="color: #999">{{ item.deductionmoney+textyuan }}</view>
              </view>
            </view>
          <view class="fui-list-inner" style="background: #f9f9f9;text-align: center;line-height:84rpx;color: #666;font-size:24rpx">查看提现详情</view>
        </navigator>
        <!-- <navigator class='fui-list' wx:for="{{ list }}" hover-class="none" url="/pages/commission/log/detail?id={{ item.id }}" open-type="navigate">
            <view class='fui-list-inner'>
                <view class='row'>
                    <view class='row-text'>编号: {{ item.applyno }}</view>
                </view>
                <view class='text'>
                    申请{{ textcomm }}: {{ item.commission }} 实际金额: {{ item.deductionmoney }} 个人所得税: {{ item.deductionmoney+textyuan }}
                </view>
                <view class='text' wx:if="{{ item.status==1 }}">申请时间: {{ item.dealtime }}</view>
                <view class='text' wx:elif="{{ item.status==2 }}">审核时间: {{ item.dealtime }}</view>
                <view class='text' wx:elif="{{ item.status==3 }}">打款时间: {{ item.dealtime }}</view>
                <view class='text' wx:else="{{ item.status==-1 }}">无效时间: {{ item.dealtime }}</view>
            </view>
            <view class='row-remark'>
                <view>+{{ item.commission_pay }}</view>
                <view>{{ item.statusstr }}</view>
            </view>
        </navigator> -->
    </view>

    <view class="center" v-if="list.length<1">
        <view class="empty-tip">
            <image src="/static/images/icon/nolist.png" class="light"></image>
            <view class="text-cancel">暂时没有任何数据</view>
        </view>
    </view>
<!-- 
    <view class="fui-loading empty" wx:if="{{loaded && list.length>0}}">
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
      status: 0,
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
      core.get('commission/log/get_list', {
        page: $this.data.page,
        status: $this.data.status
      }, function (ret) {
        var data = {
          total: ret.total,
          pagesize: ret.pagesize,
          commissioncount: ret.commissioncount,
          textyuan: ret.textyuan,
          textcomm: ret.textcomm,
          textcomd: ret.textcomd,
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
        wx.setNavigationBarTitle({
          title: ret.textcomd + "(" + ret.total + ")"
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
/* pages/commission/log/index.wxss */
@import "../../../static/css/commission.css";
.com-log .fui-cell-group .fui-cell .fui-cell-label{
    width: auto;
    font-size: 28rpx;
}
.com-log .fui-cell-group .fui-cell .fui-cell-info{
    text-align: right;
    color: #333;
    font-size: 28rpx;
}
.com-log .fui-list .fui-list-inner .row .row-text{
    font-size: 28rpx;
    color: #999
}
.com-log .fui-tab .item {
  font-size: 28rpx
}
.com-log .fui-list .fui-list-inner .row .row-text {
    font-size: 26rpx;
    color: #000;
}
.com-log .fui-list .fui-list-inner .subtitle {
    font-size: 24rpx;
    color: #999;
}
.com-log .row-remark {
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left: 25rpx;
    line-height: 1.5;
    color: #000
}
.com-log .fui-list.particulars{
    height:88rpx
}
.com-log .fui-list.particulars .div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    font-size: 22rpx;
    border-right: 1px solid #ededed;
    color: #000;
}
.com-log .fui-list.particulars .div:last-child {
    border: 0;
}
.com-log .row-remark::before {
    display: none
}
</style>