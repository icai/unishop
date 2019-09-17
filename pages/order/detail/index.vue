<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>
<loading v-if="!show">加载中...</loading>



<view :class="'page navbar ' + seckill_color + ' ' + paddingb" v-if="show">
  <view class="fui-list bg">

    <view class="row" style="font-size:34rpx">
      <view class>{{ order.statusstr }}{{ order.refundstate>0 && order.refundstate!=3?'('+order.refundtext+')':''}}</view>
    </view>
    <view class="order-price">订单金额(含运费):¥
      <text>{{ order.price }}</text>
    </view>
  </view>

  <!--周期购  -->
  <view class="fui-cell-group nomargin cycle" v-if="order.iscycelbuy == 1">
    <navigator v-if="order.status > 0" open-type="navigate" :url="'/pages/order/cycle/index?id=' + order.id" class="fui-cell" hover-class="none">
      <view class="fui-cell-icon">
        <i class="icox icox-xiangmuzhouqi" style="color: #ff6a54"></i>
      </view>
      <view class="fui-cell-info">查看每期详情</view>
      <view class="fui-cell-remark">剩余{{ cycelUnderway }}期</view>
    </navigator>
    <view v-if="cycelData.length == cycelUnderway">
      <view class="cycle-underway" v-for="(item, index) in cycelData" :key="index" v-if="index == 0">
        <view class="cycle-cell">第{{ index+1 }}次：
          <text v-if="item.status == 0">未开始</text>
          <text v-if="item.status == 1">配送中（可顺延）</text>
          <text v-if="item.status == 2">已完成</text>
        </view>
        <view class="cycle-cell">物流详情：
          <text v-if="item.status == 0">未发货</text>
          <text v-else>{{ item.expresscom }}{{ item.expresssn }}</text>
        </view>
        <view class="cycle-cell">预计送达时间：{{ item.receipttime }}</view>
      </view>
    </view>
    <view v-else>
      <view class="cycle-underway" v-for="(item, index) in cycelData" :key="index" v-if="index == period_index">
        <view class="cycle-cell">第{{ index+1 }}次：
          <text v-if="item.status == 0">未开始</text>
          <text v-if="item.status == 1">配送中（可顺延）</text>
          <text v-if="item.status == 2">已完成</text>
        </view>
        <view class="cycle-cell">物流详情：
          <text v-if="item.status == 0">未发货</text>
          <text v-else>{{ item.expresscom }}{{ item.expresssn }}</text>
        </view>
        <view class="cycle-cell">预计送达时间：{{ item.receipttime }}</view>
      </view>
    </view>
    
  </view>



  <!--实物快递-->
  <view class="fui-list-group" v-if="address && order.iscycelbuy == 0">
    <navigator class="fui-list" v-if="order.status>1" :url="'/pages/order/express/index?id=' + order.id">
      <view class="fui-list-media">
        <view class="fui-list-icon">
          <text class="icox icox-icon049"></text>
        </view>
      </view>
      <view class="fui-list-inner">
        <block v-if="express">
          <view class="text">{{ express.step }}</view>
          <view class="text">{{ express.time }}</view>
        </block>
        <block v-else>
          <view class="text">暂无物流信息</view>
          <view class="text"></view>
        </block>

      </view>
      <view class="fui-list-angle">
        <text class="angle"></text>
      </view>
    </navigator>
    <navigator class="fui-list" hover-class="none">
      <view class="fui-list-media">

        <view class="fui-list-icon">
          <text class="icox icox-dingwei1"></text>
        </view>
      </view>
      <view class="fui-list-inner">
        <view class style="font-size:28rpx;line-height: 1.2rem;height: 1.2rem;">{{ address.realname }} {{ address.mobile }}</view>
        <view class="text" style="font-size:26rpx;color:#666">{{ address.province+address.city+address.area+' '+address.address }}</view>
      </view>
    </navigator>
  </view>

  <view class="fui-list-group" v-if="carrier||store">
    <view class="fui-list noclick" v-if="carrier">
      <view class="fui-list-media">
        <image src="/static/images/icon/people.png" class="fui-list-icon"></image>

      </view>
      <view class="fui-list-inner">
        <view class="title">{{ carrier.carrier_realname }} {{ carrier.carrier_mobile }}</view>
      </view>
    </view>
    <view class="fui-list" v-if="store">
      <view class="fui-list-media">

        <view class="fui-list-icon">
          <text class="icox icox-dianpu1"></text>
        </view>
      </view>
      <view class="fui-list-inner store-inner">
        <view class="title">
          <text class="storename">{{ store.storename }}</text>
        </view>
        <view class="text">
          <text class="realname">{{ store.realname }} {{ store.mobile }}</text>
        </view>
        <view class="text">
          <text class="address">{{ store.address }}</text>
        </view>
      </view>
      <view class="fui-list-angle ">
         <view class="icox icox-kefu2" @tap="phone" :data-phone="store.mobile"></view>

        <navigator :url="'/pages/order/store/map?id=' + store.id" hover-class="none">
          <text class="icox icox-dingwei1"></text>
        </navigator>
      </view>
    </view>
  </view>

  <view class="fui-list-group" style="padding-bottom:20rpx">
    <view class="fui-list-group-title">

      <view class="fui-list-icon">
        <text class="icox icox-dianpu1"></text>
      </view>
      <text class="shop">{{ shop.name=="null"?'':shop.name}}</text>
    </view>
    <block v-for="(item, index) in nogift" :key="index">
      <view class="fui-list goods-item">
        <navigator class="fui-list-media" :url="'/pages/goods/detail/index?id=' + item.id" open-type="redirect">
          <image class="goods_img" :src="item.thumb"></image>
        </navigator>
        <navigator class="fui-list-inner" style="height:140rpx" :url="'/pages/goods/detail/index?id=' + item.id" open-type="redirect">
          <view class="text">{{ item.title }}</view>
          <view class="subtitle">{{ item.optionname }}</view>
        </navigator>
        <view class="price text-right" style="height:140rpx;">
          <view class="text-right">¥
            <text>{{ item.price/item.total }}</text>
          </view>
          <view class="text-right" style="color:#666;line-height:72rpx">x
            <text>{{ item.total }}</text>
          </view>

          <block v-if="order.canrefund && order.is_single_refund">
            <navigator :url="'/pages/order/singlerefund/index?id=' + item.ordergoodsid" class="text-right" style="color:#666">
              <text class="refund-btn block btn btn-sm btn-default-o" v-if="item.single_refundstate==8">已拒绝</text>
              <text class="refund-btn block btn btn-sm btn-default-o" v-if="item.single_refundstate==9">维权成功</text>
              <text class="refund-btn block btn btn-sm btn-default-o" v-if="item.single_refundstate==1">退款中</text>
              <text class="refund-btn block btn btn-sm btn-default-o" v-if="item.single_refundstate==2">退货中</text>
              <text class="refund-btn block btn btn-sm btn-default-o" v-if="item.single_refundstate==0">{{ order.status==1 && item.sendtime ==0?'退款':'售后'}}</text>
            </navigator>
          </block>

        </view>
      </view>
      <view class="fui-list noclick" v-if="item.diyformfields.length>0">
        <view class="fui-list-inner">
          <view class="text">
            <view :class="'look-diyinfo ' + ( !diyshow[item.id]?'':'open')" @tap="diyshow" :data-id="item.id">{{ !diyshow[item.id]?"展开":"收起" }}提交的资料</view>
          </view>
        </view>
      </view>

      <view :hidden="!diyshow[item.id]" v-if="item.diyformfields.length>0">
        <component :diyform="item" :is="diyform"></component>
      </view>
    </block>
    <!--赠品显示start-->
    <block v-for="(gitem, index) in gift" :key="index">
      <navigator :url="'/pages/goods/detail/index?id=' + gitem.id" v-if="index<2||all">
        <view class="fui-list no-border">
          <view class="fui-list-media">
            <image :src="gitem.thumb"></image>
          </view>
          <view class="fui-list-inner">
            <view class="row">
              <view class="row-text">{{gitem.title}}</view>
            </view>
            <view class="subtitle">{{gitem.optionname}}</view>
          </view>
          <view class="row-remark">
            <view>x
              <text>{{ gitem.total }}</text>
            </view>
            <view>
              <text class="text-danger">免费赠品</text>
            </view>
          </view>
        </view>
      </navigator>
    </block>
    <view class="fui-list no-border more" v-if="gift.length>2&&!all" @tap="more">
      查看更多赠品
    </view>
    <!--赠品显示end-->
    <!--全返-->
    <view class="fui-cell" v-if="fullbackgoods != undefined" style="display: flex;padding: 20rpx 24rpx 20rpx;">
      <view class="fui-cell-label" style="display: inline-block;font-size: 26rpx;color: #666;">{{ fullbacktext }}详情</view>
      <view class="fui-cell-info" style="text-align: right;flex: 1;color: #000;font-size: 24rpx;">
        <i style="color: #ff5555;position: relative;top: 4rpx;margin-right: 5rpx;" class="icox icox-xiaofei1"></i>
        总金额
        <i style="color: #ff5555;">
          <block v-if="fullbackgoods.type == 0">￥{{fullbackgoods.maxallfullbackallprice}}</block>
          <block v-if="fullbackgoods.type == 1">{{maxallfullbackallratio}}%</block>
        </i>
        ,每天返
        <i style="color: #ff5555;">
          <block v-if="fullbackgoods.type == 0">￥{{fullbackgoods.fullbackprice}}</block>
          <block v-if="fullbackgoods.type == 1">{{fullbackratio}}%</block>
        </i>
        ，时间：
        <i style="color: #ff5555;">{{fullbackgoods.day}}天</i>
      </view>
    </view>
    <!--全返end-->
  </view>

  <!--卡密发货信息-->
  <block v-if="order.virtual>0 && order.virtual_str!='' && order.status == 3">
    <block v-if="ordervirtualtype&&ordervirtual.length>0">
      <view :class="'fui-cell-group ' + ( toggleCode?'toggleSend-group':'' )" v-for="(item, index) in ordervirtual" :key="index">
        <view class="fui-cell-title">发货信息{{ordervirtual.length>1?index+1:''}}</view>
        <view class="fui-cell" v-for="(item2, index2) in item" :key="index2">
          <view class="fui-cell-label">
            <text selectable="true">{{item2.key}}</text>
          </view>
          <view class="wrapview">
            <text selectable="true">{{item2.value}}</text>
          </view>
        </view>
      </view>
    </block>
    <block v-else>
      <view class="fui-cell-group">
        <view class="fui-cell-title">发货信息</view>
        <view class="fui-cell">
          <view class="fui-cell-info" style="white-space:normal">
            <text selectable="true">{{ order.virtual_str }}</text>
          </view>
        </view>
      </view>
    </block>
  </block>

  <view class="fui-cell-group" v-if="order.isvirtualsend>0 && order.virtualsend_info!=null">
    <view class="fui-cell-title">发货信息</view>
    <view class="fui-cell">
      <view class="fui-cell-info" style="white-space:normal">
        <text selectable="true">{{ order.virtualsend_info }}</text>
      </view>
    </view>
  </view>


  <!--自提-->
  <!--消费码-->
  <view :class="'fui-cell-group ' + ( toggleConsume?'toggleSend-group':'' )" v-if="order.verifyinfo">
    <view class="fui-cell" @tap="toggle" :data-id="toggleConsume" data-type="toggleConsume">

      <view class="fui-cell-icon">
        <text class="icox icox-viewlist"></text> </view>
      <view class="fui-cell-text differ">
        <text class="consume" selectable="true">{{ order.verifytitle }}</text>
      </view>
      <view class="badge badge-warning">{{ order.verifyinfo.length }}</view>
      <view class="fui-cell-remark"></view>
    </view>
    <block v-if="order.status>0">
      <view class="send-code" v-for="(item, index) in order.verifyinfo" :key="index">
        <text selectable="true">{{ item.verifycode }}</text>
        <text :class="'pull-right fui-label ' + item.verified==1&&'fui-label-danger'" selectable="true">{{ item.status }}</text>
      </view>
    </block>

    <view class="send-code" v-else>
      <text>付款后可见!</text>
    </view>
  </view>

  <!--自提-->
  <view :class="'fui-cell-group ' + ( toggleStore?'toggleSend-group':'' )" v-if="stores && !store">
    <view class="fui-cell" @tap="toggle" :data-id="toggleStore" data-type="toggleStore">

      <view class="fui-list-icon">
        <text class="icox icox-dianpu1"></text>
      </view>
      <view class="fui-cell-text differ">
        <text class="store">适用门店</text>
      </view>
      <view class="badge badge-warning">{{ stores.length }}</view>
      <view class="fui-cell-remark"></view>
    </view>
    <view class="send-code">
      <view class="fui-list noclick" v-for="(item, index) in stores" :key="index">
        <view class="fui-list-media">

          <view class="fui-list-icon">
            <text class="icox icox-dianpu1"></text>
          </view>
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
          <navigator :url="'/pages/order/store/map?id=' + item.id" hover-class="none">

            <text class="icox icox-dingwei1"></text>
          </navigator>
        </view>
      </view>
    </view>
  </view>


  <view class="fui-cell-group price-cell-group">
    <view class="fui-cell">
      <view class="fui-cell-label">商品小计{{ order.cycelComboPeriods }}</view>
      <view class="fui-cell-info">{{ order.ispackage=='1'?'(套餐总价)':''}}</view>
      <view class="fui-cell-remark noremark">¥ {{ order.goodsprice }}</view>
    </view>
    <view class="fui-cell" v-if="membercard_info.card_dec_price > 0">
      <view class="fui-cell-label">会员卡优惠</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">-¥ {{ membercard_info.card_dec_price }}</view>
    </view>
    <view class="fui-cell">
      <view class="fui-cell-label">{{order.city_express_state=='1'?"同城运费":"运费"}}</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark" v-if="order.iscycelbuy != 1">¥ {{ order.dispatchprice }}</view>
      <view class="fui-cell-remark noremark" v-if="order.iscycelbuy == 1">¥ {{ order.dispatchprice }}({{ order.cycelComboPeriods }}期)</view>
    </view>
    <block v-if="order.ispackage!='1'">
      <view class="fui-cell" v-if="order.deductenough>0">
        <view class="fui-cell-label">满额立减</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.deductenough }}</view>
      </view>

      <view class="fui-cell" v-if="order.couponprice>0">
        <view class="fui-cell-label" style="width:auto;">优惠券优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.couponprice }}</view>
      </view>

      <view class="fui-cell" v-if="order.buyagainprice>0">
        <view class="fui-cell-label">重复购买优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.buyagainprice }}</view>
      </view>

      <view class="fui-cell" v-if="order.discountprice>0">
        <view class="fui-cell-label">会员优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.discountprice }}</view>
      </view>

      <view class="fui-cell" v-if="order.isdiscountprice>0">
        <view class="fui-cell-label">促销优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.isdiscountprice }}</view>
      </view>

      <view class="fui-cell" v-if="order.deductprice>0">
        <view class="fui-cell-label">积分抵扣</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.deductprice }}</view>
      </view>

      <view class="fui-cell" v-if="order.deductcredit2>0">
        <view class="fui-cell-label">余额抵扣</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.deductcredit2 }}</view>
      </view>

      <view class="fui-cell" v-if="order.seckilldiscountprice>0">
        <view class="fui-cell-label">秒杀优惠</view>
        <view class="fui-cell-info"></view>
        <view class="fui-cell-remark noremark">-¥ {{ order.seckilldiscountprice }}</view>
      </view>
    </block>
    <view class="fui-cell">
      <view class="fui-cell-label" style="width:auto;">实付费(含运费)</view>
      <view class="fui-cell-info"></view>
      <view class="fui-cell-remark noremark">
        <text class="text-danger">
                    <text style="font-size:30rpx">¥ {{ order.price }}</text>
        </text>
      </view>
    </view>
    <!--<view class="fui-cell">
            <view class="fui-cell-label">全返</view>
            <view class="fui-cell-info"></view>
            <view class="fui-cell-remark noremark">全返内容全返内容全返内容</view>
        </view>-->
  </view>
  <view class="fui-cell-group">
    <view class="order-info">
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">订单编号：{{ order.ordersn }}</text>
      </view>
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">创建时间：{{ order.createtime }}</text>
      </view>
      <view class="fui-cell-label" v-if="order.paytime" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">支付时间：{{ order.paytime }}</text>
      </view>
      <view class="fui-cell-label" v-if="order.sendtime" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">发货时间：{{ order.sendtime }}</text>
      </view>
      <view class="fui-cell-label" v-if="order.finishtime" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">完成时间：{{ order.finishtime }}</text>
      </view>
    </view>
  </view>

   <view class="fui-cell-group" v-if="order.virtual>0 && virtualtemp && virtualtemp.description != ''">
    <view class="explain-title">使用说明</view>
    <view class="explain-content">
      {{virtualtemp.description}}
    </view>
  </view>


  <view v-if="order.diyformfields.length>0">
    <component :diyform="order" :is="diyform"></component>
  </view>

  <!-- 发票信息 -->
  <view class="fui-cell-group" v-if="invoice">
    <view class="order-info">
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">发票类型：{{ invoice.company?'单位':'个人' }}</text>
      </view>
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">抬头类型：{{ invoice.entity?'纸质发票':'电子发票' }}</text>
      </view>
      <view class="fui-cell-label" style="font-size:24rpx;color:#999">
        <text class="fui-cell-label" selectable="true">发票抬头：{{ invoice.title }}</text>
      </view>
      <view class="fui-cell-label" style="font-size:24rpx;color:#999" v-if="invoice.company">
        <text class="fui-cell-label" selectable="true">纳税人识别号：{{ invoice.number }}</text>
      </view>
    </view>
  </view>

  <!-- <view class='operate'>
        <navigator class='btn btn-default' url="/pages/order/index" open-type="redirect">我的订单</navigator>
        <navigator class='btn btn-default' url="/pages/index/index" open-type="switchTab">返回首页</navigator>
    </view> -->

  <view :class="'fui-footer aa ' + iphonexnavbar">
    <button class="btn btn-default btn-default-o pull-left" open-type="contact" session-from="weapp" show-message-card="true" v-if="customer==1">
      <text class="icox icox-customerservice"></text>客服
    </button>
    <block v-if="!order.canrestore"> 
      <view v-if="order.cancancel" class="btn btn-default btn-default-o btn-sm">
        <picker :value="cancelindex" :range="cancel" @change="cancel">取消订单</picker>
      </view> 
      <navigator v-if="order.canpay" class="btn btn-danger-o btn-sm" :url="'/pages/order/pay/index?id=' + order.id">支付订单</navigator>
      <view v-if="order.canverify && !order.isonlyverifygoods" class="btn btn-default btn-default-o btn-sm pull-left" :data-orderid="order.id" @tap="code">{{ order['dispatchtype']==1?'我要取货':'我要使用' }}</view>
      
      <navigator v-if="order.canverify &&order.verifygoods_id &&  order.isonlyverifygoods" class="btn btn-default btn-default-o btn-sm" :url="'/pages/verifygoods/detail/index?id=' + order.verifygoods_id">我要使用</navigator> 

      <view v-if="order.candelete" class="btn btn-default btn-default-o btn-sm" data-type="1" @tap="delete">删除订单</view>
      <navigator v-if="order.cancomment2" class="btn btn-default btn-default-o btn-sm" :url="'/pages/order/comment/index?id=' + order.id">追加评价</navigator>
      <navigator v-if="order.cancomment" class="btn btn-default btn-default-o btn-sm" :url="'/pages/order/comment/index?id=' + order.id">评价</navigator>  
      <view v-if="order.cancomplete && order.iscycelbuy == 0 && !order.isonlyverifygoods" class="btn btn-default btn-default-o btn-sm" @tap="finish">确认收货</view>
                 
      <navigator v-if="order.canrefund && order.iscycelbuy == 0 && order.refundstate!=3" class="btn btn-default btn-sm" :url="'/pages/order/refund/index?id=' + order.id">{{ order.refundtext }}</navigator>
      <block v-if="order.refundstate!=3">
        <navigator v-if="order.canrefund && order.iscycelbuy == 1 && order.status == 1" class="btn btn-default btn-sm" :url="'/pages/order/refund/index?id=' + order.id">{{ order.refundtext }}</navigator>
        <view v-if="order.cancancelrefund" class="btn btn-default-o btn-sm btn-cancel" @tap="refundcancel">取消申请</view>
      </block>
    </block>
    <block v-if="order.canrestore">
      <view class="btn btn-default btn-default-o btn-sm" data-type="2" :data-orderid="order.id" @tap="delete">
        彻底删除订单
      </view>
      <view class="btn btn-default btn-default-o btn-sm" data-type="0" :data-orderid="order.id" @tap="delete">
        恢复订单 
      </view>
    </block>
  </view>
  <!--弹出模态框-->
  <include src="/pages/order/public/verify.wxml"></include>
