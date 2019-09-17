<template>
<view>
<view class="fui-content">
   
  <!--商品展示图 start  -->
  <view v-if="goods.thumb!=''" style="position:relative;">
      <image :src="goods.thumb" :style="'width:100%;height:' + windowWidth + 'px;'"></image>
      <view class="fui-swipe-layer" v-if="goods.istime>0 && timer">
        剩余：{{timer.day}}天{{timer.hour}}时{{timer.minute}}分{{timer.second}}秒
      </view>
  </view>
  <!--商品展示图 end  -->
  <!--商品信息 start -->
  <view class="fui-cell-group fui-detail-group">
    <view class="fui-cell">
      <view class="fui-cell-text name ">
      <span class="title-tip">
        <block v-if="goods.goodstype==0">商品</block>
        <block v-if="goods.goodstype==1">优惠券</block>
        <block v-if="goods.goodstype==2">余额</block>
        <block v-if="goods.goodstype==3">红包</block>
      </span>
      {{goods.title}}
      </view>
    </view>
    <view class="fui-cell">
      <view class="fui-cell-text price" style="font-weight: 400;">
        <span class="text-danger" style="vertical-align: middle;"> 
        <block v-if="goods.mincredit>0">{{goods.mincredit}}</block>
        <block v-else>{{goods.credit}}</block>        
          <span style="font-size: 22rpx;"> {{sysset.texts.credit || "积分"}} </span><block v-if="goods.money>0">+￥{{goods.money}}</block></span>
        <span class="original">￥{{goods.price}}</span>
      </view>
    </view>
    <view v-if="goods.isverify==1 && ((goods.usetime>0 && goods.isendtime==0)|| goods.isendtime==1)" class="fui-cell ">
      <view class="fui-cell-text flex">
        <text>使用有效期: 
          <block>截止至{{goods.endtime_str}}</block>
          <block>兑换之日起{{goods.usetime}}天内</block>
        </text>
      </view>
    </view>
    <view class="fui-cell ">
      <view class="fui-cell-text flex">
        <text>仅限{{goods.total}}份，已参与{{goods.joins}}次</text>
        <text v-if="goods.dispatch!='' && goods.isverify==0">邮费：{{goods.dispatchprice}}</text>
      </view>
    </view>
  </view>
  <!--商品信息 end -->
  <!--规格数量 start-->
  <view v-if="goods.hasoption>0" class="fui-cell-group" @tap="optionclick">
    <view class="fui-cell">
      <view class="fui-cell-text store" style="color: #999;">请选择规格及数量</view>
      <view class="fui-cell-remark">{{optionselect}}</view>
    </view>
  </view>
  <!--规格数量 end-->


  <!--兑换流程  -->
  <view v-if="goods.detail!=''" class="fui-cell-group rich-text">
    <view class="title">兑换流程</view>
    <view class="text wxParse"><component :wxParseData="wxParseData_detail.nodes" :is="wxParse"></component></view>
  </view>

  <!--注意事项  -->
  <view v-if="goods.noticedetail!=''" class="fui-cell-group rich-text">
    <view class="title">注意事项</view>
    <view class="text wxParse"><component :wxParseData="wxParseData_noticedetail.nodes" :is="wxParse"></component></view>
  </view>

  <!--tab  -->
  <view class="fui-cell-group">
    <view class="title">
      <view class="fui-tab fui-tab-danger">
        <view :class="'item ' + tabinfo" @tap="onTab" data-tab="tabinfo">商品详情</view>
        <view :class="'item ' + tabreplay" @tap="onTab" data-tab="tabreplay">商品评价</view>
        <view :class="'item ' + tablog" @tap="onTab" data-tab="tablog">参与记录</view>
      </view>
    </view>
    <!--商品详情 start  -->
    <view v-if="tabinfo=='active'" class="fui-cell-group goodsdetail">
        <view v-if="goods.goodsdetail!=''" class="wxParse">
          <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
        </view>
        <view v-else class="noinfo">暂无内容</view>
    </view>
    <!--商品详情 end  -->
    <!--商品评价 start  -->
    <view v-if="tabreplay=='active'" class="fui-cell-group comments">
        <view v-if="replays.length>0">
        <block>
          <view class="item" v-for="(item, index) in replays" :key="index">
            <view class="userinfo">
              <view class="user">
                <image :src="item.headimg"></image>
                <span>{{item.nickname}}</span>
                <span class="date">{{item.time_str}}</span>
              </view>
              <view class="feel">
                <span class="shine" v-if="item.level >= 1">★</span>
                <span class="shine" v-if="item.level >= 2">★</span>
                <span class="shine" v-if="item.level >= 3">★</span>
                <span class="shine" v-if="item.level >= 4">★</span>
                <span class="shine" v-if="item.level >= 5">★</span>
              </view>
            </view>
            <view class="comment">{{item.content}}</view>
            <view class="comment-images">
              <image v-for="(ite, index2) in item.images" :key="index2" :src="ite"></image>
            </view>
            <view class="comment-reply" v-if="item.reply_content.length > 0">
              卖家回复: {{item.reply_content}}
              <view class="comment-images">
                <image v-for="(ite, index2) in item.reply_images" :key="index2" :src="ite"></image>
              </view>
            </view>

            <!-- 追加评价start -->
            <view class="userinfo" v-if="item.append_checked != 0">
              <view class="user">
                <image :src="item.headimg"></image>
                <span>{{item.nickname}}</span>
                <span class="date">{{item.append_time_str}}</span>
              </view>
            </view>
            <view class="comment" v-if="item.append_checked != 0">{{item.append_content}}</view>
            <view class="comment-images" v-if="item.append_checked != 0">
              <image v-for="(ite, index2) in item.append_images" :key="index2" :src="ite"></image>
            </view>
            <view class="comment-reply" v-if="item.append_reply_content.lengtn > 0">
              卖家回复: {{item.append_reply_content}}
              <view class="comment-images">
                <image v-for="(ite, index2) in item.append_reply_images" :key="index2" :src="ite"></image>
              </view>
            </view>
            <!-- 追加评价end -->

            
          </view>
          </block>
          <view class="fui-cell" v-if="replaysmore">
            <view class="more" @tap="getreply">查看更多</view>
          </view>
        </view>
        <view v-else class="noinfo">暂无评价</view>
    </view>
    <!--商品评价 end  -->

    <!--参与记录 start  -->
    <view v-if="tablog=='active'" class="fui-cell-group tablog">
    <view v-if="log.length>0">
        <block v-for="(item, index) in log" :key="index">
          <view class="fui-cell">
            <view class="fui-cell-img">
              <image :src="item.avatar"></image>
            </view>
            <view class="fui-cell-text">{{item.nickname}}</view>
            <view class="fui-cell-remark noremark" style="font-size: 26rpx;color: #666;">{{item.createtime_str}}</view>
          </view>
        </block>
        <view class="fui-cell" v-if="logmore">
          <view class="more" @tap="getlog">查看更多</view>
        </view>
    </view>
    <view v-else class="noinfo">暂无记录</view>
      
      
    </view>
    
    <!--参与记录 end  -->
  </view>

  <!--为您推荐 start -->
  <view class="fui-list-group" style="padding: 0">
    <view class="fui-list noclick">
      <view class="fui-list-inner">
        <view class="title">为您推荐</view>
        <view class="text recommend">
          <block v-for="(item, index) in goodsrec" :key="index">
            <view class="item">
              <navigator open-type="navigate" :url="'/pages/creditshop/detail/index?id=' + item.id">
                <image :src="item.thumb"></image>
                <view class="title">{{item.title}}</view>
                <view class="price">{{item.credit}}{{sysset.texts.credit || "积分"}} <block v-if="item.money>0">+ ￥{{item.money}}</block></view>
              </navigator>
            </view>
          </block>
        </view>
      </view>
    </view>
  </view>
  <!--为您推荐 end -->
  <!--底部  -->
  <view class="fui-navbar" @tap="openActionSheet">
    <view v-if="goods.canbuy" class="nav-item btn">
      <view v-if="goods.type==1">立即抽奖</view>
      <view v-else>立即兑换</view>
    </view>
    <view v-else class="nav-item btn gray">{{goods.buymsg}}</view>
  </view>
