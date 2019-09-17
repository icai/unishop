<template>
<view class="fui-cell-group fui-detail-group" :style="'background:' + diyitem.style.background">
            <view class="fui-cell">
                <view class="fui-cell-text name">
                    <text v-if="goods.ispresell==1 && goods.ispresellshow == 1" class="fui-tag fui-tag-danger">预</text>
                    <text class="cycle-tip" v-if="goods.type == 9">周期购</text>
                    <text selectable="true" :style="'color:' + diyitem.style.titlecolor">{{goods.title}}</text>
                </view>
                <view v-if="diyitem.params.hideshare != 1" class="fui-cell-remark showshade" @tap="showshade" style="margin-left: 60rpx;">
                  <i style="font-size:42rpx;color: #fd5555;" :class="'icon ' + diyitem.params.share_icon"></i>
                  <view style="font-size: 20rpx;color: #666;margin-top:-6rpx;">{{diyitem.params.share==''?'分享': diyitem.params.share}}</view>
                </view>
            </view>
            <block v-if="goods.subtitle">
              <view class="fui-cell goods-subtitle">
                <text class="text-danger" :style="'color:' + diyitem.style.subtitlecolor" selectable="true">{{goods.subtitle}}</text>
              </view>
            </block>
            <block v-if="!goods.seckillinfo">
                <view class="fui-cell">
                    <view class="fui-cell-text price">
                        <view class="text-danger" :style="'color:' + diyitem.style.pricecolor">
                            ¥<block v-if="goods.ispresell> 0 && (preselltimeend==0) || preselltimeend>now">
                              <text v-if="goods.hasoption == 1">
                              <text v-if="goods.minpresellprice != goods.maxpresellprice">
                                {{ goods.minpresellprice }}~{{ goods.maxpresellprice }}
                              </text>
                              <text v-else>{{ goods.minpresellprice }}</text>
                              </text>
                              <text v-else>{{goods.presellprice}}</text>
                            </block>
                            <block v-else>
                                <block v-if="minprice==goods['maxprice']">
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
                <view class="row row-time" :style="'color:' + diyitem.style.timecolor">
                        <view id="time-container" :style="'color:' + diyitem.style.timetextcolor">
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
                <view class="fui-cell-text flex" :style="'color:' + diyitem.style.textcolor">
                    <block v-if="dispatchpriceObj==1">
                        <block v-if="goods.type==1 && goods.isverify !=2">
                            <text>快递:{{goods.dispatchprice.min}} ~ {{goods.dispatchprice.max}}</text>
                        </block>
                    </block>
                    <block v-else-if="goods.type==1 && goods.isverify !=2">
                        <text>快递:<block v-if="goods.dispatchprice == 0">包邮</block><block v-else>{{goods.dispatchprice}}</block>
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
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									