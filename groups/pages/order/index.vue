<template>
<view>
<!--pages/groups/order/imdex.wxml-->
<view class="page order" :style="(isIpx?'padding-bottom:168rpx':'')">
    <view class="fui-tab fixed" scroll-x="true" style="overflow-x:scroll">
      <view :class="'item ' + ( type_==''?'active':'' )" @tap="get_list" data-type_>全部</view>
      <view :class="'item ' + ( type_=='0'?'active':'' )" @tap="get_list" data-type_="0">待付款</view>
      <view :class="'item ' + ( type_=='1'?'active':'' )" @tap="get_list" data-type_="1">待发货</view>
      <view :class="'item ' + ( type_=='2'?'active':'' )" @tap="get_list" data-type_="2">待收货</view>
      <view :class="'item ' + ( type_=='3'?'active':'' )" @tap="get_list" data-type_="3">已完成</view>
    </view>

    <!--  -->
    <view class="contain">
      <view class="fui-list-group noclick" v-if="list.length>0" v-for="(item, index) in list" :key="index">
        <navigator :url="'../order_detail/index?order_id=' + item.id" hover-class="none" open-type="navigate">
          <view class="fui-list-group-title" style="color:#666;font-size:26rpx">
            <view class="order-num">
              <text selectable="true">订单号：{{item.orderno}}</text>
            </view>
            <view class="text-default" v-if="item.status == -1">已取消</view>
            <view class="text-default" v-if="item.status == 0">待付款</view>
            <view class="text-success" v-if="item.status == 1 && (item.success == 0 && item.is_team == 1)">已付款</view>
            <view class="text-warning" v-if="item.status == 1 && (item.success == 1 || item.is_team == 0) && item.isverify == 0">待发货</view>
            <view class="text-danger" v-if="item.status == 1 && (item.success == 1 || item.is_team == 0) && item.isverify == 1">待收货</view>
            <view class="text-primary" v-if="item.status == 2 && item.success == -1">待退款</view>
            <view class="text-danger" v-if="item.status == 2">待收货</view>
            <view class="text-success" v-if="item.status == 3">已完成</view>
          </view>
          <view class="fui-list goods-info">
            <view class="fui-list-media">
              <image class="goods_img" :src="item.thumb"></image>
            </view>
            <view class="fui-list-inner" style="height:140rpx">
              <view class="text text-left">{{item.title}}</view>
              <view class="subtitle text-left">{{item.description}}</view>
            </view>
            <view class="num">
              <view class="text-right">¥
                <text>{{item.goods_price}}/{{item.goodsnum}}{{item.units}}</text>
              </view>
              <view class="text-right" style="color:#666">x
                <text>1</text>
              </view>
            </view>
          </view>
          <view class="fui-list list-padding">
            <text class="fui-list-inner text-right totle">共1件商品 实付<text class="text-danger">¥<text>{{item.amount}}</text></text>
            </text>
          </view>
        </navigator>
        <view class="fui-list list-padding" style="padding:0 24rpx">
          <view class="fui-list-inner text-right" style="padding:10rpx 0">
          <!--取消订单 去付款 删除订单 确认收货 我要使用  -->
            <view v-if="item.status == 2" :data-orderid="item.id" class="btn btn-danger btn-danger-o" @tap="finish">
                确认收货 
              </view>

              <view v-if="item.status == 0" class="btn btn-default btn-default-o">
              <picker :value="cancelindex" :range="cancel" @change="cancel" :data-orderid="item.id">取消订单</picker>
            </view>
              <!-- <view wx:if="{{item.status == 0}}" data-orderid="{{item.id}}" class="btn btn-danger btn-default-o" bindtap="cancel">
                去付款
              </view> -->
              <navigator v-if="item.status == 0" class="btn btn-danger-o btn-sm" :url="'../pay/index?id=' + item.id + '&teamid=' + item.teamid">去付款</navigator>
              <view v-if="item.isverify == 1 && item.status > 0 && item.vnum > 0 && item.refundstate == 0 && (item.success == 1 || item.is_team == 0) " :data-orderid="item.id" :data-verifycode="item.verifycode" class="btn btn-danger btn-default-o" @tap="code">
                我要使用
              </view>
              <view class="btn btn-danger btn-default-o" :data-orderid="item.id" @tap="delete_" v-if="item.status == 3 || item.status == -1">
                删除订单
              </view>
          </view>
        </view>
      </view>
    </view>
    <!--数据为空  -->
   <view class="empty" v-if="list.length==0">
    <image src="/static/images/icon/nolist.png"></image>
    <view class="text">暂时没有相关</view>
  </view> 
     <!--底部导航  -->
