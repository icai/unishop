<template>
<view>
<view :class="(isIpx?'fui-iphonex-button':'')"></view>

<loading v-if="!show">加载中...</loading>
<!-- <view wx:else>

</view> -->
<!--分享弹窗  -->
<view class="page-shade" v-if="show && closeBtn" @tap="closeBtn">></view>
<!--分享内容  -->
<view :class="'fui-share ' + (isIpx?'fui-iphonex-share':'')" v-if="show && closeBtn">
  <view class="share-choose">
    <button style="border: none;background:none;padding-left: 0;line-height: 1;margin: 0;" open-type="share">
      <view class="share-wechat">
        <image :src="imgUrl + 'plugin/app/static/images/wxapp/share/wechat.png'"></image>
        <view class="text-explain">分享给朋友</view>
      </view>
    </button>
    <view class="share-poster" @tap="sharePoster">
      <image :src="imgUrl + 'plugin/app/static/images/wxapp/share/post.png'"></image>
      <view class="text-explain">生成商品图片</view>
    </view>
  </view>
  <view class="close-btn" @tap="closeBtn">关闭</view>
</view>
<view class="hint" v-if="show && !limits" @tap="hintclick">您还未授权无法查看商品完整信息，点击可重新获取授权喔~</view>
<!-- <button class="hint" wx:if="{{show && !limits}}" open-type='getUserInfo'>您还未授权无法查看商品完整信息，点击可重新获取授权喔~</button> -->
<view class="page comment-block" v-if="show" :style="'background:' + diypages.page.background + ';'">
  <!--商品start-->
  <view class="goods-detail-goods" v-if="showgoods">
    <!-- 店铺装修start -->
    <view v-if="usediypage != false">
      <block>
        <include src="/pages/diy/index.wxml"></include>
      </block>
    </view>
    <!-- 店铺装修end -->
    <view v-if="usediypage == false">
      <!--轮播start-->
      <view :style="'height:' + advHeight + 'rpx;position:relative;display:' + (showvideo?'block':'none')" v-if="goods.video">
        <view v-if="cover">
          <image class="bg" :src="goods.thumb" style="height:100%;width:100%" mode="aspectFit"></image>
          <image class="play" :src="play" style="width:150rpx;height:140rpx" @tap="startplay"></image>
          <view class="mc">
            <view class="video_btn active" @tap="showvideo">视频</view>
            <view class="pic_btn" @tap="showpic">图片</view>
          </view>
        </view>
        <video id="myVideo" :src="goods.video" @pause="bindpause" controls :style="'width:100%;height:' + advHeight + 'rpx;'" :class="'video ' + (showpic||cover?'none':'block')" :muted="soundpic" @fullscreenchange="bindfullscreenchange">
          <cover-image :src="(sound?voice:mute)" class="voice" @tap="changevoice"></cover-image>
          <cover-view class="mc" v-if="success">
            <cover-view class="video_btn active">视频</cover-view>
            <cover-view class="pic_btn" @tap="showpic">图片</cover-view>
          </cover-view>
        </video>
      </view>
      <view :class="'goods-advs ' + (showpic || goods.video == ''?'block':'none')" style="width:100%;height:auto;position:relative">
        <swiper class="index-adcs-sqiper" :indicator-dots="indicatorDots" :interval="interval" :duration="duration" :circular="circular" :style="'width:100%;height:' + advHeight + 'rpx;'">
          <block v-for="(item, index) in goods.thumbs" :key="index">
            <swiper-item>
              <image :src="item" class="goodsadvimg"></image>
            </swiper-item>
          </block>
        </swiper>
        <view class="mc">
          <view class="video_btn" @tap="showvideo" v-if="goods.video">视频</view>
          <view class="pic_btn active" @tap="showpic" v-if="goods.video">图片</view>
        </view>
      </view>
      <!--轮播end-->

      <!--秒杀start-->
      <view class="seckill-container " v-if="goods.seckillinfo">
        <view class="fui-list seckill-list" style>
          <view class="fui-list-media seckill-price">
            ¥
            <span>{{ goods.seckillinfo.price }}</span>
          </view>
          <view class="fui-list-inner">
            <!-- <view class="text">
                <span class="stitle" style="white-space:nowrap; overflow:hidden; max-width:2.6rem;">
                  4.27活动
                </span>
              </view> -->
              <view class="text">
                <span class="oldprice">{{ goods.marketprice }}</span>
            </view>
          </view>
        </view>
        <view class="fui-list seckill-list1">
          <view class="fui-list-inner">
            <view class="text ">已出售 {{ goods.seckillinfo.percent }}%</view>
            <view class="text ">
              <span class="process">
                <view class="process-inner" :style="'width: ' + goods.seckillinfo.percent + '%'">
                </view>
              </span>
            </view>
          </view>
        </view>
        <view class="fui-list seckill-list2" style>
          <view class="fui-list-inner">
            <view class="text ">{{ goods.seckillinfo.status==1?'距开始':'距结束' }}还有</view>
            <view class="text timer">
              <span class="time-hour">{{ hour }}</span>
              :
              <span class="time-min">{{ min }}</span>
              :
              <span class="time-sec">{{ sec }}</span>
            </view>
          </view>
        </view>
      </view>
      <!--秒杀end-->

      <!--详情start-->
      <view class="fui-cell-group fui-detail-group">
        <view class="fui-cell">
          <view class="fui-cell-text name">
            <text v-if="goods.ispresell==1 && goods.ispresellshow == 1" class="fui-tag fui-tag-danger">预</text>
            <text class="cycle-tip" v-if="goods.type == 9">周期购</text>
            <text selectable="true">{{goods.title}}</text>
          </view>
          <view class="fui-cell-remark showshade" @tap="showshade" style="margin-left: 60rpx;">
            <i style="font-size:42rpx;color: #fd5555;" class="icox icox-send"></i>
            <view style="font-size: 20rpx;color: #666;margin-top:-6rpx;">分享</view>
          </view>
        </view>
        <block v-if="goods.subtitle">
          <view class="fui-cell goods-subtitle">
            <text class="text-danger" selectable="true">{{goods.subtitle}}</text>
          </view>
        </block>
        <block v-if="!goods.seckillinfo">
          <view class="fui-cell">
            <view class="fui-cell-text price">
              <view class="text-danger">
                ¥
                <block v-if="goods.ispresell> 0 &&  preselltimeend>now">
                  <text v-if="goods.hasoption == 1">
                    <text v-if="goods.minpresellprice != goods.maxpresellprice">{{ goods.minpresellprice }}~{{ goods.maxpresellprice }}</text>
                    <text v-else>{{ goods.minpresellprice }}</text>
                  </text>
                  <text v-else>{{goods.presellprice}}</text>
                </block>
                <block v-else>
                  <block v-if="minprice==goods.maxprice">
                    {{minprice}}
                  </block>
                  <block v-else>
                    {{minprice}} ~ {{maxprice}}
                  </block>
                </block>
                <block v-if="goods.isdiscount!=0 && goods.isdiscount_time >= now">
                  <text class="original">¥{{goods.productprice}}</text>
                </block>
                <block v-else>
                  <text v-if="goods.productprice > goods.marketprice" class="original">¥{{goods.productprice}}</text>
                </block>
              </view>
            </view>
            <view v-if="goods.cansee>0 && goods.seecommission>0" class="detail-Commission flex" style="padding-bottom: 0">
              <view class="text">{{goods.seetitle}}</view>
              <view class="num flex1">￥{{goods.seecommission}}</view>
            </view>
          </view>
        </block>
        <block v-if="goods.ispresell==1 && goods.preselltimeend != 0 && goods.ispresellshow == 1">
          <view class="row row-time">
            <view id="time-container">
              <text class="label">{{goods.preselltitle ? goods.preselltitle:'距离预售开始'}}</text>
              <block>
                <span v-for="(item, index) in time" :key="index" class="number" :style="(index==0?'margin-left:20rpx':'')">{{item}}{{index==0?' 天 ': ''}}{{index==1?' 时 ': ''}}{{index==2?' 分 ': ''}}{{index==3?' 秒 ': ''}}</span>
              </block>
            </view>
          </view>
        </block>
        <!--促销start-->
        <block v-if="goods.isdiscount!=0 && goods.isdiscount_time >= now">
          <view class="row row-time" id="discount">
            <view id="discount-container">
              <text class="icox icox-shijian1"></text>
              <text class="label">{{goods.isdiscount_title?goods.isdiscount_title:'促销'}}</text>
              <block v-if="discountTitle">{{discountTitle}}</block>
              <block v-else>
                <span v-for="(item, index) in time" :key="index" class="number" :style="(index==0?'margin-left:20rpx':'')">{{item}}{{index==0?' 天 ': ''}}{{index==1?' 时 ': ''}}{{index==2?' 分 ': ''}}{{index==3?' 秒 ': ''}}</span>
              </block>
            </view>
          </view>
        </block>
        <!--促销end-->
        <!--限时购start-->
        <block v-if="goods.istime > 0">
          <view class="row row-time">
            <view id="time-container">
              <text class=" icox icox-shijian1"></text>
              <text class="label">{{istimeTitle?istimeTitle:'限时购'}}</text>
              <block v-if="istime==0">活动已结束</block>
              <block v-else>
                <span v-for="(item, index) in time" :key="index" class="number" :style="(index==0?'margin-left:20rpx':'')">{{item}}{{index==0?' 天 ': ''}}{{index==1?' 时 ': ''}}{{index==2?' 分 ': ''}}{{index==3?' 秒 ': ''}}</span>
              </block>
            </view>
          </view>
        </block>
        <!--限时购end-->
        <view class="fui-cell">
          <view class="fui-cell-text flex">
            <block v-if="dispatchpriceObj==1">
              <block v-if="goods.type==1">
                <text>快递:{{goods.dispatchprice.min}} ~ {{goods.dispatchprice.max}}</text>
              </block>
            </block>
            <block v-else>
              <text v-if="goods.isverify!=2">快递:<block v-if="goods.dispatchprice == 0">
                  <block v-if="activity.postfree.goods">包邮</block>
                  <block v-else>{{goods.dispatchprice}}</block>
                </block>
                <block v-else>{{goods.dispatchprice}}</block>
              </text>
            </block>
            <block v-if="!goods.seckillinfo || (goods.seckillinfo && goods.seckillinfo.status==1)">
              <block v-if="goods.showtotal==1">
                <text>库存:{{goods.total}}</text>
              </block>
              <text v-if="goods.showsales==1">销量:{{goods.sales}}{{goods.unit}}</text>
            </block>
            <block v-if="goods.province != '请选择省份' && goods.city != '请选择城市'">
              <text>{{goods.province}}{{goods.city}}</text>
            </block>
          </view>
        </view>
      </view>
      <!--详情end-->
      <!--预售发货 start-->
      <block v-if="goods.ispresell==1 && (preselltimeend > now || preselltimeend == 0)">
        <view class="fui-cell-group fui-cell-click fui-sale-group" style="margin-top:0">
          <view class="fui-list">
            <view class="fui-list-media">
              <view class="fui-cell-text">
                <span class="fui-label fui-label-safety">预售</span>
              </view>
            </view>
            <view class="fui-list-inner" style="font-size:26rpx;color:#666;">
              <view v-if="preselltimeend > 0">结束时间：{{goods.preselldateend}}</view>
              预计发货：
              <block v-if="goods.presellsendtype>0">
                购买后{{goods.presellsendtime}}天发货
              </block>
              <block v-else>
                {{goods.presellsendstatrttime}}
              </block>
            </view>
          </view>
        </view>
      </block>
      <!--预售发货 end-->
      <!--wx:if="{{goods.seckillinfo==false}}"  -->
      <view class="favourable" v-if="!goods.seckillinfo">
        <block v-if="goods.buyagain >0">
          <view class="fui-cell-group fui-sale-group" style="margin-top:0">
            <view class="fui-cell">
              <view class="fui-cell-text" style="white-space:normal;">此商品二次购买 可享受
                <span class="text-danger">{{goods.buyagain}}</span>折优惠
                <block v-if="!goods.buyagain_sale">
                  <view>二次购买的时候 不与其他优惠共享</view>
                </block>
              </view>
            </view>
          </view>
        </block>

        <view class="fui-cell-group fui-cell-click fui-sale-group noborder" @tap="couponPicker" v-if="coupon.length>0">
          <view class="fui-cell">
            <view class="fui-cell-text coupon-selector">
              <span style="margin-right: 0.25rem">优惠券</span>
              <span class="coupon-mini" v-for="(item, index) in coupon" :key="index" v-if="index<5">
                <span v-if="item.backpre" class="subtitle">￥</span>{{item.backmoney}}
                <span class="subtitle" v-if="item.backtype==1">折</span>
              </span>
            </view>
            <view class="fui-cell-remark">
              <text v-if="coupon_l>5">更多</text>
            </view>
          </view>
        </view>
        <block v-if="limits">
          <block v-if="goods.isdiscount==0 || (goods.isdiscount!=0 && goods.isdiscount_time < now)">
            <block v-if="!goods.memberprice=='' && goods.memberprice!=minprice && !goods.levelbuy==0">
              <view class="fui-cell-group fui-sale-group">
                <view class="fui-cell">
                  <view class="fui-cell-label" style="color:#000;width:86rpx">会员</view>
                  <view class="fui-cell-text">
                    <view class="sale-line">
                      <span class="sale-tip">{{goods.memberprice.levelname}}</span> 可享受
                      <span class="text-danger">¥{{goods.memberprice.price}}</span> 的价格</view>
                  </view>
                </view>
              </view>
            </block>
          </block>
        </block>
        <!--赠品start-->
        <block v-if="limits">
          <block v-if="goods.isgift==1">
            <view class="fui-cell-group fui-sale-group" @tap="giftPicker">
              <view class="fui-cell">
                <view class="fui-cell-label" style="color:#000;width:98rpx">赠品</view>
                <view class="fui-cell-info" v-if="goods.gifts.length==1">{{goods.gifts[0].title}}</view>
                <view class="fui-cell-info" v-else :style="(gift_title?'':'color:#666;')">{{gift_title?gift_title:'请选择赠品'}}</view>
                <view class="fui-cell-remark"></view>
              </view>
            </view>
          </block>
        </block>
        <!--赠品end-->
        <!--营销start-->
        <block v-if="limits && activity != ''">
          <block>
            <view class="fui-cell-group fui-sale-group" style="margin-top: 1rpx;" @tap="activityPicker">
              <view class="fui-cell">
                <view class="fui-cell-label" style="color:#000;width:86rpx">活动</view>
                <view class="fui-cell-text">
                  <!--满减  -->
                  <view v-if="activity.enough || activity.merch_enough" class="sale-line" style="font-size: 24rpx;">
                    <span class="sale-tip">满减</span>
                    <text v-if="activity.enough">全场满{{activity.enough[0].enough}}立减{{activity.enough[0].money}};</text>
                    <text v-if="activity.merch_enough">本店满{{activity.merch_enough[0].enough}}立减{{activity.merch_enough[0].give}};</text>
                  </view>
                  <!--全返  -->
                  <view v-if="fullbackgoods" class="sale-line" style="font-size: 24rpx;">
                    <span class="sale-tip">{{goods.fullbacktext}}</span>
                    该商品享受
                    <span v-if="fullbackgoods.type == 0" class="text-danger">¥{{fullbackgoods.maxallfullbackallprice}}</span>
                    <span v-if="fullbackgoods.type == 1" class="text-danger">{{maxallfullbackallratio}}%</span>
                    的{{goods.fullbacktext}}
                  </view>
                  <!--包邮  -->
                  <view v-if="activity.postfree" class="sale-line" style="font-size: 24rpx;">
                    <span class="sale-tip">包邮</span>
                    <span v-if="activity.postfree.goods"> 本商品包邮;</span>
                    <text v-if="activity.postfree.scope">
                                      <text>{{activity.postfree.scope}}</text>
                    <text v-if="activity.postfree.enoughfree>0">满￥{{activity.postfree.enoughfree}}</text>
                    <text>包邮</text>
                    </text>
                    <text v-if="activity.postfree.num">单品买{{activity.postfree.num}}件包邮；</text>
                    <text v-if="activity.postfree.price">单品买￥{{activity.postfree.price}}包邮</text>
                  </view>
                  <!--复购 -->
                  <view v-if="activity.buyagain" class="sale-line" style="font-size: 24rpx;">
                    <span class="sale-tip">复购</span>
                    此商品重复购买可享受 {{activity.buyagain.discount}}折;
                    <span v-if="activity.buyagain.buyagain_sale==0">重复购买 不与其他优惠共享</span>
                  </view>
                  <!--积分  -->
                  <view v-if="activity.credit" class="sale-line" style="font-size: 24rpx;">
                    <span class="sale-tip">{{credittext}}</span>
                    <text v-if="activity.credit.deduct">最高抵扣￥{{activity.credit.deduct}}；</text>
                    <text v-if="activity.credit.give">购买赠送{{activity.credit.give}}{{credittext}}</text>
                  </view>
                </view>
                <view class="fui-cell-remark"></view>
              </view>
            </view>
          </block>
        </block>
        <!--营销end-->

        <!--同城配送start-->
        <block v-if="goods.city_express_state">
          <view class="fui-cell-group fui-sale-group" style="margin-top: 1rpx;" @tap="sendclick">
            <view class="fui-cell">
              <view class="fui-cell-label" style="color:#000;width:86rpx">配送</view>
              <view class="fui-cell-label sale-line" style="flex: 1;font-size: 24rpx;">
                <span class="sale-tip">同城</span> 查看商家位置
              </view>
              <view class="fui-cell-remark"></view>
            </view>
          </view>
        </block>
        <!--同城配送end-->
      </view>
      <!--不配送区域start-->
      <block v-if="goods.citys.citys.length>0 && goods.type !=5 && goods.isverify!=2">
        <view class="fui-cell-group fui-cell-click  fui-sale-group" style="margin-top:0" id="city-picker" @tap="cityPicker" data-class="city-picker" :data-tap="active">
          <view class="fui-cell">
            <view class="fui-cell-text">{{ goods.citys.onlysent == 0 ? '不':'只' }}配送区域:
              <block v-for="(item, index) in goods.citys.citys" :key="index">{{item}}</block>
            </view>
            <view class="fui-cell-remark"></view>
          </view>
        </view>
      </block>
      <!--不配送区域end-->
      <!--标签start-->
      <block v-if="goods.hasServices || goods.labelname">
        <view class="fui-cell-group fui-option-group" style="margin-top:0">
          <view class="goods-label-demo">
            <view :class="'goods-label-list goods-label-style' + labels.style+1" style="background:#fafafa">
              <block v-for="(item, index) in labels.list" :key="index">
                <span>
                  <icon class="icox icox-duihao1" v-if="labels.style<2"></icon>
                  <text>{{item}}</text>
                </span>
              </block>
              <view style="clear: both;"></view>
            </view>
          </view>
        </view>
      </block>
      <!--标签end-->
      <!--购买数量start-->
      <block v-if="goods.canbuy">
        <view class="fui-cell-group fui-cell-click" @tap="selectPicker" :data-id="goods.id" data-class="select-picker" :data-tap="active" data-buytype="select">
          <view class="fui-cell" v-if="!isSelected">
            <view class="fui-cell-text option-selector">请选择
              <block v-if="goods.spec_titles">{{goods.spec_titles}}等</block>
              <block v-else>数量</block>
            </view>
            <view class="fui-cell-remark"></view>
          </view>
          <view class="fui-cell" v-else>
            <view class="fui-cell-info">已选：数量x{{total}} {{specsTitle}}</view>
          </view>
        </view>
      </block>
      <block v-else>
        <view class="fui-cell-group fui-cell-click">
          <view class="fui-cell">
            <view class="fui-cell-text">
              <block v-if="goods.userbuy==0">您已经超出最大{{goods.usermaxbuy}}件购买量</block>
              <block v-else-if="goods.levelbuy==0">您当前会员等级没有购买权限</block>
              <block v-else-if="goods.groupbuy==0">您所在的用户组没有购买权限</block>
              <block v-else-if="goods.timebuy==-1">未到开始抢购时间!</block>
              <block v-else-if="goods.timebuy==1">抢购时间已经结束!</block>
              <block v-else-if="goods.total<=0">商品已经售罄!</block>
            </view>
          </view>
        </view>
      </block>
      <!--购买数量end-->
      <!--套餐start-->
      <view class="fui-cell-group fui-comment-group" v-if="packagegoods">
        <navigator :url="'/pages/goods/package/index?id=' + packagegoodsid">
          <view class="fui-cell fui-cell-click">
            <view class="fui-cell-text desc">{{packageList.title}}</view>
            <text class="fui-cell-text desc label" :url="'/pages/goods/package/index?id=' + packagegoodsid">更多套餐</text>
            <view class="fui-cell-remark"></view>
          </view>
        </navigator>
        <view id="package">
          <navigator id="package_list" hover-class="none" :style="'width:' + packageList.goods.length*220-20 + 'rpx'" :url="'/pages/goods/package/detail/index?id=' + packageList.id">
            <view class="package-goods package-goods3" v-for="(item, index) in packageList.goods" :key="index">
              <image class="package-goods-img" :src="item.thumb"></image>
              <p>{{item.title}}</p>
              <text class="icox icox-tianjiazhuanhuan"></text>
            </view>
          </navigator>
        </view>
      </view>
      <!--套餐end-->
      <!--全部商品start-->
      <view class="fui-cell-group fui-shop-group">
        <navigator class="fui-list" open-type="switchTab" url="/pages/index/index">
          <view class="fui-list-media">
            <image :src="goods.shopdetail.logo"></image>
          </view>
          <view class="fui-list-inner">
            <view class="title">{{goods.shopdetail.shopname}}<text class="title-wel">进店逛逛</text></view>
            <block v-if="goods.shopdetail.description">
              <view class="subtitle">{{goods.shopdetail.description}}</view>
            </block>
          </view>
        </navigator>
      </view>
      <!--全部商品end-->
      <!--购买后可见-->
      <view class="fui-cell-group" v-if="goods.buycontentshow>0">
        <view class="fui-cell" style="display: block;">
          <component :wxParseData="wxParseData_buycontent.nodes" :is="wxParse"></component>
        </view>
      </view>
      <!--购买后可见-->
    </view>

    <!--头部tab start-->
    <view class="fui-cell-group" v-if="goods.params.length > 0 || (goods.getComments && commentObj.list.length > 0)">
      <view class="title">
        <view id="tab" class="fui-tab fui-tab-danger">
          <view :class="'item ' + info" @tap="goodsTab" data-tap="info">商品详情</view>
          <block v-if="goods.params.length > 0">
            <view :class="'item ' + para" @tap="goodsTab" data-tap="para">参数</view>
          </block>
          <block v-if="goods.getComments && commentObj.list.length > 0">
            <view :class="'item ' + comment" @tap="goodsTab" data-tap="comment">评价</view>
          </block>
        </view>
      </view>
    </view>
    <!--头部tab end-->
    <view class="fui-cell-group" v-if="goods.params.length == 0&& !(goods.getComments && commentObj.list.length > 0)">
      <view class="fui-list">
        <view class="title">商品详情</view>
      </view>
    </view>
    <!--商品详情start-->
    <view :class="'goods-detail-info ' + info" style="padding:0 8rpx;box-sizing: border-box;">
      <view class="wxParse" style="overflow: hidden;">
        <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
      </view>
      <view class="bottom-image">
        <image v-for="(item, index) in bottomFixedImageUrls" :key="index" mode="widthFix" :src="item"></image>
      </view>
    </view>
    <!--商品详情end-->
    <view :class="'goods-detail-comment ' + comment">
      <view class="fui-icon-group col-5 ">
        <view v-for="(item, index) in stararr" :key="index" class="fui-icon-col" data-level="item" @tap="comentTap" :data-type="index+1">
          <view :class="(commentObjTab==index+1?'text-danger':'')">{{index==0?'全部':''}}{{index==1?'好评':''}}{{index==2?'中评':''}}{{index==3?'差评':''}}{{index==4?'晒图':''}}
            <view :class="'count ' + (commentObjTab==index+1?'text-danger':'')">{{commentObj.count[item]}}</view>
          </view>
        </view>
      </view>
      <view class="fui-loading" v-if="loading">
        <view class="icon"></view>
        <view class="text">正在加载</view>
      </view>
      <view class="container" id="comments-all">
        <view class="fui-cell-group fui-comment-group">
          <block v-for="(item, index) in commentList" :key="index">
            <view class="fui-cell">
              <view class="fui-cell-text comment ">
                <view class="info head">
                  <view class="img">
                    <image style="width:50rpx;height:50rpx" :src="item.headimgurl"></image>
                  </view>
                  <view class="nickname">{{item.nickname}}</view>
                  <view class="date">{{item.createtime}}</view>
                  <view class="star star1">
                    <text v-for="(item2, index2) in stararr" :key="index2" :class="(item.level>=idx2+1?'shine':'')">★</text>
                  </view>
                </view>
                <view class="remark">{{item.content}}</view>
                <view class="remark img">
                  <block v-for="(image, index2) in item.images" :key="index2">
                    <view class="img">
                      <image :src="image" @tap="preview" mode="widthFix" :data-src="image" :data-urls="item.images"></image>
                    </view>
                  </block>
                </view>
                <block v-if="item.reply_content">
                  <view class="reply-content" style="background:#EDEDED;">
                    掌柜回复：{{item.reply_content}}
                    <view class="remark img">
                      <block v-for="(replyImage, index2) in item.reply_images" :key="index2">
                        <view class="img">
                          <image :src="replyImage" mode="widthFix"></image>
                        </view>
                      </block>
                    </view>
                  </view>
                </block>
                <block v-if="item.append_content && item.replychecked==0">
                  <view class="remark reply-title">用户追加评价</view>
                  <view class="remark">{{item.append_content}}</view>
                </block>
                <block v-if="item.append_reply_content">
                  <view class="reply-content" style="background:#EDEDED;">
                    掌柜回复：{{item.append_reply_content}}
                    <view class="remark img">
                      <block v-for="(appendReplyImage, index2) in item.append_reply_images" :key="index2">
                        <view class="img">
                          <image :src="appendReplyImage"></image>
                        </view>
                      </block>
                    </view>
                  </view>
                </block>
              </view>
            </view>
          </block>
        </view>
        <view class="fui-cell-group fui-comment-group"></view>
      </view>
      <view class="content-empty" :style="(commentEmpty?'display:block':'display:none')">暂时没有任何评价</view>
    </view>


    <!--版权  店铺装修 -->
    <include v-if="copyright" src="/pages/diy/template/tpl_copyright.wxml"></include>

    <!--参数start-->
    <view :class="'goods-detail-para ' + para">
      <view class="fui-cell-group">
        <block v-for="(item, index) in goods.params" :key="index">
          <view class="fui-cell">
            <view class="fui-cell-label">{{item.title}}</view>
            <view class="fui-cell-info overflow">{{item.value}}</view>
          </view>
        </block>
      </view>
    </view>
    <!--参数end-->
    <view :class="'fui-mask ' + active" @tap="emptyActive"></view>
    <!--配送区域 start-->
    <block v-if="tempname=='city-picker'">
      <view :class="'fui-modal picker-modal ' + slider + ' ' + iphonexnavbar">
        <view class="city-picker">
          <view class="fui-cell-group fui-sale-group" style="margin-top:0;">
            <view class="fui-cell">
              <view class="fui-cell-text dispatching">
                不配送区域:
                <view class="dispatching-info">
                  <block v-for="(item, index) in goods.citys" :key="index">
                    <i>{{item}}</i>
                  </block>
                </view>
              </view>
            </view>
            <view class="btn btn-danger block" @tap="emptyActive">确定</view>
          </view>
        </view>
      </view>
    </block>
    <!--配送区域 end-->
    <include src="/pages/common/goods-picker.wxml"></include>
    <!--选择 end-->

  </view>
  <!--商品end-->
  <!--周期购日期选择  -->
  <view style="position: fixed; bottom: 98rpx;left: 0;right: 0;z-index: 1001;">
    <include src="/pages/date/date.wxml"></include>
  </view>

  <include src="/pages/common/coupon-picker.wxml"></include>
  <include src="/pages/common/gift-picker.wxml"></include>
  <include src="/pages/common/city-picker.wxml"></include>
  <include src="/pages/common/act-picker.wxml"></include>
  <view class="empty_f"></view>
  <view :class="'fui-mask ' + ( showPicker?'show':'')" style="z-index: 1500"></view>


  <!--周期购  -->
  <block v-if="cycledate">
    <view :class="'fui-navbar bottom-buttons ' + iphonexnavbar" style="z-index: 1001">
      <view class="nav-item btn cartbtn" style="background: #ccc;" @tap="syclecancle" :data-tap="active" data-buytype="cart">取消</view>
      <view class="nav-item btn buybtn" @tap="sycleconfirm" :data-tap="active" data-buytype="buy">确定</view>
    </view>
  </block>
  <!--周期购  -->

  <view v-if="usediypage == false">
    <!--购买start-->
    <block v-if="goods.canbuy">
      <view :class="'fui-navbar bottom-buttons ' + iphonexnavbar">
        <view v-if="!limits" class="nav-item favorite-item" @tap="favorite">
          <view :class="'icox ' + ( goods.isfavorite?'icox-likefill':'icox-like')"></view>
          <view class="label">关注</view>
        </view>
        <view :class="'nav-item favorite-item ' + ( goods.isfavorite?'active':'')" @tap="favorite" :data-isfavorite="( goods.isfavorite?1:0 )" v-if="goods.customer!=1 && limits">
          <view :class="'icox ' + ( goods.isfavorite?'icox-likefill':'icox-like')"></view>
          <view class="label">关注</view>
        </view>
        <button class="nav-item customer-item" open-type="contact" v-if="goods.customer==1 && limits" session-from="weapp" show-message-card="true">
          <view class="icox icox-customerservice"></view>
          <view class="label">客服</view>
        </button>
        <navigator class="nav-item external" :url="'/pages/index/index?merchid=' + goods.merchid" open-type="switchTab">
          <view class="icox icox-shop1"></view>
          <view class="label">店铺</view>
        </navigator>
        <navigator class="nav-item cart-item" id="menucart" url="/pages/member/cart/index" open-type="switchTab">
          <block v-if="goods.cartcount && limits">
            <view :class="'badge ' + (goods.cartount<=0?'out':'in')">{{goods.cartcount}}</view>
          </block>
          <view class="icox icox-cart1"></view>
          <view class="label">购物车</view>
        </navigator>
        <view v-if="goods.canAddCart && goods.type != 9" class="nav-item btn cartbtn" @tap="selectPicker" :data-tap="active" :data-id="goods.id" data-buytype="cart">加入购物车</view>
        <view v-if="!goods.access_time && !goods.timeout" class="nav-item btn buybtn" @tap="selectPicker" :data-tap="active" data-buytype="buy" :data-id="goods.id">立刻购买</view>
        <view v-if="goods.access_time" class="nav-item btn buybtn" @tap="selectPicker" :data-tap="active" data-buytype="buy" :data-id="goods.id" data-time="access_time" data-timeout="false">立刻购买</view>
        <view v-if="goods.timeout" class="nav-item btn buybtn" @tap="selectPicker" :data-tap="active" data-buytype="buy" :data-id="goods.id" data-time="timeout" data-timeout="false">立刻购买</view>
      </view>
    </block>

    <!--购买end-->
  </view>

  <view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')">
    <view class="text">{{FoxUIToast.text}}</view>
  </view>
  <view class="nav-mask" :style="(nav_mask2?'display:block':'')"></view>
  <!--快捷导航start-->
  <view class="nav-model">
    <view :class="'nav-home ' + (nav_mask2&&navbar==1?'out2':'') + ' ' + (nav_mask&&navbar==0?'out':'')">
      <span>商城首页</span>
      <navigator class="icox icox-homepage" url="/pages/index/index" open-type="switchTab"></navigator>
    </view>
    <view v-if="limits" :class="'nav-member ' + (nav_mask2&&navbar==1?'out2':'') + ' ' + (nav_mask&&navbar==0?'out':'')">
      <span>个人中心</span>
      <navigator class="icox icox-people" url="/pages/member/index/index" open-type="switchTab"></navigator>
    </view>
    <view v-if="limits&&goods.customer==1" :class="'nav-collect ' + (nav_mask2&&navbar==1?'out2':'') + ' ' + (nav_mask&&navbar==0?'out':'')" @tap="favorite" :data-isfavorite="( goods.isfavorite?1:0 )">
      <span>关注商品</span>
      <navigator :class="'icox ' + ( goods.isfavorite?'icox-collection_fill':'icox-collection' )"></navigator>
    </view>
    <view v-if="navbar==0" :class="'nav ' + (nav_mask?'icox icox-close':'')" @tap="nav">
      <text v-if="!nav_mask">快捷</text>
      <text v-if="!nav_mask">导航</text> </view>
    <view v-if="navbar==1" :class="'nav nav2 ' + (nav_mask2?'icox icox-close':'')" @tap="nav2">
      <text v-if="!nav_mask2">快捷</text>
      <text v-if="!nav_mask2">导航</text> </view>
  </view>
  <!--快捷导航end-->

  <!--活动详情弹层-->


  <!--未授权弹窗-->
  <view class="model" v-if="modelShow">
    <view class="inner1">
      <view class="title">用户未授权</view>
      <view class="image">
        <image :src="imgUrl + 'plugin/app/static/images/wxapp/shouquan.png'"></image>
      </view>
      <view class="subtitle">您需要先开启【用户信息】，才能使用此功能哦~</view>
      <!-- <view class="subtitle">您需要先允许【用户授权】，才能进行后续操作哦~</view> -->
      <view class="model-btns">
        <view class="cancel" @tap="cancelclick">取消</view>
        <view class="confirm" @tap="confirmclick">去设置</view>
        <!-- <button bindgetuserinfo="userinfo" bindtap="cancelclick" open-type="getUserInfo">去授权</button> -->
      </view>
    </view>
  </view>
  <view class="phone" @tap="phone" v-if="!nav_mask&&!nav_mask2&&goods.phone">
    <text class="icox icox-call"></text>
  </view>
