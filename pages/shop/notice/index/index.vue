<template>
<view>
<!--index.wxml-->
<loading v-if="!show">加载中...</loading>
<view class="fui-page page-shop-notice-detail" v-if="show">
   <view class="fui-content">
     <view class="fui-list-group">
     <block v-for="(item, index) in list" :key="index">
        <component :item="item" :is="tpl_list"></component>
     </block>
     </view>
   </view>
   <view v-if="list.length<=0 && !loading" class="content-empty"><icon type="search" size="80"></icon><view>暂时没有任何公告</view></view>
</view>
</view>
</template>

<script>
//index.js
//获取应用实例
var app = getApp();
var core = app.requirejs('core');

export default {
  data() {
    return {
      page: 1,
      loaded: false,
      loading: false,
      list: []
    };
  },

  onLoad: function (options) {
    app.url(options);
    this.getList();
  },
  onReachBottom: function () {
    if (this.loaded) {
      return;
    }

    this.getList();
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this;
      $this.setData({
        loading: true
      });
      core.get('shop/notice/get_list', {
        page: this.page
      }, function (result) {
        $this.setData({
          loading: false,
          show: true
        });

        if (result.list.length > 0) {
          $this.setData({
            page: $this.data.page + 1,
            list: $this.data.list.concat(result.list)
          });
        } else {
          if (result.list.length < result.pagesize) {
            $this.setData({
              loaded: true
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
