<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<loading v-if="!show">加载中...</loading>
<view :class="'page footer ' + paddingb" v-if="show">
  <view class="nav" v-if="list.showTab && !list.isonlyverifygoods">
    <view :class="( data.dispatchtype==0?'red':'default' )" @tap="dispatchtype" data-type="0">快递配送</view>
    <view :class="( data.dispatchtype==1?'red':'default' )" v-if="list.iscycelbuy != 1" @tap="dispatchtype" data-type="1">{{ list.pickuptext || "上门自提" }}</view>
  </view>

  <!--快递配送-->
  <view>
    <block v-if="list.showAddress && !list.isonlyverifygoods">
      <!--地址信息-->
      <view class="fui-cell-group" id="addressInfo" v-if="data.dispatchtype==0">
        <navigator class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" v-if="list.address" hover-class="none" url="/pages/member/address/select" open-type="navigate">

          <view class="fui-cell-icon" style="margin-right:24rpx" v-if="list.address">
            <text class="icox icox-dingwei1"></text> </view>
          <view class="fui-cell-text textl info" :style="(list.address?'':'display:flex;justify-content: center;' )">

            <view class="fui-cell-icon" v-if="!list.address">
              <text class="icox icox-icon02" style="color:#ff5555"></text> </view>
            <view v-if="list.address" class="has-address ">
              <view>收货人：</view>
              <text class="name">{{ list.address.realname }} </text>
              <text class="mobile">{{ list.address.mobile }}</text>
            </view>
            <view class="adress" v-if="list.address">{{ list.address.province+list.address.city+list.address.area+' '+list.address.address }}</view>
            <view class="text no-address" @tap="address" data-type="open" v-if="!list.address">添加收货地址</view>
          </view>
          <view class="fui-cell-remark"></view>
        </navigator>

        <navigator class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" hover-class="none" v-if="!list.address && !list.isonlyverifygoods" url="/pages/member/address/post?type=quickaddress" open-type="navigate">
          <view class="fui-cell-text textl info" style="display:flex;justify-content: center;">
            <view class="fui-cell-icon">
              <text class="icox icox-icon02" style="color:#ff5555"></text> </view>
            <view class="text no-address" data-type="open">添加收货地址</view>
          </view>
          <view class="fui-cell-remark"></view>
        </navigator>

        <!-- <view class="fui-cell" style="padding-top:32rpx;padding-bottom:32rpx" hover-class="none" wx:if="{{false }}">                    
                    <view class="fui-cell-text textl info" style="display:flex;justify-content: center;">
                        <view class="fui-cell-icon"  ><text class="icox icox-icon02" style='color:#ff5555'></text> </view>
                        <view class="text no-address"  bindtap='showaddressview' data-type='open'>添加收货地址</view>
                    </view>
                    <view class="fui-cell-remark"></view>
                </view> -->

      </view>

      <!--周期购  -->
      <view class="fui-cell-group" v-if="list.iscycelbuy">
        <view class="fui-cell">
          <view class="fui-cell-icon">
            <i class="icox icox-xiangmuzhouqi" style="color: #ff6a54;"></i>
          </view>
          <view class="fui-cell-info" style="color: #333;">周期购</view>
        </view>
        <view class="fui-cycle">
          <view class="fui-cycle-left" style="background-color: #ffe8df;" @tap="editdate">
            <view class="text">预计送达时间</view>
            <view class="date">
              <span class="predicttime" data-date>{{currentDate}}</span>
              <i class="icox icox-xiugai select-showtime" style="font-size: 24rpx; margin-left:4rpx"></i>
            </view>
          </view>
          <view class="fui-cycle-right">
            <view class="text">套餐内容</view>
            <view class="date">
              <span class="cycel_day">{{ list.cycelComboDay }}</span>
              <span v-if="list.cycelComboUnit == '0'">天</span>
              <span v-if="list.cycelComboUnit == '1'">周</span>
              <span v-if="list.cycelComboUnit == '2'">月</span>1期，共
              <span class="cycel_num">{{ list.cycelComboPeriods }}</span>期</view>
          </view>
        </view>
      </view>

      <!--自提点选择-->
      <view class="fui-cell-group" v-if="data.dispatchtype==1">
        <navigator class="fui-cell" hover-class="none" style="padding-top:16px;padding-bottom:16px" :url="'/pages/order/store/index?merchid=' + merchid" open-type="navigate">

          <view class="fui-cell-icon" style="margin-right:24rpx">
            <text class="icox icox-dianpu1"></text> </view>
          <view class="fui-cell-text textl info">
            <view class="shop_name">{{ list.carrierInfo.storename }}</view>
            <view class="adress">{{ list.carrierInfo.address }}</view>
          </view>
          <view class="fui-cell-remark"></view>
        </navigator>
      </view>
    </block>


  <!--填写联系人信息-->
    <view class="fui-cell-group" v-if="(list.set_mobile == 0||list.set_realname==0) && (!list.showAddress||data.dispatchtype==1)">
      <view class="fui-cell" v-if="list.set_realname==0">
        <view class="fui-cell-label">联系人</view>
        <view class="fui-cell-info">
          <input type="text" placeholder="请输入联系人" class="fui-input textl" :value="list.member.realname" @input="listChange" id="realname"></input>
        </view>
      </view>
      <view class="fui-cell" v-if="list.set_mobile==0">
        <view class="fui-cell-label">联系方式</view>
        <view class="fui-cell-info">
          <input type="text" placeholder="请输入联系方式" class="fui-input textl" :value="list.member.mobile" @input="listChange" id="mobile"></input>
        </view>
      </view>
    </view>


    <!--核销门店选择-->
      <view class="fui-cell-group" v-if="list.isforceverifystore==1 && list.isverify==1">
        <navigator class="fui-cell" hover-class="none" style="padding-top:16px;padding-bottom:16px" :url="'/pages/order/store/index?merchid=' + merchid + '&ids=' + list.storeids + '&type=2'" open-type="navigate">
          
          <view class="fui-cell-icon" style="margin-right:24rpx">
            <text class="icox icox-dianpu1"></text> </view><text v-if="!list.storeInfo">请选择门店</text>  
          <view class="fui-cell-text textl info">
             <view class="shop_name">{{ list.storeInfo.storename }}</view>
             <view class="adress">{{ list.storeInfo.address }}</view> 
          </view>
          <view class="fui-cell-remark"></view>
        </navigator>
      </view>


    <!--同城配送-->
    <block v-if="city_express_state">
      <view class="fui-cell-group" @tap="sendclick">
        <view class="fui-cell">
          <view class="fui-cell-label" style="width: 50rpx;">
            <i class="icox icox-huoche" style="color: #21ca4d;"></i>
          </view>
          <view class="fui-cell-info">本单支持同城配送</view>
          <view class="fui-cell-remark"></view>
        </view>
      </view>
    </block>


    <!--商品信息-->
    <view class="fui-list-group" v-for="(item, index) in list.goods" :key="index">
      <navigator url="/pages/index/index" class="fui-list-group-title" open-type="switchTab" hover-class="none">

        <view class="fui-cell-icon" style="margin-right:12px">
          <text class="icox icox-dianpu1"></text> </view>
        <text class="shop">{{ item.shopname }}</text>
      </navigator>
      <view class="fui-list goods-item noclick" v-for="(val, index2) in item.goods" :key="index2">
        <view class="fui-list-media" :data-url="'/pages/goods/detail/index?id=' + val.goodsid" @tap="url">
          <image class=" goods_img" :src="val.thumb"></image>
        </view>
        <view class="fui-list-inner" :data-url="'/pages/goods/detail/index?id=' + val.goodsid" @tap="url">
          <view class="text">
            <block v-if="val.hasdiscount">
              <text class="fui-label fui-label-danger">折扣</text>
            </block>{{ val.title }}</view>
          <view class="subtitle cart-option" v-if="val.optionid!=0">
            {{ val.optiontitle }}
          </view>
        </view>
        <view class="fui-list-angle">
          <view class="fui-cell text-danger" v-if="list.isdiscountprice>0">￥{{ val.promotionprice }}</view>
          <text class="price" :style="'text-decoration:' + ( list.isdiscountprice > 0 ? 'line-through': '' )">¥{{ val.price }}</text>
          <view v-if="list.changenum && list.iscycelbuy == true && bargainid <= 0" class="fui-number small" @tap="number" :data-min="val.minbuy" :data-value="val.total" :data-max="val.totalmaxbuy" :data-id="val.id" :data-index="index" :data-key="key">
            <view :class="'minus ' + ( val.total<=1?'disabled':'' )" data-action="minus">-</view>
            <input class="num shownum" type="tel" name :value="val.total" @blur="inputNumber"></input>
            <view :class="'plus ' + ( val.total>=val.totalmaxbuy?'disabled':'' )" data-action="plus">+</view>
          </view>
          <view class="text-right">
            x{{ val.total }}
          </view>
        </view>
      </view>

      <!--赠品-->
      <block v-if="list.giftid>0">
        <view class="fui-list no-border" style="background: #f9f9f9;margin-top: 4rpx">
          <block v-for="(val, index2) in list.gift" :key="index2">
            <view class="fui-list-media" v-if="index<5">
              <image :src="val.thumb" style="width:100rpx;height:100rpx;"></image>
              <text style="font-size:28rpx;margin-left:20rpx;max-width:480rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{val.title}}</text>
            </view>
          </block>
          <view class="fui-list-inner"></view>
          <view class="row-remark">
            <view>
              <text>共{{list.gift.length}}件</text>
            </view>
          </view>
        </view>
      </block>
    </view>

    <block v-if="list.giftid==0 && list.gifts.length>0">
      <view class="fui-cell-group fui-sale-group" @tap="giftPicker">
        <view class="fui-cell">
          <view class="fui-cell-label">赠品</view>
          <!-- <view class="fui-cell-info">{{list.gifts.length==1?'满'+list.gifts[0].orderprice+'送 '+list.gifts[0].title:''}}</view>  -->
          <view class="fui-cell-info" v-if="list.gifts.length==1">{{list.gifts[0].title}}</view>
          <view class="fui-cell-info" v-else :style="(gift_title?'':'color:#666;')">{{gift_title?gift_title:'请选择赠品'}}</view>
          <view class="fui-cell-remark"></view>
        </view>
      </view>
    </block>
    <!--全返-->
    <view class="fui-cell-group bordertop" style="margin-top: 0;">
      <view class="fui-cell" v-if="list.fullbackgoods != '' && list.fullbackgoods != undefined">
        <view class="fui-cell-label">{{ list.fullbacktext }}详情</view>
        <view class="fui-cell-info">
          <i style="color: #ff5555;position: relative;top: 4rpx;margin-right: 5rpx;" class="icox icox-xiaofei1"></i> 总金额
          <i style="color: #ff5555;">
            <block v-if="list.fullbackgoods.type == 0">￥{{list.fullbackgoods.minallfullbackallprice}}</block>
            <block v-if="list.fullbackgoods.type == 1">{{list.fullbackgoods.minallfullbackallratio}}%</block>
          </i> ,每天返
          <i style="color: #ff5555;">
            <block v-if="list.fullbackgoods.type == 0">￥{{list.fullbackgoods.fullbackprice}}</block>
            <block v-if="list.fullbackgoods.type == 1">{{list.fullbackgoods.fullbackratio}}%</block>
          </i> ，时间：
          <i style="color: #ff5555;">{{list.fullbackgoods.day}}天</i>
        </view>
      </view>
    </view>

    <!-- 发票信息 -->
    <view class="fui-list-group" v-if="hasinvoice">
      <view class="fui-cell-group">
        <view class="fui-cell">
          <view class="fui-cell-label">发票抬头</view>
          <view class="fui-cell-info">
            <input type="text" name class="fui-input" :value="list.invoicename" disabled="true" @tap="showinvoicepicker" @input="listChange" id="invoicename"></input>
          </view>
        </view>
        <view class="fui-cell">
          <view class="fui-cell-info" style="text-align: right;">共
            <text class="text-danger">{{ list.total }}</text> 件商品 合计：
            <text class="text-danger">¥ {{ list.goodsprice }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 发票picker -->
    <view class="fui-mask" style="display:block" v-if="invoicepicker"></view>
    <view :class="( invoicepicker?'invoice-picker':'invoice-picker invoice-pickernone' )">
      <view style="flex: 1;" @tap="noinvoicepicker"></view>
      <view class="whiteinvoice">
        <!-- <view class='invoicetit' style='text-align: right'></view> -->
        <view class="invoicetit">发票材质 <text style="float: right;text-align: right;padding-left:50rpx;" @tap="clearinvoice">清空</text></view>
        <view class="flex invoice-title">
          <view v-if="list.invoice_type!=0" :class="( list.invoice_info.entity?'':'active' )" @tap="chaninvoice" data-type="0">电子普通发票</view>
          <view v-if="list.invoice_type!=1" :class="( list.invoice_info.entity?'active':'' )" @tap="chaninvoice" data-type="1">纸质普通发票</view>
        </view>
        <view class="invoicetit">发票类型</view>
        <view class="flex invoice-title">
          <view :class="( list.invoice_info.company?'':'active')" @tap="changeType" data-type="0">个人</view>
          <view :class="( list.invoice_info.company?'active':'')" @tap="changeType" data-type="1">单位</view>
        </view>

        <view class="flex">
          <text class="invoicesubtit">发票抬头：</text>
          <input type="text" :value="( list.invoice_info.title?list.invoice_info.title:'' )" @blur="invoicetitle"></input>
        </view>
        <view class="flex" v-if="list.invoice_info.company">
          <text class="invoicesubtit">纳税人识别号：</text>
          <input type="text" :value="( list.invoice_info.number?list.invoice_info.number:'' )" @blur="invoicenumber"></input>
        </view>
        <!-- <view class='flex'>
          <text class='invoicesubtit'>发票金额：</text>
          <input type='text' value=''></input>
        </view>
        <view class='flex'>
          <text class='invoicesubtit'>发票内容：</text>
          <input type='text' value=''></input>
        </view> -->
        <view class="btn btn-danger" @tap="confirminvoice">确定</view>
      </view>
    </view>

    <!--买家留言-->
    <view class="fui-cell-group">
      <view class="fui-cell fui-cell-textarea">
        <view class="fui-cell-label">
          买家留言
        </view>
        <view class="fui-cell-info">
          <textarea v-if="!cycledate&&!invoicepicker&&!selectcard" rows="2" placeholder="50字以内（选填）" id="remark" @input="dataChange"></textarea>
        </view>
      </view>
    </view>

    <view class="fui-cell-group clearform" v-if="diyform.fields!=null && diyform.fields.length>0">
      <view class="fui-cell" @tap="clearform">
        <view class="fui-cell-info">表单</view>
        <view class="fui-cell-remark noremark" style="color:#999">
          <text class="icox icox-delete" style="font-size:26rpx"></text> 清空</view>
      </view>
    </view>
    <include src="/pages/common/diyform.wxml"></include>
    <include src="/pages/common/city-picker.wxml"></include>
    <view :class="'fui-mask ' + ( showPicker||gift?'show':'' )"></view>
    <include src="/pages/common/gift-picker.wxml"></include>
    <!--优惠券余额-->
    <view class="fui-cell-group">
      <navigator class="fui-cell" hover-class="none" url="/pages/public/coupon/index?type=0" v-if="list.couponcount>0" open-type="navigate">
        <view class="fui-cell-info" style="color:#666">{{ !data.couponname?"选择优惠券":"已选择优惠券："+data.couponname }}</view>
        <view class="fui-cell-remark">
          <view class="badge badge-danger">{{ list.couponcount }}</view>
        </view>
        <text class="text" v-if="list.couponcount<=0">无可用</text>
      </navigator>
      <view class="fui-cell" v-if="list.deductcredit>0">
        <text class="text-danger">{{ list.deductcredit }}</text>
        <view class="fui-cell-label" style="text-align:left;width:auto">积分可抵扣
          <text class="text-danger">{{ list.deductmoney }}</text> 元
        </view>
        <view class="fui-cell-info">
          <switch class="switch-80 pull-right" @change="dataChange" id="deduct"></switch>
        </view>
      </view>
      <view class="fui-cell" v-if="list.deductcredit2>0">
        <view class="fui-cell-label" style="text-align:left;width:auto">余额可抵扣
          <text class="text-danger">{{ list.deductcredit2 }}</text> 元
        </view>
        <view class="fui-cell-info">
          <switch class="switch-80 pull-right" @change="dataChange" id="deduct2"></switch>
        </view>
      </view>
    </view>

    <view :class="'fui-cell-group ' + ( toggleStore?'toggleSend-group':'' )" v-if="list.stores.length>0 && list.isforceverifystore!=1">
      <view class="fui-cell" @tap="toggle" :data-id="toggleStore" data-type="toggleStore">
        <view class="fui-cell-icon">
          <text class="icox icox-dianpu1"></text> </view>
        <view class="fui-cell-label differ">
          <text class="store">适用门店</text>
        </view>
        <view class="fui-cell-info"></view>
        <view class="num">{{ stores.length }}</view>
        <view class="fui-cell-remark"></view>
      </view>
      <view class="send-code">
        <view class="fui-list noclick" v-for="(item, index) in list.stores" :key="index">
          <view class="fui-list-media">
            <text class="icox icox-dianpu1"></text>
          </view>
          <view class="fui-list-inner store-inner">
            <view class="title">
              <text class="storename">{{ item.storename }}</text>
            </view>
            <view class="text">
              <text class="realname">{{ item.realname }} {{ item.mobile }}</text>
            </view>
            <view class="text">
              <text class="address">{{ item.address }}</text>
            </view>
          </view>
          <view class="fui-list-angle ">
            <view class="icox icox-kefu2" @tap="phone" :data-phone="item.mobile"></view>
            <navigator :url="'/pages/order/store/map?id=' + item.id + '&merchid=' + item.merchid" hover-class="none" open-type="navigate">
              <text class="icox icox-dingwei1"></text>
            </navigator>
          </view>
        </view>
      </view>
    </view>

    <view class="fui-cell-group">
      <view class="fui-cell">
        <view class="fui-cell-label">商品小计</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">¥
          <text>{{ispackage?originalprice: list.goodsprice }}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="ispackage">
        <view class="fui-cell-label">套餐优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{comboprice}}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="list.buyagain>0">
        <view class="fui-cell-label">重复购买优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{ list.buyagain }}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="list.taskdiscountprice>0">
        <view class="fui-cell-label">任务活动优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{ list.taskdiscountprice }}</text>
        </view>
      </view>
      <view class="fui-cell" @tap="selectCard" v-if="card_info.all_mycardlist.length > 0">
        <view class="fui-cell-label">会员卡</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark">
          <text class="text-danger">{{cardname || '未使用会员卡'}}</text>
        </view>
      </view>
      
      <view class="fui-cell" v-if="card_info.length != 0 && carddiscountprice != 0">
        <view class="fui-cell-label">会员卡优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-￥{{carddiscountprice}}</view>
      </view>
      <view class="fui-cell" v-if="list.discountprice>0">
        <view class="fui-cell-label">会员优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥<text>{{ list.discountprice }}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="list.isdiscountprice>0">
        <view class="fui-cell-label">促销优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{ list.isdiscountprice }}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="list.showenough">
        <view class="fui-cell-label" style="text-align:left;width:auto">商城单笔满
          <text class="text-danger">{{ list.enoughmoney }}</text>元立减
        </view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{ list.enoughdeduct }}</text>
        </view>
      </view>

      <view class="fui-cell" v-if="list.merch_showenough">
        <view class="fui-cell-label" style="text-align:left;width:auto">商户单笔满
          <text class="text-danger">{{ list.merch_enoughmoney }}</text>元立减
        </view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{ list.merch_enoughdeduct }}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="list.seckill_price>0">
        <view class="fui-cell-label">秒杀优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{list.seckill_price}}</text>
        </view>
      </view>

      <view class="fui-cell">
        <view class="fui-cell-label" style="width: 300rpx">{{city_express_state?"同城运费":"运费"}}<span style="color:#ff5555;" v-if="list.card_free_dispatch">(会员卡包邮)</span></view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">¥
          <text v-if="list.iscycelbuy == true">{{ list.dispatch_price }}(x{{ list.cycelComboPeriods }}期)</text>
          <text v-else>{{ list.dispatch_price }}</text>
        </view>
      </view>
      <view class="fui-cell" v-if="data.couponname && coupon.deductprice">
        <view class="fui-cell-label" style="width: 350rpx;">{{ coupon.coupondeduct_text }}</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥
          <text>{{ coupon.deductprice }}</text>
        </view>
      </view>
    </view>
  </view>
  <!--底部固定-->
  <view :class="'fui-footer ' + iphonexnavbar">
    <view class="tool nopadding">
      <view class="text">
        <view class="title text-right">需付：
          <text class="text-danger">{{ list.realprice }}元</text>
        </view>
      </view>
      <view class="btns">
        <text :class="'btn btn-danger ' + submit && 'disabled'" @tap="submit">立即支付</text>
      </view>
    </view>
  </view>
  <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
    <view class="text">{{FoxUIToast.text}}</view>
  </view>
  <!--空白快  适应iponex  -->
  <view v-if="isIpx" style="hight: 50rpx;"></view>

