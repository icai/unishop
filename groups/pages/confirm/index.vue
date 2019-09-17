<template>
<!--pages/groups/confirm/index.wxml-->
<view class="page" :style="(isIpx?'padding-bottom:168rpx':'')">
<!--添加收货地址  -->
  <view class="fui-cell-group" id="addressInfo" v-if="data.is_verify == 0">
      <navigator class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" hover-class="none" url="/pages/member/address/select" open-type="navigate">

        <view class="fui-cell-icon" style="margin-right:24rpx" v-if="data.address">
          <text class="icox icox-dingwei1"></text>
          </view>
          <view class="fui-cell-icon" v-if="!data.address">
              <text class="icox icox-icon02" style="color:#ff5555"></text>
          </view>
        <view class="fui-cell-text textl info">
          <view class="has-address" v-if="data.address">
            <view>收货人： </view>
            <text class="name">{{data.address.realname}} </text>
            <text class="mobile">{{data.address.mobile}}</text>
          </view>
          <view class="adress">{{data.address.province}}{{data.address.city}}{{data.address.area}}{{data.address.street}}{{data.address.address}}</view>
           <view class="text no-address" @tap="address" data-type="open" v-if="!data.address">添加收货地址</view> 
        </view>
        <view class="fui-cell-remark" v-if="data.address"></view>
      </navigator>
  </view>


  <!--线下核销start  -->
    <view class="fui-cell-group" v-if="data.is_verify == 1">
      <view class="fui-cell">
        <view class="fui-cell-label">姓名</view>
        <view class="fui-cell-info">
          <input type="text" placeholder="请输入姓名" class="fui-input textl" :value="list.member.realname" @input="realname" id="realname"></input>
        </view>
      </view>
      <view class="fui-cell">
        <view class="fui-cell-label">电话</view>
        <view class="fui-cell-info">
          <input type="text" placeholder="请输入电话" class="fui-input textl" :value="list.member.mobile" @input="mobile" id="mobile"></input>
        </view>
      </view>
    </view>
 
    
  <view :class="'fui-cell-group ' + ( toggleStore?'toggleSend-group':'' )" v-if="data.is_verify == 1">
      <view class="fui-cell title" @tap="toggle" :data-id="toggleStore" data-type="toggleStore">
        <view class="fui-cell-icon">
          <text class="icox icox-dianpu1"></text> </view>
        <view class="fui-cell-label differ">
          <text class="store">适用门店</text>
        </view>
        <view class="fui-cell-info"></view>
        <view class="num">{{data.stores.length}}</view>
        <view class="fui-cell-remark"></view>
      </view>
      <navigator class="fui-cell" v-if="toggleStore" v-for="(item, index) in data.stores" :key="index" :url="'/pages/order/store/map?id=' + item.id">
         <view class="fui-cell-info">{{item.storename}}</view>
         <view class="fui-cell-remark"></view>
      </navigator>
    </view>
  <!--线下核销end  -->
  <!--商品信息-->
    <view class="fui-list-group">
      <navigator url="/pages/index/index" class="fui-list-group-title" open-type="switchTab" hover-class="none">
        <view class="fui-cell-icon" style="margin-right:12px">
          <text class="icox icox-dianpu1"></text> </view>
        <text class="shop">{{sysset.shopname}}</text>
      </navigator>
      <view class="fui-list goods-item noclick">
        <view class="fui-list-media" data-url="/pages/goods/detail/index" @tap="url">
          <image class=" goods_img" :src="data.goods.thumb"></image>
        </view>
        <view class="fui-list-inner" data-url="/pages/goods/detail/index" @tap="url">
          <view class="text">
            <block v-if="val.hasdiscount">
              <text class="fui-label fui-label-danger">折扣</text>
            </block>
            {{data.goods.title}}
          </view>
          <view class="subtitle cart-option">
            {{data.goods.spec_name}}
          </view>
        </view>
        <view class="fui-list-angle">
          <view class="fui-cell">￥{{data.goods.price}}/{{data.goods.goods_num}}{{data.goods.units}}</view>
          <view class="text-right">
            x1
          </view>
        </view>
      </view>
    </view>
    <view class="fui-cell-group bordertop">
      <view class="fui-cell">
        <view class="fui-cell-info" style="text-align: right;">共
          <text class="text-danger">1</text> 件商品 合计：
          <text class="text-danger">¥ {{data.goods.price}}</text>
        </view>
      </view>
    </view>

    <view class="fui-cell-group" v-if="data.credit.deductprice > 0">
          <view class="fui-cell">
        <text class="text-danger">{{ data.credit.credit }}</text>
        <view class="fui-cell-label" style="text-align:left;width:auto">积分可抵扣
          <text class="text-danger">{{ data.credit.deductprice }}</text> 元
        </view>
        <view class="fui-cell-info">
          <switch class="switch-80 pull-right" @change="dataChange" id="deduct"></switch>
        </view>
      </view>
    </view>

    <!--买家留言-->
    <view class="fui-cell-group">
      <view class="fui-cell fui-cell-textarea">
        <view class="fui-cell-label">
          买家留言
        </view>
        <view class="fui-cell-info">
          <textarea v-if="!cycledate" rows="2" placeholder="50字以内（选填）" id="remark" @input="message"></textarea>
        </view>
      </view>
    </view>

    <view class="fui-cell-group clearform" v-if="diyform.fields!=null && diyform.fields.length>0">
          <view class="fui-cell" @tap="clearform">
            <view class="fui-cell-info">表单</view>
            <view class="fui-cell-remark noremark" style="color:#999">
              <text class="icox icox-delete" style="font-size:26rpx"></text> 清空</view>
          </view>
        </view>
        <include src="/pages/common/diyform.wxml"></include>

    <view class="fui-cell-group">
      <view class="fui-cell">
        <view class="fui-cell-label">商品小计</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">¥
          <text>{{data.goods.price}}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="data.headsmoney > 0">
        <view class="fui-cell-label">团长优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark " style="color:#ff5555">-¥
          <text class="text-danger">{{data.headsmoney}}</text>
        </view>
      </view>
      <view class="fui-cell">
        <view class="fui-cell-label">运费</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">¥
          <text>{{data.freight}}</text>
        </view>
      </view>
    </view>
    <!--底部固定-->
    <view :class="'fui-footer ' + iphonexnavbar">
      <view class="tool nopadding">
        <view class="text">
          <view class="title text-right">需付：
            <text class="text-danger">{{ data.price }}元</text>
          </view>
        </view>
        <view class="btns">
          <text :class="'btn btn-danger ' + submit && 'disabled'" @tap="submit">立即支付</text>
        </view>
      </view>
    </view>
    <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</template>

