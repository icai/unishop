<template>
<view>
<!--pages/groups/join/index.wxml-->
<view class="join">
  <view class="goodsinfo flex">
    <image :src="data.thumb"></image>
    <view class="inner flex1">
      <view class="title">{{data.title}}</view>
      <view> <text class="person">{{data.is_ladder==1?"阶梯团":data.groupnum + "人团"}}</text></view>
      <view class="price">￥{{data.groupsprice}}/{{data.goodsnum}}{{data.units}} <text class="fr">已有{{data.fightnum}}人参团</text></view>
    </view>
  </view>
  <!--流程  -->
  <view class="process">
    <text class="icox icox-1"></text>下单开团/参团 <text class="line">--------</text><text class="icox icox-2"></text>邀请好友参团 <text class="line">--------</text><text class="icox icox-3"></text>人满拼团成功
  </view>
  <view class="operation">
    <view class="text">支付开团并邀请好友参加,人数不足自动退款</view>
    <view class="btn btn-danger-o" :data-type="(data.is_ladder==1?'ladder':'normal')" data-op="join" @tap="joinTeam">我要参团</view>
    <view :data-type="(data.is_ladder==1?'ladder':'normal')" class="btn btn-danger" @tap="joinTeam" data-op="creat">我要开团</view> 
  </view>

  <!--更多好团  -->
  <view class="more">更多好团</view>
  <view class="fui-goods-group block">
    <view class="fui-goods-item" v-for="(item, index) in teams" :key="index">
      <navigator hover-class="none" :url="'../goods/index?id=' + item.id">
        <view class="image" :style="'background-image:url(' + item.thumb + ')'"></view>
        <view class="detail goods_list_detail">
          <view class="name">
          <text>{{item.title}}</text>
          </view>
        <view class="price">
          <view class="text">¥{{item.groupsprice}}</view>
          <text>{{item.teamnum}}人参团</text> 
        </view>
      </view>
      </navigator>
    </view>
  </view>
</view>
<!--蒙层  -->
 <view class="layer" v-if="layershow" @tap="close"></view> 
<!--阶梯团弹窗  -->
 <view class="chosenum" v-if="chosenum">
  <view class="title">请选择拼团人数 <text class="price" v-if="ladder_price">￥{{ladder_price}}</text></view>
  <view class="num">
    <view v-for="(item, index) in ladder" :key="index" :class="(index==selectindex?'active':'')" @tap="chosenum" :data-index="index" :data-goodsid="item.goods_id" :data-price="item.ladder_price" :data-id="item.id">{{item.ladder_num}}人团</view>
  </view>
  <navigator @tap="ladder_buy" class="btn btn-danger">确定</navigator>
  <view class="close icox icox-guanbi-copy" @tap="close"></view>
</view> 
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
          <view class="price">￥{{optiondata.price || data.groupsprice}}</view>
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
      <view class="btn btn-danger block" @tap="buy" :data-op="op">{{optiondata.stock<=0?"库存不足":"确定"}}< view>
      </=0?"库存不足":"确定"}}<></view>
  </view>
  <view class="icox icox-guanbi-copy" style="color:#fff;text-align:center;font-size:60rpx;margin-top:30rpx;" @tap="close"> </view> 
</view>
  

</view>
</view>
</template>

<script>
// pages/groups/join/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');
var times = 0;

