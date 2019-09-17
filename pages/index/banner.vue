<template>
<view>
<!--广告位start-->
<block v-if="item.bannerswipe==1 && item.data.length>0">
    <view class="index-banner">
        <swiper class="index-adcs-sqiper index-banner-sqiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular" :style="(bannerheight?'height:'+bannerheight+'px':'height:'+swiperheight+'px')">
            <block v-for="(item, index) in item.data" :key="index">
                <swiper-item>
                    <navigator :url="item.link" class="index-advs-navigator" open-type="navigate">
                        <image :src="item.thumb" class="advimg" @load="imagesHeight" data-type="bannerheight" mode="widthFix"></image>
                    </navigator>            
                </swiper-item>
            </block>                
        </swiper>
    </view>
</block>
<block v-else>
    <block v-for="(item, index) in item.data" :key="index">
        <view class="index-adcs-sqiper index-banner-sqiper">
            <navigator :url="item.link" class="index-advs-navigator" open-type="navigate">
                <image :src="item.thumb" class="advimg" mode="widthFix"></image>
            </navigator>   
        </view>
    </block>
</block>
<!--广告位end-->
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									