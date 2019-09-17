<template>
<view class="page navbar">
  <!--发货状态  -->
  <view class="fui-list bg">
    <view class="row" style="font-size: 34rpx;">
      <view v-if="goods.type==1"><text v-if="log.status==1">未中奖</text></view>
      <view v-if="goods.goodstype==0">
          <block v-if="goods.isverify==1">
            <block v-if="log.status==2">待兑换</block>
            <block v-if="replyset.isreply==1">
              <block v-if="log.status ==3 && log.iscomment == 0">等待评价</block>
              <block v-if="log.status ==3 && log.iscomment == 1">追加评价</block>
              <block v-if="log.status ==3 && log.iscomment == 2">已完成</block>
            </block>
            <block v-else>
              <block v-if="log.status==3">已完成</block>
            </block>
          </block>
          <block v-else>
            <block v-if="log.status ==2 && log.addressid == 0">
              <block v-if="goods.type==0">已兑换</block>
              <block v-else>已中奖</block>
              ，请选择收货地址
            </block>
            <block v-if="log.status ==2 && log.addressid > 0 && log.time_send==0">等待卖家发货</block>
            <block v-if="log.status ==3 && log.time_send > 0 && log.time_finish==0">卖家已发货，等待签收</block>
            <block v-if="replyset.isreply==1">
              <block v-if="log.status ==3 && log.time_finish>0 && log.iscomment==0">等待评价</block>
              <block v-if="log.status ==3 && log.time_finish>0 && log.iscomment==1">追加评价</block>
              <block v-if="log.status ==3 && log.time_finish>0 && log.iscomment==2">已完成</block>
            </block>
            <block v-else>
              <block v-if="log.status ==3 && log.time_finish>0">已完成</block>
            </block>
          </block>
      </view>
      <view v-else>
        <block v-if="log.status ==2 && goods.goodstype == 3">
          <block v-if="goods.type==0">已兑换</block>
          <block v-else>已中奖</block>
          ，等待领取
        </block>
        <block v-if="replyset.isreply==1">
          <block v-if="log.status ==3 && log.iscomment==0">等待评价</block>
          <block v-if="log.status ==3 && log.iscomment==1">追加评价</block>
          <block v-if="log.status ==3 && log.iscomment==2">
            <block v-if="goods.goodstype==1">优惠券</block>
            <block v-if="goods.goodstype==2">余额</block>
            <block v-if="goods.goodstype==3">红包</block>已发放
          </block>
        </block>
        <block v-else>
          <block v-if="log.status ==3">
            <block v-if="goods.goodstype==1">优惠券</block>
            <block v-if="goods.goodstype==2">余额</block>
            <block v-if="goods.goodstype==3">红包</block>已发放
          </block>
        </block>
      </view>
    </view>
    <view class="order-price">
      商品总额:{{ordercredit}}积分<text v-if="ordermoney>0">+￥{{ordermoney}}</text>
      <text v-if="goods.goodstype==0 && goods.isverify==0">
        <block v-if="goods.dispatch>0">运费：￥{{goods.dispatch}}</block>
        <block v-else>免运费</block>
      </text>
    </view>
  </view>

  <!--收货地址  -->
  <view v-if="goods.goodstype==0 && address.id>0 && log.addressid>0" class="fui-list-group" hover-class="none">
    <navigator v-if="log.status == 3 && log.expresssn!=''" class="fui-list" :url="'/pages/creditshop/express/index?id=' + log.id" hover-class="none" open-type="navigate">
      <view class="fui-list-media"><view class="fui-list-icon"><i class="icox icox-icon049"></i></view></view>
      <view class="fui-list-inner">
          <view style="font-size:14px;line-height: 1.2rem;height: 1.2rem;">快递公司：{{log.expresscom}}</view>
          <view style="font-size:13px;color:#666">快递单号：{{log.expresssn}}</view>
      </view>
    </navigator>
    <view class="fui-list">
      <view class="fui-list-media"><view class="fui-list-icon"><i class="icox icox-dingwei1"></i></view></view>
      <view class="fui-list-inner">
        <view style="font-size:14px;line-height: 1.2rem;height: 1.2rem;">{{address.realname}} {{address.mobile}}</view>
        <view style="font-size:13px;color:#666">{{address.province}}{{address.city}}{{address.area}} {{address.address}}</view>
      </view>
    </view>
  </view>
  <!--支付选择运费 start-->
  <view class="fui-cell-group" id="addressInfo" v-if="goods.type==1 && log.addressid==0 && goods.goodstype==0">
    <navigator class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" v-if="address" hover-class="none" url="/pages/member/address/select" open-type="navigate">
        <view class="fui-cell-icon" style="margin-right:24rpx" v-if="address"><text class="icox icox-dingwei1"></text> </view>
        <view class="fui-cell-text textl info" :style="(address?'':'display:flex;justify-content: center;' )">
            <view v-if="address" class="has-address ">
            <view>收货人：<text class="name">{{address.realname }} </text><text class="mobile">{{ address.mobile }}</text></view>
            </view>
            <view class="adress" v-if="address">{{ address.province+address.city+address.area+' '+address.address }}</view>
            <view class="text no-address" @tap="address" data-type="open" v-if="!address">添加收货地址</view>
        </view>
        <view class="fui-cell-remark"></view>
    </navigator>

    <navigator class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" hover-class="none" v-if="!address && !isonlyverifygoods" url="/pages/member/address/post?type=quickaddress" open-type="navigate">
        <view class="fui-cell-text textl info" style="display:flex;justify-content: center;">
            <view class="fui-cell-icon"><text class="icox icox-icon02" style="color:#ff5555"></text> </view>
            <view class="text no-address" data-type="open">添加收货地址</view>
        </view>
        <view class="fui-cell-remark"></view>
    </navigator>
  </view>
  <!--支付选择运费 end-->
  <!--商品信息  -->
  <view class="fui-list-group" style="padding-bottom: 20rpx;">
    <view class="fui-list-group-title">
      <view class="fui-list-icon"><i class="icox icox-dianpu1"></i></view>
      <view class="text">{{shop.name}}</view>
    </view>
    <navigator class="fui-list goods-item" :url="'/pages/creditshop/detail/index?id=' + goods.id" hover-class="none" open-type="navigate">
      <view class="fui-list-media">
        <image class="goods_img" :src="goods.thumb"></image>
      </view>
      <view class="fui-list-inner" style="height: 140rpx;padding-right: 20rpx;">
        <view class="text">{{goods.title}}</view>
        <view class="text" v-if="log.optionid>0">规格：{{goods.optiontitle}}</view>
      </view>
      <view class="price text-right" style="height: 140rpx;">
        <view class="text-right">
          <text>
            {{goods.credit}}积分<block v-if="goods.money>0">+￥{{goods.money}}</block>
          </text>
        </view>
        <view class="text-right" style="color: #999;">x<text>{{log.goods_num}}</text></view>
      </view>
    </navigator>
  </view>
  <!--兑奖码 start-->
  <view v-if="goods.isverify==1 && log.status > 1" :class="'fui-cell-group ' + togglecode">
    <view class="fui-cell" @tap="togglecode">
          <view class="fui-cell-icon"><text class="icox icox-dianpu1"></text> </view>
        <view class="fui-cell-label differ">
            <text class="store">兑奖码</text>
        </view>
        <view class="fui-cell-info"></view>
        <view class="num">1</view>
        <view class="fui-cell-remark"></view>
    </view>
    <view class="send-code">
      <view class="fui-list noclick">
          <view class="fui-list-inner store-inner">
              <view class="text">
                  {{ log.eno }}
              </view>
          </view>
          <view class="fui-list-angle ">
              <block v-if="verify.isverify">
                <text class="fui-label fui-label-danger">已使用</text>
              </block>
              <block v-else>
                  <block v-if="goods.verifytype==1">
                      <block v-if="verifynum==0">
                          <text class="fui-label fui-label-danger">已使用</text>
                      </block>
                      <block v-else>
                          <text class="fui-label fui-label-default">剩余{{verifynum}} 次</text>
                      </block>
                  </block>
                  <block v-else>
                      <text class="fui-label fui-label-default">未使用</text>
                  </block>
              </block>
          </view>
      </view>
  </view>
