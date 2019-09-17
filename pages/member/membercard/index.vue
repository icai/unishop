<template>
<view>
<view class="page">
  <view class="tab">
    <view :class="'item ' + (cate == 'all' ? 'active' : '')" data-cate="all" @tap="tab">全部({{all_total}})</view>
    <view :class="'item ' + (cate == 'my' ? 'active' : '')" data-cate="my" @tap="tab">我的会员卡({{my_total}})</view>
  </view>
  <view class="card-list">
    <view class="card-blank" v-if="cate == 'my' && total<=0 && !loading">
      <i class="icox icox-queshengye"></i>
      <view class="text">暂无可用会员卡</view>
      <view class="cardbtn" data-cate="all" @tap="tab">去购买</view>
    </view>
    <block v-for="(item, index) in list" :key="index">
      <view :class="'card-list-item ' + item.card_style">
        <view class="shadow"></view>
        <view :class="'title-r ' + (cate == 'all' ? 'mycard' : '')" v-if="item.startbuy != -1" :data-startbuy="item.startbuy" :data-id="item.id" :data-stock="item.stock" @tap="submit">
          <block v-if="cate == 'all'">
            <block v-if="item.startbuy == 1">立即开通</block>
            <block v-if="item.startbuy == 2">重新购买</block>
            <block v-if="item.startbuy == 0">续费</block>
            <block v-if="item.startbuy == -1">永久有效</block>
          </block>
          <block v-else>{{item.validate == '永久有效'? '永久有效' : '续费'}}</block>
        </view>
        <navigator wx:for-index="index" :for-index="index" open-type="navigate" hover-class="none" :url="'/pages/member/membercard/detail/index?id=' + item.id + '&cate=' + cate + '&page=' + page-1" :class="'content ' + item.card_style">
          <i class="iconbg icox icox-huiyuan"></i>
          <view class="content-inner">
            <view class="content-title">
              <view class="title-l">
                <image src="/static/images/icon-white.png" style="height: 40rpx;width: 40rpx;position: reletive;top: -4rpx;margin-right: 10rpx;"></image>{{item.name}}</view>
            </view>
            <view class="price">{{item.price}}
              <span style="font-size: 30rpx;">元</span>
            </view>
            <view class="date">{{item.validate}}</view>
             <view class="equity">{{item.shipping == 1 ? '免费包邮' : ''}}{{item.member_discount == 1 ? (item.shipping == 1 ? '·' : '')+ item.discount_rate + '折优惠' : ''}}{{item.is_card_coupon == 1 ? (item.shipping == 1 || item.member_discount == 1 ? '·' : '')+'开卡送券' : ''}}{{item.is_month_coupon == 1 ? (item.shipping == 1 || item.member_discount == 1 || item.is_card_coupon == 1 ? '·' : '')+'每月领券' : ''}}</view> 
          </view>
        </navigator>
      </view>
    </block>
  </view>
  <view class="fui-loading" v-if="loading">
    <view class="icon"></view>
    <view class="text">正在加载</view>
  </view>
  <view class="fui-loading empty" v-if="list.length==total&&total>0">
    <view class="text">没有更多了</view>
  </view>
  <view class="fui-loading empty" v-if="cate != 'my' && total<=0 && !loading">
    <view class="text">暂时没有任何会员卡</view>
  </view>
</view>
<navigator class="fui-dot" hover-class="none" url="/pages/member/index/index" open-type="switchTab">
  <text class="icox icox-huiyuan1" style="color:#fff;font-size:40rpx"></text>
