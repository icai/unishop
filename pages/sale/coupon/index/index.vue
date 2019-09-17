<template>
<view class="page">
    <scroll-view class="fui-tab-scroll" scroll-x="true">
        <text :class="'item ' + ( cateid==0?'active':'' )" data-cateid="0" @tap="bindTab">全部优惠券</text>
        <text v-for="(item, index) in cates" :key="index" :class="'item ' + ( cateid==item.id?'active':'' )" :data-cateid="item.id" @tap="bindTab">{{ item.name }}</text>
    </scroll-view>

    <view class="coupon-container coupon-index-list" v-if="total>0">
        <view v-for="(item, index) in list" :key="index" class="coupon-index-list-a" @tap="jump" :data-id="( item.isdisa?'':item.id )">
             <!-- <view class="fui-list coupon-list">
                <i class="coupon-top-i"></i>
                <i class="coupon-bot-i"></i>
                <view class="coupon-ling" wx:if="{{ item.isdisa }}">
                    <image src="{{ approot }}template/mobile/default/static/images/coupon/end.png" />
                </view>
                <view class="fui-list-inner coupon-index-list-left">
                    <b class="tagtitle">{{ item.tagtitle }}</b>
                    <view class="coupon-index-list-info fui-list noclick">
                        <view class="fui-list-media">
                            <image src="{{ item.thumb||approot+'template/mobile/default/static/images/coupon/coupon-list-img.png' }}" />
                        </view>
                        <view class="fui-list-inner">
                            <view class="h3">{{ item.couponname }}</view>
                            <view class="coupon-full">
                                <block wx:if="{{ item.backtype==0 }}"><text>{{ item.deduct }}</text></block>
                                <block wx:elif="{{ item.backtype==1 }}"><text>{{ item.discount }}</text>折</block>
                                <block wx:elif="{{ item.backtype==2 }}">
                                    <block wx:if="{{ item.backmoney&&item.backmoney>0 }}">送<text>{{ item.backmoney }}</text>元余额</block>
                                    <block wx:elif="{{ item.backcredit&&item.backcredit>0 }}">送<text>{{ item.backcredit }}</text>积分</block>
                                    <block wx:elif="{{ item.backredpack&&item.backredpack>0 }}">送<text>{{ item.backredpack }}</text>元红包</block>
                                </block>
                                {{ item.title2 }}
                            </view>
                            <view class="coupon-time">{{ item.usestr }}</view>
                        </view>
                    </view>
                </view>
                <view class="fui-list-media coupon-index-list-right">
                    <view class="forth0 circle coupon-list-canvas">
                        <block wx:if="{{ !item.isdisa }}">
                            <canvas canvas-id="coupon-{{ item.id }}"/>
                            <view style="padding-top: 35rpx">剩余</view>
                            <view>{{ item.lastratio }}%</view>
                        </block>
                    </view>
                    <view class="coupon-list-ling">{{ item.isdisa?"已发完":"立即"+item.gettypestr }}</view>
                </view>
            </view>  -->
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
						<view class="text">{{ item.usestr }}</view>
						<view class="usebtn">{{ item.isdisa?"已发完":"立即"+item.gettypestr }}</view>
					</view>
				</view>
			</a>
        </view>

    </view>

    <navigator class="fui-dot" hover-class="none" url="/pages/sale/coupon/my/index/index" open-type="navigate">
                          <text class="icox icox-huiyuan1" style="color:#fff;font-size:40rpx"></text>
    </navigator>


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
 * coupon\index\index.js
 *
 * @create 2017-02-03
 * @author 晚秋
 *
 * @update  晚秋 2017-02-04
 *
 */
var app = getApp();
var core = app.requirejs('core');

export default {
  data() {
    return {
      cates: [],
      cateid: 0,
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
    if (options.cateid) {
      this.setData({
        cateid: options.cateid
      });
    }

    this.getCate();
    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getCate: function () {
      var $this = this;
      core.get('sale/coupon/getCouponCate', {}, function (ret) {
        if (ret.list.length > 0) {
          $this.setData({
            cates: ret.list
          });
        }
      });
    },
    getList: function () {
      var $this = this;
      core.loading();
      this.setData({
        loading: true
      });
      core.get('sale/coupon/getlist', {
        page: this.page,
        cateid: this.cateid
      }, function (ret) {
        var data = {
          loading: false,
          total: ret.total,
          pagesize: ret.pagesize
        };

        if (ret.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(ret.list);

          if (ret.list.length < ret.pagesize) {
            data.loaded = true;
          }

          $this.setSpeed(ret.list);
        }

        $this.setData(data);
        core.hideLoading();
      });
    },
    setSpeed: function (list) {
      if (!list || list.length < 1) {
        return;
      }

      for (var i in list) {
        var item = list[i];

        if (isNaN(item.lastratio)) {
          continue;
        }

        var angle = item.lastratio / 100 * 2.5;
        var context = wx.createContext();
        context.beginPath();
        context.arc(34, 35, 30, 0.5 * Math.PI, 2.5 * Math.PI);
        context.setFillStyle('rgba(0,0,0,0)');
        context.setStrokeStyle('rgba(0,0,0,0.2)');
        context.setLineWidth(4);
        context.stroke();
        context.beginPath();
        context.arc(34, 35, 30, 0.5 * Math.PI, angle * Math.PI);
        context.setFillStyle('rgba(0,0,0,0)');
        context.setStrokeStyle('#ffffff');
        context.setLineWidth(4);
        context.setLineCap('round');
        context.stroke();
        var canvasId = 'coupon-' + item.id;
        wx.drawCanvas({
          canvasId: canvasId,
          actions: context.getActions()
        });
      }
    },
    bindTab: function (e) {
      var cateid = core.pdata(e).cateid;
      this.setData({
        cateid: cateid,
        page: 1,
        list: []
      });
      this.getList();
    },
    jump: function (e) {
      var id = core.pdata(e).id;

      if (id > 0) {
        wx.navigateTo({
          url: '/pages/sale/coupon/detail/index?id=' + id
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
@import "../../../../static/css/coupon.css";
</style>