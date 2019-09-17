<template>
<web-view :src="url"></web-view>
</template>

<script>

export default {
  data() {
    return {
      url: ''
    };
  },

  onLoad: function (options) {
    if (options.module == 'sign') {
      var url = options.domain + '?' + decodeURIComponent(options.params) + '&uid=' + options.mid;
    } else {
      var url = decodeURIComponent(options.url);
    }

    var $this = this;
    $this.setData({
      url: url
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
