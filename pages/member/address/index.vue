<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<loading v-if="!show">加载中...</loading>
<view :class="'page footer ' + paddingb" v-if="show">

    <block v-if="list.length>0">
        <view class="fui-list-group" v-for="(item, index) in list" :key="index">
            <view class="fui-list address-item noclick">
                <view class="fui-list-inner">
                    <view class="title"><view class="realname">{{ item.realname }}</view><view class="mobile">{{ item.mobile }}</view></view>
                    <view class="text">{{ item.province }} {{ item.city }} {{ item.area}} {{ item.address }}</view>
                    <view class="bar">
                        <view class="pull-right btn-del" @tap="deleteItem" :data-id="item.id">

                            <text class="icox icox-delete"></text>
                            <text>删除</text>
                        </view>
                        <navigator class="pull-right btn-edit" :url="'/pages/member/address/post?id=' + item.id + '&type=member'" hover-class="none" open-type="navigate">

                            <text class="icox icox-edit"></text>
                            <text>编辑</text>
                        </navigator>
                        <label @tap="setDefault" :data-id="item.id"><radio color="#fd5454" class="zoom-70" name="default" :checked="( item.isdefault>0 ? true : false )"></radio>设为默认地址</label>
                    </view>
                </view>
            </view>
        </view>
    </block>

    <view class="fui-loading empty" v-if="list.length<1 && loaded">
        <view class="text">没有数据</view>
    </view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>

    <!--底部按钮-->
    <view :class="'fui-navbar ' + iphonexnavbar">
        <navigator class="nav-item btn btn-danger" url="/pages/member/address/post?type=member" hover-class="none" open-type="navigate">

            +
            <text>添加收货地址</text>
        </navigator>
    </view>

</view>
</view>
</template>

<script>
/**
 *
 * address\index.js
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
    var $this = this;
    var isIpx = app.getCache('isIpx');
    console.error(isIpx);

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
    setDefault: function (event) {
      var $this = this;
      var id = core.pdata(event).id;
      $this.setData({
        loaded: false
      });
      core.get('member/address/set_default', {
        id: id
      }, function (result) {
        core.toast("设置成功");
        $this.getList();
      });
    },
    deleteItem: function (event) {
      var $this = this;
      var id = core.pdata(event).id;
      core.confirm("删除后无法恢复, 确认要删除吗 ?", function () {
        $this.setData({
          loaded: false
        });
        core.get('member/address/delete', {
          id: id
        }, function (result) {
          core.toast("删除成功");
          $this.getList();
        });
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
.address-item {
    padding-bottom: 20rpx;
}
.address-item radio {
    vertical-align: top;
    margin-top: -2rpx;
}
.address-item image {
    margin-right: 5rpx;
    margin-top: -8rpx
}
.fui-list-inner .bar {
    font-size: 28rpx;
}
.btn-del {
    margin-left: 10rpx;
}
.btn-del text,.btn-edit text{
    display: inline-block;
    font-size: 26rpx;
    line-height: 26rpx;
}
.fui-list-inner .title {
  display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
}
.fui-list-inner .title .realname{
    display: inline-block;
    max-width: 450rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: 48rpx;
}
.fui-navbar, .fui-footer {
  height: 90rpx
}
.fui-navbar .nav-item.btn {
color:#fff;
border-radius:0;
height: 90rpx;
line-height: 90rpx;
margin: 0;
padding: 0;
border: 0
}
.icon{
  padding: 0 10rpx
}
</style>