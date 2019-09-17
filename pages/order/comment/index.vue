<template>
<view>
<!--pages/order/evaluate/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view clas="page" v-if="show">
    <view class="fui-list-group"> 
        <view class="fui-list-group-title">
            <!-- <image src="/static/images/icon/shop.png"></image> -->
            <text class="icox icox-dianpu1"></text>
            <text class="shop">{{ shopname }}</text>
        </view>
        <view class="fui-list" v-for="(item, index) in goods" :key="index">
            <view class="fui-list-media">
                <image :src="item.thumb"></image>
            </view>
            <view class="fui-list-inner">
                <view class="text">{{ item.title }}</view>
                <view class="subtitle" v-if="item.optiontitle">{{ item.optiontitle }}</view>
            </view>
            <!-- 普通商品  -->
            <view class="fui-list-angle">
                <view class="text-right">{{ item.price }}</view>
                <view class="text-right">x{{ item.total }}</view>
            </view>
        </view>
    </view>
     

    <view class="fui-title">
        整单评价
    </view>
    <view class="fui-cell-group evaluate">
        <view class="fui-cell must">
            <view class="fui-cell-label">评分</view>
            <block v-for="(item, index) in stars_class" :key="index">
                <text :class="(key>=index ?selectedSrc : normalSrc)" :data-key="index" @tap="select">
                </text>
            </block>
            <text style="font-size: 28rpx;" :class="stars_class[key]">{{key!=-1 ? stars_text[key]:'未评价'}}</text>
        </view>
        <view class="fui-cell" v-if="order.iscomment==0">
            <view class="fui-cell-label">晒图</view>
            <view class="fui-images fui-images-sm">
                <image class="image image-sm" v-for="(item, index) in imgs" :key="index" :src="item" @click.stop="upload" data-type="image-preview" :data-index="index">
                    <text class="image-remove" @click.stop="upload" data-type="image-remove" :data-index="index"><text class="icox icox-close"></text></text>
                </image>
            </view>
            <view class="fui-uploader fui-uploader-sm" @click.stop="upload" data-type="image"></view>
        </view>
        <view class="fui-cell must">
           <view class="fui-cell-label">评论</view>
            <textarea placeholder="商品满意吗？来分享你的感受吧" @input="change" data-name="content"></textarea>
           <view class="fui-cell-info"></view>
        </view>
        <!-- <view class='textarea'>
            <textarea placeholder="商品满意吗？来分享你的感受吧" bindinput="change" data-name="content"/>
        </view> -->
    </view>

    <view class="fui-footer">
        <view class="nav-item btn btn-danger block" @tap="submit">提交评价</view>
    </view>
</view>
</view>
</template>

<script>
/**
 *
 * order/common/index.js
 *
 * @create 2017-1-16
 * @author Young
 *
 * @update  Young 2017-01-16
 *
 */
var app = getApp(),
    core = app.requirejs('core');

export default {
  data() {
    return {
      stars_class: ['text-default', 'text-primary', 'text-success', 'text-warning', 'text-danger'],
      stars_text: ['差评', '一般', '挺好', '满意', '非常满意'],
      normalSrc: 'icox icox-star',
      selectedSrc: 'icox icox-xing selected',
      key: -1,
      content: '',
      images: [],
      imgs: []
    };
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
      core.get('order/comment', $this.data.options, function (list) {
        if (list.error == 0) {
          list.show = true;
          $this.setData(list);
        } else {
          core.toast(list.message, 'loading');
          wx.navigateBack();
        }
      }, true);
    },
    select: function (e) {
      var key = e.currentTarget.dataset.key;
      this.setData({
        key: key
      });
    },
    change: function (e) {
      var name = core.data(e).name,
          data = {};
      data[name] = e.detail.value;
      this.setData(data);
    },
    submit: function () {
      var $this = this,
          data = {
        orderid: this.options.id,
        comments: []
      };

      if (this.content == '' || this.key == -1) {
        core.alert('有未填写项目!');
        return false;
      }

      for (var i = 0, len = this.goods.length; i < len; i++) {
        var g = {
          goodsid: this.goods[i].goodsid,
          level: this.key + 1,
          content: this.content,
          images: this.images
        };
        data.comments.push(g);
      }

      core.post('order/comment/submit', data, function (list) {
        if (list.error != 0) {
          core.toast(list.message, 'loading');
        }

        wx.navigateBack();
      }, true);
    },
    upload: function (e) {
      var $this = this,
          dataset = core.data(e),
          type = dataset.type,
          images = $this.data.images,
          imgs = $this.data.imgs,
          index = dataset.index;

      if (type == 'image') {
        core.upload(function (file) {
          images.push(file.filename);
          imgs.push(file.url);
          $this.setData({
            images: images,
            imgs: imgs
          });
        });
      } else if (type == 'image-remove') {
        images.splice(index, 1);
        imgs.splice(index, 1);
        $this.setData({
          images: images,
          imgs: imgs
        });
      } else if (type == 'image-preview') {
        wx.previewImage({
          current: imgs[index],
          urls: imgs
        });
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
/* pages/order/evaluate/index.wxss */
@import "../../../static/css/order.css";
.fui-list-angle{
    color: #000;
    font-size: 28rpx;
    height: 160rpx;
    margin-right:0;
}
.textarea{
    padding: 0 30rpx;
    color: #999;
	font-size: 30rpx;
}
.image-32{
    margin-right: 10rpx;
}
.image-40{
    height: 40rpx;
    width: 40rpx;
    margin-right: 10rpx;
}
.fui-list-inner .text.grade{
     font-size: 30rpx;
    margin-top: 10rpx;
}
.grade{
    font-size: 28rpx;
    margin-top: 10rpx;
}
.default{
    color: #999; 
}
.fui-cell-group .fui-cell .fui-cell-label{
    width: 100rpx;
}
.btn{
    margin-top: 10rpx;
}
.upload,.chose-img{
    width: 50rpx;
    height: 50rpx;
    margin: 0 5rpx;
}
.delete{
    height: 30rpx;
    width: 30rpx;
    position: absolute;
    top: 10rpx;
}
.fui-label {
	display: inline-block;
	padding: 0 8rpx;
	background: #d9d9d9;
	color: #333;
	margin: 0 4rpx;
	font-size: 24rpx;
    line-height: 40rpx;
}
.fui-list-inner{
  height: 160rpx;
  display: -webkit-box;  display: -webkit-flex;  display: -ms-flexbox;  display: flex;
  -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  -webkit-box-pack: justify; -ms-flex-pack: justify; -webkit-justify-content: space-between; justify-content: space-between;
}
.fui-footer{
  height: 90rpx;
}
.fui-footer .nav-item.btn {
    color: #fff;
    border-radius: 0;
    margin: 0;
    line-height: 90rpx;
    height: 90rpx
}
.fui-cell-group .fui-cell .fui-cell-label {
    align-self: flex-start;
    width: 140rpx;
}
.fui-cell.must .icox{
    color: #999;
    margin-right: 4rpx;
    -moz-transition-duration: 300ms;
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
    -webkit-transition-property: color;
    transition-property: color;
    font-size: 40rpx;
}
.fui-cell.must .icox.selected{
  color: #ff8000
}
</style>