<template>
<view>
<view class="page">
  <view class="header">
    <view class="title">我的提现</view>
    <view class="price">￥{{msg.dividend_ok}}</view>
  </view>
  <view class="content fui-cell-group">
    <view class="fui-cell" style="color: #999;font-size:28rpx">提现方式</view>
    <view class="fui-cell" v-if="msg.type_array[0].title">
      <view class="fui-cell-icon"><text class="icox icox-daituikuan2" style="color: #d6aa3f;"></text></view>
      <view class="fui-cell-text"><p class="text">提现到余额</p></view>
      <view class="fui-cell-remark noremark">
         <radio color="#cfa943" data-type="0" data-status="balance" :data-checked="radios.balance.checked" :checked="( radios.balance.checked == 1 ? true: false )" @tap="selected"></radio>
      </view>
    </view>
    <view class="fui-cell" v-if="msg.type_array[1].title">
      <view class="fui-cell-icon"><text class="icox icox-weixinzhifu" style="color: #05c907"></text></view>
      <view class="fui-cell-text"><p class="text">提现到微信钱包</p></view>
      <view class="fui-cell-remark noremark">
         <radio color="#cfa943" data-type="1" data-status="weixin" :data-checked="radios.weixin.checked" :checked="( radios.weixin.checked == 1 ? true: false )" @tap="selected"></radio>
      </view>
    </view>
    <view class="fui-cell" v-if="msg.type_array[2].title">
      <view class="fui-cell-icon"><text class="icox icox-zhifubao" style="color: #168fea;"></text></view>
      <view class="fui-cell-text"><p class="text">提现到支付宝</p></view>
      <view class="fui-cell-remark noremark">
         <radio color="#cfa943" data-type="2" data-status="alipay" :data-checked="radios.alipay.checked" :checked="( radios.alipay.checked == 1 ? true: false )" @tap="selected"></radio>
      </view>
    </view>
    <view class="fui-cell" v-if="radios.alipay.checked == 1">
      <view class="fui-cell-label">姓名</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark"><input type="text" placeholder="请填写姓名" data-input="realname" @input="changeinput" placeholder-style="color:#ccc"></input></view>
    </view>
    <view class="fui-cell" v-if="radios.alipay.checked == 1">
      <view class="fui-cell-label">支付宝账号</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark"><input type="text" placeholder="请填写支付宝账号" data-input="alipay" @input="changeinput" placeholder-style="color:#ccc"></input></view>
    </view>

    <view class="fui-cell" v-if="radios.alipay.checked == 1">
      <view class="fui-cell-label">确认账号</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark"><input type="text" placeholder="请填写支付宝账号" data-input="alipay1" @input="changeinput" placeholder-style="color:#ccc"></input></view>
    </view>

    <view class="fui-cell" v-if="msg.type_array[3].title">
      <view class="fui-cell-icon"><text class="icox icox-yinhangqia" style="color: #e96c6a"></text></view>
      <view class="fui-cell-text"><p class="text">提现到银行卡</p></view>
      <view class="fui-cell-remark noremark">
         <radio color="#cfa943" data-type="3" data-status="card" :data-checked="radios.card.checked" :checked="( radios.card.checked == 1 ? true: false )" @tap="selected"></radio>
      </view>
    </view>

    <view class="fui-cell" v-if="radios.card.checked == 1">
      <view class="fui-cell-label">姓名</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark"><input type="text" placeholder="请填写姓名" data-input="realname1" @input="changeinput" placeholder-style="color:#ccc"></input></view>
    </view>

    <view class="fui-cell" v-if="radios.card.checked == 1">
      <view class="fui-cell-label">选择银行</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark">
        <picker class="serve-picker" :data-input="msg.banklist[index]" :value="index" range-key="bankname" mode="selector" @change="bindpullldown" :range="msg.banklist">
        {{msg.banklist[index].bankname || "请选择银行"}}
      </picker>
      </view>
    </view>

    <view class="fui-cell" v-if="radios.card.checked == 1">
      <view class="fui-cell-label">银行卡号</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark"><input type="text" placeholder="请填写银行卡号" data-input="bankcard" @input="changeinput" placeholder-style="color:#ccc"></input></view>
    </view>

    <view class="fui-cell" v-if="radios.card.checked == 1">
      <view class="fui-cell-label">确认卡号</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark"><input type="text" placeholder="请填写银行卡号" data-input="bankcard1" @input="changeinput" placeholder-style="color:#ccc"></input></view>
    </view>
  </view>

  <view class="submit" @tap="submit">下一步</view>

  <view class="tip">
    <view>详情说明</view>
    <view v-if="msg.set_array.charge  != 0">分红提现{{msg.set.texts.dividend_charge}}{{msg.set_array.charge}}%</view>
    <view v-if="msg.set_array.end != 0">{{msg.set.texts.dividend_charge}}金额在￥{{msg.set_array.begin}}到￥{{msg.set_array.end}}间免收</view>
    <view v-if="msg.deductionmoney  != 0">本次提现将{{msg.set.texts.dividend_charge}}金额￥{{msg.deductionmoney}}</view>
    <view v-if="msg.set_array.charge  != 0">本次提现实际到账金额<text style="color: #cfa943;">￥{{msg.realmoney}}</text></view>
  </view>