</view>
<view class="goods-layer" v-if="goods_hint_show">
  <view class="inner">
    <view class="goods-content">
      <view class="goods-title">温馨提示</view>
      <view class="goods-con">{{ goods.hint }}</view>
    </view>
    <view v-if="goods.access_time" class="goods-btn buybtn" :data-tap="active" data-buytype="buy" :data-id="goods.id" data-time="access_time" data-timeout="true" @tap="selectPicker">
      确定
    </view>
    <view v-if="goods.timeout" class="goods-btn buybtn" :data-tap="active" data-buytype="buy" :data-id="goods.id" data-time="timeout" data-timeout="true" @tap="selectPicker">
      确定
    </view>
    <view v-if="!goods.access_time && !goods.timeout" :data-tap="active" data-buytype="buy" :data-id="goods.id" class="goods-btn buybtn" :data-time="( goods.access_time ? access_time : '')" data-timeout="true" @tap="selectPicker">
      确定
    </view>
  </view>
</view>
</view>
</template>

<script>
/**
 *
 * index.js
 *
 * @create 2017-01-04
 * @author 咖啡
 *
 *
 */
var app = getApp();
var core = app.requirejs('core');
var icons = app.requirejs('icons');
var foxui = app.requirejs('foxui');
var diypage = app.requirejs('biz/diypage');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var $ = app.requirejs('jquery');
var parser = app.requirejs('wxParse/wxParse');
var hasOption = 0;
var selectdate = app.requirejs('biz/selectdate');