</view>
<!--兑奖码 end-->
<!--适用门店 start-->
  <view :class="'fui-cell-group ' + togglestore" v-if="stores.length>0">
    <view class="fui-cell" @tap="toggle">
          <view class="fui-cell-icon"><text class="icox icox-dianpu1"></text> </view>
        <view class="fui-cell-label differ">
            <text class="store">适用门店</text>
        </view>
        <view class="fui-cell-info"></view>
        <view class="num">{{stores.length}}</view>
        <view class="fui-cell-remark"></view>
    </view>
    <view class="send-code">
      <view class="fui-list noclick" v-for="(item, index) in stores" :key="index">
          <view class="fui-list-media">
                <text class="icox icox-dianpu1"></text>
          </view>
          <view class="fui-list-inner store-inner">
              <view class="title">
                  <text class="storename">{{ item.storename }}</text>
              </view>
              <view class="text">
                  <text class="realname">{{ item.realname }} {{ item.mobile }}</text>
              </view>
              <view class="text">
                  <text class="address">{{ item.address }}</text>
              </view>
          </view>
          <view class="fui-list-angle ">
               <view class="icox icox-kefu2" @tap="phone" :data-phone="item.mobile"></view>
              <navigator :url="'/pages/order/store/map?id=' + item.id + '&merchid=' + item.merchid" hover-class="none" open-type="navigate">
                  <text class="icox icox-dingwei1"></text>
              </navigator>
          </view>
      </view>
  </view>
