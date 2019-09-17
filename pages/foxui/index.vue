<template>
<!--pages/foxui/index.wxml-->
<text>pages/foxui/index.wxml</text>
</template>

<script>

export default {
  data() {
    return {};
  },

  onUnload: function () {// 页面关闭
  },
  onHide: function () {// 页面隐藏
  },
  onShow: function () {// 页面显示
  },
  onReady: function () {// 页面渲染完成
  },
  onLoad: function (options) {// 页面初始化 options为页面跳转所带来的参数
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
/* pages/foxui/index.wxss */
</style>