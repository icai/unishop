<template>
<view>
<!--pages/commission/apply/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="page apply" v-if="show">
    <view class="fui-cell-group">
        <view class="fui-cell" style="padding-top:40rpx">
            <view class="fui-cell-info" style="font-size: .7rem;color: #666;">我的{{ set['texts']['commission_ok'] }}</view>
        </view>
        <view class="fui-cell" style="padding-bottom:40rpx;padding-top:0;">
         
            <view class="fui-cell-label price">¥</view>
             <view class="fui-cell-info price">{{ commission_ok }}</view>
        </view>
        </view>
        <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">提现方式</view>
               <!-- <view class='fui-cell-info'><picker value="{{ applyIndex }}" range="{{ type_array }}" range-key="title" bindchange="typeChange">{{ type_array[applyIndex].title }}</picker></view> -->
        </view>
        <radio-group v-for="(item, index) in type_array" :key="index">
          <label @tap="typeChange" data-name="0" v-if="item.type=='0'">
             <view class="fui-cell applyradio">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/ye.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" value="1" class="fui-radio fui-radio-danger" id="applytype" data-type="0" :checked="(applytype==0?'checked':'')"></radio></view>
            </view>
          </label>
           <label @tap="typeChange" data-name="1" v-if="item.type=='1'">
          
            <view class="fui-cell applyradio">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/wx.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" value="1" class="fui-radio fui-radio-danger" data-type="1" :checked="(applytype==1?'checked':'')"></radio></view>
            </view>
          </label> 
          <label @tap="typeChange" data-name="2" v-if="item.type=='2'">
            
            <view class="fui-cell applyradio">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/zfb.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" value="1" class="fui-radio fui-radio-danger" data-type="2" :checked="(applytype==2?'checked':'')"></radio></view>
            </view>
          </label>
           <block v-if="applytype==2&&item.type=='2'">
              <view class="fui-cell">
                    <view class="fui-cell-label">姓名</view>
                    <view class="fui-cell-info">
                        <input type="text" class="fui-input" :value="last_data.realname" max="25" @input="inputChange" data-type="realname" placeholder="请输入姓名"></input>
                    </view>
                </view>
                <view class="fui-cell">
                    <view class="fui-cell-label">支付宝帐号</view>
                    <view class="fui-cell-info">
                        <input class="fui-input" :value="last_data.alipay" max="25" @input="inputChange" data-type="alipay" placeholder="请输入支付宝账号"></input>
                    </view>
                </view>
                <view class="fui-cell alipay-group">
                    <view class="fui-cell-label">确认帐号</view>
                    <view class="fui-cell-info">
                        <input class="fui-input" :value="last_data.alipay1" max="25" @input="inputChange" data-type="alipay1" placeholder="请确认支付宝账号"></input>
                    </view>
                </view>
            </block>
          <label @tap="typeChange" data-name="3" v-if="item.type=='3'">
            
            <view class="fui-cell applyradio">
                <view class="fui-cell-icon"><image src="/static/images/icon-white/yinhangka.png" alt></image></view>
                <view class="fui-cell-info">
                    {{item.title}}
                </view>
                <view class="fui-cell-remark noremark"><radio color="#ff5555" value="1" class="fui-radio fui-radio-danger" data-type="3" :checked="(applytype==3?'checked':'')"></radio></view>
            </view> 
          </label>
        </radio-group>            
        <view class="fui-cell" v-if="applytype==3">
            <view class="fui-cell-label">姓名</view>
            <view class="fui-cell-info">
                <input type="text" class="fui-input" :value="last_data.realname" max="25" @input="inputChange" data-type="realname" placeholder="请输入姓名"></input>
            </view>
        </view>
        <view class="fui-cell" v-if="applytype==3">
            <view class="fui-cell-label"><span class="re-g">选择银行</span></view>
            <picker class="fui-cell-info" :value="bankIndex" :range="banklist" range-key="bankname" @change="bankChange">{{ banklist[bankIndex]['bankname'] }}</picker>
            <view class="fui-cell-remark"></view>
        </view>
        <block v-if="applytype==3">
            <view class="fui-cell alipay-group">
                <view class="fui-cell-label">银行卡号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" :value="last_data.bankcard" max="25" @input="inputChange" data-type="bankcard" placeholder="请输入银行卡号"></input>
                </view>
            </view>
            <view class="fui-cell alipay-group">
                <view class="fui-cell-label">确认卡号</view>
                <view class="fui-cell-info">
                    <input class="fui-input" :value="last_data.bankcard1" max="25" @input="inputChange" data-type="bankcard1" placeholder="请确认银行卡号"></input>
                </view>
            </view>
        </block>
    </view>

    <view class="fui-cell-group" v-if="set_array['charge']>0">
        <view class="fui-cell">
            <view class="fui-cell-info"> 佣金提现{{ set['texts']['commission_charge'] }} {{ set_array['charge'] }}%</view>
        </view>

        <view class="fui-cell" v-if="set_array['end']>0">
            <view class="fui-cell-info"> {{ set['texts']['commission_charge'] }}金额在¥{{ set_array['begin'] }}到￥{{ set_array['end'] }}间免收</view>
        </view>

        <view class="fui-cell" v-if="deductionmoney>0">
            <view class="fui-cell-info"> 本次提现将{{ set['texts']['commission_charge'] }}金额 ¥ {{ deductionmoney }}</view>
        </view>

        <view class="fui-cell">
            <view class="fui-cell-info">本次提现实际到账金额 ¥ {{realmoney}}</view>
        </view>
    </view>
    <view :class="'btn btn-warning mtop block ' + ( (!cansettle || isSubmit)?'disabled':'' )" @tap="submit">下一步</view>
    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</view>
