<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<loading v-if="!show">加载中...</loading>



<view :class="'page navbar ' + seckill_color + ' ' + paddingb" v-if="show">
  <view class="fui-list bg">

    <view class="row" style="font-size:34rpx">
      <view class>{{ order.status_str }}{{ order.refundstate>0?'('+order.refundtext+')':''}}</view>
    </view>
    <view class="order-price">订单金额(含运费):¥
      <text>{{ order.money }}</text>
    </view>
  </view>




  <!--实物快递-->
  <view class="fui-list-group" v-if="address">
    <navigator class="fui-list" v-if="order.status>1" :url="'../express/index?id=' + order.id">
      <view class="fui-list-media">
        <view class="fui-list-icon">
          <text class="icox icox-icon049"></text>
        </view>
      </view>
      <view class="fui-list-inner">
        <block v-if="express.length > 0">
          <view class="text">{{ express[0].step }}</view>
          <view class="text">{{ express[0].time }}</view>
        </block>
        <block v-else>
          <view class="text">暂无物流信息</view>
          <view class="text"></view>
        </block>

      </view>
      <view class="fui-list-angle">
        <text class="angle"></text>
      </view>
    </navigator>
    <navigator class="fui-list" hover-class="none">
      <view class="fui-list-media">

        <view class="fui-list-icon">
          <text class="icox icox-dingwei1"></text>
        </view>
      </view>
      <view class="fui-list-inner">
        <view class style="font-size:28rpx;line-height: 1.2rem;height: 1.2rem;">{{ address.realname }} {{ address.mobile }}</view>
        <view class="text" style="font-size:26rpx;color:#666">{{ address.province+address.city+address.area+' '+address.address }}</view>
      </view>
    </navigator>
  </view>

  <view class="fui-list-group" v-if="carrier||store">
    <view class="fui-list noclick" v-if="carrier">
      <view class="fui-list-media">
        <image src="/static/images/icon/people.png" class="fui-list-icon"></image>

      </view>
      <view class="fui-list-inner">
        <view class="title">{{ carrier.carrier_realname }} {{ carrier.carrier_mobile }}</view>
      </view>
    </view>
     <!-- <view class="fui-list" wx:if="{{ store }}"> 
      <view class="fui-list-media">

        <view class="fui-list-icon">
          <text class="icox icox-dianpu1"></text>
        </view>
      </view>
      <view class="fui-list-inner store-inner">
        <view class="title">
          <text class="storename">{{ store.storename }}</text>
        </view>
        <view class="text">
          <text class="realname">{{ store.realname }} {{ store.mobile }}</text>
        </view>
        <view class="text">
          <text class="address">{{ store.address }}</text>
        </view>
      </view>
      <view class="fui-list-angle ">
         <view class='icox icox-kefu2' bindtap="phone" data-phone="{{ store.mobile }}"></view>

        <navigator url="/pages/order/store/map?id={{ store.id }}" hover-class="none">
          <text class="icox icox-dingwei1"></text>
        </navigator>
      </view>
    </view> -->
  </view>

  <view class="fui-list-group" style="padding-bottom:20rpx">
    <view class="fui-list-group-title">

      <view class="fui-list-icon">
        <text class="icox icox-dianpu1"></text>
      </view>
      <text class="shop">{{ shop_name }}</text>
    </view>
    <block>
      <navigator class="fui-list goods-item" :url="'../goods/index?id=' + order.goodid" open-type="redirect">
        <view class="fui-list-media">
          <image class="goods_img" :src="goods.thumb"></image>
        </view>
        <view class="fui-list-inner" style="height:140rpx">
          <view class="text">{{ goods.title }}</view>
          <view class="subtitle">{{ item.optionname }}</view>
        </view>
        <view class="price text-right" style="height:140rpx">
          <view class="text-right">
            <view class="pull-left">￥</view>
            <view class="pull-left">
            <text> {{ order.goods_price }}</text>/{{goods.goodsnum}}{{goods.units}}
          </view>
          </view>
          <view class="text-right" style="color:#666">x
            <text>1</text>
          </view>
        </view>
      </navigator>
      <!-- <view class="fui-list noclick" wx:if="{{ item.diyformfields.length>0 }}">
        <view class="fui-list-inner">
          <view class="text">
            <view class="look-diyinfo {{ !diyshow[item.id]?'':'open'}}" bindtap="diyshow" data-id="{{ item.id }}">{{ !diyshow[item.id]?"展开":"收起" }}提交的资料</view>
          </view>
        </view>
      </view> -->

      <view :hidden="!diyshow[item.id]" v-if="item.diyformfields.length>0">
        <component :diyform="item" :is="diyform"></component>
      </view>
    </block>
  
    <!--赠品显示end-->

    <!--全返end-->
  </view>

  <view class="fui-cell-group" v-if="order.isvirtualsend>0 && order.virtualsend_info!=null">
    <view class="fui-cell-title">发货信息</view>
    <view class="fui-cell">
      <view class="fui-cell-info">>
        <text selectable="true">{{ order.virtualsend_info }}</text>
      </view>
    </view>
  </view>


  <!--自提-->
  <!--消费码-->
  
  <view :class="'fui-cell-group ' + ( toggleConsume?'toggleSend-group':'' )" v-if="order.isverify == 1 && order.status > 0 && (order.success == 1 || order.is_team == 0) && order.verifynum > 0">
    <view class="fui-cell" @tap="toggle" :data-id="toggleConsume" data-type="toggleConsume">

      <view class="fui-cell-icon">
        <text class="icox icox-viewlist"></text> </view>
      <view class="fui-cell-text differ">
        <text class="consume" selectable="true">核销码</text>
      </view>
      <view class="badge badge-warning">1</view>
      <view class="fui-cell-remark"></view>
    </view>
    <block v-if="order.status>0">
      <view class="send-code">
        <text selectable="true">{{ order.verifycode }}</text>

        <text :class="'pull-right fui-label ' + verify.verified==1&&'fui-label-danger'" selectable="true" v-if="verify.isverify">已使用</text>

        <text :class="'pull-right fui-label ' + verify.verified==1&&'fui-label-danger'" selectable="true" v-if="!verify.isverify && verifynum != 0 && order.verifytype == 1">剩余{{verifynum}}次</text>

        <text :class="'pull-right fui-label ' + verify.verified==1&&'fui-label-danger'" selectable="true" v-if="!verify.isverify && verifynum == 0 && order.verifytype == 1">已使用</text>

        <text :class="'pull-right fui-label ' + verify.verified==1&&'fui-label-danger'" selectable="true" v-if="!verify.isverify && order.verifytype == 0">未使用</text>

      </view>
    </block>

    <view class="send-code" v-else>
      <text>付款后可见!</text>
    </view>
  </view>

  <!--自提-->
  <view :class="'fui-cell-group ' + ( toggleStore?'toggleSend-group':'' )" v-if="store && order.isverify == 1">
    <view class="fui-cell" @tap="toggle" :data-id="toggleStore" data-type="toggleStore">

      <view class="fui-list-icon">
        <text class="icox icox-dianpu1"></text>
      </view>
      <view class="fui-cell-text differ">
        <text class="store">适用门店</text>
      </view>
      <view class="badge badge-warning">{{store.length }}</view>
      <view class="fui-cell-remark"></view>
    </view>
    <view class="send-code">
      <view class="fui-list noclick" v-for="(item, index) in store" :key="index">
        <view class="fui-list-media">

          <view class="fui-list-icon">
            <text class="icox icox-dianpu1"></text>
          </view>
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
          <navigator :url="'/pages/order/store/map?id=' + item.id" hover-class="none">

            <text class="icox icox-dingwei1"></text>
          </navigator>
        </view>
      </view>
    </view>
  </view>


  <view class="fui-cell-group price-cell-group">
    <view class="fui-cell">
      <view class="fui-cell-label">商品小计</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">¥ {{ order.goods_price }}</view>
    </view>
    <view class="fui-cell">
      <view class="fui-cell-label">{{order.city_express_state?"同城运费":"运费"}}</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">¥ {{ order.freight }}</view>
      
    </view>
    <block>
     

      <view class="fui-cell" v-if="order.discountprice>0">
        <view class="fui-cell-label">积分抵扣</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.discountprice }}</view>
      </view>

      <view class="fui-cell" v-if="order.creditmoney>0">
        <view class="fui-cell-label">积分抵扣</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.creditmoney }}</view>
      </view>

      <view class="fui-cell" v-if="order.deductcredit2>0">
        <view class="fui-cell-label">余额抵扣</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.deductcredit2 }}</view>
      </view>

      <view class="fui-cell" v-if="order.discount>0">
        <view class="fui-cell-label">团长优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.discount }}</view>
      </view>

      <view class="fui-cell" v-if="order.isdiscountprice>0">
        <view class="fui-cell-label">促销优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.isdiscountprice }}</view>
      </view>

    </block>
    <view class="fui-cell">
      <view class="fui-cell-label" style="width:auto;">实付费(含运费)</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">
        <text class="text-danger">
                    <text style="font-size:30rpx">¥ {{ order.money }}</text>
        </text>
      </view>
    </view>
    <!--<view class="fui-cell">
            <view class="fui-cell-label">全返</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">全返内容全返内容全返内容</view>
        </view>-->
  </view>
  <view class="fui-cell-group">
    <view class="order-info">
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">订单编号：{{ order.orderno }}</text>
      </view>
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">创建时间：{{ order.createtime }}</text>
      </view>
      <view class="fui-cell-label" v-if="order.paytime" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">支付时间：{{ order.paytime }}</text>
      </view>
      <view class="fui-cell-label" v-if="order.sendtime && order.isverify == 0" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">发货时间：{{ order.sendtime }}</text>
      </view>
      <view class="fui-cell-label" v-if="order.finishtime" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">完成时间：{{ order.finishtime }}</text>
      </view>
    </view>
  </view>

  <view v-if="order.diyformfields.length>0">
    <component :diyform="order" :is="diyform"></component>
  </view>

  <!-- <view class='operate'>
        <navigator class='btn btn-default' url="/pages/order/index" open-type="redirect">我的订单</navigator>
        <navigator class='btn btn-default' url="/pages/index/index" open-type="switchTab">返回首页</navigator>
    </view> -->

  <view :class="'fui-footer aa ' + iphonexnavbar">
    <button class="btn btn-default btn-default-o pull-left" open-type="contact" session-from="weapp" show-message-card="true" v-if="customer==1">
      <text class="icox icox-customerservice"></text>客服
    </button>
    <block> 

      <view v-if="order.status == 0" class="btn btn-default btn-default-o btn-sm">
        <picker :value="cancelindex" :range="cancel" @change="cancel">取消订单</picker>
      </view> 

      <navigator v-if="order.status == 0" class="btn btn-danger-o btn-sm" :url="'../pay/index?id=' + order.id">支付订单</navigator>


       <view v-if="order.isverify == 1 && order.status > 0 && verifynum > 0 && order.refundstate == 0 && (order.success == 1 || order.is_team == 0)" class="btn btn-default btn-default-o btn-sm" @tap="code">我要使用</view> 

      <view v-if="order.status == 3 || order.status == -1" class="btn btn-default btn-default-o btn-sm" @tap="delete_" :data-orderid="order_id">删除订单</view>

      <view v-if="order.status == 2" :data-orderid="order_id" class="btn btn-default btn-default-o btn-sm" @tap="finish">确认收货</view>
                 
      <navigator v-if="order.status>0 && order.status!=3 && (order.success != 0 || order.is_team == 0) && !goodRefund" class="btn btn-default btn-default-o btn-sm" :url="'../refund/index?id=' + order.id">{{order.status==1?"申请退款":"申请售后"}}{{order.refundstate>0?"中":""}}</navigator>

      <view v-if="order.refundstate>0" class="btn btn-default-o btn-sm btn-cancel" @tap="refundcancel">取消申请</view>
    </block>
  </view>
  <!--弹出模态框-->
  <include src="/pages/order/public/verify.wxml"></include>
