<template>
<view>
<view class="page">
  <view class="card-swiper">
    <swiper @change="swiperchange" previous-margin="60rpx" next-margin="30rpx" :indicator-dots="indicatorDots" :autoplay="autoplay" interval="5000" duration="1000" :current="current">
      <block v-for="(item, index) in list" :key="index">
        <swiper-item>
          <view :class="'clubcard  ' + item.card_style + ' ' + (index == current ? 'big' : '')">
            <i class="icon-bg icox icox-huangguan-line"></i>
            <view class="content">
              <view class="icon"><image src="/static/images/icon-huangguan.png"></image></view>
              <view class="title">{{item.name}}</view>
              <view class="subtitle"><block v-if="item.startbuy == 0">{{item.validate}}</block><block v-else>享受{{item.rightsnum}}项特权</block></view>
              <view class="opencard" :data-id="item.id" :data-val="item.validate" :data-startbuy="item.startbuy" :data-stock="item.stock" @tap="submit">
                <block v-if="item.startbuy == 1">立即开通</block><block v-if="item.startbuy == -1">永久有效</block><block v-if="item.startbuy == 2">重新购买</block><block v-if="item.startbuy == 0">{{item.validate == '永久有效'? '永久有效' : '续费'}}</block>
              </view>
            </view>
          </view>
        </swiper-item>
      </block>
    </swiper>
  </view>
  <view class="card-group nomargin" style="padding-bottom: 36rpx;">
    <view class="card-title">会员特权</view>
    <view class="card-btn-group">
      <view class="card-btn-item" v-if="list[current].shipping == 1">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-mianfeibaoyou"></i>
          </view>
        </view>
        <view class="card-btn-text">免费包邮</view>
      </view>
      <view class="card-btn-item" v-if="list[current].member_discount == 1">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-zhekoutequan"></i>
          </view>
        </view>
        <view class="card-btn-text">折扣特权</view>
      </view>
      <view class="card-btn-item" v-if="list[current].is_card_coupon == 1">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-kaiqiasongquan"></i>
          </view>
        </view>
        <view class="card-btn-text">开卡送券</view>
      </view>
      <view class="card-btn-item" v-if="list[current].is_card_points ==1">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-kaiqiajifen"></i>
          </view>
        </view>
        <view class="card-btn-text">开卡送积分</view>
      </view>
      <view class="card-btn-item" v-if="list[current].is_month_coupon == 1">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-meiyuelingquan"></i>
          </view>
        </view>
        <view class="card-btn-text">每月领券</view>
      </view>
      <view class="card-btn-item" v-if="list[current].is_month_points == 1">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-meiyuejifen"></i>
          </view>
        </view>
        <view class="card-btn-text">每月积分</view>
      </view>

      <view class="card-btn-item">
        <view class="card-btn-icon">
          <view class="icon">
            <i class="icox icox-meiyuelingquan"></i>
          </view>
        </view>
        <view class="card-btn-text">敬请期待</view>
      </view>
    </view>
  </view>

  <view class="card-group" style="padding-bottom: 34rpx;" v-if="list[current].member_discount == 1">
    <view class="card-title">会员折扣</view>
    <view class="card-subtitle">会员可享受折扣价格</view>
    <view class="card-fiche gary">
      <view class="fiche-icon">
        <i class="icox icox-huiyuanzhuanxiangzhekou"></i>
      </view>
      <view class="fiche-inner">
        <view class="title">会员专享折扣</view>
      </view>
      <view class="fiche-btn">全场
        <span>{{list[current].discount_rate}}</span>折</view>
    </view>
  </view>

  <view class="card-group" v-if="list[current].is_card_coupon == 1 || list[current].is_card_points == 1">
    <view class="card-title">开卡赠送</view>
    <view class="card-subtitle">会员开卡即送优惠券、积分</view>
    <view class="coupon-list left">
      <view class="coupon-list-item" v-for="(idx, index) in list[current].card_coupon" :key="index">
        <view class="circle-l"></view>
        <view class="circle-r"></view>
        <view class="coupon-inner">
          <view class="price" v-if="idx.backtype == 0">￥<span>{{idx.deduct}}</span></view>
          <view class="price" v-if="idx.backtype == 1"><span>{{idx.discount}}</span>折</view>
          <view class="price" v-if="idx.backtype == 2"><span>返现</span></view>
          <view class="explain">{{idx.title2}}</view>
          <view class="condition" :style="(list[current].startbuy == 0 ? 'color: #666' : '')">{{ list[current].startbuy == 0 ? '已发放': idx.use_limit}}</view>
        </view>
      </view>
    </view>

    <view class="card-fiche golden" style="margin-top: 0;" v-if="list[current].is_card_points == 1">
      <view class="fiche-icon">
        <i class="icox icox-kaiqiajifen"></i>
      </view>
      <view class="fiche-inner">
        <view class="title">开通立享积分</view>
        <view class="subtitle">{{list[current].card_points}}
          <span>积分</span>
        </view>
      </view>
      <view class="fiche-btn">
        <view class="btn-submit border">{{list[current].startbuy == 0? '已发放':'开通送积分'}}</view>
      </view>
    </view>
  </view>

  <!--每月领取  开卡前样式 start  -->
  <view class="card-group" style="padding-bottom: 34rpx;" v-if="list[current].is_month_coupon == 1 || list[current].is_month_points==1">
    <view class="card-title">每月领取</view>
    <view class="card-subtitle">会员可每月领取优惠券、积分</view>
    <view class="coupon-list left" v-if="list[current].startbuy != 0">
      <view class="coupon-list-item" v-for="(ide, index) in list[current].month_coupon" :key="index">
        <view class="circle-l"></view>
        <view class="circle-r"></view>
        <view class="coupon-inner">
          <view class="price" v-if="ide.backtype == 0">￥<span>{{ide.deduct}}</span></view>
          <view class="price" v-if="ide.backtype == 1"><span>{{ide.discount}}</span>折</view>
          <view class="price" v-if="ide.backtype == 2"><span>返现</span></view>
          <view class="explain">{{ide.title2}}</view>
          <view class="condition">{{ide.use_limit}}</view>
        </view>
      </view>
    </view>
    <view class="coupon-list left" v-if="list[current].startbuy == 0">
      <view class="coupon-list-item already" v-for="(ide, index) in list[current].month_coupon" :key="index">
        <view class="circle-l"></view>
        <view class="circle-r"></view>
        <view class="coupon-inner">
          <view class="coupon-inner-media">
            <view class="price" v-if="ide.backtype == 0">￥<span>{{ide.deduct}}</span></view>
            <view class="price" v-if="ide.backtype == 1"><span>{{ide.discount}}</span>折</view>
            <view class="price" v-if="ide.backtype == 2"><span>返现</span></view>
            <view class="explain">
              <view class="title">{{ide.use_limit}}</view>
              <view class="subtitle">{{ide.title2}}</view>
            </view>
          </view>
          <view class="condition">
            <view :class="'btn-condition ' + (ide.isget_month_coupon ? 'gary' : '')" @tap="coupon" :data-issend="ide.isget_month_coupon" :data-id="list[current].id" :data-couponid="ide.id">{{ide.isget_month_coupon ? '已领取' : '立即领取'}}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="card-fiche golden" style="margin-top: 0;" v-if="list[current].is_month_points == 1">
      <view class="fiche-icon">
        <i class="icox icox-meiyuejifen"></i>
      </view>
      <view class="fiche-inner">
        <view class="title">会员每月领取积分</view>
        <view class="subtitle">{{list[current].month_points}}
          <span>积分</span>
        </view>
      </view>
      <view class="fiche-btn">
        <view class="btn-submit border" :data-id="list[current].id" :data-iscredit="list[current].isget_month_point" @tap="credit">{{list[current].startbuy == 0 ?(list[current].isget_month_point ? '已领取': '立即领取') : '每月领积分'}}</view>
      </view>
    </view>
  </view>
  <!--每月领取  开卡前样式 end  -->


  <!--使用说明 start  -->
  <view class="card-group" v-if="list[current].description != ''">
    <view class="card-title">使用说明</view>
    <view style="white-space: pre-line" class="card-explain">{{list[current].description}}</view>
  </view>
  <!--使用说明 end  -->