export default {
  data() {
    return {
      layershow: false,
      chosenum: false,
      options: false,
      optionarr: [],
      selectSpecsarr: [],
      goods_id: 0
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
  onShow: function () {
    app.checkAuth();
  },

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
    this.setData({
      goods_id: id
    });
    core.get('groups.goods.openGroups', {
      id: id
    }, function (result) {
      $this.setData({
        data: result.data,
        teams: result.teams,
        ladder: result.ladder
      });
    });
  },
  components: {},
  props: {},
  methods: {
    joinTeam: function (e) {
      // app.checkAuth();
      var $this = this;
      var types = core.pdata(e).type;
      var op = core.pdata(e).op;
      $this.setData({
        optionarr: [],
        selectSpecsarr: []
      });

      if (op == 'creat') {
        $this.setData({
          op: 'creat'
        });
      } else {
        $this.setData({
          op: ''
        });
      }

      if (types == 'ladder') {
        var id = $this.data.data.id;
        core.get('groups.goods.goodsCheck', {
          id: id,
          type: "group"
        }, function (result) {
          if (result.error == 0) {
            $this.setData({
              layershow: true,
              chosenum: true
            });
          } else {
            wx.showToast({
              title: result.message,
              icon: 'none',
              duration: 2000
            });
          }
        });
      } else {
        if ($this.data.data.more_spec == 0) {
          var id = $this.data.data.id;
          core.get('groups.goods.goodsCheck', {
            id: id,
            type: "group"
          }, function (result) {
            if (result.error == 0) {
              if (op == 'creat') {
                wx.navigateTo({
                  url: '/groups/pages/confirm/index?type=groups&id=' + id + "&heads=1"
                });
              } else {
                core.get('groups.goods.check_tuan', {
                  id: id,
                  type: "group"
                }, function (result) {
                  if (result.data.order_num <= 0) {
                    core.alert('暂无拼团');
                    return;
                  }

                  wx.navigateTo({
                    url: '/groups/pages/jointeam/index?id=' + id
                  });
                });
              }
            } else {
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000
              });
            }
          });
        } else {
          var id = $this.data.data.id;
          core.get('groups.goods.goodsCheck', {
            id: id,
            type: "group"
          }, function (result) {
            if (result.error == 0) {
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
            } else {
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    },
    chosenum: function (e) {
      var selectindex = core.pdata(e).index;
      var id = core.pdata(e).goodsid;
      var ladder_id = core.pdata(e).id;
      var ladder_price = core.pdata(e).price;
      this.setData({
        selectindex: selectindex,
        id: id,
        ladder_id: ladder_id,
        ladder_price: ladder_price
      });
    },
    close: function () {
      var $this = this;
      $this.setData({
        layershow: false,
        chosenum: false,
        options: false
      });
    },
    ladder_buy: function () {
      var $this = this;

      if (!$this.data.ladder_id) {
        core.alert('请选择拼团人数');
        return;
      }

      if (this.op != 'creat') {
        core.get('groups.goods.check_tuan', {
          id: $this.data.goods_id,
          ladder_id: $this.data.ladder_id
        }, function (result) {
          if (result.data.ladder_num <= 0) {
            core.alert('暂无拼团');
            return;
          }

          wx.navigateTo({
            url: "/groups/pages/jointeam/index?id=" + $this.data.goods_id + "&ladder_id=" + $this.data.ladder_id,
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
        wx.navigateTo({
          url: "/groups/pages/confirm/index?id=" + $this.data.goods_id + "&heads=1&type=groups&ladder_id=" + $this.data.ladder_id,
          success: function () {
            $this.setData({
              layershow: false,
              chosenum: false,
              options: false
            });
          }
        });
      }

      this.close();
    },
    //选规格
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
        if (buyop == 'creat') {
          if (optiondata.stock > 0) {
            wx.navigateTo({
              url: "/groups/pages/confirm/index?id=" + goods_id + "&heads=1&type=groups&option_id=" + optiondata.id,
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
          if (optiondata.stock > 0) {
            core.get('groups.goods.check_tuan', {
              id: goods_id,
              type: "group"
            }, function (result) {
              if (result.data.order_num <= 0) {
                core.alert('暂无拼团');
                return;
              }

              wx.navigateTo({
                url: "/groups/pages/jointeam/index?id=" + goods_id + "&option_id=" + optiondata.id,
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
        }
      } else {
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 2000
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
/* pages/groups/join/index.wxss */
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
.operation{
  background: #fff;
  text-align: center;
  font-size: 26rpx;
  color: #333;
  padding-bottom: 50rpx
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
/*更多好团  */
.join .more{
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999;
  font-weight: bold
}
.fui-goods-group.block{
  padding: 0
}
.fui-goods-group.block .fui-goods-item{
  padding: 0;
  margin-bottom: 16rpx
}
.fui-goods-group.block .fui-goods-item .detail {
  padding:8rpx 24rpx
}
.fui-goods-group.block .fui-goods-item:nth-of-type(2n-1){
  padding-right: 8rpx
}
.fui-goods-group.block .fui-goods-item:nth-of-type(2n){
  padding-left: 8rpx
}
.fui-goods-item .detail .price text{
  font-size: 24rpx;
  color: #b2b2b2
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
/*阶梯团弹窗  */
.chosenum{
  width: 660rpx;
  height: auto;
  border-radius: 10rpx;
  background: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  margin-top: -50rpx;
  margin-left: -330rpx;
  z-index: 101;
  padding: 0 36rpx 30rpx;
  box-sizing: border-box;
  
}
.chosenum .title{
  line-height: 126rpx;
  color: #333;
  font-size: 28rpx;
}
.chosenum .title .price{
 font-size:30rpx;
  line-height:30rpx;
  color:#ff5555;
  
}
.chosenum .num{
  max-height: 385rpx;
  min-height: 200rpx;
  overflow: auto
}
.chosenum .num view{
  float: left;
  width: 120rpx;
  height: 54rpx;
  border-radius: 10rpx;
  line-height: 54rpx;
  text-align: center;
  font-size: 24rpx;
  color: #333;
  margin-right: 36rpx;
  background: #f7f7f7;
  margin-bottom: 30rpx;
}
.chosenum .num view:nth-of-type(4n){
  margin-right: 0
}
.chosenum .num view.active{
  background: #ff5555;
  color: #fff
}
.chosenum .btn{
  width: 100%;
  height: 84rpx;
  line-height: 84rpx;
  margin-bottom: 0
}
.chosenum .close{
  position: absolute;
  bottom: -110rpx;
  color: #fff;
  font-size: 70rpx;
  left: 50%;
  margin-left: -25rpx
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