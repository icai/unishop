<template>
<scroll-view scroll-x="true" :scroll-left="(timeindex-1)*70" class="swiper-container time-container" v-if="goods_error==0">
	<view class="swiper-wrapper" :data-num="time_num" :style="'width:' + time_num*140 + 'rpx'">
		<view :class="'swiper-slide time-slide  ' + ( timeindex==index?'current':'' )" v-for="(time, index) in times" :key="index" @tap="current" :data-timeid="time.id" :data-index="index">
			<view class="time">{{time.time}}:00</view>
			<view class="text" v-if="time.status == 0">抢购中</view>
			<view class="text" v-else-if="time.status == 1">即将开始</view>
			<view class="text" v-else>已结束</view>
		</view>

	</view>
</scroll-view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									