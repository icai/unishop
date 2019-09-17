<template>
<view>
<!--pages/order/list/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="page navbar order" v-if="show">

  <scroll-view class="fui-tab-scroll fixed" scroll-x="true" style="overflow-x:scroll">
    <view :class="'item ' + ( status==''?'active':'' )" @tap="selected" data-type>全部</view>
    <view :class="'item ' + ( status=='0'?'active':'' )" @tap="selected" data-type="0">待付款</view>
    <view :class="'item ' + ( status=='1'?'active':'' )" @tap="selected" data-type="1">待发货</view>
    <view :class="'item ' + ( status=='2'?'active':'' )" @tap="selected" data-type="2">待收货</view>
    <view :class="'item ' + ( status=='3'?'active':'' )" @tap="selected" data-type="3">已完成</view>
    <view :class="'item ' + ( status=='4'?'active':'' )" @tap="selected" data-type="4">退换货</view>
    <view :class="'item ' + ( status=='5'?'active':'' )" @tap="selected" data-type="5">回收站</view>
  </scroll-view>

  <view class="contain" v-if="list.length!=0">
    <view class="fui-list-group noclick" v-for="(item, index) in list" :key="index">
      <navigator :url="'/pages/order/detail/index?id=' + item.id" hover-class="none" open-type="navigate">
        <view class="fui-list-group-title" style="color:#666;font-size:26rpx">
          <view class="order-num">
            <text v-if="item.iscycelbuy == 1" class="cycle-tip">周期购</text>
            <text selectable="true">订单号：{{ item.ordersn }}</text>
          </view>
          <view :class="statuscss">{{ item.statusstr }}</view>
        </view>
        <view class="fui-list goods-info" v-for="(val, index2) in item.nogift" :key="index2">
          <view class="fui-list-media">
            <image class="goods_img" :src="val.thumb"></image>
          </view>
          <view class="fui-list-inner" style="height:140rpx">
            <view class="text text-left">{{ val.title }}</view>
            <view class="subtitle text-left">{{ val.optiontitle }}</view>
          </view>
          <view class="num">
            <view class="text-right">¥
              <text>{{ val.price/val.total }}</text>
            </view>
            <view class="text-right" style="color:#666">x
              <text>{{ val.total }}</text>
            </view>
            <view class="text-right" style="color:#666" v-if="val.single_refundid">
              <text v-if="val.single_refundid==9">维权完成</text>
              <text v-if="val.single_refundid==8">已拒绝</text>
              <text v-if="val.single_refundid==1">退款中</text>
              <text v-if="val.single_refundid==2">退货中</text>
            </view>
          </view>
        </view>
        <!--赠品显示start-->
        <block v-if="item.gift">
          <view class="fui-list no-border" style="background: #f9f9f9;margin-top: 4rpx">
            <block v-for="(val, index2) in item.gift" :key="index2">
              <view class="fui-list-media" v-if="index2<5">
                <image :src="val.thumb" style="width:100rpx;height:100rpx;"></image>
              </view>
            </block>
            <view class="fui-list-inner"></view>
            <view class="row-remark">
              <view>
                <text>共{{item.gift.length}}件</text>
              </view>
            </view>
          </view>
        </block>
        <!--赠品显示end-->
        <view class="fui-list list-padding">
          <text class="fui-list-inner text-right totle">共{{ item.goods[0].goods.length }}个商品 实付<text class="text-danger">¥<text>{{ item.price }}</text></text>
          </text>
        </view>
      </navigator>
      <view class="fui-list list-padding" style="padding:0 24rpx" v-if="status!=4">
        <view class="fui-list-inner text-right" style="padding:10rpx 0">
          <block v-if="!item.canrestore">
            <view v-if="item.cancancel" class="btn btn-default btn-default-o">
              <picker :value="cancelindex" :range="cancel" @change="cancel" :data-orderid="item.id">取消订单</picker>
            </view>

            <navigator v-if="item.canpay" class="btn btn-danger-o" :url="'/pages/order/pay/index?id=' + item.id" open-type="navigate">
              支付订单
            </navigator>

            <view v-if="item.canverify && !item.isonlyverifygoods" class="btn btn-danger btn-danger-o" :data-orderid="item.id" @tap="code">{{ item['dispatchtype']==1?'我要取货':'我要使用' }}</view>
             <navigator v-if="item.canverify && item.verifygoods_id && item.isonlyverifygoods" class="btn btn-default btn-default-o btn-sm" :url="'/pages/verifygoods/detail/index?id=' + item.verifygoods_id">我要使用</navigator> 
            <view v-if="item.candelete" class="btn btn-default btn-default-o" data-type="1" @tap="delete" :data-orderid="item.id">
              删除订单
            </view>
            <navigator v-if="item.cancomment2" class="btn btn-default btn-default-o" :url="'/pages/order/comment/index?id=' + item.id" open-type="navigate">
              追加评价
            </navigator>
            <navigator v-if="item.cancomment" class="btn btn-danger btn-danger-o" :url="'/pages/order/comment/index?id=' + item.id" open-type="navigate">
              评价
            </navigator>
            <view v-if="item.cancomplete && item.iscycelbuy != 1" class="btn btn-danger btn-danger-o" :data-orderid="item.id" @tap="finish">
              确认收货 
            </view>
  

            <navigator v-if="item.canrefund" class="btn btn-default" url="/pages/order/refund/index" open-type="navigate">{{ item.refundtext }}</navigator>
            <navigator v-if="item.cancancelrefund" class="btn btn-default-o btn-cancel" open-type="navigate">取消申请</navigator>
            <navigator v-if="item.hasexpress && item.iscycelbuy != 1" class="btn btn-default" :url="'/pages/order/express/index?id=' + item.id" open-type="navigate">
              查看物流
            </navigator>
          </block>
          <block v-if="item.canrestore">
            <view class="btn btn-default btn-default-o" data-type="2" :data-orderid="item.id" @tap="delete">彻底删除订单</view>
            <view class="btn btn-default btn-default-o" data-type="0" :data-orderid="item.id" @tap="delete">恢复订单</view>
          </block>
        </view>
      </view>
    </view>
  </view>
  <view class="center" v-if="list.length==0&&empty">
    <view class="empty">
      <image src="/static/images/icon/nolist.png" class="light"></image>
      <view class="text-cancel">您暂时没有任何订单哦！</view>
      <navigator class="btn btn-danger-o" url="/pages/index/index" open-type="switchTab">去首页逛逛吧</navigator>
    </view>
  </view>
  <navigator class="fui-dot" hover-class="none" url="/pages/member/index/index" open-type="switchTab">
    <text class="icox icox-huiyuan1" style="color:#fff;font-size:40rpx"></text>
  </navigator>
  <!--弹出模态框-->
  <include src="/pages/order/public/verify.wxml"></include>
  <!--公用底部菜单-->
  <include src="/pages/common/menu.wxml"></include>