</view>


<!--多规格弹窗  -->
<view :class="'fui-mask ' + (goodspicker?'active':'')"></view>
<view v-if="goodspicker" class="fui-modal goods-picker">
  <view class="option-picker">
    <view class="option-picker-inner">
      <view class="option-picker-cell goodinfo">
        <view class="closebtn" @tap="closepicker">
          <i class="icox icox-guanbi1" style="font-size:44rpx"></i>
        </view>
        <view class="img">
          <image class="thumb" style="width:100%;height:100%;" :src="optiongoods.thumb"></image>
        </view>
        <view class="info info-price text-danger">
          <span>
            <span class="price">{{optiongoods.credit}}</span>{{sysset.texts.credit || "积分"}} <span v-if="optiongoods.money>0">+¥<span class="price">{{optiongoods.money}}</span></span>
          </span>
        </view>
        <view class="info info-total">
          库存
          <text class="total text-danger">{{optiongoods.total}}</text>件
        </view>
        <view class="info info-titles">
          <block>{{optionselect}}</block>
        </view>
      </view>
      <view class="option-picker-options">
        <view class="option-picker-cell option spec" v-for="(item, index) in specs" :key="index">
          <view class="title">{{item.title}}</view>
          <view class="select">
            <block v-for="(specitem, index2) in item.items" :key="index2"><!--btn-danger-->
              <view :class="'btn btn-default btn-sm nav spec-item ' + specitem.class" :data-specid="specitem.id" :data-idx="idx" :data-thumb="specitem.thumb" :data-title="specitem.title" @tap="specselect">{{specitem.title}}</view>
            </block>
          </view>
        </view>
      </view>
    </view>
    <view class="fui-navbar" @tap="openActionSheet">
      <block>
        <a href class="nav-item btn buybtn" @tap="closepicker">{{optionbtn}}</a>
      </block>
    </view>
  </view>
