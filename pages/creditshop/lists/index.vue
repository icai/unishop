<template>
<view>
<!--搜索start-->
<view class="category-search">
  <view class="weui-flex">
    <view class="weui-flex__item category-search-form">
      <view class="flex-head-search" id="searchBar">
        <navigator class="weui-search-bar__form" open-type="navigate" hover-class="none" url>
          <view class="weui-search-bar__box category-search-box">
            <view class="flex-icon-search">
              <i class="icox icox-search" style="color: #b4b4b4;"></i>
            </view>
            <input class="weui-search-bar__input flex-input" type="text" @focus="focus" @input="doinput" placeholder="输入关键字进行搜索" :value="keywords"></input>
            <view :class="'searchbar-cancel searchbtn ' + showbtn" style="top: 0; right: 0" @tap="search">搜索</view>
            <navigator url="javascript:" class="weui-icon-clear" id="searchClear"></navigator>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</view>

<!--list  -->
<view class="fui-goods-group block" style="margin-top:100rpx; ">

  <view class="fui-goods-item" v-for="(item, index) in datas" :key="index">
    <navigator hover-class="none" open-type="navigate" :url="'/pages/creditshop/detail/index?id=' + item.id">
      <view class="image" :style="'background-image:url(' + item.thumb + ')'"></view>
    </navigator>
    <view class="detail goods_list_detail">
      <navigator hover-class="none" open-type="navigate" :url="'/pages/creditshop/detail/index?id=' + item.id">
        <view class="name">
          <span class="title-tip">
            <block v-if="item.goodstype==0">商品</block>
            <block v-if="item.goodstype==1">优惠券</block>
            <block v-if="item.goodstype==2">余额</block>
            <block v-if="item.goodstype==3">红包</block>
          </span>{{item.title}}</view>
      </navigator>
      <view class="price">
        <view class="text">{{item.credit}}积分<span v-if="item.money>0">+￥{{item.money}}</span></view>
      </view>
    </view>
  </view>

</view>

<!--数据显示-->
<view class="fui-loading" :hidden="load">
  <view class="icon"></view>
  <view class="text">正在加载</view>
</view>
<view class="fui-loading empty" :hidden="more">
  <view class="text">没有更多了</view>
</view>
<view class="fui-loading empty" :hidden="notgoods">
  <view class="text">暂时没有任何商品</view>
</view>
</view>
</template>

<script>
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      page: 1,
      datas: {},
      more: true,
      load: true,
      notgoods: true,
      keywords: '',
      cate: ''
    };
  },

  //上拉翻页
  onReachBottom: function (e) {
    this.setData({
      page: this.page + 1,
      load: false
    });
    this.get_list('', true);
    this.setData({
      load: true
    });
  },
  //下拉刷新
  onPullDownRefresh: function (e) {
    wx.showNavigationBarLoading();
    this.get_list();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },
  onLoad: function (options) {
    var $this = this;

    if (options.cate) {
      $this.setData({
        cate: options.cate
      });
    }

    if (options.keywords) {
      $this.setData({
        keywords: options.keywords
      });
    }

    $this.get_list();
  },
  components: {},
  props: {},
  methods: {
    focus: function () {
      this.setData({
        showbtn: 'in'
      });
    },
    get_list: function (keywords, onpage) {
      var $this = this;
      core.post('creditshop/lists/getlist', {
        page: $this.data.page,
        keywords: $this.data.keywords,
        cate: $this.data.cate
      }, function (msg) {
        if (msg.error == 0) {
          if (msg.list.length == 0) {
            //如果没有数据则显示没有更多
            if ($this.data.page == 1) {
              $this.setData({
                notgoods: false
              });
            }
          } else {
            $this.setData({
              notgoods: true
            });

            if (msg.next_page <= $this.data.page && $this.data.page != 1) {
              $this.setData({
                more: false
              });
            }
          }

          if (!onpage) {
            $this.setData({
              datas: msg.list
            });
          } else {
            //如果是翻页的话则追加
            msg.list = $this.data.datas.concat(msg.list);
            $this.setData({
              datas: msg.list
            });
          }
        }
      });
    },
    search: function () {
      this.setData({
        page: 1
      });
      this.get_list();
    },
    doinput: function (e) {
      this.setData({
        keywords: e.detail.value
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
.flex-head .flex-head-item {
	padding:0 16rpx;
}
.flex-head-search {
position:relative;
display:-webkit-box;
display:-webkit-flex;
display:flex;
box-sizing:border-box;
background:#f1f1f2;
padding:10px 10px;
}
.flex-icon-search {
width:30px;
height:30px;
left:0px;
top:0px;
line-height:30px;
text-align:center;

}
.flex-icon-search .icox{
  position:absolute;
font-size:36rpx;
color:#b4b4b4;
top:0;
left:12rpx;
line-height:56rpx;

}
.flex-search-bar {
	padding-top:80rpx;
}
.flex-input {
	height:56rpx;
	line-height:56rpx;
	display:block;
	overflow:hidden;
  flex: 1
}
.category-search {
	position:fixed;
	left:0;
	top:0;
	width:100%;
	z-index:100;
}
.category-search::before {
	background:#fff;
position:relative;
z-index:10;
height:auto;
padding-right:20rpx;
padding-left:20rpx;
background-color:#f7f7f8;
-webkit-backface-visibility:hidden;
backface-visibility:hidden;
overflow:hidden;

}
.category-search-form {
	background:#fff;
}
.category-search-box {
	/* background:#efefef; */
  display: flex;
}
.searchbar-cancel.searchbtn{
  width: 80rpx;
  background: #f1f1f2;
  height: 60rpx;
  text-align: right;
  color: #5f646e;
  line-height: 60rpx;
  display: none;
}
.searchbar-cancel.searchbtn.in{
  display: block;
}

.title-tip{
  background: #ff5555;
  padding: 5rpx 10rpx;
  color: #fff;
  font-size: 22rpx;
  position: relative;
  top: -1rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
</style>