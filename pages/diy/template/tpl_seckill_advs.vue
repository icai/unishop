<template>
<view class="swiper-container adv-container" v-if="goods_error==0">
    <view class="swiper-wrapper" :style="'width:' + 268*adv_num + 'rpx'">
        <view class="swiper-slide adv-slide" v-for="(adv, index) in diyitem.data" :key="index">
            <navigator :url="adv.linkurl">
                <image :src="adv.imgurl" mode="widthFix"></image>
            </navigator>
        </view>
    </view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									