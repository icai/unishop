<template>
<view>
<!--pages/groups/goods/index.wxml-->
 
<view class="page" :style="(isIpx?'padding-bottom:168rpx':'')">
<!--轮播图  -->
  <swiper class="index-adcs-sqiper" indicator-dots="true" :circular="circular" :style="'width:100%;height:' + advHeight + 'rpx;'">
      <block v-for="(item, index) in data.thumb_url" :key="index">
          <swiper-item>
              <image :src="item" class="goodsadvimg"></image>          
          </swiper-item>
      </block>
  </swiper>
  <!--信息  -->
  <view class="goods-info">
    <view class="title">
       <text class="person">{{data.is_ladder==1?"阶梯团":data.groupnum + "人团"}}</text>
       <text>{{data.title}}</text>
    </view>
    <view class="subtitle">{{data.description}}</view>
    <view class="subtitle">已有{{data.fightnum}}人参团，销量{{data.sales}}件</view>
    <view class="price">
        <text class="large">￥{{data.groupsprice}}</text><text class="line">原价￥{{data.price}}</text>
        <view class="fr">邮费：{{data.freight}}</view>
    </view>
    <!--团长优惠  -->
    <view class="heads" v-if="data.isdiscount==1">
      <text class="icox icox-gengduocopy"></text><text>团长优惠</text>{{data.headstype==0?"￥"+data.headsmoney:data.headsdiscount/10 + "折"}}
    </view>
  </view>

  <!--规则  -->
    <navigator :url="'../rules/index?id=' + data.id" class="rules">
        <view class="title">拼团玩法</view>
        <view class="inner">支付开团或参团,达到人数团购成功,人数不足自动退款</view>
    </navigator>

    <!--图文详情  -->
    <view class="detail-info" v-if="wxParseData">
      <view class="title">图文详情</view>
       <view class="wxParse">
            <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
        </view>
      <!-- <rich-text style='width:750rpx' nodes="{{content}}"></rich-text> -->
    </view>

    <!--底部  -->
    <view v-if="data.stock>0" :class="'detailbtn-group flex ' + iphonexnavbar">
      <navigator class="back" url="../index/index" hover-class="none" open-type="reLaunch">
        <view class="icox icox-homepage"></view>
        <view>拼团首页</view>
      </navigator>
      <view class="detailbtn flex1" v-if="data.single==1" hover-class="none" @tap="singlebuy">
        <view class="price">￥{{data.singleprice}}</view>
        <view>单独购买</view>
      </view> 
      <navigator :url="'../join/index?id=' + data.id" class="detailbtn flex1" style="background:#ff5555" v-if="data.is_ladder==0">
        <view class="price">￥{{data.groupsprice}}</view>
        <view>{{data.groupnum}}人成团</view>
      </navigator>
      <navigator :url="'../join/index?id=' + data.id" class="detailbtn flex1 ladder" v-if="data.is_ladder==1" style="background:#ff5555">
          参加阶梯团
      </navigator>
    </view>
    <view v-if="data.stock<=0" :class="'detailbtn-group black ' + iphonexnavbar">库存不足</view>
    <view :class="(isIpx?'fui-iphonex-button':'')"></view>
    <!--提示弹窗  -->
    <!-- <view class='model'>
      <view class='box'>
        <view class='content'>您购买的商品以及更达到上限</view>
        <view class='footer'>确定</view>
      </view>
    </view> -->
</view>
<!--蒙层  -->
 <view class="layer" v-if="layershow" @tap="close"></view> 
<!--多规格弹窗  -->
 <view class="fui-modal goods-picker in goodslist" v-if="options">
  <view class="option-picker">
    <view class="option-picker-inner">
      <view class="fui-list">
        <view class="fui-list-media">
           <image class="thumb" :src="optiondata.thumb || data.thumb"></image>
        </view>
        <view class="fui-list-inner">
          <view class="subtitle">{{optiondata.title || data.title}}</view>
          <view class="price">￥{{optiondata.single_price || data.groupsprice}}</view>
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
</view></view>
</view>
</template>

<script>
// pages/groups/goods/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var times = 0;

