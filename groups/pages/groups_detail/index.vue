<template>
<view>
<!--pages/groups/groups_detail/index.wxml-->
 
<view class="page" :style="(isIpx?'padding-bottom:168rpx':'')">
  <view class="groupstime" v-if="count_down && data.tuan_first_order.success == 0">剩余 {{time[0]}}天{{time[1]}}小时{{time[2]}}分{{time[3]}}秒</view>
  <view class="groupstime" v-if="!count_down || data.tuan_first_order.success == -1">拼团已结束</view>
  <view class="groupstime" v-if="data.tuan_first_order.success == 1">拼团已成功</view>
  <view class="goodsinfo flex">
    <image :src="data.goods.thumb"></image>
    <view class="inner flex1">
      <view class="title">{{data.goods.title}}</view>
      <view> <text class="person">{{data.tuan_first_order.is_ladder==1?"阶梯团":data.tuan_first_order.groupnum + "人团"}}</text></view>
      <view class="price">￥{{data.tuan_first_order.goods_price}}/{{data.goods.goodsnum}}{{data.goods.units}}</view>
    </view>
  </view>
  <view class="join">
    <view class="inner">
    <!-- wx:if="{{!count_down || data.myorder.success != 0}}" -->
      <view class="num" v-if="data.tuan_first_order.success == 0">已有{{data.nn}}人参与,还差<text>{{data.n}}</text>人拼团成功</view>
      <view class="flex person-group">
        <view v-for="(item, index) in data.orders" :key="index" :class="'persons ' + (idx == 0 ? 'active' : '')">
          <image :src="item.avatar"></image>
        </view>
        <view v-for="(item, index) in data.arr" :key="index" class="persons">
          <image src="/static/images/noface.png"></image>
        </view>
      </view>
    </view>
  </view>
  <!--流程  -->
  <view class="process">
    <text class="icox icox-1"></text>下单开团/参团 <text class="line">-----------</text><text class="icox icox-2"></text>邀请好友参团 <text class="line">-----------</text><text class="icox icox-3"></text>人满拼团成功
  </view>
  <!--tab  -->
  <view class="fui-cell-group" style="margin-top:0">
    <view class="title">
        <view id="tab" class="fui-tab fui-tab-danger">
          <view :class="'item ' + (showtab=='groups'?'active':'')" @tap="goodsTab" data-tap="groups">拼团详情</view>
          <view :class="'item ' + (showtab=='info'?'active':'')" @tap="goodsTab" data-tap="info">商品详情</view>
        </view>
    </view>
    <view class="tabcontent">
    <!--拼团详情  -->
        <view v-if="showtab=='groups'">
            <view class="fui-cell" v-for="(item, index) in data.orders" :key="index">
              <view class="fui-cell-label">
                <image :src="item.avatar"></image>
              </view>
              <view class="fui-cell-info">
                {{item.nickname}}
              </view>
              <view class="fui-cell-remark noremark danger">
                {{item.createtime}}
              </view>
            </view>
        </view>
        <!--商品详情  -->
        <view v-if="showtab=='info'">
          <view class="wxParse">
            <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
          </view>
           <!-- <rich-text nodes="{{content}}"></rich-text> -->
        </view>
    </view>
  </view>

<!--蒙层  -->
 <view class="layer" v-if="layershow" @tap="close"></view> 