</view>
<!--使用门店 end-->

  <view class="fui-cell-group price-cell-group">
    <view class="fui-cell">
      <view class="fui-cell-label">商品小计</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">{{ordercredit}}积分<block v-if="ordermoney>0">+￥{{ordermoney}}</block></view>
    </view>
    <view class="fui-cell" v-if="goods.goodstype==0 && goods.isverify==0">
      <view class="fui-cell-label">运费</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">
        <block v-if="goods.dispatch>0">￥{{goods.dispatch}}</block>
        <block v-else>免运费</block>
      </view>
    </view>
    <view class="fui-cell">
      <view class="fui-cell-label" style="width: 300rpx">实付款<block v-if="goods.isverify==0">（含运费）</block></view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark" style="color: #ff5555;">
        {{ordercredit}}积分<block v-if="allmoney>0">+￥{{allmoney}}</block>
      </view>
    </view>
  </view>

  <!--订单信息  -->
  <view class="fui-cell-group">
    <view class="order-info">
      <view class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">订单编号：{{log.logno}}</text>
      </view>
      <view class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">创建时间：{{log.createtimestr}}</text>
      </view>
      <view v-if="log.status>=1" class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">支付时间：{{log.createtimestr}}</text>
      </view>
      <view v-if="log.status>=2 && log.time_send > 0" class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">发货时间：{{log.time_sendstr}}</text>
      </view>
      <view v-if="log.status==3 && log.time_finish" class="fui-cell-label" style="font-size:12px;color:#999">
        <text class="fui-cell-label">完成时间：{{log.time_finishstr}}</text>
      </view>
    </view>
  </view>

  <!--底部  -->
  <view class="fui-footer">
    <navigator hover-class="none" open-type="navigate" url="/pages/creditshop/index" class="btn btn-default btn-default-o pull-left">
      返回首页
    </navigator>
    <view v-if="goods.isverify==0 && goods.goodstype==0 && log.addressid==0" class="btn btn-warning btn-default-o order-finish pull-right" @tap="paydispatch" :data-paytype="(goods.dispatch>0?'dispatch':'nodispatch')">
      <block v-if="goods.dispatch>0">支付运费</block>
      <block v-else>确认兑换</block>
    </view>

    <block v-if="replyset.isreply==1  && log.time_finish > 0">
      <block v-if="goods.goodstype==0 || goods.goodstype==1">
        <navigator v-if="log.status == 3 && log.iscomment == 1" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + log.id + '&goodsid=' + goods.id" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
          <block>追加评价</block>
        </navigator>
        <navigator v-if="log.status == 3 && log.iscomment == 0" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + log.id + '&goodsid=' + goods.id" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
          <block>评价</block>
        </navigator>
      </block>
      <block v-if="goods.goodstype==2 || goods.goodstype==3">
        <navigator v-if="log.status == 3 && log.iscomment == 1" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + log.id + '&goodsid=' + goods.id" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
          <block>追加评价</block>
        </navigator>
        <navigator v-if="log.status == 3 && log.iscomment == 0" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + log.id + '&goodsid=' + goods.id" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
          <block>评价</block>
        </navigator>
      </block>
    </block>


    <navigator v-if="goods.goodstype== 0 && goods.isverify > 0 && (log.status == 2 || log.status == 3 && verifynum > 0)" hover-class="none" open-type="navigate" :url="'/pages/creditshop/verify/index?id=' + log.id" class="btn btn-default btn-default-o pull-right">
      兑换二维码
    </navigator>
    <view v-if="goods.goodstype==0 && log.status==3 && log.time_send > 0 && log.time_finish == 0" class="btn btn-default btn-default-o order-finish pull-right" @tap="finish">
      确认收货  
    </view>
  </view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
    	<!--空白快  适应iponex  -->
	<view v-if="isIpx" style="hight: 50rpx;"></view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var $ = app.requirejs('jquery'); // pages/integral/order/detail/index.js