</view>


<view id="address" :class="( showaddressview ? '' : 'shut')">
  <view class="address-alert">
    <view class="address-title">请填写收货地址哦！</view>
    <view class="fui-cell-group" style="margin-top:0">
      <view class="fui-cell">
        <view class="fui-cell-label">收货人</view>
        <view class="fui-cell-info c000">
          <input :value="areaDetail.detail.realname" placeholder="收件人" class="fui-input" @input="onChange2" data-type="realname"></input>
        </view>
      </view>
      <view class="fui-cell">
        <view class="fui-cell-label">联系电话</view>
        <view class="fui-cell-info c000">
          <input :value="areaDetail.detail.mobile" placeholder="联系电话" class="fui-input" type="number" @input="onChange2" data-type="mobile"></input>
        </view>
      </view>
      <view class="fui-cell">
        <view class="fui-cell-label">所在地区</view>
        <view class="fui-cell-info c000" @tap="selectArea" data-hasarea="1" data-areaKey="detail" :data-area="areaDetail.detail.province + ' ' + areaDetail.detail.city + ' ' + areaDetail.detail.area">{{ !areaDetail.detail.province||!areaDetail.detail.city?"请选择所在地区":areaDetail.detail.province+" "+areaDetail.detail.city+" "+areaDetail.detail.area }}</view>
      </view>
      <view class="fui-cell" v-if="street.length>0">
        <view class="fui-cell-label">所在街道</view>
        <view class="fui-cell-info c000">
          <picker :value="streetIndex||0" :range="street" range-key="name" @change="onChange2" data-type="street">
            <view class="picker"> {{ areaDetail.detail.street||'请选择街道' }}</view>
          </picker>
        </view>
      </view>
      <view class="fui-cell">
        <view class="fui-cell-label">详细地址</view>
        <view class="fui-cell-info c000">
          <input :value="areaDetail.detail.address" placeholder="街道，楼牌号等" class="fui-input" @input="onChange2" data-type="address"></input>
        </view>
      </view>
    </view>
    <a id="btn-submit" class=" btn btn-danger disable block" @tap="submitaddress">保存地址</a>
    <i data-type="close" @tap="showaddressview" class="icox icox-guanbi1" id="address-colse" style="font-size:60rpx;color:#fff;position: absolute;top:105%;left:46%"></i>
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


