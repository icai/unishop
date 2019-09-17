<template>
<!--pages/groups/jointeam/index.wxml-->
<view class="join">
    <view class="goodsinfo flex">
    <image :src="data.thumb"></image>
    <view class="inner flex1">
      <view class="title">{{data.title}}</view>
      <view> <text class="person">{{data.is_ladder==1?"阶梯团":data.groupnum + "人团"}}</text></view>
      <view class="price">￥{{data.groupsprice}}/{{data.goodsnum}}件 <text class="fr">已有{{data.teamnum}}人参团</text></view>
    </view>
  </view>
  <!--流程  -->
  <view class="process">
    <text class="icox icox-1"></text>下单开团/参团 <text class="line">-----------</text><text class="icox icox-2"></text>邀请好友参团 <text class="line">-----------</text><text class="icox icox-3"></text>人满拼团成功
  </view>
  <view class="operation" v-if="other.length>0">
    <view class="text">以下小伙伴正在发起拼团，您可以直接参加</view>
    <view class="groups">
      <view class="groups-item flex" v-for="(item, index) in other" :key="index" v-if="item.status!='hide'">
        <image :src="item.avatar"></image>
        <view class="flex1">
          <view>{{item.nickname}}</view>
          <view class="des">还差{{item.num}}人成团，剩余{{item.hour}}小时{{item.minite}}分钟{{item.second}}秒</view>
        </view>
        <navigator class="joinbtn" :data-teamid="item.teamid" @tap="do_">我要参团</navigator>
      </view>
    </view>
  </view>
  <!--无拼团  -->
   <view class="empty" v-if="other.length==0">
    暂无相关团购
  </view> 
</view>
</template>

<script>
// pages/groups/jointeam/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      goods_id: 0,
      option_id: 0,
      ladder_id: 0
    };
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
    var id = options.id;
    var ladder_id = options.ladder_id;
    this.setData({
      goods_id: options.id,
      option_id: options.option_id,
      ladder_id: options.ladder_id
    });
    core.get('groups.goods.fight_groups', {
      id: id,
      ladder_id: ladder_id
    }, function (result) {
      if (result.error == 1) {
        core.alert(result.message);
        return;
      }

      $this.setData({
        data: result.data,
        other: result.other
      });
      setInterval(function () {
        var other = $this.data.other;

        for (var i in other) {
          var s = other[i].residualtime,
              h = 0,
              m = 0;

          if (s > 60) {
            m = parseInt(s / 60);
            s = parseInt(s % 60);

            if (m > 60) {
              h = parseInt(m / 60);
              m = parseInt(m / 60);
            }
          }

          if (s < 0) {
            h = 0;
            m = 0;
            s = 0;
            $this.data.other[i].status = "hide";
            $this.data.other = [];
          }

          $this.data.other[i].hours = h;
          $this.data.other[i].minite = m;
          $this.data.other[i].second = s;
          $this.data.other[i].residualtime = $this.data.other[i].residualtime - 1;
        }

        $this.setData({
          other: other
        });
      }, 1000);
    });
  },
  components: {},
  props: {},
  methods: {
    join: function () {},
    do_: function (e) {
      var $this = this;
      var teamid = e.target.dataset.teamid;
      core.get('groups/order/create_order', {
        id: $this.data.goods_id,
        group_option_id: $this.data.option_id,
        ladder_id: $this.data.ladder_id,
        type: 'groups',
        heads: 0,
        teamid: teamid
      }, function (msg) {
        if (msg.error == 1) {
          core.alert(msg.message);
          return;
        }

        wx.navigateTo({
          url: '/groups/pages/confirm/index?id=' + $this.data.goods_id + '&heads=0&type=groups&option_id=' + $this.data.option_id + '&teamid=' + teamid + '&ladder_id=' + $this.data.ladder_id
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
/* pages/groups/jointeam/index.wxss */
.join{
  background: #fff;
  min-height: 100%;
}
.goodsinfo{
  background: #fff;
  padding: 30rpx 24rpx;
}
.goodsinfo image{
  height: 160rpx;
  width: 160rpx;
}
.goodsinfo .inner{
  padding-left: 24rpx;
  font-size: 26rpx;
  color: #333;
}
.goodsinfo .inner .title{
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.goodsinfo .person{
  min-width: 90rpx;
  text-align: center;
  padding: 0 12rpx;
  box-shadow: 0 0 20rpx 0 rgba(255, 221, 221, 0.8);
  margin:24rpx 0;
  font-size: 22rpx;
  font-weight: bold;
  line-height: 34rpx;
  color: #ff6000;
  border-radius: 4rpx;
  display: inline-block;
  background-image: -webkit-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  background-image: -moz-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  background-image: -ms-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  background-image: -o-gradient(linear, 0 0, right 0, from(#ff6000), to(#ff8a00));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.goodsinfo .price{
  font-size: 26rpx;
  color: #ff5555
}
.goodsinfo .price .fr{
  font-size: 24rpx;
  color: #999;
  float: right
}
/*流程  */
.process{
  line-height: 80rpx;
  font-size: 20rpx;
  color: #666;
  padding: 0 24rpx;
  background: #f3f3f3
}
.process text.icox{
  font-size: 26rpx;
  vertical-align: middle
}
.process text.line{
  margin:0 25rpx;
  display:inline-block;
  width:70rpx;
  overflow:hidden;
  height:80rpx;
  vertical-align:middle;
}
.operation{
  background: #fff;
  text-align: center;
  font-size: 26rpx;
  color: #333;
  padding-bottom: 50rpx;

}
.operation .text{
  line-height: 130rpx
}
.operation .btn{
  height: 72rpx;
  line-height: 68rpx;
  border-radius: 72rpx;
  width: 300rpx;
  margin-top: 0;
  margin-bottom: 0
}
/*分组  */
.groups-item{
  text-align: left;
  font-size: 26rpx;
  padding: 36rpx 24rpx;
  position: relative;
}
.groups-item:nth-of-type(1):after{
  display: none
}
.groups-item:after{
  content: '';
  position: absolute;
  top: 0;
  left: 24rpx;
  right: 24rpx;
  border-top: 1px solid #efefef
}
.groups-item image{
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.groups-item .des{
  font-size: 22rpx;
  color: #b2b2b2;
}
.joinbtn{
  width: 152rpx;
  height: 52rpx;
  font-size: 24rpx;
  line-height: 52rpx;
  border-radius: 53rpx;
  background: #ff5555;
  color: #fff;
  text-align: center
}
.empty{
  line-height: 128rpx;
  font-size: 28rpx;
  color: #999;
  text-align: center;
  position: relative
}
.empty:before{
  content:'';
  position: absolute;
  width: 140rpx;
  border-top: 1px solid #e5e5e5;
  left: 137rpx;
  top: 64rpx
}
.empty:after{
  content:'';
  position: absolute;
  width: 140rpx;
  border-top: 1px solid #e5e5e5;
  right: 137rpx;
  top: 64rpx
}
</style>