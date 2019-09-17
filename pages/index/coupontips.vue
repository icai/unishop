<template>
<view class="coupontips" v-if="showcoupontips">
  <navigator class="text" url="/pages/sale/coupon/my/index/index" open-type="navigate" @tap="closecoupontips">您收到了新的优惠券，戳我查看吧~</navigator>
  <view class="close" @tap="closecoupontips"><i class="icox icox-close"></i></view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									