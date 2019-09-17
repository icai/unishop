<template>
<view>
<view class="custom" :style="(istopmenu == false ? '' : 'padding-top:' + topmenuheight +'rpx;') + 'min-height:100%;background:' + diypages.page.background">
  <block v-for="(diyitem, index) in diypages.items" :key="index">
    <!--固定搜索框  -->
    <include src="/pages/diy/template/tpl_fixedsearch.wxml" v-if="diyitem.id=='fixedsearch'"></include>
    <!--轮播图  -->
    <include src="/pages/diy/template/tpl_banner.wxml" v-if="diyitem.id=='banner'"></include>  
    <!--搜索框  -->
    <include src="/pages/diy/template/tpl_search.wxml" v-if="diyitem.id=='search'"></include> 
    <!--公告  -->
    <include src="/pages/diy/template/tpl_notice.wxml" v-if="diyitem.id=='notice'"></include> 
    <!--辅助线  -->
    <include src="/pages/diy/template/tpl_line.wxml" v-if="diyitem.id=='line'"></include> 
    <!--辅助空白  -->
    <include src="/pages/diy/template/tpl_blank.wxml" v-if="diyitem.id=='blank'"></include> 
    <!--标题栏  -->
    <include src="/pages/diy/template/tpl_title.wxml" v-if="diyitem.id=='title'"></include> 
    <!--按钮组  -->
    <include src="/pages/diy/template/tpl_menu.wxml" v-if="diyitem.id=='menu'"></include> 
    <!--按钮组2  -->
    <include src="/pages/diy/template/tpl_menu2.wxml" v-if="diyitem.id=='menu2'"></include> 
    <!--列表导航  -->
    <include src="/pages/diy/template/tpl_listmenu.wxml" v-if="diyitem.id=='listmenu'"></include> 
    <!--单图组  -->
    <include src="/pages/diy/template/tpl_picture.wxml" v-if="diyitem.id=='picture'"></include>
    <!--图片橱窗  -->
    <include src="/pages/diy/template/tpl_picturew.wxml" v-if="diyitem.id=='picturew'"></include> 
    <!--优惠券  --> 
    <include src="/pages/diy/template/tpl_coupon.wxml" v-if="diyitem.id=='coupon'"></include>  
    <!--商品组  -->
    <include src="/pages/diy/template/tpl_goods.wxml" v-if="diyitem.id=='goods'"></include> 
    <!--富文本  --> 
    <include src="/pages/diy/template/tpl_richtext.wxml" v-if="diyitem.id=='richtext'"></include> 
    <!--视频组  -->
    <include src="/pages/diy/template/tpl_video.wxml" v-if="diyitem.id=='video'"></include>
    <!--版权  -->
    <include src="/pages/diy/template/tpl_copyright.wxml" v-if="diyitem.id=='copyright'"></include>
    <!--图片展播  -->
    <include src="/pages/diy/template/tpl_pictures.wxml" v-if="diyitem.id=='pictures'"></include>
    <!--图标组  -->
    <include src="/pages/diy/template/tpl_icongroup.wxml" v-if="diyitem.id=='icongroup'"></include>  
    <!--音频组  -->
    <include src="/pages/diy/template/tpl_audio.wxml" v-if="diyitem.id=='audio'"></include>
    <!--选项卡-->
    <include src="/pages/diy/template/tpl_topmenu.wxml" v-if="diyitem.id == 'topmenu'"></include>
    <include src="/pages/diy/template/tpl_tabbar.wxml" v-if="diyitem.id=='tabbar'"></include>
    <!-- 秒杀 -->
    <include src="/pages/diy/template/tpl_seckill_times.wxml" v-if="diyitem.id=='seckill_times'"></include>
    <include src="/pages/diy/template/tpl_seckill_rooms.wxml" v-if="diyitem.id=='seckill_rooms'"></include>
    <include src="/pages/diy/template/tpl_seckill_advs.wxml" v-if="diyitem.id=='seckill_advs'"></include>
    <include src="/pages/diy/template/tpl_seckill_list.wxml" v-if="diyitem.id=='seckill_list'"></include>
  </block>
  <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
  <view class="nav-mask" :style="(active?'display:block':'')" @tap="emptyActive"></view>
  
  <button v-if="customer==1" class="suspended-service" :style="'background-color:' + customercolor" open-type="contact" session-from="weapp" show-message-card="true">
    <text class="icox icox-customerservice"></text>
  </button> 
  <view class="phone" @tap="phone" v-if="phone==1" :style="'background-color:' + phonecolor">
    <text class="icox icox-dianhua"></text>
  </view>
  <include src="/pages/common/goods-picker.wxml"></include>
  <include src="/pages/common/city-picker.wxml"></include>
