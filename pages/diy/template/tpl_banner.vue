<template>
<view>
<block v-if="diyitem.data.length>1">
      <view class="index-banner">
          <swiper :class="'index-adcs-sqiper index-banner-sqiper ' + diyitem.style.dotstyle + ' left'" indicator-dots="true" :autoplay="autoplay" :interval="interval" :duration="duration" :indicator-color="diyitem.style.background" circular="true" :style="(result[diyitemid]?'height:'+result[diyitemid]+'px':'height:'+swiperheight+'px')">
              <block v-for="(childitem, index) in diyitem.data" :key="index" style="position:relative">
                  <swiper-item>
                      <view :data-url="childitem.linkurl" :data-phone="childitem.phone" :data-appid="childitem.appid" :data-appurl="childitem.appurl" @tap="navigate" class="index-advs-navigator">
                           <image :src="childitem.imgurl" class="advimg" @load="imagesHeight" :data-type="diyitemid" mode="widthFix"></image> 
                      </view>            
                  </swiper-item>
              </block>                
          </swiper>
      </view>
  </block>
   <block v-else>
      <block v-for="(childitem, index) in diyitem.data" :key="index">
          <view class="index-adcs-sqiper index-banner-sqiper">
              <view :data-url="childitem.linkurl" :data-phone="childitem.phone" :data-appurl="childitem.appurl" :data-appid="childitem.appid" @tap="navigate" class="index-advs-navigator">
                  <image :src="childitem.imgurl" class="advimg" mode="widthFix"></image>
              </view>   
          </view>
      </block>
  </block>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									