<template>
<view class="fui-cell-group fui-sale-group" style="margin-top:0;min-height:100%;">
    <view class="fui-cell">
        <view class="fui-cell-text dispatching" style="width:100%;">
            {{ onlysent == 0?'不' :'只'  }}配送区域:
            <view class="dispatching-info">
                <block v-for="(reg, index) in region" :key="index">
                    <text>{{reg}}</text>
                </block>
            </view>
        </view>
    </view>
</view>
</template>

<script>
/**
 *
 * favorite\index.js
 *
 * @create 2017-02-10
 * @author 咖啡
 *
 * 
 *
 */
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      region: []
    };
  },

  onLoad: function (options) {
    var $this = this;
    var region = options.region;
    var onlysent = options.onlysent;
    $this.setData({
      region: region,
      onlysent: onlysent
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
page{min-height:100%;display:block;}
</style>