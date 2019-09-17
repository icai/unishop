<template>
<view>
<loading v-if="!show">加载中...</loading>
<!--未授权弹窗-->
<view class="model" v-if="modelShow">
	<view class="inner1">
		<view class="title">用户未授权</view>
		<view class="image"><image :src="imgUrl + 'plugin/app/static/images/wxapp/shouquan.png'"></image></view>
		<view class="subtitle">您需要先开启【用户信息】，才能使用此功能哦~</view>
		<view class="model-btns">
			<view class="cancel" @tap="cancelclick">取消</view>
			<view class="confirm" @tap="confirmclick">去设置</view>
		</view>
	</view>
</view>
<view class="page header-sort navbar goodslist">
	<view class="fui-header">
		<view class="searchbar">
      <icon type="search" size="18"></icon>
			<input name="search" @confirm="bindSearch" @input="bindInput" @focus="bindFocus" placeholder="输入关键字进行搜索" :value="params.keywords" :focus="focusin"></input>
		</view>
    <text v-if="!fromsearch" :class="'icon icox ' + (listmode==''?'icox-app':'icox-viewlist')" @tap="changeMode"></text>
		<view v-if="fromsearch" class="cancel" @tap="bindback">取消</view>
	</view>
	<!--商品排序-->
	<view class="sort">	
		<view :class="'item ' + ( params.order=='' || !params.order?'on':'')" data-order @tap="bindSort">
			<view class="text">综合</view>
		</view>
		<view :class="'item ' + ( params.order=='sales'?'on':'')" data-order="sales" @tap="bindSort">
			<view class="text">销量</view>
		</view>
		<view :class="'item item-price ' + ( params.order=='minprice'?'on':'')" data-order="minprice" @tap="bindSort">
			<view class="text">价格 <image :src="'/static/images/icon/listsort' + listorder + '.png'" class="icon"></image></view>
		</view>
		<view :class="'item ' + (isfilter?'on':'')" @tap="showFilter">
			<view class="text">筛选 <image :src="(isfilter?'/static/images/icon-red/filter.png':'/static/images/icon/filter.png')" class="icon small"></image></view>
		</view>
	</view>
	<!--商品列表-->
	<view :class="'fui-goods-group ' + listmode">
		<block v-for="(item, index) in list" :key="index">
			<component :item="item" :is="tpl_list"></component>
		</block>
	</view>
	<!--数据显示-->
    <view class="fui-loading" v-if="loading">
        <view class="icon"></view>
        <view class="text">正在加载</view>
    </view>
    <view class="fui-loading empty" v-if="list.length==total&&total>0">
        <view class="text">没有更多了</view>
    </view>
    <view class="fui-loading empty" v-if="total<=0 && !loading">
        <view class="text">暂时没有任何商品</view>
    </view>

	<view class="records" v-if="fromsearch">
		<block v-if="searchRecords.length>0">
			<view class="records-title">
				<view class="pull-right text-danger" @tap="delRecord">清除</view>
				<view>历史搜索</view>
			</view>
			<view class="navs">
				<nav @tap="bindnav" :data-text="item" v-for="(item, index) in searchRecords" :key="index">{{ item }}</nav>
			</view>
		</block>
		<view class="records-title" hidden>
			<view class="pull-right text-danger">换一批</view>
			<view>热门搜索</view>
		</view>
		<view class="navs" hidden>
			<nav @tap="bindnav" data-text="推子">推子</nav>
			<nav @tap="bindnav" data-text="推子">推子</nav>
			<nav @tap="bindnav" data-text="推子">推子</nav>
		</view>
	</view>

	<!--公用底部菜单-->
    <include src="/pages/common/goods-picker.wxml"></include>
    <include src="/pages/common/menu.wxml"></include>
    <include src="/pages/common/city-picker.wxml"></include>

	<view :class="'screen ' + (isFilterShow?'in':'')">
		<view class="attribute">
			<view class="item on">
				<view :class="'btn btn-default-o block ' + ( filterBtns.isrecommand ?'btn-danger-o':'')" data-type="isrecommand" @tap="btnFilterBtns"><icon v-if="filterBtns.isrecommand" type="success_no_circle" color="#fd5454" size="12"></icon> 推荐商品</view>
			</view>
			<view class="item">
				<view :class="'btn btn-default-o block ' + ( filterBtns.isnew ?'btn-danger-o':'')" data-type="isnew" @tap="btnFilterBtns"><icon v-if="filterBtns.isnew" type="success_no_circle" color="#fd5454" size="12"></icon> 新品上市</view>
			</view>
			<view class="item">
				<view :class="'btn btn-default-o block ' + ( filterBtns.ishot ?'btn-danger-o':'')" data-type="ishot" @tap="btnFilterBtns"><icon v-if="filterBtns.ishot" type="success_no_circle" color="#fd5454" size="12"></icon> 热卖商品</view>
			</view>
			<view class="item">
				<view :class="'btn btn-default-o block ' + ( filterBtns.isdiscount ?'btn-danger-o':'')" data-type="isdiscount" @tap="btnFilterBtns"><icon v-if="filterBtns.isdiscount" type="success_no_circle" color="#fd5454" size="12"></icon> 促销商品</view>
			</view>
			<view class="item">
				<view :class="'btn btn-default-o block ' + ( filterBtns.issendfree ?'btn-danger-o':'')" data-type="issendfree" @tap="btnFilterBtns"><icon v-if="filterBtns.issendfree" type="success_no_circle" color="#fd5454" size="12"></icon> 卖家包邮</view>
			</view>
			<view class="item">
				<view :class="'btn btn-default-o block ' + ( filterBtns.istime ?'btn-danger-o':'')" data-type="istime" @tap="btnFilterBtns"><icon v-if="filterBtns.istime" type="success_no_circle" color="#fd5454" size="12"></icon> 限时抢购</view>
			</view>
		</view>
		<block v-if="catlevel !=-1 && opencategory">
			<view class="title">选择分类</view>
			<view class="cate" data-catlevel="{$catlevel}">
				<view class="item">
					<view v-for="(item, item) in category_parent" :key="item">
						<nav :data-id="item.id" data-level="1" :class="( category_parent_selected==item.id?'on':'')" @tap="bindCategoryEvents">{{item.name}}</nav>
					</view>
				</view>
				<view class="item" v-if="catlevel >=2">
					<view v-for="(item, item) in category_child" :key="item">
						<nav :data-id="item.id" data-level="2" :class="( category_child_selected==item.id?'on':'')" @tap="bindCategoryEvents">{{item.name}}</nav>
					</view>
				</view>
				<view class="item" v-if="catlevel >=3">
					<view v-for="(item, item) in category_third" :key="item">
						<nav :data-id="item.id" data-level="3" :class="( category_third_selected==item.id?'on':'')" @tap="bindCategoryEvents">{{item.name}}</nav>
					</view>
				</view>
			</view>
		</block>
		<view class="btns">
			<view class="cancel" @tap="bindFilterCancel">取消筛选</view>
			<view class="confirm" @tap="bindFilterSubmit">确认</view>
		</view>
	</view>
  
