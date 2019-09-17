<template>
<view class="fui-content">
<!--地址信息-->
<view class="fui-cell-group" id="addressInfo" v-if="isverify==0 && goods.type==0 && goods.goodstype==0">
  <navigator class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" v-if="address" hover-class="none" url="/pages/member/address/select" open-type="navigate">
      <view class="fui-cell-icon" style="margin-right:24rpx" v-if="address"><text class="icox icox-dingwei1"></text> </view>
      <view class="fui-cell-text textl info" :style="(address?'':'display:flex;justify-content: center;' )">
          <view v-if="address" class="has-address ">
          <view>收货人：</view><text class="name">{{address.realname }} </text><text class="mobile">{{ address.mobile }}</text>
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
<!--核销人员信息 start-->
<view class="fui-cell-group" v-if="isverify==1">
  <view class="fui-cell">
      <view class="fui-cell-label">姓名</view>
      <view class="fui-cell-info"><input type="text" placeholder="请输入姓名" class="fui-input textl" :value="member.realname" @input="listChange" id="realname"></input></view>
  </view>
  <view class="fui-cell">
      <view class="fui-cell-label">电话</view>
      <view class="fui-cell-info"><input type="text" placeholder="请输入电话" class="fui-input textl" :value="member.mobile" @input="listChange" id="mobile"></input></view>
  </view>
</view>
<!--核销人员信息 end-->
<!--门店选择 start-->
<view class="fui-cell-group" v-if="isverify==1">
    <navigator class="fui-cell" hover-class="none" style="padding-top:16px;padding-bottom:16px" :url="'/pages/order/store/index?merchid=' + merchid" open-type="navigate">
        <view class="fui-cell-text" style="margin-right:24rpx">请选择兑换门店</view>
        <view class="fui-cell-info textl info">
            <view class="shop_name">{{carrierInfo.storename}}</view>
            <view class="adress">{{carrierInfo.address}}</view>
        </view>
        <view class="fui-cell-remark"></view>
    </navigator>
</view>
<!--门店选择 end-->

<!--商品信息  -->
<view class="fui-list-group">
  <navigator class="fui-list-group-title" hover-class="none" open-type url>
    <view class="fui-cell-icon" style="margin-right: 24rpx;">
      <i class="icox icox-dianpu1"></i>
    </view>
    <view class="shop">{{shop.name}}</view>
  </navigator>
  <view class="fui-list goods-item noclick">
    <view class="fui-list-media">
      <image class="goods_img" :src="goods.thumb"></image>
    </view>
    <view class="fui-list-inner">
      <view class="title">{{goods.title}}</view>
      <view class="text" v-if="goods.hasoption>0">规格：{{goods.optiontitle}}</view>
      <view class="text">{{goods.credit}}积分<span v-if="goods.money>0">+￥{{goods.money}}</span></view>
    </view>
    <view class="fui-list-angle" v-if="goods.type==0" @tap="number">
      <view class="fui-number small">
        <view class="minus disabled" data-action="minus">-</view>
        <input class="num shownum" type="tel" :value="goods.num" disabled="disabled"></input>
        <view class="plus" data-action="plus">+</view>
      </view>
    </view>
  </view>
</view>
<!--买家留言 start--
<view class="fui-cell-group">
    <view class="fui-cell fui-cell-textarea">
      <view class="fui-cell-label">
          买家留言
      </view>
      <view class="fui-cell-info">
          <textarea rows="2" placeholder="50字以内（选填）" id="remark" bindinput="dataChange"></textarea>
      </view>
  </view>
</view>
--买家留言 end-->
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
<view class="fui-cell-group">
  <view class="fui-cell">
      <view class="fui-cell-label">商品小计</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">
      {{goods.credit * goods.num}}积分 <span v-if="goods.money>0">+ ￥{{goods.money * goods.num}}</span>
      </view>
  </view>
  <view class="fui-cell" v-if="goods.isverify==0 && dispatchprice>0">
      <view class="fui-cell-label">运费</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">¥
          <text>{{dispatchprice}}</text>
      </view>
  </view>
</view>
<view style="height:100rpx;display:block;width:100%;"></view>
<view class="fui-footer">
  <view class="tool nopadding">
    <view class="text">
      <view class="title text-right">需付：
        <text class="text-danger">{{goods.credit * goods.num}}积分<text v-if="allprice>0">+￥{{allprice}}</text></text>
      </view>
    </view>
    <view class="btns">
      <text class="btn btn-danger" @tap="pay">立即支付</text>
    </view>
  </view>
</view>

<!--确认兑换弹窗  -->
<view class="showmodal" v-if="showmodal">
  <view class="inner">
    <view class="text">确认要兑换吗</view>
    <view class="btns">
      <view class="item btn-cancel" @tap="cancel">取消</view>
      <view class="item btn-confirm" @tap="confirm">确定</view>
    </view>
  </view>
