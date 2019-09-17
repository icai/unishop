<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page footer" v-if="show">
    
    <block v-if="total>0">
        <view class="fui-list-group">
            <block v-for="(item, index) in list" :key="index">
                <!-- <navigator class="fui-list-group-title noclick" url="/pages/index/index?merchid={{item.merchid}}" hover-class="none" open-type="switchTab">
                    <view class="fui-list-media">
                      <text class="icox icox-dianpu1"></text>
                    </view>
                    <view class="text">{{item.merchname}}</view>
                    <view class="fui-list-angle">
                        <view class="angle"></view>
                    </view>
                </navigator> -->
                <label class="fui-list" :data-goodsid="item.goodsid" :data-id="item.id" @tap="itemClick">
                    <view class="fui-list-media" v-if="isedit">
                        <radio class="zoom-80" color="#ef4f4f" :checked="( checkObj[item.id]?true:'' )"></radio>
                    </view>
                    <view class="fui-list-media">
                        <image :src="item.thumb"></image>
                    </view>
                    <view class="fui-list-inner">
                            <view class="subtitle">{{item.title}}</view>
                        <view class="title" style="    font-size: 30rpx">
                            <text class="text-danger">¥{{item.marketprice}}</text>
                            <!-- <text class="text-delete" style="padding-left: 10rpx;">¥{{item.productprice}}</text> -->
                        </view>
                    </view>
                </label>
            </block>
        </view>
    </block>

    <!--数据显示-->
    <view class="fui-loading" v-if="loading">
        <view class="icon"></view>
        <view class="text">正在加载</view>
    </view>
    <view class="fui-loading empty" v-if="loaded && list.length>0">
        <view class="text">没有更多了</view>
    </view>
    <view class="fui-loading empty" v-if="total<=0 && !loading">
        <view class="text">没有数据</view>
    </view>

    <view class="fui-footer" v-if="list.length>0">
        <view class="tool">
            <view class="check" v-if="isedit">
                <label @tap="checkAllClick">
                    <radio class="zoom-80" color="#ef4f4f" :checked="( isCheckAll?true:'' )"></radio>
                    <text>全选</text>
                </label>
            </view>
            <view class="text"></view>
            <view class="btns">
                <view class="btn btn-danger" v-if="!isedit" @tap="btnClick" data-action="edit">编辑</view>
                <view :class="'btn btn-warning ' + ( checkNum>0?'':'disabled' )" v-if="isedit" @tap="btnClick" data-action="delete">删除</view>
                <view class="btn btn-danger" v-if="isedit" @tap="btnClick" data-action="finish">完成</view>
            </view>
        </view>
    </view>

    <!--公用底部菜单-->
    <include src="/pages/common/menu.wxml"></include>

</view>
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
 * @update  晚秋 2017-01-09
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      icons: app.requirejs('icons'),
      page: 1,
      loading: false,
      loaded: false,
      isedit: false,
      isCheckAll: false,
      checkObj: {},
      checkNum: 0,
      list: []
    };
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if (this.loaded || this.list.length == this.total) {
      return;
    }

    this.getList();
  },
  onLoad: function (options) {
    app.url(options);
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
      core.get('member/favorite/get_list', {
        page: $this.data.page
      }, function (result) {
        var data = {
          loading: false,
          loaded: true,
          total: result.total,
          pagesize: result.pagesize,
          show: true
        };

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
    itemClick: function (event) {
      var $this = this;
      var id = core.pdata(event).id;
      var goodsid = core.pdata(event).goodsid;

      if (!$this.data.isedit) {
        wx.navigateTo({
          url: '/pages/goods/detail/index?id=' + goodsid
        });
      } else {
        var checkObj = $this.data.checkObj;
        var checkNum = $this.data.checkNum;

        if (checkObj[id]) {
          checkObj[id] = false;
          checkNum--;
        } else {
          checkObj[id] = true;
          checkNum++;
        }

        var isCheckAll = true;

        for (var i in checkObj) {
          if (!checkObj[i]) {
            isCheckAll = false;
            break;
          }
        }

        $this.setData({
          checkObj: checkObj,
          isCheckAll: isCheckAll,
          checkNum: checkNum
        });
      }
    },
    btnClick: function (event) {
      var $this = this;
      var action = event.currentTarget.dataset.action;

      if (action == 'edit') {
        var checkObj = {};

        for (var i in this.list) {
          var id = this.list[i].id;
          checkObj[id] = false;
        }

        $this.setData({
          isedit: true,
          checkObj: checkObj,
          isCheckAll: false
        });
      } else if (action == 'delete') {
        var checkObj = $this.data.checkObj;
        var ids = [];

        for (var i in checkObj) {
          if (checkObj[i]) {
            ids.push(i);
          }
        }

        if (ids.length < 1) {
          return;
        }

        core.confirm("删除后不可恢复，确定要删除吗？", function () {
          core.post('member/favorite/remove', {
            ids: ids
          }, function (result) {
            $this.setData({
              isedit: false,
              checkNum: 0,
              page: 0,
              list: []
            });
            $this.getList();
          });
        });
      } else if (action == 'finish') {
        $this.setData({
          isedit: false,
          checkNum: 0
        });
      }
    },
    checkAllClick: function () {
      var isCheckAll = this.isCheckAll ? false : true;
      var checkObj = this.checkObj;
      var data = {
        isCheckAll: isCheckAll,
        checkObj: checkObj
      };

      for (var i in checkObj) {
        data.checkObj[i] = isCheckAll ? true : false;
      }

      data.checkNum = isCheckAll ? this.list.length : 0;
      this.setData(data);
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
.fui-list-inner .subtitle {
    font-size:28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    color: #000
}
.fui-list-angle {
  font-size: 26rpx;
  color: #666
}
.fui-list-media wx-image {
  width: 160rpx;
  height: 160rpx;
}
.fui-list-inner {
  height: 160rpx;
  display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;
    -webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;flex-direction: column;
}
.fui-list-group-title::after {
  content:" ";
  position:absolute;
  top:0;
  right:20rpx;
  height:0;
  border-top:2rpx solid #ebebeb;
  transform-origin:0 0;
  transform:scaleY(0.5);
  left:20rpx;

}
.btns{
  height: 100%
}
.btn {
    border-radius: 0;
    height: 100%;
    line-height: 90rpx;
    font-size: 28rpx;
    color: #fff;
    margin: 0;
    margin-left: 2rpx;
    width: 160rpx;
    border: 0;
}
.fui-footer .tool {
    padding-right:0; 
}
</style>