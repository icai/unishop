<template>
<!--热点start-->
<block v-if="item.data.length>0">
    <view class="index-hot"> 
        <view class="weui-flex">
            <view class="flex-head-item item-hotdot">
                <image :src="hotimg" class="hotdot"></image>
                <image :src="notification" class="notification"></image>
            </view>
            <view class="weui-flex__item">
                <!--滚动start-->
                <swiper class="index-adcs-sqiper index-notification-swiper" :indicator-dots="indicatorDotsHot" :autoplay="autoplayHot" :interval="intervalHot" :duration="durationHot" :circular="circularHot">
                    <block v-for="(item, index) in item.data" :key="index">
                        <swiper-item>
                            <navigator :url="'/pages/shop/notice/detail/detail?id=' + item.id" class="notification-navigoter" hover-class="none" open-type="navigate">
                                {{item.title}}
                            </navigator>            
                        </swiper-item>
                    </block>
                </swiper>
                <!--滚动end-->
            </view>
        </view>
    </view>
</block>
<!--热点end-->
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									