<script>
// pages/groups/confirm/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');
var foxui = app.requirejs('foxui');
var diyform = app.requirejs('biz/diyform');

export default {
  data() {
    return {
      options: [],
      api: 0,
      message: '',
      real_name: '',
      mobile: '',
      deduct: false
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
    var $this = this,
        address = app.getCache("orderAddress"),
        shop = app.getCache("orderShop");

    if (address) {
      this.setData({
        'data.address': address,
        aid: address.id
      });
    }
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
    this.setData({
      options: options
    });
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

    core.get('groups/order/create_order', {
      id: $this.data.options.id,
      group_option_id: $this.data.options.option_id,
      ladder_id: $this.data.options.ladder_id,
      type: $this.data.options.type,
      heads: $this.data.options.heads,
      teamid: $this.data.options.teamid
    }, function (msg) {
      if (msg.error == 1) {
        core.alert(msg.message);
        core.confirm(msg.message, function () {
          wx.navigateBack();
        }, function () {
          wx.navigateBack();
        });
        return;
      }

      $this.setData({
        data: msg.data,
        sysset: msg.sysset
      });

      if (msg.data.address) {
        $this.setData({
          aid: msg.data.address.id
        });
      }

      if (msg.data.fields.length > 0) {
        $this.setData({
          diyform: {
            f_data: msg.data.f_data,
            fields: msg.data.fields
          }
        });
      }
    });
  },
  components: {},
  props: {},
  methods: {
    onChange: function (e) {
      return diyform.onChange(this, e);
    },
    DiyFormHandler: function (e) {
      return diyform.DiyFormHandler(this, e);
    },
    selectArea: function (e) {
      return diyform.selectArea(this, e);
    },
    bindChange: function (e) {
      return diyform.bindChange(this, e);
    },
    onCancel: function (e) {
      return diyform.onCancel(this, e);
    },
    onConfirm: function (e) {
      diyform.onConfirm(this, e);
      var val = this.pval;
      var areas = this.areas;
      var detail = this.areaDetail.detail;
      detail.province = areas[val[0]].name;
      detail.city = areas[val[0]].city[val[1]].name;
      detail.datavalue = areas[val[0]].code + " " + areas[val[0]].city[val[1]].code;

      if (areas[val[0]].city[val[1]].area && areas[val[0]].city[val[1]].area.length > 0) {
        detail.area = areas[val[0]].city[val[1]].area[val[2]].name;
        detail.datavalue += " " + areas[val[0]].city[val[1]].area[val[2]].code;
        this.getStreet(areas, val);
      } else {
        detail.area = "";
      }

      detail.street = '';
      this.setData({
        'areaDetail.detail': detail,
        streetIndex: 0,
        showPicker: false
      });
      return;
    },
    getIndex: function (str, areas) {
      return diyform.getIndex(str, areas);
    },
    // 清除表单内容
    clearform: function () {
      var diyform = this.diyform;
      var new_fdata = {};
      $.each(diyform, function (k, v) {
        //lgt 清除表单时保留图片上传功能
        $.each(v, function (key, value) {
          if (value.data_type == 5) {
            diyform.f_data[value.diy_type].count = 0;
            diyform.f_data[value.diy_type].images = [];
            new_fdata[value.diy_type] = diyform.f_data[value.diy_type];
          }
        });
      });
      diyform.f_data = new_fdata;
      this.setData({
        diyform: diyform
      });
    },
    //提交
    submit: function () {
      var $this = this;
      var diyformdata = this.diyform;

      if ($this.data.diyform == undefined) {
        var diydata = '';
      } else {
        var diydata = $this.data.diyform.f_data;
      }

      if (diyformdata != undefined) {
        var verify = diyform.verify(this, diyformdata);

        if (!verify) {
          core.alert('请查看是否有未填写的内容');
          return;
        }
      }

      core.post('groups/order/create_order', {
        id: $this.data.options.id,
        group_option_id: $this.data.options.option_id,
        ladder_id: $this.data.options.ladder_id,
        type: $this.data.options.type,
        heads: $this.data.options.heads,
        teamid: $this.data.options.teamid,
        aid: $this.data.aid,
        message: $this.data.message,
        realname: $this.data.real_name,
        mobile: $this.data.mobile,
        deduct: $this.data.deduct,
        diydata: diydata
      }, function (msg) {
        if (msg.error == 1) {
          core.alert(msg.message);
          return;
        }

        wx.navigateTo({
          url: '/groups/pages/pay/index?id=' + msg.orderid + '&teamid=' + msg.teamid
        });
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
    message: function (e) {
      this.setData({
        message: e.detail.value
      });
    },
    realname: function (e) {
      this.setData({
        real_name: e.detail.value
      });
    },
    mobile: function (e) {
      this.setData({
        mobile: e.detail.value
      });
    },
    dataChange: function (e) {
      var data = this.data,
          id = e.target.id;
      data.deduct = e.detail.value;
      var realprice = parseFloat(data.price);
      realprice += data.deduct ? -parseFloat(data.credit.deductprice) : parseFloat(data.credit.deductprice);
      data.price = realprice;
      data.price = $.toFixed(data.price, 2);
      this.setData({
        data: data,
        deduct: e.detail.value
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
/* pages/groups/confirm/index.wxss */
@import "../../../static/css/order.css";
@import "../../../pages/common/city-picker.css";
@import "../../../pages/date/date.css";

page {
  background: #f7f7f7;
}

.nav {
  width: 100%;
  height: 90rpx;
  display: flex;
  flex-direction: row;
  background: #fff;
}

.default {
  line-height: 90rpx;
  text-align: center;
  flex: 1;
  color: #666;
  font-size: 32rpx;
}

.red {
  line-height: 90rpx;
  text-align: center;
  color: #ef4f4f;
  flex: 1;
  font-size: 32rpx;
  border-bottom: 2px solid #ef4f4f;
}

.switch {
  float: right;
  zoom: 90%;
  overflow: hidden;
}

.btn {
  padding: 0 60rpx;
  border-radius: 0;
  height: 100rpx;
  line-height: 100rpx;
  margin: 0;
}

.fui-list-angle {
  margin-right: 0;
  text-align: right;
  height: 140rpx;
}

.fui-list-angle .price {
  font-size: 26rpx;
}

.fui-list-angle .text-right {
  color: #999;
  font-size: 28rpx;
}

.fui-cell-text .shop_name {
  font-size: 28rpx;
  line-height: 48rpx;
  height: 48rpx;
}

.fui-list-inner {
  height: 140rpx;
  align-self: center;
}

.gift-list .fui-list-inner {
  height: auto;
  align-self: flex-start;
}

.no-border .fui-list-inner {
  height: auto;
}

.fui-cell-group .fui-cell.fui-cell-textarea {
  height: 120rpx;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
}

.diyform-container .picker-group {
  display: flex;
}

.diyform-container .diyform-pulldown2 {
  flex: 1;
}

.diyform-container .diyform-pulldown2  view {
  width: 100%;
  float: left;
  background: #f3f3f3;
  text-indent: 0.5rem;
  border-radius: 0.1rem;
  position: relative;
}

.diyform-container .diyform-pulldown2 view:after {
  content: " ";
  display: inline-block;
  -webkit-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  transform: rotate(135deg);
  height: 12rpx;
  width: 12rpx;
  border-width: 1px 1px 0 0;
  border-color: #000;
  border-style: solid;
  position: absolute;
  top: 8rpx;
  right: 30rpx;
  margin-left: 0;
}

.has-address {
  font-size: 28rpx;
  line-height: 48rpx;
  height: 48rpx;
  display: flex;
}

.name {
  display: inline-block;
  max-width: 300rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 20rpx;
}

.mobile {
  display: inline-block;
  overflow: hidden;
}

.adress {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 26rpx;
  color: #666;
}

.fui-cell-group .fui-cell .fui-cell-icon {
  color: #000;
}

.no-border .fui-list-inner .subtitle {
  line-height: 1.5;
}

.row-remark {
  text-align: right;
  position: relative;
  flex-shrink: 0;
  padding-left: 20rpx;
  color: #aaa;
  font-size: 26rpx;
  line-height: 1.5;
}

/*.fui-list-group {
   padding-bottom:20rpx
}*/

.fui-list.no-border {
  overflow: visible;
  background: #f9f9f9;
  padding-top: 20rpx;
}

.fui-list.no-border::after {
  content: " ";
  display: block;
  height: 4rpx;
  background: #fff;
  position: absolute;
  top: 0px;
  right: 20rpx;
  left: 20rpx;
}

.picker-modal {
  height: auto;
}

.fui-cell-group.bordertop:after {
  content: " ";
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  top: 0;
  height: 1px;
  border-top: 1px solid #ebebeb;
  color: #d9d9d9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}

.fui-cell-group.clearform {
  position: relative;
}

.fui-cell-group.clearform:after {
  content: " ";
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  bottom: 0;
  height: 1px;
  border-top: 1px solid #ebebeb;
  color: #d9d9d9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}
.fui-cell-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.fui-cell-group.toggleSend-group .send-code{display: block;font-size: 26rpx}
.fui-cell-group.toggleSend-group .fui-cell.title .fui-cell-remark::after{
    -webkit-transform:rotate(-45deg);
    -ms-transform:rotate(-45deg);
    transform:rotate(-45deg);
}
.fui-cell-group .fui-cell .num{
  min-width:22rpx;
  height:30rpx;
  border-radius:50%;
  background:#ff5555;
  text-align:center;
  color:#fff;
  font-size:22rpx;
  line-height: 30rpx;
  padding: 0 5rpx
}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(45deg);
    -ms-transform:rotate(45deg);
    transform:rotate(45deg);
}


</style>