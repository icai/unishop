<template>
<view>
<!--tab  -->
<view class="fui-cell-group">
  <view class="title">
    <view class="fui-tab fui-tab-danger">
      <view :class="'item ' + ( status=='0' ? 'active' : '' )" data-type="0" @tap="tab">全部记录</view>
      <view :class="'item ' + ( status=='1' ? 'active' : '' )" data-type="1" @tap="tab">兑换记录</view>
      <view :class="'item ' + ( status=='2' ? 'active' : '' )" data-type="2" @tap="tab">中奖记录</view>
    </view>
  </view>
</view>
<!--list  -->
<view class="content">
<view class="fui-list-group noclick" v-for="(item, index) in list" :key="index">
    <navigator hover-class="none" open-type="navigate" :url="'/pages/creditshop/log/detail/index?id=' + item.id">
      <view class="fui-list-group-title" style="color:#666;font-size:13px">
        <view class="order-num"><text>订单号：{{item.logno}}</text></view>
        <view style="float: right;color: #fea163">
          <view v-if="item.type==1"><text v-if="item.status==1">未中奖</text></view>
          <view v-if="item.goodstype==0">
              <block v-if="item.isverify==1">
                <block v-if="item.status==2">待兑换</block>
                <block v-if="item.isreply==1">
                  <block v-if="item.status ==3 && item.iscomment == 0">等待评价</block>
                  <block v-if="item.status ==3 && item.iscomment == 1">追加评价</block>
                  <block v-if="item.status ==3 && item.iscomment == 2">已完成</block>
                </block>
                <block v-else>
                  <block v-if="item.status==3">已完成</block>
                </block>
              </block>
              <block v-else>
                <block v-if="item.status ==2 && item.addressid == 0">
                  <block v-if="item.type==0">已兑换</block>
                  <block v-else>已中奖</block>
                </block>
                <block v-if="item.status ==2 && item.addressid > 0 && item.time_send==0">待发货</block>
                <block v-if="item.status ==3 && item.time_send > 0 && item.time_finish==0">待收货</block>
                <block v-if="item.isreply==1">
                  <block v-if="item.status ==3 && item.time_finish>0 && item.iscomment==0">等待评价</block>
                  <block v-if="item.status ==3 && item.time_finish>0 && item.iscomment==1">追加评价</block>
                  <block v-if="item.status ==3 && item.time_finish>0 && item.iscomment==2">已完成</block>
                </block>
                <block v-else>
                  <block v-if="item.status ==3 && item.time_finish>0">已完成</block>
                </block>
              </block>
          </view>
          <view v-else>
            <block v-if="item.status ==2 && item.goodstype == 3">
              <block v-if="item.type==0">已兑换</block>
              <block v-else>已中奖</block>
            </block>
            <block v-if="item.isreply==1">
              <block v-if="item.status ==3 && item.iscomment==0">等待评价</block>
              <block v-if="item.status ==3 && item.iscomment==1">追加评价</block>
              <block v-if="item.status ==3 && item.iscomment==2">
                <block v-if="item.goodstype==1">优惠券</block>
                <block v-if="item.goodstype==2">余额</block>
                <block v-if="item.goodstype==3">红包</block>已发放
              </block>
            </block>
            <block v-else>
              <block v-if="item.status ==3">
                <block v-if="item.goodstype==1">优惠券</block>
                <block v-if="item.goodstype==2">余额</block>
                <block v-if="item.goodstype==3">红包</block>已发放
              </block>
            </block>
          </view>
        </view>
      </view>
    </navigator>
    <navigator hover-class="none" open-type="navigate" :url="'/pages/creditshop/log/detail/index?id=' + item.id">
      <view class="fui-list goods-info">
        <view class="fui-list-media">
          <image class="goods_img" :src="item.thumb"></image>
        </view>
        <view class="fui-list-inner" style="height: 140rpx;">
          <view class="title">{{item.title}}</view>
          <span class="title-tip" v-if="item.goodstype == 0">商品</span>
          <span class="title-tip" v-if="item.goodstype == 1">优惠券</span>
          <span class="title-tip" v-if="item.goodstype == 2">余额</span>
          <span class="title-tip" v-if="item.goodstype == 3">红包</span>
          <view class="price">{{item.credit}}<span style="font-size: 22rpx;">积分</span>+￥{{item.money}}</view>
        </view>
      </view>
    </navigator>
      <view class="fui-list list-padding" style="padding:0 24rpx">
        <view class="fui-list-inner text-right" style="padding: 10rpx 0;display:none;" v-if="item.goodstype == 3">
          <view class="btn btn-default btn-default-o">领取红包</view>
        </view>
        <view class="fui-list-inner text-right" style="padding: 10rpx 0;" v-if="item.goodstype==0 && item.status==3 && item.time_send > 0 && item.time_finish == 0">
          <view class="btn btn-default btn-default-o" :data-logid="item.id" @tap="finish">确认收货</view>
        </view>
        <view v-if="item.goodstype==0 && item.isverify==1 && item.status==2" class="fui-list-inner text-left" style="padding: 10rpx 0; color: #999;font-size: 26rpx;">
          兑换码：123456789
        </view>
        <view v-if="item.isreply==1  && item.time_finish > 0" class="fui-list-inner text-right" style="padding: 10rpx 0;">
          <block v-if="item.goodstype==0 || item.goodstype==1">
            <navigator v-if="item.status == 3 && item.iscomment == 1" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + item.id + '&goodsid=' + item.goodsid" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
              <block>追加评价</block>
            </navigator>
            <navigator v-if="item.status == 3 && item.iscomment == 0" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + item.id + '&goodsid=' + item.goodsid" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
              <block>评价</block>
            </navigator>
          </block>
          <block v-if="item.goodstype==2 || item.goodstype==3">
            <navigator v-if="item.status == 3 && item.iscomment == 1" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + item.id + '&goodsid=' + item.goodsid" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
              <block>追加评价</block>
            </navigator>
            <navigator v-if="item.status == 3 && item.iscomment == 0" hover-class="none" open-type="navigate" :url="'/pages/creditshop/comment/index?logid=' + item.id + '&goodsid=' + item.goodsid" class="btn btn-warning btn-default-o order-finish pull-right" @tap="replytap">
              <block>评价</block>
            </navigator>
          </block>
        </view>
        <view v-if="item.goodstype==0 && item.isverify==1 && item.status==2" class="fui-list-inner text-right" style="padding: 10rpx 0;">
          <navigator hover-class="none" open-type="navigate" :url="'/pages/creditshop/verify/index?id=' + item.id" class="btn btn-default btn-default-o">兑换二维码</navigator>
        </view>
      </view>
  </view>

