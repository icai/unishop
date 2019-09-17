<template>
<view>
<view class="page" style="background:#fff;padding:0 24rpx">
  <view class="fui-content">
    <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
  </view>
</view>
</view>
</template>

<script>
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');

export default {
  data() {
    return {
      list: {}
    };
  },

  onLoad: function (options) {
    var $this = this;
    core.get('bargain/rule', options, function (res) {
      parser.wxParse('wxParseData', 'html', res.rule.rule, $this, '0');
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
