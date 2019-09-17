<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page navbar" v-if="show">
<view class="fui-list-group" id="container">  
	  <view class="fui-list goods-item align-start" :data-goodsid="item.goodsid" v-for="(item, index) in packgoods" :key="index">
			<view class="fui-list-media image-media">
					<image class=" package-goods-img" :src="item.thumb" @tap="back" :data-id="item.goodsid"></image>
			</view>
			<view class="fui-list-inner">
					<view class="text towline" @tap="back" :data-id="item.goodsid">{{item.title}}</view>
				<view class="text cart-option cartmode">
					<span v-if="item.option!=''" class="option" :data-goodsid="item.goodsid" :data-index="index" @tap="option">{{item.optionname?item.optionname:'请选择规格 >'}}</span>
				</view>
			</view>
			<view class="fui-list-angle">
				<span class="price"><span class="marketprice">¥{{item.packageprice}}</span></span>
				<span class="price" style="justify-content: flex-end"><span class>x1</span></span>
			</view>
		</view>
	</view>
    <!--购买start-->
        <view class="fui-navbar bottom-buttons">
            <view class="nav-item packagePrice">
              <view class="subtitle">
                套餐价格：<span class="text-danger bigprice">¥</span><span class="text-danger totalprice  bigprice">{{sum?sum:package.price}}</span>
              </view>
            </view>
            <view class="nav-item btn buybtn" @tap="buy">立刻购买</view>
        </view>
    <!--购买end-->
    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
    <view class="option-mask" v-if="option_mask" @tap="close"></view>
    <view class="option-picker" v-if="option_mask">
      <view class="fui-cell-group fui-sale-group" style="margin-top:0;">
        <view class="fui-cell">
          <view class="fui-cell-text dispatching">
            请选择规格:
            <view class="dispatching-info">
            <i :class="'package-i ' + (option_active==item.optionid?'active':'')" :data-optionid="item.optionid" :data-price="item.packageprice" :data-goodsid="item.goodsid" :data-title="item.title" :data-index="index" v-for="(item, index) in option" :key="index" @tap="choose">{{item.title}}</i>
            </view>
          </view>
        </view>
        <view class="btn btn-danger block" @tap="confirm">确定</view>
      </view>
    </view>
        <include src="/pages/common/menu.wxml"></include>
</view>
</view>
</template>