</view>

<!--数据显示-->
<view class="fui-loading" :hidden="load">
  <view class="icon"></view>
  <view class="text">正在加载</view>
</view>
<view class="fui-loading empty" :hidden="more">
  <view class="text">没有更多了</view>
</view>
<view class="fui-loading empty" :hidden="notgoods">
  <view class="text">暂时没有任何商品</view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      status: 0,
      showcode: false,
      list: {},
      page: 1,
      total: 0,
      more: true,
      load: true,
      notgoods: true
    };
  },

  onReachBottom: function (e) {
    this.setData({
      page: this.page + 1,
      load: false
    });
    this.get_list(true);
    this.setData({
      load: true
    });
  }
  /*
  exchange:function(e){
    var url = '/pages/creditshop/verify/index?id='+e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: url
    });
  }
  */
  ,
  onLoad: function (options) {
    var $this = this;
    $this.get_list();
  },
  components: {},
  props: {},
  methods: {
    // tab切换
    tab: function (e) {
      var status = e.currentTarget.dataset.type;
      this.setData({
        status: status
      });
      this.setData({
        page: 1
      });
      this.get_list();
    },
    finish: function (e) {
      var $this = this;
      var logid = e.currentTarget.dataset.logid;
      wx.showModal({
        title: '提示',
        content: '确认已收到货了吗？',
        success: function (sm) {
          if (sm.confirm) {
            core.get('creditshop/log/finish', {
              id: logid
            }, function (res) {
              if (res.error == 0) {
                foxui.toast($this, "确认收货");
                $this.onShow();
              } else {
                foxui.toast($this, res.message);
                return;
              }
            });
          }
        }
      });
    },
    //拉取列表
    get_list: function (onpage) {
      var $this = this;
      core.post('creditshop/log/getlist', {
        page: $this.data.page,
        status: $this.data.status
      }, function (msg) {
        if (msg.error == 0) {
          if (!onpage) {
            $this.setData({
              list: msg.list
            });
          } else {
            //如果是翻页的话则追加
            msg.list = $this.data.list.concat(msg.list);
            $this.setData({
              list: msg.list
            });
          }

          $this.setData({
            total: msg.total
          });
        }

        if (msg.pagesize >= msg.next_page) {
          $this.setData({
            more: false
          });
        }

        if (msg.total == 0) {
          $this.setData({
            more: true
          });
        }

        if (!onpage) {
          $this.setData({
            datas: msg.list
          });
        } else {
          //如果是翻页的话则追加
          msg.list = $this.data.datas.concat(msg.list);
          $this.setData({
            datas: msg.list
          });
        }

        if ($this.data.total <= 0) {
          $this.setData({
            notgoods: false
          });
        } else {
          $this.setData({
            notgoods: true
          });
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
.fui-cell-group{
  margin-top: 0;
}
.fui-tab.fui-tab-danger{
  margin-bottom: 0;
}

.fui-list-media image {
	  width:160rpx;
    height: 160rpx;
}

.title-tip{
  background: #ff5555;
  padding: 5rpx 10rpx;
  color: #fff;
  font-size: 22rpx;
  position: relative;
  top: -1rpx;
  border-radius: 6rpx;
}
.fui-list-inner .title{
  margin-bottom: 14rpx;
}
.fui-list-inner .price{
  color: #ff5555;
  font-size: 32rpx;
  margin-top: 8rpx;
}

.btn{
    margin:10rpx 0 10rpx 20rpx;
    padding: 0 26rpx;
    height:56rpx;
    line-height: 54rpx;
    border-radius: 40rpx;
    font-size: 26rpx;
}

.fui-list-group-title{
  display: flex;
}
.fui-list-group-title .order-num{
  flex: 1;
}

</style>