</view>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
<view class="nav-mask" :style="(active?'display:block':'')" @tap="emptyActive"></view>
<view :class="'fui-mask ' + (isFilterShow?'show':'hide')" @tap="showFilter"></view>
</view>
</template>

<script>
/**
 *
 * favorite\index.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-02-07
 *
 */
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      specs: [],
      options: [],
      diyform: {},
      specsTitle: '',
      total: 1,
      active: '',
      slider: '',
      tempname: '',
      buyType: '',
      icons: app.requirejs('icons'),
      isFilterShow: false,
      listmode: 'block',
      listsort: '',
      page: 1,
      loaded: false,
      loading: true,
      allcategory: [],
      catlevel: -1,
      opencategory: false,
      category: {},
      category_child: [],
      category_third: [],
      filterBtns: {},
      isfilter: 0,
      list: [],
      params: {},
      count: 0,
      defaults: {
        keywords: '',
        isrecommand: '',
        ishot: '',
        isnew: '',
        isdiscount: '',
        issendfree: '',
        istime: '',
        cate: '',
        order: '',
        by: 'desc',
        merchid: 0
      },
      lastcat: '',
      fromsearch: false,
      searchRecords: [],
      areas: [],
      limits: true,
      modelShow: false
    };
  },

  onReachBottom: function () {
    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.getList();
  },
  onShow: function () {
    if (this.fromsearch) {
      this.setFocus();
    }

    var $this = this;
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
    $this.setData({
      imgUrl: app.globalData.approot
    });
    setTimeout(function () {
      $this.setData({
        areas: app.getCache("cacheset").areas
      });
    }, 3000);

    if (!$.isEmptyObject(options)) {
      var isfilter = options.isrecommand || options.isnew || options.ishot || options.isdiscount || options.issendfree || options.istime ? 1 : 0;
      this.setData({
        params: options,
        isfilter: isfilter,
        filterBtns: options,
        fromsearch: options.fromsearch || false
      });
    }

    this.initCategory();

    if (!options.fromsearch) {
      this.getList();
    }

    this.getRecord();
  },
  components: {},
  props: {},
  methods: {
    initCategory: function () {
      var $this = this;
      core.get('goods/get_category', {}, function (result) {
        $this.setData({
          allcategory: result.allcategory,
          category_parent: result.allcategory.parent,
          category_child: [],
          category_third: [],
          catlevel: result.catlevel,
          opencategory: result.opencategory,
          show: true
        });
      });
    },
    getList: function () {
      var $this = this;
      $this.setData({
        loading: true
      });
      $this.data.params.page = $this.data.page;
      core.get('goods/get_list', $this.data.params, function (result) {
        var data = {
          loading: false,
          count: result.total,
          show: true
        };

        if (!result.list) {
          result.list = [];
        }

        if (result.list.length > 0) {
          data.page = $this.data.page + 1;
          data.list = $this.data.list.concat(result.list);

          if (result.list.length < result.pagesize) {
            data.loaded = true;
          }
        }

        $this.setData(data);
      });
    },
    changeMode: function () {
      if (this.listmode == 'block') {
        this.setData({
          listmode: ''
        });
      } else {
        this.setData({
          listmode: 'block'
        });
      }
    },
    bindSort: function (e) {
      var order = e.currentTarget.dataset.order;
      var params = this.params;

      if (order == '') {
        if (params.order == order) {
          return;
        }

        params.order = '';
        this.setData({
          listorder: ''
        });
      } else if (order == 'minprice') {
        this.setData({
          listorder: ''
        });

        if (params.order == order) {
          if (params.by == 'desc') {
            params.by = 'asc';
          } else {
            params.by = 'desc';
          }
        } else {
          params.by = 'asc';
        }

        params.order = order;
        this.setData({
          listorder: params.by
        });
      } else if (order == 'sales') {
        if (params.order == order) {
          return;
        }

        this.setData({
          listorder: ''
        }); //params = this.data.defaults;

        params.order = 'sales';
        params.by = 'desc';
      }

      this.setData({
        params: params,
        page: 1,
        list: [],
        loading: true,
        loaded: false,
        sort_selected: order
      });
      this.getList();
    },
    showFilter: function () {
      this.setData({
        isFilterShow: this.isFilterShow ? false : true
      });
    },
    btnFilterBtns: function (e) {
      var type = e.target.dataset.type;

      if (!type) {
        return;
      }

      var filterBtns = this.filterBtns;

      if (!filterBtns.hasOwnProperty(type)) {
        filterBtns[type] = '';
      }

      if (filterBtns[type]) {
        delete filterBtns[type];
      } else {
        filterBtns[type] = 1;
      }

      var isfilter = $.isEmptyObject(filterBtns) ? 0 : 1;
      this.setData({
        filterBtns: filterBtns,
        isfilter: isfilter
      });
    },
    bindFilterCancel: function () {
      this.defaults.cate = '';
      var params = this.defaults;
      this.setData({
        page: 1,
        params: params,
        isFilterShow: false,
        lastcat: '',
        cateogry_parent_selected: '',
        category_child_selected: '',
        category_third_selected: '',
        category_child: [],
        category_third: [],
        filterBtns: {},
        loading: true,
        loaded: false,
        listorder: '',
        list: []
      });
      this.getList();
    },
    bindFilterSubmit: function () {
      var params = this.params;
      var filterBtns = this.filterBtns;

      for (var i in filterBtns) {
        params[i] = filterBtns[i];
      }

      if ($.isEmptyObject(filterBtns)) {
        params = this.defaults;
      }

      params.cate = this.lastcat;
      this.setData({
        page: 1,
        params: params,
        isFilterShow: false,
        filterBtns: filterBtns,
        list: [],
        loading: true,
        loaded: false
      });
      this.getList();
    },
    bindCategoryEvents: function (e) {
      var lastcat = e.target.dataset.id;
      this.setData({
        lastcat: lastcat
      });
      var level = e.target.dataset.level;

      if (level == 1) {
        this.setData({
          category_child: [],
          category_third: []
        });
        this.setData({
          category_parent_selected: lastcat,
          category_child: this.allcategory['children'][lastcat]
        });
      } else if (level == 2) {
        this.setData({
          category_third: []
        });
        this.setData({
          category_child_selected: lastcat,
          category_third: this.allcategory['children'][lastcat]
        });
      } else {
        this.setData({
          category_third_selected: lastcat
        });
      }
    },
    bindSearch: function (e) {
      var input = e.target;
      this.setData({
        list: [],
        loading: true,
        loaded: false
      });
      var value = $.trim(e.detail.value);
      var params = this.defaults;

      if (value != '') {
        params.keywords = value;
        this.setData({
          page: 1,
          params: params,
          fromsearch: false
        });
        this.getList();
        this.setRecord(value);
      } else {
        params.keywords = '';
        this.setData({
          page: 1,
          params: params,
          listorder: '',
          fromsearch: false
        });
        this.getList();
      }
    },
    bindInput: function (e) {
      var value = $.trim(e.detail.value);
      var params = this.defaults;
      params.keywords = '';
      params.order = this.params.order;
      params.by = this.params.by;

      if (value == '') {
        this.setData({
          page: 1,
          list: [],
          loading: true,
          loaded: false,
          params: params,
          listorder: params.by,
          fromsearch: true
        }); //this.getList();

        this.getRecord();
      }
    },
    bindFocus: function (e) {
      var value = $.trim(e.detail.value);

      if (value == '') {
        this.setData({
          fromsearch: true
        });
      }
    },
    bindback: function () {
      wx.navigateBack();
    },
    bindnav: function (e) {
      var text = $.trim(e.currentTarget.dataset.text);
      var params = this.defaults;
      params.keywords = text;
      this.setData({
        params: params,
        page: 1,
        fromsearch: false
      });
      this.getList();
      this.setRecord(text);
    },
    getRecord: function () {
      var records = app.getCache("searchRecords");
      this.setData({
        searchRecords: records
      });
    },
    setRecord: function (value) {
      if (value != '') {
        var records = app.getCache("searchRecords");

        if (!$.isArray(records)) {
          records = [];
          records.push(value);
        } else {
          var newArr = [];
          newArr.push(value);

          for (var i in records) {
            if (newArr.length > 20) {
              break;
            }

            if (records[i] == value || records == null || records == 'null') {
              continue;
            } else {
              newArr.push(records[i]);
            }
          }

          records = newArr;
        }

        app.setCache("searchRecords", records);
      } else {
        app.setCache("searchRecords", []);
      }

      this.getRecord();
    },
    delRecord: function () {
      this.setRecord('');
      this.setData({
        fromsearch: true
      });
    },
    setFocus: function () {
      var $this = this;
      setTimeout(function () {
        $this.setData({
          focusin: true
        });
      }, 1000);
    },
    // 购买picker
    selectPicker: function (e) {
      app.checkAuth();
      var $this = this; // if(!$this.data.limits){
      // 	$this.setData({modelShow: true})
      // 	return
      // }

      var goodslist = 'goodslist';
      goodspicker.selectpicker(e, $this, goodslist);
    },
    // 选规格
    specsTap: function (event) {
      var $this = this;
      goodspicker.specsTap(event, $this);
    },

    // 选赠品
    chooseGift(e) {
      goodspicker.chooseGift(e, this);
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
 @import "../../common/city-picker.css";
 page{
     height: auto; 
}
.page.onlysort {
    padding-top: 80rpx;
}
.fui-header {
    background: #fff;
    z-index: 9999;
    display: flex;
    padding: 0 15rpx;
}
.fui-header .searchbar {
    flex: 1;
    background: #efefef;
    border-radius: 8rpx;
    margin-right: 15rpx;
    display: flex;
    overflow: hidden;
    align-items:center;
}
.fui-header .searchbar icon {
    height: 36rpx;
    margin: 0 10rpx;
    vertical-align: middle;
}
.fui-header .searchbar input {
    border-radius: 8rpx;
    padding-right: 10rpx;
    width: 100%;
    font-size: 30rpx;
    background:transparent;
    color:#999999;
    height: 60rpx;
    line-height:60rpx;
    border: none;
}
.fui-header .icon {
    padding-right: 4rpx;
}
.fui-header .cancel {
    font-size: 30rpx;
    color: #666;
}
.sort {
    position: fixed;
    width: 100%;
    top: 88rpx;
    padding: .4rem 0;
    background: #fff;
    align-items: center;
    display: flex;
    z-index: 9999;
}
.page.onlysort .sort {
    top: 0;
}
.sort:after {
    content: " ";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #e7e7e7;
}
.sort .item {
    flex:1;
    position: relative;
    text-align: center;
    font-size: 28rpx;
    border-left: 1px solid #e7e7e7;
    color: #666;
    vertical-align: middle;
}
.sort .item:first-child {
    border: 0;
}
.sort .item.on .text {
    color: #fd5454;
}
.sort .item image {
    vertical-align: middle;
    height: 36rpx;
    width: 36rpx;
}
.sort .item .sorting {
    width: 8rpx;
    height: 8rpx;
    position: relative;
}
.sort .item .sorting .icon {
    font-size: 11px;
    position: absolute;
    transform: scale(0.6);
}
.sort .item-price .sorting .icon-sanjiao1 {
    top: 6rpx;
    left: 0;
}
.sort .item-price .sorting .icon-sanjiao2 {
    top: -6rpx;
    left: 0;
}
.sort .item-price.desc .sorting .icon-sanjiao1 {
    color: #ef4f4f
}
.sort .item-price.asc .sorting .icon-sanjiao2 {
    color: #ef4f4f
}
.screen {
    background: #fff;
    width: 100%;
    position: fixed;
    top: 150rpx;
    left: 0;
    z-index: 9998;
    opacity: 0;
    transition-property: height, opacity, transform;
    transition-duration: 300ms;
    transform: translate3d(0px, -100%, 0px) scaleY(0);
}
.page.onlysort .screen {
    top: 65rpx;
}
.screen.in {
    transition-duration: 0.3s;
    opacity: 1;
    height: auto;
    transform: translate3d(0px, 0px, 0px) scaleY(1);
}
.screen:after {
    content: " ";
    position: absolute;
    height: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: 2rpx solid #e7e7e7;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
}
.screen .attribute {
    height: auto;
    overflow: hidden;
    padding-bottom: 12rpx;
}
.screen .attribute .item {
    width: 33.33%;
    height: auto;
    display: block;
    padding: 0;
    margin: 0;
    float: left;
}
.screen .attribute .item .btn {
    padding: 0;
    height: 56rpx;
    line-height: 56rpx;
    margin-bottom: 0;
    border: .5px solid #999;
    color: #999;
    font-size: 26rpx;
}
.screen .attribute .item .btn-danger-o {
    color: #fd5454;
    border: .5px solid #fd5454;
}
.screen .attribute .item .btn .icon {
    display: none;
}
.screen .btns {
    height: auto;
    padding: 20rpx;
    position: relative;
    overflow: hidden;
    margin-top:0rpx;
    font-size:32rpx;
}
.screen .btns:before {
    height: 0;
    content: " ";
    position: absolute;
    top: 0;
    left: 12rpx;
    right: 12rpx;
    border-top: 2rpx solid #eee;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
}
.screen .btns div {
    display: inline-block;
    width: auto;
    font-size: 32rpx;
    line-height: 52rpx;
    color: #999;
    padding: 0 12rpx;
}
.screen .btns .cancel {
    float: left;
    color: #666;
}
.screen .btns .confirm {
    float: right;
    color: #fd5454;
}
.screen .title {
    padding: 0 12rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    color: #999;
    position: relative;
    text-align: center;
}
.screen .title span {
    float: right;
    padding-right: 12rpx;
}
.screen .title:before {
    height: 0;
    content: " ";
    position: absolute;
    top: 0;
    left: 12rpx;
    right: 12rpx;
    border-top: 1px solid #eee;
}
.screen .cate {
    height:480rpx;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin: 12rpx 0;
    padding: 0 12rpx;
}
.screen .cate:before {
    height: 0;
    content: " ";
    position: absolute;
    top: -12rpx;
    left: 12rpx;
    right: 12rpx;
    border-top: 1px solid #eee;
}
.screen .cate .item {
    width: 100%;
    height: inherit;
    overflow-y: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
}
.screen .cate .item:before {
    width: 0;
    height: 100%;
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    border-left: 1px solid #eee;
}
.screen .cate .item:first-child:before {
    border: 0;
}
.screen .cate .item nav {
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    text-align: center;
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 8rpx;
    display: block;
}
.screen .cate .item nav.on {
    background: #f9f9f9;
}
.records {
    position: fixed;
    background: #fff;
    top: 88rpx;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    padding: 0 20rpx 20rpx;
}
.records .records-title {
    font-size: 30rpx;
    line-height: 60rpx;
    color: #333;
    margin-top: 20rpx;
}
.records .records-title .pull-right {
    font-size: 25rpx;
    line-height: 60rpx;
    height: 60rpx;
    padding: 0 10rpx;
}
.records .navs nav {
    background: #efefef;
    font-size: 25rpx;
    padding: 8rpx 16rpx;
    margin: 10rpx 16rpx 0 0;
    border-radius: 5rpx;
    color: #333;
}
.fui-goods-item .detail .price .text {
    font-size: 32rpx
}
.original_price{
  height: 42rpx;
  line-height: 62rpx;
  color: #b2b2b2;
  font-size: 24rpx;
  text-decoration: line-through
}



/*未授权弹窗*/
.model{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1099;
}
.model .inner1{
	width: 624rpx;
	height: 600rpx;
	background: #fff;
	border-radius: 8rpx;
	margin: 260rpx auto;
	overflow: hidden;
}
.model .inner1 .title{
	font-size: 36rpx;
	color: #000;
	line-height: 100rpx;
	text-align: center;
	font-weight: 600;
  margin-top: 20rpx;
}
.model .inner1 .image{
	text-align: center;
  margin-top: 20rpx;
}
.model .inner1 image{
	width: 342rpx;
	height: 202rpx
}
.model .inner1 .subtitle{
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

.fui-goods-group .fui-goods-item .salez {
  position:absolute;
  right:0;
  bottom:0;
  height:auto;
  width:auto;
  z-index:999;
  background-repeat:no-repeat;
  background-position:bottom right;
  top:0;
  left:0;
}


/*购买按钮*/
.fui-goods-item .detail .price .buybtnbtn{
    display: inline-block;
    height: 40rpx;
    border: 1px solid #ff5555;
    width: auto;
    border-radius:4rpx;
}
.fui-goods-item .detail .price .buybtn-1{
    color: #ff5555;
    line-height:40rpx;
    background: #fff;
    padding: 0rpx 14rpx;
}
.fui-goods-item .detail .price .buybtn-2{
    color: #fff;
    line-height:40rpx;
    background: #ff5555;
    padding: 0rpx 14rpx;
}
.fui-goods-item .detail .price .buybtn-3{
  font-size: 28rpx
}
.fui-goods-item .detail .price .buybtn-3,.fui-goods-item .detail .price .buybtn-6{
    color: #fff;
    line-height:44rpx;
    height: 42rpx;
    background: #ff5555;
    width: 44rpx;
    padding:0;
}
.fui-goods-item .detail .price .buybtn-4{
  background: none;
  border: none;
  padding: 0;
  font-size:46rpx;
  height: auto
}
.fui-goods-item .detail .price .buybtn-5{
    color: #ff5555;
    line-height:40rpx;
    background: #fff;
    width: 40rpx;
    padding: 0;
    border-radius: 50%
}
.fui-goods-item .detail .price .buybtn-6{
    border-radius: 50%
}
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