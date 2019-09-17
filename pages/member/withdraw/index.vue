<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="fui-cell-title">
        <view class="fui-cell-info" style="font-size:28rpx;color:#666;position: relative;height: 100%;line-height: 57rpx">可提现金额: ¥{{ info.credit }} <text class="text-danger" @tap="bindAll" style="position: absolute;right: 0;text-decoration: underline">全部提现</text></view>
    </view>
    <view class="fui-cell-group" style="margin-top: 0">
        <view class="fui-cell-title" style="font-size:28rpx;color:#666;line-height: 57rpx">提现金额
            <small v-if="info.withdrawmoney>0">提现额度最小为: <span class="text-danger">¥{{ info.withdrawmoney }}</span></small>
        </view>
        <view class="fui-cell no-border" style="padding: 0 24rpx 24rpx;">
            <view class="fui-cell-label big" style="width:auto; font-size:40rpx;color: #000; ">¥</view>
            <view class="fui-cell-info">
                <input type="digit" class="fui-input money" @input="moneyChange" :value="( money==0?'':money )"></input>
            </view>
        </view>
</view>
<view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label"><span class="re-g">提现方式</span></view>
            <!-- <view class="fui-cell-info" wx:if="{{ info.type_array.length<1 }}">未设置提现方式</view>
            <picker class="fui-cell-info" value="{{checkedIndex}}" range="{{objectArray}}" range-key="name" bindchange="pickerChange" wx:if="{{ checked }}">{{ checked.name }}</picker>
            <view class="fui-cell-remark" wx:if="{{ info.type_array.length>1 }}"></view> -->
        </view>
         <radio-group v-for="(item, index) in info.type_array" :key="index">
         <label @tap="typeChange" data-name="0" v-if="item.type=='0'">
            <view class="fui-cell applyradio">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/wx.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" :checked="(checked.id==0?'checked':'')" value="1" class="fui-radio fui-radio-danger" :data-type="item.type"></radio></view>
            </view>
          </label>
          <label @tap="typeChange" data-name="1" v-if="item.type=='2'">
            <view class="fui-cell applyradio">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/zfb.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" :checked="(checked.id==2?'checked':'')" value="1" class="fui-radio fui-radio-danger" :data-type="item.type"></radio></view>
            </view>
          </label>
        <block v-if="checked.id==2&& item.type=='2'">
           <view class="fui-cell">
            <view class="fui-cell-label">姓名</view>
            <view class="fui-cell-info">
                <input type="text" class="fui-input" :value="info.last_data.realname" max="25" @input="inputChange" data-type="realname" placeholder="请输入姓名"></input>
            </view>
        </view>
            <view class="fui-cell">
                <view class="fui-cell-label">支付宝帐号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" :value="info.last_data.alipay" max="25" @input="inputChange" data-type="alipay" placeholder="请输入支付宝账号"></input>
                </view>
            </view>
            <view class="fui-cell alipay-group">
                <view class="fui-cell-label">确认帐号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" :value="info.last_data.alipay" max="25" @input="inputChange" data-type="alipay1" placeholder="请确认支付宝账号"></input>
                </view>
            </view>
        </block>
        <label @tap="typeChange" data-name="2">
            
            <view class="fui-cell applyradio" v-if="item.type=='3'">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/yinhangka.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" :checked="(checked.id==3?'checked':'')" value="1" class="fui-radio fui-radio-danger" :data-type="item.type"></radio></view>
            </view> 
          </label>
        </radio-group>  
        <view class="fui-cell" v-if="checked.id==3">
            <view class="fui-cell-label">姓名</view>
            <view class="fui-cell-info">
                <input type="text" class="fui-input" :value="info.last_data.realname" max="25" @input="inputChange" data-type="realname" placeholder="请输入姓名"></input>
            </view>
        </view>
         <view class="fui-cell" v-if="checked.id==3">
            <view class="fui-cell-label"><span class="re-g">选择银行</span></view>
            <picker class="fui-cell-info" :value="bankCheckedIndex" :range="info.banklist" range-key="bankname" @change="bankChange">{{ bankChecked.bankname }}</picker>
            <view class="fui-cell-remark"></view>
        </view>
       
        <block v-if="checked.id==3">
            <view class="fui-cell alipay-group">
                <view class="fui-cell-label">银行卡号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" :value="info.last_data.bankcard" max="25" @input="inputChange" data-type="bankcard" placeholder="请输入银行卡号"></input>
                </view>
            </view>
            <view class="fui-cell alipay-group">
                <view class="fui-cell-label">确认卡号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" :value="info.last_data.bankcard" max="25" @input="inputChange" data-type="bankcard1" placeholder="请确认银行卡号"></input>
                </view>
            </view>
        </block>
        <view class="fui-cell-title" v-if="info.withdrawcharge>0">提现手续费为 {{ info.withdrawcharge }}%</view>
        <view class="fui-cell-title" v-if="info.withdrawend>0">手续费金额在¥{{ info.withdrawbegin}}到¥{{ info.withdrawend }}间免收</view>

        <view class="fui-cell-title charge-group" v-if="chargeShow">本次提现将扣除手续费 ¥<text class="text-danger">{{ deductionmoney }}</text></view>
        <view class="fui-cell-title charge-group" v-if="chargeShow">本次提现实际到账金额 ¥<span class="text-danger">{{ realmoney }}</span></view>
    </view>

    <view :class="'btn btn-danger mtop block ' + ( disabled?'disabled':'' )" @tap="submit">提现</view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
    
