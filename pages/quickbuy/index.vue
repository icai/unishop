<template>
<view>
<!--pages/mall_index/mall_index.wxml-->
<!-- 变换的三种样式class：无 changeCss2 changeCss3 -->

<!-- 头像的三种样式：无,circle,round -->
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
<view :class="'marb20 ' + style" v-if="main.template==1">


  <view class="banner">
    <image :src="main.style.shopbg"></image>
    <view class="shopMsg">
      <image :src="main.style.shoplogo"></image>
      <view>
        <view :style="'color: ' + main.style.namecolor">{{main.sysset.shopname?main.sysset.shopname:'店铺名称'}}</view>
          <view v-if="main.style.notice" :style="'color: ' + main.style.noticecolor" class="flex">
          
            <!-- <view>店铺公告：</view> -->
            
            <swiper indicator-dots="false" vertical="true" autoplay="true" circular="true">
              <block v-for="(item, unique) in main.notices" :key="unique">
                <swiper-item>
                  <view>店铺公告：{{item.title}}</view>
                </swiper-item>
              </block>
            </swiper>
          </view>
      </view>
    </view>
  </view>

  <view class="navTop flex" :style="'background-color: ' + main.style.menubg">
    <view v-for="(item, unique) in main.shopmenu" :key="unique" :data-url="item.linkurl" @tap="menunavigage">
      <icon :class="'icox ' + item.icon" :style="'color: ' + main.style.menuicon"></icon>
      <view :style="'color: ' + main.style.menutext">{{item.text}}</view>
    </view>
  </view>


</view>

<include src="/pages/common/goods-picker.wxml"></include>





 <view :class="'fui-mask ' + ( showPicker?'show':'')" @tap="closemulti"></view> 
<!-- <view class="nav-mask" style="{{active?'display:block':''}}" bindtap='emptyActive'></view> -->

<view :class="(main.template != 0 ? 'flex main':'flex main padbot')">


  <scroll-view scroll-y class="left" :style="'background-color:' + main.style.catebg">
  
    <view v-for="(item, unique) in group" :key="unique" :style="'color: ' + (arrLab[index]?main.style.cateactivecolor:main.style.catecolor)" :class="(arrLab[index]?'active leftItem':'leftItem')" @tap="clickLab" :data-id="index">

      
      <view :style="'color: ' + (arrLab[index]?main.style.cateactivecolor:main.style.catecolor)">{{item.title}}</view>  
      
    </view>
  </scroll-view>
  <scroll-view @scroll="scrollfn" scroll-y class="right2" scroll-with-animation="true" :scroll-into-view="'num'+id" :style="'background-color: ' + main.style.goodsbg">

  <!-- banner幻灯片 -->
  <swiper class="bigimg" indicator-dots="true" autoplay="true" v-if="main.advs" circular="true">
    <block v-for="(item, unique) in main.advs" :key="unique">
      <swiper-item>
        <image :src="item.thumb" mode="aspectFit" class="slide-image" @tap="gobigimg" :data-link="item.link"></image>
      </swiper-item>
    </block>
  </swiper>

    <view :id="'num' + index" v-for="(item, unique) in group" :key="unique">
      <view class="tit" :style="'color: ' + main.style.righttitle">{{item.title}}</view>

      <view v-if="main.template == 0" class="subtit">{{item.desc}}</view>

       <!-- <view class='bigImg' wx:for="main.advs" wx:key="unique">
        <image src='../../../../img/bg.jpg' mode='center'></image>
      </view> -->


      

      <view v-if="goodsArr[item.type].length==0||!goodsArr[item.type]" class="nogoods"><icon class="icox icox-footprint"></icon>  该分组暂时没有商品哦</view>

      <view class="goodsList flex" v-for="(goods, unique) in goodsArr[item.type]" :key="unique">
        <navigator open-type="navigate" hover-class="none" :url="'/pages/goods/detail/index?id=' + goods.id"><image :src="goods.thumb"></image></navigator>
        <view>
          <navigator open-type="navigate" hover-class="none" :url="'/pages/goods/detail/index?id=' + goods.id" class="height">
            <view :style="'color:' + main.style.goodstitile">{{goods.title}}</view>
             <view :style="'color:' + main.style.goodssubtitile">{{goods.subtitle}}</view> 
          </navigator>
          <view :style="'color:' + main.style.goodsprice">￥{{goods.marketprice}}<i :style="'color:' + main.style.goodssales">月销{{goods.sales}}</i></view>
        </view>
        <!-- 加减购物车，与购物车弹出层公用变量控制 -->
        <view class="addShopCar flex">
        <!-- 减号 -->
          <icon class="icox icox-offline" v-if="numtotal[goods.id]&&numtotal[goods.id]!=-1" @tap="addGoodToCartFn" :data-id="goods.id" :data-more="goods.hasoption" data-buytype="cart" :style="'color: ' + main.style.goodscart" data-add="reduce" :data-min="goods.minbuy" :data-num="((numtotal[goods.id]>0||numtotal[goods.id]==0)&&(numtotal[goods.id]!=null)?numtotal[goods.id]:goods.cartTotal)"></icon>
          
          <text v-if="numtotal[goods.id]&&numtotal[goods.id]!=-1">{{numtotal[goods.id]}}</text>
          
          <!-- 加号 -->
          <icon :data-maxnum="goods.maxbuy" :data-store="goods.totalmaxbuy" class="icox icox-addition_fill" @tap="addGoodToCartFn" :data-more="goods.hasoption" :data-id="goods.id" data-buytype="cart" :style="'color: ' + ((numtotal[goods.id]==(goods.maxbuy==0?goods.total:goods.maxbuy)?'#ccc':main.style.goodscart))" data-add="value" :data-color="(!goods.canAddCart?'#ccc':(numtotal[goods.id]==(goods.maxbuy==0?goods.total:goods.maxbuy)?'#ccc':main.style.goodscart))" :data-diyformtype="goods.diyformtype" :data-canadd="goods.canAddCart"></icon>

          

        </view>
      </view>




    </view>
  </scroll-view>