<script>
/**
 *
 * detail\index.js
 *
 * @create 2017-11-22
 * @author 牟俊羽
 *
 */
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var $ = app.requirejs('jquery');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      show: true,
      option_mask: false
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
    $this.setData({
      pid: options.id
    });
    core.get('package.get_detail', {
      pid: options.id
    }, function (result) {
      var packgoods = result.packgoods;
      var good = [];
      wx.setNavigationBarTitle({
        title: result.package.title || '套餐'
      });

      for (var i = 0; i < packgoods.length; i++) {
        if (packgoods[i].option == "") {
          good[i] = {
            goodsid: packgoods[i].goodsid,
            optionid: ''
          };
        } else {
          good[i] = {
            goodsid: packgoods[i].goodsid,
            optionid: null
          };
        }
      }

      $this.setData({
        packgoods: packgoods,
        package: result.package,
        good: good
      });
    });
  },
  components: {},
  props: {},
  methods: {
    option: function (e) {
      var $this = this;
      var goodsid = e.currentTarget.dataset.goodsid;
      var index = e.currentTarget.dataset.index;
      core.get('package.get_option', {
        pid: $this.data.pid,
        goodsid: goodsid
      }, function (result) {
        $this.setData({
          option_mask: true,
          option: result.option,
          index: index
        });
      });
    },
    back: function (e) {
      var $this = this;
      wx.setStorage({
        key: "mydata",
        data: {
          id: e.currentTarget.dataset.id
        },
        success: function () {
          wx.navigateBack(); //返回上一个页面
        }
      });
    },
    close: function () {
      this.setData({
        option_mask: false
      });
    },
    choose: function (e) {
      var optionid = e.currentTarget.dataset.optionid;
      var option_title = e.currentTarget.dataset.title;
      var index = e.currentTarget.dataset.index; //option下标

      var packgoods = this.packgoods;
      var packageprice = this.option[index].packageprice; //所选option价格

      packgoods[this.index].packageprice = packageprice; //所选option价格替换商品价格

      var sum = 0; //套餐价格

      for (var i = 0; i < packgoods.length; i++) {
        sum += packgoods[i].packageprice * 1;
      }

      this.setData({
        option_active: optionid,
        option_title: option_title,
        sum: sum
      });
    },
    confirm: function () {
      var packgoods = this.packgoods;
      var index = this.index;
      var option_active = this.option_active;
      var option_title = this.option_title;
      var good = this.good;
      packgoods[index].optionname = option_title;
      good[index].optionid = option_active;
      this.setData({
        option_mask: false,
        packgoods: packgoods,
        good: good
      });
    },
    buy: function () {
      var $this = this;
      var good = this.good;
      var all = true;

      for (var i = 0; i < good.length; i++) {
        if (good[i].optionid == null) {
          all = false;
        }
      }

      if (!all) {
        foxui.toast(this, '请选择规格！');
      } else {
        good = JSON.stringify(good);
        wx.redirectTo({
          url: '/pages/order/create/index?packageid=' + $this.data.package.id + '&goods=' + good
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
/* pages/goods/package/detail/index.wxss */
.fui-list-media image {
	width:160rpx;
  height:160rpx;
}
.fui-list.goods-item .fui-list-inner {
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    min-height: 140rpx; 
    align-self: center;
}
.fui-list.goods-item .fui-list-inner .towline {
    color: #000;
    font-size: 26rpx;
    line-height: 36rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    height: auto;
}
.fui-list.goods-item .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
    width: 100%;
    position: relative;
    font-size: 26rpx;
    height: 30rpx
}
.option {
    height: 30rpx;
    -webkit-appearance: none;
    padding: 0 8rpx;
    font-size: 26rpx;
    background: #fff;
    display: inline-block;
    line-height: 30rpx;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.goods-item .fui-list-angle {
    width: auto;
    font-size: 26rpx;
    text-align: right;
    margin-left: 20rpx;
    margin-right: 0;
    color: #000;
    height: 140rpx;
    align-self: center;
    line-height:1.5;
}
.fui-list.goods-item .price {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: 48rpx;
    font-size: 24rpx;
    color: #999;
    text-align: right;
    width: 100%;
}
.fui-list.goods-item .price .marketprice{
  color: #ff5555;
  font-size: 28rpx;
  line-height: 32rpx
}
.fui-navbar .buybtn {
    background:#fd5555;
    border: 0;
    width: 240rpx
}
.fui-navbar .packagePrice{
  width: 510rpx;
  text-align: right;
  padding:0.2rem 0.5rem 0.2rem 0.5rem;
  box-sizing: border-box
}
.fui-navbar .packagePrice .subtitle {
    color: #000;
    font-size: 28rpx;
}
.fui-navbar .packagePrice .text {
    font-size: 24rpx;
    color: #999999;
}
.option-picker{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000
}
.dispatching-info {
    max-height: 800rpx;
    overflow: auto;
    margin-top: 20rpx;
}
.dispatching i{
    font-style: normal;
    display: inline-block;
    border: 1px solid #ebebeb;
    height: 48rpx;
    line-height: 48rpx;
    padding: 0 20rpx;
    font-size: 24rpx;
    margin: 4rpx;
    -webkit-border-radius: 8rpx;
    border-radius: 8rpx;
}
.dispatching-info i.active {
    border: 1px solid #ef4f4f;
    background: #ef4f4f;
    color: #fff;
}
.option-mask{
    position: fixed;
    background: rgba(0, 0, 0, 0.8) none repeat scroll 0 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
}
</style>