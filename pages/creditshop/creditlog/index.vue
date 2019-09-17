<template>
<view>
<view class="page">
  <view class="total">
    <view class="title">我的积分</view>
    <view class="num">{{total}}</view>
  </view>
  <!--兑换记录  -->
  <view class="record">
    <view class="item" v-for="(item, index) in list" :key="index">
      <view class="item-label">
        <view class="name">{{item.title}}</view>
        <view class="date">{{item.createtime}}</view>
      </view>
      <view class="item-remark">-{{item.credit}}积分<text v-if="item.money>0"> -￥{{item.money}}</text></view>
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
var $ = app.requirejs('jquery'); // pages/integral/my/index.js

export default {
  data() {
    return {
      page: 1,
      list: {},
      total: 0,
      load: true,
      more: true,
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    $this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function (onpage) {
      var $this = this;
      core.post('creditshop/creditlog/getlist', {
        page: $this.data.page
      }, function (msg) {
        $this.setData({
          total: msg.credit
        });

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

        if (msg.total == 0) {
          $this.setData({
            notgoods: false
          });
        } else {
          $this.setData({
            notgoods: true
          });
        }

        if (msg.pagesize >= msg.next_page) {
          $this.setData({
            more: false
          });
        } else {
          $this.setData({
            more: true
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
.total{
  height: 195rpx;
  background: #fff;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.total .title{
  font-size: 26rpx;
  line-height: 48rpx;
  color: #999;
}
.total .num{
  font-size: 44rpx;
  line-height: 60rpx;
  color: #ff5555;
  font-weight: 600;
}

/*兑换记录  */
.record{
  width: 100%;
  background: #fff;
  margin-top: 20rpx;
}
.record .item{
  padding: 30rpx 24rpx;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  position: relative;
}
.item-label .name{
  font-size: 26rpx;
  color: #000;
  line-height: 1;
}
.item-label .date{
  font-size: 22rpx;
  color: #999;
  line-height: 1;
  margin-top: 20rpx;
}
.item-remark{
  color: #999;
  font-size: 26rpx;
}
.record .item:after{
  content: " ";
	position: absolute;
	left: 24rpx;
	right: 24rpx;
	bottom: -1rpx;
	height: 1px;
	border-bottom: 1px solid #ebebeb;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
</style>