</view>
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
</view>
<!--优惠券 新人礼包  -->
<view class="shoucoupon" v-if="showcoupon">
  <image :src="imgUrl + 'plugin/app/static/images/wxapp/coupon/bg1.png'" style="position: absolute; width: 620rpx;height: 820rpx;top: 130rpx;left: 50%;margin-left: -310rpx;"></image>
  <view class="inner">
    <view class="title">新人礼包</view>
    <view class="subtitle">数量有限，先到先得哦</view>
    <scroll-view scroll-y="true" class="coupon-list">
      <block v-for="(item, index) in cpinfos" :key="index">
          <view class="item">
              <view class="item-cell">
                  <view class="item-inner">
                      <view class="t">{{item.couponname}}</view>
                      <view class="b">
                      {{item.enoughtext}}
                      </view>
                  </view>
                  <view class="item-remark">{{item.t2}}<span style="font-size:30rpx;">{{item.t1}}</span></view>
              </view>
              <view class="indate">{{item.timelimittext}}</view>
          </view>
      </block>

    </scroll-view>
    <view class="know" @tap="closecoupon">知道了</view>
  </view>
  <view class="closecoupon">
    <i class="icox icox-guanbi-copy" @tap="closecoupon"></i>
  </view>
</view>
</view>
</template>

