<template>
<!--热点start-->
<block>
    <view class="index-hot"> 
        <view class="weui-flex" :style="'background:' + diyitem.style.background + ';'">
            <view class="flex-head-item item-hotdot">
              <image :src="diyitem.params.iconurl" class="hotdot"></image>
              <text class="icox icox-notification notification" :style="'color:' + diyitem.style.iconcolor"></text>
            </view>
            <view class="weui-flex__item">
                <!--滚动start-->
                <swiper class="index-adcs-sqiper index-notification-swiper" vertical="true" circular="true" autoplay="true" :interval="diyitem.params.speed + '000'">
                    <block v-for="(item, index) in diyitem.data" :key="index">
                        <swiper-item>
                            <navigator :url="item.linkurl" class="notification-navigoter" hover-class="none" :style="'color:' + diyitem.style.color">
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
									