<!--多规格弹窗  -->
 <view class="fui-modal goods-picker in goodslist" v-if="options">
  <view class="option-picker">
    <view class="option-picker-inner">
      <view class="fui-list">
        <view class="fui-list-media">
           <image class="thumb" :src="optiondata.thumb || data.goods.thumb"></image>
        </view>
        <view class="fui-list-inner">
          <view class="subtitle">{{optiondata.title || data.goods.title}}</view>
          <view class="price">￥{{optiondata.price || data.goods.groupsprice}}</view>
        </view>
      </view>
      <view class="option-picker-options">
        <view class="option-picker-cell option spec">
        <block v-for="(items, index) in spec" :key="index">
          <view class="title">{{items.title}}</view>
          <view class="select">
            <view :class="'btn btn-default btn-sm nav spec-item ' + (options.status=='active'?'btn-danger':'')" v-for="(options, index2) in items.item" :key="index2" :data-spedid="options.specid" @tap="specsTap" :data-idx="index" :data-specindex="specindex" :data-id="options.id">{{options.title}}</view>
          </view>
        </block>
        </view>
      </view>
    </view>
    <view class="fui-navbar">
     <view class="btn btn-danger block" @tap="buy"> {{optiondata.stock<=0?"库存不足":"确定"}}< view>
      </=0?"库存不足":"确定"}}<></view>
  </view>
  <view class="icox icox-guanbi-copy" style="color:#fff;text-align:center;font-size:60rpx;margin-top:30rpx;" @tap="close"> </view> 
</view>


   <!--底部  -->
    <view :class="'detailbtn-group flex ' + iphonexnavbar">
      <navigator class="back" url="../index/index" hover-class="none" open-type="reLaunch">
        <view class="icox icox-homepage"></view>
        <view>拼团首页</view>
      </navigator>
      <view class="detailbtn flex1" :style="(data.myorder.success == 0?'background:#ff5555':'background:#ccc')">
       <text v-if="!count_down || data.tuan_first_order.success == -1">拼团已结束</text>
       <text v-if="data.tuan_first_order.success == 1">拼团已成功</text>
        <button open-type="share" v-if="data.tuan_first_order.success == 0 && data.myorder"> 
          快邀请好友参团
        </button>
        <button @tap="tuxedobuy" v-if="data.tuan_first_order.success == 0 && !data.myorder">我要参团</button>
      </view>
    </view>
    <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</view>
</view>
</template>

