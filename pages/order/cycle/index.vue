<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<view class="page navbar">
  <scroll-view scroll-x="true" class="cycle-periods">
    <view :class="'cycle-card ' + ( index == status ? 'active' : '')" :data-status="index" @tap="cycle" :data-id="item.id" v-for="(item, index) in list" :key="index">
      <view class="num">{{ index+1 }}</view>
      <view class="date">{{ index+1 }}/{{ list.length }}</view>
      <view class="status">
        <text v-if="item.status == 0">未开始</text>
        <text v-if="item.status == 1" style="color:#fd9727;">进行中</text>
        <text v-if="item.status == 2" style="color:#f55">已完成</text>
      </view>
    </view>
  </scroll-view>

  <!-- 每期详情  -->
  <view class="cycle-cell-group" v-for="(item, index) in list" :key="index" v-if="index == status">
    <view class="cycle-cell">
      <view class="cycle-cell-label">服务次数</view>
      <view class="cycle-cell-info">第{{ index+1 }}次/共{{ list.length }}次</view>
    </view>
    <view class="cycle-cell">
      <view class="cycle-cell-label">收货日期</view>
      <view class="cycle-cell-info">{{ item.receipttime }}/{{ item.week }}</view>
    </view>
    <view class="cycle-cell">
      <view class="cycle-cell-label">收货地址</view>
      <view class="cycle-cell-info">{{ item.addressInfo }}</view>
    </view>
    <navigator open-type="navigate" class="cycle-cell" :url="'/pages/order/express/index?cycelid=' + item.id + '&id=' + orderid">
      <view class="cycle-cell-label">物流信息</view>
      <view class="cycle-cell-info" v-if="item.expresssn">
        <text>{{ item.expresscom }}</text>
        <text>{{ item.expresssn }}</text>
      </view>
      <view class="cycle-cell-info" v-else>
        <text>暂无物流信息</text>
      </view>
      <view class="cycle-cell-remark"></view>
    </navigator>

    <view :class="'fui-footer ' + iphonexnavbar" v-if="item.status == 0 && refundstate == '0'">
      <view class="btn btn-default btn-default-o btn-sm" :data-id="item.id" data-type="0" data-isdelay="0" @tap="editdate">修改收货日期</view>
      <view class="btn btn-default btn-default-o btn-sm" :data-id="item.id" data-type="0" data-isdelay="1" @tap="editdate">顺延收货</view>
      <navigator v-if="applyforid > 0" open-type="navigate" :url="'/pages/order/cycle/address?orderid=' + orderid + '&cycelid=' + item.id + '&applyid=' + applyforid" :data-id="item.id" class="btn btn-default btn-default-o btn-sm" hover-class="none">修改地址</navigator>
       <navigator v-if="applyforid <= 0 || applyforid == undefined" open-type="navigate" :url="'/pages/order/cycle/address?orderid=' + orderid + '&cycelid=' + item.id" :data-id="item.id" class="btn btn-default btn-default-o btn-sm" hover-class="none">修改地址</navigator>
    </view>
    <view :class="'fui-footer ' + iphonexnavbar" v-else>
      <!-- <view class="btn btn-default btn-default-o btn-sm" data-id="{{item.id}}" data-type="0" data-isdelay="0" bindtap="editdate">修改收货日期</view> -->
      <view v-if="item.status == 1" class="btn btn-default btn-default-o btn-sm" :data-id="item.id" @tap="confirm_receipt">确认收货</view>
    </view>
  </view>

</view>
<!--周期购  -->
<view v-if="cycledate" class="date-model">
  <view class="inner" style="height: 764rpx;width: 690rpx;background: #fff;overflow: hidden;border-radius: 10rpx;">
    <include src="/pages/date/date.wxml"></include>
    <view class="datebtns">
      <view class="date-btn date-btn-cancel" @tap="syclecancle" style="margin-right: 0.75rem">取消</view>
      <view class="date-btn date-btn-confirm" @tap="sycleconfirm">确定</view>
    </view>
  </view>
</view>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</template>

