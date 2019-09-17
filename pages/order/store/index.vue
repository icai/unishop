<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="fui-header">
        <view class="searchbar">
            <icon type="search" size="18"></icon>
			<input name="search" @focus="bindSearch" placeholder="输入关键字进行搜索" @input="search"></input>
		</view>
        <view :class="(search?'block':'none')">搜索</view>
    </view>

   <view class="fui-cell-group shop">
        <view class="fui-list" v-for="(item, index) in list" :key="index">
            <view class="fui-list-media">
                 <text class="icox icox-dianpu1" style="font-size:40rpx"></text>
            </view>
            <view class="fui-list-inner" @tap="select" :data-index="index">
                <view class="subtitle">{{ item.storename }}</view>
                 <view class="text">{{ item.realname }} {{ item.mobile }}</view> 
                <view class="text">地址：{{ item.address }}</view>
                <view v-if="show_distance" class="text" style="color: #999;">距离{{item.dast}}</view>                
            </view>
            <view class="fui-list-angle">
                <navigator @tap="phone" :data-phone="item.mobile">
                     <text class="icox icox-dianhua"></text>
                </navigator>
                <navigator :url="'/pages/order/store/map?id=' + item.id" hover-class="none" open-type="redirect">
                     <text class="icox icox-dingwei1"></text>
                </navigator>
            </view>
        </view>
    </view>
</view>
</view>
</template>

<script>
/**
 *
 * order/pay/index.js
 *
 * @create 2017-1-12
 * @author Young
 *
 * @update  Young 2017-01-12
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');

export default {
  data() {
    return {
      search: false,
      show_distance: false
    };
  },

  onHide: function () {// 页面隐藏
  },
  onShow: function () {// 页面显示
  },
  onReady: function () {// 页面渲染完成
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options
    });
    app.url(options);
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      var obj = {
        ids: $this.data.options.ids,
        type: $this.data.options.type,
        merchid: $this.data.options.merchid
      };
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          obj.lat = res.latitude;
          obj.lng = res.longitude;
          $this.setData({
            show_distance: true
          });
          core.get('store/selector', obj, function (result) {
            $this.setData({
              list: result.list,
              show: true
            });
          });
        },
        fail: function (ret) {
          setTimeout(function () {
            core.toast("位置获取失败");
          }, 1000);
          core.get('store/selector', obj, function (result) {
            $this.setData({
              list: result.list,
              show: true
            });
          });
        }
      });
    },
    bindSearch: function (e) {
      this.setData({
        search: true
      });
    },
    phone: function (e) {
      core.phone(e);
    },
    select: function (e) {
      var index = core.pdata(e).index;
      app.setCache("orderShop", this.list[index], 30);
      wx.navigateBack();
    },
    search: function (e) {
      var val = e.detail.value,
          old_list = this.old_list,
          list = this.list,
          new_list = [];

      if ($.isEmptyObject(old_list)) {
        old_list = list;
      }

      if (!$.isEmptyObject(old_list)) {
        $.each(old_list, function (index, item) {
          if (item.storename.indexOf(val) != -1) {
            new_list.push(item);
          }
        });
      }

      this.setData({
        list: new_list,
        old_list: old_list
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
/* pages/order/store/index.wxss */
.fui-nav{
    height: 90rpx;
    background: rgba(0, 0, 0, 0.1)
}
.image-48{
    margin-right: 30rpx
}
.local,.tel{
    margin:8rpx 0
}
.fui-header {
    background: #efefef;
    z-index:10002;
    display: flex;
    padding: 0 15rpx;
}
.fui-header .searchbar {
    flex: 1;
    background: #fff;
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
    padding:0 10rpx;
    width: 100%;
    font-size: 30rpx;
    background:transparent;
    color: #444;
    height: 60rpx;
    line-height:60rpx;
    border: none;
}
.shop{
  width:100%;
  overflow:auto;
  margin-top:80rpx;
}
.none{
    display: none
}
.block{
    font-size: 30rpx;
    color: #999
}
</style>