</view>

<!-- 购物车 -->
<view v-if="main.template == 1" class="shopCar" @tap="gotocart" :style="'color: ' + (main.style.footercart?main.style.footercart:'#fa4040') + ';background-color: ' + main.style.footercart">
  <icon class="shopCarImg icox icox-cartfill" :style="'color: ' + main.style.footercarticon"></icon>
  <i v-if="main.cartList.total"></i>
</view> 

<!-- 底部footer购物车 -->
  <view v-if="main.template == 0" class="shopCar2 footercart">
    <view class="carIcon" @tap="shopCarList">
    <icon class="shopCarImg icox icox-cartfill"></icon>
      <i v-if="main.cartList.total">{{main.cartList.total}}</i>
    </view>
    <view class="total">
      <view>￥{{main.cartList.totalprice}}</view>
      <view>优惠信息请至结算页面查看</view>
    </view>
    <view @tap="gopay">去结算</view>
  </view>

<!-- 黑色半透view大, clickCar值为false时隐藏 -->
<view :class="(clickCar?'shopCarList':'shopCarList displayNo')">
<view style="flex:1" @tap="shopCarHid"></view>
<!-- 靠下部分购物车列表 -->
<view>
  <view class="flex scListTit">
    <text>购物车</text>
    <text @tap="clearShopCartFn">清空</text>
  </view>

  <!-- for循环购物车商品列表 -->
  <scroll-view scroll-y class="footerList">
    <view v-for="(goods, unique) in main.cartList.list" :key="unique" class="carList" v-if="cartcartArr[goods.optionid=='0'?goods.goodsid:goods.optionid]!=0">
      <view class="goodsMsg">
        <view>{{goods.title}}</view>
         <view>{{goods.optiontitle?goods.optiontitle:''}}</view> 
      </view>
      <!-- 加减购物车 -->
      <view class="addShopCar flex">
        <!-- <icon class='icox icox-offline' bindtap="sub"></icon>
        <text>{{item.total}}</text>
        <icon class='icox icox-addition_fill' bindtap="getCart"></icon> -->





<!-- 减号 -->
          <icon class="icox icox-offline" :data-min="goods.minbuy" @tap="cartaddcart" :data-id="goods.optionid" :data-goodsid="goods.goodsid" data-add="reduce" :data-num="(cartcartArr[goods.optionid=='0'?goods.goodsid:goods.optionid]>0?cartcartArr[goods.optionid=='0'?goods.goodsid:goods.optionid]:goods.total)"></icon>
          
          <text>{{cartcartArr[goods.optionid=='0'?goods.goodsid:goods.optionid]>0?cartcartArr[goods.optionid=='0'?goods.goodsid:goods.optionid]:goods.total}}</text>
          
          <!-- 加号 -->
          <icon :data-maxnum="goods.maxbuy" :data-store="goods.stock" :data-goodsid="goods.goodsid" class="icox icox-addition_fill" @tap="cartaddcart" :data-id="goods.optionid" data-add="add"></icon>








      </view>
      <view class="money">￥{{goods.marketprice}}</view>
    </view>
    <text v-if="!main.cartList.list.length" class="noGoods">暂时没有商品喔~</text>
  </scroll-view>
  <!-- for循环结束 -->

  <view class="tips" v-if="main.cartList.list.length">Tips：加入购物车后请尽快下单哦~</view>

  <!-- 底部footer -->
  <view class="shopCar2">
    <view class="carIcon" @tap="shopCarHid">
    <icon class="shopCarImg icox icox-cartfill"></icon>
      <i v-if="main.cartList.list.length">{{main.cartList.total}}</i>
    </view>
    <view class="total">
      <view>￥{{main.cartList.totalprice}}</view>
      <view>优惠信息请至结算页面查看</view>
    </view>
    <view @tap="gopay">去结算</view>
  </view>