</view> 
    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
    	<!--空白快  适应iponex  -->
	<view v-if="isIpx" style="hight: 50rpx;"></view>
</view>
</template>

<script>
/**
 *
 * index.js
 *
 * @create 2017-01-04
 * @author 咖啡
 *
 *
 */
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      limits: true,
      tabinfo: 'active',
      tabreplay: '',
      tablog: '',
      hasoption: false,
      options: [],
      goodsoptions: [],
      optionid: 0,
      specs: [],
      goods: [],
      log: [],
      logmore: false,
      logpage: 1,
      replays: [],
      replaysmore: false,
      replaypage: 1,
      stores: [],
      goodsrec: [],
      goodspicker: false,
      selectspecs: [],
      optionselect: "请选择规格",
      optionbtn: '确认',
      timer: [],
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      windowWidth: 0,
      windowHeight: 0,
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000
    };
  },

  /*页面加载*/
  onShow: function () {
    var $this = this; // var specs = [];
    // var options = [];

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

    $this.getDetail();
    /*获取授权*/

    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        $this.setData({
          limits: limits
        });
      }
    });
  },
  onLoad: function (options) {
    var $this = this;
    options = options || {};
    wx.getSystemInfo({
      success: function (result) {
        $this.setData({
          windowWidth: result.windowWidth,
          windowHeight: result.windowHeight
        });
      }
    });
    $this.setData({
      options: options
    });
  },
  components: {},
  props: {},
  methods: {
    onTab: function (e) {
      var $this = this;
      var active = e.currentTarget.dataset.tab;

      if (active == "tabreplay") {
        $this.setData({
          tabinfo: '',
          tabreplay: 'active',
          tablog: ''
        });
      } else if (active == "tablog") {
        $this.setData({
          tabinfo: '',
          tabreplay: '',
          tablog: 'active'
        });
      } else {
        $this.setData({
          tabinfo: 'active',
          tabreplay: '',
          tablog: ''
        });
      }
    },
    //参与记录翻页
    getlog: function () {
      var $this = this;
      $this.setData({
        logpage: $this.data.logpage + 1
      });
      core.get('creditshop/detail/getlistlog', {
        id: $this.options.id,
        page: $this.data.logpage
      }, function (msg) {
        msg.list = $this.data.log.concat(msg.list);
        $this.setData({
          log: msg.list,
          logmore: msg.more
        });
      });
    },
    getreply: function () {
      var $this = this;
      $this.setData({
        replaypage: $this.data.replaypage + 1
      });
      core.get('creditshop/detail/getlistreply', {
        id: $this.options.id,
        page: $this.data.replaypage
      }, function (msg) {
        msg.list = $this.data.replays.concat(msg.list);
        $this.setData({
          replays: msg.list,
          replaysmore: msg.more
        });
      });
    },

    /*获取商品详情*/
    getDetail: function () {
      var $this = this;
      var options = $this.data.options;
      core.get('creditshop/detail', {
        id: options.id
      }, function (result) {
        if (result.error > 0) {
          foxui.toast($this, result.message);
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
          return;
        }

        parser.wxParse('wxParseData', 'html', result.goods.goodsdetail, $this, '0');
        parser.wxParse('wxParseData_subdetail', 'html', result.goods.subdetail, $this, '0');
        parser.wxParse('wxParseData_noticedetail', 'html', result.goods.noticedetail, $this, '0');
        parser.wxParse('wxParseData_usedetail', 'html', result.goods.usedetail, $this, '0');
        $this.setData({
          goods: result.goods,
          log: result.log,
          logmore: result.logmore,
          replays: result.replys,
          replaysmore: result.replymore,
          stores: result.stores,
          goodsrec: result.goodsrec,
          hasoption: result.goods.hasoption,
          sysset: result.sysset
        });
        /*倒计时*/

        if (result.goods.istime > 0 && result.goods.timestart > 0 && result.goods.timeend > 0) {
          clearInterval($this.data.timer);
          var timer = setInterval(function () {
            $this.countDown(result.goods.timestart, result.goods.timeend);
          }, 1000);
          $this.setData({
            timer: timer
          });
        }
      });
    },

    /*倒计时控件*/
    countDown: function (timestart, timeend) {
      var now = parseInt(Date.now() / 1000);
      var endDate = timestart > now ? timestart : timeend;
      var leftTime = endDate - now;
      var leftsecond = parseInt(leftTime);
      var day = Math.floor(leftsecond / (60 * 60 * 24));
      var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
      var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
      var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
      var time = {
        day: day,
        hour: hour,
        minute: minute,
        second: second
      };
      this.setData({
        timer: time
      });
    },

    /*选择规格picker事件*/
    optionclick: function () {
      var $this = this;
      var id = $this.data.goods.id;
      var hasoption = $this.data.goods.hasoption;
      var specs = $this.data.specs;
      var canbuy = $this.data.goods.canbuy;

      if (!canbuy) {
        foxui.toast($this, $this.data.goods.buymsg);
        return;
      }

      if (hasoption) {
        if (specs.length == 0) {
          core.get('creditshop/detail/option', {
            id: id
          }, function (result) {
            $this.setData({
              goodspicker: true,
              goodsoptions: result.options,
              optiongoods: result.goods,
              specs: result.specs
            });
          });
        } else {
          $this.setData({
            goodspicker: true
          });
        }
      } else {
        $this.setData({
          hasoption: false
        });
        return;
      }
    },

    /*选择规格*/
    specselect: function (event) {
      var $this = this;
      var selectspecs = $this.data.selectspecs;
      var idx = event.target.dataset.idx;
      var itemid = event.target.dataset.specid;
      selectspecs[idx] = {
        id: itemid,
        title: event.target.dataset.title
      };
      $this.setData({
        selectspecs: selectspecs
      });
      var specs = $this.data.specs;
      var specsitem = specs[idx].items;
      specsitem.forEach(function (e) {
        if (itemid == e.id) {
          e.class = "btn-danger";
        } else {
          e.class = "";
        }
      });
      specs[idx].items = specsitem;
      $this.setData({
        specs: specs
      });
      var title = '';
      var optionTitle = '';
      selectspecs.forEach(function (event) {
        title = event.title + ';' + title;
        optionTitle = event.id + '_' + optionTitle;
      });
      optionTitle = optionTitle.substring(0, optionTitle.length - 1);
      var options = $this.data.goodsoptions;

      if (event.target.dataset.thumb != '') {
        $this.setData({
          'optiongoods.thumb': event.target.dataset.thumb
        });
      }

      options.forEach(function (event) {
        if (event.specs == optionTitle) {
          $this.setData({
            optionid: event.id,
            'optiongoods.total': event.total,
            'goods.credit': event.credit,
            'goods.money': event.money,
            'optiongoods.credit': event.credit,
            'optiongoods.money': event.money,
            'optionselect': '已选 ' + event.title
          });

          if (event.total < $this.data.total) {
            $this.setData({
              'goods.canbuy': false,
              'goods.buymsg': '库存不足',
              optionbtn: '库存不足'
            });
            foxui.toast($this, "库存不足");
          } else {
            $this.setData({
              'goods.canbuy': true,
              'goods.buymsg': '库存不足',
              optionbtn: '确认'
            });
          }
        }
      });
    },

    /*关闭picker*/
    closepicker: function () {
      this.setData({
        goodspicker: false
      });
    },

    /*积分兑换绑定事件*/
    openActionSheet: function () {
      var $this = this;
      var canbuy = $this.data.goods.canbuy;
      var hasoption = $this.data.goods.hasoption;
      var optionid = $this.data.optionid;

      if (canbuy) {
        if (hasoption > 0) {
          if (optionid > 0) {
            wx.redirectTo({
              url: '/pages/creditshop/create/index?id=' + $this.data.goods.id + '&optionid=' + optionid
            });
          } else {
            $this.optionclick();
          }
        } else {
          wx.redirectTo({
            url: '/pages/creditshop/create/index?id=' + $this.data.goods.id
          });
        }
      } else {
        return;
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
.fui-content{
  padding-bottom: 100rpx;
}
.fui-swiper{
  width: 100%;
  height: 750rpx;
}
.fui-swiper image{
  width: 100%;
  height: 100%;
}

.fui-detail-group {
    margin-top: 0
}
.fui-detail-group .fui-cell {
    padding: 0 20rpx;
}
.fui-detail-group .fui-cell:before,.fui-sale-group:before {
    border: 0;
}
.fui-detail-group .fui-cell .price {
    font-size: 44rpx;
    color: #ff5555;
    line-height: 60rpx;
    padding: 5rpx 0;
    font-weight: bold;
}
.fui-detail-group .fui-cell .price .original {
    font-size:24rpx;
    color: #ccc;
    text-decoration:line-through;
    padding-left: 8rpx;
    font-weight: normal
}
.fui-detail-group .fui-cell .name {
    padding: 20rpx 0 5rpx;
    font-size: 30rpx;
    line-height: 34rpx;
    color: #333
}
.fui-detail-group .fui-cell .share {
    padding-left: 32rpx;
    margin-top: 16rpx;
    position: relative;
    text-align: center;
}
.fui-detail-group .fui-cell .share:before {
    content: " ";
    border-left: 1px solid #C0C0C0;
    height: 100%;
    left: 0;
    position: absolute;
}
.fui-detail-group .fui-cell .share:after,.fui-shop-group .fui-cell:before,
.fui-shop-group .fui-list:after{
    display: none;
}
.fui-detail-group .fui-cell .flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size: 24rpx;
    color: #999;
    padding-bottom: 16rpx;
    flex-wrap: wrap;
    justify-content: space-between
}
.fui-detail-group .fui-cell .flex text {
    width: auto;
    margin-right: 40rpx
}
.fui-detail-group .fui-cell .flex text:first-child {
    text-align: left;
}
.fui-detail-group .fui-cell .flex text:last-child {
    text-align: right;
}
.goods-subtitle text {
    font-size: 24rpx;
    line-height: 34rpx
}
.row-time {
    padding: 0 0 20rpx 20rpx;
    overflow: hidden;
}
.fui-labeltext .text .number,.fui-sale-group .fui-according-header .text .title{
    font-weight: bold;
}
.fui-labeltext .text .time {
    font-size: 26rpx;
    padding: 0 4rpx;
}


.fui-tab{
  margin-bottom: 0;
}
.fui-tab:after{
  display: none;
}
.fui-cell-img image{
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}
.fui-cell .more{
  width: 100%;
  text-align: center;
  line-height: 50rpx;
  font-size: 28rpx;
  color: #666;
}



/*推荐  */

.recommend {
    height: auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    -ms-flex-align: start;
    align-items: start;
    position: relative;
}

.recommend .item {
    height: auto;
    width: 33.33%;
    padding:26rpx 8rpx 8rpx 8rpx;
    text-align: center;
}

.recommend .item image {
    height: 160rpx;
    width: 160rpx;
    vertical-align: middle;
}

.recommend .item .title {
    color: #666;
    font-size: 26rpx;
    height: 36rpx;
    line-height: 36rpx;
}

.recommend .item .price {
    color: #f24749;
    font-size: 20rpx;
}

.text.recommend:before{
  content: " ";
	position: absolute;
	left: 0;
	right: 0;
	top: 10rpx;
	height: 1px;
	border-top: 1px solid #ebebeb;
	color: #D9D9D9;
	transform-origin: 0 0;
	transform: scaleY(0.5);
}
.fui-list-inner .title{
  height: 80rpx;
  line-height: 80rpx;
}

.nav-item.btn{
  background: #ff5555;
  border: none;
}
.nav-item.btn.gray{
  background: #999999
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


/*评价  */
 .comments .item{
   padding: 20rpx;
   height: auto;
   position: relative;
 }
 .comments .item .userinfo {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}

.comments .item .userinfo .feel {
    width: 200rpx;
    font-size: 24rpx;
    text-align: right;
    color: #ef4f4f;
}

.comments .item .userinfo .feel.gray {
    color: #666;
}

.comments .item .userinfo .feel .icon {
    vertical-align: middle;
}

.comments .item .userinfo .user {
    width: 100%;
    font-size: 28rpx;
    color: #555;
}

.comments .item .userinfo .user image {
    height: 44rpx;
    width: 44rpx;
    border-radius: 44rpx;
    vertical-align: top;
}

.comments .item .userinfo .user .date {
    font-size: 24rpx;
    color: #888;
}
.comments .item .comment{
  padding-top: 8rpx;
  font-size: 26rpx;
  color: #666;
}
.comments .item .comment-images {
    padding: 8rpx 0;
}

.comments .item .comment-images image {
    width: 80rpx;
    height: 80rpx;
    vertical-align: middle;
}
.comments .item .comment-reply {
    margin-top: 8rpx;
    padding: 8rpx;
    background: #f2f2f2;
    border-radius: 4rpx;
    font-size: 26rpx;
    line-height: 32rpx;
    color: #777;
}

.fui-cell-group.rich-text{
  margin-top: 20rpx;
  padding: 20rpx 20rpx;
}
.fui-cell-group.rich-text .title{
  font-size: 30rpx;
  color: #000;
}
.fui-cell-group.rich-text .text{
  font-size: 28rpx;
  color: #666;
}
.noinfo{font-size:28rpx;color:#666;padding:20rpx;text-align: center;}


/*倒计时  */
.fui-swipe-layer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: 80rpx;
    padding: 0 20rpx;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    line-height: 80rpx;
    font-size: 30rpx;
}

/**规格弹出*/
.option-picker {
    height: auto;
    width: 100%;
    padding-bottom: 90rpx;
    z-index: 1001;
   
}
.option-picker .option-picker-cell {
    padding: 8rpx 20rpx 20rpx 20rpx;
}
.option-picker .option-picker-options {
    margin: 0;
    padding: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 560rpx; 
}
.option-picker .option-picker-cell.goodinfo {
    padding-left:220rpx;
    padding-top: 20rpx;
    position: relative;
}
.option-picker .option-picker-cell.goodinfo:after,.option-picker .option-picker-cell.option:after{
    content: " ";
    position: absolute;
    bottom: 0;
    left:20rpx;
    right: 20rpx;
    border-bottom: 1px solid #eee;
}
.option-picker .option-picker-cell.goodinfo .closebtn {
    width:44rpx;
    height:44rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    text-align: center;
    line-height: 44rpx;
    color: #999;
}
.option-picker .option-picker-cell.goodinfo .closebtn .icon {
    font-size: 61rpx;
}
.option-picker .option-picker-cell.goodinfo .img {
    height:168rpx;
    width:168rpx;
    background: #fff;
    padding:4rpx;
    border: 1px solid #eee;
    border-radius: 2px;
    position: absolute;
    top: -50rpx;
    left: 20rpx;
    box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.option-picker .option-picker-cell.goodinfo .img img {
    height: 100%;
    width: 100%;
}
.option-picker .option-picker-cell.goodinfo .info {
    font-size: 28rpx;
    height: 37rpx;
    line-height: 37rpx;
}
.option-picker .option-picker-cell.goodinfo .info-total {
    font-size: 26rpx;
    color: #999
}
.option-picker .option-picker-cell.goodinfo .info-price .price {
    font-size:32rpx;
}
.option-picker .option-picker-cell.goodinfo .info-titles {
    font-size: 26rpx;
    color: #000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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
.option-picker .option-picker-cell .fui-number {
    float: right;
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
.option-picker .diyform-container:before {
    display: none;
}



.fui-mask.active{
  display: block;
}
/*确认兑换弹窗  */
.showmodal{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
.showmodal.in{
  display: block;
}
.showmodal .inner{
  background: #fff;
  border-radius: 8rpx;
  width: 560rpx;
  height: 290rpx;
  margin: 345rpx auto 0;
  display: flex;
  flex-direction: column;
}
.showmodal .inner .text{
  text-align: center;
  height: 190rpx;
  line-height: 190rpx;
  font-size: 34rpx;
  font-weight: 600;
}
.showmodal .inner .btns{
  flex: 1;
  display: flex;
  text-align: center;
  line-height: 99rpx;
  height: 99rpx;
  border-top: 1rpx solid #d2d3d5;
}
.showmodal .inner .btns .item{
  border: none;
  flex: 1;
  height: 99rpx;
  font-size: 28rpx;
}
.showmodal .inner .btns .item.btn-confirm{
  border-left: 1rpx solid #d2d3d5;
  color: #00c202;
}
.showmodal .inner .btns .item.disabled{
  background: #000;
}
</style>