</view>

<!-- 兑换成功弹窗 -->
<view class="successmodal" v-if="successmodal">
  <i class="icox icox-duihao2"></i>
  <view class="text">{{successmessage}}</view>
  <view class="btn-danger" v-if="successstatus" @tap="success">确定</view>
</view>

<!--选择支付方式  -->
<view class="paymentmodal" v-if="paymentmodal">
  <view class="inner">
    <view class="item" v-if="iswechat" @tap="payClick" data-type="wechat">微信支付</view>
    <view class="item" v-if="iscredit" @tap="payClick" data-type="credit">余额支付</view>
    <view class="item cancel" @tap="cancel">取消</view>
  </view>
</view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
    	<!--空白快  适应iponex  -->
	<view v-if="isIpx" style="hight: 50rpx;"></view>
</view>
</template>

<script>
/**
 *
 * index.js
 *
 * @create 2017-01-04
 * @author 咖啡
 *
 *
 */
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      paymentmodal: false,
      showmodal: false,
      successmodal: false,
      member: [],
      goods: [],
      options: [],
      carrierInfo: [],
      stores: [],
      is_openmerch: false,
      isverify: false,
      iswechat: true,
      iscredit: true,
      paytype: '',
      togglestore: '',
      addressid: 0,
      dispatchprice: 0,
      allprice: 0,
      logid: 0,
      successmessage: '',
      successstatus: false
    };
  },

  /*页面加载*/
  onShow: function () {
    var $this = this; // var specs = [];
    // var options = [];

    var isIpx = app.getCache('isIpx');
    var address = app.getCache("orderAddress"),
        shop = app.getCache("orderShop");

    if (shop) {
      $this.setData({
        carrierInfo: shop
      });
    }

    var addressid = $this.data.addressid;

    if (address.id > 0) {
      $this.addressid = address.id;
      $this.setData({
        addressid: address.id
      });
      $this.getDetail();
    }

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

    var member = $this.data.member;

    if (member == '') {
      $this.getDetail();
    }
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
      options: options
    });
  },
  components: {},
  props: {},
  methods: {
    /*核销人员信息*/
    listChange: function (e) {
      var member = this.member,
          id = e.target.id;

      switch (id) {
        case 'realname':
          member.realname = e.detail.value;
          break;

        case 'mobile':
          member.mobile = e.detail.value;
          break;
      }

      this.setData({
        member: member
      });
    },

    /*订单详情*/
    getDetail: function () {
      var $this = this;
      var options = $this.data.options;
      core.get('creditshop/create', options, function (result) {
        if (result.error == 0) {
          result.goods.num = 1;
          $this.setData({
            goods: result.goods,
            address: result.address,
            shop: result.shop,
            stores: result.stores,
            isverify: result.goods.isverify,
            member: result.member,
            addressid: result.address.id
          });
          var allprice = 0;

          if (result.goods.isverify == 0 && result.goods.type == 0 && result.address.id > 0) {
            core.get('creditshop/create/getaddress', {
              addressid: $this.addressid
            }, function (rest) {
              if (rest.error == 0) {
                $this.setData({
                  address: rest.address
                });
              }
            });
            $this.dispatch();
          } else {
            $this.setData({
              allprice: result.goods.money
            });
          }
        }
      });
    },
    dispatch: function () {
      var $this = this;
      core.get('creditshop/create/dispatch', {
        goodsid: $this.data.goods.id,
        optionid: $this.data.options.optionid
      }, function (res) {
        var allprice = res.dispatch;
        allprice = parseFloat(allprice) + parseFloat($this.data.goods.money);
        $this.setData({
          dispatchprice: res.dispatch,
          allprice: allprice
        });
      });
    },
    number: function (e) {
      var $this = this,
          goods = $this.data.goods,
          options = $this.data.options;
      var action = e.target.dataset.action;

      if (action == 'minus') {
        goods.num = parseInt(goods.num) - 1;
      } else if (action == 'plus') {
        goods.num = parseInt(goods.num) + 1;
      }

      if (goods.num < 1) {
        goods.num = 1;
      }

      var num = goods.num;
      core.get('creditshop/create/number', {
        goodsid: goods.id,
        optionid: options.id,
        num: num
      }, function (res) {
        if (res.goods.canbuy == false) {
          if (goods.num > 1) {
            goods.num = parseInt(goods.num) - 1;
          }

          $this.setData({
            goods: goods
          });
          foxui.toast($this, res.goods.buymsg);
          return;
        } else {
          goods = res.goods;
          goods.num = num;
          var allprice = parseFloat(goods.money * num) + parseFloat(goods.dispatch);
          $this.setData({
            goods: goods,
            allprice: allprice
          });
        }
      });
    },

    /*
    inputNumber:function(e){
      var $this = this;
      var goods = $this.data.goods;
      var options = $this.data.options;
      goods.num = parseInt(e.detail.value);
      var num = goods.num;
      core.get('creditshop/create/number', { goodsid: goods.id, optionid: options.id, num: num }, function (res) {
        if (res.goods.canbuy == false) {
          if (goods.num > 1) {
            goods.num = parseInt(goods.num) - 1;
          }
          $this.setData({ goods: goods });
          foxui.toast($this, res.goods.buymsg);
          return;
        } else {
          goods = res.goods;
          var allprice = parseFloat(goods.money * num) + parseFloat(goods.dispatch);
          $this.setData({ goods: goods, allprice: allprice });
        }
      });  
    },*/
    // 立即支付
    pay: function () {
      var $this = this;
      var goods = $this.data.goods;

      if (!goods.canbuy) {
        foxui.toast($this, $this.data.goods.buymsg);
        return;
      }
      /*核销商品提交订单*/


      if (goods.isverify > 0) {
        var member = $this.data.member;

        if (member.realname == '') {
          foxui.toast($this, "请填写真实姓名");
          return;
        }

        if (member.mobile == '') {
          foxui.toast($this, "请填写联系电话");
          return;
        }

        var carrierInfo = $this.data.carrierInfo;

        if (carrierInfo.length == 0) {
          foxui.toast($this, "请选择兑换门店");
          return;
        }
      }
      /*选择地址*/


      if (goods.isverify == 0 && goods.goodstype == 0 && goods.type == 0) {
        var addressid = $this.data.addressid;

        if (addressid == 0 || addressid == undefined) {
          foxui.toast($this, "请选择收货地址");
          return;
        }
      }

      if (goods.type == 1) {
        $this.setData({
          addressid: 0
        });
      }

      $this.setData({
        paymentmodal: true
      });
    },
    // 取消
    cancel: function () {
      var $this = this;
      $this.setData({
        paymentmodal: false,
        showmodal: false
      });
    },

    /*支付*/
    payClick: function (e) {
      var $this = this;
      var paytype = e.target.dataset.type;
      $this.setData({
        paymentmodal: false,
        showmodal: true,
        paytype: paytype
      });
    },
    // 确定
    confirm: function () {
      var $this = this;
      var paytype = $this.data.paytype;
      core.get('creditshop/detail/pay', {
        id: $this.data.goods.id,
        optionid: $this.data.optionid,
        num: $this.data.goods.num,
        paytype: $this.data.paytype,
        addressid: $this.data.addressid,
        storeid: $this.data.carrierInfo.id
      }, function (res) {
        if (res.error > 0) {
          foxui.toast($this, res.message);
          return;
        }

        $this.setData({
          logid: res.logid
        });

        if (res.wechat && res.wechat.success) {
          core.pay(res.wechat.payinfo, function (res) {
            if (res.errMsg == "requestPayment:ok") {
              $this.lottery();
            }
          });
        }

        if (paytype == 'credit' && res.logid > 0) {
          $this.lottery();
        }
      });
    },

    /*确认兑换成功*/
    success: function () {
      var $this = this;
      var logid = $this.data.logid; //$this.setData({ successmodal:false});

      wx.redirectTo({
        url: '/pages/creditshop/log/detail/index?id=' + logid
      });
    },
    lottery: function () {
      var $this = this;
      var gtype = $this.data.goods.type;
      var successmessage = '';

      if (gtype == 0) {
        core.get('creditshop/detail/lottery', {
          id: $this.data.goods.id,
          logid: $this.data.logid
        }, function (res) {
          if (res.error > 0) {
            foxui.toast($this, res.message);
            return;
          }

          if (res.status == 2) {
            successmessage = "恭喜您，商品兑换成功";
          }

          if (res.status == 3) {
            if (res.goodstype == 1) {
              successmessage = "恭喜您，优惠券兑换成功";
            } else if (res.goodstype == 2) {
              successmessage = "恭喜您，余额兑换成功";
            } else if (res.goodstype == 3) {
              successmessage = "恭喜您，红包兑换成功";
            }
          }

          $this.setData({
            successmessage: successmessage,
            successstatus: true
          });
        });
      } else {
        successmessage = "努力抽奖中，请稍后....";
        $this.setData({
          successmessage: successmessage,
          successstatus: true
        });
        setTimeout(function () {
          core.get('creditshop/detail/lottery', {
            id: $this.data.goods.id,
            logid: $this.data.logid
          }, function (res) {
            if (res.error > 0) {
              foxui.toast($this, res.message);
              return;
            }

            if (res.status == 2) {
              successmessage = "恭喜您，您中奖啦";
            } else if (res.status == 3) {
              if (res.goodstype == 1) {
                successmessage = "恭喜您，优惠券已经发到您账户啦";
              } else if (res.goodstype == 2) {
                successmessage = "恭喜您，余额已经发到您账户啦";
              } else if (res.goodstype == 3) {
                successmessage = "恭喜您，红包兑换成功";
              }
            } else {
              successmessage = "很遗憾，您没有中奖";
            }

            $this.setData({
              successmessage: successmessage,
              successstatus: true
            });
          });
        }, 1000);
      }

      $this.setData({
        successmodal: true
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
@import "../../../static/css/order.css";
page{
  background: #f7f7f7;
}

.fui-list-angle {
    margin-right:0;
    text-align:right;
    height: 140rpx;
}
.fui-list-angle .text-right{
  color: #999;
  font-size: 28rpx;
}
.fui-number{
    backface-visibility: hidden;
    box-sizing: border-box;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    font-size:26rpx;
    margin: 0;
   height:44rpx;
    width:144rpx;
    border:1px solid #d9d9d9;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-top: 88rpx
}
.minus,.plus{
    width:44rpx;
    height:44rpx;
    font-size:26rpx;
    line-height:44rpx;
    color: #999;
    position: relative;
    text-align: center;
    background: #f7f7f7;
    z-index: 1;
}
.plus{
    border-left: 1px solid #d9d9d9;
}
.minus{
    border-right: 1px solid #d9d9d9;
}
.fui-number .num{
  flex: 1;
  text-align: center;
}
.fui-list-inner .title{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0;
  white-space: inherit;
  height: 80rpx;
}
.btn{
    padding: 0 60rpx;
    border-radius: 0;
    height: 100rpx;
    line-height: 100rpx;
    margin: 0;
}
.fui-list-inner .text{
  font-size: 24rpx;
  margin-top: 20rpx;
}

/*确认兑换弹窗  */
.showmodal{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
.showmodal.in{
  display: block;
}
.showmodal .inner{
  background: #fff;
  border-radius: 8rpx;
  width: 560rpx;
  height: 290rpx;
  margin: 345rpx auto 0;
  display: flex;
  flex-direction: column;
}
.showmodal .inner .text{
  text-align: center;
  height: 190rpx;
  line-height: 190rpx;
  font-size: 34rpx;
  font-weight: 600;
}
.showmodal .inner .btns{
  flex: 1;
  display: flex;
  text-align: center;
  line-height: 99rpx;
  height: 99rpx;
  border-top: 1rpx solid #d2d3d5;
}
.showmodal .inner .btns .item{
  border: none;
  flex: 1;
  height: 99rpx;
  font-size: 28rpx;
}
.showmodal .inner .btns .item.btn-confirm{
  border-left: 1rpx solid #d2d3d5;
  color: #00c202;
}
.showmodal .inner .btns .item.disabled{
  background: #000;
}

/*兑换成功弹窗  */
.successmodal{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 1);
  z-index: 1001;
  text-align: center;
  padding-top: 180rpx;
}
.successmodal.in{
  display: block;
}
.successmodal i{
  font-size: 120rpx;
  color: #49d939;
}
.successmodal .text{
  font-size: 36rpx;
  margin-top: 44rpx;
}
.successmodal .btn-danger{
  text-align: center;
  width: 702rpx;
  height: 80rpx;
  margin: 106rpx auto 0;
  font-size: 30rpx;
  color: #fff;
  background: #ff414c;
  line-height: 80rpx;
  border-radius: 8rpx;
}

/*支付方式  */
.paymentmodal{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
.paymentmodal .inner{
  width: 100%;
  height: 271rpx;
  background: #fff;
  position: fixed;
  bottom: 0;
  text-align: center;
  font-size: 26rpx;
  color: #000;
  line-height: 86rpx;
}
.paymentmodal .inner .item{
  border-top: 1rpx solid #ededed;
}
.paymentmodal .inner .cancel{
  background: #ff5555;
  color: #fff;
  height: 100rpx;
  line-height: 100rpx;
}
.has-address{
    font-size: 28rpx;
    line-height: 48rpx;
    height: 48rpx;
    display: flex;
}
.send-code{display: none;}
.fui-cell-group.toggleSend-group .send-code{display: block;font-size: 26rpx}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.fui-cell-group.toggleSend-group .fui-list-inner .text{
  margin-top:0;
}
.fui-cell-group.toggleSend-group .fui-list-inner .title{
  height:40rpx;
}
.fui-cell-group .num{background: #f00;padding:0 10rpx;border-radius: 50%;color:#fff;font-size:24rpx;}
</style>