export default {
  data() {
    return {
      options: [],
      log: [],
      logid: 0,
      store: [],
      stores: [],
      goods: [],
      verifynum: 0,
      replyset: [],
      ordercredit: 0,
      ordermoney: 0,
      address: [],
      carrier: [],
      shop: [],
      allmoney: [],
      togglestore: '',
      togglecode: '',
      verify: [],
      iswechat: true,
      paymentmodal: false
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
    var $this = this; // var specs = [];
    // var options = [];

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

    $this.getDetail();
    /*获取授权*/

    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        $this.setData({
          limits: limits
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    options = options || {};
    wx.getSystemInfo({
      success: function (result) {
        $this.setData({
          windowWidth: result.windowWidth,
          windowHeight: result.windowHeight
        });
      }
    });
    $this.setData({
      options: options,
      logid: options.id
    });
  },
  components: {},
  props: {},
  methods: {
    getDetail: function () {
      var $this = this;
      var options = $this.data.options;
      core.get('creditshop/log/detail', options, function (result) {
        if (result.error == 0) {
          var allmoney = parseFloat(result.ordermoney) + parseFloat(result.log.dispatch);
          $this.setData({
            log: result.log,
            store: result.store,
            stores: result.stores,
            goods: result.goods,
            verifynum: result.verifynum,
            log: result.log,
            replyset: result.set,
            ordercredit: result.ordercredit,
            ordermoney: result.ordermoney,
            address: result.address,
            carrier: result.carrier,
            shop: result.shop,
            allmoney: allmoney,
            verify: result.verify
          });
          var allprice = 0;

          if (result.goods.isverify == 0 && result.address.lenght > 0) {
            core.get('creditshop/dispatch', {
              goodsid: result.goods.id,
              optionid: options.id
            }, function (res) {
              allprice = res.dispatch;
              $this.setData({
                dispatchprice: allprice
              });
            });
          }

          allprice = parseFloat(allprice) + parseFloat(result.goods.money);
          $this.setData({
            allprice: allprice
          });
        }
      });
    },
    toggle: function (e) {
      var $this = this;
      var togglestore = $this.data.togglestore;

      if (togglestore == '') {
        $this.setData({
          togglestore: 'toggleSend-group'
        });
      } else {
        $this.setData({
          togglestore: ''
        });
      }
    },
    togglecode: function (e) {
      var $this = this;
      var togglecode = $this.data.togglecode;

      if (togglecode == '') {
        $this.setData({
          togglecode: 'toggleSend-group'
        });
      } else {
        $this.setData({
          togglecode: ''
        });
      }
    },
    finish: function () {
      var $this = this;
      wx.showModal({
        title: '提示',
        content: '确认已收到货了吗？',
        success: function (sm) {
          if (sm.confirm) {
            var logid = $this.data.log.id;
            core.get('creditshop/log/finish', {
              id: logid
            }, function (res) {
              if (res.error == 0) {
                foxui.toast($this, "确认收货");
                $this.onShow();
              } else {
                foxui.toast($this, res.message);
                return;
              }
            });
          }
        }
      });
    },
    paydispatch: function (e) {
      var $this = this;
      var dispatchtype = e.currentTarget.dataset.paytype;
      var content = '';

      if (dispatchtype == 'dispatch') {
        content = "确认兑换并支付运费吗";
      } else {
        content = "确认兑换吗";
      }

      wx.showModal({
        title: '提示',
        content: content,
        success: function (sm) {
          if (sm.confirm) {
            var logid = $this.data.log.id;
            var dispatchprice = $this.data.goods.dispatch;
            core.get('creditshop/log/paydispatch', {
              id: logid,
              addressid: $this.data.address.id,
              dispatchprice: dispatchprice
            }, function (res) {
              if (res.error > 0) {
                fui.toast($this, res.message);
                return;
              }

              if (res.wechat && res.wechat.success) {
                core.pay(res.wechat.payinfo, function (res) {
                  if (res.errMsg == "requestPayment:ok") {
                    $this.payResult();
                  }
                });
              }
            });
          }
        }
      });
    },
    payResult: function () {
      var $this = this;
      core.get('creditshop/log/paydispatchresult', {
        id: $this.data.log.id
      }, function (res) {
        if (res.error > 0) {
          fui.toast($this, res.message);
          return;
        }

        $this.onShow();
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
@import "../../../../static/css/order.css";
.bg{
  background: -moz-linear-gradient(left, #ff795a 0%, #ff4141 100%);
    background: -webkit-linear-gradient(left, #ff795a 0%,#ff4141 100%);
    background: -o-linear-gradient(left, #ff795a 0%,#ff4141 100%);
    background: -ms-linear-gradient(left, #ff795a 0%,#ff4141 100%);
    background: linear-gradient(to right, #ff795a 0%,#ff4141 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ff795a, endColorstr=#ff4141,gradientType='1');
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    font-size: 26rpx;
    height: 160rpx;
    color: #fff;
}

.order-info{
    padding: 20rpx 0
}
.order-info view{
    padding: 6rpx 25rpx;
    color: #666;
    font-size: 28rpx;
}
.btn{
  height:56rpx;
  line-height:52rpx;
  border-radius: 40rpx;
  padding: 0 26rpx;
  margin-top: 24rpx;
  font-size: 26rpx
}

.text-right{
  font-size: 26rpx;
}

.fui-cell-group .num{background: #f00;padding:0 10rpx;border-radius: 50%;color:#fff;font-size:24rpx;}
</style>