</view>
</view>
</template>

<script>
/**
 *
 * order/detail/index.js
 *
 * @create 2017-1-12
 * @author Young
 *
 * @update  Young 2017-01-16
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    order = app.requirejs('biz/group_order');

export default {
  data() {
    return {
      code: false,
      consume: false,
      store: false,
      cancel: order.cancelArray,
      cancelindex: 0,
      diyshow: {},
      city_express_state: 0,
      order_id: 0,
      order: [],
      address: [],
      cancel: order.cancelArray
    };
  },

  onShareAppMessage: function () {
    return core.onShareAppMessage();
  },
  onShow: function () {
    this.get_list();
    var $this = this;
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar',
        paddingb: 'padding-b'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: '',
        paddingb: ''
      });
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      order_id: options.order_id
    });
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      core.get('groups/order/details', {
        orderid: $this.data.order_id
      }, function (list) {
        if (list.error > 0) {
          if (list.error != 50000) {
            core.toast(list.message, 'loading');
          }

          wx.redirectTo({
            url: '/groups/pages/order/index'
          });
        }

        $this.setData({
          show: true,
          express: list.express,
          order: list.order,
          address: list.address,
          store: list.store,
          verify: list.verify,
          verifynum: list.verifynum,
          verifytotal: list.verifytotal,
          carrier: list.carrier,
          shop_name: list.sysset.shopname,
          goods: list.goods,
          goodRefund: list.goodRefund
        });
      });
    },
    more: function () {
      this.setData({
        all: true
      });
    },
    code: function (e) {
      var $this = this;
      core.post('groups/verify/qrcode', {
        id: $this.data.order.id,
        verifycode: $this.data.order.verifycode
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
    diyshow: function (e) {
      var diyshow = this.diyshow,
          goodsid = core.data(e).id;
      diyshow[goodsid] = !diyshow[goodsid];
      this.setData({
        diyshow: diyshow
      });
    },
    close: function () {
      this.setData({
        code: false
      });
    },
    toggle: function (e) {
      var data = core.pdata(e),
          id = data.id,
          type = data.type,
          d = {};
      id == 0 || typeof id == 'undefined' ? d[type] = 1 : d[type] = 0;
      this.setData(d);
    },
    phone: function (e) {
      core.phone(e);
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
            core.alert(result.message);
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
            wx.reLaunch({
              url: '/groups/pages/order/index'
            });
          } else {
            core.alert(result.message);
          }
        });
      });
    },
    cancel: function (e) {
      var order_id = this.order_id;
      order.cancel(order_id, e.detail.value, '/groups/pages/order_detail/index?order_id=' + order_id);
    },
    refundcancel: function (e) {
      core.post('groups.refund.cancel', {
        orderid: this.order_id
      }, function (res) {
        if (res.error == 0) {
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 2000
          });
        }
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
@import "../../../static/css/order.css";
.fui-footer{
    text-align: right;
}
.bg{
    background: -moz-linear-gradient(left, #ffb43e 0%, #fd9526 100%);
    background: -webkit-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: -o-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: -ms-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: linear-gradient(to right, #ffb43e 0%,#fd9526 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffb43e, endColorstr=#fd9526,gradientType='1');
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
.red .bg{
    background:#fc664c;
    background:linear-gradient(to right, #fdad89 0%,#f94444 100%);
    background: -webkit-linear-gradient(left, #fdad89 0%,#f94444 100%);
}
.blue .bg{
    background:#4e87ee;
    background:linear-gradient(to right, #4fbaee 0%,#4e87ee 100%);
    background: -webkit-linear-gradient(left, #4fbaee 0%,#4e87ee 100%);
}
.purple .bg{
    background:#a839fa;
    background:linear-gradient(to right, #6a60ff 0%,#a839fa 100%);
    background: -webkit-linear-gradient(left, #6a60ff 0%,#a839fa 100%);
}
.orange .bg{
    background:#ff8c1e;
    background:linear-gradient(to right, #ffb81e 0%,#ff8c1e 100%);
    background: -webkit-linear-gradient(left, #ffb81e 0%,#ff8c1e 100%);
}
.pink .bg{
    background:#ff7e95;
    background:linear-gradient(to right, #ffacd0 0%,#ff7e95 100%);
    background: -webkit-linear-gradient(left, #ffacd0 0%,#ff7e95 100%);
}
.row{
    font-size: 30rpx;
    font-weight: bold;
}
.order-price{
    font-size: 27rpx;
    color: #fff;
    line-height: 44rpx
}
.adress{
    font-size: 27rpx;
    color: #666;
}
.order-info{
    padding: 20rpx 0
}
.order-info view,.send-code{
    padding: 6rpx 25rpx;
    color: #666;
    font-size: 28rpx;
}
.send-code.send-code1{
    padding: 6rpx 24rpx;
    color: #666;
    font-size: 28rpx;
}
.price{
    font-size: 26rpx;
    color: #000;
    margin-left: 20rpx
}
.fui-list-inner .subtitle{
    line-height: 40rpx
}
.send-code{display: none;}
.fui-cell-group.toggleSend-group .send-code{display: block;font-size: 26rpx}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.fui-list-media .image-48{
    height: 48rpx;
    width: 48rpx
}
.text-padding{
    padding:0 10rpx
}
.image-48{
    margin: 8rpx 0
}
.operate{
    display: flex;
}
.operate navigator{
    flex: 1
}
.fui-cell-group .fui-cell .fui-cell-remark {
    color:#888;
    text-align:right;
    font-size:28rpx;
    margin-right:8rpx;

}
.btn{
    height:56rpx;
    line-height:52rpx;
    border-radius: 40rpx;
    padding: 0 26rpx;
    margin-top: 24rpx;
    font-size: 26rpx
}
.btn .icox{
    margin-right: 6rpx;
    vertical-align:baseline;
    font-size: 30rpx
}
.btn.btn-sm{
    margin-top: 24rpx;
    margin-right: 24rpx
}
.look-diyinfo{
    position: relative
}
.look-diyinfo::after{
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    height: 16rpx;
    width: 16rpx;
    border-width: 1rpx 1rpx 0 0;
    border-color: #b2b2b2;
    border-style: solid;
    position: absolute;
    top: 5rpx;
    right: 10rpx;
}
.look-diyinfo.open::after{
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(135deg);
    -ms-transform: rotate(135deg);
    transform: rotate(135deg);
    height: 16rpx;
    width: 16rpx;
    border-width: 1rpx 1rpx 0 0;
    border-color: #b2b2b2;
    border-style: solid;
    position: absolute;
    top: 0rpx;
    right: 10rpx;
}
.fui-cell-title{
    font-size: 28rpx
}
.gift-picker{
    position: fixed;
    bottom: 0;
    right: 0;
    left:0;
}
.fui-list.no-border{
    background: #f9f9f9;margin-top: 4rpx;font-size: 24rpx;color: #999
}
.no-border .fui-list-inner .subtitle {
    line-height:1.5;
}
.no-border .row{
    font-weight: normal
}
.no-border .fui-list-media image{
    width:100rpx;height:100rpx;
}
.no-border .row-text{
    color: #000
}
.row-remark{
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left:20rpx;
    color: #aaa;
    font-size: 26rpx;
    line-height: 1.5
}
.more{
    justify-content: center
}

/*周期购  */
.cycle-underway{
    height: 170rpx;
    padding: 20rpx 24rpx 0;
    position: relative;
    color: #666;
    font-size: 28rpx;
}
.cycle-underway:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1rpx solid #EBEBEB;
    color: #d9d9d9;
    height: 1rpx;
    width: 100%;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}
.cycle-underway .cycle-cell{
    margin-bottom:18rpx;
    padding: 0;
}
.fui-cell-group.cycle .fui-cell .fui-cell-remark{
    color: #ff5555;
    font-size: 28rpx;
}
.fui-cell-group.cycle .fui-cell .fui-cell-remark:after{
    border-color: #ff5555;
}
.wrapview {
  width: 530rpx;
  word-wrap: break-word;
  word-break: break-all;
}
</style>