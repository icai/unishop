<template>
<view>
<!--pages/member/cart/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="model" v-if="modelShow">
  <view class="inner">
		<view class="title">用户未授权</view>
		<view class="image"><image :src="imgUrl + 'plugin/app/static/images/wxapp/shouquan.png'"></image></view>
		<view class="subtitle">您需要先开启【用户信息】，才能使用此功能哦~</view>
		<view class="model-btns">
			<view class="cancel" @tap="cancelclick">取消</view>
			<view class="confirm" @tap="confirmclick">去设置</view>
		</view>
	</view>
	<!-- <include src="/pages/index/openauth.wxml"/> -->
</view>
<view class="page footer-navbar" v-if="show">
    <view class="fui-cell-group  cartlist" @tap="edit" v-if="!empty">
      <navigator class="fui-cell edit" v-if="!edit" data-action="edit">编辑</navigator>
      <navigator class="fui-cell edit" v-if="edit" data-action="complete">完成</navigator>
    </view>
    <block v-for="(item, index) in merch_list" :key="index">
        <view class="fui-cell-group fui-cell-click">
            <navigator class="fui-cell" hover-class="none" :url="'/pages/index/index?merchid=' + item.merchid" open-type="switchTab">

                <view class="fui-cell-icon"><text class="icox icox-dianpu1"></text> </view>
                <view class="fui-cell-text">{{ item.merchname?item.merchname:'自营商品' }}</view>
                <view class="fui-cell-remark"></view>
            </navigator>
        </view>
        <view class="fui-list-group cartlist" v-for="(val, index2) in item.list" :key="index2">
            <view class="fui-list noclick">
                <radio color="#ff5555" class="zoom-80" v-if="!edit" :checked="( val.selected==1?true:'' )" @tap="selected" :data-id="val.id" :data-select="val.selected"></radio>
                <radio color="#ff5555" class="zoom-80" v-if="edit" :checked="( edit_list[val.id]?true:'' )" @tap="edit_list" :data-id="val.id"></radio>
                <view class="fui-list-media" :data-url="'/pages/goods/detail/index?id=' + val.goodsid" @tap="url">
                    <image class :src="val.thumb"></image>
                </view>
                <view class="fui-list-inner">
                   <navigator :data-url="'/pages/goods/detail/index?id=' + val.goodsid" @tap="url">
                    <view class="text">{{ val.title }}</view>
                    <view class="subtitle cart-option" v-if="val.optionid!=0">
                        <view class="choose-option">{{ val.optiontitle }}</view>
                    </view>
                  </navigator>
                  <view class="price">
                      <text class="bigprice">
                          <text class="text-danger">¥{{ val.marketprice }}</text>
                          <text class="productprice" v-if="val.productprice > val.marketprice">¥{{ val.productprice }}</text>
                      </text>
                      <view class="fui-number small" @tap="number" :data-min="val.minbuy" :data-value="val.total" :data-max="val.totalmaxbuy" :data-id="val.id" :data-optionid="val.optionid">
                          <view :class="'minus ' + ( val.total<=1?'disabled':'' )" data-action="minus">-</view>
                          <input class="num shownum" type="tel" name :value="val.total" disabled></input>
                          <view :class="'plus ' + ( val.total>=val.totalmaxbuy?'disabled':'' )" data-action="plus">+</view>
                      </view>
                  </view>
                </view>
            </view>
        </view>
    </block>

    <view class="fui-cell-group fui-cell-click" v-if="list.length>0">
        <navigator class="fui-cell" hover-class="none">


             <view class="fui-cell-icon"><text class="icox icox-dianpu1"></text> </view>
            <view class="fui-cell-text">自营商品</view>
            <view class="fui-cell-remark"></view>
        </navigator>
    </view>
    <view class="fui-list-group cartlist" v-for="(val, index) in list" :key="index">
        <view class="fui-list noclick">
            <radio color="#ff5555" class="zoom-80" v-if="!edit" :checked="( val.selected==1?true:'' )" @tap="selected" :data-id="val.id" :data-select="val.selected"></radio>
            <radio color="#ff5555" class="zoom-80" v-if="edit" :checked="( edit_list[val.id]?true:'' )" @tap="edit_list" :data-id="val.id"></radio>
            <view class="fui-list-media">
                <image class :src="val.thumb"></image>
            </view>
            <view class="fui-list-inner">
                <navigator :data-url="'/pages/goods/detail/index?id=' + val.goodsid" @tap="url"> 
                    <view class="text">{{ val.title }}</view>
                    <view class="subtitle cart-option" v-if="val.optionid!=0">
                        <view class="choose-option">{{ val.optiontitle }}</view>
                    </view>
                </navigator>
                <view class="price">
                    <text class="bigprice text-danger">¥{{ val.marketprice }}</text>
                    <view class="fui-number small" @tap="number" :data-min="val.minbuy" :data-value="val.total" :data-max="val.totalmaxbuy" :data-id="val.id" :data-optionid="val.optionid">
                        <view :class="'minus ' + ( val.total<=1?'disabled':'' )" data-action="minus">-</view>
                        <input class="num shownum" type="tel" name :value="val.total" disabled></input>
                        <view :class="'plus ' + ( val.total>=val.totalmaxbuy?'disabled':'' )" data-action="plus">+</view>
                    </view>
                </view>
            </view>
           
        </view>
    </view>

    <view class="center" v-if="empty">
        <view class="empty">
            <image src="/static/images/icon/nogoods.png" class="light"></image>
            <view class="text-cancel">您的购物车中没有商品哦！</view>
            <navigator class="btn btn-danger-o" url="/pages/index/index" open-type="switchTab">去首页逛逛吧</navigator>
        </view>
    </view>

        <view class="fui-footer" v-if="!empty">
            <view class="tool">
                <view class="check">
                    <label @tap="checkall" v-if="!edit"><radio color="#ef4f4f" class="zoom-80" style="margin-right:20rpx" :checked="( ischeckall?true:'' )"></radio>全选</label>
                    <label @tap="editcheckall" v-if="edit" :data-check="( editcheckall?true:false )"><radio color="#ef4f4f" class="zoom-80" style="margin-right:20rpx" :checked="( editcheckall?true:'' )"></radio>全选</label>
                </view>
                <view class="text">
                    <block v-if="!edit">
                        <view class="title">合计：<text class="text-danger">{{ totalprice }}元</text></view>
                        <view class="subtitle">不含运费</view>
                    </block>
                </view>
                <view class="btns" @tap="edit">
                    <text :class="'btn btn-warning ' + ( editischecked?'':'disabled' )" v-if="edit" data-action="move">移到关注</text>
                    <text :class="'btn btn-danger ' + ( editischecked?'':'disabled' )" v-if="edit" data-action="delete">删除</text>

                    <text :class="'btn btn-danger ' + ( total?'':'disabled' )" v-if="!edit" data-action="pay" style="width:200rpx">结算({{ total }})</text>
                </view>
            </view>
        </view>

        <!--公用底部菜单-->
        <include src="/pages/common/menu.wxml"></include>