</view>
</view>
</template>

<script>
/**
 *
 * withdraw\index.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-01-10
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      loading: true,
      objectArray: [],
      checkedIndex: 1,
      checked: {},
      bankChecked: {},
      money: 0,
      chargeShow: false,
      disabled: true,
      info: {},
      realInfo: {}
    };
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow: function (options) {
    app.url(options);
    this.getInfo();
    this.setData({
      isSubmit: false
    });
  },
  components: {},
  props: {},
  methods: {
    getInfo: function () {
      var $this = this;
      core.get('member/withdraw', {}, function (result) {
        // result.type_array.push({ type: 0, title: "提现到微信余额"});
        var data = {
          info: result,
          objectArray: [],
          show: true
        };

        if (!$.isEmptyObject(result.last_data)) {
          data.realInfo = {
            alipay: result.last_data.alipay,
            alipay1: result.last_data.alipay,
            bankcard: result.last_data.bankcard,
            bankcard1: result.last_data.bankcard,
            bankname: result.last_data.bankname,
            realname: result.last_data.realname
          };
        }

        if (result.type_array) {
          $.each(result.type_array, function (index, val) {
            data.objectArray.push({
              id: val.type,
              name: val.title
            });

            if (val.checked) {
              if (!data.checked) {
                data.checked = {
                  id: val.type,
                  name: val.title
                };
              }

              data.checkedIndex = index;
            }
          });
        }

        if (!data.checked) {
          data.checked = data.objectArray[0];
          data.checkedIndex = 0;
        }

        data.bankCheckedIndex = result.lastbankindex || 0;
        $this.setData(data);

        if (result.withdrawmoney > 0 && result.credit >= result.withdrawmoney) {
          data.money = result.withdrawmoney;
          $this.moneyChange({
            detail: {
              value: result.withdrawmoney
            }
          });
        }

        if (data.checked.id == 3) {
          $this.bankChange({
            detail: {
              value: result.lastbankindex || 0
            }
          });
        }

        wx.setNavigationBarTitle({
          title: result.moneytext + "提现"
        });
      });
    },
    bindAll: function (event) {
      if (this.info.credit <= 0) {
        return;
      }

      this.setData({
        money: this.info.credit
      });
      this.allow();
      this.moneyChange({
        detail: {
          value: this.info.credit
        }
      });
    },
    allow: function () {
      var info = this.info;
      var money = parseFloat(this.money);

      if (money <= 0 || isNaN(money)) {
        return false;
      }

      if (info.withdrawmoney > 0 && money < info.withdrawmoney) {
        return false;
      }

      if (money > info.credit) {
        return false;
      }

      if ($.isEmptyObject(this.checked)) {
        return false;
      }

      if (info.withdrawcharge > 0 && money > 0) {
        var deductionmoney = money / 100 * info.withdrawcharge;
        deductionmoney = Math.round(deductionmoney * 100) / 100;

        if (deductionmoney >= info.withdrawbegin && deductionmoney <= info.withdrawend) {
          deductionmoney = 0;
        }

        var realmoney = money - deductionmoney;
        realmoney = Math.round(realmoney * 100) / 100;
        this.setData({
          deductionmoney: deductionmoney,
          realmoney: realmoney,
          chargeShow: true
        });
      }

      return true;
    },
    moneyChange: function (event) {
      var money = event.detail.value;

      if (money < 0 || isNaN(money)) {
        money = 0;
      }

      this.setData({
        money: money
      });
      this.setData({
        disabled: this.allow() ? false : true
      });
    },
    typeChange: function (e) {
      var data = {};
      var index = e.currentTarget.dataset.name;
      data.checked = this.objectArray[index];

      if (data.checked.id == 3) {
        data.bankChecked = this.info.banklist[0];
        data.bankCheckedIndex = 0;
      }

      this.setData(data);
    },
    inputChange: function (event) {
      var realinfo = this.realInfo;
      var bindtype = event.currentTarget.dataset.type;
      var value = $.trim(event.detail.value);
      realinfo[bindtype] = value;
      this.setData({
        realInfo: realinfo
      });
    },
    bankChange: function (event) {
      var index = $.trim(event.detail.value),
          bank = this.info.banklist[index];
      this.setData({
        bankChecked: bank
      });
    },
    submit: function (event) {
      var $this = this,
          data = this;

      if (data.disabled || data.isSubmit) {
        return;
      }

      if (data.money <= 0) {
        foxui.toast($this, "请填写提现金额");
        return;
      }

      if ($.isEmptyObject(data.checked)) {
        foxui.toast($this, "请选择提现方式");
        return;
      }

      var html = data.checked.name;
      var postData = {
        applytype: data.checked.id,
        money: data.money
      };

      if (data.checked.id == 2) {
        if (!data.realInfo.realname) {
          foxui.toast($this, "请填写姓名");
          return;
        }

        if (!data.realInfo.alipay) {
          foxui.toast($this, "请填写支付宝帐号");
          return;
        }

        if (!data.realInfo.alipay1) {
          foxui.toast($this, "请确认支付宝帐号");
          return;
        }

        if (data.realInfo.alipay != data.realInfo.alipay1) {
          foxui.toast($this, "两次填写的支付宝不一致");
          return;
        }

        html += "？姓名:" + data.realInfo.realname + " 支付宝帐号:" + data.realInfo.alipay;
        postData.realname = data.realInfo.realname;
        postData.alipay = data.realInfo.alipay;
        postData.alipay1 = data.realInfo.alipay1;
      } else if (data.checked.id == 3) {
        if ($.isEmptyObject(data.bankChecked)) {
          foxui.toast($this, "请选择提现银行");
          return;
        }

        if (!data.realInfo.realname) {
          foxui.toast($this, "请填写姓名");
          return;
        }

        if (!data.realInfo.bankcard) {
          foxui.toast($this, "请填写银行卡号");
          return;
        }

        if (!data.realInfo.bankcard1) {
          foxui.toast($this, "请确认银行卡号");
          return;
        }

        if (data.realInfo.bankcard != data.realInfo.bankcard1) {
          foxui.toast($this, "两次填写的银行卡号不一致");
          return;
        }

        html += "？姓名:" + data.realInfo.realname + " 银行:" + data.bankChecked.bankname + " 卡号:" + data.realInfo.bankcard;
        postData.realname = data.realInfo.realname;
        postData.bankname = data.bankChecked.bankname;
        postData.bankcard = data.realInfo.bankcard;
        postData.bankcard1 = data.realInfo.bankcard1;
      }

      if (data.checked.id < 2) {
        var confirm_msg = '确认要' + html + "？";
      } else {
        var confirm_msg = '确认要' + html;
      }

      if (data.info.withdrawcharge > 0) {
        confirm_msg += ' 扣除手续费 ' + data.deductionmoney + ' 元,实际到账金额 ' + data.realmoney + ' 元';
      }

      core.confirm(confirm_msg, function () {
        $this.setData({
          isSubmit: true
        });
        core.post('member/withdraw/submit', postData, function (result) {
          if (result.error) {
            foxui.toast($this, result.message);
            $this.setData({
              isSubmit: false
            });
            return;
          }

          foxui.toast($this, "提现申请成功，请等待审核");
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/member/log/index?type=1'
            });
          }, 500);
        });
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
.fui-cell-group .fui-cell .fui-input.money  {
    font-size: 45rpx;
}
.fui-cell.no-border::before{
display: none
}
.fui-cell-group .fui-cell .fui-cell-icon {
    width: auto;
    height: auto
}
.fui-cell image{
    width: 52rpx;
    height: 52rpx;
}
.fui-cell.applyradio::after{
  content:" ";
position:absolute;
left:20rpx;
right:20rpx;
top:0;
height:1px;
border-top:1px solid #ebebeb;
color:#D9D9D9;
transform-origin:0 0;
transform:scaleY(0.5);

}
</style>