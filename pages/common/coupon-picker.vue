<template>
<view :class="'picker-modal ' + (showcoupon?'in':'out' ) + ' ' + iphonexnavbar">
    <view class="coupon-picker">
      <view class="option-picker-inner coupon-picker">
        <view class="coupontitle" @tap="emptyActive">领取优惠券 <text class="icox icox-close pull-right"></text> </view>
        <view class="coupon-list mini">
          <view :class="'coupon-item ' + item.color" v-for="(item, index) in coupon" :key="index">
            <view class="coupon-dots">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </view>
            <view class="coupon-left">
              <view class="single"><span v-if="item.backpre" class="subtitle">￥</span>{{item.backmoney}}<span class="subtitle" v-if="item.backtype==1">折</span></view>
            </view>
            <view class="coupon-right">
              <view class="title">{{item.couponname}}</view>
              <view class="usetime">
                <view class="text">{{item.timestr}}</view>
              </view>
            </view>
            <view class="coupon-after">
              <view class="coupon-btn ling" :data-id="item.id" @tap="couponrecived">立即领取</view>
            </view>
          </view>  
        </view>
      </view>
    </view>
	</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									