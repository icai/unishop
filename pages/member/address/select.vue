<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<loading v-if="!show">加载中...</loading>
<view :class="'page ' + paddingb" style="padding-bottom:4rem" v-if="show">

    <block v-if="list.length>0">
        <view class="fui-list-group" v-for="(item, index) in list" :key="index">
            <view class="fui-list address-item">
                <view class="fui-list-media" @tap="select" :data-index="index">
                    <radio color="#fd5454" class="zoom-70" name="default" :checked="( item.isdefault>0 ? true : false )"></radio>
                </view>
                <view class="fui-list-inner" @tap="select" :data-index="index">
                    <view class="title"><span class="realname">{{ item.realname }}</span> <span class="mobile">{{ item.mobile }}</span></view>
                    <view class="text">{{ item.province }}{{ item.city }}{{ item.area}} {{ item.address }}</view>
                </view>
                <navigator class="fui-list-angle" :url="'/pages/member/address/post?id=' + item.id + '&type=order'" hover-class="none" open-type="redirect">

                    <view class="fui-cell-icon"><text class="icox icox-icon_huida_tianxiebtn" style="font-size: 48rpx;color: #666;"></text> </view>
                </navigator>
            </view>
        </view>
    </block>

    <view class="fui-loading empty" v-if="list.length<1 && loaded">
        <view class="text">没有数据</view>
    </view>

    <!--底部按钮-->
    <view :class="'fui-navbar ' + iphonexnavbar">
        <navigator class="nav-item btn btn-danger" url="/pages/member/address/post?type=order" hover-class="none" open-type="redirect">

            +<text>新增地址</text>
        </navigator>
    </view>

</view>
</view>
</template>

<script>
/**
 *
 * address\select.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-01-09
 *
 */
var app = getApp();
var core = app.requirejs('core');

export default {
  data() {
    return {
      loaded: false,
      list: []
    };
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    this.getList();
    var isIpx = app.getCache('isIpx');
    var $this = this;

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar',
        paddingb: 'padding-b'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: '',
        paddingb: ''
      });
    }
  },
  onLoad: function (options) {
    app.url(options);
  },
  components: {},
  props: {},
  methods: {
    getList: function () {
      var $this = this;
      core.get('member/address/get_list', {}, function (result) {
        $this.setData({
          loaded: true,
          list: result.list,
          show: true
        });
      });
    },
    select: function (event) {
      var index = core.pdata(event).index;
      app.setCache("orderAddress", this.list[index], 30);
      wx.navigateBack();
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
.fui-list-angle {
    margin-right: 0;
}
.fui-navbar{
   height: 90rpx;
}
.fui-navbar .nav-item{
    width: 100%;
    height:100%;
    padding: 0;
    margin: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}
.fui-list-inner .title{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
.fui-list-inner .text{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.realname {
    display: inline-block;
    max-width: 300rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: 35rpx;
}
</style>