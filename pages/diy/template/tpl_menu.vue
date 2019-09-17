<template>
<view>
<view wx-if="{{diyitem.style.showtype=='0'}}" :class="'fui-icon-group noborder col-' + diyitem.style.rownum" :style="'background:' + diyitem.style.background">
   <view class="fui-icon-col external" v-for="(childitem, index) in diyitem.data" :key="index" :data-url="childitem.linkurl" :data-appurl="childitem.appurl" @tap="navigate" :data-phone="childitem.phone" :data-appid="childitem.appid">
        <view class="icon">
          <image :class="diyitem.style.navstyle" :src="childitem.imgurl">
          </image>
        </view> 
        <view class="text" :style="'color:' + childitem.color">
          {{childitem.text}}
        </view>
    </view>
</view>
<swiper class="menu" wx-if="{{diyitem.style.showtype=='1'}}" :autoplay="autoplay" :interval="interval" :duration="duration" :indicator-dots="(diyitem.style.showdot==1?true:false)" :style="'background:' + diyitem.style.background + ';padding:20rpx 0;height:' + diyitem.data_line*160 + diyitem.data_line*30 + 'rpx'">
  <block>
    <swiper-item :class="'col-' + diyitem.style.rownum" v-for="(childitem, index) in diyitem.data_temp" :key="index">
       <view class="fui-icon-col external" v-for="(menu_item, index2) in childitem" :key="index2" :data-url="menu_item.linkurl" :data-appurl="menu_item.appurl" :data-appid="menu_item.appid" :data-phone="menu_item.phone" @tap="navigate">
        <view class="icon">
          <image :class="diyitem.style.navstyle" :src="menu_item.imgurl"></image>
        </view> 
        <view class="text" :style="'color:' + menu_item.color">
        {{menu_item.text}}
        </view>
    </view>
    </swiper-item>
  </block>
</swiper>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									