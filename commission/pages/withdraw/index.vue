<template>
<view>
<!--pages/commission/withdraw/index.wxml-->
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<loading v-if="!show">加载中...</loading>
<view :class="'page withdraw navbar ' + paddingb" v-if="show">
<!--累计佣金-->
    <view class="header">
        <navigator hover-class="none" url="../log/index" class="btn pull-right" open-type="navigate">{{ set['texts']['commission_detail'] }}</navigator>
        <view class="text">
            <view class="num">{{ member['commission_total'] }}</view>
            <view>{{ set['texts']['commission_total'] }}({{ set['texts']['yuan'] }})</view>
        </view>
    </view>

    <!--可提现佣金-->
    <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_ok'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text class="text-warning">{{ member['commission_ok'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
    </view>

    <!--详细列表-->
    <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_apply'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_apply'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_check'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_check'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_fail'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_fail'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_pay'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_pay'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
        <view class="fui-cell" v-if="member['commission_charge'] > 0">
            <view class="fui-cell-label">{{ set['texts']['commission_charge'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_charge'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
    </view>

    <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_wait'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_wait'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">{{ set['texts']['commission_lock'] }}</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">
            <text>{{ member['commission_lock'] }}<text>{{ set['texts']['yuan'] }}</text></text>
            </view>
        </view>
    </view>


    <!--用户需知-->
    <view :class="'fui-cell-group ' + (code?'':'toggleSend-group')">
        <navigator class="fui-cell" hover-class="none" url @tap="toggleSend" :data-id="code">
            <view class="fui-cell-info color">
                用户需知
            </view>
            <view class="fui-cell-remark">
            </view>
        </navigator>
        <view class="apply send-code">
            <view v-if="set['settledays']>0">买家确认收货（<span class="text-danger">{{set['settledays'] }}天</span> )后，{{set['texts']['commission'] }}可{{set['texts']['withdraw'] }}。结算期内，买家退货，{{set['texts']['commission'] }}将自动扣除。</view>
            <view v-else>买家确认收货后，立即获得{{ set['texts']['commission1'] }}</view>
            <view v-if="set['withdraw']>0">注意：可用{{ set['texts']['commission'] }}满 <span class="text-warning">{{ set['withdraw'] }}{{ set['texts']['yuan'] }}</span> 后才能申请{{ set['texts']['withdraw'] }}</view>
        </view>
    </view>

    <!--我要提现-->
    <view :class="'fui-navbar ' + iphonexnavbar">
      <view :class="'nav-item btn btn-warning block ' + ( !cansettle?'disabled':'' )" v-if="set['texts']['withdraw'] == ''" @tap="withdraw">
        我要提现
      </view>
      <view :class="'nav-item btn btn-warning block ' + ( !cansettle?'disabled':'' )" v-if="set['texts']['withdraw'] != ''" @tap="withdraw">
        我要{{ set['texts']['withdraw'] }}
      </view>
    </view>
</view>
</view>
</template>

<script>
/**
 *
 * commission/withdraw/index.js
 *
 * @create 2017-2-6
 * @author Young
 *
 * @update  Young 2017-2-6
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      code: 0
    };
  },

  onShow: function () {
    this.getData();
    var isIpx = app.getCache('isIpx');
    var $this = this;

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
  components: {},
  props: {},
  methods: {
    getData: function () {
      var $this = this;
      core.get('commission/withdraw', {}, function (json) {
        json.show = true;
        $this.setData(json);
        wx.setNavigationBarTitle({
          title: json.set.texts.commission1
        });
      });
    },
    toggleSend: function (e) {
      var send = e.currentTarget.dataset.id;

      if (send == 0) {
        this.setData({
          code: 1
        });
      } else {
        this.setData({
          code: 0
        });
      }
    },
    withdraw: function (e) {
      var data = this;

      if (data.cansettle) {
        wx.navigateTo({
          url: '../apply/index'
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
/* pages/commission/withdraw/index.wxss */
.withdraw .header{
    height: auto;
    color: #fff;
    padding: 48rpx 20rpx;
    background: #fea23d;
    position: relative
}
.withdraw .header .text{
    color: #fff;
    text-align: center;
    font-size: 26rpx;
    line-height: 1.5
}
.withdraw .header .btn.pull-right{
  position: absolute;
  top: 5rpx;
  right: 5rpx;
  border: 0;
  color: #9d5200;
  text-decoration: underline;
  font-size:24rpx;
}
.withdraw .header .text .num{
    font-size: 1.5rem;
}
.withdraw .header .btn{
    height: 50rpx;
    width: auto;
    padding: 0 15rpx;
    border: 1px solid #fff;
    line-height: 50rpx;
    border-radius: 25rpx;
    font-size: 30rpx;
    color: inherit;
}
.withdraw .fui-cell-group .fui-cell .fui-cell-icon{
    margin-right: 10rpx
}
.withdraw .fui-cell-group .fui-cell .fui-cell-label{
  width: auto
}
.withdraw .fui-cell-group .fui-cell .fui-cell-text{
    margin-top: 10rpx
}
.withdraw .fui-cell-group .color{
    color: #333
}
.send-code{
    display: none;
}
.fui-cell-group.toggleSend-group .send-code{
    display: block;
    font-size:26rpx;
    padding: 6rpx 30rpx 20rpx 30rpx;
    color: #666
}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.fui-navbar, .fui-footer {
    height: 90rpx;
}
.fui-navbar .nav-item.btn.btn-warning {
    height:90rpx ;
    border-radius: 0;
}

</style>