<script>
// pages/groups/groups_detail/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');
var times = 0;
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      showtab: 'groups',
      count_down: true,
      time: '',
      share: 1,
      options: '',
      show: false
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var $this = this;
    return {
      title: $this.data.data.shopshare.title,
      path: '/groups/pages/groups_detail/index?teamid=' + $this.data.data.tuan_first_order.teamid,
      imageUrl: $this.data.data.shopshare.imgUrl
    };
  },

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

    this.setData({
      teamid: options.teamid
    });
    this.get_details(options.teamid);
  },
  components: {},
  props: {},
  methods: {
    get_details: function (teamid) {
      var $this = this;
      core.get('groups/team/details', {
        teamid: teamid
      }, function (result) {
        if (result.error == 0) {
          result.data.goods.content = result.data.goods.content.replace(/data-lazy/g, "src");
          $this.setData({
            data: result.data
          });
          parser.wxParse('wxParseData', 'html', result.data.goods.content, $this, '0');
        }

        if (result.data.tuan_first_order.success == 0) {
          if (result.data.lasttime2 <= 0) {
            $this.setData({
              count_down: false
            });
            return;
          }

          clearInterval($this.data.timer);

          if (result.data.tuan_first_order.success == 0) {
            var timer = setInterval(function () {
              $this.countDown(result.data.tuan_first_order.createtime, result.data.tuan_first_order.endtime);
            }, 1000);
          }

          $this.setData({
            timer: timer
          });
        }
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

      if (day == 0 && hour == 0 && minute == 0 && second == 0) {
        this.get_details(this.teamid);
      }

      var time = [day, hour, minute, second];
      this.setData({
        time: time
      });
    },
    tuxedobuy: function (e) {
      app.checkAuth();
      var $this = this;
      var id = $this.data.data.goods.id;

      if ($this.data.data.goods.more_spec == 0) {
        if ($this.data.data.goods.stock > 0) {
          core.get('groups/order/create_order', {
            id: id,
            ladder_id: $this.data.data.tuan_first_order.ladder_id,
            type: 'groups',
            heads: 0,
            teamid: $this.data.teamid
          }, function (msg) {
            if (msg.error == 1) {
              core.alert(msg.message);
              return;
            } // 用户不存在则跳转


            if (msg.error == -1) {
              wx.redirectTo({
                url: '/pages/message/auth/index'
              });
              return;
            }

            wx.navigateTo({
              url: "/groups/pages/confirm/index?id=" + id + "&heads=0&type=groups&teamid=" + $this.data.teamid + "&ladder_id=" + $this.data.data.tuan_first_order.ladder_id,
              success: function () {
                $this.setData({
                  layershow: false,
                  chosenum: false,
                  options: false
                });
              }
            });
          });
        } else {
          wx.showToast({
            title: '库存不足',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        core.get('groups.goods.get_spec', {
          id: id
        }, function (result) {
          $this.setData({
            spec: result.data
          });
        });
        $this.setData({
          layershow: true,
          options: true
        });
        $this.setData({
          optionarr: [],
          selectSpecsarr: []
        });

        if ($this.data.data.goods.stock > 0) {
          wx.navigateTo({
            url: "/groups/pages/confirm/index?id=" + goods_id + "&type=groups&teamid=" + $this.data.teamid,
            success: function () {
              $this.setData({
                layershow: false,
                chosenum: false,
                options: false
              });
            }
          });
        } else {
          wx.showToast({
            title: '库存不足',
            icon: 'none',
            duration: 2000
          });
        }

        $this.setData({
          layershow: true,
          options: true
        });
      }
    },
    close: function () {
      var $this = this;
      $this.setData({
        layershow: false,
        options: false
      });
    },
    specsTap: function (e) {
      times++;
      var $this = this;
      var specs = $this.data.spec;
      var spec_id = core.pdata(e).spedid,
          id = core.pdata(e).id,
          specindex = core.pdata(e).specindex,
          idx = core.pdata(e).idx; // 改颜色

      specs[specindex].item.forEach(function (e, index) {
        if (e.id == id) {
          specs[specindex].item[index].status = 'active';
        } else {
          specs[specindex].item[index].status = '';
        }
      });
      $this.setData({
        spec: specs
      }); // 存id

      var optionarr = $this.data.optionarr; // 规格下标数组

      var selectSpecsarr = $this.data.selectSpecsarr;

      if (times == 1) {
        optionarr.push(id);
        selectSpecsarr.push(spec_id);
      } else {
        if (selectSpecsarr.indexOf(spec_id) > -1) {
          optionarr.splice(specindex, 1, id);
        } else {
          // 不同规格添加
          optionarr.push(id);
          selectSpecsarr.push(spec_id);
        }
      }

      $this.data.optionarr = optionarr;
      $this.data.selectSpecsarr = selectSpecsarr;
      core.post('groups.goods.get_option', {
        spec_id: $this.data.optionarr,
        groups_goods_id: $this.data.data.goods.id
      }, function (result) {
        $this.setData({
          optiondata: result.data
        });
      });
    },
    buy: function (e) {
      var $this = this;
      var buyop = core.pdata(e).op,
          goods_id = $this.data.data.goods.id,
          optiondata = $this.data.optiondata;

      if ($this.data.optiondata) {
        if (optiondata.stock > 0) {
          wx.navigateTo({
            url: "/groups/pages/confirm/index?id=" + goods_id + "&type=groups&option_id=" + optiondata.id + ' &teamid=' + $this.data.teamid,
            success: function () {
              $this.setData({
                layershow: false,
                chosenum: false,
                options: false
              });
            }
          });
        } else {
          wx.showToast({
            title: '库存不足',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 2000
        });
      }
    },
    goodsTab: function (e) {
      this.setData({
        showtab: e.target.dataset.tap
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
/* pages/groups/groups_detail/index.wxss */
.groupstime{
  height: 72rpx;
  width: 100%;
  background: #fff4f4;
  font-size: 24rpx;
  font-weight: bold;
  line-height: 72rpx;
  color: #ff5555;
  text-align: center
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
.join{
  padding: 0 24rpx 50rpx;
  background: #fff;
}
.join .inner{
  width: 100%;
  background: #f7f7f7;
  padding: 0 0 40rpx
}
.num{
  line-height: 96rpx;
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  text-align: center
}
.num text{
  font-size: 50rpx;
  font-weight: bold;
  color: #ff5555
}
.person-group{
  justify-content: center;
  flex-wrap: wrap
}
.persons{
  width: 80rpx;
  height: 80rpx;
  margin: 15rpx 24rpx;
  position: relative
}
.persons.active:after{
  position: absolute;
  content: '团长';
  width: 58rpx;
  height: 28rpx;
  border-radius: 28rpx;
  background: #ff5555;
  line-height: 28rpx;
  font-size: 18rpx;
  text-align: center;
  color: #fff;
  bottom: 0rpx;
  left: 10rpx
}
.persons image{
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
/*流程  */
.process{
  line-height: 80rpx;
  font-size: 20rpx;
  color: #666;
  padding: 0 24rpx
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
.fui-cell-group .fui-cell .fui-cell-label{
  width: 60rpx;
  height: 60rpx;
  margin-right: 15rpx;
}
.fui-cell-group .fui-cell .fui-cell-label image{
   width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}
.fui-cell-group .fui-cell .fui-cell-info{
  font-size: 26rpx;
  color: #666
}
.fui-cell-group .fui-cell .fui-cell-remark.noremark {
  color: #999;
  font-size: 24rpx;
}
/*底部按钮  */
.detailbtn-group{
  height: 98rpx;
  background: #fff;
  position: fixed;
  width: 100%;
  bottom: 0;
  text-align: center
}
.detailbtn-group .back{
  width: 120rpx;
}
.detailbtn-group .detailbtn{
  background: #ff8080;
  color: #fff;
  font-size: 28rpx;
  line-height: 98rpx
}
.back{
  font-size: 22rpx;
  line-height: 40rpx;
  color: #999
}
.back .icox{
  font-size: 50rpx;
  vertical-align: middle;
  padding-top: 10rpx
}
.detailbtn button{
  background: #ff5555;
  line-height: 98rpx;
  border: none;
  outline: none;
  color: #fff;
  font-size: 26rpx;
  border-radius: 0
}
/*提示弹窗  */
.model{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5)
}
.model .box{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  width: 560rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
  margin-left: 93rpx;
  font-size: 28rpx;
  color: #000;
  line-height: 40rpx;
}
.model .box .content{
  padding: 62rpx 54rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #efefef;
}
.box .footer{
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
  color: #00c200;
}
.detailbtn-group .detailbtn.ladder{
  line-height: 98rpx;
  font-size: 26rpx;
  padding: 0

}
/*多规格  */
/*city-picker*/
.nav-mask{
  position: fixed;
  z-index: 999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none
}
.picker-modal {
    background: #fefefe;
    height: 260px;
    position: fixed;
    bottom:-2rem; 
    left: 0;
    right: 0;
    z-index: 1000;
    transform: translate3d(0, 100%, 0);
}
.picker-modal.city-picker{
    z-index: 2000;
}
.picker-modal.in {
    transition-duration: 300ms;
    transform: translate3d(0, 0, 0);
    bottom: 0
}
.picker-modal.out {
    transition-duration: 300ms;
    transform: translate3d(0, 100%, 0);
}
.picker-modal .picker-control {
    display: flex;
    align-items: center;
    height: 40px;
     border-bottom: 1px solid #f1f1f1; 
    padding: 0  30rpx;
    font-size: 32rpx;
}
.picker-modal .picker-control .cancel {
    width: 50%;
    text-align: left;
    color: #666;
}
.picker-modal .picker-control .confirm {
    width: 50%;
    text-align: right;
    color: #20b21f;
}
.picker-modal .picker {
    width: 100%;
    height: 220px;
}
.picker-modal .picker .item {
    line-height: 40px;
}
picker-view-column {
    text-align: center;
}
.layer{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index:101
}

/*选择商品弹窗  */
/**规格弹出*/
.option-picker {
    height: auto;
    width: 100%;
    z-index: 1001;
}
.goods-picker .option-picker-options{
  height: 600rpx
}
.option-picker .option-picker-cell {
    padding: 8rpx 20rpx 20rpx 20rpx;
}
.option-picker .option-picker-options {
    margin: 0;
    padding: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 750rpx; 
}
.option-picker .option-picker-cell.option {
    position: relative;
}
.option-picker .option-picker-cell.option .title {
    font-size:28rpx;
    height: auto;
    overflow: hidden;
    color: #000;
    line-height: 78rpx;
}
.option-picker .option-picker-cell.option .select {
    font-size: 29rpx;
    color: #666;
    height: auto;
    overflow: hidden;
}
.option-picker .option-picker-cell.option .select .nav {
    height: auto;
    width: auto;
    border: 0;
    float: left;
    margin: 16rpx 20rpx 0 0;
}
.option-picker .fui-navbar {
    text-shadow: none;
    height: 90rpx;
}
.option-picker .fui-navbar .btn {
    border: none;
    font-size: 29rpx;
    color: #fff;
    border-radius: 0;
    padding: 0;
    margin: 0;
    height: 100%;
    line-height: 90rpx;
}
.option-picker .fui-navbar .cartbtn {
    background: #fe9402;
}
.option-picker .fui-navbar .buybtn, .option-picker .fui-navbar .confirmbtn {
    background: #fd5555;
}
.option-picker-inner {
    background: #fff;
    border-top: 2rpx solid #eee;
    box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.option-picker .fui-navbar .btn.disabled {
    color: #ccc;
    background: #ececec;
}
.fui-modal.goodslist{
  position: fixed;
  max-height: 780rpx;
  width: 660rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-55%);
  bottom: auto
}
.fui-modal.goodslist .option-picker .option-picker-inner{
margin:0;
overflow-y:auto;
-webkit-overflow-scrolling:touch;
height: auto;
max-height: 640rpx;
overflow: hidden;
border-top-left-radius: 12rpx;
border-top-right-radius: 12rpx;
padding: 30rpx
}
.fui-modal.goodslist .option-picker .option-picker-options{
  max-height: 440rpx;
  overflow: auto;
  height: auto
}
.fui-modal.goodslist .fui-navbar{
  padding: 30rpx 0;
  position: static;
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;
  text-align: center
}
.fui-modal.goodslist .option-picker .fui-navbar .btn {
  width: 290rpx;
  border:none;
  font-size:29rpx;
  color:#fff;
  border-radius:10rpx;
  padding:0;
  margin:0;
  height:84rpx;
  line-height:84rpx;
  display: inline-block
}
.fui-modal.goodslist .option-picker .fui-navbar .btn.cartbtn{
  margin-right: 20rpx
}
.fui-modal.goodslist .option-picker-cell.goodinfo{
  position: static;
   display: flex ;
   padding-left: 30rpx
}
.fui-modal.goodslist .option-picker .option-picker-cell.goodinfo .img{
   position: static 
}
.fui-modal.goodslist .option-picker .option-picker-cell.goodinfo:after,.option-picker .option-picker-cell.option:after{
  border: none
}
.fui-modal.goodslist .fui-list{
  background: #f7f7f7
}
.fui-modal.goodslist .fui-list-inner{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100rpx
}
.fui-modal.goodslist .fui-list-inner .subtitle{
  font-size: 28rpx
}
.fui-modal.goodslist .fui-list-inner .price{
  font-size: 30rpx;
  line-height: 30rpx;
  color: #ff5555
}
.fui-modal.goodslist .option-picker .fui-navbar .cartbtn{
  color: #333;
  border:1px solid #e5e5e5;
  background: #fff
}
.fui-modal.goodslist .option-picker .fui-navbar .btn{
  width:588rpx;
}

</style>