export default {
  data() {
    return {
      diypages: {},
      usediypage: false,
      specs: [],
      options: [],
      icons: app.requirejs('icons'),
      goods: {},
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
      circular: true,
      play: "/static/images/video_play.png",
      mute: "/static/images/icon/mute.png",
      voice: "/static/images/icon/voice.png",
      //pick
      active: '',
      slider: '',
      tempname: '',
      info: 'active',
      preselltimeend: '',
      presellsendstatrttime: '',
      advWidth: 0,
      dispatchpriceObj: 0,
      now: parseInt(Date.now() / 1000),
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      timer: 0,
      discountTitle: '',
      istime: 1,
      istimeTitle: '',
      isSelected: false,
      params: {},
      total: 1,
      optionid: 0,
      audios: {},
      audiosObj: {},
      defaults: {
        id: 0,
        merchid: 0
      },
      buyType: '',
      pickerOption: {},
      specsData: [],
      specsTitle: '',
      canBuy: '',
      diyform: {},
      showPicker: false,
      showcoupon: false,
      pvalOld: [0, 0, 0],
      pval: [0, 0, 0],
      areas: [],
      noArea: true,
      commentObj: {},
      commentObjTab: 1,
      loading: false,
      commentEmpty: false,
      commentPage: 1,
      commentTotal: 1,
      commentLevel: 'all',
      commentList: [],
      closeBtn: false,
      soundpic: true,
      animationData: {},
      uid: '',
      stararr: ['all', 'good', 'normal', 'bad', 'pic'],
      nav_mask: false,
      nav_mask2: false,
      nav: 0,
      giftid: '',
      limits: true,
      modelShow: false,
      showgoods: true,
      //秒杀
      timer: 0,
      lasttime: 0,
      hour: '-',
      min: '-',
      sec: '-',
      // 以下 周期购
      currentDate: "",
      dayList: '',
      currentDayList: '',
      currentObj: '',
      currentDay: '',
      checkedDate: '',
      showDate: '',
      scope: '',
      goods_hint_show: false,
      presellisstart: 0,
      advHeight: 1
    };
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.pauseOther();
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    this.pauseOther();
  },
  onHide: function () {
    this.setData({
      closeBtn: false
    });
  },
  onShareAppMessage: function () {
    this.setData({
      closeBtn: false
    });
    return core.onShareAppMessage('/pages/goods/detail/index?id=' + this.options.id, this.goods.title);
  },
  onShow: function () {
    var $this = this; // var specs = [];
    // var options = [];

    var isIpx = app.getCache('isIpx');

    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      });
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      });
    }

    wx.getStorage({
      key: 'mydata',
      success: function (res) {
        wx.removeStorage({
          key: 'mydata',
          success: function (res) {}
        });
        $this.getDetail(res.data);
        wx.pageScrollTo({
          scrollTop: 0
        });
      }
    });
    /*获取授权*/

    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        $this.setData({
          limits: limits
        });
      }
    });
  },
  onLoad: function (options) {
    var $this = this;
    $this.setData({
      imgUrl: app.globalData.approot
    });
    core.get('black', {}, function (res) {
      if (res.isblack) {
        wx.showModal({
          title: '无法访问',
          content: '您在商城的黑名单中，无权访问！',
          success: function (res) {
            if (res.confirm) {
              this.close();
            }

            if (res.cancel) {
              this.close();
            }
          }
        });
      }
    });
    diypage.get(this, 'goodsdetail', function (res) {
      var diypage = res.diypage.items;

      for (var i in diypage) {
        if (diypage[i].id == 'copyright') {
          $this.setData({
            copyright: diypage[i]
          });
        }
      }
    });
    options = options || {}; // 处理扫码scene

    var scene = decodeURIComponent(options.scene);

    if (!options.id && scene) {
      var sceneObj = core.str2Obj(scene);
      options.id = sceneObj.id;

      if (sceneObj.mid) {
        options.mid = sceneObj.mid;
      }
    }

    this.setData({
      id: options.id
    });
    app.url(options);
    wx.getSystemInfo({
      success: function (result) {
        $this.setData({
          windowWidth: result.windowWidth,
          windowHeight: result.windowHeight
        });
      }
    });
    $this.getDetail(options);
    $this.setData({
      uid: options.id,
      options: options,
      success: true,
      cover: true,
      showvideo: true
    });
    wx.getSystemInfo({
      success: function (result) {
        $this.setData({
          advWidth: result.windowWidth
        });
      }
    });
    setTimeout(function () {
      $this.setData({
        areas: app.getCache("cacheset").areas
      });
    }, 3000);
  },
  //上拉加载下一页评论
  onReachBottom: function () {
    var $this = this;

    if ($this.data.commentTotal <= 10) {
      return false;
    }

    var commentType = $this.data.commentObjTab;
    var objType = '';

    if (commentType == 1) {
      objType = 'all';
    } else if (commentType == 2) {
      objType = 'good';
    } else if (commentType == 3) {
      objType = 'normal';
    } else if (commentType == 4) {
      objType = 'bad';
    } else if (commentType == 5) {
      objType = 'pic';
    }

    $this.setData({
      loading: true
    }); // var commentPage = $this.data.commentPage;
    // if (commentPage == 1) {
    //   commentPage = 2;
    // }

    core.get('goods/get_comment_list', {
      'id': $this.data.options.id,
      'level': objType,
      'page': $this.data.commentPage
    }, function (list) {
      if (list.error == 0) {
        $this.setData({
          loading: false
        });

        if (list.list.length > 0) {
          $this.setData({
            commentPage: $this.data.commentPage + 1,
            commentTotal: list.total,
            commentList: $this.data.commentList.concat(list.list)
          });
        }
      }
    });
  },
  components: {},
  props: {},
  methods: {
    //商品详情轮播图按照第一张图片显示
    imageLoad: function (e) {
      let h = e.detail.height,
          w = e.detail.width,
          height = Math.floor(750 * h / w);

      if (h == w) {
        this.setData({
          advHeight: 750
        });
      } else {
        this.setData({
          advHeight: height
        });
      }
    },
    favorite: function (event) {
      app.checkAuth();
      var $this = this;
      var limits = $this.data.limits;

      if (limits) {
        var isfavorite = event.currentTarget.dataset.isfavorite ? 0 : 1;
        core.get('member/favorite/toggle', {
          'id': $this.data.options.id,
          'isfavorite': isfavorite
        }, function (ret) {
          if (ret.isfavorite) {
            $this.setData({
              'goods.isfavorite': 1
            });
          } else {
            $this.setData({
              'goods.isfavorite': 0
            });
          }
        });
      } else {// this.setData({ modelShow: true })
      }
    },

    /*购物车*/
    // menucart: function () {
    //   var $this = this;
    //   var limits = $this.data.limits;
    //   if (limits) {
    //     wx.switchTab({
    //       url: '/pages/member/cart/index'
    //     })
    //   } else {
    //     this.setData({ modelShow: true })
    //   }
    // },

    /*tab切换 */
    goodsTab: function (event) {
      var $this = this,
          tap = event.currentTarget.dataset.tap;

      if (tap == 'info') {
        this.setData({
          info: 'active',
          para: '',
          comment: ''
        });
      } else if (tap == 'para') {
        this.setData({
          info: '',
          para: 'active',
          comment: ''
        });
      } else if (tap == 'comment') {
        $this.setData({
          info: '',
          para: '',
          comment: 'active'
        });

        if ($this.data.commentList.length > 0) {
          $this.setData({
            loading: false
          });
          return;
        } else {
          $this.setData({
            loading: true
          });
        }

        core.get('goods/get_comment_list', {
          'id': $this.data.options.id,
          'level': $this.data.commentLevel,
          'page': $this.data.commentPage
        }, function (retlist) {
          if (retlist.list.length > 0) {
            // $this.setData({ loading: false, commentList: retlist.list, commentPage: retlist.page });
            $this.setData({
              loading: false,
              commentList: retlist.list,
              commentTotal: retlist.total,
              commentPage: retlist.page
            });
          } else {
            $this.setData({
              loading: false,
              commentEmpty: true
            });
          }
        });
      }
    },
    //评价列表事件
    comentTap: function (e) {
      var $this = this;
      var commentType = e.currentTarget.dataset.type;
      var objType = '';

      if (commentType == 1) {
        objType = 'all';
        $this.data.commentPage = 1;
      } else if (commentType == 2) {
        $this.data.commentPage = 1;
        objType = 'good';
      } else if (commentType == 3) {
        $this.data.commentPage = 1;
        objType = 'normal';
      } else if (commentType == 4) {
        $this.data.commentPage = 1;
        objType = 'bad';
      } else if (commentType == 5) {
        $this.data.commentPage = 1;
        objType = 'pic';
      }

      if (commentType != $this.data.commentObjTab) {
        //评价列表
        core.get('goods/get_comment_list', {
          'id': $this.data.options.id,
          'level': objType,
          'page': $this.data.commentPage
        }, function (retlist) {
          if (retlist.list.length > 0) {
            $this.setData({
              loading: false,
              commentList: retlist.list,
              commentTotal: retlist.total,
              commentPage: retlist.page,
              commentObjTab: commentType,
              commentEmpty: false
            });
          } // else {
          //   $this.setData({
          //     loading: false,
          //     commentList: retlist.list,
          //     commentPage: 1,
          //     commentObjTab: commentType,
          //     commentEmpty: true
          //   });
          // }

        });
      } else {
        return;
      }
    },
    // 评价图片点击预览
    preview: function (e) {
      wx.previewImage({
        current: e.currentTarget.dataset.src,
        // 当前显示图片的http链接
        urls: e.currentTarget.dataset.urls // 需要预览的图片http链接列表

      });
    },

    /* 获取商品详情 */
    getDetail: function (options) {
      var $this = this;
      var nowTime = parseInt(Date.now() / 1000);
      $this.setData({
        loading: true
      });
      core.get('goods/get_detail', {
        id: options.id
      }, function (result) {
        // 需要强转为浮点型的数据
        const needForceConvertToFloatData = ['marketprice', 'productprice']; // 处理价格比较的时候带有比较的不是浮点数，而是两个字符串出错的情况

        needForceConvertToFloatData.forEach(value => {
          if (typeof result.goods[value] != 'undefined') {
            result.goods[value] = parseFloat(result.goods[value]);
          }
        });

        if (result.error > 0) {
          $this.setData({
            show: true,
            showgoods: false
          });
          foxui.toast($this, result.message);
          setTimeout(function () {
            wx.navigateBack();
          }, 800);
        }

        var coupon = result.goods.coupons;
        var MaxHeight = result.goods.thumbMaxHeight;
        var MaxWidth = result.goods.thumbMaxWidth;
        var ratio = MaxWidth / MaxHeight; //轮播适配高度
        // wx.getSystemInfo({
        //   success: function (result) {
        //     var advHeight = result.windowWidth / ratio;
        //     $this.setData({
        //       advWidth: result.windowWidth,
        //       advHeight: advHeight
        //     });
        //   }
        // });

        $this.setData({
          coupon: coupon,
          coupon_l: coupon.length,
          packagegoods: result.goods.packagegoods,
          packagegoodsid: result.goods.packagegoods.goodsid,
          credittext: result.goods.credittext,
          activity: result.goods.activity,
          bottomFixedImageUrls: result.goods.bottomFixedImageUrls,
          //底部固定信息
          phonenumber: result.goods.phonenumber,
          showDate: result.goods.showDate,
          scope: result.goods.scope
        });

        if (result.goods.packagegoods) {
          $this.package();
        }

        parser.wxParse('wxParseData', 'html', result.goods.content, $this, '0');
        parser.wxParse('wxParseData_buycontent', 'html', result.goods.buycontent, $this, '0');
        $this.setData({
          show: true,
          goods: result.goods,
          minprice: result.goods.minprice,
          maxprice: result.goods.maxprice,
          preselltimeend: result.goods.preselltimeend,
          style: result.goods.labelstyle.style,
          navbar: result.goods.navbar,
          labels: result.goods.labels
        });

        if (result.goods.gifts && result.goods.gifts.length == 1) {
          $this.setData({
            giftid: result.goods.gifts[0].id
          });
        }

        wx.setNavigationBarTitle({
          title: result.goods.title || '商品详情'
        });
        hasOption = result.goods.hasoption;

        if ($.isEmptyObject(result.goods.dispatchprice) || typeof result.goods.dispatchprice == 'string') {
          $this.setData({
            dispatchpriceObj: 0
          });
        } else {
          $this.setData({
            dispatchpriceObj: 1
          });
        }
        /*促销start*/


        if (result.goods.isdiscount > 0 && result.goods.isdiscount_time >= nowTime) {
          clearInterval($this.data.timer);
          var timer = setInterval(function () {
            $this.countDown(0, result.goods.isdiscount_time);
          }, 1000);
          $this.setData({
            timer: timer
          });
        } else {
          $this.setData({
            discountTitle: '活动已结束'
          });
        }
        /*促销end*/

        /*限时购 start*/


        if (result.goods.istime > 0) {
          clearInterval($this.data.timer);
          var timer = setInterval(function () {
            $this.countDown(result.goods.timestart, result.goods.timeend, 'istime');
          }, 1000);
          $this.setData({
            timer: timer
          });
        }
        /*限时购 end*/

        /*预售 start*/


        if (result.goods.ispresell > 0) {
          var timer = setInterval(function () {
            if (result.goods.canbuy == 0) {
              $this.countDown(nowTime, result.goods.preselltimestart, 'istime');
            } else if (result.goods.canbuy == 1) {
              $this.countDown(nowTime, result.goods.preselltimeend, 'istime');
            }
          }, 1000);
          $this.setData({
            timer: timer,
            presellisstart: result.goods.presellisstart
          });
          $this.setData({
            preselltimeend: result.goods.preselltimeend || result.goods.preselltimeend.getMonth() + '月' + result.goods.preselltimeend || result.goods.preselltimeend.getDate() + '日 ' + result.goods.preselltimeend || result.goods.preselltimeend.getHours() + ':' + result.goods.preselltimeend || result.goods.preselltimeend.getMinutes() + ':' + result.goods.preselltimeend || result.goods.preselltimeend.getSeconds(),
            presellsendstatrttime: result.goods.presellsendstatrttime || result.goods.presellsendstatrttime.getMonth() + '月' + result.goods.presellsendstatrttime || result.goods.presellsendstatrttime.getDate() + '日'
          });
        }
        /*预售 end*/

        /*评价start*/


        if (result.goods.getComments > 0) {
          core.get('goods/get_comments', {
            'id': $this.data.options.id
          }, function (ret) {
            $this.setData({
              commentObj: ret
            });
          });
        }
        /*评价end*/

        /*全返*/


        if (result.goods.fullbackgoods) {
          $this.setData({
            fullbackgoods: result.goods.fullbackgoods
          });
        }

        var fullbackgoods = $this.data.fullbackgoods;

        if (fullbackgoods != undefined) {
          var maxfullbackratio = fullbackgoods.maxfullbackratio;
          var maxallfullbackallratio = fullbackgoods.maxallfullbackallratio;
          var maxfullbackratio = Math.round(maxfullbackratio);
          var maxallfullbackallratio = Math.round(maxallfullbackallratio);
          $this.setData({
            maxfullbackratio: maxfullbackratio,
            maxallfullbackallratio: maxallfullbackallratio
          });
        }

        if (result.goods.type == 9) {
          $this.setData({
            checkedDate: result.goods.nowDate
          });
          $this.show_cycelbuydate();
        }

        if (result.goods.seckillinfo) {
          $this.initSeckill(result.goods);
        }
      });
    },
    //秒杀时间初始化
    initSeckill: function (goods) {
      var $this = this;
      var status = parseInt(goods.seckillinfo.status);
      var starttime = goods.seckillinfo.starttime;
      var endtime = goods.seckillinfo.endtime;

      if (status != -1) {
        var lasttime = 0;
        var timer = 0;
        var approot = app.globalData.approot;
        wx.request({
          url: approot + 'map.json',
          success: function (x) {
            var currenttime = new Date(x.header.Date) / 1000;

            if (status == 0) {
              lasttime = endtime - currenttime;
            } else {
              lasttime = starttime - currenttime;
            }

            $this.setData({
              lasttime: lasttime
            });
            clearInterval($this.data.timer);
            $this.setTimer(goods.seckillinfo);
            timer = $this.setTimerInterval(goods.seckillinfo);
            $this.setData({
              timer: timer
            });
          }
        });
      }
    },
    setTimer: function (seckillinfo) {
      var $this = this;
      var lasttime = 0; //每十秒请求一次服务器，获取时间

      if (seckillinfo.status != -1) {
        if (parseInt($this.data.lasttime) % 10 == 0) {
          var status = parseInt(seckillinfo.status);
          var starttime = seckillinfo.starttime;
          var endtime = seckillinfo.endtime;

          if (status != -1) {
            var approot = app.globalData.approot;
            wx.request({
              url: approot + 'map.json',
              success: function (x) {
                var currenttime = new Date(x.header.Date) / 1000;

                if (status == 0) {
                  lasttime = endtime - currenttime;
                } else {
                  lasttime = starttime - currenttime;
                }

                $this.setData({
                  lasttime: lasttime
                });
              }
            });
          }
        }
      }

      lasttime = parseInt($this.data.lasttime) - 1;
      var times = $this.formatSeconds(lasttime);
      $this.setData({
        lasttime: lasttime,
        hour: times.hour,
        min: times.min,
        sec: times.sec
      });

      if (lasttime <= 0) {
        $this.onLoad();
      }
    },
    setTimerInterval: function (seckillinfo) {
      var $this = this;
      return setInterval(function () {
        $this.setTimer(seckillinfo);
      }, 1000);
    },
    formatSeconds: function (value) {
      var theTime = parseInt(value);
      var theTime1 = 0;
      var theTime2 = 0;

      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);

        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }

      return {
        'hour': theTime2 < 10 ? '0' + theTime2 : theTime2,
        'min': theTime1 < 10 ? '0' + theTime1 : theTime1,
        'sec': theTime < 10 ? '0' + theTime : theTime
      };
    },

    /*倒计时js start
     timestart----开始时间
     timeend----结束时间
     type-------类型
     */
    countDown: function (timestart, timeend, type) {
      var now = parseInt(Date.now() / 1000);
      var endDate = timestart > now ? timestart : timeend;
      var leftTime = endDate - now;
      var leftsecond = parseInt(leftTime);
      var day = Math.floor(leftsecond / (60 * 60 * 24));
      var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
      var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
      var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
      var time = [day, hour, minute, second];
      this.setData({
        time: time
      });

      if (type = 'istime') {
        var istimeTitle = '';

        if (timestart > now) {
          istimeTitle = '距离限时购开始';
        } else if (timestart <= now && timeend > now) {
          istimeTitle = '距离限时购结束';
        } else {
          istimeTitle = '活动已经结束，下次早点来~';
          this.setData({
            istime: 0
          });
        }

        this.setData({
          istimeTitle: istimeTitle
        });
      }
    },
    //不配送区域picker
    cityPicker: function (event) {
      var $this = this;
      var active = event.currentTarget.dataset.tap;
      wx.navigateTo({
        url: '/pages/goods/region/index?id=' + $this.data.goods.id + '&region=' + $this.data.goods.citys.citys + '&onlysent=' + $this.data.goods.citys.onlysent
      });
    },
    //赠品弹层
    giftPicker: function () {
      this.setData({
        active: 'active',
        gift: true
      });
    },
    //优惠券picker
    couponPicker: function () {
      this.setData({
        active: 'active',
        showcoupon: true
      });
    },
    couponrecived: function (e) {
      var id = e.currentTarget.dataset.id;
      var $this = this;
      core.post('goods.pay_coupon', {
        id: id
      }, function (result) {
        if (result.error == 0) {
          $this.setData({
            showcoupon: false,
            active: ''
          });
          foxui.toast($this, "已领取");
        } else {
          foxui.toast($this, result.message);
        }
      });
    },
    // 购买picker
    selectPicker: function (e) {
      app.checkAuth();
      var $this = this;
      var timeType = e.currentTarget.dataset.time;
      var timeOut = e.currentTarget.dataset.timeout;
      var limits = $this.data.limits;

      if (!limits) {
        // $this.setData({ modelShow: true })
        return;
      }

      if (timeType == 'timeout' || timeType == 'access_time') {
        if (timeOut == 'false') {
          $this.setData({
            goods_hint_show: true
          });
          return;
        } else if (timeOut == 'true') {
          if (timeType == 'access_time') {
            $this.setData({
              goods_hint_show: false
            });
            var goodslist = 'goodsdetail';
            goodspicker.selectpicker(e, $this, goodslist);
            return;
          }

          if (timeType == 'timeout') {
            $this.setData({
              goods_hint_show: false
            });
            return;
          }
        }
      }

      var goodslist = 'goodsdetail';
      goodspicker.selectpicker(e, $this, goodslist);
    },
    // 选规格
    specsTap: function (event) {
      var $this = this;
      goodspicker.specsTap(event, $this);
    },
    //关闭pickerpicker
    emptyActive: function () {
      this.setData({
        active: '',
        slider: 'out',
        tempname: '',
        showcoupon: false,
        gift: false,
        cycledate: false
      });
    },
    // 立即购买
    buyNow: function (event) {
      var $this = this;
      goodspicker.buyNow(event, $this, "goods_detail");
    },
    //加入购物车
    getCart: function (event) {
      var $this = this;
      goodspicker.getCart(event, $this);
    },
    select: function () {
      var $this = this;
      var optionid = $this.data.optionid;
      var diydata = $this.data.diyform; //是否有规格

      if (hasOption > 0 && optionid == 0) {
        foxui.toast($this, "请选择规格");
        return;
      }

      this.setData({
        active: '',
        slider: 'out',
        isSelected: true,
        tempname: ''
      });
    },
    //数量输入绑定事件
    inputNumber: function (e) {
      var $this = this;
      goodspicker.inputNumber(e, $this);
    },
    number: function (e) {
      var $this = this;
      goodspicker.number(e, $this);
    },
    show_cycelbuydate: function () {
      var $this = this;
      /*周期购时间选择器初始化*/

      var currentObj = selectdate.getCurrentDayString(this, $this.data.showDate);
      var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      $this.setData({
        currentObj: currentObj,
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日 ' + week[currentObj.getDay()],
        currentYear: currentObj.getFullYear(),
        currentMonth: currentObj.getMonth() + 1,
        currentDay: currentObj.getDate(),
        initDate: Date.parse(currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate()),
        checkedDate: Date.parse(currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate()),
        maxday: $this.data.scope //可选的天数

      });
    },
    package: function () {
      var $this = this;
      core.get('package.get_list', {
        goodsid: this.packagegoodsid
      }, function (result) {
        $this.setData({
          packageList: result.list[0]
        });
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
      return diyform.onConfirm(this, e);
    },
    getIndex: function (str, areas) {
      return diyform.getIndex(str, areas);
    },
    showpic: function () {
      this.setData({
        showpic: true,
        cover: false,
        showvideo: false
      });
      this.videoContext = wx.createVideoContext('myVideo');
      this.videoContext.pause();
    },
    showvideo: function () {
      this.setData({
        showpic: false,
        showvideo: true
      });
      this.videoContext = wx.createVideoContext('myVideo');
      this.videoContext.play();
    },
    startplay: function () {
      this.setData({
        cover: false
      });
      this.videoContext = wx.createVideoContext('myVideo');
      this.videoContext.play();
    },
    bindfullscreenchange: function (e) {
      if (e.detail.fullScreen == true) {
        this.setData({
          success: false
        });
      } else {
        this.setData({
          success: true
        });
      }
    },
    phone: function () {
      var phoneNumber = this.phonenumber + '';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },

    /*分享生成海报*/
    sharePoster: function () {
      wx.navigateTo({
        url: '/pages/goods/poster/poster?id=' + this.uid
      });
    },

    /*分享弹层上的关闭*/
    closeBtn: function () {
      this.setData({
        closeBtn: false
      });
    },

    /*点击分享*/
    showshade: function () {
      app.checkAuth();
      this.setData({
        closeBtn: true
      });
    },
    nav: function () {
      this.setData({
        nav_mask: !this.nav_mask
      });
    },
    nav2: function () {
      this.setData({
        nav_mask2: !this.nav_mask2
      });
    },
    changevoice: function () {
      if (this.sound) {
        this.setData({
          sound: false,
          soundpic: true
        });
      } else {
        this.setData({
          sound: true,
          soundpic: false
        });
      }
    },
    radioChange: function (e) {
      this.setData({
        giftid: e.currentTarget.dataset.giftgoodsid,
        gift_title: e.currentTarget.dataset.title
      });
    },

    /*活动弹层*/
    activityPicker: function () {
      var $this = this;
      $this.setData({
        fadein: 'in'
      });
    },
    actOutPicker: function () {
      var $this = this;
      $this.setData({
        fadein: ''
      });
    },

    /*顶部提示授权*/
    hintclick: function () {
      wx.openSetting({
        success: function (res) {}
      });
    },

    /*用户授权-取消*/
    cancelclick: function () {
      this.setData({
        modelShow: false
      });
    },

    /*用户授权-去设置*/
    confirmclick: function () {
      this.setData({
        modelShow: false
      });
      wx.openSetting({
        success: function (res) {}
      });
    },

    /*同城配送*/
    sendclick: function () {
      wx.navigateTo({
        url: '/pages/map/index'
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
    play: function (e) {
      var item_id = e.target.dataset.id;
      var innerAudioContext = this.audiosObj[item_id] || false;

      if (!innerAudioContext) {
        innerAudioContext = wx.createInnerAudioContext('audio_' + item_id);
        var audiosObj = this.audiosObj;
        audiosObj[item_id] = innerAudioContext;
        this.setData({
          audiosObj: audiosObj
        });
      }

      var $this = this;
      innerAudioContext.onPlay(() => {
        var Time = setInterval(function () {
          var width = innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%';
          var minute = Math.floor(Math.ceil(innerAudioContext.currentTime) / 60); //分

          var second = (Math.ceil(innerAudioContext.currentTime) % 60 / 100).toFixed(2).slice(-2); //秒

          var seconds = Math.ceil(innerAudioContext.currentTime);
          var audioicon = '';

          if (minute < 10) {
            minute = "0" + minute;
          }

          var time = minute + ":" + second;
          var audios = $this.data.audios;
          audios[item_id].audiowidth = width;
          audios[item_id].Time = Time;
          audios[item_id].audiotime = time;
          audios[item_id].seconds = seconds;
          $this.setData({
            audios: audios
          });
        }, 1000);
      });
      var src = e.currentTarget.dataset.audio;
      var time = e.currentTarget.dataset.time;
      var pausestop = e.currentTarget.dataset.pausestop;
      var loopplay = e.currentTarget.dataset.loopplay;

      if (loopplay == 0) {
        innerAudioContext.onEnded(res => {
          audios[item_id].status = false;
          $this.setData({
            audios: audios
          });
        });
      }

      var audios = $this.data.audios;

      if (!audios[item_id]) {
        audios[item_id] = {};
      }

      if (innerAudioContext.paused && time == 0) {
        innerAudioContext.src = src;
        innerAudioContext.play();

        if (loopplay == 1) {
          innerAudioContext.loop = true;
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else if (innerAudioContext.paused && time > 0) {
        innerAudioContext.play();

        if (pausestop == 0) {
          innerAudioContext.seek(time);
        } else {
          innerAudioContext.seek(0);
        }

        audios[item_id].status = true;
        $this.pauseOther(item_id);
      } else {
        innerAudioContext.pause();
        audios[item_id].status = false;
      }

      $this.setData({
        audios: audios
      });
    },
    pauseOther: function (item_id) {
      var $this = this;
      $.each(this.audiosObj, function (id, obj) {
        if (id == item_id) {
          return;
        }

        obj.pause();
        var audios = $this.data.audios;

        if (audios[id]) {
          audios[id].status = false;
          $this.setData({
            audios: audios
          });
        }
      });
    },
    navigate: function (e) {
      var url = e.currentTarget.dataset.url;
      var phone = e.currentTarget.dataset.phone;
      var appid = e.currentTarget.dataset.appid;
      var appurl = e.currentTarget.dataset.appurl;

      if (url) {
        wx.navigateTo({
          url: url,
          fail: function () {
            wx.switchTab({
              url: url
            });
          }
        });
      }

      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        });
      }

      if (appid) {
        wx.navigateToMiniProgram({
          appId: appid,
          path: appurl
        });
      }
    },
    close: function () {
      app.globalData.flag = true;
      wx.reLaunch({
        url: '../index/index'
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
/**
 * 
 * goods.detail.index.js
 * 
 * @create 2017-01-17
 * @author 咖啡 
 * 
 * 
 */
 @import "../../date/date.css";
 @import "../../common/city-picker.css";
 @import "../../../static/css/diypage.css"; 
 @import "../../custom/index.css"; 
.picker-modal{height:auto;}
.goods-detail-info{width:100%;display: none;margin-top: 20rpx;}
.goods-detail-goods{width:100%;}
.goods-detail-para{width:100%;display: none;}
.goods-detail-comment{width:100%;display: none;margin-top: 20rpx;}
.goods-detail-info.active,.goods-detail-para.active,.goods-detail-comment.active{display:block;background: #fff;}
/* .index-adcs-sqiper swiper-item{background-position: center center;background-repeat: no-repeat;background-size: cover;} */
.index-adcs-sqiper swiper-item{background-position:center;background-repeat: no-repeat;background-size:contain;} 
.goodsadvimg{width:100%;height:100%;opacity: 1;}
.goods-bar{padding-top:84rpx;}
.fui-tab::after{border:none;}
.fui-tab-o, .fui-tab{margin-bottom: 0}
.comment_all{
    font-size: 27rpx
}
.comment_all .count{
    margin-top: 6rpx
}
.goods-detail-goods{
 padding-bottom: 100rpx;
 overflow: hidden;

}
.title-wel{
  float:right;
  margin-right: 10px;
}
.fui-label.fui-label-safety {
  background:#07B40A;
  color:#fff;
  padding:0rpx 8rpx;
  margin: 0
}
.fui-header {
    z-index: 5;
}
.fui-detail-group {
    margin-top: 0
}
.fui-detail-group .fui-cell {
    padding: 0 20rpx;
}
.fui-detail-group .fui-cell:before,.fui-sale-group:before {
    border: 0;
}
.fui-detail-group .fui-cell .price {
    font-size: 44rpx;
    color: #ff5555;
    line-height: 60rpx;
    padding: 5rpx 0;
    font-weight: bold;
}
.fui-detail-group .fui-cell .price .original {
    font-size:24rpx;
    color: #ccc;
    text-decoration:line-through;
    padding-left: 8rpx;
    font-weight: normal
}
.fui-detail-group .fui-cell .name {
    padding: 20rpx 0 5rpx;
    font-size: 30rpx;
    line-height: 34rpx;
    color: #333
}
.fui-detail-group .fui-cell .share {
    padding-left: 32rpx;
    margin-top: 16rpx;
    position: relative;
    text-align: center;
}
.fui-detail-group .fui-cell .share:before {
    content: " ";
    border-left: 1px solid #C0C0C0;
    height: 100%;
    left: 0;
    position: absolute;
}
.fui-detail-group .fui-cell .share:after,.fui-shop-group .fui-cell:before,
.fui-shop-group .fui-list:after{
    display: none;
}
.fui-detail-group .fui-cell .flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size: 24rpx;
    color: #999;
    padding-bottom: 16rpx;
    flex-wrap: wrap;
    justify-content: space-between
}
.fui-detail-group .fui-cell .flex text {
    width: auto;
    margin-right: 40rpx
}
.fui-detail-group .fui-cell .flex text:first-child {
    text-align: left;
}
.fui-detail-group .fui-cell .flex text:last-child {
    text-align: right;
}
.goods-subtitle text {
    font-size: 24rpx;
    line-height: 34rpx
}
.row-time {
    padding: 0 0 20rpx 20rpx;
    overflow: hidden;
}
.fui-labeltext .text .number,.fui-sale-group .fui-according-header .text .title{
    font-weight: bold;
}
.fui-labeltext .text .time {
    font-size: 26rpx;
    padding: 0 4rpx;
}
/*促销组*/
.fui-sale-group .fui-cell .fui-cell-text,
.fui-sale-group .fui-according-header .text {
    font-size: 26rpx;
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
/*店铺组*/
.fui-shop-group .fui-cell {
    padding: 0 20rpx;
}
.fui-shop-group .fui-cell .shopname {
    height: 80rpx;
    width: 100%;
    padding-left: 20rpx;
    margin-top: 20rpx;
    font-size: 32rpx;
    line-height: 40rpx;
}
.fui-shop-group .fui-cell .center {
    text-align: center;
    margin: 7rpx 0;
    position: relative;
    font-size:28rpx;
}
.fui-shop-group .fui-cell .center:before {
    height: 100%;
    width: 1rpx;
    content:" ";
    position: absolute;
    left: 0;
    top: 0;
    background: #dbdbdb;
}
.fui-shop-group .fui-cell .center:first-child:before {
    background: none;
}
.fui-shop-group .fui-cell .center view {
    color: #7c7c7c;
    font-size: 24rpx;
}
.fui-shop-group .fui-cell .btn-default-o {
    width: 160rpx;
    height: 48rpx;
    border-color: #7c7c7c;
    color: #7c7c7c;
    font-size: 28rpx;
    padding: 0;
    margin: 0 20rpx 8rpx;
    line-height: 48rpx;
    display: inline-block;
}
/*选择规格*/
.fui-option-group .fui-cell {
    background: #f7f8fa;
    border-bottom: 1px solid #ececec;
    padding: 16rpx;
}
.fui-option-group .fui-cell .fui-cell-text {
    font-size: 24rpx;
    color: #666;
}
.fui-option-group .fui-cell .fui-cell-text view {
    margin-left: 200rpx;
}
.fui-option-group .fui-cell .fui-cell-text view:first-child {
    margin-left: 0
}
/*底部功能*/
.fui-navbar {
    text-shadow: none;
}
.fui-navbar .favorite-item .icon {
    -webkit-transform: translate3d(0, 0, 0) scale(1);
    transform: translate3d(0, 0, 0) scale(1);
    -moz-transition-duration: 300ms;
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
}
.fui-navbar .favorite-item .icon.fav{
    -webkit-transform: translate3d(0, 0, 0) scale(1.5);
    transform: translate3d(0, 0, 0) scale(1.5);
}
.fui-navbar .cart-item .badge {
    -moz-transition-duration: 300ms;
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
    -webkit-transform: translate3d(0, 0, 0) scale(1.5);
    transform: translate3d(0, 0, 0) scale(1.5);
    opacity: 1;
}
.fui-navbar .cart-item .badge.out {
    -webkit-transform: translate3d(0, 0, 0) scale(0);
    transform: translate3d(0, 0, 0) scale(0);
    opacity: 0;
}
.fui-navbar .cart-item .badge.in {
    -webkit-transform: translate3d(0, 0, 0) scale(1);
    transform: translate3d(0, 0, 0) scale(1);
}
.fui-navbar .nav-item.btn {
    border: none;
    font-size:28rpx;
    color: #fff;
    border-radius: 0;
    line-height: 98rpx;
    padding-top: 0
}
.fui-navbar .cartbtn {
    background: #fe9402;
}
.fui-navbar .buybtn {
    background: #ff5555;
}
.fui-page {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    display: none;
    position: relative;
    padding: 44rpx 0 120rpx;
}
.seckill-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    overflow: hidden;
    height: 90rpx
}
.seckill-container  .seckill-list,.seckill-container  .seckill-list1 {
    background: #ff5555;
}
.seckill-container.notstart   .seckill-list,
.seckill-container.notstart   .seckill-list1,
.seckill-container.notstart   .seckill-list2 {
    background:#00b950;
}
.seckill-container .seckill-list{
    flex:1;
    color:#fff;
    padding:0em 20rpx;
    margin-top:-1px;
}
.seckill-container  .seckill-list .fui-list-inner .text{
    color:#fff;
    height:36rpx;
}
.seckill-container  .seckill-list .seckill-price{
    font-size:40rpx;
    color:#fff;
    -webkit-box-align: baseline;
    -webkit-align-items: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
    width:auto;
    margin-right:10rpx;
}
.seckill-container  .seckill-list .seckill-price span{
    font-size:50rpx;
    color:#fff;
    font-weight: bold;
    -webkit-box-align: baseline;
    -webkit-align-items: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
    width:auto;
    margin-left: 10rpx
}
.seckill-container  .seckill-list .seckill-price text{
    font-size:72rpx;
}
.seckill-container  .seckill-list .oldprice{
    color:rgba(255,255,255,.5);
    color:#ffc1c1;
    font-size: 22rpx;
    text-decoration: line-through;
    vertical-align: sub
}
.seckill-container  .seckill-list .stitle{
    display: inline-block;
    border:1px solid #fff;
    border-radius: 8rpx;
    font-size:16rpx;
    padding:0 8rpx;
}
.seckill-container .seckill-list1 .fui-list-inner .text{
    text-align: center;
    color:#fff;
    font-size: 22rpx
}
.seckill-container .seckill-list1 .fui-list-inner .text .process {
    float:left;
    width:120rpx;
    height:20rpx;
    border-radius:20rpx;
    overflow:hidden;
    margin-top:12rpx;
    background:#ffffff;
}
.seckill-container .seckill-list1 .fui-list-inner .text .process .process-inner {
    width:200rpx;
    height:20rpx;
    background:#e92525;
}
.seckill-container .seckill-list2 .fui-list-inner .text {
    font-size:20rpx;
    text-align: center;
    height:30rpx;
    color:#ff4c4c;
}
.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #ff5555;
    width: 30rpx;
    height: 30rpx;
    line-height: 30rpx;
    /* line-height: 1; */
    /* padding-top: 6rpx; */
    border-radius: 4rpx;
    vertical-align: middle;
    display: inline-block;
    color: #fff;
}
.seckill-container .seckill-list2 .fui-list-inner .text.timer text {
    display: inline-block;
    background:#582e19;
    color:#fff;
    width:36rpx;height:36rpx;
    border-radius: 4rpx;
    line-height:36rpx;
    font-size:20rpx; text-align: center;
}
.seckill-container .seckill-list2{
    padding:0;
    width:200rpx;
    background:#ffc1c1;
}
.seckill-container .seckill-list2,.seckill-container  .seckill-list1 {
    margin-top:-4rpx;
}
.seckill-container.notstart .seckill-list2 .fui-list-inner .text {
    color:#fff;
}
.seckill-container.notstart .seckill-list2 .fui-list-inner .text.timer text{
    background:rgba(0,0,0,.7);
}
.blue.seckill-container  .seckill-list,.blue.seckill-container  .seckill-list1 {
    background: #4e87ee;
}
.purple.seckill-container  .seckill-list,.purple.seckill-container  .seckill-list1 {
    background: #a839fa;
}
.pink.seckill-container  .seckill-list,.pink.seckill-container  .seckill-list1 {
    background: #ff7e95;
}
.orange.seckill-container  .seckill-list,.orange.seckill-container  .seckill-list1 {
    background: #ff8c1e;
}

.blue.seckill-container  .seckill-list .oldprice{
    color: #afcbff;
}
.purple.seckill-container  .seckill-list .oldprice{
    color: #e0b7ff;
}
.pink.seckill-container  .seckill-list .oldprice{
    color: #ffc8d2;
}
.orange.seckill-container  .seckill-list .oldprice{
    color: #ffcb9a;
}
.blue.seckill-container .seckill-list1 .fui-list-inner .text .process .process-inner {
    background: #1f60d6;
}
.purple.seckill-container .seckill-list1 .fui-list-inner .text .process .process-inner {
    background: #8609e3;
}
.pink.seckill-container .seckill-list1 .fui-list-inner .text .process .process-inner {
    background: #f84666;
}
.orange.seckill-container .seckill-list1 .fui-list-inner .text .process .process-inner {
    background: #f56e00;
}
.blue.seckill-container .seckill-list2 .fui-list-inner .text {
    color: #4e87ee;
}
.purple.seckill-container .seckill-list2 .fui-list-inner .text {
    color: #a839fa;
}
.pink.seckill-container .seckill-list2 .fui-list-inner .text {
    color: #ff7e95;
}
.orange.seckill-container .seckill-list2 .fui-list-inner .text {
    color: #ff8c1e;
}
.blue.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #4e87ee;
}
.purple.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #a839fa;
}
.pink.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #ff7e95;
}
.orange.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #ff8c1e;
}
.blue.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #4e87ee;
}
.purple.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #a839fa;
}
.pink.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #ff7e95;
}
.orange.seckill-container .seckill-list2 .fui-list-inner .text.timer  span{
    background: #ff8c1e;
}
.blue.seckill-container .seckill-list2{
    background: #afcbff;
}
.purple.seckill-container .seckill-list2 {
    background: #e0b7ff;
}
.pink.seckill-container .seckill-list2 {
    background: #ffc8d2;
}
.orange.seckill-container .seckill-list2 {
    background: #ffcb9a;
}