<!--会员卡列表 选择  -->
<view :class="'card-list-modal ' + selectcard" @tap="closeCardModal"></view>
<view :class="'card-list-group ' + selectcard">
  <view class="card-list-title">选择会员卡</view>
  <view class="card-list-cancel" @tap="changecard" data-id>
    <view class="text">不使用会员卡</view>
    <view :class="'icon ' + (cardid == '' ? 'activeselect' : '')"><i class="icox icox-duihao1"></i></view>
  </view>
  <view class="card-list-content">
    <view :class="'item ' + item.card_style" v-for="(item, index) in card_info.all_mycardlist" :key="index" :data-id="item.id" @tap="changecard">
      <view @tap="cancalCard" :class="'iconselect ' + (cardid == item.id ? 'activeselect' : '')"><i class="icox icox-duihao2"></i></view>
      <i class="iconbg icox icox-huiyuan"></i>
      <view class="content">
        <view class="title"><image src="/static/images/icon-white.png"></image>{{item.name}}</view>
        <view class="date">{{item.validate}}</view>
        <view class="tip">
          <view class="tip-item" v-if="item.member_discount == 1">{{item.discount_rate}}折</view>
          <view class="tip-item" v-if="item.shipping == 1">包邮</view>
          <view class="tip-item" v-if="item.is_card_coupon == 1 || item.is_month_coupon == 1">优惠券</view>
          <view class="tip-item" v-if="item.is_card_points == 1 || item.is_month_points == 1">积分</view>
        </view>
      </view>
    </view>
  </view>
