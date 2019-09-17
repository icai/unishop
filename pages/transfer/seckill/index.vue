<script>
// pages/groups/imdex/index.js
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      show: false
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onReachBottom: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.showTabBar({});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.showTabBar({});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  onLoad: function () {
    var $this = this;
    setTimeout(function () {
      $this.onPullDownRefresh();
    }, 300);
    wx.reLaunch({
      url: '/seckill/pages/index/index'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onPullDownRefresh: function () {
    wx.startPullDownRefresh();
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
/* pages/transfer/seckill/index.wxss */
</style>