</view>
</view>
</template>

<script>
/**
 *
 * member/cart/index.js
 *
 * @create 2017-1-5
 * @author Young
 *
 * @update  Young 2017-01-10
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      route: 'cart',
      icons: app.requirejs('icons'),
      merch_list: false,
      list: false,
      edit_list: [],
      modelShow: false
    };
  },

  onShareAppMessage: function () {
    return core.onShareAppMessage();
  },
  onShow: function () {
    this.get_cart();
    var $this = this;
    $this.setData({
      imgUrl: app.globalData.approot
    });
    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        $this.setData({
          limits: limits
        });

        if (!limits) {// $this.setData({modelShow: true})
        }
      }
    });
  },
  onLoad: function (options) {
    app.checkAuth();
    var $this = this;
    core.get('black', {}, function (res) {
      if (res.isblack) {
        wx.showModal({
          title: '无法访问',
          content: '您在商城的黑名单中，无权访问！',
          success: function (res) {
            if (res.confirm) {
              $this.close();
            }

            if (res.cancel) {
              $this.close();
            }
          }
        });
      }
    });
    app.url(options);
  },
  components: {},
  props: {},
  methods: {
    get_cart: function () {
      var $this = this,
          setData;
      core.get('member/cart/get_cart', {}, function (data) {
        setData = {
          show: true,
          ismerch: false,
          ischeckall: data.ischeckall,
          total: data.total,
          cartcount: data.total,
          totalprice: data.totalprice,
          empty: data.empty || false
        };

        if (typeof data.merch_list == 'undefined') {
          setData.list = data.list || [];
          $this.setData(setData);
        } else {
          setData.merch_list = data.merch_list || [];
          setData.ismerch = true;
          $this.setData(setData);
        }
      });
    },
    edit: function (e) {
      var $this = this;

      if (!$this.data.limits) {
        // $this.setData({ modelShow: true })
        return;
      }

      var dataset = core.data(e),
          $this = this,
          ids;

      switch (dataset.action) {
        case 'edit':
          this.setData({
            edit: true
          });
          break;

        case 'complete':
          this.allgoods(false);
          this.setData({
            edit: false
          });
          break;

        case 'move':
          ids = this.checked_allgoods().data;

          if (!$.isEmptyObject(ids)) {
            core.post('member/cart/tofavorite', {
              ids: ids
            }, function (data) {
              $this.get_cart();
            });
          }

          break;

        case 'delete':
          ids = this.checked_allgoods().data;

          if (!$.isEmptyObject(ids)) {
            core.confirm('是否确认删除该商品?', function () {
              core.post('member/cart/remove', {
                ids: ids
              }, function (data) {
                $this.get_cart();
              });
            });
          }

          break;

        case 'pay':
          if (this.total > 0) {
            wx.navigateTo({
              url: '/pages/order/create/index'
            });
          }

          break;
      }
    },
    checkall: function (e) {
      core.loading();
      var $this = this,
          select = this.ischeckall ? 0 : 1;
      core.post('member/cart/select', {
        id: 'all',
        select: select
      }, function (data) {
        $this.get_cart();
        core.hideLoading();
      });
    },
    update: function (e) {
      var $this = this,
          select = this.ischeckall ? 0 : 1;
      core.post('member/cart/select', {
        id: 'all',
        select: select
      }, function (data) {
        $this.get_cart();
      });
    },
    number: function (e) {
      var $this = this,
          dataset = core.pdata(e),
          val = foxui.number(this, e),
          id = dataset.id,
          optionid = dataset.optionid;

      if (val == 1 && dataset.value == 1 && e.target.dataset.action == 'minus' || dataset.value == dataset.max && e.target.dataset.action == 'plus') {
        return;
      }

      core.post('member/cart/update', {
        id: id,
        optionid: optionid,
        total: val
      }, function (data) {
        $this.get_cart();
      });
    },
    selected: function (e) {
      core.loading();
      var $this = this,
          dataset = core.pdata(e),
          id = dataset.id,
          select = dataset.select == 1 ? 0 : 1;
      core.post('member/cart/select', {
        id: id,
        select: select
      }, function (data) {
        $this.get_cart();
        core.hideLoading();
      });
    },
    allgoods: function (check) {
      var edit_list = this.edit_list;

      if (!$.isEmptyObject(edit_list) && typeof check == 'undefined') {
        return edit_list;
      }

      check = typeof check == 'undefined' ? false : check;

      if (this.ismerch) {
        for (var i in this.merch_list) {
          for (var ii in this.merch_list[i].list) {
            edit_list[this.merch_list[i].list[ii].id] = check;
          }
        }
      } else {
        for (var i in this.list) {
          edit_list[this.list[i].id] = check;
        }
      }

      return edit_list;
    },
    checked_allgoods: function () {
      var allgoods = this.allgoods(),
          data = [],
          cartcount = 0;

      for (var ii in allgoods) {
        if (allgoods[ii]) {
          data.push(ii);
          cartcount++;
        }
      }

      return {
        data: data,
        cartcount: cartcount
      };
    },
    editcheckall: function (e) {
      var check = core.pdata(e).check,
          edit_list = this.allgoods(!check);
      this.setData({
        edit_list: edit_list,
        editcheckall: !check
      });
      this.editischecked();
    },
    editischecked: function () {
      var editischecked = false,
          editcheckall = true,
          allgoods = this.allgoods();

      for (var i in this.edit_list) {
        if (this.edit_list[i]) {
          editischecked = true;
          break;
        }
      }

      for (var ii in allgoods) {
        if (!allgoods[ii]) {
          editcheckall = false;
          break;
        }
      }

      this.setData({
        editischecked: editischecked,
        editcheckall: editcheckall
      });
    },
    edit_list: function (e) {
      var dataset = core.pdata(e),
          edit_list = this.edit_list;

      if (typeof edit_list[dataset.id] != 'undefined' && edit_list[dataset.id] == 1) {
        edit_list[dataset.id] = false;
      } else {
        edit_list[dataset.id] = true;
      }

      this.setData({
        edit_list: edit_list
      });
      this.editischecked();
    },
    url: function (e) {
      var data = core.pdata(e);
      wx.navigateTo({
        url: data.url
      });
    },

    /*用户授权-取消*/
    cancelclick: function () {
      this.setData({
        modelShow: false
      });
      wx.switchTab({
        url: '/pages/index/index'
      });
    },

    /*用户授权-去设置*/
    confirmclick: function () {
      this.setData({
        modelShow: false
      });
      wx.openSetting({
        success: function (res) {}
      });
    },
    close: function () {
      app.globalDataClose.flag = true;
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } // userinfo:function(e){
    //   var $this = this;
    //   app.getUserInfo(function(){
    //     $this.onShow();
    //   });
    // }
    ,
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
@import "../../../static/css/order.css";
/* @import "../../index/openauth.css"; */
/*商品列表*/
.cartlist{
    margin-top: -2rpx;
}
.price{
    text-align: right;
    display: inline-block;
    width: 100%;
    color: #999;
    font-size: 26rpx;
}
.left{
    left: -100rpx
}
checkbox{
    padding-right:20rpx
}
.empty{
    padding:260rpx 150rpx;
}
.empty .btn{
    margin: 0;
    border-radius: 100rpx;
    height: 76rpx;
    line-height:76rpx;
    width:  280rpx;
    font-size: 30rpx;
    padding:0
}
.light{
    height: 240rpx;
    width: 240rpx
}
.text-cancel{
    padding:10rpx;
    margin-bottom:30rpx;
    margin-top:25rpx;
    font-size: 30rpx;
}
.fui-list-inner .car_subtitle {
position:relative;
font-size:26rpx;
color:#444;
}
.fui-list-angle {
margin-right:0;

}
.fui-list{
  align-items: flex-start
}
.fui-list radio{
  align-self: center;
  margin-right: 20rpx
}
.fui-list-inner{
    min-height: 170rpx;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    -webkit-flex-direction: column;
        -ms-flex-direction: column;
    flex-direction: column;
    justify-content: space-between
}
.fui-list-inner .price{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
}
.fui-list-inner .bigprice{
  display: flex;
  align-items: center
}
.fui-list-inner .price .productprice {
    padding-left: 10rpx;
    text-decoration: line-through;
    color: #999;
    font-size: 24rpx;
}

