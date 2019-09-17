<template>
<view>
<view class="page navbar">
  <view class="goods-detail-goods">
  <!--轮播图  -->
    <swiper class="index-adcs-sqiper" indicator-dots="true" circular="true" :style="'width:100%;height:' + advHeight + 'rpx;'">
          <block v-for="(item, index) in goods.thumbs" :key="index">
              <swiper-item>
                  <image :data-url="item" :src="item" class="goodsadvimg"></image> 
              </swiper-item>
          </block>
      </swiper>
      <!--倒计时  -->
      <view class="countDown">
        <text v-if="istime == 0">{{ istimeTitle }}</text>
        <text v-else-if="istime == 1">{{ istimeTitle }}：<text v-for="(item, index) in time" :key="index" class="number">{{item}}{{index==0?'天': ''}}{{index==1?'时': ''}}{{index==2?'分': ''}}{{index==3?'秒': ''}}</text></text>
        <text v-else="istime == 2">{{ istimeTitle }}</text>
        
      </view>
      <!--标题价格  -->
      <view class="fui-cell-group fui-detail-group" style="margin-top:0">
        <view class="fui-cell">
            <view class="fui-cell-text name">
            <image src="/static/images/label.png"></image>
                <text selectable="true">{{goods.title}}</text>
            </view>
             <navigator :url="'../rule/rule?id=' + goods.id + '&mid=' + goods.mid" class="fui-cell-remark rule" style="margin-left: 60rpx;">
              <i style="font-size:42rpx;color: #fd5555;" class="icox icox-activity"></i>
              <view style="font-size: 20rpx;color: #666;margin-top:-6rpx;">规则</view>
            </navigator> 
        </view>
        <view class="subtitle">{{ goods.subtitle }}</view>
        <block>
            <view class="fui-cell price" v-if="goods.type == 1">
              <text style="display:inline-block;line-height:48rpx">底价</text>
              <text class="miniprice" selectable="true">￥{{ goods.end_price }}</text>
              <text class="original_price">￥{{ goods.start_price }}</text>
            </view>
            <view class="fui-cell price" v-else-if="goods.type == 0">
              <text style="display:inline-block;line-height:48rpx">原价</text>
              <text class="miniprice" selectable="true">￥{{ goods.start_price }}</text>
              <text class="original_price" :style="'color:' + goods['custom']['cutmore_color']">￥{{ goods.custom.cutmore }}</text>
            </view>
        </block>
        <block>
            <view class="fui-cell">
                <view class="fui-cell-text number">
                    已有{{ goods.act_times }}人参与砍价
                </view>
            </view>
        </block>
      </view>
      <!--砍价流程  -->
      <view class="detail-rule">
        <view class="detail-rule-top">
          砍价流程
        </view>
        <view class="detail-rule-bottom">
          <view class="step active">
            <view class="num">1</view>
            <view class="text">选择心仪商品</view>
          </view>
           <view class="step">
            <view class="num">2</view>
            <view class="text">邀请好友砍价</view>
          </view>
           <view class="step">
            <view class="num">3</view>
            <view class="text">砍到底价后支付</view>
          </view>
        </view>
      </view>
      <!--产品详情  -->
      <view class="fui-cell-group">
            <view class="fui-cell">
                <view class="fui-cell-info">商品详情</view>
            </view>
        </view>
       <view class="goods-detail-info">
            <view class="wxParse">
                <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
            </view>
        </view>
      <!--底部按钮  -->
      <view :class="'fui-navbar ' + iphonexnavbar">
        <navigator class="nav-item" open-type="switchTab" @tap="backhome">
          <view class="icox icox-homepage"></view>
          <view class="label">首页</view>
        </navigator>
        <navigator class="nav-item" url="../act/act">
          <view class="icox icox-people"></view>
          <view class="label">我的</view>
        </navigator>
        <navigator class="nav-item btn buybtn" :url="'/pages/order/create/index?id=' + goods.goodsid">直接购买</navigator>
        <!-- <navigator wx:if="{{ goods.swi == 0 && !goods.act_swi.id }}" class='nav-item btn bargainBuy' url="/pages/bargain/bargain/bargain?id={{ goods.id }}&mid={{ goods.mid }}" >立即砍价</navigator> -->
        <view v-if="goods.swi == 0" class="nav-item btn bargainBuy" @tap="act_swi ? 'alreadyHave' : 'goJoin'">立即砍价</view>
        <view v-if="goods.swi == 1" class="nav-item btn noBargain">尚未开始</view>
        <view v-if="goods.swi == 2" class="nav-item btn noBargain">已经结束</view>
        <view v-if="goods.swi == 3" class="nav-item btn noBargain">库存不足</view>
      </view>
      <view :class="(isIpx?'fui-iphonex-button':'')"></view>
      <!--砍价弹窗  -->
      <view class="layer" v-if="layer">
          <!--砍价成功提示  -->
          <view class="content">
            <view class="icox icox-close" @tap="closeLayer"></view>
            <image src="/static/images/success.png"></image>
            <view style="line-height:82rpx;font-size:28rpx">恭喜你成功砍掉</view>
            <view style="line-height:70rpx;font-size:66rpx;font-weight:bold;color:#ff5555">4.56元</view>
            <view class="layerbtn">知道了</view>
          </view> 
      </view>

       <view class="layer" v-if="upper_limit">
          <!--活动提示  -->
            <view class="showModal">
            <view class="inner">{{ upper_limitTitle }}</view>
            <view class="operate flex">
              <view class="flex1" @tap="closeUpper">取消</view>
              <view class="flex1" @tap="affirmUpper">确定</view>
            </view>
          </view>  
      </view>

       <view class="layer" v-if="error_hint">
          <!--错误提示  -->
            <view class="showModal">
            <view class="inner">{{ error_hint_title }}</view>
            <view class="operate flex">
              <view class="flex1" @tap="closeError">确定</view>
            </view>
          </view>  
      </view>
  </view>
