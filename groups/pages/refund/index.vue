<template>
<!--pages/groups/refund/index.wxml-->
<view class="page navbar" :style="(isIpx?'padding-bottom:168rpx':'')">
    <view :class="'fui-cell-group ' + (code?'toggleSend-group':'')" v-if="order.refundstate>0">
        <view class="fui-cell" hover-class="none" url :data-id="code">
            <view class="fui-cell-info color" style="font-size:32rpx">
                {{ refund.refundstatus==0?'等待商家处理'+(order.status==1?'退款':'售后')+'申请':'' }}
                {{ refund.refundstatus>=3?'商家已经通过'+(order.status==1?'退款':'售后')+'申请':'' }}
            </view>
        </view>
        <view class="apply send-code" style="padding-top:0;color: #999;font-size: 26rpx;line-height: 48rpx"">
            <block v-if="refund.rtype ==0">
                <block v-if="refund.refundstatus ==0">
                    退款申请流程：
                    <view>1、发起退款申请</view>
                    <view>2、商家确认后退款到您的账户</view>
                    <view>如果商家未处理：请及时与商家联系</view>
                </block>
            </block>
            <block v-else-if="refund.rtype ==1">
                退款退货申请流程：
                <view>1、发起退款退货申请</view>
                <view>2、退货需将退货商品邮寄至商家指定地址，并在系统内输入快递单号</view>
                <view>3、商家后货后确认无误</view>
                <view>4、退款到您的账户</view>
            </block>
            <block v-else-if="refund.rtype ==2">
                换货申请流程：
                <view>1、发起换货申请，并把快递单号录入系统</view>
                <view>2、将需要换货的商品邮寄至商家指定地址，并在系统内输入快递单号</view>
                <view>3、商家确认后货后重新发出商品</view>
                <view>4、签收确认商品</view>
            </block>
        </view>
    </view>
    <block v-if="refund.refundstatus>=3">
        <navigator class="fui-list-group" style="margin-top:5px;" v-if="refund.refundaddress" url open-type="navigate">
            <view class="fui-list-group-title">退货地址</view>
            <view class="fui-list">
                <view class="fui-list-media"></view>
                <view class="fui-list-inner">
                    <view class="text">{{ refund.refundaddress.province }}{{ refund.refundaddress.city }}{{ refund.refundaddress.area }} {{ refund.refundaddress.address }}</view>
                    <view class="subtitle">{{ refund.refundaddress.name }} {{ refund.refundaddress.mobile }} {{ refund.refundaddress.tel }}</view>
                </view>
            </view>
            <block v-if="refund.message">
                <view class="fui-list-group-title"><i class="icox icox-message"></i> 卖家留言</view>
                <view class="fui-list">
                    <view class="fui-list-media"></view>
                    <view class="fui-list-inner">
                        <view class="text"><text class="text-danger">{{ refund.message }}</text></view>
                    </view>
                </view>
            </block>
        </navigator>
        <block v-if="refund.rtype==1 || refund.rtype==2">
            <view class="fui-cell-group">
                <view class="fui-cell">
                    <view class="fui-cell-label text-warning">{{ refund.rtype==1?'退货':'换货' }}状态</view>
                    <view class="fui-cell-info"></view>
                    <navigator :class="'fui-cell-remark ' + ( refund.status!=3?'noremark':'' )">
                    {{refund.statusstr }}</navigator>
                </view>
                <view class="fui-cell" v-if="refund.rexpresssn">
                    <view class="fui-cell-label">
                    {{refund.rtype==1?"退货":"换货"}}快递公司</view>
                    <view class="fui-cell-info">{{refund.rexpresscom}}</view>
                </view>
                <view class="fui-cell" v-if="refund.rexpresssn">
                    <view class="fui-cell-label">
                      {{refund.rtype==1?"退货":"换货"}}快递单号
                    </view>
                    <view class="fui-cell-info">{{refund.rexpresssn}}</view>
                </view>
            </view>
        </block>
    </block>
    <view class="fui-title" v-if="order.refundstate>0">
        协商详情
    </view>
    <view class="fui-cell-group">
        <view class="fui-cell" hover-class="none">
            <view class="fui-cell-label">
               处理方式
            </view>
            <view class="fui-cell-info">
                <picker :value="rtypeIndex" :range="rtypeArr" @change="change" data-name="rtypeIndex" :class="( order.refundstate==0?'':'hidden' )">{{rtypeArr[rtypeIndex]}}</picker>
            </view>
            <view :class="'fui-cell-remark noremark ' + ( order.refundstate>0?'':'hidden' )">{{ rtypeArr[refund.rtype] }}</view>
            <view :class="'fui-cell-remark ' + (order.refundstate==0?'':'hidden' )"></view>
        </view>
        <view class="fui-cell" hover-class="none" url>
            <view class="fui-cell-label">
                {{ rtypeArrText[rtypeIndex] }}原因
            </view>
            <view class="fui-cell-info">
                <picker :value="reasonIndex" :range="reasonArr" @change="change" data-name="reasonIndex" :class="( order.refundstate==0?'':'hidden' )">{{ reasonArr[reasonIndex]}}</picker>
            </view>
            <view :class="'fui-cell-remark noremark ' + ( order.refundstate>0?'':'hidden' )">{{refund.reason}}</view>
            <view class="fui-cell-remark" v-if="order.refundstate==0"></view>
        </view>
        <view class="fui-cell">
            <view class="fui-cell-label">{{ rtypeArrText[rtypeIndex] }}说明</view>
            <view class="fui-cell-info"><input type="text" placeholder="选填" :class="'fui-input ' + ( order.refundstate==0?'':'hidden' )" :value="refund.content" @change="change" data-name="content"></input></view>
        <view :class="'fui-cell-remark noremark ' + ( order.refundstate>0?'':'hidden' )">{{ refund.content }}</view>
        </view>
        <view class="fui-cell" v-if="rtypeIndex!=2">
            <view class="fui-cell-label">{{ rtypeArrText[rtypeIndex] }}金额</view>
            <view class="fui-cell-info" style="display: -webkit-box;  display: -webkit-flex;  display: -ms-flexbox;  display: flex;  -webkit-box-align: center;-webkit-align-items: center;  -ms-flex-align: center;  align-items: center; "> <text :class="( order.refundstate==0?'':'hidden' )">￥</text><input type="text" :class="'fui-input ' + ( order.refundstate==0?'':'hidden' )" :value="price" @change="change" data-name="price"></input></view>
         <view :class="'fui-cell-remark noremark ' + ( order.refundstate>0?'':'hidden' )">￥{{ show_price }}</view>
        </view>
        <view :class="'fui-cell ' + ( order.refundstate==0?'':'hidden' )">
            <view class="fui-cell-label">上传凭证</view>
            <view class="fui-images fui-images-sm">
                <image class="image image-sm" v-for="(item, index) in imgs" :key="index" :src="item" @click.stop="upload" data-type="image-preview" :data-index="index">
                    <text class="image-remove" @click.stop="upload" data-type="image-remove" :data-index="index"><text class="icox icox-close"></text></text>
                </image>
            </view>
            <view class="fui-uploader fui-uploader-sm" @click.stop="upload" data-type="image"></view>
            <view class="fui-cell-info"></view>
        </view>
        <view class="fui-title" style="background:#f3f3f3;margin: 0;padding: 20rpx 24rpx;" v-if="rtypeIndex!=2&&order.refundstate==0"><text class="text-danger">*提示:您可退款的最大金额为￥<text>{{ order.refundprice }}</text></text></view>

        <view class="fui-cell" v-if="order.refundstate==1">
            <view class="fui-cell-label">申请时间</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">{{refund.applytime }}</view>
        </view>
    </view>
   <view :class="'fui-footer text-right ' + iphonexnavbar">
       <block v-if="order.refundstate==0">
           <view class="btn btn-danger-o btn-sm btn-submit" @tap="submit">提交申请</view>
           <view class="btn btn-default-o btn-sm btn-default-o back" @tap="refundcancel">取消申请</view>
       </block>
       <block v-if="order.refundstate>0">
           <view v-if="refund.rtype ==2 &&refund.refundstatus==5" @tap="confirmRecive" class="btn btn-danger btn-sm">确认收到换货物品</view>
           <navigator v-if="refund.rtype==2 && refund.refundstatus==5" url><view class="btn btn-primary" open-type="navigate">查看换货物流</view></navigator>
           <navigator style="width:auto" v-if="refund.refundstatus==3||refund.refundstatus==4" class="btn btn-primary btn-sm" :url="'../express/number?orderid=' + order.id + '&refundid=' + refund.id">{{ refund.express?'修改':'填写' }}快递单号</navigator>

           <view v-if="refund.refundstatus==0" class="btn btn-danger-o btn-sm" @tap="edit">修改申请</view>

           <view v-if="refund.refundstatus!=5" class="btn btn-default-o btn-sm" @tap="refundcancel">取消申请</view>
       </block>
    </view>
     <view :class="(isIpx?'fui-iphonex-button':'')"></view>