</view>
</view>
</template>

<script>
/**
 *
 * order/detail/index.js
 *
 * @create 2017-1-12
 * @author Young
 *
 * @update  Young 2017-01-16
 *
 */
var app = getApp(),
    core = app.requirejs('core'),
    order = app.requirejs('biz/order');

export default {
  data() {
    return {
      code: false,
      consume: false,
      store: false,
      cancel: order.cancelArray,
      cancelindex: 0,
      diyshow: {},
      city_express_state: 0
    };
  },

  onShareAppMessage: function () {
    return core.onShareAppMessage();
  },
  onShow: function () {
    this.get_list();
    var $this = this;
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
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options
    });
    app.url(options);
  },
  components: {},
  props: {},
  methods: {
    get_list: function () {
      var $this = this;
      core.get('order/detail', $this.data.options, function (list) {
        if (list.error > 0) {
          if (list.error != 50000) {
            core.toast(list.message, 'loading');
          }

          wx.redirectTo({
            url: '/pages/order/index'
          });
        }

        if (list.nogift[0].fullbackgoods != undefined) {
          var fullbackratio = list.nogift[0].fullbackgoods.fullbackratio;
          var maxallfullbackallratio = list.nogift[0].fullbackgoods.maxallfullbackallratio;
          var fullbackratio = Math.round(fullbackratio);
          var maxallfullbackallratio = Math.round(maxallfullbackallratio);
        }

        if (list.error == 0) {
          list.show = true;
          var ordervirtualtype = Array.isArray(list.ordervirtual);
          $this.setData(list);
          $this.setData({
            ordervirtualtype: ordervirtualtype,
            fullbackgoods: list.nogift[0].fullbackgoods,
            maxallfullbackallratio: maxallfullbackallratio,
            fullbackratio: fullbackratio,
            invoice: list.order.invoicename,
            membercard_info: list.membercard_info
          });
        }
      });
    },
    more: function () {
      this.setData({
        all: true
      });
    },
    code: function (e) {
      var $this = this,
          orderid = core.data(e).orderid;
      core.post('verify/qrcode', {
        id: orderid
      }, function (json) {
        if (json.error == 0) {
          $this.setData({
            code: true,
            qrcode: json.url
          });
        } else {
          core.alert(json.message);
        }
      }, true);
    },
    diyshow: function (e) {
      var diyshow = this.diyshow,
          goodsid = core.data(e).id;
      diyshow[goodsid] = !diyshow[goodsid];
      this.setData({
        diyshow: diyshow
      });
    },
    close: function () {
      this.setData({
        code: false
      });
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
    cancel: function (e) {
      order.cancel(this.options.id, e.detail.value, '/pages/order/detail/index?id=' + this.options.id);
    },
    delete: function (e) {
      var type = core.data(e).type;
      order.delete(this.options.id, type, '/pages/order/index');
    },
    finish: function (e) {
      order.finish(this.options.id, '/pages/order/index');
    },
    refundcancel: function (e) {
      var $this = this;
      order.refundcancel(this.options.id, function () {
        $this.get_list();
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
.fui-footer{
    text-align: right;
}
.bg{
    background: -moz-linear-gradient(left, #ffb43e 0%, #fd9526 100%);
    background: -webkit-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: -o-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: -ms-linear-gradient(left, #ffb43e 0%,#fd9526 100%);
    background: linear-gradient(to right, #ffb43e 0%,#fd9526 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffb43e, endColorstr=#fd9526,gradientType='1');
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    font-size: 26rpx;
    height: 160rpx;
    color: #fff;
}
.red .bg{
    background:#fc664c;
    background:linear-gradient(to right, #fdad89 0%,#f94444 100%);
    background: -webkit-linear-gradient(left, #fdad89 0%,#f94444 100%);
}
.blue .bg{
    background:#4e87ee;
    background:linear-gradient(to right, #4fbaee 0%,#4e87ee 100%);
    background: -webkit-linear-gradient(left, #4fbaee 0%,#4e87ee 100%);
}
.purple .bg{
    background:#a839fa;
    background:linear-gradient(to right, #6a60ff 0%,#a839fa 100%);
    background: -webkit-linear-gradient(left, #6a60ff 0%,#a839fa 100%);
}
.orange .bg{
    background:#ff8c1e;
    background:linear-gradient(to right, #ffb81e 0%,#ff8c1e 100%);
    background: -webkit-linear-gradient(left, #ffb81e 0%,#ff8c1e 100%);
}
.pink .bg{
    background:#ff7e95;
    background:linear-gradient(to right, #ffacd0 0%,#ff7e95 100%);
    background: -webkit-linear-gradient(left, #ffacd0 0%,#ff7e95 100%);
}
.row{
    font-size: 30rpx;
    font-weight: bold;
}
.order-price{
    font-size: 27rpx;
    color: #fff;
    line-height: 44rpx
}
.adress{
    font-size: 27rpx;
    color: #666;
}
.order-info{
    padding: 20rpx 0
}
.order-info view,.send-code{
    padding: 6rpx 25rpx;
    color: #666;
    font-size: 28rpx;
}
.send-code.send-code1{
    padding: 6rpx 24rpx;
    color: #666;
    font-size: 28rpx;
}
.price{
    font-size: 26rpx;
    color: #000;
    margin-left: 20rpx
}
.fui-list-inner .subtitle{
    line-height: 40rpx
}
.send-code{display: none;}
.fui-cell-group.toggleSend-group .send-code{display: block;font-size: 26rpx}
.fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after{
    -webkit-transform:rotate(135deg);
    -ms-transform:rotate(135deg);
    transform:rotate(135deg);
}
.fui-list-media .image-48{
    height: 48rpx;
    width: 48rpx
}
.text-padding{
    padding:0 10rpx
}
.image-48{
    margin: 8rpx 0
}
.operate{
    display: flex;
}
.operate navigator{
    flex: 1
}
.fui-cell-group .fui-cell .fui-cell-remark {
    color:#888;
    text-align:right;
    font-size:28rpx;
    margin-right:8rpx;

}
.btn{
    height:56rpx;
    line-height:52rpx;
    border-radius: 40rpx;
    padding: 0 26rpx;
    margin-top: 24rpx;
    font-size: 26rpx
}
.btn.block.refund-btn{
  height: 44rpx;
  line-height: 40rpx;
  border-radius: 44rpx;
  font-size: 24rpx;
  width: 108rpx;
  padding: 0;
  text-align: center; 
  margin-right: 0;
  margin-top: 2rpx
}
.btn .icox{
    margin-right: 6rpx;
    vertical-align:baseline;
    font-size: 30rpx
}
.btn.btn-sm{
    margin-top: 24rpx;
    margin-right: 24rpx
}
.look-diyinfo{
    position: relative
}
.look-diyinfo::after{
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    height: 16rpx;
    width: 16rpx;
    border-width: 1rpx 1rpx 0 0;
    border-color: #b2b2b2;
    border-style: solid;
    position: absolute;
    top: 5rpx;
    right: 10rpx;
}
.look-diyinfo.open::after{
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(135deg);
    -ms-transform: rotate(135deg);
    transform: rotate(135deg);
    height: 16rpx;
    width: 16rpx;
    border-width: 1rpx 1rpx 0 0;
    border-color: #b2b2b2;
    border-style: solid;
    position: absolute;
    top: 0rpx;
    right: 10rpx;
}
.fui-cell-title{
    font-size: 28rpx
}
.gift-picker{
    position: fixed;
    bottom: 0;
    right: 0;
    left:0;
}
.fui-list.no-border{
    background: #f9f9f9;margin-top: 4rpx;font-size: 24rpx;color: #999
}
.no-border .fui-list-inner .subtitle {
    line-height:1.5;
}
.no-border .row{
    font-weight: normal
}
.no-border .fui-list-media image{
    width:100rpx;height:100rpx;
}
.no-border .row-text{
    color: #000
}
.row-remark{
    text-align: right;
    position: relative;
    flex-shrink: 0;
    padding-left:20rpx;
    color: #aaa;
    font-size: 26rpx;
    line-height: 1.5
}
.more{
    justify-content: center
}

/*周期购  */
.cycle-underway{
    height: 170rpx;
    padding: 20rpx 24rpx 0;
    position: relative;
    color: #666;
    font-size: 28rpx;
}
.cycle-underway:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1rpx solid #EBEBEB;
    color: #d9d9d9;
    height: 1rpx;
    width: 100%;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}
.cycle-underway .cycle-cell{
    margin-bottom:18rpx;
    padding: 0;
}
.fui-cell-group.cycle .fui-cell .fui-cell-remark{
    color: #ff5555;
    font-size: 28rpx;
}
.fui-cell-group.cycle .fui-cell .fui-cell-remark:after{
    border-color: #ff5555;
}
.wrapview {
  width: 530rpx;
  word-wrap: break-word;
  word-break: break-all;
}

.explain-title{
  font-size: 28rpx;
  color: #000;
  line-height: 80rpx;
  padding-left: 24rpx;
}
.explain-content{
  color: #666;
  font-size: 24rpx;
  line-height: 32rpx;
  padding: 0 24rpx 20rpx;
}
</style>