</view>
</view>

<!-- 加购物车小按钮动画 -->
<view class="good_box" :hidden="hide_good_box" :style="'left: ' + bus_x + 'px; top: ' + bus_y + 'px;'"></view>
</view>
</template>

<script>
// pages/mall_index/mall_index.js
var app = getApp();
var core = app.requirejs('core');
var goodspicker = app.requirejs('biz/goodspicker'),
    foxui = app.requirejs('foxui'),
    diyform = app.requirejs('biz/diyform');

export default {
  data() {
    return {
      arrLabel: [],
      num: [],
      // 购物车商品数量
      clickCar: false,
      // 点击出现购物车列表
      num: 0,
      change: false,
      div: false,
      numtotal: {},
      clearcart: true,
      canBuy: '',
      // 购物车
      specs: [],
      options: [],
      diyform: {},
      specsTitle: '',
      total: 1,
      active: '',
      slider: '',
      tempname: '',
      buyType: '',
      areas: [],
      closeBtn: false,
      soundpic: true,
      closespecs: false,
      buyType: 'cart',
      quickbuy: true,
      formdataval: {},
      showPicker: false
    };
  },

  onShareAppMessage: function (res) {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    });
    var pageid = options.id;

    if (pageid == undefined) {
      var pages = getCurrentPages(); //获取页面栈

      var url_arr = pages[pages.length - 1].route.split("/"); //当前页面路径/分割后的数组

      pageid = url_arr[url_arr.length - 1];
    }

    var that = this;
    let systemInfo = wx.getStorageSync('systemInfo');
    this.busPos = {};
    this.busPos['x'] = 45; //购物车的位置

    this.busPos['y'] = app.globalData.hh - 80;
    this.setData({
      goodsH: systemInfo.windowHeight - 245 - 48,
      pageid: pageid
    }); // 左边选项卡切换控制数组

    var arrLab = [1];

    for (var i = 1; i < that.arrLabel.length; i++) {
      arrLab.push(0);
    }

    that.setData({
      arrLab: arrLab
    });
    core.get('quick/index/main', {
      id: this.pageid
    }, function (ret) {
      var arr = []; // 商品在购物车中的数量 

      var style = ''; // 样式

      style = ret.style.shopstyle == 1 ? 'changeCss2' : ret.style.shopstyle == 2 ? 'changeCss3' : '';
      style += ' ' + ret.style.logostyle;
      that.setData({
        main: ret,
        group: ret.group,
        goodsArr: ret.goodsArr,
        arrCart: arr,
        style: style
      });
      var id = that.main.cartdata == 1 ? that.pageid : '';
      var numtotal = {}; // 计算高度

      if (that.main.advs) {
        if (that.main.advs.length > 0) {
          var arr = [198];
          var goodslength = 198;
        }
      } else {
        var arr = [18];
        var goodslength = 18;
      }

      for (var i = 0; i < that.main.group.length; i++) {
        if (that.main.goodsArr[that.main.group[i].type]) {
          var templength = that.main.goodsArr[that.main.group[i].type].length ? that.main.goodsArr[that.main.group[i].type].length : 0.6;
          goodslength = goodslength + templength * 106 + 66;
          arr.push(goodslength);
          that.setData({
            arrscroll: arr
          });
        }
      }

      var id = that.main.cartdata == 1 ? that.pageid : '';
      core.get('quick/index/getCart', {
        quickid: id
      }, function (ret) {
        var numtotal = {};

        for (var i in ret.simple_list) {
          numtotal[i] = ret.simple_list[i];
        }

        that.setData({
          numtotal: numtotal
        });
      });
      wx.hideLoading();
      wx.setNavigationBarTitle({
        title: ret.pagetitle
      });
    });
  },
  components: {},
  props: {},
  methods: {
    // 导航菜单跳转
    menunavigage: function (e) {
      const url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
        fail: function () {
          wx.switchTab({
            url: url
          });
        }
      });
    },
    // 幻灯片跳转
    gobigimg: function (e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      });
    },
    // 左边选项卡切换方法
    clickLab: function (e) {
      var id = e.currentTarget.dataset.id; //左侧点击跳转id

      var arr = this.arrLab;

      for (var i = 0; i < arr.length; i++) {
        arr[i] = 0;
      }

      arr[id] = 1;
      this.setData({
        arrLab: arr,
        id: e.currentTarget.dataset.id
      });
    },
    // 查看购物车列表
    shopCarList: function () {
      var that = this;
      this.setData({
        clickCar: true,
        cartcartArr: [],
        showPicker: true
      });
      var id = this.main.cartdata == 1 ? this.pageid : '';
      core.get('quick/index/getCart', {
        quickid: id
      }, function (ret) {
        var main = that.main;
        main.cartList = ret;
        that.setData({
          main: main
        });
        var tempcartid = [];

        for (var i = 0; i < ret.list.length; i++) {
          tempcartid[i] = ret.list[i].goodsid;
        }

        that.setData({
          tempcartid: tempcartid
        });
      });
    },
    shopCarHid: function () {
      this.setData({
        clickCar: false,
        showPicker: false
      });
    },
    // 购买picker
    selectPicker: function (e) {
      var $this = this;
      wx.getSetting({
        success: function (res) {
          var limits = res.authSetting['scope.userInfo'];

          if (limits) {
            var goodslist = 'goodslist';
            goodspicker.selectpicker(e, $this, goodslist);
            $this.setData({
              cover: '',
              showvideo: false
            });
          } else {
            $this.setData({
              modelShow: true
            });
            return;
          }
        }
      });
    },
    // 选规格
    specsTap: function (event) {
      var $this = this;
      goodspicker.specsTap(event, $this);
    },
    //关闭pickerpicker
    emptyActive: function () {
      this.setData({
        active: '',
        slider: 'out',
        tempname: '',
        specsTitle: '',
        showPicker: false
      });
    },
    // 立即购买
    buyNow: function (event) {
      var $this = this;
      goodspicker.buyNow(event, $this);
    },
    //加入购物车
    getCart: function (event) {
      var $this = this;
      goodspicker.getCart(event, $this);
    },
    select: function () {
      var $this = this;
      goodspicker.select($this);
    },
    //数量输入绑定事件
    inputNumber: function (e) {
      var $this = this;
      goodspicker.inputNumber(e, $this);
    },
    number: function (e) {
      var $this = this;
      goodspicker.number(e, $this);
    },
    onChange: function (e) {
      return diyform.onChange(this, e);
    },
    DiyFormHandler: function (e) {
      return diyform.DiyFormHandler(this, e);
    },
    selectArea: function (e) {
      return diyform.selectArea(this, e);
    },
    bindChange: function (e) {
      return diyform.bindChange(this, e);
    },
    onCancel: function (e) {
      return diyform.onCancel(this, e);
    },
    onConfirm: function (e) {
      return diyform.onConfirm(this, e);
    },
    getIndex: function (str, areas) {
      return diyform.getIndex(str, areas);
    },
    closespecs: function () {
      this.setData({
        closespecs: false
      });
    },

    /**
     * 生命周期函数--监听页面滚动
     */
    onPageScroll: function (e) {},
    // 弹窗picker点击确定按钮或单规格商品加入购物车
    addCartquick: function (a, b) {
      var that = this;
      var numbers = that.numtotal;
      var id = this.main.cartdata == 1 ? this.pageid : ''; // 加入购物车

      core.get('quick/index/update', {
        quickid: id,
        goodsid: that.goodsid,
        optionid: a ? a : '',
        update: '',
        total: '',
        type: that.addtype,
        typevalue: b ? b : '',
        diyformdata: that.formdataval ? that.formdataval : ''
      }, function (ret) {
        // 如果达到最大购买数量或者超出库存，提示错误信息
        if (ret.error != 0) {
          that.setData({
            cantclick: true
          });
          foxui.toast(that, ret.message);
          that.setData({
            active: '',
            slider: 'out',
            isSelected: true,
            tempname: '',
            showPicker: false
          });
        } else {
          // 修改底部购物车的数据
          var main = that.main;
          main.cartList.total = ret.total;
          main.cartList.totalprice = ret.totalprice;
          main.cartList.list = [1];
          numbers[that.goodsid] = ret.goodstotal;
          that.setData({
            numtotal: numbers,
            main: main,
            clearcart: true,
            active: '',
            slider: 'out',
            isSelected: true,
            tempname: '',
            showPicker: false,
            formdataval: {}
          });

          if (that.addtype == 'value') {// that.animate(that.data.mouse)
          }
        } // $this.setData({  });

      });
    },
    //添加商品到购物车
    addGoodToCartFn: function (e) {
      app.checkAuth();
      var that = this;
      var modeltakeout = this.main.cartdata == 1 ? 'takeoutmodel' : 'shopmodel';

      if (!e.currentTarget.dataset.canadd) {
        modeltakeout = 'cantaddcart';
      }

      that.setData({
        morechose: e.currentTarget.dataset.more
      }); // if(e.currentTarget.dataset.color!='#ccc') {

      that.setData({
        addtype: e.currentTarget.dataset.add,
        goodsid: e.currentTarget.dataset.id,
        mouse: e
      });

      if (that.addtype == 'reduce' && e.currentTarget.dataset.min == e.currentTarget.dataset.num) {
        that.setData({
          addtype: 'delete'
        });
      } // 如果有多规格减号


      if (e.currentTarget.dataset.more == '1' && that.addtype == 'reduce') {
        //如果点击减号且为多规格，提示在购物车中修改数量
        foxui.toast(that, "请在购物车中修改多规格商品");
      } else if (that.addtype == 'reduce' && e.currentTarget.dataset.min == e.currentTarget.dataset.num) {
        foxui.toast(that, "不能少于" + e.currentTarget.dataset.min + "件商品");
      } // 如果是多规格或有自定义表单 加号
      else if (e.currentTarget.dataset.more == '1' || e.currentTarget.dataset.diyformtype != '0' || !e.currentTarget.dataset.canadd) {
          if (that.addtype != 'reduce' && that.addtype != 'delete') {
            var goodslist = 'quickbuy';
            that.setData({
              showPicker: true,
              cycledate: false
            });
            goodspicker.selectpicker(e, that, goodslist, modeltakeout);
          } else {
            that.setData({
              storenum: e.currentTarget.dataset.store,
              maxnum: e.currentTarget.dataset.maxnum
            });
            that.addCartquick('', 1);
          }
        } // 如果是单规格


      if (e.currentTarget.dataset.more != '1' && e.currentTarget.dataset.diyformtype == '0' && e.currentTarget.dataset.canadd) {
        that.setData({
          storenum: e.currentTarget.dataset.store,
          maxnum: e.currentTarget.dataset.maxnum
        }); // 减号且不能再少

        if (that.addtype == 'reduce' && e.currentTarget.dataset.min == e.currentTarget.dataset.num) {
          foxui.toast(that, "不能少于" + e.currentTarget.dataset.min + "件商品");
        } else {
          that.addCartquick('', 1);
        }
      } // }

    },
    // 加购物车动画
    animate: function (e) {
      var that = this;
      that.finger = {};
      var topPoint = {};
      that.finger['x'] = e.touches["0"].clientX; //点击的位置

      that.finger['y'] = e.touches["0"].clientY;

      if (that.finger['y'] < that.busPos['y']) {
        topPoint['y'] = that.finger['y'] - 150;
      } else {
        topPoint['y'] = that.busPos['y'] - 150;
      }

      topPoint['x'] = Math.abs(that.finger['x'] - that.busPos['x']) / 2;

      if (that.finger['x'] > that.busPos['x']) {
        topPoint['x'] = (that.finger['x'] - that.busPos['x']) / 2 + that.busPos['x'];
      } else {
        //
        topPoint['x'] = (that.busPos['x'] - that.finger['x']) / 2 + that.finger['x'];
      } //topPoint['x'] = that.busPos['x'] + 80
      //that.linePos = app.bezier([that.finger, topPoint, that.busPos], 30);


      that.linePos = that.bezier([that.busPos, topPoint, that.finger], 30);
      that.startAnimation(e);
    },
    bezier: function (pots, amount) {
      var pot;
      var lines;
      var ret = [];
      var points;

      for (var i = 0; i <= amount; i++) {
        points = pots.slice(0);
        lines = [];

        while (pot = points.shift()) {
          if (points.length) {
            lines.push(pointLine([pot, points[0]], i / amount));
          } else if (lines.length > 1) {
            points = lines;
            lines = [];
          } else {
            break;
          }
        }

        ret.push(lines[0]);
      }

      function pointLine(points, rate) {
        var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
        var ret = [];
        pointA = points[0]; //点击

        pointB = points[1]; //中间

        xDistance = pointB.x - pointA.x;
        yDistance = pointB.y - pointA.y;
        pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
        tan = yDistance / xDistance;
        radian = Math.atan(tan);
        tmpPointDistance = pointDistance * rate;
        ret = {
          x: pointA.x + tmpPointDistance * Math.cos(radian),
          y: pointA.y + tmpPointDistance * Math.sin(radian)
        };
        return ret;
      }

      return {
        'bezier_points': ret
      };
    },
    startAnimation: function (e) {
      var index = 0,
          that = this,
          bezier_points = that.linePos['bezier_points'];
      this.setData({
        hide_good_box: false,
        bus_x: that.finger['x'],
        bus_y: that.finger['y']
      });
      var len = bezier_points.length;
      index = len;
      this.timer = setInterval(function () {
        index--;
        that.setData({
          bus_x: bezier_points[index]['x'],
          bus_y: bezier_points[index]['y']
        });

        if (index < 1) {
          clearInterval(that.timer); // that.addGoodToCartFn(e);

          that.setData({
            hide_good_box: true
          });
        }
      }, 13);
    },
    //清空购物车
    clearShopCartFn: function (e) {
      var that = this;
      var id = this.main.cartdata == 1 ? this.pageid : '';
      core.get('quick/index/clearCart', {
        quickid: id
      }, function (ret) {
        var main = that.main;
        main.cartList = {
          list: [],
          total: 0,
          totalprice: 0
        };
        var tempcartid = that.tempcartid;
        var arr = []; // 这里有bug，清空购物车的时候遍历id数组，比当前有的id大的商品不在数组里所以要找到最大的id值将数组置为0

        for (var i = 0; i < tempcartid.length; i++) {
          arr[Number(tempcartid[i])] = -1;
        }

        that.setData({
          main: main,
          clickCar: false,
          numtotal: arr,
          clearcart: false,
          showPicker: false
        });
      });
    },
    // 关闭多规格弹窗
    closemulti: function () {
      this.setData({
        showPicker: false,
        clickCar: false,
        cycledate: true
      });
    },
    // 结算
    gopay: function () {
      var fromquick = this.main.cartdata == 1 ? this.pageid : '';

      if (!this.main.cartList.list.length) {
        // 如果购物车中没有商品
        foxui.toast(this, "请先添加商品到购物车");
      } else {
        wx.navigateTo({
          url: '/pages/order/create/index?fromquick=' + fromquick
        });
      }
    },
    // 跳转到购物车
    gotocart: function () {
      const url = '/pages/member/cart/index';
      wx.navigateTo({
        url: url,
        fail: function () {
          wx.switchTab({
            url: url
          });
        }
      });
    },
    // 购物车弹层加减商品
    cartaddcart: function (e) {
      var that = this;
      var id = this.main.cartdata == 1 ? this.pageid : '';
      var opid = e.currentTarget.dataset.id == '0' ? e.currentTarget.dataset.goodsid : e.currentTarget.dataset.id;
      var carttype = e.currentTarget.dataset.add;
      var value = 1;

      if (e.currentTarget.dataset.min == e.currentTarget.dataset.num && carttype == 'reduce') {
        carttype = 'delete';
      } // 加入购物车


      core.get('quick/index/update', {
        quickid: id,
        goodsid: e.currentTarget.dataset.goodsid,
        optionid: e.currentTarget.dataset.id == '0' ? '' : e.currentTarget.dataset.id,
        update: '',
        total: '',
        type: carttype,
        typevalue: value // diyformdata: ''

      }, function (ret) {
        if (ret.error == 0) {
          var arr = that.cartcartArr;
          arr[opid] = ret.goodsOptionTotal || ret.goodsOptionTotal == 0 ? ret.goodsOptionTotal : ret.goodstotal;
          var main = that.main;
          main.cartList.total = ret.total;
          main.cartList.totalprice = ret.totalprice;
          var numbers = that.numtotal;
          numbers[e.currentTarget.dataset.goodsid] = ret.goodstotal;
          that.setData({
            cartcartArr: arr,
            main: main,
            numtotal: numbers
          });
        } else {
          foxui.toast(that, ret.message);
        }
      });
    },
    // 右侧主体滚动事件
    scrollfn: function (e) {
      var that = this;
      var arrtemp = this.arrLab;

      for (var i = 0; i < that.arrscroll.length; i++) {
        arrtemp[i] = 0;

        if (Math.abs(e.detail.scrollTop - that.arrscroll[i]) < 26) {
          arrtemp[i] = 1;
          this.setData({
            arrLab: arrtemp
          });
          break;
        }
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
/* pages/mall_index/mall_index.wxss */
 @import "../common/city-picker.css";
.flex {
  display: -moz-box;  /* Firefox */   
  display: -ms-flexbox;    /* IE10 */   
  display: -webkit-box;    /* Safari */    
  display: -webkit-flex;    /* Chrome, WebKit */   
  display: flex;
}
.footercart {
  position: fixed;
  left: 0;
  bottom: 0;
}
page {
  background: #f5f5f5;
  height: 100%;
}
.banner>image {
  width: 100%;
  height: 310rpx;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
}
.banner {
  position: relative;
  z-index: -1;
}

.shopMsg image {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 22rpx auto;
  display: block;
}


/* 头像样式 */
.circle .shopMsg image {
  border-radius: 50%;
}
.round .shopMsg image {
  border-radius: 20rpx;
}

.shopMsg swiper {
  margin: 0 auto;
  width: 440rpx;
}
.shopMsg {
  color: #fff;
  text-align: center;
  font-size: 26rpx;
  height: 310rpx;
  padding-top: 50rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.2));
  position: relative;
}
.changeCss3 .banner>image {
  height: 370rpx;
}
.shopMsg>view>view:nth-of-type(1) {
  font-size: 32rpx;
  font-weight: bold; 
  margin-bottom: 18rpx;
}
.shopMsg view view {
  text-align: center;
}
.shopMsg view>view:nth-of-type(2) {
   width: 100%; 
  overflow: hidden;
  height: 40rpx;
  margin: 0 auto;
}
.shopMsg view view view {
  height: 40rpx;
  white-space:nowrap;
  /* position: absolute; */
  /* top: 0;
  left: 0; */
  font-size: 26rpx;
   /* animation: mymove1 18s linear infinite;  */
}
.shopMsg view view {
  font-size: 26rpx;
}
.changeCss2 view view {
  text-align: left;
  margin-left: 0;
}
.changeCss2 .shopMsg {
  text-align: left;
  display: flex;
}
.changeCss2 .shopMsg image {
  margin: 90rpx 20rpx 0 28rpx;
  padding: 0
}
.changeCss2 .shopMsg>view {
  padding-top: 102rpx;
}
.changeCss3 .navTop {
  width: 702rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  margin-top: -60rpx;
}
.changeCss3 .shopMsg {
  height: 370rpx;
}
.navTop {
  background: #fff;
  justify-content: space-around;
  font-size: 22rpx;
  color: #333;
  padding-bottom: 20rpx;
}
.marb20 {
  margin-bottom: 20rpx;
}
.padbot {
  padding-bottom: 98rpx;
}
.navTop icon {
  font-size: 44rpx;
  display: block;
  margin: 24rpx auto 16rpx auto;
  text-align: center;
}
.main {
  /* margin-top: 20rpx; */
  height: 100%;
}