</view>
</view>
</template>

<script>
/**
 *
 * order/index.js
 *
 * @create 2017-1-15
 * @author Young
 *
 * @update  Young 2017-02-04
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    order = app.requirejs('biz/order');

export default {
  data() {
    return {
      icons: app.requirejs('icons'),
      status: '',
      list: [],
      page: 1,
      code: false,
      cancel: order.cancelArray,
      cancelindex: 0
    };
  },

  onShareAppMessage: function () {
    return core.onShareAppMessage();
  },
  onReachBottom: function () {
    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.get_list();
  },
  onLoad: function (options) {
    app.checkAuth(); // 页面初始化 options为页面跳转所带来的参数

    this.setData({
      options: options,
      status: options.status || ''
    });
    app.url(options);
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
      core.get('order/get_list', {
        page: $this.data.page,
        status: $this.data.status,
        merchid: 0
      }, function (list) {
        if (list.error == 0) {
          $this.setData({
            loading: false,
            show: true,
            total: list.total,
            empty: true
          });

          if (list.list.length > 0) {
            $this.setData({
              page: $this.data.page + 1,
              list: $this.data.list.concat(list.list)
            });
          }

          if (list.list.length < list.pagesize) {
            $this.setData({
              loaded: true
            });
          }
        } else {
          core.toast(list.message, 'loading');
        }
      }, this.show);
    },
    selected: function (e) {
      var status = core.data(e).type;
      this.setData({
        list: [],
        page: 1,
        status: status,
        empty: false
      });
      this.get_list();
    },
    code: function (e) {
      var $this = this,
          orderid = core.data(e).orderid;
      core.post('verify/qrcode', {
        id: orderid
      }, function (json) {
        if (json.error == 0) {
          $this.setData({
            code: true,
            qrcode: json.url
          });
        } else {
          core.alert(json.message);
        }
      }, true);
    },
    close: function () {
      this.setData({
        code: false
      });
    },
    cancel: function (e) {
      var orderid = core.data(e).orderid;
      order.cancel(orderid, e.detail.value, '/pages/order/index?status=' + this.status);
    },
    delete: function (e) {
      var type = core.data(e).type,
          orderid = core.data(e).orderid;
      order.delete(orderid, type, '/pages/order/index', this);
    },
    finish: function (e) {
      var type = core.data(e).type,
          orderid = core.data(e).orderid;
      ;
      order.finish(orderid, '/pages/order/index');
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
/* pages/order/list/index.wxss */
@import "../../static/css/order.css";
page{
    background:#f7f7f7;
    }
.goods-info{
    width: auto
}
.order .contain{
    margin-top: 90rpx;
}
.order .btn{
    margin:10rpx 0 10rpx 20rpx;
    padding: 0 26rpx;
    height:56rpx;
    line-height: 54rpx;
    border-radius: 40rpx;
    font-size: 26rpx;
}
.order .empty{
    padding:260rpx 150rpx;
    font-size: 34rpx;
}
.order .empty .btn{
    margin: 0;
    border-radius: 100rpx;
    height: 76rpx;
    line-height:76rpx;
    width:  280rpx;
    font-size: 30rpx;
    padding:0
}
.order .light{
    height: 240rpx;
    width: 240rpx;
}
.order .text-cancel{
    padding: 10rpx;
    margin-bottom: 30rpx;
    margin-top:25rpx;
    font-size: 30rpx;
}
.order .order-num{
    flex: 1;
}
.fui-tab-scroll .item {
    padding: 0 30rpx;
}
.order .fui-list-inner .subtitle {
  line-height:44rpx;
}
.no-border .fui-list-inner .subtitle {
  line-height:1.5;
}
.fui-list-inner.text-right:empty {display: none}
.row-remark{
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left:20rpx;
    color: #aaa;
    font-size: 26rpx;
    line-height: 1.5
}
</style>