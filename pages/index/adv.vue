<template>
<!--幻灯片轮播start-->
<block v-if="item.data.length>0">
    <view class="index-advs">
        <swiper class="index-adcs-sqiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular" :style="( advsheight?'height:'+advsheight+'px':'' )">
            <block v-for="(item, index) in item.data" :key="index">
                <swiper-item>
                    <navigator :url="item.link" class="index-advs-navigator" open-type="navigate">
                        <image :src="item.thumb" class="advimg" mode="widthFix" @load="imagesHeight" data-type="advsheight"></image>
                    </navigator>            
                </swiper-item>
            </block>
        </swiper>
    </view>
</block>
<!--幻灯片轮播end-->
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									