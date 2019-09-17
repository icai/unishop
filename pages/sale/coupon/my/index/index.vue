<template>
<view class="page header">
    <view class="fui-tab fixed fui-tab-danger">
        <view :class="'item ' + ( cate==''?'active':'' )" @tap="myTab" data-cate>未使用</view>
        <view :class="'item ' + ( cate=='used'?'active':'' )" @tap="myTab" data-cate="used">已使用</view>
        <view :class="'item ' + ( cate=='past'?'active':'' )" @tap="myTab" data-cate="past">已过期</view>
    </view>

    <navigator class="btn btn-default-o block" hover-class="none" url="/pages/sale/coupon/index/index" open-type="redirect" v-if="closecenter!=1">
        <text class="icox icox-gifts"></text>
        <text>赶紧去领券中心看看更多优惠券~</text>
    </navigator>

    <view class="coupon-container coupon-index-list" v-if="total>0">
        <view v-for="(item, index) in list" :key="index" :class="'coupon-index-list-a ' + item.color" @tap="jump" :data-id="( item.check==0?item.id:'' )">
            <!-- <view class="fui-list coupon-list">
                <i class="coupon-top-i"></i>
                <i class="coupon-bot-i"></i>
                <view class="coupon-ling">
                    <image src="{{ approot }}template/mobile/default/static/images/coupon/{{ item.imgname }}.png" />
                </view>
                <view class="fui-list-inner coupon-index-list-left">
                    <b class="tagtitle">{{ item.tagtitle }}</b>
                    <div class="coupon-index-list-info fui-list noclick">
                        <div class="fui-list-media">
                            <image src="{{ item.thumb||approot+'template/mobile/default/static/images/coupon/coupon-list-img.png' }}" />
                        </div>
                        <div class="fui-list-inner">
                            <view class="h3">{{ item.couponname }}</view>
                            <view class="coupon-full">
                                {{ item.title2 }}
                            </view>

                            <view class="coupon-time" wx:if="{{ item.timestr==0 }}">永久有效</view>
                            <view class="coupon-time" wx:elif="{{ item.timestr==1 }}">即 {{ item.gettypestr }} 日内 {{ item.timedays }} 天有效</view>
                            <view class="coupon-time" wx:else>有效期 {{ item.timestr }}</view>
                        </div>
                    </div>
                </view>
                <view class="fui-list-media coupon-index-list-right">
                    <view class="forth0 circle coupon-list-canvas"></view>
                    <view class="coupon-list-ling" wx:if="{{ item.check==2 }}">已过期</view>
                    <view class="coupon-list-ling" wx:elif="{{ item.check==1 }}">已使用</view>
                    <view class="coupon-list-ling" wx:else>立即使用</view>
                </view>
            </view> -->
             <a :class="'coupon-item  ' + ( item.isdisa?'disa':item.color )" href="javascript:;">
				<view class="coupon-dots">
					<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
				</view>
				<view class="coupon-type">{{ item.tagtitle }}</view>
				<view class="coupon-left">
					<view class="title"><block v-if="item.backtype==0"><text>{{ item.deduct }}</text></block>
                                <block v-else-if="item.backtype==1"><text>{{ item.discount }}</text>折</block>
                                <block v-else-if="item.backtype==2">
                                    <block v-if="item.backmoney&&item.backmoney>0">送<text>{{ item.backmoney }}</text>元余额</block>
                                    <block v-else-if="item.backcredit&&item.backcredit>0">送<text>{{ item.backcredit }}</text>积分</block>
                                    <block v-else-if="item.backredpack&&item.backredpack>0">送<text>{{ item.backredpack }}</text>元红包</block>
                                </block></view>
					<view class="subtitle"> {{ item.title2 }}</view>
				</view>
				<view class="coupon-right">
					<view class="title">{{ item.couponname }}</view>
					<view class="subtitle"></view>
					<view class="subtitle light">{{item.lastratio?'剩余'+item.lastratio+'%':'' }}</view>
					<view class="usetime">
            <view class="text" v-if="item.timestr==0">永久有效</view>
            <view class="text" v-else-if="item.timestr==1">即 {{ item.gettypestr }} 日内 {{ item.timedays }} 天有效</view>
            <view class="text" v-else>有效期 {{ item.timestr }}</view>
            <view class="usebtn" v-if="item.check==2">已过期</view>
                    <view class="usebtn" v-else-if="item.check==1">已使用</view>
                    <view class="usebtn" v-else>立即使用</view>
					</view>
				</view>
			</a>
        </view>

    </view>

    <!--数据显示-->
    <view class="fui-loading empty" v-if="loaded && list.length>0">
        <view class="text">没有更多了</view>
    </view>
    <view class="fui-loading empty" v-if="total<=0 && !loading">
        <view class="text">没有数据</view>
    </view>


</view>
</template>

<script>
/**
 *
 * coupon\my\index\index.js
 *
 * @create 2017-02-07
 * @author 晚秋
 *
 * @update  晚秋 2017-02-07
 *
 */
var app = getApp();
var core = app.requirejs('core');

export default {
  data() {
    return {
      cate: '',
      page: 1,
      loading: false,
      loaded: false,
      list: [],
      approot: app.globalData.approot
    };
  },

  onReachBottom: function () {
    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.getList();
  },
  onLoad: function (options) {
    this.getList();
  },
  components: {},
  props: {},
  methods: {
    myTab: function (e) {
      var $this = this;
      var cate = core.pdata(e).cate;
      $this.setData({
        cate: cate,
        page: 1,
        list: []
      });
      $this.getList();
    },
    getList: function () {
      var $this = this;
      core.loading();
      this.setData({
        loading: true
      });
      core.get('sale/coupon/my/getlist', {
        page: this.page,
        cate: this.cate
      }, function (ret) {
        var data = {
          loading: false,
          total: ret.total,
          pagesize: ret.pagesize,
          closecenter: ret.closecenter
        };

        if (ret.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(ret.list);

          if (ret.list.length < ret.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
        core.hideLoading();
      });
    },
    jump: function (e) {
      var id = core.pdata(e).id;

      if (id > 0) {
        wx.navigateTo({
          url: '/pages/sale/coupon/my/detail/index?id=' + id
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
@import "../../../../../static/css/coupon.css";
.btn image {
    height: 42rpx;
    width: 42rpx;
    vertical-align: middle;
    margin-left: 20rpx
}
.btn text {
    vertical-align: middle;
}
</style>