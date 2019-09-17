<template>
<view class="fui-picture" :style="'background:' + diyitem.style.background">
    <view v-for="(childitem, index) in diyitem.data" :key="index" :data-url="childitem.linkurl" :data-phone="childitem.phone" :data-appid="childitem.appid" :data-appurl="childitem.appurl" @tap="navigate" :style="'padding:' + (diyitem.style.paddingtop==0?0:diyitem.style.paddingtop + 'rpx') + ' ' + (diyitem.style.paddingleft==0?0:diyitem.style.paddingleft + 'rpx')">
        <image mode="widthFix" :src="childitem.imgurl" :style="(bannerheight?'height:'+bannerheight+'px':'height:auto' )"></image>
    </view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									