<script>
// pages/custom/index.js
var app = getApp();
var core = app.requirejs('core');
var parser = app.requirejs('wxParse/wxParse');
var diypage = app.requirejs('biz/diypage');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      imgUrls: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509963648306&di=1194f5980cccf9e5ad558dfb18e895ab&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F9c16fdfaaf51f3de87bbdad39ceef01f3a29797f.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509963737453&di=b1472a710a2c9ba30808fd6823b16feb&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fwenwen%2Fuploads%2Fpic.wenwen.soso.com%2Fp%2F20160830%2F20160830220016-586751007.jpg', 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3004162400,3684436606&fm=11&gp=0.jpg'],
      indicatorDotss: true,
      autoplays: true,
      intervals: 2000,
      durations: 500,
      circulars: true,
      adveradmin: true,
      clock: '',
      diypage: 'true',
      route: 'custom',
      icons: app.requirejs('icons'),

      /*广告结束*/
      shop: {},
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
      circular: true,

      /* 店铺推荐列表 */
      storeRecommand: [],
      total: 1,
      page: 1,
      loaded: false,
      loading: true,

      /*滚动*/
      indicatorDotsHot: false,
      autoplayHot: true,
      intervalHot: 5000,
      durationHOt: 1000,
      circularHot: true,
      hotimg: "/static/images/hotdot.jpg",
      notification: "/static/images/notification.png",
      saleout1: "/static/images/saleout-1.png",
      saleout2: "/static/images/saleout-2.png",
      saleout3: "/static/images/saleout-3.png",
      play: "/static/images/video_play.png",
      mute: "/static/images/icon/mute.png",
      voice: "/static/images/icon/voice.png",
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
      modelShow: false,
      limits: true,
      result: {},
      audios: {},
      audiosObj: {},
      picture: {},
      result: {},
      pageid: 0
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.diypages.page.title
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
  onUnload: function () {
    this.pauseOther();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.pauseOther();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {// innerAudioContext.play();
  },

  /*加载推荐商品*/
  onReachBottom: function () {
    if (this.loaded || this.storeRecommand.length == this.total) {
      return;
    }

    this.getRecommand();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = options || {};
    var $this = this;
    $this.pauseOther();
    var pageid = options.pageid;

    if (pageid == undefined) {
      var pages = getCurrentPages(); //获取页面栈

      var url_arr = pages[pages.length - 1].route.split("/"); //当前页面路径/分割后的数组

      pageid = url_arr[url_arr.length - 1];
    }

    $this.setData({
      pageid: pageid,
      imgUrl: app.globalData.approot
    }); // diypage.get(this, 'home');

    var scene = decodeURIComponent(options.scene);

    if (!options.id && scene) {
      var sceneObj = core.str2Obj(scene);
      options.id = sceneObj.id;

      if (sceneObj.mid) {
        options.mid = sceneObj.mid;
      }
    }

    setTimeout(function () {
      $this.setData({
        areas: app.getCache("cacheset").areas
      });
    }, 3000);
    app.url(options);
    diypage.get(this, pageid, function (res) {
      /*启动广告*/
      if ($this.data.startadv == undefined || $this.data.startadv == '') {
        return;
      }

      if ($this.data.startadv.status == 0 || $this.data.startadv == '') {
        wx.getSetting({
          success: function (res) {
            var limits = res.authSetting['scope.userInfo'];

            if (limits) {
              //$this.get_nopayorder();
              return;
            }
          }
        });
      }

      var params = $this.data.startadv.params;

      if (params.style == 'default') {
        var timer = params.autoclose;

        function count_down(that) {
          $this.setData({
            clock: timer
          });

          if (timer <= 0) {
            $this.setData({
              adveradmin: false
            });
            return;
          }

          setTimeout(function () {
            timer -= 1;
            count_down(that);
          }, 1000);
        }

        count_down($this);
      }

      if (params.showtype == 1) {
        var showtime = params.showtime;
        var countdown = showtime * 1000 * 60;
        var startadvtime = app.getCache('startadvtime');
        var nowtime = +new Date();
        var adveradmin = true;
        $this.setData({
          adveradmin: true
        });

        if (startadvtime) {
          if (nowtime - startadvtime < countdown) {
            adveradmin = false;
          }
        }

        $this.setData({
          adveradmin: adveradmin
        });

        if (adveradmin) {
          app.setCache('startadvtime', nowtime);
        }
      }

      var advstatus = $this.data.startadv.status;
    });
    $this.setData({
      cover: true,
      showvideo: false
    });
    wx.getSystemInfo({
      success: function (res) {
        var swiperheight = res.windowWidth / 1.7;
        $this.setData({
          swiperheight: swiperheight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var $this = this;
    var res = wx.getSystemInfoSync();
    var pageid = $this.data.pageid;
    core.get('diypage&id=' + pageid, {}, function (result) {
      var data = {
        loading: false,
        diypage: result.diypage
      };
      $this.setData(data);
    });
    $this.setData({
      screenWidth: res.windowWidth
    });
  },
  components: {},
  props: {},
  methods: {
    /* 获取首页信息 */
    getShop: function () {
      var $this = this;
      core.get('shop/get_shopindex', {}, function (result) {
        parser.wxParse('wxParseData', 'html', result.copyright, $this, '5');
        $this.setData({
          shop: result
        });
      });
    },
    //店铺推荐
    getRecommand: function () {
      var $this = this;

      if ($this.data.diypage == 'true') {
        return;
      }

      core.get('shop/get_recommand', {
        page: $this.data.page
      }, function (result) {
        var data = {
          loading: false,
          total: result.total
        };
        $this.setData({
          loading: false,
          total: result.total,
          show: true
        });

        if (!result.list) {
          result.list = [];
        }

        if (result.list.length > 0) {
          $this.setData({
            storeRecommand: $this.data.storeRecommand.concat(result.list),
            page: result.page + 1
          });

          if (result.list.length < result.pagesize) {
            data.loaded = true;
          }
        }
      });
    },
    imagesHeight: function (e) {
      var width = e.detail.width,
          height = e.detail.height,
          type = e.target.dataset.type,
          $this = this;
      wx.getSystemInfo({
        success: function (res) {
          $this.data.result[type] = res.windowWidth / width * height;

          if (!$this.data[type] || $this.data[type] && result[type] < $this.data[type]) {
            $this.setData({
              result: $this.data.result
            });
          }
        }
      });
    },
    bindInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      });
    },
    t1: function (e) {
      diypage.fixedsearch(this, e);
    },
    startplay: function (e) {
      var cover = e.target.dataset.cover;
      this.setData({
        cover: cover,
        showvideo: true
      });
      this.videoContext = wx.createVideoContext('Video');
      this.videoContext.play();
    },

    /* 隐藏未付订单 */
    unpaidcolse: function (e) {
      var unpaid = '';

      if (e.target.dataset.type == 'open') {
        unpaid = true;
      } else {
        unpaid = false;
      }

      this.setData({
        unpaid: unpaid
      });
    },

    /* 关闭未付订单 */
    unpaidcolse2: function (e) {
      this.setData({
        unpaidhide: true
      });
    },
    //
    get_nopayorder: function () {
      var $this = this;
      core.get('shop/get_nopayorder', {}, function (result) {
        if (result.hasinfo == 1) {
          $this.setData({
            nopaygoods: result.goods,
            nopaygoodstotal: result.goodstotal,
            nopayorder: result.order,
            unpaid: true
          });
        }
      });
    },
    //是否有新的优惠券
    get_hasnewcoupon: function () {
      var $this = this;
      core.get('shop/get_hasnewcoupon', {}, function (result) {
        if (result.hasnewcoupon == 1) {
          $this.setData({
            showcoupontips: true
          });
        }
      });
    },
    //是否有新人优惠券
    get_cpinfos: function () {
      var $this = this;
      core.get('shop/get_cpinfos', {}, function (result) {
        if (result.hascpinfos == 1) {
          $this.setData({
            showcoupon: true,
            cpinfos: result.cpinfos
          });
        }
      });
    },

    /*关闭广告*/
    adverclose: function () {
      this.setData({
        adveradmin: false
      });
      this.get_nopayorder();
    },

    /*广告点击跳转链接*/
    indexChangebtn: function (e) {
      var urls = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: urls
      });
    },

    /* 隐藏未付订单 */
    unpaidcolse: function (e) {
      var unpaid = '';

      if (e.target.dataset.type == 'open') {
        unpaid = true;
      } else {
        unpaid = false;
      }

      this.setData({
        unpaid: unpaid
      });
    },

    /* 关闭未付订单 */
    unpaidcolse2: function (e) {
      this.setData({
        unpaidhide: true
      });
    },
    // 购买picker
    selectPicker: function (e) {
      app.checkAuth();
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
            // $this.setData({ modelShow: true })
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
        specsTitle: ''
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
    changevoice: function () {
      if (this.sound) {
        this.setData({
          sound: false,
          soundpic: true
        });
      } else {
        this.setData({
          sound: true,
          soundpic: false
        });
      }
    },
    phone: function () {
      var phoneNumber = this.phonenumber + '';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },

    /*用户授权-取消*/
    cancelclick: function () {
      this.setData({
        modelShow: false
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
    navigate: function (e) {
      var url = e.currentTarget.dataset.url;
      var phone = e.currentTarget.dataset.phone;
      var appid = e.currentTarget.dataset.appid;
      var appurl = e.currentTarget.dataset.appurl;

      if (url) {
        wx.navigateTo({
          url: url,
          fail: function (e) {
            wx.switchTab({
              url: url
            });
          }
        });
      }

      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        });
      }

      if (appid) {
        wx.navigateToMiniProgram({
          appId: appid,
          path: appurl
        });
      }
    },
    // 新人优惠券弹层关闭
    closecoupon: function () {
      this.setData({
        showcoupon: false
      });
    },
    // 顶部新优惠券提示条关闭
    closecoupontips: function () {
      this.setData({
        showcoupontips: false
      });
    },
    pauseOther: function (item_id) {
      var $this = this;
      $.each(this.audiosObj, function (id, obj) {
        if (id == item_id) {
          return;
        }

        obj.pause();
        var audios = $this.data.audios;

        if (audios[id]) {
          audios[id].status = false;
          $this.setData({
            audios: audios
          });
        }
      });
    },
    play: function (e) {
      var item_id = e.target.dataset.id;
      var innerAudioContext = this.audiosObj[item_id] || false;

      if (!innerAudioContext) {
        innerAudioContext = wx.createInnerAudioContext('audio_' + item_id);
        var audiosObj = this.audiosObj;
        audiosObj[item_id] = innerAudioContext;
        this.setData({
          audiosObj: audiosObj
        });
      }

      var $this = this;
      innerAudioContext.onPlay(() => {
        var Time = setInterval(function () {
          var width = innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%';
          var minute = Math.floor(Math.ceil(innerAudioContext.currentTime) / 60); //分

          var second = (Math.ceil(innerAudioContext.currentTime) % 60 / 100).toFixed(2).slice(-2); //秒

          var seconds = Math.ceil(innerAudioContext.currentTime);
          var audioicon = '';

          if (minute < 10) {
            minute = "0" + minute;
          }

          var time = minute + ":" + second;
          var audios = $this.data.audios;
          audios[item_id].audiowidth = width;
          audios[item_id].Time = Time;
          audios[item_id].audiotime = time;
          audios[item_id].seconds = seconds;
          $this.setData({
            audios: audios
          });
        }, 1000);
      });
      var src = e.currentTarget.dataset.audio;
      var time = e.currentTarget.dataset.time;
      var pausestop = e.currentTarget.dataset.pausestop;
      var loopplay = e.currentTarget.dataset.loopplay;

      if (loopplay == 0) {
        innerAudioContext.onEnded(res => {
          audios[item_id].status = false;
          $this.setData({
            audios: audios
          });
        });
      }

      var audios = $this.data.audios;

      if (!audios[item_id]) {
        audios[item_id] = {};
      }

      if (innerAudioContext.paused && time == 0) {
        innerAudioContext.src = src;
        innerAudioContext.play();

        if (loopplay == 1) {
          innerAudioContext.loop = true;
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else if (innerAudioContext.paused && time > 0) {
        innerAudioContext.play();

        if (pausestop == 0) {
          innerAudioContext.seek(time);
        } else {
          innerAudioContext.seek(0);
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else {
        innerAudioContext.pause();
        audios[item_id].status = false;
      }

      $this.setData({
        audios: audios
      });
    },
    imagesHeight: function (e) {
      var width = e.detail.width,
          height = e.detail.height,
          type = e.target.dataset.type,
          $this = this;
      wx.getSystemInfo({
        success: function (res) {
          $this.data.result[type] = res.windowWidth / width * height;

          if (!$this.data[type] || $this.data[type] && result[type] < $this.data[type]) {
            $this.setData({
              result: $this.data.result
            });
          }
        }
      });
    },
    // 顶部菜单切换
    tabtopmenu: function (e) {
      var $this = this,
          diypages = $this.data.diypages,
          list = diypages.items,
          id = e.currentTarget.dataset.id,
          dataurl = e.currentTarget.dataset.url,
          type = e.currentTarget.dataset.type,
          topmenu = $this.data.topmenu,
          topmenuindex = e.currentTarget.dataset.index;
      pageid = $this.data.pageid;
      $this.setData({
        topmenuindex: topmenuindex
      });

      if (dataurl == '' || dataurl == undefined) {
        return;
      }

      if (dataurl.indexOf('pages') == 1) {
        var index = dataurl.lastIndexOf("=");
        var pageid = dataurl.substring(index + 1, dataurl.length);
        core.get('diypage', {
          id: pageid
        }, function (result) {
          if (result.error == 0) {
            var arr = [];

            for (var i in result.diypage.items) {
              arr.push(result.diypage.items[i]); //属性
            }

            arr.unshift(topmenu);
            var obj = new Object();

            for (var x in arr) {
              obj[x] = arr[x];

              if (arr[x].id == 'topmenu') {
                arr[x].status = type;
              }
            }

            result.diypage.items = obj;
            $this.setData({
              diypages: result.diypage,
              topmenuDataType: ''
            });
          }
        });
      } else {
        core.get('diypage/getInfo', {
          dataurl: dataurl
        }, function (ret) {
          //console.error('dataurl' + dataurl)
          var topmenu = $this.data.topmenu;
          core.get('diypage', {
            type: pageid
          }, function (result) {
            var diypage = result.diypage;
            $.each(diypage.items, function (id, item) {
              if (item.id == 'topmenu') {
                item.status = type;

                for (var i in item.data) {
                  if (i == type) {
                    item.data[i]['data'] = ret.goods.list;

                    if (ret.goods.list.length <= 8) {
                      item.data[i]['showmore'] = true;
                    }
                  }
                }
              }
            });

            if (result.error == 0) {
              $this.setData({
                diypages: result.diypage,
                topmenuDataType: ret.type
              });
            }
          });
        });
      }

      $this.setData({
        diypages: diypages
      });
    },
    // 选项卡切换
    tabwidget: function (e) {
      var $this = this,
          diypages = $this.data.diypages,
          list = diypages.items,
          id = e.currentTarget.dataset.id,
          dataurl = e.currentTarget.dataset.url,
          type = e.currentTarget.dataset.type;

      if (dataurl == '' || dataurl == undefined) {
        return;
      }

      core.get('diypage/getInfo', {
        dataurl: dataurl
      }, function (ret) {
        for (var i in diypages.items) {
          if (i == id) {
            diypages.items[i].data[type].data = ret.goods.list;
            diypages.items[i].data[type].type = ret.type;
            diypages.items[i].type = ret.type;
            diypages.items[i].status = type;

            if (ret.goods.list.length <= 8) {
              diypages.items[i].data[type].showmore = true;
            }

            $this.setData({
              diypages: diypages
            });
          }
        }
      });
    },
    getstoremore: function (e) {
      var $this = this;
      var itemid = e.currentTarget.dataset.id;
      var diypages = $this.data.diypages;
      $.each(diypages.items, function (id, item) {
        if (id == itemid) {
          if (item.status == undefined || item.status == '') {
            if (item.data[0].linkurl.indexOf('stores') != -1) {
              var paramsType = 'stores';
            } else {
              var paramsType = 'goods';
            }

            var dataurl = item.data[0].linkurl;
            var num = item.data[0].data.length;
            core.get('diypage/getInfo', {
              dataurl: dataurl,
              num: num,
              paramsType: paramsType
            }, function (ret) {
              item.data[0].data = ret.goods.list;

              if (item.data[0].data.length == ret.goods.count) {
                item.data[0].showmore = true;
              }

              $this.setData({
                diypages: diypages
              });
            });
          } else {
            if (item.data[item.status].linkurl.indexOf('stores') != -1) {
              var paramsType = 'stores';
            } else {
              var paramsType = 'goods';
            }

            var dataurl = item.data[item.status].linkurl;
            var num = item.data[item.status].data.length;
            core.get('diypage/getInfo', {
              dataurl: dataurl,
              num: num,
              paramsType: paramsType
            }, function (ret) {
              item.data[item.status].data = ret.goods.list;

              if (item.data[item.status].data.length == ret.goods.count) {
                item.data[item.status].showmore = true;
              }

              $this.setData({
                diypages: diypages
              });
            });
          }
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
/* pages/custom/index.wxss */
@import "../../static/css/diypage.css"; 
@import "../common/city-picker.css";
canvas{
  display: block !important
}
/*advs*/
.advimg{width:100%;height:100%;position: relative;z-index: 0;}
.index-adcs-sqiper{height:auto;}
.index-advs-navigator{height:100%;width:100%;}
.item-hotdot{padding:0px 5px;}
.hotdot{height:30rpx;width:70rpx;}
/*滚动*/
.index-hot{height:60rpx;line-height: 60rpx;position: relative;margin-bottom: 20rpx}
.index-adcs-sqiper.index-notification-swiper{min-height: 60rpx;max-height: 60rpx;height:60rpx;line-height: 60rpx;overflow: hidden;}
.notification{width:15px;height:15px;vertical-align:middle;margin:0px 0px 6px 5px;border-left:1px solid #efefef;padding-left:10rpx;}
.notification-navigoter{font-size:24rpx;height:60rpx;line-height: 60rpx;}
.navs-navname{font-size:24rpx;height:40rpx;line-height: 40rpx;overflow: hidden;}

.index-adcs-sqiper.index-banner-sqiper{height:auto;line-height: 240rpx;overflow: hidden;}

/*顶部搜索start*/
.index-fixed-head{position: fixed;left:0;top:0;width:100%;height:80rpx;background: #ff7431;color:#666;font-size:32rpx;line-height: 80rpx;
opacity: 0.9;z-index: 10000;}
.flex-head .flex-head-item{padding:0 16rpx;}
.flex-head-search{position:relative;padding:10rpx;display:-webkit-box;display:-webkit-flex;display:flex;box-sizing:border-box;}
.flex-icon-search{position:absolute;width:30px;height:30px;left:0px;top:0px;line-height: 30px;text-align: center;}
.flex-search-bar{padding-top:80rpx;}
.flex-input{height:28px;line-height: 28px;display:block;overflow: hidden;}

/*顶部搜索end*/
/* cube 样式 */
.fui-cube {
    height: 0px;
    width: 100%;
    margin: 0px;
    padding-bottom: 50%;
    position: relative;
	overflow: hidden;
}
.fui-cube navigator{width:100%;height:100%;display: block;}

.fui-cube .fui-cube-left {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.fui-cube .fui-cube-right {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
}

.fui-cube .fui-cube-right1 {
    width: 100%;
    height: 50%;
    position: absolute;
    top: 0;
    left: 0;
}
.fui-cube .fui-cube-right2 {
    width: 100%;
    height: 50%;
    position: absolute;
    top: 50%;
    left: 0;
}

.fui-cube .fui-cube-right2 .left {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.fui-cube .fui-cube-right2 .right {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
}

.fui-cube image {
    width: 100%;
    height: 100%;
}



.fui-searchbar {
	position: relative;
	z-index: 10;
	height: auto;
	padding-right: 20rpx;
	padding-left: 20rpx;
	background-color: #f7f7f8;
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
    overflow:hidden;
}

.fui-searchbar:after {
	content: '';
	position: absolute;
	left: 0;
	bottom: 0;
	right: auto;
	top: auto;
	height: 1px;
	width: 100%;
	background-color: #e7e7e7;
	display: block;
	z-index: 15;
	-webkit-transform-origin: 50% 100%;
	transform-origin: 50% 100%;
}

@media only screen and (-webkit-min-device-pixel-ratio: 2) {
	.fui-searchbar:after {
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
}

@media only screen and (-webkit-min-device-pixel-ratio: 3) {
	.fui-searchbar:after {
		-webkit-transform: scaleY(0.33);
		transform: scaleY(0.33);
	}
}

.fui-searchbar .searchbar {
	margin: 0 -20rpx;
	padding: 16rpx 20rpx;
	background: rgba(0, 0, 0, 0.1);
}

.fui-searchbar .searchbar .search-input .input {
	border: 0;
}

.fui-searchbar .searchbar .searchbar-cancel {
	color: #5f646e;
}

.searchbar {
	padding: 20rpx 0;
	overflow: hidden;
	-webkit-box-align: center;
	-webkit-align-items: center;
	align-items: center;
	position: relative;
}

.searchbar .searchbar-cancel {
	position: absolute;
	top: 16rpx;
	right: -80rpx;
	width: 72rpx;
	float: right;
	height: 56rpx;
	line-height: 56rpx;
	text-align: center;
	-webkit-transition: width .3s;
	transition: width .3s;
	opacity: 0;
	-webkit-transform: translate3d(0, 50, 0);
	transform: translate3d(0, 50, 0);
	font-size: 32rpx;
}

.searchbar .search-input {
	-webkit-transform: translate3d(0, 50, 0);
	transform: translate3d(0, 50, 0);
	-webkit-transition: width .3s;
	transition: width .3s;
	margin-right: 0;
	position: relative;
}

.searchbar .search-input .input {
	margin: 0;
	height: 56rpx;
}

.searchbar.searchbar-active .searchbar-cancel {
	right:20rpx;
	opacity: 1;
}

.searchbar.searchbar-active .searchbar-cancel + .search-input {
	margin-right: 88rpx;
}

.search-input {
	position: relative;
}

.search-input .input {
	box-sizing: border-box;
	width: 100%;
	height: 56rpx;
	line-height: 46rpx;
	display: block;
	border-radius: 10rpx;
	font-family: inherit;
	font-size: 28rpx;
	font-weight: normal;
	padding: 0 10rpx 0 60rpx;
	background-color: #fff;
	border: 1px solid #b4b4b4;
	color: #666;
}

.search-input .input::-webkit-input-placeholder {
	color: #cccccc;
	opacity: 1;
}

.search-input i {
	position: absolute;
	font-size: 36rpx;
	color: #b4b4b4;
	top: 0;
	left: 12rpx;
	line-height: 56rpx;
}

.search-input i + .input {
	padding-left: 56rpx;
}
.fui-tag-danger {
    background: #ff9326;
    color: #fff;
    font-size: 24rpx;
    -webkit-border-radius: 8rpx;
    border-radius: 8rpx;
    font-style: normal;
    padding: 4rpx 8rpx;
}

.fui-goods-item .detail .price{
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 32rpx;
    margin-top: 12rpx;
}
/*按钮租  */
.fui-icon-group .fui-icon-col .icon wx-image{
  height:88rpx;
  width:88rpx;
}

#unpaid {
    position: fixed;
    background: rgba(0, 0, 0, 0.5) none repeat scroll 0 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
    transition: all 1s;
    -moz-transition: all 1s; /* Firefox 4 */
    -webkit-transition: all 1s; /* Safari 和 Chrome */
    -o-transition: all 1s; /* Opera */
}

#unpaid .unpaid-alert {
    position: absolute;
    top: 110rpx;
    left: 44rpx;
    right: 44rpx;
    background: #fff;
    border-radius: 12rpx;
    height: 814rpx;
}
#unpaid .unpaid-alert .unpaid-title{
   font-size: 30rpx;
   text-align: center;
   margin-top: 52rpx
}
#unpaid .unpaid-alert .unpaid-subtitle{
  color: #999;
  text-align: center;
  width: 440rpx;
  margin: 24rpx auto;
  font-size: 28rpx
}
#unpaid .unpaid-alert .subtitle{
    display: block;
    font-size: 26rpx
}
#unpaid .unpaid-alert .fui-list-group{
    padding: 15rpx 22rpx 0;
    margin: 0 30rpx;
    background: #f7f7f7
}
#unpaid .unpaid-alert .fui-list-group .fui-list{
    padding: 15rpx 0
}
#unpaid .unpaid-alert .fui-list-group .fui-list:last-child{
    font-size: 24rpx;
    color: #666;
    justify-content: center;
}
/* #unpaid .unpaid-alert .fui-list-group .fui-list:last-child:before{
    display: block;
} */
#unpaid .unpaid-alert .fui-list-inner{
    height: 100rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
#unpaid .unpaid-alert image{
    width: 100rpx;
    float: left;
}
#unpaid .unpaid-alert .fui-list-inner .price{
  line-height: 1
}
#unpaid .unpaid-alert .fui-list-inner .bigprice{
  font-size: 30rpx
}
#unpaid .unpaid-alert .fui-list-group .fui-list:before{
    display: none
}
#unpaid .unpaid-alert .block{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 86rpx
}

/*广告-全屏*/
.default{
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 120;
}
.default swiper{
	width: 100%;
	height: 100%;
}
.default swiper .slide-image{
	width: 100%;
	height: 100%;
}
.adver-time{
	width: 80rpx;
	height: 70rpx;
	border-radius: 50%;
	background: rgba(0,0,0,0.4);
	position: absolute;
	top:20rpx;
	right: 30rpx;
	z-index: 200;
	text-align: center;
	font-size: 26rpx;
	color: #fff;
	padding-top: 10rpx;
}
.adver-time .time{
	font-size: 24rpx;
}
/*广告-样式二*/
.small-bot{
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 122;
}
.small-bot swiper{
	width: 560rpx;
	height: 784rpx;
	margin: 120rpx auto 0;
	border-radius: 10rpx;
	overflow: hidden;
}
.small-bot swiper .slide-image{
	width: 100%;
	height: 100%;
}
.small-bot-close{
	width: 66rpx;
	height: 66rpx;
	border-radius: 50%;
	text-align: center;
	line-height: 64rpx;
	font-size: 64rpx;
	color: #fff;
	margin: 30rpx auto 0;
}
.small-bot-close i{
	font-size: 60rpx;
}
/*授权弹窗*/
.model{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 199;
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


.fui-copyright-group{
  text-align:center;
  padding: 20rpx 24rpx; 
  color: #cecece;
}
.fui-copyright-group image{
  width: 60rpx;
  height: 60rpx;
  vertical-align: middle;
  margin-right: 10rpx;
}

.fui-copyright2-group{
  text-align:center;
  padding: 10rpx 24rpx 0;
  color: #cecece;
}
.fui-copyright2-group image{
  width: 60rpx;
  height: 60rpx;
}

/*优惠券  */
.shoucoupon{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 199;
  background-color: rgba(0,0,0,0.6);
}
.shoucoupon .inner{
  width: 620rpx;
  height: 730rpx;
  margin: 130rpx auto 0;
  padding-top: 90rpx;
  z-index: 201;
  position: absolute;
  left: 50%;
  margin-left: -310rpx;
}
.shoucoupon .inner .title{
  text-align: center;
  font-size: 38rpx;
  color: #2b0109;
}
.shoucoupon .inner .subtitle{
  text-align: center;
  font-size: 26rpx;
  color: #fff;
  margin-top: 50rpx;
}

.shoucoupon .inner .coupon-list{
  height: 450rpx;
  width: 534rpx;
  margin: 24rpx auto 0;
  min-height: 450rpx;
  padding: 0;
}
.coupon-list .item{
  padding: 18rpx 30rpx;
  width: 474rpx;
  height: 104rpx;
  background: #fff;
  margin-bottom: 10rpx;
  border-radius: 10rpx;
  color: #000;
}
.coupon-list .item-cell{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.coupon-list .item-inner .t{
  font-size: 28rpx;
}
.coupon-list .item-inner .b{
  font-size: 24rpx;
}
.coupon-list .item .indate{
  font-size: 22rpx;
}
.coupon-list .item .item-remark{
  color: #fc4444;
  font-size: 50rpx;
}
.shoucoupon .know{
  text-align: center;
  color: #fe484f;
  font-size: 34rpx;
  margin-top: 24rpx;
  font-weight: 600;
}
.closecoupon{
  height: 58rpx;
  text-align: center;
  color: #fff;
  margin-top: 984rpx;
}
.closecoupon i{
  font-size: 58rpx;
}


/*分销佣金  */
.goods-Commission{
   position: absolute;
    height:36rpx;
    line-height:36rpx;
    text-align: center;
    width:100%;
    bottom:0;
    color: #fff;
    font-size:20rpx;
    font-weight:bold;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    background: -moz-linear-gradient(left, #f0b938 0%, #f09938 100%);
    background: -webkit-linear-gradient(left, #f0b938 0%,#f09938 100%);
    background: -o-linear-gradient(left, #f0b938 0%,#f09938 100%);
    background: -ms-linear-gradient(left, #f0b938 0%,#f09938 100%);
    background: linear-gradient(to right, #f0b938 0%,#f09938 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#fff0b938, endColorstr=#fff09938,gradientType='1')
}
.fui-goods-group.block .goods-Commission{
    height:44rpx;
    line-height:44rpx;
    font-size:22rpx;
}
</style>