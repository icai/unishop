<template>
<view>
<loading v-if="!show">加载中...</loading>
<view class="page" v-if="show">
    <view class="fui-cell-group">
        <view class="fui-cell">
            <view class="fui-cell-label">收件人</view>
            <view class="fui-cell-info">
                <input :value="detail.realname" placeholder="收件人" class="fui-input" @input="onChange" data-type="realname"></input>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">联系电话</view>
            <view class="fui-cell-info">
                <input :value="detail.mobile" placeholder="联系电话" class="fui-input" type="number" @input="onChange" data-type="mobile"></input>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">所在地区</view>
            <view class="fui-cell-info" @tap="selectArea" :data-area="detail.province + ' ' + detail.city + ' ' + detail.area">{{ !detail.province||!detail.city?"请选择所在地区":detail.province+" "+detail.city+" "+detail.area }}</view>
        </view>
        <view class="fui-cell" v-if="street.length>0">
            <view class="fui-cell-label">所在街道</view>
            <view class="fui-cell-info">
                <picker :value="streetIndex||0" :range="street" range-key="name" @change="onChange" data-type="street">
                    <view class="picker"> {{ detail.street||'请选择街道' }}</view>
                </picker>
            </view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">详细地址</view>
            <view class="fui-cell-info">
                <input :value="detail.address" placeholder="街道，楼牌号等" class="fui-input" @input="onChange" data-type="address"></input>
            </view>
        </view>
    </view>

    <include src="/pages/common/city-picker.wxml"></include>

    <view :class="'fui-mask ' + ( showPicker?'show':'' )"></view>

    <view class="btn btn-danger block mtop" @tap="submit">{{ subtext }}</view>

    <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>

</view>
</view>
</template>

<script>
/**
 *
 * address\post.js
 *
 * @create 2017-01-09
 * @author 晚秋
 *
 * @update  晚秋 2017-01-18
 *
 */
var app = getApp();
var core = app.requirejs('core');
var fui = app.requirejs('foxui');
var $ = app.requirejs('jquery');