</view>
</view>
</template>

<script>
/**
 *
 * order/create/index.js
 *
 * @create 2017-1-5
 * @author Young
 *
 * @update  Young 2017-01-10
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var diyform = app.requirejs('biz/diyform');
var $ = app.requirejs('jquery');
var selectdate = app.requirejs('biz/selectdate');

export default {
  data() {
    return {
      icons: app.requirejs('icons'),
      list: {},
      goodslist: {},
      areaDetail: {
        detail: {
          realname: '',
          mobile: '',
          areas: '',
          street: '',
          address: ''
        }
      },
      merchid: 0,
      showPicker: false,
      pvalOld: [0, 0, 0],
      pval: [0, 0, 0],
      areas: [],
      street: [],
      streetIndex: 0,
      noArea: false,
      showaddressview: false,
      city_express_state: false,
      // 以下 周期购
      currentDate: "",
      dayList: '',
      currentDayList: '',
      currentObj: '',
      currentDay: '',
      cycelbuy_showdate: '',
      receipttime: '',
      scope: '',
      bargainid: '',
      //会员卡
      selectcard: ''
    };
  },

  onShow: function () {
    var $this = this,
        address = app.getCache("orderAddress"),
        shop = app.getCache("orderShop");
    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar',
        paddingb: 'padding-b'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: '',
        paddingb: ''
      });
    }

    if (address) {
      this.setData({
        'list.address': address
      });
      $this.caculate($this.data.list);
    }

    if (shop) {
      this.setData({
        'list.carrierInfo': shop,
        'list.storeInfo': shop
      });
    }

    var coupon = app.getCache("coupon");

    if (typeof coupon == 'object' && coupon.id != 0) {
      this.setData({
        'data.couponid': coupon.id,
        'data.couponname': coupon.name
      });
      core.post('order/create/getcouponprice', {
        couponid: coupon.id,
        goods: this.goodslist,
        goodsprice: this.list.goodsprice,
        discountprice: this.list.discountprice,
        isdiscountprice: this.list.isdiscountprice
      }, function (data) {
        if (data.error == 0) {
          delete data.$goodsarr;
          $this.setData({
            coupon: data
          });
          $this.caculate($this.data.list);
        } else {
          core.alert(data.message);
        }
      }, true);
    } else {
      this.setData({
        'data.couponid': 0,
        'data.couponname': null,
        coupon: null
      });

      if (!$.isEmptyObject($this.data.list)) {
        $this.caculate($this.data.list);
      }
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var $this = this,
        goodslist = [];

    if (options.goods) {
      var goods = JSON.parse(options.goods);
      options.goods = goods;
      this.setData({
        ispackage: true
      });
    }

    $this.setData({
      options: options
    });
    $this.setData({
      bargainid: options.bargainid
    });
    app.url(options);
    core.get('order/create', $this.data.options, function (list) {
      if (list.error == 0) {
        goodslist = $this.getGoodsList(list.goods);
        var comboprice = ($this.data.originalprice - list.goodsprice).toFixed(2);
        $this.setData({
          list: list,
          goods: list,
          show: true,
          address: true,
          card_info: list.card_info || {},
          cardid: list.card_info.cardid || '',
          cardname: list.card_info.cardname || '',
          carddiscountprice: list.card_info.carddiscountprice,
          goodslist: goodslist,
          merchid: list.merchid,
          comboprice: comboprice,
          diyform: {
            f_data: list.f_data,
            fields: list.fields
          },
          city_express_state: list.city_express_state,
          cycelbuy_showdate: list.selectDate,
          receipttime: list.receipttime,
          iscycel: list.iscycel,
          scope: list.scope,
          fromquick: list.fromquick,
          hasinvoice: list.hasinvoice
        });
        app.setCache("goodsInfo", {
          goodslist: goodslist,
          merchs: list.merchs
        }, 1800);
      } else {
        core.toast(list.message, 'loading');
        setTimeout(function () {
          wx.navigateBack();
        }, 1000);
      }

      if (list.fullbackgoods != '') {
        if (list.fullbackgoods == undefined) {
          return;
        }

        var fullbackratio = list.fullbackgoods.fullbackratio;
        var maxallfullbackallratio = list.fullbackgoods.maxallfullbackallratio;
        var fullbackratio = Math.round(fullbackratio);
        var maxallfullbackallratio = Math.round(maxallfullbackallratio);
        $this.setData({
          fullbackratio: fullbackratio,
          maxallfullbackallratio: maxallfullbackallratio
        });
      }

      if (list.iscycel == 1) {
        $this.show_cycelbuydate();
      }
    });
    this.getQuickAddressDetail();
    app.setCache("coupon", '');
    setTimeout(function () {
      $this.setData({
        areas: app.getCache("cacheset").areas
      });
    }, 3000);
  },
  components: {},
  props: {},
  methods: {
    detail: {
      realname: '',
      mobile: '',
      areas: '',
      street: '',
      address: ''
    },
    show_cycelbuydate: function () {
      var $this = this;
      /*周期购时间选择器初始化*/

      var currentObj = selectdate.getCurrentDayString(this, $this.data.cycelbuy_showdate);
      var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      $this.setData({
        currentObj: currentObj,
        currentDate: currentObj.getFullYear() + '.' + (currentObj.getMonth() + 1) + '.' + currentObj.getDate() + ' ' + week[currentObj.getDay()],
        currentYear: currentObj.getFullYear(),
        currentMonth: currentObj.getMonth() + 1,
        currentDay: currentObj.getDate(),
        initDate: Date.parse(currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate()),
        checkedDate: Date.parse(currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate()),
        maxday: $this.data.scope //可选的天数

      });
    },
    // 获取商品列表
    getGoodsList: function (list) {
      var goodslist = [];
      $.each(list, function (k, v) {
        $.each(v.goods, function (kk, vv) {
          goodslist.push(vv);
        });
      });
      var originalprice = 0;

      for (var i = 0; i < goodslist.length; i++) {
        originalprice += goodslist[i].price;
      }

      this.setData({
        originalprice: originalprice
      });
      return goodslist;
    },
    toggle: function (e) {
      var data = core.pdata(e),
          id = data.id,
          type = data.type,
          d = {};
      id == 0 || typeof id == 'undefined' ? d[type] = 1 : d[type] = 0;
      this.setData(d);
    },
    phone: function (e) {
      core.phone(e);
    },
    dispatchtype: function (e) {
      var type = core.data(e).type;
      this.setData({
        'data.dispatchtype': type
      });
      this.caculate(this.list);
    },
    number: function (e) {
      var $this = this,
          dataset = core.pdata(e),
          val = foxui.number(this, e),
          id = dataset.id,
          list = $this.data.list,
          total = 0,
          goodsprice = 0.0;
      $.each(list.goods, function (k, v) {
        $.each(v.goods, function (kk, vv) {
          if (vv.id == id) {
            list.goods[k].goods[kk].total = val;
          }

          total += parseInt(list.goods[k].goods[kk].total);
          goodsprice += parseFloat(total * list.goods[k].goods[kk].price);
        });
      });
      list.total = total;
      list.goodsprice = $.toFixed(goodsprice, 2);
      $this.setData({
        list: list,
        goodslist: $this.getGoodsList(list.goods)
      });
      this.caculate(list);
    },
    caculate: function (list) {
      var $this = this;
      var couponid = 0;

      if ($this.data.data && $this.data.data.couponid != 0) {
        couponid = $this.data.data.couponid;
      }

      core.post('order/create/caculate', {
        goods: this.goodslist,
        dflag: this.data.dispatchtype,
        addressid: this.list.address ? this.list.address.id : 0,
        packageid: this.list.packageid,
        bargain_id: this.bargainid,
        discountprice: this.list.discountprice,
        cardid: this.cardid,
        couponid: couponid
      }, function (data) {
        console.error(data);
        list.dispatch_price = data.price;
        list.enoughdeduct = data.deductenough_money;
        list.enoughmoney = data.deductenough_enough;
        list.taskdiscountprice = data.taskdiscountprice;
        list.discountprice = data.discountprice;
        list.isdiscountprice = data.isdiscountprice;
        list.seckill_price = data.seckill_price;
        list.deductcredit2 = data.deductcredit2;
        list.deductmoney = data.deductmoney;
        list.deductcredit = data.deductcredit;
        list.gifts = data.gifts;

        if ($this.data.data.deduct) {
          data.realprice -= data.deductmoney; //减去积分抵扣的金额
        }

        if ($this.data.data.deduct2) {
          data.realprice -= data.deductcredit2;
        }

        if ($this.data.coupon && typeof $this.data.coupon.deductprice != 'undefined') {
          $this.setData({
            "coupon.deductprice": data.coupon_deductprice
          });
          data.realprice -= data.coupon_deductprice;
        }

        if (data.card_info) {
          list.card_free_dispatch = data.card_free_dispatch;
        }

        if ($this.data.goods.giftid == 0) {
          $this.setData({
            "goods.gifts": data.gifts
          });
        }

        if (list.realprice <= 0) {
          list.realprice = 0.000001;
        }

        list.realprice = $.toFixed(data.realprice, 2);
        $this.setData({
          list: list,
          cardid: data.card_info.cardid,
          cardname: data.card_info.cardname,
          goodsprice: data.card_info.goodsprice,
          carddiscountprice: data.card_info.carddiscountprice,
          city_express_state: data.city_express_state
        });
      }, true);
    },
    submit: function () {
      var data = this,
          $this = this,
          diydata = this.diyform;
      var giftid = data.goods.giftid || data.giftid;

      if (this.goods.giftid == 0 && this.goods.gifts.length == 1) {
        giftid = this.goods.gifts[0].id;
      }

      if (data.submit) {
        return;
      }

      var verify = diyform.verify(this, diydata);

      if (!verify) {
        return;
      }

      data.list.carrierInfo = data.list.carrierInfo || {};
      var subdata = {
        'id': data.options.id ? data.options.id : 0,
        'goods': data.goodslist,
        'gdid': data.options.gdid,
        'dispatchtype': data.data.dispatchtype,
        'fromcart': data.list.fromcart,
        'carrierid': data.data.dispatchtype == 1 && data.list.carrierInfo ? data.list.carrierInfo.id : 0,
        'addressid': data.list.address ? data.list.address.id : 0,
        'carriers': data.data.dispatchtype == 1 || data.list.isvirtual || data.list.isverify ? {
          'carrier_realname': data.list.member.realname,
          'carrier_mobile': data.list.member.mobile,
          'realname': data.list.carrierInfo.realname,
          'mobile': data.list.carrierInfo.mobile,
          'storename': data.list.carrierInfo.storename,
          'address': data.list.carrierInfo.address
        } : '',
        'remark': data.data.remark,
        'deduct': data.data.deduct,
        'deduct2': data.data.deduct2,
        'couponid': data.data.couponid,
        'cardid': data.cardid,
        'invoicename': data.list.invoicename,
        'submit': true,
        'packageid': data.list.packageid,
        'giftid': giftid,
        'diydata': data.diyform.f_data,
        'receipttime': data.receipttime,
        'bargain_id': $this.data.options.bargainid,
        'fromquick': data.fromquick
      };

      if (data.list.storeInfo) {
        subdata.carrierid = data.list.storeInfo.id;
      }

      if (data.data.dispatchtype == 1 || data.list.isvirtual || data.list.isverify) {
        if ($.trim(data.list.member.realname) == '' && data.list.set_realname == '0') {
          core.alert('请填写联系人!');
          return;
        }

        if ($.trim(data.list.member.mobile) == '' && data.list.set_mobile == '0') {
          core.alert('请填写联系方式!');
          return;
        }

        if (!/^[1][3-9]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/.test($.trim(data.list.member.mobile))) {
          core.alert("请填写正确联系电话!");
          return;
        }

        if (data.list.isforceverifystore) {
          if (!data.list.storeInfo) {
            core.alert('请选择门店!');
            return;
          }
        }

        subdata.addressid = 0;
      } else {
        if (!subdata.addressid && !data.list.isonlyverifygoods) {
          core.alert('地址没有选择!');
          return;
        }
      }

      $this.setData({
        submit: true
      });
      core.post('order/create/submit', subdata, function (ret) {
        $this.setData({
          submit: false
        });

        if (ret.error != 0) {
          core.alert(ret.message);
          return;
        }

        wx.navigateTo({
          url: '/pages/order/pay/index?id=' + ret.orderid
        });
      }, true);
    },
    dataChange: function (e) {
      var data = this.data,
          list = this.list,
          id = e.target.id;

      switch (id) {
        case 'remark':
          data.remark = e.detail.value;
          break;

        case 'deduct':
          data.deduct = e.detail.value;

          if (data.deduct2) {
            return;
          }

          var realprice = parseFloat(list.realprice);
          realprice += data.deduct ? -parseFloat(list.deductmoney) : parseFloat(list.deductmoney);
          list.realprice = realprice;
          break;

        case 'deduct2':
          data.deduct2 = e.detail.value;

          if (data.deduct) {
            return;
          }

          var realprice = parseFloat(list.realprice);
          realprice += data.deduct2 ? -parseFloat(list.deductcredit2) : parseFloat(list.deductcredit2);
          list.realprice = realprice;
          break;
      }

      if (list.realprice <= 0) {
        list.realprice = 0.000001;
      }

      list.realprice = $.toFixed(list.realprice, 2);
      this.setData({
        data: data,
        list: list
      });
    },
    listChange: function (e) {
      var list = this.list,
          id = e.target.id;

      switch (id) {
        case 'invoicename':
          list.invoicename = e.detail.value;
          break;

        case 'realname':
          list.member.realname = e.detail.value;
          break;

        case 'mobile':
          list.member.mobile = e.detail.value;
          break;
      }

      this.setData({
        list: list
      });
    },
    url: function (e) {
      var url = core.pdata(e).url;
      wx.redirectTo({
        url: url
      });
    },
    onChange: function (e) {
      return diyform.onChange(this, e);
    },
    DiyFormHandler: function (e) {
      return diyform.DiyFormHandler(this, e);
    },
    selectArea: function (e) {
      return diyform.selectArea(this, e);
    },
    bindChange: function (e) {
      return diyform.bindChange(this, e);
    },
    onCancel: function (e) {
      return diyform.onCancel(this, e);
    },
    onConfirm: function (e) {
      diyform.onConfirm(this, e);
      var val = this.pval;
      var areas = this.areas;
      var detail = this.areaDetail.detail;
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
        'areaDetail.detail': detail,
        streetIndex: 0,
        showPicker: false
      });
      return;
    },
    getIndex: function (str, areas) {
      return diyform.getIndex(str, areas);
    },
    //快速添加收货地址
    showaddressview: function (e) {
      var showaddressview = '';

      if (e.target.dataset.type == 'open') {
        showaddressview = true;
      } else {
        showaddressview = false;
      }

      this.setData({
        showaddressview: showaddressview
      });
    },
    onChange2: function (event) {
      var $this = this;
      var vname = $this.data.areaDetail.detail;
      var bindtype = event.currentTarget.dataset.type;
      var value = $.trim(event.detail.value);

      if (bindtype == 'street') {
        vname.streetdatavalue = $this.data.street[value].code;
        value = $this.data.street[value].name;
      }

      vname[bindtype] = value;
      $this.setData({
        'areaDetail.detail': vname
      });
    },
    getStreet: function (areas, val) {
      if (!areas || !val) {
        return;
      }

      var $this = this;

      if (!$this.data.areaDetail.detail.province || !$this.data.areaDetail.detail.city || !this.openstreet) {
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

        if (street && $this.data.areaDetail.detail.streetdatavalue) {
          for (var i in street) {
            if (street[i].code == $this.data.areaDetail.detail.streetdatavalue) {
              data.streetIndex = i;
              $this.setData({
                'areaDetail.detail.street': street[i].name
              });
              break;
            }
          }
        }

        $this.setData(data);
      });
    },
    getQuickAddressDetail: function () {
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
          var area = result.detail.province + " " + result.detail.city + " " + result.detail.area;
          var index = $this.getIndex(area, $this.data.areas);
          data.pval = index;
          data.pvalOld = index;
          data.areaDetail.detail = result.detail;
        }

        $this.setData(data);

        if (result.openstreet && index) {
          $this.getStreet($this.data.areas, index);
        }
      });
    },
    submitaddress: function () {
      var $this = this;
      var detail = $this.data.areaDetail.detail;

      if ($this.data.posting) {
        return;
      }

      if (detail.realname == '' || !detail.realname) {
        foxui.toast($this, "请填写收件人");
        return;
      }

      if (detail.mobile == '' || !detail.mobile) {
        foxui.toast($this, "请填写联系电话");
        return;
      }

      if (detail.city == '' || !detail.city) {
        foxui.toast($this, "请选择所在地区");
        return;
      }

      if ($this.data.street.length > 0 && (detail.street == '' || !detail.street)) {
        foxui.toast($this, "请选择所在街道");
        return;
      }

      if (detail.address == '' || !detail.address) {
        foxui.toast($this, "请填写详细地址");
        return;
      }

      if (!detail.datavalue) {
        foxui.toast($this, "地址数据出错，请重新选择");
        return;
      }

      detail.id = 0;
      $this.setData({
        posting: true
      });
      core.post('member/address/submit', detail, function (result) {
        if (result.error != 0) {
          $this.setData({
            posting: false
          });
          foxui.toast($this, result.message);
          return;
        }

        detail.id = result.addressid;
        $this.setData({
          showaddressview: false,
          'list.address': detail
        });
        core.toast("保存成功");
      });
    },
    //赠品弹层
    giftPicker: function () {
      this.setData({
        active: 'active',
        gift: true
      });
    },
    //关闭pickerpicker
    emptyActive: function () {
      this.setData({
        active: '',
        slider: 'out',
        tempname: '',
        showcoupon: false,
        gift: false
      });
    },
    radioChange: function (e) {
      this.setData({
        giftid: e.currentTarget.dataset.giftgoodsid,
        gift_title: e.currentTarget.dataset.title
      });
    },

    /*同城配送*/
    sendclick: function () {
      wx.navigateTo({
        url: '/pages/map/index'
      });
    },
    // 清除表单内容
    clearform: function () {
      var diyform = this.diyform;
      var new_fdata = {};
      $.each(diyform, function (k, v) {
        //lgt 清除表单时保留图片上传功能
        $.each(v, function (key, value) {
          if (value.data_type == 5) {
            diyform.f_data[value.diy_type].count = 0;
            diyform.f_data[value.diy_type].images = [];
            new_fdata[value.diy_type] = diyform.f_data[value.diy_type];
          }
        });
      });
      diyform.f_data = new_fdata;
      this.setData({
        diyform: diyform
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
      this.setData({
        cycledate: false
      });
    },
    // 周期购 修改送达时间
    editdate: function (e) {
      selectdate.setSchedule(this);
      this.setData({
        cycledate: true,
        create: true
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
    // 弹出发票picker
    showinvoicepicker: function () {
      var tempdata = this.list;

      if (tempdata.invoice_type == 0) {
        //only纸质
        tempdata.invoice_info.entity = true;
      }

      if (tempdata.invoice_type == 1) {
        //only电子
        tempdata.invoice_info.entity = false;
      }

      this.setData({
        invoicepicker: true,
        list: tempdata
      });
    },
    noinvoicepicker: function () {
      this.setData({
        invoicepicker: false
      });
    },
    // 清空数据
    clearinvoice: function () {
      var tempdata = this.list;
      tempdata.invoicename = '';
      this.setData({
        invoicepicker: false,
        list: tempdata
      });
    },
    // 修改电子纸质类型发票
    chaninvoice: function (e) {
      var tempdata = this.list;

      if (e.currentTarget.dataset.type == '0') {
        tempdata.invoice_info.entity = false;
      } else {
        tempdata.invoice_info.entity = true;
      }

      this.setData({
        list: tempdata
      });
    },
    // 修改发票类型
    changeType: function (e) {
      var tempdata = this.list;

      if (e.currentTarget.dataset.type == '0') {
        tempdata.invoice_info.company = false;
      } else {
        tempdata.invoice_info.company = true;
      }

      this.setData({
        list: tempdata
      });
    },
    // input发票抬头
    invoicetitle: function (e) {
      var tempdata = this.list;
      tempdata.invoice_info.title = e.detail.value.replace(/\s+/g, '');
      this.setData({
        list: tempdata
      });
    },
    // input发票税号
    invoicenumber: function (e) {
      var tempdata = this.list;
      tempdata.invoice_info.number = e.detail.value.replace(/\s+/g, '');
      this.setData({
        list: tempdata
      });
    },
    // 发票确定按钮
    confirminvoice: function () {
      var tempdata = this.list;

      if (!tempdata.invoice_info.company) {
        this.setData({
          invoicenumber: ''
        });
      }

      var str1 = tempdata.invoice_info.entity ? '[纸质] ' : '[电子] ';
      var str2 = tempdata.invoice_info.title + ' ';
      var str3 = tempdata.invoice_info.company ? '（单位: ' + tempdata.invoice_info.number + '）' : '（个人）';
      tempdata.invoicename = str1 + str2 + str3;

      if (!tempdata.invoice_info.title) {
        foxui.toast(this, "请填写发票抬头");
      } else if (tempdata.invoice_info.company && !tempdata.invoice_info.number) {
        foxui.toast(this, "请填写税号");
      } else {
        this.setData({
          list: tempdata,
          invoicepicker: false
        });
      }
    },
    // 选择会员卡
    selectCard: function () {
      var $this = this;
      $this.setData({
        selectcard: 'in'
      });
    },
    // 不使用会员卡
    cancalCard: function () {
      this.setData({
        cardid: ''
      });
    },
    // 切换会员卡
    changecard: function (e) {
      var $this = this,
          card_info = $this.data.card_info;
      $this.setData({
        selectcard: '',
        cardid: e.currentTarget.dataset.id
      });
      var id = e.currentTarget.dataset.id;
      var args = {
        cardid: id,
        goodsprice: this.list.goodsprice,
        dispatch_price: this.list.dispatch_price,
        discountprice: this.list.discountprice
      };
      core.post('order/create/getcardprice', args, function (data) {
        if (id != '') {
          if (data.error == 0) {
            var obj = {
              carddiscount_rate: data.carddiscount_rate,
              carddiscountprice: data.carddiscountprice,
              cardid: data.cardid,
              cardname: data.name,
              dispatch_price: data.dispatch_price,
              totalprice: data.totalprice,
              comboprice: 0
            };
            $this.setData(obj);
            $this.caculate($this.data.list);
          } else {
            core.alert(data.message);
          }
        } else {
          var card_obj = {
            cardid: '',
            selectcard: '',
            cardname: '',
            carddiscountprice: 0,
            ispackage: false
          };
          var comboprice = ($this.data.originalprice - $this.data.list.goodsprice).toFixed(2);

          if ($this.data.options.goods) {
            card_obj.ispackage = true;
            card_obj.comboprice = comboprice;
          }

          $this.setData(card_obj);

          if (!$.isEmptyObject($this.data.list)) {
            $this.caculate($this.data.list);
          }
        }
      }, true);
    },
    // 关闭选择会员卡弹窗
    closeCardModal: function () {
      var $this = this;
      $this.setData({
        selectcard: ''
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
@import "../../../static/css/order.css";
@import "../../common/city-picker.css";
@import "../../date/date.css";



page {
  background: #f7f7f7;
}

.nav {
  width: 100%;
  height: 90rpx;
  display: flex;
  flex-direction: row;
  background: #fff;
}

.default {
  line-height: 90rpx;
  text-align: center;
  flex: 1;
  color: #666;
  font-size: 32rpx;
}

.red {
  line-height: 90rpx;
  text-align: center;
  color: #ef4f4f;
  flex: 1;
  font-size: 32rpx;
  border-bottom: 2px solid #ef4f4f;
}

.switch {
  float: right;
  zoom: 90%;
  overflow: hidden;
}

.btn {
  padding: 0 60rpx;
  border-radius: 0;
  height: 100rpx;
  line-height: 100rpx;
  margin: 0;
}

.fui-list-angle {
  margin-right: 0;
  text-align: right;
  height: 140rpx;
}

.fui-list-angle .price {
  font-size: 26rpx;
}

.fui-list-angle .text-right {
  color: #999;
  font-size: 28rpx;
}

.fui-cell-text .shop_name {
  font-size: 28rpx;
  line-height: 48rpx;
  height: 48rpx;
}

.fui-list-inner {
  height: 140rpx;
  align-self: center;
}

.gift-list .fui-list-inner {
  height: auto;
  align-self: flex-start;
}

.no-border .fui-list-inner {
  height: auto;
}

.fui-cell-group .fui-cell.fui-cell-textarea {
  height: 120rpx;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
}

.diyform-container .picker-group {
  display: flex;
}

.diyform-container .diyform-pulldown2 {
  flex: 1;
}

.diyform-container .diyform-pulldown2  view {
  width: 100%;
  float: left;
  background: #f3f3f3;
  text-indent: 0.5rem;
  border-radius: 0.1rem;
  position: relative;
}

.diyform-container .diyform-pulldown2 view:after {
  content: " ";
  display: inline-block;
  -webkit-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  transform: rotate(135deg);
  height: 12rpx;
  width: 12rpx;
  border-width: 1px 1px 0 0;
  border-color: #000;
  border-style: solid;
  position: absolute;
  top: 8rpx;
  right: 30rpx;
  margin-left: 0;
}

.has-address {
  font-size: 28rpx;
  line-height: 48rpx;
  height: 48rpx;
  display: flex;
}

.name {
  display: inline-block;
  max-width: 300rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 20rpx;
}

.mobile {
  display: inline-block;
  overflow: hidden;
}

.adress {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 26rpx;
  color: #666;
}

.fui-cell-group .fui-cell .fui-cell-icon {
  color: #000;
}

.no-border .fui-list-inner .subtitle {
  line-height: 1.5;
}

.row-remark {
  text-align: right;
  position: relative;
  flex-shrink: 0;
  padding-left: 20rpx;
  color: #aaa;
  font-size: 26rpx;
  line-height: 1.5;
}

/*.fui-list-group {
   padding-bottom:20rpx
}*/

.fui-list.no-border {
  overflow: visible;
  background: #f9f9f9;
  padding-top: 20rpx;
}

.fui-list.no-border::after {
  content: " ";
  display: block;
  height: 4rpx;
  background: #fff;
  position: absolute;
  top: 0px;
  right: 20rpx;
  left: 20rpx;
}

.picker-modal {
  height: auto;
}

.fui-cell-group.bordertop:after {
  content: " ";
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  top: 0;
  height: 1px;
  border-top: 1px solid #ebebeb;
  color: #d9d9d9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}

.fui-cell-group.clearform {
  position: relative;
}

.fui-cell-group.clearform:after {
  content: " ";
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  bottom: 0;
  height: 1px;
  border-top: 1px solid #ebebeb;
  color: #d9d9d9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}

/*周期购  */

.fui-cycle {
  padding: 0 0.6rem;
  margin-bottom: 0.75rem;
  height: 3.9rem;
  text-align: center;
}

.fui-cycle-left {
  width: 252rpx;
  height: 156rpx;
  float: left;
  border-radius: 4rpx;
  box-shadow: 0 0 10px #ededed;
}

.fui-cycle .text {
  font-size: 24rpx;
  color: #999;
  padding-top: 36rpx;
}

.fui-cycle .date {
  font-size: 28rpx;
  color: #333;
  padding-top: 20rpx;
}

.fui-cycle-right {
  width: 430rpx;
  height: 156rpx;
  float: right;
  border-radius: 4rpx;
  box-shadow: 0 0 20rpx #ededed;
}

/*周期购  */
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


.invoice-picker {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #333;
  line-height: 100rpx;
  display:flex;
  flex-direction:column;
  z-index:1002;
  transition: all .6s;
}
.whiteinvoice {
  background: #fff;
  padding: 20rpx;
  width: 100%;
  box-sizing: border-box;
}
.invoice-picker .btn {
  width: 100%;
  border-radius: 45rpx;
  height: 90rpx;
  line-height: 90rpx;
  margin: 80rpx 0;
}
.invoice-picker .flex {
  border-bottom: 1px solid #eeeeee;
}
.invoice-picker input {
  line-height: 100rpx;
  width: 70%;
  height: 100rpx;
  font-size: 28rpx;
}
.invoice-title view {
  padding: 0 40rpx;
  height: 58rpx;
  line-height: 58rpx;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 30rpx;
  margin: 0 20rpx 30rpx 0;
}
.invoice-title view.active {
  color: #ef4f4f;
  border-color: #ef4f4f;
}
.invoice-pickernone {
  position: fixed;
  top: 100%;
  left: 0;
}


.card-list-modal{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: none;
}
.card-list-group{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: #fff;
  z-index: 1001;
  display: none;
}
.card-list-modal.in,.card-list-group.in{
  display: block;
}
.card-list-title{
  text-align: center;
  line-height: 110rpx;
  font-size: 30rpx;
  color: #333;
}
.card-list-cancel{
  width: 670rpx;
  height: 88rpx;
  display: flex;
  line-height: 88rpx;
  margin: 10rpx auto 0;
  font-size: 28rpx;
  color: #333;
  border-radius: 4rpx;
  justify-content: space-around;
  box-shadow: 0 0 10rpx #ededed;
}
.card-list-cancel .text{
  flex: 1;
  padding-left: 20rpx;
}
.card-list-cancel .icon{
  width: 90rpx;
  text-align: center;
}
.card-list-cancel .icon i{
  font-size: 40rpx;
  color: #999;
}
.card-list-cancel .icon.activeselect i{
  color: #ff9245 !important;
}
.card-list-content{
  height: 600rpx;
  overflow-y: scroll;
}
.card-list-content .item{
  width: 670rpx;
  height: 222rpx;
  border-radius: 15rpx;
  margin: 20rpx auto 0;
  position: relative;
  overflow: hidden;
}

.card-style-golden{
    background: -webkit-linear-gradient(left, #c1a167 , #e9d5aa);
    background: -o-linear-gradient(right, #c1a167 , #e9d5aa);
    background: -moz-linear-gradient(right, #c1a167 , #e9d5aa);
    background: linear-gradient(to right, #c1a167 , #e9d5aa);
}
.card-style-erythrine{
    background: -webkit-linear-gradient(left, #745757 , #966d6d);
    background: -o-linear-gradient(right,  #745757 , #966d6d);
    background: -moz-linear-gradient(right,  #745757 , #966d6d);
    background: linear-gradient(to right,  #745757 , #966d6d);
}
.card-style-gray{
    background: -webkit-linear-gradient(left, #434247 , #7a7985);
    background: -o-linear-gradient(right, #434247 , #7a7985);
    background: -moz-linear-gradient(right, #434247 , #7a7985);
    background: linear-gradient(to right, #434247 , #7a7985);
}
.card-style-brown{
    background: -webkit-linear-gradient(left, #736e6c , #978c8c);
    background: -o-linear-gradient(right, #736e6c , #978c8c);
    background: -moz-linear-gradient(right, #736e6c , #978c8c);
    background: linear-gradient(to right, #736e6c , #978c8c);
}
.card-style-blue{
    background: -webkit-linear-gradient(left, #576074 , #6d7b96);
    background: -o-linear-gradient(right, #576074 , #6d7b96);
    background: -moz-linear-gradient(right, #576074 , #6d7b96);
    background: linear-gradient(to right, #576074 , #6d7b96);
}
.card-style-black{
    background: -webkit-linear-gradient(left, #373737 , #4a4a4a);
    background: -o-linear-gradient(right, #373737 , #4a4a4a);
    background: -moz-linear-gradient(right, #373737 , #4a4a4a);
    background: linear-gradient(to right, #373737 , #4a4a4a);
}

.card-list-content .item .iconbg{
  position: absolute;
  font-size: 160rpx;
  color: #000;
  opacity: 0.1;
  bottom: -50rpx;
  right: -35rpx;
}
.card-list-content .item .iconselect{
  width: 90rpx;
  height: 90rpx;
  text-align: center;
  line-height: 100rpx;
  position: absolute;
  right: 0;
  z-index: 6;
  font-size: 40rpx;
}
.card-list-content .item .iconselect i{
  font-size: 38rpx;
  color: #fff;
}
.card-list-content .item .iconselect.activeselect i{
  color: #ff9245 !important;
}
.card-list-content .content{
  width: 670rpx;
  height: 222rpx;
  box-sizing: border-box;
  padding: 20rpx;
}
.card-list-content .content .title{
  font-size: 32rpx;
  color: #fff;
}
.card-list-content .content .title image{
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: -3rpx;
  margin-right: 10rpx;
}
.card-list-content .content .date{
  font-size: 26rpx;
  color: #fff;
  opacity: 0.6;
  margin-top: 20rpx;
  line-height: 1;
}
.card-list-content .content .tip{
  display: flex;
  margin-top: 38rpx;
}
.card-list-content .tip .tip-item{
  display: inline-block;
  height: 50rpx;
  line-height: 50rpx;
  padding:0 24rpx;
  border-radius: 30rpx;
  border: 1rpx solid #fff;
  margin-right: 20rpx;
  opacity: 0.8;
  color: #fff;
  font-size: 26rpx;
}


</style>