export default {
  data() {
    return {
      goods_id: 0,
      advHeight: 1
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var $this = this;
    var $data = $this.data.data;
    return {
      title: $data.title
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

    var id = options.id;
    this.setData({
      goods_id: id
    });
    core.post('groups.goods', {
      id: id
    }, function (result) {
      $this.setData({
        data: result.data // content: result.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;" ')

      });
      parser.wxParse('wxParseData', 'html', result.data.content, $this, '0');
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
    singlebuy: function (e) {
      var $this = this; // 判断是否可以单购

      core.post('groups/goods/goodsCheck', {
        id: $this.data.goods_id,
        type: 'single'
      }, function (msg) {
        if (msg.error == 1) {
          core.alert(msg.message);
          return;
        } else {
          // 单规格
          if ($this.data.data.more_spec == 0) {
            wx.navigateTo({
              url: '/groups/pages/confirm/index?id=' + $this.data.goods_id + '&type=single'
            });
          } else {
            // 多规格
            $this.setData({
              layershow: true,
              options: true
            });
            $this.setData({
              optionarr: [],
              selectSpecsarr: []
            });
            var id = $this.data.data.id;
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
          }
        }
      });
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
        groups_goods_id: $this.data.goods_id
      }, function (result) {
        $this.setData({
          optiondata: result.data
        });
      });
    },
    buy: function (e) {
      var $this = this;
      var buyop = core.pdata(e).op,
          goods_id = $this.data.goods_id,
          optiondata = $this.data.optiondata;

      if ($this.data.optiondata) {
        if (optiondata.stock > 0) {
          wx.navigateTo({
            url: "/groups/pages/confirm/index?id=" + goods_id + "&option_id=" + optiondata.id + ' &type=single',
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
    check: function () {},
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
/* pages/groups/goods/index.wxss */
.page{
  padding-bottom: 98rpx
}
swiper-item .goodsadvimg{
  width: 100%;
  height: 100%
}
.goods-info{
  padding:14rpx 24rpx 0;
  background: #fff
}
.goods-info .title{
  font-size: 28rpx;
  line-height: 40rpx;
  color: #000;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: pre-wrap;
  
}
.goods-info .person{
  min-width: 90rpx;
  text-align: center;
  padding: 0 12rpx;
  box-shadow: 0 0 20rpx 0 rgba(255, 221, 221, 0.8);
  margin:0 10rpx;
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
.goods-info .subtitle{
  line-height: 34rpx;
  font-size: 24rpx;
  color: #999;
  margin-top: 17rpx
}
.goods-info .price{
  font-size: 24rpx;
  color: #999;
  line-height: 80rpx;
  overflow: hidden
}
.fr{
  float: right
}
.goods-info .price text{
  float: left
}
.price .large{
  font-size: 40rpx;
  font-weight: bold;
  color: #ff5555
}
.goods-info .price .line{
  font-size: 22rpx;
  color: #b2b2b2;
  font-weight: bold;
  text-decoration: line-through;
  margin-left: 14rpx
}
/*团长优惠  */
.heads{
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  color: #ff5555;
  font-size: 26rpx;
  border-top: 1px solid #ededed
}
.heads.heads text{
  color: #333;
}
.heads.heads .icox{
  color: #ff5555;
  font-size: 32rpx;
  vertical-align: middle;
  margin-right: 6rpx
}
.rules{
  padding: 15rpx 50rpx 10rpx 24rpx;
  background: #fff;
  margin-top: 20rpx;
  line-height: 56rpx;
  font-size: 26rpx;
  color: #333;
  position: relative
}
.rules .inner{
  color: #999
}
.rules:after{
  content: " ";
	display: inline-block;
	transform: rotate(45deg);
	height: 14rpx;
	width: 14rpx;
	border-width: 1px 1px 0 0;
	border-color: #999;
	border-style: solid;
	position: absolute;
	top: 68rpx;
  right: 24rpx;
}
/*图文详情  */
.detail-info{
  background: #fff;
}
.detail-info .title{
  height: 90rpx;
  line-height: 90rpx;
  position: relative;
  background: #fff;
  margin-top: 20rpx;
  padding: 0 24rpx;
}
.detail-info .title:after{
  position: absolute;
  content: '';
  border-top: 1px solid #ededed;
  left: 24rpx;
  right: 24rpx;
  bottom: 0
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
  padding: 15rpx 0 9rpx;
  font-size: 22rpx;
  line-height: 36rpx
}
.detailbtn-group .detailbtn .price{
  font-size: 32rpx;
  line-height: 38rpx;
  font-weight: bold
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
.detailbtn-group.black{
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: center;
  line-height: 98rpx
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
.wxParse-td {
  text-align: left !important
}
.wxParse-video {
  text-align: center !important;
}
</style>