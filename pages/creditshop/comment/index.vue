<template>
<view>
<!--pages/order/evaluate/index.wxml-->
<loading v-if="!show">加载中...</loading>
<view clas="page" v-if="show">
    <view class="fui-list-group"> 
        <view class="fui-list-group-title">
            <!-- <image src="/static/images/icon/shop.png"></image> -->
            <text class="icox icox-dianpu1"></text>
            <text class="shop">{{ shop.name }}</text>
        </view>
        <view class="fui-list">
            <view class="fui-list-media">
                <image :src="log.thumb"></image>
            </view>
            <view class="fui-list-inner">
                <view class="text">{{ log.title }}</view>
                <view class="subtitle" v-if="log.optionid>0">{{ log.optiontitle }}</view>
            </view>
            <!--积分兑换商品  -->
            <view class="fui-list-angle">
                <view class="text-right" style="color: #ff5555;">{{ log.credit }}积分<text v-if="log.money>0">+￥{{log.money}}</text></view>
                <view class="text-right">x{{ log.goods_num }}</view>
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
        <view class="fui-cell" v-if="log.iscomment==0">
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
      imgs: [],
      log: [],
      is_openmerch: 0,
      shop: []
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
      core.get('creditshop/comment', $this.data.options, function (list) {
        if (list.error == 0) {
          list.show = true;
          $this.setData(list);
          $this.setData({
            log: list.log,
            is_openmerch: list.is_openmerch,
            shop: list.shop
          });
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
        logid: this.log.id,
        merchid: this.log.merchid,
        comments: []
      };

      if (this.content == '' || this.key == -1) {
        core.alert('有未填写项目!');
        return false;
      }

      var g = {
        goodsid: this.log.goodsid,
        level: this.key + 1,
        content: this.content,
        images: this.images
      };
      data.comments.push(g);
      core.post('creditshop/comment/submit', data, function (list) {
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
/* pages/creditshop/comment/index.wxss */
</style>