</view>

<!--提示弹窗 start  -->
<view class="card-modal" v-if="modal">
  <view class="inner">
    <view class="title">优惠券</view>
    <view class="text">每月1号发放，需手动领取</view>
    <view class="text">尊享会员每月可领取5张优惠券</view>
    <view class="text">优惠券种类包括折扣券与满减券</view>
    <view class="submit" @tap="submit">确定</view>
  </view>
</view>
<!--提示弹窗 end  -->



<!--未购买前  -->
<block v-if="list[current].startbuy != 0 && list[current].startbuy != -1">
  <view :class="'btn-footbar-bj ' + (isIpx?'iphonex':'')">
    <view class="item"></view>
    <view class="item"></view>
  </view>
  <view :class="'btn-footbar ' + (isIpx?'iphonex':'')">
    <view class="btn-text">￥<span>{{list[current].price}}</span>/{{list[current].card_validate}}</view>
    <view class="btn-submit" @tap="submit" :data-id="list[current].id" :data-startbuy="list[current].startbuy"><block v-if="list[current].startbuy == 1">立即开通</block><block v-if="list[current].startbuy == 2">重新购买</block><i class="icox icox-qianjin-copy"></i></view>
  </view>
</block>

<!-- 续费 -->
<view v-if="list[current].startbuy == 0" :data-id="list[current].id" @tap="submit" :data-startbuy="list[current].startbuy" :class="'renew ' + (isIpx?'iphonex':'')">续费</view>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      list: [],
      indicatorDots: false,
      autoplay: false,
      current: 0,
      modal: false
    };
  },

  onLoad: function (options) {
    var $this = this,
        args = {
      cate: options.cate
    };
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

    $this.setData({
      options: options
    });

    if (options.id) {
      args.id = options.id;
      args.page = options.page;
      $this.setData({
        id: options.id
      });
    }

    $this.getlist(args);
  },
  components: {},
  props: {},
  methods: {
    // submit: function(){
    //   this.setData({ modal: false})
    // },
    swiperchange: function (e) {
      this.setData({
        current: e.detail.current
      });
    },
    getlist: function (args) {
      var $this = this;
      core.get('membercard.detail', args, function (res) {
        if (res.error == 0) {
          if (args.id) {
            for (var i in res.list) {
              if (args.id == res.list[i].id) {
                $this.setData({
                  current: i
                });
              }
            }
          }

          $this.setData({
            list: res.list
          });
        }
      });
    },
    // 购买
    submit: function (e) {
      var data = e.currentTarget.dataset,
          $this = this;
      console.error(data);

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
    // 领取每月优惠券
    coupon: function (e) {
      var $this = this,
          data = e.currentTarget.dataset,
          current = $this.data.current,
          list = $this.data.list,
          options = $this.data.options,
          arg = {
        cate: options.cate
      };
      var args = {
        id: data.id,
        couponid: data.couponid
      };

      if (data.issend) {
        return;
      }

      if (options.id) {
        arg.id = options.id;
      }

      core.post('membercard.get_month_coupon', args, function (res) {
        if (res.error == 0) {
          foxui.toast($this, '领取成功');

          for (var i in list[current].month_coupon) {
            if (data.couponid == list[current].month_coupon[i].id) {
              list[current].month_coupon[i].isget_month_coupon = true;
              $this.setData({
                list: list
              });
            }
          }
        } else {
          foxui.toast($this, res.message);
        }
      });
    },
    // 领取每月积分
    credit: function (e) {
      var $this = this,
          data = e.currentTarget.dataset,
          list = $this.data.list,
          current = $this.data.current,
          options = $this.data.options,
          arg = {
        cate: options.cate
      };
      var args = {
        id: data.id
      };

      if (data.iscredit) {
        return;
      }

      core.post('membercard.get_month_point', args, function (res) {
        if (res.error == 0) {
          foxui.toast($this, '领取成功');
          list[current].isget_month_point = 1;
          $this.setData({
            list: list
          });
        } else {
          foxui.toast($this, res.message);
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
.page{
  padding-bottom: 166rpx;
}
.card-swiper{
  width: 100%;
  height: 440rpx;
  background: #fff;
}
 .card-swiper swiper{
  width: 100%;
  height: 100%;
} 

.clubcard{
  width: 95%;
  height: 320rpx;
  border-radius: 15rpx;
  margin-top: 54rpx; 
  overflow: hidden;
  box-sizing: border-box;
  padding: 20rpx;
  text-align: center;
  position: relative
}
.clubcard.big{
  width: 95%;
  height: 358rpx;
  margin-top: 36rpx; 
  overflow: hidden;
}
.clubcard .content{
  position: relative;
  width: 100%;
  height: 100%;
}
.clubcard .content .icon image{
  width: 58rpx;
  height: 58rpx;
}
.clubcard .content:after{
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 1rpx solid #000;
  opacity: 0.1;

}
.clubcard .icon-bg{
  position: absolute;
  font-size: 204rpx;
  color: #000;
  opacity: 0.1;
  right: -55rpx;
  bottom: -66rpx

}
.clubcard .icon{
  padding-top: 26rpx;
}
.clubcard .icon i{
  font-size: 52rpx;
  color: #fff;
}
.clubcard .title{
  color: #fff;
  font-size: 46rpx;
  opacity: 0.8;
  line-height: 1;
  margin-top: 10rpx;
}
.clubcard .subtitle{
  color: #fff;
  font-size: 30rpx;
  opacity: 0.8;
  line-height: 1;
  margin-top: 25rpx;
}
.clubcard .opencard{
  color: #c1a167;
  font-size: 32rpx;
  width: 208rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background: #333;
  margin: 0 auto;
  line-height: 64rpx;
  margin-top: 40rpx;
  position: relative;
  z-index: 999;
}

.card-style-golden{
    background: -webkit-linear-gradient(left, #c1a167 , #e9d5aa);
    background: -o-linear-gradient(right, #c1a167 , #e9d5aa);
    background: -moz-linear-gradient(right, #c1a167 , #e9d5aa);
    background: linear-gradient(to right, #c1a167 , #e9d5aa);
    box-shadow: 0 26px 40px -24px rgba(193, 161, 103, 0.6);
}
.card-style-erythrine{
    background: -webkit-linear-gradient(left, #745757 , #966d6d);
    background: -o-linear-gradient(right,  #745757 , #966d6d);
    background: -moz-linear-gradient(right,  #745757 , #966d6d);
    background: linear-gradient(to right,  #745757 , #966d6d);
    box-shadow: 0 26px 40px -24px rgba(116, 87, 87, 0.6);
}
.card-style-gray{
    background: -webkit-linear-gradient(left, #434247 , #7a7985);
    background: -o-linear-gradient(right, #434247 , #7a7985);
    background: -moz-linear-gradient(right, #434247 , #7a7985);
    background: linear-gradient(to right, #434247 , #7a7985);
}
.card-style-gray .shadow{
  box-shadow: 0 0 70rpx #434247;
}
.card-style-brown{
    background: -webkit-linear-gradient(left, #736e6c , #978c8c);
    background: -o-linear-gradient(right, #736e6c , #978c8c);
    background: -moz-linear-gradient(right, #736e6c , #978c8c);
    background: linear-gradient(to right, #736e6c , #978c8c);
}
.card-style-brown .shadow{
  box-shadow: 0 0 70rpx #736e6c;
}
.card-style-blue{
    background: -webkit-linear-gradient(left, #576074 , #6d7b96);
    background: -o-linear-gradient(right, #576074 , #6d7b96);
    background: -moz-linear-gradient(right, #576074 , #6d7b96);
    background: linear-gradient(to right, #576074 , #6d7b96);
}
.card-style-blue .shadow{
  box-shadow: 0 0 70rpx #576074;
}
.card-style-black{
    background: -webkit-linear-gradient(left, #373737 , #4a4a4a);
    background: -o-linear-gradient(right, #373737 , #4a4a4a);
    background: -moz-linear-gradient(right, #373737 , #4a4a4a);
    background: linear-gradient(to right, #373737 , #4a4a4a);
}
.card-style-blue .black{
  box-shadow: 0 0 70rpx #373737;
}













.card-group{
  background: #fff;
  padding-top: 40rpx;
  margin-top: 20rpx;
}
.card-group.nomargin{
  margin-top: 0;
}
.card-title{
  height: 48rpx;
  line-height: 48rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  text-align: center;
  position: relative;
  margin-bottom: 20rpx;
}
.card-subtitle{
  font-size: 22rpx;
  color: #bbb;
  text-align: center;
}
.card-title:before{
  content: "";
  position: absolute;
  width: 80rpx;
  height: 2rpx;
  top: 50%;
  margin-top: -1rpx;
  left: 205rpx;
  background: linear-gradient(to right, #fff, #c1a167);
}
.card-title:after{
  content: "";
  position: absolute;
  width: 80rpx;
  height: 2rpx;
  top: 50%;
  margin-top: -1rpx;
  right: 205rpx;
  background: linear-gradient(to right, #c1a167, #fff);
}

.card-btn-group{
  padding: 0 20rpx;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.card-btn-group .card-btn-item{
  width: 25%;
  height: 176rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-btn-group .card-btn-item .card-btn-icon .icon{
  width: 108rpx;
  height: 108rpx;
  background: rgba(193, 161, 103, 0.2);
  display: inline-block;
  border-radius: 50%;
  margin-bottom: 24rpx;
  text-align: center;
  line-height: 108rpx;
}
.card-btn-group .card-btn-item .card-btn-icon i{
  font-size: 50rpx;
  color: #c1a167;
}
.card-btn-group .card-btn-item .card-btn-text{
  font-size: 22rpx;
  color: #999;
}

.card-getmore{
  text-align: center;
  font-size: 24rpx;
  color: #c1a167;
  line-height: 70rpx;
  padding-bottom: 10rpx;
}
.card-getmore i{
  font-size: 20rpx;
  margin-left: 10rpx;
}
.card-fiche{
  width: 710rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin: 20rpx auto 0;
  display: flex;
}
.card-fiche.gary{
  background: #393939;
}
.card-fiche.golden{
  background: linear-gradient(to right, #c1a167, #ead5aa);
}
.card-fiche .fiche-icon{
  width: 168rpx;
  position: relative;
  overflow: hidden;
}
.card-fiche .fiche-inner{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-fiche .fiche-btn{
  width: 260rpx;
}
.card-fiche.gary .fiche-inner{
  font-size: 32rpx;
  font-weight: bold;
  color: #c1a167;
}
.card-fiche.gary .fiche-btn{
  font-size: 32rpx;
  font-weight: bold;
  color: #c1a167;
  line-height: 140rpx;
  height: 100%;
  text-align: right;
  box-sizing: border-box;
  padding-right: 20rpx;
}
.card-fiche.gary .fiche-btn span{
  font-size: 72rpx;
}

.card-fiche.golden .fiche-inner{
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.card-fiche.golden .fiche-inner .subtitle{
  font-size: 46rpx;
  font-weight: bold;
  color: #000;
  opacity: 0.5;
  margin-top: 10rpx;
}
.card-fiche.golden .fiche-inner .subtitle span{
  font-size: 24rpx;
}
.card-fiche.golden .fiche-btn{
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* margin-right: 24rpx; */
  font-size: 22rpx;
}
.card-fiche.golden .fiche-btn .btn-submit{
  width: 174rpx;
  height: 50rpx;
  text-align: center;
  line-height: 48rpx;
  border-radius: 27rpx;
  display: inline-block;
}
.card-fiche.golden .fiche-btn .btn-submit.border{
  border: 1px solid #333;
}
/*弹窗  */
.card-modal{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6)
}
.card-modal .inner{
  width: 570rpx;
  height: 422rpx;
  border-radius: 15rpx;
  background: #fff;
  margin: 350rpx auto 0;
  padding: 48rpx;
  box-sizing: border-box;
}
.card-modal .inner .title{
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  margin-bottom: 20rpx;
}
.card-modal .inner .text{
  font-size: 28rpx;
  color: #666;
  line-height: 50rpx;
  position: relative;
  padding-left: 30rpx;
}
.card-modal .inner .text::before{
  content: "";
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: #666;
  border-radius: 50%;
  left: 10rpx;
  top: 50%;
  margin-top: -4rpx;
}
.card-modal .inner .text.nobefore::before{
  display: none;
}
.card-modal .inner .submit{
  font-size: 28rpx;
  color: #fff;
  line-height: 84rpx;
  margin: 46rpx auto 0;
  width: 474rpx;
  height: 84rpx;
  background: linear-gradient(to right, #c1a167 , #e9d5aa);
  text-align: center;
  border-radius: 42rpx;
}
.card-group .card-explain{
  font-size: 22rpx;
  color: #666;
  line-height: 40rpx;
  padding: 0 24rpx;
}
.card-group .card-explain:last-child{
  padding-bottom: 50rpx;
}


.btn-footbar-bj{
  height: 98rpx;
  position: fixed;
  left: -50rpx;
  right: -50rpx;
  bottom: 0;
  background: #c1a168;
  display: flex;
  transform: skewX(-20deg);
}
.btn-footbar-bj.iphonex,.btn-footbar.iphonex{
  bottom: 68rpx;
}
.renew{
  height: 98rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #c1a168;
  text-align: center !important;
  line-height: 98rpx;
  color: #fff;
}
.renew.iphonex{
  bottom: 68rpx;
}
.btn-footbar-bj .item{
  flex: 1;
}
.btn-footbar-bj .item:first-child{
  background: #333;
}
.btn-footbar{
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  display: flex;
}
.btn-text{
  color: #c1a168;
  font-size: 28rpx;
  font-weight: bold;
  width: 50%;
  text-align: center;
  line-height: 82rpx;
}
.btn-text span{
  font-size: 46rpx;
}
.btn-footbar .btn-submit{
  color: #fff;
  font-size: 34rpx;
  width: 50%;
  text-align: center;
  line-height: 82rpx;
}
.btn-footbar .btn-submit i{
  margin-left: 4rpx;
  font-size: 28rpx;
}
.fiche-icon .icox-kaiqiajifen,.fiche-icon .icox-meiyuejifen,.fiche-icon .icox-huangguan-line{
  font-size: 150rpx;
  color: 000;
  opacity: 0.1;
}
.fiche-icon .icox-huangguan-line{
  position: absolute;
  bottom: -57rpx;
  left: -42rpx;
  font-size: 190rpx;
}
.fiche-icon .icox-huiyuanzhuanxiangzhekou{
  font-size: 190rpx;
  position: absolute;
  left: -60rpx;
  bottom: -76rpx;
  opacity: 0.1;
  color: #fff;
}


/*优惠券  */
.card-group .coupon-list{
  display: flex;
  flex-wrap: wrap;
  padding: 28rpx 20rpx 0;
}
.card-group .coupon-list.left{
  flex-wrap: nowrap;
  overflow-x: scroll;
}
.coupon-list-item{
  position: relative;
  overflow: hidden;
  width: 349rpx;
  height: 194rpx;
  text-align: center;
  margin-bottom: 20rpx;
}
.card-group .coupon-list.left .coupon-list-item{
  flex-shrink: 0;
  margin-right: 15rpx;
}
.coupon-list-item:nth-child(odd){
margin-right: 15rpx;
}
.coupon-list-item .coupon-inner{
  border: 1rpx solid #ccc;
  width: 345rpx;
  height: 190rpx;
  border-radius: 15rpx;
}
.coupon-inner-media{
  display: flex;
  padding-left: 36rpx;
}
.coupon-inner-media .price{
  line-height: 100rpx;
}

.coupon-list-item .price{
  font-size: 20rpx;
  font-weight: bold;
  color: #c1a167;
  padding-top: 20rpx;
}
.coupon-list-item .price span{
  font-size: 48rpx;
}

.coupon-list-item .explain{
  font-size: 22rpx;
  color: #666;
  line-height: 1;
  padding-top: 5rpx;
}
.coupon-inner-media .explain{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: 20rpx;
  font-size: 24rpx;
  color: #000;
  font-weight: bold;
}
.coupon-inner-media .explain .subtitle{
  color: #666;
  font-size: 22rpx;
  margin-top: 10rpx;
  font-weight: 400;
}
.coupon-list-item.already .condition .btn-condition{
  width: 174rpx;
  height: 48rpx;
  line-height: 48rpx;
  margin: 10rpx auto 0;
  color: #fff;
  border-radius: 24rpx;
  background: linear-gradient(to right, #c1a167 , #e9d5aa);
}
.coupon-list-item.already .condition .btn-condition.gary{
  background: #bbb;
}
.coupon-list-item .condition{
  height: 68rpx;
  line-height: 68rpx;
  font-size: 24rpx;
  color: #333;
  position: absolute;
  bottom: 0;
  left: 24rpx;
  right: 24rpx;
  border-top: 1rpx dashed #ccc;
}
.coupon-list-item .circle{
  position: relative;
}
.coupon-list-item .circle-l{
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  border: 1rpx solid #ccc;
  left: -11rpx;
  bottom: 60rpx;
  background: #fff;
}
.coupon-list-item .circle-r{
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  border: 1rpx solid #ccc;
  right: -11rpx;
  bottom: 60rpx;
  background: #fff;
}
</style>