<script>
var app = getApp(),
    core = app.requirejs('core'),
    $ = app.requirejs('jquery');
var selectdate = app.requirejs('biz/selectdate'),
    foxui = app.requirejs('foxui');

export default {
  data() {
    return {
      status: '0',
      currentDate: "",
      dayList: '',
      currentDayList: '',
      currentObj: '',
      currentDay: '',
      cycelData: {},
      nowDate: '',
      maxday: '',
      cycelbuy_periodic: '',
      period_index: 1,
      cycelid: '',
      orderid: '',
      refundstate: 0
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      });
    } else {
      this.setData({
        isIpx: false,
        iphonexnavbar: ''
      });
    }

    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    show_cycelbuydate: function () {
      var $this = this;
      /*周期购时间选择器初始化*/

      var currentObj = selectdate.getCurrentDayString(this, $this.data.nowDate);
      var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      $this.setData({
        currentObj: currentObj,
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日 ' + week[currentObj.getDay()],
        currentYear: currentObj.getFullYear(),
        currentMonth: currentObj.getMonth() + 1,
        currentDay: currentObj.getDate(),
        initDate: Date.parse(currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate()),
        checkedDate: Date.parse(currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate()),
        maxday: $this.data.maxday,
        //可选的天数
        cycelbuy_periodic: $this.data.cycelbuy_periodic,
        //周期购数据   时间间隔，单位，期数
        period_index: $this.data.period_index //当前第几期

      });
    },
    cycle: function (e) {
      var index = e.currentTarget.dataset.status;
      var period_index = index + 1;
      this.setData({
        status: e.currentTarget.dataset.status,
        cycelid: e.currentTarget.dataset.id,
        period_index: period_index
      });
    },
    // 取消时间选择时间
    syclecancle: function () {
      this.setData({
        cycledate: false
      });
    },
    //确定选择时间
    sycleconfirm: function () {
      var $this = this;
      var cycelid = $this.data.cycelid;
      var newDate = $this.data.checkedDate / 1000;
      var orderid = $this.data.orderid;
      var isall = $this.data.isdelay;
      core.get('order/do_deferred', {
        cycelid: cycelid,
        time: newDate,
        orderid: orderid,
        is_all: isall
      }, function (res) {
        if (res.error == 0) {
          foxui.toast($this, '修改成功');
        }
      });
      this.setData({
        cycledate: false
      });
    },
    // 周期购 修改送达时间
    editdate: function (e) {
      var $this = this;
      var isdelay = e.currentTarget.dataset.isdelay;
      var cycelid = e.currentTarget.dataset.id;
      core.get('order/getCycelbuyDate', {
        cycelid: cycelid
      }, function (res) {
        $this.setData({
          nowDate: res.receipttime
        });
        $this.show_cycelbuydate();
        selectdate.setSchedule($this);
      });
      this.setData({
        isdelay: isdelay
      });
      this.setData({
        cycledate: true
      });
    },
    //时间选择器 前后月份选择
    doDay: function (e) {
      selectdate.doDay(e, this);
    },
    //周期购选择时间
    selectDay: function (e) {
      selectdate.selectDay(e, this);
      selectdate.setSchedule(this);
    },
    //获取周期购数据
    get_list: function () {
      var $this = this;
      core.get('order/cycelbuy_list', $this.options, function (res) {
        if (res.error > 0) {
          if (list.error != 50000) {
            core.toast(list.message, 'loading');
          }
        }

        if (res.notStart == false) {
          $.each(res.list, function (index, data) {
            if (data.status == 1) {
              $this.setData({
                status: index
              });
            } else {
              $this.setData({
                status: res.period_index
              });
            }
          });
        }

        $this.setData({
          cycelid: res.list[0]['id'],
          orderid: res.orderid
        });
        $this.setData(res);
      });
    },
    confirm_receipt: function (e) {
      var $this = this;
      var id = e.currentTarget.dataset.id;
      var orderid = $this.data.orderid;
      core.get('order/confirm_receipt', {
        id: id,
        orderid: orderid
      }, function (res) {
        if (res.error == 0) {
          foxui.toast($this, '修改成功');
          $this.onLoad();
        }
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
@import "../../date/date.css";
page {
  background: #fff;
}

.cycle-periods {
  overflow-x: scroll;
  background: #fff;
  border-top: 1rpx solid #ebebeb;
  padding-top: 50rpx;
  padding: 50rpx 0 0 24rpx;
  height: 200rpx;
  display: flex;
  white-space: nowrap;
  padding-right: 20rpx;
}

.cycle-periods .cycle-card {
  display: inline-block;
  margin-right: 20rpx;
  width: 148rpx;
  height: 116rpx;
  border: 1rpx solid #ededed;
  position: relative;
  text-align: center;
  font-size: 30rpx;
  color: #000;
  padding-top: 44rpx;
  line-height: 1;
  box-shadow: 0 0 16rpx #e9e9e9;
  border-radius: 12rpx;
}
.cycle-periods .cycle-card:last-child{
  margin-right: 40rpx;
}
.cycle-periods .cycle-card .status {
  color: #ccc;
  font-size: 24rpx;
  margin-top: 36rpx;
}
.cycle-periods .cycle-card .status.underway{
  color: #fd9727;
}

.cycle-periods .cycle-card .num {
  position: absolute;
  top: -1rpx;
  left: -1rpx;
  display: inline-block;
  height: 30rpx;
  background: #f1f1f1;
  color: #b3b3b3;
  font-size: 24rpx;
  line-height: 30rpx;
  text-align: center;
  padding: 0 16rpx;
  border-radius: 12rpx 0 0 0;
}

.cycle-periods .cycle-card.active {
  border-color: #f55;
}
.cycle-periods .cycle-card.active .num {
  background: #f55;
  color: #fff;
}
/*每期详情*/

.cycle-cell-group {
  padding: 0 24rpx;
}

.cycle-cell-group .cycle-cell {
  padding: 50rpx 0;
  position: relative;
  display: flex;
}

.cycle-cell-group .cycle-cell:after {
  content: "";
  position: absolute;
  border-bottom: 1rpx solid #ebebeb;
  height: 1rpx;
  bottom: 0;
  left: 0;
  right: 0;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

.cycle-cell-group .cycle-cell .cycle-cell-label {
  width: 150rpx;
  font-size: 28rpx;
  color: #666;
}

.cycle-cell-group .cycle-cell .cycle-cell-info {
  font-size: 28rpx;
  color: #000;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cycle-cell-group .cycle-cell .cycle-cell-remark {
  position: relative;
  width: 60rpx;
}

.cycle-cell-group .cycle-cell .cycle-cell-remark:before {
  content: "";
  position: absolute;
  display: inline-block;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  height: 16rpx;
  width: 16rpx;
  right: 24rpx;
  top: 50%;
  margin-top: -12rpx;
  border-width: 1px 1px 0 0;
  border-color: #b2b2b2;
  border-style: solid;
}

.fui-footer {
  text-align: right;
  left: 0
}

.btn {
  height: 56rpx;
  line-height: 52rpx;
  border-radius: 40rpx;
  padding: 0 26rpx;
  margin-top: 24rpx;
  font-size: 26rpx;
}

.btn .icox {
  margin-right: 6rpx;
  vertical-align: baseline;
  font-size: 30rpx;
}

.btn.btn-sm {
  margin-top: 24rpx;
  margin-right: 24rpx;
}


/*周期购 日期 */
.date-model{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  padding: 200rpx 30rpx 0;
}
.datebtns{
  position: fixed;
  top: 852rpx;
  z-index: 1001;
  background: #fff;
  width: 631rpx;
  display: flex;
  padding: 0 30rpx 40rpx;
  border-radius:0 0 10rpx 10rpx;
}
.datebtns .date-btn{
  flex: 1;
  text-align: center;
  width: 190rpx;
  height: 72rpx;
  background: #ccc;
  color: #fff;
  line-height: 72rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
}
.datebtns .date-btn.date-btn-confirm{
  background: #ff5555;
}
</style>