</view>
</template>

<script>
// pages/groups/refund/index.js
var app = getApp(),
    core = app.requirejs('core'),
    order = app.requirejs('biz/order');

export default {
  data() {
    return {
      code: 1,
      tempFilePaths: '',
      delete: '',
      rtypeArr: ['退款(仅退款不退货)', '退货退款', '换货'],
      rtypeArrText: ['退款', '退款', '换货'],
      rtypeIndex: 0,
      reasonArr: ['不想要了', '卖家缺货', '拍错了/订单信息错误', '其它'],
      reasonIndex: 0,
      images: [],
      imgs: []
    };
  },

  onLoad: function (options) {
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

    this.setData({
      orderid: options.id
    });
    this.get_list();
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      core.get('groups.refund', {
        orderid: this.orderid
      }, function (list) {
        if (list.error == 0) {
          if (list.order.status < 2) {
            list.rtypeArr = ['退款(仅退款不退货)'];
          }

          list.show = true;
          $this.setData(list);
        } else {
          core.toast(list.message, 'loading');
        }
      });
    },
    submit: function () {
      var data = {
        orderid: this.orderid,
        rtype: this.rtypeIndex,
        reason: this.reasonArr[this.reasonIndex],
        content: this.content,
        price: this.price,
        images: this.images
      };
      core.post('groups.refund.submit', data, function (list) {
        if (list.error == 0) {
          wx.navigateBack();
        } else {
          wx.showToast({
            title: list.error,
            icon: 'none',
            duration: 2000
          });
        }
      }, true);
    },
    change: function (e) {
      var $this = this,
          name = core.data(e).name,
          data = {};
      data[name] = e.detail.value;
      this.setData(data);
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
    toggle: function (e) {
      var data = core.pdata(e),
          id = data.id;
      id == 0 || typeof id == 'undefined' ? id = 1 : id = 0;
      this.setData({
        code: id
      });
    },
    edit: function (e) {
      this.setData({
        'order.refundstate': 0
      });
    },
    refundcancel: function (e) {
      core.post('groups.refund.cancel', {
        orderid: this.orderid
      }, function (res) {
        if (res.error == 0) {
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    confirmRecive: function () {
      var data = {
        orderid: this.orderid,
        refundid: this.refund.id
      };
      core.post('groups.refund.receive', data, function (res) {
        if (res.error == 0) {
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 2000
          });
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
/* pages/groups/refund/index.wxss */
.btn {
    margin:10rpx
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
    top: 10rpx
}
.apply{
    padding: 20rpx;
    font-size: 30rpx;
    color: #666
}
.fui-cell-group .fui-cell .fui-cell-info.color{
    color:#333
}
/*展开*/
.send-code{display: none;}
.fui-cell-group.toggleSend-group .send-code{display: block;font-size: 26rpx}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.fui-footer .btn{
    border-radius:40rpx;
    margin-top: 24rpx;
    min-width: 164rpx;
    margin-right: 24rpx
}
</style>