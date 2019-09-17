<template>
<view>
<view :class="'act-mask ' + fadein" v-if="fadein == 'in'" @tap="actOutPicker"></view>
	<view :class="'inner ' + fadein + ' ' + iphonexnavbar">
		<view class="fui-cell-title" style="border-bottom:1px solid #efefef;padding:30rpx 28rpx;" @tap="actOutPicker">促销活动 <text class="icox icox-close pull-right"></text></view>
		<view class="fui-cell-group fui-sale-group noborder" style="margin-top:0; overflow-y: auto;padding-bottom:130rpx;max-height:700rpx">
    <!--满减  -->
      <view class="act-cell" v-if="activity.enough || activity.merch_enough">
        <view class="act-cell-title"> <text class="act-tips"></text> 满减活动</view>
        <view class="act-cell-inner">
          <text class v-for="(item, index) in activity.enough" :key="index">全场满{{item.enough}}立减{{item.money}};</text>
          <text class v-for="(item, index) in activity.merch_enough" :key="index">本店满{{item.enough}}立减{{item.give}};</text>
        </view>
      </view>
    <!--全返  -->
      <view class="act-cell" v-if="activity.fullback">
        <view class="act-cell-title"> <text class="act-tips"></text> {{ goods.fullbacktext }}活动</view>
        <view class="act-cell-inner">
          {{ goods.fullbacktext }}总额：{{activity.fullback.all_enjoy}}
          每天返：{{activity.fullback.enjoy}}
          时间：{{activity.fullback.day}}
        </view>
      </view>
    <!-- 包邮 -->
    <view class="act-cell" v-if="activity.postfree">
        <view class="act-cell-title"> <text class="act-tips"></text> 包邮</view>
        <view class="act-cell-inner">
          <text v-if="activity.postfree.goods">本商品包邮;</text>
          <text v-if="activity.postfree.scope">
              <text>{{activity.postfree.scope}}</text><text v-if="activity.postfree.enoughfree>0">满￥{{activity.postfree.enoughfree}}</text><text>包邮</text>
          </text>
          <text v-if="activity.postfree.num">单品买{{activity.postfree.num}}件包邮；</text>
          <text v-if="activity.postfree.price">单品买￥{{activity.postfree.price}}包邮</text>
        </view>
      </view>
    <!-- 复购  -->
    <view class="act-cell" v-if="activity.buyagain">
      <view class="act-cell-title"> <text class="act-tips"></text> 复购</view>
      <view class="act-cell-inner">
        此商品重复购买可享受{{activity.buyagain.discount}}折优惠;
        <span v-if="activity.buyagain.buyagain_sale==0">重复购买 不与其他优惠共享</span>
      </view>
    </view>
    <!--积分  -->
    <view class="act-cell" v-if="activity.credit">
      <view class="act-cell-title"> <text class="act-tips"></text>积分</view>
      <view class="act-cell-inner">
       <text v-if="activity.credit.deduct">最高抵扣￥{{activity.credit.deduct}}；</text>
        <text v-if="activity.credit.give">购买赠送{{activity.credit.give}}积分</text>
      </view>
    </view>

    
    

				<!-- <view class="fui-cell-label" style=" align-self: flex-start;width: 120rpx;">
					<span class="sale-tip">全返</span>
				</view> -->
				<!-- <view class="fui-cell-text" style="white-space: inherit;">
					<view class="fullback-info">
						<p style="display: block;"><i class="icox icox-xiaofei1" style="color: #f55;position: relative;top: 3rpx;margin-right: 5rpx;"></i>
							全返总额：
							<span wx:if="{{ fullbackgoods.type == 0 }}" class="text-danger">¥{{fullbackgoods.maxallfullbackallprice}}</span>
	                        <span wx:if="{{ fullbackgoods.type == 1 }}" class="text-danger">{{maxallfullbackallratio}}%</span>
						</p>
						<p style="display: block;"><i class="icox icox-xiaofei1" style="color: #f55;position: relative;top: 3rpx;margin-right: 5rpx;"></i>
							每天返： 
							<span wx:if="{{ fullbackgoods.type == 0 }}" class="text-danger">¥{{fullbackgoods.maxfullbackprice}}</span>
	                        <span wx:if="{{ fullbackgoods.type == 1 }}" class="text-danger">{{maxfullbackratio}}%</span>
						</p>
						<p style="display: block;"><i class="icox icox-xiaofei1" style="color: #f55;position: relative;top: 3rpx;margin-right: 5rpx;"></i>
							时间：
							<span class="text-danger">{{fullbackgoods.minday}} 天</span>
						</p>
					</view>
				</view> -->
		</view>
		<view class="btn act-btn btn-danger" @tap="actOutPicker">确定</view>
	</view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									