</navigator>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
  <view class="text">{{FoxUIToast.text}}</view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      page: 1,
      cate: 'all',
      list: []
    };
  },

  onReachBottom: function () {
    console.error(this.loaded + '  ' + this.list.length + '  ' + this.total);

    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.get_list();
  },
  onLoad: function (options) {
    var $this = this;
    $this.setData({
      options: options,
      cate: options.cate
    });

    if (options.hasmembercard == 'true') {
      $this.setData({
        cate: 'my'
      });
    }

    console.error(options);
    $this.get_list();
  },
  components: {},
  props: {},
  methods: {
    tab: function (e) {
      var $this = this;
      $this.setData({
        cate: e.currentTarget.dataset.cate,
        list: [],
        page: 1
      });
      $this.get_list();
    },
    get_list: function () {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.get('membercard.getlist', {
        page: $this.data.page,
        cate: $this.data.cate
      }, function (res) {
        console.error(res);

        if (res.error == 0) {
          $this.setData({
            loading: false,
            total: res.total,
            empty: true,
            all_total: res.all_total,
            my_total: res.my_total
          });

          if (res.list.length > 0) {
            $this.setData({
              page: $this.data.page + 1,
              list: $this.data.list.concat(res.list)
            });
          }

          if (res.list.length > res.pagesize) {
            $this.setData({
              loaded: true
            });
          }
        } else {
          core.toast(res.message, 'loading');
        }
      }, this.show);
    },
    // 立即开通
    // 购买
    submit: function (e) {
      var data = e.currentTarget.dataset,
          $this = this;

      if (data.startbuy == -1) {
        return;
      }

      if (data.stock == '0') {
        foxui.toast($this, '库存不足');
        return;
      }

      core.post('membercard.order.create_order', {
        id: data.id
      }, function (res) {
        if (res.error != 0) {
          foxui.toast($this, res.message);
          return;
        }

        wx.navigateTo({
          url: '/pages/member/membercard/pay/index?order_id=' + res.order.order_id
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
page{
  background: #fff;
}
.page{
  border-top: none;
}
.tab{
  height: 76rpx;
  display: flex;
  line-height: 76rpx;
  font-size: 24rpx;
  color: #666;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
}
.tab .item{
  flex: 1;
  position: relative;
  border-bottom: 1rpx solid #ededed;
  border-top: 1rpx solid #ededed;
}
.tab .item.active{
  color: #333;
  font-weight: bold;
}
.tab .item.active:after{
  content: "";
  position: absolute;
  width: 92rpx;
  height: 4rpx;
  background: #333;
  bottom: 0;
  left: 50%;
  margin-left: -46rpx;
}
.card-list{
  padding-top: 76rpx;
}
.card-list-item{
  width: 620rpx;
  height: 358rpx;
  margin: 46rpx auto 0;
  position: relative; 
  border-radius: 15rpx;
}
.card-list-item .iconbg{
  position: absolute;
  right: -33rpx;
  bottom: -57rpx;
  z-index: 3;
  font-size: 170rpx;
  color: #000;
  opacity: 0.1
}
.card-list-item.card-style-black .iconbg{
  color: #fff;
}
.card-list-item .content{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  border-radius: 15rpx;
  padding: 20rpx;
  overflow: hidden;
}
.card-list-item .content .content-inner{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20rpx;
  box-sizing: border-box;
  z-index: 4;
}
.card-list-item .content .content-inner .content-title{
    height: 64rpx;
    line-height: 64rpx;
    color: #fff;
    display: flex;
}
.card-list-item .content .content-inner .content-title .title-l{
  opacity: 0.8;
  flex: 1;
}
.card-list-item .content .content-inner .content-title .title-l i{
  margin-right: 10rpx;
}
.card-list-item  .title-r{
    display: inline-block;
    width: 130rpx;
    height: 44rpx;
    line-height:44rpx;
    text-align: center;
    background: rgba(255,255,255,0.6);
    font-size: 22rpx;
    border-radius: 28rpx;
    color: #333;
    position: absolute;
    right: 40rpx;
    top: 40rpx;
    z-index: 999;
}
.card-list-item .content .content-inner .contenttitle-r-title .title-r.mycard{
  background: #333;
  color: #c1a167;
}
.card-list-item .content-inner .price{
    text-align: center;
    font-size: 60rpx;
    color: #fff;
    font-weight: bold;
    line-height: 1;
    margin-top: 30rpx;
    opacity: 0.8;
}
.card-list-item .content-inner .date{
    text-align: center;
    font-size: 28rpx;
    color: #fff;
    line-height: 1;
    margin-top: 20rpx;
    opacity: 0.8;
}
.card-list-item .content-inner .equity{
    text-align: center;
    font-size: 24rpx;
    color: #fff;
    line-height: 1;
    margin-top: 48rpx;
}
.card-list-item .content .content-inner:after{
  content: "";
  position: absolute;
  left: 0;
  top:0;
  right: 0;
  bottom: 0;
  border: 2rpx solid #000;
  opacity: 0.1; 
}
.icox-queshengye{
  font-size: 190rpx;
  color: #f3f3f3;
}

.card-style-golden{
    background: -webkit-linear-gradient(left, #c1a167 , #e9d5aa);
    background: -o-linear-gradient(right, #c1a167 , #e9d5aa);
    background: -moz-linear-gradient(right, #c1a167 , #e9d5aa);
    background: linear-gradient(to right, #c1a167 , #e9d5aa);
}
.card-list-item.card-style-golden .shadow{
  box-shadow: 0 0 70rpx #c1a167;
}
.card-style-erythrine{
    background: -webkit-linear-gradient(left, #745757 , #966d6d);
    background: -o-linear-gradient(right,  #745757 , #966d6d);
    background: -moz-linear-gradient(right,  #745757 , #966d6d);
    background: linear-gradient(to right,  #745757 , #966d6d);
}
.card-list-item.card-style-erythrine .shadow{
  box-shadow: 0 0 70rpx #745757;
}
.card-style-gray{
    background: -webkit-linear-gradient(left, #434247 , #7a7985);
    background: -o-linear-gradient(right, #434247 , #7a7985);
    background: -moz-linear-gradient(right, #434247 , #7a7985);
    background: linear-gradient(to right, #434247 , #7a7985);
}
.card-list-item.card-style-gray .shadow{
  box-shadow: 0 0 70rpx #434247;
}
.card-style-brown{
    background: -webkit-linear-gradient(left, #736e6c , #978c8c);
    background: -o-linear-gradient(right, #736e6c , #978c8c);
    background: -moz-linear-gradient(right, #736e6c , #978c8c);
    background: linear-gradient(to right, #736e6c , #978c8c);
}
.card-list-item.card-style-brown .shadow{
  box-shadow: 0 0 70rpx #736e6c;
}
.card-style-blue{
    background: -webkit-linear-gradient(left, #576074 , #6d7b96);
    background: -o-linear-gradient(right, #576074 , #6d7b96);
    background: -moz-linear-gradient(right, #576074 , #6d7b96);
    background: linear-gradient(to right, #576074 , #6d7b96);
}
.card-list-item.card-style-blue .shadow{
  box-shadow: 0 0 70rpx #576074;
}
.card-style-black{
    background: -webkit-linear-gradient(left, #373737 , #4a4a4a);
    background: -o-linear-gradient(right, #373737 , #4a4a4a);
    background: -moz-linear-gradient(right, #373737 , #4a4a4a);
    background: linear-gradient(to right, #373737 , #4a4a4a);
}
.card-list-item.card-style-blue .black{
  box-shadow: 0 0 70rpx #373737;
}
.fui-loading .text{
  background: #fff !important;
}
.card-blank{
  padding-top: 134rpx;
  text-align: center;
}
.card-blank image{
  width: 180rpx;
  height: 180rpx;
}
.card-blank .shadow{
  width: 124rpx;
  height: 26rpx;
  background: #ccc;
  border-radius: 50%;
  margin: 28rpx auto 40rpx;
}
.card-blank .text{
  font-size: 24rpx;
  color: #999;
}
.card-blank .cardbtn{
  width: 474rpx;
  height: 84rpx;
  border-radius: 42rpx;
  background: #c1a167;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 84rpx;
  margin: 60rpx auto 0;
}
</style>