</template>

<script>
/**
 *
 * commission/apply/index.js
 *
 * @create 2017-2-7
 * @author Young
 *
 * @update  Young 2017-2-7
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {};
  },

  onShow: function () {
    this.getData();
  },
  components: {},
  props: {},
  methods: {
    getData: function () {
      var $this = this;
      core.get('commission/apply', {}, function (json) {
        if (!$.isEmptyObject(json.type_array)) {
          json.show = true;

          if ($.isArray(json.last_data)) {
            json.last_data = {};
          }

          if (json.last_data) {
            json.last_data.alipay1 = json.last_data.alipay;
            json.last_data.bankcard1 = json.last_data.bankcard;
          }

          json.bankIndex = json.bankIndex || 0;
          $this.setData(json);
        } else {
          core.alert(json.message || '没有提现方式!');
          setTimeout(function () {
            if (json.error == 70001) {
              wx.redirectTo({
                url: '/pages/member/info/index'
              });
            } else {
              wx.navigateBack();
            }
          }, 2000);
        }
      }, false, true);
    },
    typeChange: function (e) {
      var val = e.currentTarget.dataset.name;
      this.setData({
        applytype: val
      });
    },
    bankChange: function (e) {
      var val = e.detail.value;
      this.setData({
        bankIndex: val
      });
    },
    inputChange: function (e) {
      var realinfo = this.last_data;
      var bindtype = e.currentTarget.dataset.type,
          value = $.trim(e.detail.value);
      realinfo[bindtype] = value;
      this.setData({
        last_data: realinfo
      });
    },
    submit: function (event) {
      var $this = this,
          data = this,
          confirm_msg;

      if (!data.cansettle || data.isSubmit) {
        return;
      } //mjy 弹窗提示


      if (data.applytype == 0) {
        var html = "提现到余额";
      } else if (data.applytype == 1) {
        var html = "提现到微信钱包";
      } else if (data.applytype == 2) {
        var html = "提现到支付宝";
      } else if (data.applytype == 3) {
        var html = "提现到银行卡";
      }

      var postData = {
        type: data.applytype
      };

      if (data.applytype == 2) {
        if (!data.last_data.realname) {
          foxui.toast($this, "请填写姓名");
          return;
        }

        if (!data.last_data.alipay) {
          foxui.toast($this, "请填写支付宝帐号");
          return;
        }

        if (!data.last_data.alipay1) {
          foxui.toast($this, "请确认支付宝帐号");
          return;
        }

        if (data.last_data.alipay != data.last_data.alipay1) {
          foxui.toast($this, "两次填写的支付宝不一致");
          return;
        }

        html += "？姓名:" + data.last_data.realname + " 支付宝帐号:" + data.last_data.alipay;
        postData.realname = data.last_data.realname;
        postData.alipay = data.last_data.alipay;
        postData.alipay1 = data.last_data.alipay1;
      } else if (data.applytype == 3) {
        if (!data.banklist[data.bankIndex]['bankname']) {
          foxui.toast($this, "请选择提现银行");
          return;
        }

        if (!data.last_data.realname) {
          foxui.toast($this, "请填写姓名");
          return;
        }

        if (!data.last_data.bankcard) {
          foxui.toast($this, "请填写银行卡号");
          return;
        }

        if (!data.last_data.bankcard1) {
          foxui.toast($this, "请确认银行卡号");
          return;
        }

        if (data.last_data.bankcard != data.last_data.bankcard1) {
          foxui.toast($this, "两次填写的银行卡号不一致");
          return;
        }

        html += "？姓名:" + data.last_data.realname + " 银行:" + data.banklist[data.bankIndex]['bankname'] + " 卡号:" + data.last_data.bankcard;
        postData.realname = data.last_data.realname;
        postData.bankname = data.banklist[data.bankIndex]['bankname'];
        postData.bankcard = data.last_data.bankcard;
        postData.bankcard1 = data.last_data.bankcard1;
      }

      if (data.applytype < 2) {
        confirm_msg = '确认要' + html + "？";
      } else {
        confirm_msg = '确认要' + html;
      }

      if (data.set_array['charge'] > 0) {
        confirm_msg += ' 扣除手续费 ' + data.deductionmoney + ' 元,实际到账金额 ' + data.realmoney + ' 元';
      }

      core.confirm(confirm_msg, function () {
        $this.setData({
          isSubmit: true
        });
        core.post('commission/apply', postData, function (result) {
          if (result.error) {
            foxui.toast($this, result.message);
            $this.setData({
              isSubmit: false
            });
            return;
          }

          foxui.toast($this, "提现申请成功，请等待审核");
          setTimeout(function () {
            wx.navigateBack();
          }, 500);
        }, true, true);
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
/* pages/commission/apply/index.wxss */
.apply .fui-cell {
  line-height: 1
}
.fui-cell-group .fui-cell .fui-cell-icon {
    width: auto;
    height: auto
}
.apply .fui-cell image{
    width: 52rpx;
    height: 52rpx;
}
.apply .fui-cell .price{
    font-size: 40rpx;
    width: 40rpx;
    color: #ff8000;
}
.fui-cell-group .fui-cell::before {
    display: none
}
</style>