.left {
  width: 168rpx;
  background: #f7f7f7;
  padding-bottom: 40rpx;
}
.left view {
  line-height: 88rpx;
  font-size: 26rpx;
  color: #666;
  text-align: center;
}
scroll-view.right2 {
  width: 582rpx;
  box-sizing: border-box;
  background: #fff;
}

/*滚动条样式*/
::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 0;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    background: transparent;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
    background: transparent;
}

.right2 .tit {
  font-size: 24rpx;
  padding: 24rpx 0 20rpx 20rpx;
}
.right2 image {
  width: 150rpx;
  height: 150rpx;
  margin-right: 20rpx;
}
.goodsList {
  position: relative;
  margin-bottom: 36rpx;
  padding: 0 20rpx;
}
.right2 .addShopCar {
  position: absolute;
  right: 20rpx;
  bottom: -10rpx;
  font-size: 30rpx;
  color: #666;
  width: auto;
}

.addShopCar icon {
  font-size: 52rpx;
  border-radius: 50%;
  color: #fa4040;
}
.addShopCar text {
  padding: 0 10rpx;
  line-height: 54rpx;
}
.goodsList>view {
  width: 374rpx;
}
.height {
  height: 126rpx;
}
.height view:nth-of-type(1) {
  font-size: 26rpx;
  line-height: 36rpx;
  margin-bottom:10rpx;
  margin-top:-6rpx;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  overflow:hidden;
}
.height view:nth-of-type(2) {
  font-size: 24rpx;
  color: #999;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:1;
  overflow:hidden;
}
.goodsList .height+view {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff5555;
}
.goodsList view i {
  font-size: 22rpx;
  color: #b3b3b3;
  padding-left: 10rpx;
  line-height: 30rpx;
  font-weight: normal;
}
.left view.active {
  border-left: 2px solid;
  background: #fff;
}
.left view.active view {
  color: #ff5555;
}
.nogoods {
  text-align:center;
  padding:20rpx 0;
  font-size:26rpx;
}
.shopCar {
  width: 110rpx;
  height: 110rpx;
  background: #fa4040;
  border-radius: 50%;
  box-shadow: 0 0 8px;
  position: fixed;
  bottom: 94rpx;
  left: 30rpx;
}
.shopCar .shopCarImg {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  position: relative;
  color:#fff;
  font-size: 58rpx;
  text-align:center;
  line-height:110rpx;
}
.shopCar i {
  width: 16rpx;
  height: 16rpx;
  position: absolute;
  border-radius: 50%;
  background: #e40100;
  right: 24rpx;
  top: 28rpx;
}
/* 购物车弹出层 */
.footerList .noGoods {
  text-align: center;
  font-size: 26rpx;
  display: block;
  margin: 80rpx auto;
}