.buybtn.seckill-notstart {
    background:#00b950;
}
.comment-block {
    padding-bottom:100rpx;
}
.row-time {
    padding: 0  20rpx 20rpx;
    overflow: hidden;
}
.fui-labeltext .text .number {
    font-weight: bold;
}
.fui-labeltext .text .time {
    font-size: 26rpx;
    padding: 0 4rpx;
}
.fui-mask.active{display: block;}

/**规格弹出*/
.option-picker {
    height: auto;
    width: 100%;
    padding-bottom: 90rpx;
    z-index: 1001;
}
.option-picker .option-picker-cell {
    padding: 8rpx 20rpx 20rpx 20rpx;
}
.option-picker .option-picker-options {
    margin: 0;
    padding: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 560rpx;
}
.option-picker .option-picker-cell.goodinfo {
    padding-left:220rpx;
    padding-top: 20rpx;
    position: relative;
}
.option-picker .option-picker-cell.goodinfo:after,.option-picker .option-picker-cell.option:after{
    content: " ";
    position: absolute;
    bottom: 0;
    left:20rpx;
    right: 20rpx;
    border-bottom: 1px solid #eee;
}
.option-picker .option-picker-cell.goodinfo .closebtn {
    width:44rpx;
    height:44rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    text-align: center;
    line-height: 44rpx;
    color: #999;
}
.option-picker .option-picker-cell.goodinfo .closebtn .icon {
    font-size: 61rpx;
}
.option-picker .option-picker-cell.goodinfo .img {
    height:168rpx;
    width:168rpx;
    background: #fff;
    padding:4rpx;
    border: 1px solid #eee;
    border-radius: 2px;
    position: absolute;
    top: -50rpx;
    left: 20rpx;
    box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.option-picker .option-picker-cell.goodinfo .img img {
    height: 100%;
    width: 100%;
}
.option-picker .option-picker-cell.goodinfo .info {
    font-size: 28rpx;
    height: 37rpx;
    line-height: 37rpx;
}
.option-picker .option-picker-cell.goodinfo .info-total {
    font-size: 26rpx;
    color: #999
}
.option-picker .option-picker-cell.goodinfo .info-price .price {
    font-size:32rpx;
}
.option-picker .option-picker-cell.goodinfo .info-titles {
    font-size: 26rpx;
    color: #000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.option-picker .option-picker-cell.option {
    position: relative;
}
.option-picker .option-picker-cell.option .title {
    font-size:28rpx;
    height: auto;
    overflow: hidden;
    color: #000;
    line-height: 78rpx;
}
.option-picker .option-picker-cell.option .select {
    font-size: 29rpx;
    color: #666;
    height: auto;
    overflow: hidden;
}
.option-picker .option-picker-cell.option .select .nav {
    height: auto;
    width: auto;
    border: 0;
    float: left;
    margin: 16rpx 20rpx 0 0;
}
.option-picker .option-picker-cell .fui-number {
    float: right;
}
.option-picker .fui-navbar {
    text-shadow: none;
    height: 90rpx;
}
.option-picker .fui-navbar .btn {
    border: none;
    font-size: 29rpx;
    color: #fff;
    border-radius: 0;
    padding: 0;
    margin: 0;
    height: 100%;
    line-height: 90rpx;
}
.option-picker .fui-navbar .cartbtn {
    background: #fe9402;
}
.option-picker .fui-navbar .buybtn, .option-picker .fui-navbar .confirmbtn {
    background: #fd5555;
}
.option-picker-inner {
    background: #fff;
    border-top: 2rpx solid #eee;
    box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.option-picker .fui-navbar .btn.disabled {
    color: #ccc;
    background: #ececec;
}
.option-picker .diyform-container:before {
    display: none;
}
/* 数量选择器 */
.fui-number {
    backface-visibility: hidden;
    box-sizing: border-box;
    position: relative;
    display: -webkit-flex;
    display: flex;
    font-size: 33rpx;
    -webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;
    margin: 0;
    height: 61rpx;
    width: 205rpx;
}
.fui-number:before {
    content: " ";
    position: absolute;
    z-index:2;
    top: 0;
    left: 0;
    right: 0;
    border-top: 2rpx solid #d9d9d9;
}
.fui-number:after {content: " "; position: absolute; z-index:2; bottom: 0; left: 0; right: 0; border-top: 1px solid #d9d9d9;}
.fui-number .num {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 61rpx;
    overflow: hidden;
    line-height: inherit; color:#666; text-align: center; border: 0; font-size: 28rpx}
.fui-number .minus, .fui-number .plus{
    height: inherit; width:61rpx; font-size:41rpx; font-weight: bold; color: #999;
    position: relative; text-align: center; line-height:61rpx;
    background: #f7f7f7; z-index:1;
}
.fui-number .minus:before, .fui-number .plus:before{
    content: " "; position: absolute; top: 0; left: 0; bottom: 0; border-left: 1px solid #d9d9d9;}
.fui-number .minus:after, .fui-number .plus:after{
    content: " "; position: absolute; top: 0; right: 0; bottom: 0; border-right: 1px solid #d9d9d9;}
.fui-number .minus.disabled , .fui-number .plus.disabled{
    background:#fff;
    color:#ebebeb;
}
.fui-number.small {
    height: 40rpx;
    width: 128rpx;
}
.fui-number.small .minus, .fui-number.small .plus{
    width:41rpx;
    line-height: 41rpx;
    font-size:31rpx;
}
.goods-label-demo{background:#fff;}
.goods-label-list{padding:16rpx 20rpx;background: #fff;}
.goods-label-list text{font-size:24rpx;padding:0 6rpx;display:inline-block;}
.goods-label-list span text{font-weight:normal;}
.goods-label-list span .icox{font-size: 28rpx}
.goods-label-style1,.goods-label-style2,.goods-label-style4,.goods-label-style5{position: relative;line-height: 40rpx;}
.goods-label-style1 span,.goods-label-style2 span{height:40rpx;padding-right: 10rpx}
.goods-label-style1 span .icox{color: #55b562}
.goods-label-style2 span .icox{color: #ff5555}
.goods-label-style3{position: relative;line-height: 1rem;}
.goods-label-style3 span{height:1rem;padding:0 6rpx;}
.goods-label-style3 span text{padding:0 8rpx;border:1px solid #fd5555;display: inline-block;margin:4rpx 0;-webkit-border-radius:4rpx;border-radius: 4rpx;color:#fd5555;}
.goods-label-style4 span,.goods-label-style5 span{padding:0 6rpx;}
.goods-label-style4 span text{padding:0 8rpx;display: inline-block;margin:4rpx 0;-webkit-border-radius: 4rpx;border-radius:4rpx;
    color:#fff;background: #fd5555;}
.goods-label-style5 span text{padding:0 8rpx;display: inline-block;margin:4rpx 0;-webkit-border-radius: 4rpx;border-radius: 4rpx;
    color:#fff;background: #25a7e0;}
.content-empty {
    position: relative;
    text-align: center;
    margin-top: 120rpx;
    color: #ccc;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
}
/*评论组*/
.fui-comment-group .fui-cell:before {
    border: 0;
}
.fui-comment-group .fui-cell{
    padding: 0 20rpx;
}
.fui-comment-group .fui-cell .comment {
    padding: 16rpx 0;
    position: relative;
}
.fui-comment-group .fui-cell .comment:before {
    content: " ";
    width: 100%;
    height: 2rpx;
    border-top: 2rpx solid #eee;
    top: 0;
    left: 0;
    position: absolute;
}
.fui-comment-group .fui-cell .comment .info {
    color: #7C7C7C;
    font-size: 24rpx;
    width: 100%;
}
.fui-comment-group .fui-cell .comment .info.head {
    height: 52rpx;
    line-height: 48rpx;
}
.fui-comment-group .fui-cell .comment .info .img {
    float: left;
}
.fui-comment-group .fui-cell .comment .info .img img {
    width: 48rpx;
    height: 48rpx;
    border-radius: 24rpx;
}
.fui-comment-group .fui-cell .comment .info .nickname {
    float: left;
    padding-left: 12rpx;
}
.fui-comment-group .fui-cell .comment .info .star {
    float: left;
    color: #666;
}
.fui-comment-group .fui-cell .comment .info .star span {
    padding: 0;
    margin: 0
}
.fui-comment-group .fui-cell .comment .info .star .shine {
    color: #fd5454;
}
.fui-comment-group .fui-cell .comment .info .star.star1 {
    clear: both
}
.fui-comment-group .fui-cell .comment .info .date {
    text-align: right;
}
.fui-comment-group .fui-cell .comment .remark {
    font-size: 29rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
}
.fui-comment-group .fui-cell .comment .remark .img {
    padding: 8rpx 8rpx 0 0;
}
.fui-comment-group .fui-cell .comment .remark .img img {
    height: 100rpx;
}
.fui-comment-group .fui-cell .desc.label {
    font-size: 24rpx;
    text-align: right;
}
.fui-comment-group .fui-cell .desc.label span {
    color: #fd5454;
}
.fui-comment-group .fui-cell .desc {
    font-size: 24rpx;
    color: #7c7c7c;
    line-height: 60rpx;
    padding: 8rpx 0
}
.comment-block.in {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
.comment-block .fui-icon-group {
    font-size: 26rpx;
}
/* 卖家回复 */
.reply-content {
    background: #e5e5e5;
    font-size: 24rpx;
    padding: 8rpx;
    position: relative;
    margin: 8rpx 0;
}
.reply-content:before {
    content: "";
    position: absolute;
    top: -6rpx;
    left: 20rpx;
    width: 15rpx;
    height: 15rpx;
    background: #e5e5e5;
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}
.goods-detail-comment .fui-comment-group .fui-cell .comment .remark.reply-title {
    color: #ef4f4f;
    font-size: 24rpx;
}
.fui-tag-danger {
    background: #ff9326;
    color: #fff;
    font-size: 24rpx;
    -webkit-border-radius: 8rpx;
    border-radius: 8rpx;
    font-style: normal;
    padding: 4rpx 8rpx;
}
.btn.btn-default {
    color: #000;
}
.btn.btn-danger {
    color: #fff
}
.sale-tip{
    line-height: 28rpx;
    padding: 0rpx 6rpx 0;
    border: 2rpx solid #ff5555;
    color: #ff5555;
    display: inline-block;
    vertical-align: baseline;
    border-radius: 4rpx;
    font-size: 20rpx;
}
.sale-line{
    width: 100%;
    height: 48rpx;
    line-height: 48rpx;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24rpx;
    color: #666;
}
@media (min-width: 351px) and (max-width: 759px) {
    .cl-3{width:25%;float:left;display: block;}
}
.empty_f{
    background: #fff;
    height: 2rem;
    width: 100%;
    position: fixed;
    bottom:-2rem;
    left: 0;
    right: 0;
    z-index: 1000;
}
/*2017-11-01 ma*/
.page-shade{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
}
.fui-share{
    width: 100%;
    height: 400rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 1001;
}
.fui-share.fui-iphonex-share{
    bottom: 68rpx
}
.fui-iphonex-button{
    background: #fafafa;
}
.share-choose{
    height: 180rpx;
    padding: 74rpx 120rpx 60rpx;
    display: flex;
    justify-content: space-between;
}
.share-choose image{
    width: 156rpx;
    height: 148rpx;
}
.share-wechat,.share-poster{
    width: 160rpx;
    text-align: center;
}
.text-explain{
    font-size: 26rpx;
    color: #666;
}
.close-btn{
    width: 100%;
    height: 86rpx;
    background: #fafafa;
    text-align: center;
    font-size: 26rpx;
    line-height: 86rpx;
    color: #999;
}
.close-btn:before{
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    top: 1;
    height: 1px;
    border-top: 1px solid #ebebeb;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}
.fui-cell-group .fui-cell .fui-cell-remark.showshade::after,button:after{
    display: none;
}
/*优惠券*/
.goods-detail-goods .fui-sale-group .coupon-mini{
    background: #ff5555;
    color: #fff;
    padding: 0rpx 8rpx;
    position: relative;
    display: inline-block;
    font-size: 24rpx;
    line-height:28rpx;
    margin-right: 10rpx
}
.goods-detail-goods .fui-sale-group .coupon-mini:before, .goods-detail-goods .fui-sale-group .coupon-mini:after {
    content: '';
    position: absolute;
    top: 0;
    left: -1rpx;
    bottom: 0;
    border-left: 1px dotted #ff5555;
}
.goods-detail-goods .fui-sale-group .coupon-mini:after {
    left: auto;
    right: -1rpx;
}

.fui-navbar .customer-item {
    background: none;
    border: 0;
    padding: 0;
    font-size: inherit;
    line-height: inherit;
    padding-top: 6rpx;
}
.fui-navbar .customer-item:after {
    display: none;
}
.nav-mask{
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none
}
.nav-model view,.nav-model button{
    position: fixed;
    right: 20rpx;
    z-index: 999;
    font-size: 22rpx;
    color:#fff;
    transition: all .7s;
    -moz-transition: all .7s; /* Firefox 4 */
    -webkit-transition: all .5s; /* Safari å’Œ Chrome */
    -o-transition: all .5s; /* Opera */
    bottom: 180rpx;
    opacity: 0
}
.phone{
    position: fixed;
    right: 20rpx;
    z-index: 999;
    font-size: 22rpx;
    color:#fff;
    width: 84rpx;
    height:84rpx;
    transition: all .7s;
    -moz-transition: all .7s; /* Firefox 4 */
    -webkit-transition: all .5s; /* Safari å’Œ Chrome */
    -o-transition: all .5s; /* Opera */
    background: rgba(0, 0, 0, 0.5);
    bottom: 280rpx;
}
.nav-model button{
    background: 0;
    padding: 0;
}
.nav-model view.nav{
    display: inline-block;
    width: 84rpx;
    height: 84rpx;
    border-radius: 50%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
    bottom: 180rpx;
    text-align: center;
    padding-top: 16rpx;
    box-sizing: border-box;
    opacity: 1;
    z-index: 999;
    transition:none;
}
.nav-model view span,.nav-model button span{
    display: none
}
.nav-model view.out,.nav-model button.out {
    opacity: 1;
    transform:rotate(360deg);
}
.nav-model view.nav-home.out{
    bottom: 282rpx;
}
.nav-model view.nav-member.out{
    bottom: 396rpx;
}
.nav-model view.nav-collect.out{
    bottom: 510rpx;
}
.nav-model button.nav-customerservice.out{
    bottom: 604rpx;
}
.nav-model .out2{
    opacity: 1;
    width: 250rpx;
    text-align: right
}
.nav-model .out2 span{
    vertical-align: middle;
    margin-right: 22rpx;
    margin-bottom: 30rpx;
    display: inline-block;
    line-height: 1.5
}
.nav-model .nav-collect .icox.icox-collection_fill{
    font-size: 50rpx;
}
.nav-model .out2 .icox{
    background: #fff;
    color: #000
}
.nav-model view.nav-home.out2{
    bottom: 262rpx;
}
.nav-model view.nav-member.out2{
    bottom: 376rpx;
}
.nav-model view.nav-collect.out2{
    bottom: 490rpx;
}
.nav-model button.nav-customerservice.out2{
    bottom: 604rpx;
}
.nav-model view.nav text{
    display: block;
    line-height: 30rpx
}
.nav-model .icox{
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    font-size: 66rpx;
    width: 84rpx;
    height: 84rpx;
    display: inline-block;
    text-align: center;
    line-height: 84rpx;
}
.nav-model view.nav.icox{
    padding: 0;
    background: #ff5555;
    font-size: 50rpx;
    text-align: center;
    line-height: 84rpx;
}
.nav-model view .icox.icox-cart1,.nav-model view .icox.icox-collection,.nav-model button .icox.icox-customerservice{
    font-size: 50rpx
}
#time-container,#discount-container{
    padding: 0 20rpx;
    line-height: 70rpx;
    background: #fff2e2;
    color: #ff8000;
    font-size: 28rpx;
}
#time-container .icox,#discount-container .icox{
    margin-right: 12rpx;
}
.fui-comment-group .fui-cell .desc.label {
    font-size: 24rpx;
    text-align: right;
    color: #ff5555;
    line-height: 32rpx;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.fui-comment-group .fui-cell .desc {
    font-size: 28rpx;
    color: #000;
    flex: none;
    width: 370rpx;
    line-height: 28rpx;
    padding: 26rpx 0;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
#package{
    padding: 10rpx 0 20rpx 24rpx;
    background: #fff;
    font-size: 24rpx;
    overflow: auto;
    height: 262rpx
}
#package_list {
    overflow: hidden;
}
#package_list .package-goods{
    width: 180rpx;
    margin-left: 40rpx;
    float: left;
    position: relative;
}
#package_list .package-goods .icox{
    position: absolute;
    top: 76rpx;
    right: -34rpx;
    color: #ADBDC5;
    font-size: 28rpx
}
#package_list .package-goods:first-child{
    margin-left: 0
}
#package_list .package-goods:last-child .icox{
    display: none
}
#package_list .package-goods image{
    width: 180rpx;
    height: 180rpx;
    margin-bottom: 20rpx;
}
#package_list .package-goods p{
    text-align: center;
    line-height: 32rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    white-space:normal;
}
.favourable{
    margin-top: 20rpx;
}
.favourable .fui-cell-group{
    margin-top: 0!important
}
.favourable .fui-cell-group:first-child::before{
    border: none
}
.favourable .fui-cell-group:before {
    content: " ";
    position: absolute;
    left: 0.5rem;
    right: 0.5rem;
    top: 0;
    height: 1px;
    border-top: 1px solid #ebebeb;
    color: #ebebeb;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
}


/*未授权弹窗*/
.model{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1099;
}
.model .inner1{
	width: 624rpx;
	height: 600rpx;
	background: #fff;
	border-radius: 8rpx;
	margin: 260rpx auto;
	overflow: hidden;
}
.model .inner1 .title{
    font-size: 36rpx;
    color: #000;
    line-height: 100rpx;
    text-align: center;
    font-weight: 600;
    margin-top: 20rpx;
}
.model .inner1 .image{
    text-align: center;
    margin-top: 20rpx;
}
.model .inner1 image{
    width: 342rpx;
    height: 202rpx
}
.model .inner1 .subtitle{
    margin-top: 50rpx;
    padding: 0 80rpx;
    color: #888;
    font-size: 26rpx;
    line-height: 40rpx;
}
.model-btns{
    border-top: 1rpx solid #ebebeb;
    height: 100rpx;
    margin-top: 28rpx;
    display: flex;
    text-align: center;
    font-size: 30rpx;
    color: #000;
    line-height: 100rpx;
}
.model-btns .cancel{
    width: 50%;
    position: relative;
}
.model-btns .cancel:after{
    content: " ";
    position: absolute;
    top: -1rpx;
    right: 0;
    width: 1px;
    height: 210rpx;
    border-right: 1px solid #ebebeb;
    color: #ebebeb;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}
.model-btns .confirm{
    width: 50%;
    color: #50b33c;
}


/*活动详情弹窗*/
.act-mask{
    width: 100%;
    height: 100%;
    background: rgb(255,255,255,0);
    transition-duration: 300ms;
    transform: translate3d(0, 0, 0);
}
.act-mask.in{
    background: rgba(0,0,0,0.5);
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.inner{
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: -100%;
    transition-duration: 300ms;
    transform: translate3d(0, 0, 0);
}
.inner.in{
    bottom: 0;
    display: block;
    z-index: 1111;
    transition-duration:300ms;
    transform:translate3d(0, 0, 0);

}
/*活动详情弹窗-按钮*/
.act-btn{
    width: 100%;
    padding: 0;
    margin: 0;
    border-radius: 0;
    position: absolute;
    bottom: 0;
}
/*未授权提示条*/
.hint{
    height: 80rpx;
    background: #fdfde5;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 188;
    color: #ff8000;
    font-size: 26rpx;
    line-height: 80rpx;
    padding-left: 20rpx;
}
/* button{
  background: #fff;
  font-size: 30rpx;
  color: #50b33c;
  line-height: 100rpx;
  width: 50%;
}
button:after{
  display: none;
} */
/* .goods-detail-info{
  position: relative
}
video{
  display: block !important;
  position: static
} */
/*分销佣金  */
.goods-detail-goods .detail-Commission{
    height:52rpx;
    width:auto;
    border: 1px solid #ff9404;
    border-radius: 52rpx;
    line-height:52rpx;
    text-align: center;
    box-shadow: 0 2px 5px rgba(250,182,0,0.3);
}
.goods-detail-goods .detail-Commission view.text{
    margin: -1px;
    min-width: 54rpx;
    padding: 0 24rpx;
    font-size:22rpx;
    vertical-align: middle;
    background: -moz-linear-gradient(left, #f0b938 0%, #f09938 100%);
    background: -webkit-linear-gradient(left, #f0b938 0%,#f09938 100%);
    background: -o-linear-gradient(left, #f0b938 0%,#f09938 100%);
    background: -ms-linear-gradient(left, #f0b938 0%,#f09938 100%);
    background: linear-gradient(to right, #f0b938 0%,#f09938 100%);
    border-radius:54rpx;
     color: #fff;
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#fff0b938, endColorstr=#fff09938,gradientType='1');
   
}
.goods-detail-goods .detail-Commission view.num{
    font-size:28rpx;
    color: #fe9503;
    font-weight:bold;
    padding: 0 22rpx 0 14rpx;
}

/*记次时商品提示*/
.goods-layer{
    position: fixed;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9;
}
.goods-layer .inner{
    width: 15.5rem;
    height: 12rem;
    background: #fff;
    margin: -7rem 0 0 -7.75rem;
    border-radius: 0.25rem;
    position: fixed;
    top: 50%;
    left: 50%;
}
.goods-layer .goods-btn{
    height: 2.1rem;
    background: #ff5555;
    margin: 0 0.9rem 0.85rem 0.9rem;
    font-size: 0.7rem;
    text-align: center;
    color: #fff;
    border-radius: 0.25rem;
    line-height: 2.1rem;
}
.goods-content{
    height: 8rem;
    margin-bottom: 0.5rem;
    font-size: 0.7rem;
    line-height: 1rem;
    color: #666;
    text-align: center;
    padding: 0 2rem;
}
.goods-content .goods-title{
    height: 3rem;
    line-height: 3rem;
    font-weight: bold;
}

/* 详情底部多余空白 */
.goods-detail-goods{
  padding-bottom: 0;
}
/* 底部固定图 */
.bottom-image image{
  width: 100%;
}
</style>