</view>
  <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
    <view class="text">{{FoxUIToast.text}}</view>
  </view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('/core');
var foxui = app.requirejs('/foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      radios: {
        balance: {
          checked: 0,
          name: '余额'
        },
        weixin: {
          checked: 0,
          name: '微信'
        },
        alipay: {
          checked: 0,
          name: '支付宝'
        },
        card: {
          checked: 0,
          name: '银行卡'
        }
      },
      args: {}
    };
  },

  onLoad: function (options) {
    var $this = this;
    core.get('dividend/apply', '', function (res) {
      $this.setData({
        msg: res
      });

      if (!res.member) {}
    });
  },
  components: {},
  props: {},
  methods: {
    balance: {
      checked: 0,
      name: '余额'
    },
    weixin: {
      checked: 0,
      name: '微信'
    },
    alipay: {
      checked: 0,
      name: '支付宝'
    },
    card: {
      checked: 0,
      name: '银行卡'
    },
    selected: function (e) {
      var $this = this;
      var radios = $this.data.radios;
      var status = e.currentTarget.dataset.status;

      for (var i in radios) {
        if (status == i) {
          radios[i].checked = e.currentTarget.dataset.checked == true ? false : true;
          $this.setData({
            radios: radios,
            'args.type': e.currentTarget.dataset.type
          });
        } else {
          radios[i].checked = false;
          $this.setData({
            radios: radios
          });
        }
      }
    },
    changeinput: function (e) {
      var $this = this,
          val = e.detail.value,
          key = e.target.dataset.input,
          msg = $this.data.args;
      msg[key] = val;
      $this.setData({
        args: msg
      });
    },
    bindpullldown: function (e) {
      console.error(e.detail.value);
      var $this = this,
          index = e.detail.value,
          banklist = $this.data.msg.banklist,
          msg = $this.data.args;

      for (var i in banklist) {
        if (i == index) {
          $this.setData({
            'args.bankname': banklist[index].bankname,
            index: index
          });
        }
      }
    },
    submit: function () {
      var $this = this,
          text = '',
          args = $this.data.args;

      if (args.type == 0) {
        text = '余额';
      } else if (args.type == 1) {
        text = '微信钱包';
      } else if (args.type == 2) {
        text = '支付宝';

        if (!args.realname) {
          foxui.toast($this, '请输入姓名');
          return;
        }

        if (!args.alipay) {
          foxui.toast($this, '请输入支付宝账号');
          return;
        }

        if (!args.alipay1) {
          foxui.toast($this, '请输入支付宝确认账号');
          return;
        }

        if (args.alipay != args.alipay1) {
          foxui.toast($this, '支付宝账号不一致');
          return;
        }
      } else if (args.type == 3) {
        text = '银行卡';

        if (!args.realname1) {
          foxui.toast($this, '请输入姓名');
          return;
        }

        if (!args.bankname) {
          foxui.toast($this, '请选择银行');
          return;
        }

        if (!args.bankcard) {
          foxui.toast($this, '请输入银行卡账号');
          return;
        }

        if (!args.bankcard1) {
          foxui.toast($this, '请输入银行卡确认账号');
          return;
        }

        if (args.bankcard != args.bankcard1) {
          foxui.toast($this, '银行卡账号不一致');
          return;
        }

        args.realname = args.realname1;
      }

      wx.showModal({
        title: '提示',
        content: '确认提现到' + text + '吗？',
        success: function (res) {
          if (res.confirm) {
            core.post('dividend/apply', args, function (res) {
              wx.navigateBack({
                detail: 1
              });
            });
          }
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

.header{
  height: 173rpx;
  background: #1c1b21;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24rpx;
}
.header .title{
  font-size: 28rpx;
  color: #999;
  margin-bottom: 20rpx; 
}
.header .price{
  font-size: 40rpx;
  color: #cfa943;
}


.content .cell{
  line-height: 88rpx;
  font-size: 28rpx;
  color: #666;
  display: flex;
  position: relative;
  padding-left: 24rpx;
  border-bottom: 1rpx solid #ededed;
}

.submit{
  width:702rpx;
  height: 80rpx;
  background: #1c1b21;
  margin: 36rpx auto 20rpx;
  font-size: 34rpx;
  text-align: center;
  line-height: 80rpx;
  color: #cfa943;
  border-radius: 10rpx;
}

.tip{
  font-size: 24rpx;
  color: #999;
  line-height: 36rpx;
  padding: 0 24rpx;
  margin-bottom: 60rpx;
}
.fui-cell-group .fui-cell .fui-cell-remark {
	text-align: right;
  position: relative;
}
radio{
  transform: scale(0.8);
  position: absolute;
  right: -20rpx;
  top: -22rpx;
}

picker{
  float: left;
  font-size: 26rpx;
  color: #ccc;
  line-height: 44rpx;
}
</style>