.shopCarList {
  position: fixed;
  height: 100%;
  width: 100%;
  /* background: rgba(0,0,0,0.3); */
  top: 0;
  left: 0;
  transition: all 0.6s;
  display:flex;
  flex-direction:column;
  z-index: 1002;
}
.displayNo {
  top: 100%;
  /* display: none; */
}
.shopCarList>view:nth-of-type(2) {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.scListTit {
  justify-content: space-between;
  background: #f7f5f5;
  line-height: 80rpx;
  padding: 0 28rpx;
  font-size: 26rpx;
}
.scListTit text:nth-of-type(2) {
  color: #999;
}
.carList {
  overflow: hidden;
  padding-bottom: 8rpx;
  margin: 0 28rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #e6e6e6;
}

.carList>view {
  float: right;
}
.carList>view.goodsMsg {
  float: left;
  width: 400rpx;
}
.carList .goodsMsg view:nth-of-type(1) {
  line-height: 36rpx;
  padding-top: 30rpx;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  overflow:hidden;
}
.carList .goodsMsg view:nth-of-type(2) {
  color: #b3b3b3;
  font-size: 24rpx;
  padding-bottom: 30rpx;
}

.money {
  color: #ff5555;
  margin: 48rpx 30rpx 0 0;
}
.carList .addShopCar {
  margin-top: 40rpx;
}
.tips {
  font-size: 22rpx;
  color: #666;
  text-align: center;
  line-height: 56rpx;
  background: #f5f5f5;
}
.shopCar2 {
  background: #474749;
  height: 98rpx;
  color: #fff;
  font-size: 22rpx;
  /* overflow: hidden; */
  width: 100%;
}
.carIcon {
  position: relative;
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  border: 8rpx solid #474749;
  margin: 0 32rpx 0 30rpx;
  background: #ff5555;
  margin-top: -40rpx;
  float: left;
}
.shopCar2 icon {
  width: 110rpx;
  font-size: 58rpx;
  color: #fff;
  text-align: center;
  line-height: 110rpx;
}
.total view:nth-of-type(1) {
  font-size: 32rpx;
  margin-top: 14rpx;
}
.total+view {
  background: #ff9d55;
  width: 200rpx;
  text-align: center;
  line-height: 98rpx;
  float: right;
  font-size: 28rpx;
}
.total {
  float: left;
}
.shopCar2 i {
  position: absolute;
  top:-2rpx;
  right:-10rpx;
  width:40rpx;
  height:40rpx;
  border-radius: 50%;
  background: #e40100;
  display: block;
  text-align: center;
  font-size: 22rpx;
  line-height: 40rpx;
}

/* 列表大图图文 */
.bigimg {
  padding: 0 16rpx;
}
.bigimg image,swiper {
  width: 552rpx;
  height: 360rpx;
}
.subtit {
  font-size: 24rpx;
  color: #999;
  padding: 0 0 24rpx 20rpx;
}

.leftItem {
  display: flex;
}
.leftItem image {
  width:24rpx;
  height:24rpx;
  margin:32rpx 0 0 8rpx;
}
.leftItem view {
  flex: 1;
}
.footerList {
  max-height: 620rpx;
  min-height: 320rpx;
}

/* 加入购物车动画 */
div {
  position: fixed;
  width: 50rpx;
  height: 50rpx;
  background: red;
  border-radius: 50%;
  animation: mymove 1s ease-in; 
  right: 80rpx;
}

@keyframes mymove {
  20% {right: 200rpx;top: 400rpx}
  99% {right: 680rpx;top: 1080rpx; width: 20rpx;height: 20rpx}
  100% {right: 80rpx; width: 50rpx;height: 50rpx}
}
@keyframes mymove1 {
  0% {left: 0}
  99.9% {left: -2000rpx}
  100% {left: 584rpx}
}



/*抛物线动画*/
.good_box{
  width: 18px;
  height: 18px;
  position: fixed;
  border-radius: 50%;
  overflow: hidden;
  left: -50%;
  top: 50%;
  z-index: +99;
  background: #ff5555;
}
.main .wx-swiper-dot{
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(255,85,85,0.3);
  margin-bottom: 16rpx;
}
.main .wx-swiper-dot-active {
  background: rgba(255,85,85,1);
}
.footercart .total+view {
  background: #ff5555;
}

</style>