.fui-list-inner .subtitle.cart-option{
    color: #999;
}
.btns .btn{
    border-radius: 0;
    height: 98rpx;
    line-height: 98rpx;
    color: #fff;
    margin: 0;
    margin-left: .05rem;
    text-align: center;
    width: 160rpx;
}
.fui-footer{
  height: 98rpx
}
.fui-footer .tool {
    padding-right: 0;
    height: 98rpx
}
.fui-footer .tool label{
    display: flex;
    align-items: center
}
.fui-footer .tool .text {
    text-align: right
}
.fui-cell-group .fui-cell.edit{
align-items:flex-end;
background:#f8f8f8;
flex-direction:column;
font-size:28rpx;

}
.page .fui-cell-group:nth-of-type(2){
  margin-top: 0
}

/*授权弹窗*/
.model{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1009;
}
.model .inner{
	width: 624rpx;
	height: 600rpx;
	background: #fff;
	border-radius: 8rpx;
	margin: 260rpx auto;
	overflow: hidden;
}
.model .inner .title{
	font-size: 36rpx;
	color: #000;
	line-height: 100rpx;
	text-align: center;
	font-weight: 600;
    margin-top: 20rpx;
}
.model .inner .image{
  text-align: center;
  margin-top: 20rpx;
}
.model .inner image{
	width: 342rpx;
	height: 202rpx
}
.model .inner .subtitle{
	margin-top: 50rpx;
	padding: 0 80rpx;
	color: #888;
	font-size: 26rpx;
	line-height: 40rpx;
}
.model-btns{
	border-top: 1rpx solid #ebebeb;
	height: 100rpx;
	margin-top: 28rpx;
	display: flex;
	text-align: center;
	font-size: 30rpx;
	color: #000;
	line-height: 100rpx;
}
.model-btns .cancel{
	width: 50%;
	position: relative;
}
.model-btns .cancel:after{
	content: " ";
	position: absolute;
	top: -1rpx;
	right: 0;
	width: 1px;
	height: 210rpx;
	border-right: 1px solid #ebebeb;
	color: #ebebeb;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.model-btns .confirm{
	width: 50%;
	color: #50b33c;
}
</style>