<view :class="'fui-navbar footer-nav ' + iphonexnavbar">
    <navigator url="/pages/index/index" class="nav-item" hover-class="none" open-type="switchTab">
      <span class="icox icox-back"></span>
      <span class="label">返回商城</span>
    </navigator>
    <navigator class="nav-item" hover-class="none" url="../index/index" open-type="reLaunch">
          <span class="icox icox-shouye1"></span>
          <span class="label">拼团首页</span>
        </navigator>
    <navigator url="../category/index" class="nav-item " hover-class="none" open-type="reLaunch">
          <span class="icox icox-quanbukanjia"></span>
          <span class="label">活动列表</span>
        </navigator>
    <navigator class="nav-item active" hover-class="none" url="../order/index" open-type="reLaunch">  
          <span class="icox icox-kanjiazhong"></span>
          <span class="label">我的订单</span>
        </navigator>
    <navigator url="../mygroups/index" class="nav-item" hover-class="none" open-type="reLaunch">
          <span class="icox icox-yigoumai"></span>
          <span class="label">我的团</span>
        </navigator>
      </view>
  <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
  <!--弹出模态框-->
  <include src="/pages/order/public/verify.wxml"></include>
</view>
</template>

<script>
// pages/groups/order/imdex.js
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');
var order = app.requirejs('biz/group_order');

export default {
  data() {
    return {
      type_: '',
      page: 1,
      list: [],
      cancel: order.cancelArray
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.page + 1
    });
    this.get_list();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      list: []
    });
    this.get_list();
  },

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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      });
    }

    this.setData({
      options: options
    });
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function (e) {
      var $this = this;

      if (e) {
        if (e.target) {
          if ($this.data.type_ == e.target.dataset.type_) {
            return;
          }

          $this.setData({
            type_: e.target.dataset.type_
          });
        }

        $this.setData({
          page: 1,
          list: []
        });
      }

      core.get('groups/order', {
        status: $this.data.type_,
        page: $this.data.page
      }, function (result) {
        if (result.error == 0) {
          $this.setData({
            list: $this.data.list.concat(result.list)
          });
          wx.stopPullDownRefresh();
        }
      });
    },
    finish: function (e) {
      var $this = this;
      var order_id = e.target.dataset.orderid;
      core.confirm('是否确认收货', function () {
        core.get('groups/order/finish', {
          id: order_id
        }, function (result) {
          if (result.error == 0) {
            $this.get_list(true);
          } else {
            core.alert(result.result.message);
          }
        });
      });
    },
    delete_: function (e) {
      var $this = this;
      var order_id = e.target.dataset.orderid;
      core.confirm('是否确认删除', function () {
        core.get('groups/order/delete', {
          id: order_id
        }, function (result) {
          if (result.error == 0) {
            $this.get_list(true);
          } else {
            core.alert(result.result.message);
          }
        });
      });
    },
    // cancel:function(e){
    //   var $this = this;
    //   var order_id = e.target.dataset.orderid;
    //   core.confirm('是否确认取消', function () {
    //     core.get('groups/order/cancel', { id: order_id }, function (result) {
    //       if (result.error == 0) {
    //         $this.get_list(true);
    //       }else{
    //         core.alert(result.result.message);
    //       }
    //     })
    //   });
    // },
    cancel: function (e) {
      var order_id = e.target.dataset.orderid;
      order.cancel(order_id, e.detail.value, '/groups/pages/order_detail/index?order_id=' + order_id);
    },
    close: function () {
      this.setData({
        code: false
      });
    },
    code: function (e) {
      var $this = this,
          orderid = core.data(e).orderid,
          verifycode = core.data(e).verifycode;
      core.post('groups/verify/qrcode', {
        id: orderid,
        verifycode: verifycode
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
/* pages/groups/order/imdex.wxss */
/* pages/order/list/index.wxss */
@import "../../../static/css/order.css";
page{
    background:#f7f7f7;
   
    }
.goods-info{
    width: auto
}
.page{
 padding-bottom:100rpx;
}
/*数据为空  */
.empty{
  text-align: center
}
.empty image{
  width: 240rpx;
  height: 240rpx;
  margin-top: 150rpx;
}
.empty .text{
  font-size: 28rpx;
  line-height: 110rpx;
  color: #999
}
.fui-tab .item.active {
	transition-duration: 300ms;
	transition-property: border-color;
  border-color: #ff5555;
  color: #ff5555;
  position: relative;
  z-index: 2
}
.order .contain{
    margin-top: 80rpx;
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