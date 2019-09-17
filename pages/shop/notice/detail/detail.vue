<template>
<view>
<!--index.wxml-->

<loading v-if="!show">加载中...</loading>
<view class="fui-page page-shop-notice-detail" v-if="show">
   <view class="fui-content">
         <view class="fui-article">
             <view class="title">{{title}}</view>
             <view class="subtitle">
                 发布时间 : {{ createtime }}
             </view>
             <view class="hr"></view>
             
             <view name="detail" class="content content-block">
                    <view class="wxParse">
                    <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
                    </view> 
             </view>
         </view> 
     </view> 
</view>
</view>
</template>

<script>
//index.js
//获取应用实例
var app = getApp();
var core = app.requirejs('core');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      id: '-',
      title: '-',
      createtime: '-'
    };
  },

  onLoad: function (options) {
    var $this = this;
    $this.setData({
      id: options.id
    });
    app.url(options);
    core.get('shop/notice/detail', {
      'id': this.id
    }, function (data) {
      var notice = data.notice;
      parser.wxParse('wxParseData', 'html', notice.detail, $this, '5');
      $this.setData({
        show: true,
        title: notice.title,
        createtime: notice.createtime
      });
    });
  },
  components: {},
  props: {},
  methods: {
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
/* @import "../../../../utils/wxParse/wxParse.css"; */
.page-shop-notice-detail .fui-content .fui-article {
    padding-top: 0.5rem;
    
}

.page-shop-notice-detail .fui-content .fui-article .content {

    margin-top: 1em;
    
}

.page-shop-notice-detail .fui-content .fui-article .title {
    text-align: center
}

.page-shop-notice-detail .fui-content .fui-article .subtitle {
    text-align: center
}

.page-shop-notice-detail .fui-content .fui-article .hr {
    border: 0;
    border-top: 1px solid #e0e0e0;
    margin-top:10px;
}

</style>