</view>
</view>
</template>

<script>
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      id: '',
      layer: false,
      goods: {},
      istimeTitle: '',
      timer: 0,
      upper_limit: false,
      upper_limitTitle: '',
      act_swi: '',
      error_hint: false,
      error_hint_title: '',
      advHeight: 1
    };
  },

  onLoad: function (options) {
    var $this = this;
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

    core.get('bargain/get_detail', options, function (ret) {
      $this.setData({
        goods: ret.list
      });
      $this.setData({
        id: ret.list.id,
        act_swi: ret.list.act_swi
      });
      parser.wxParse('wxParseData', 'html', ret.list.content, $this, '0');
      $this.countDown(ret.list.start_time, ret.list.end_time, 'istime');

      if (ret.list.isStart == 1) {
        clearInterval($this.data.timer);
        var timer = setInterval(function () {
          $this.countDown(ret.list.start_time, ret.list.end_time, 'istime');
        }, 1000);
        $this.setData({
          timer: timer
        });
      }
    });
    wx.setNavigationBarTitle({
      title: '砍价商品详情' //页面标题为路由参数

    });
  },
  components: {},
  props: {},
  methods: {
    //商品详情轮播图按照第一张图片显示
    imageLoad: function (e) {
      let h = e.detail.height,
          w = e.detail.width,
          height = Math.floor(750 * h / w);

      if (h == w) {
        this.setData({
          advHeight: 750
        });
      } else {
        this.setData({
          advHeight: height
        });
      }
    },
    cutPrice: function () {
      this.setData({
        layer: true
      });
    },
    closeLayer: function () {
      this.setData({
        layer: false
      });
    },

    /*倒计时js start
    timestart----开始时间
    timeend----结束时间
    type-------类型
    */
    countDown: function (timestart, timeend, type) {
      var now = parseInt(Date.now() / 1000);
      var endDate = timestart > now ? timestart : timeend;
      var leftTime = endDate - now;
      var leftsecond = parseInt(leftTime);
      var day = Math.floor(leftsecond / (60 * 60 * 24));
      var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
      var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
      var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
      var time = [day, hour, minute, second];
      this.setData({
        time: time
      });

      if (type = 'istime') {
        var istimeTitle = '';

        if (timestart > now) {
          istimeTitle = '未开始';
          this.setData({
            istime: 0
          });
        } else if (timestart <= now && timeend > now) {
          istimeTitle = '剩余时间';
          this.setData({
            istime: 1
          });
        } else {
          istimeTitle = '活动已经结束，下次早点来~';
          this.setData({
            istime: 2
          });
        }

        this.setData({
          istimeTitle: istimeTitle
        });
      }
    },
    backhome: function () {
      wx.switchTab({
        url: '/pages/index/index'
      });
    },
    goJoin: function () {
      app.checkAuth();
      var $this = this;
      var id = $this.data.id;
      core.get('bargain/join', {
        id: id
      }, function (result) {
        if (result.error == 1) {
          $this.setData({
            error_hint: true,
            error_hint_title: result.message
          });
          return;
        } else if (result.error == 0) {
          if (result.initiate == 1) {
            $this.setData({
              upper_limit: true,
              upper_limitTitle: '您已经发起过一次本商品的砍价活动,是否立即查看？',
              act_swi: result.bargainid
            });
            return;
          }

          wx.navigateTo({
            url: '../bargain/bargain?id=' + result.id + '&mid=' + result.mid
          });
        }
      });
    },
    alreadyHave: function () {
      app.checkAuth();
      var $this = this;
      $this.setData({
        upper_limit: true,
        upper_limitTitle: '您已经发起过一次本商品的砍价活动,是否立即查看？'
      });
    },
    closeUpper: function () {
      this.setData({
        upper_limit: false
      });
    },
    affirmUpper: function () {
      var $this = this;
      var act_id = $this.data.act_swi;
      wx.navigateTo({
        url: '../bargain/bargain?id=' + act_id
      });
    },
    closeError: function () {
      this.setData({
        error_hint: false
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
.goodsadvimg{
  width: 100%;
  height: 100%;
}
.name image{
  display: inline-block;
  width: 50rpx;
  height: 24rpx;
  vertical-align: middle;
  margin-top: -5rpx;
  margin-right: 10rpx
}
.countDown{
  height: 52rpx;
  width: 100%;
  background: -moz-linear-gradient(left, #fe8a54 0%, #f94543 100%);
  background: -webkit-linear-gradient(left, #fe8a54 0%,#f94543 100%);
  background: -o-linear-gradient(left, #fe8a54 0%,#f94543 100%);
  background: -ms-linear-gradient(left, #fe8a54 0%,#f94543 100%);
  background: linear-gradient(to right, #fe8a54 0%,#f94543 100%);
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#fffe8a54, endColorstr=#fff94543,gradientType='1');
  text-align:center;
  color:#fff;
  line-height:52rpx;
  font-size:24rpx
}
.fui-cell-group .fui-cell .fui-cell-remark.rule::after{
  display: none
}
.fui-cell-group .fui-cell:before{
  display: none
}
.fui-cell-group .fui-cell .original_price{
  float: right;
  text-decoration: line-through;
  font-size: 22rpx;
  color: #999;
  margin-top: 20rpx
}
.fui-cell-group .fui-cell{
  padding: 12rpx 24rpx;
}
.fui-cell-group .fui-cell.price{
  color: #ff5555;
  font-size: 20rpx;
  display:block;
}
.fui-cell-group .fui-cell.price .miniprice{
  font-size: 44rpx;
  font-weight: bold;
  display: inline-block;
  vertical-align:bottom;
}
.fui-cell-group .fui-cell .fui-cell-text{
  color: #333;
}
.fui-cell-group .fui-cell .fui-cell-text.number{
  font-size: 24rpx;
  color: #666
}
.detail-rule{
  background: #fff;
  margin-top: 20rpx;
  padding: 0 24rpx;
  height: 200rpx;
}
.detail-rule .detail-rule-top{
  height: 80rpx;
  line-height: 80rpx;
  font-size: 24rpx;
  border-bottom: 1px solid #ededed
}
.detail-rule .detail-rule-bottom{
  padding-top: 26rpx;
  font-size: 24rpx;
  color: #666;
}
.detail-rule .detail-rule-bottom .step{
  float: left;
  width: 230rpx;
  text-align: center
}
.detail-rule .detail-rule-bottom .step.active {
  color: #ff5555;
}
.detail-rule .detail-rule-bottom .step.active .num{
  background: #ff5555;
  color: #fff
}
.detail-rule .detail-rule-bottom .num{
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #ccc;
  text-align: center;
  font-size: 22rpx;
  line-height: 30rpx;
  position: relative;
  display: inline-block;
  margin-bottom: 20rpx;
  color: #fff;
}
.detail-rule .detail-rule-bottom .num:before{
  position: absolute;
  content: '';
  width: 200rpx;
  top: 14rpx;
  left: 30rpx;
  border-bottom: 1px dashed #eee;
}
.detail-rule .detail-rule-bottom .num:after{
  position: absolute;
  content: '';
  border: 6rpx solid transparent;
  border-left: 6rpx solid #ccc;
  top: 8rpx;
  left: 130rpx;
}
.detail-rule .detail-rule-bottom .step:last-child .num:before,.detail-rule .detail-rule-bottom .step:last-child .num:after{
  display: none
}
.fui-navbar .nav-item .icox{
  font-size: 50rpx;
}
.nav-item.buybtn{
  background: #fe9501;
}
.nav-item.bargainBuy{
  background: #ff5654;
}
.nav-item.noBargain{
  background:#f2f2f2;
  color: #b2b2b2 !important;
  border: 1px solid #f2f2f2;
}
.layer{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999
}
.layer .content{
  width:420rpx;
  height: 460rpx;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -210rpx;
  margin-top: -230rpx;
  border-radius: 10rpx;
  text-align: center
}
.layer .content .icox-close{
  position: absolute;
  right: 10rpx;
  top: 0;
  line-height: 52rpx;
  font-size: 24rpx;
  display: block
}
.layer .content image{
  width: 86rpx;
  height: 103rpx;
  margin-top: 56rpx
}
.layer .content .layerbtn{
  width: 300rpx;
  background: #ff5555;
  line-height: 72rpx;
  border-radius: 72rpx;
  color: #fff;
  margin: 0 auto;
  margin-top: 36rpx;
}
.layer .showModal{
  width: 560rpx;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -280rpx;
  margin-top: -196rpx;
}
.layer .showModal .inner{
  padding:58rpx 52rpx;
  font-size: 28rpx;
  line-height: 36rpx;
  border-bottom: 1px solid #eee
}
.layer .showModal .operate{
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
   font-size: 28rpx;
}
.layer .showModal .operate view:last-child{
  border-left: 1px solid #eee;
  color: #00c201;
}
.subtitle{
  font-size:24rpx;
  color:#999;
  padding:0 24rpx;
}
</style>