export default {
  data() {
    return {
      id: null,
      posting: false,
      subtext: "保存地址",
      detail: {
        realname: '',
        mobile: '',
        areas: '',
        street: '',
        address: ''
      },
      showPicker: false,
      pvalOld: [0, 0, 0],
      pval: [0, 0, 0],
      areas: [],
      // 原始数据
      street: [],
      streetIndex: 0,
      noArea: false
    };
  },

  onLoad: function (options) {
    this.setData({
      id: Number(options.id)
    });
    app.url(options);
    this.getDetail();

    if (!options.id) {
      wx.setNavigationBarTitle({
        title: '添加收货地址'
      });
    } //处理一个客户切换新版地址库之后 无法清除地址库缓存的问题


    this.setData({
      areas: app.getCache("cacheset").areas,
      type: options.type
    });
  },
  components: {},
  props: {},
  methods: {
    getDetail: function () {
      var $this = this;
      var id = $this.data.id;
      core.get('member/address/get_detail', {
        id: id
      }, function (result) {
        var data = {
          openstreet: result.openstreet,
          show: true
        };

        if (!$.isEmptyObject(result.detail)) {
          wx.setNavigationBarTitle({
            title: '编辑收货地址'
          });
          var area = result.detail.province + " " + result.detail.city + " " + result.detail.area;
          var index = $this.getIndex(area, $this.data.areas);
          data.pval = index;
          data.pvalOld = index;
          data.detail = result.detail;
        }

        $this.setData(data);

        if (result.openstreet && index) {
          $this.getStreet($this.data.areas, index);
        }
      });
    },
    submit: function () {
      var $this = this;
      var detail = $this.data.detail;

      if ($this.data.posting) {
        return;
      }

      if (detail.realname == '' || !detail.realname) {
        fui.toast($this, "请填写收件人");
        return;
      }

      if (detail.mobile == '' || !detail.mobile) {
        fui.toast($this, "请填写联系电话");
        return;
      }

      if (detail.city == '' || !detail.city) {
        fui.toast($this, "请选择所在地区");
        return;
      }

      if ($this.data.street.length > 0 && (detail.street == '' || !detail.street)) {
        fui.toast($this, "请选择所在街道");
        return;
      }

      if (detail.address == '' || !detail.address) {
        fui.toast($this, "请填写详细地址");
        return;
      }

      if (!detail.datavalue) {
        fui.toast($this, "地址数据出错，请重新选择");
        return;
      } // 手机号验证更换为大陆港澳台地区都适用


      if (!/^[1][3-9]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/.test(detail.mobile)) {
        fui.toast($this, "请填写正确联系电话");
        return;
      }

      detail.id = $this.data.id;
      $this.setData({
        posting: true
      });
      core.post('member/address/submit', detail, function (result) {
        if (result.error != 0) {
          $this.setData({
            posting: false
          });
          fui.toast($this, result.message);
          return;
        }

        $this.setData({
          subtext: "保存成功"
        });
        core.toast("保存成功");
        setTimeout(function () {
          detail.id = result.addressid;

          if ($this.data.type == 'member') {
            wx.navigateBack();
          }

          if ($this.data.type == 'quickaddress') {
            app.setCache("orderAddress", detail, 30);
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '/pages/member/address/select'
            });
          }
        }, 1000);
      });
    },
    onChange: function (event) {
      var $this = this;
      var vname = $this.data.detail;
      var bindtype = event.currentTarget.dataset.type;
      var value = $.trim(event.detail.value);

      if (bindtype == 'street') {
        vname.streetdatavalue = $this.data.street[value].code;
        value = $this.data.street[value].name;
      }

      vname[bindtype] = value;
      $this.setData({
        detail: vname
      });
    },
    getStreet: function (areas, val) {
      if (!areas || !val) {
        return;
      }

      var $this = this;

      if (!$this.data.detail.province || !$this.data.detail.city || !this.openstreet) {
        return;
      }

      var city = areas[val[0]].city[val[1]].code;
      var area = areas[val[0]].city[val[1]].area[val[2]].code;
      core.get('getstreet', {
        city: city,
        area: area
      }, function (result) {
        var street = result.street;
        var data = {
          street: street
        };

        if (street && $this.data.detail.streetdatavalue) {
          for (var i in street) {
            if (street[i].code == $this.data.detail.streetdatavalue) {
              data.streetIndex = i;
              $this.setData({
                'detail.street': street[i].name
              });
              break;
            }
          }
        }

        $this.setData(data);
      });
    },
    selectArea: function (e) {
      var area = e.currentTarget.dataset.area;
      var index = this.getIndex(area, this.areas);
      this.setData({
        pval: index,
        pvalOld: index,
        showPicker: true
      });
    },
    bindChange: function (e) {
      var oldValue = this.pvalOld;
      var newValue = e.detail.value;

      if (oldValue[0] != newValue[0]) {
        newValue[1] = 0;
      }

      if (oldValue[1] != newValue[1]) {
        newValue[2] = 0;
      }

      this.setData({
        pval: newValue,
        pvalOld: newValue
      });
    },
    onCancel: function (e) {
      this.setData({
        showPicker: false
      });
    },
    onConfirm: function (e) {
      var val = this.pval;
      var areas = this.areas;
      var detail = this.detail;
      detail.province = areas[val[0]].name;
      detail.city = areas[val[0]].city[val[1]].name;
      detail.datavalue = areas[val[0]].code + " " + areas[val[0]].city[val[1]].code;

      if (areas[val[0]].city[val[1]].area && areas[val[0]].city[val[1]].area.length > 0) {
        detail.area = areas[val[0]].city[val[1]].area[val[2]].name;
        detail.datavalue += " " + areas[val[0]].city[val[1]].area[val[2]].code;
        this.getStreet(areas, val);
      } else {
        detail.area = "";
      }

      detail.street = '';
      this.setData({
        detail: detail,
        streetIndex: 0,
        showPicker: false
      });
    },
    getIndex: function (str, areas) {
      if ($.trim(str) == '' || !$.isArray(areas)) {
        return [0, 0, 0];
      }

      var arr = str.split(" ");
      var index = [0, 0, 0];

      for (var i in areas) {
        if (areas[i].name == arr[0]) {
          index[0] = Number(i);

          for (var ii in areas[i].city) {
            if (areas[i].city[ii].name == arr[1]) {
              index[1] = Number(ii);

              for (var iii in areas[i].city[ii].area) {
                if (areas[i].city[ii].area[iii].name == arr[2]) {
                  index[2] = Number(iii);
                  break;
                }
              }

              break;
            }
          }

          break;
        }
      }

      return index;
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
@import "../../common/city-picker.css";
</style>