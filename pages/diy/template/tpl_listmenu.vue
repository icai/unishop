<template>
<view class="fui-cell-group" :style="'background-color: ' + diyitem.style.background + ';margin-top:' + (diyitem.style.margintop==0?0:diyitem.style.margintop + 'rpx')">
    <view class="fui-cell" v-for="(childitem, index) in diyitem.data" :key="index" :data-url="childitem.linkurl" @tap="navigate" :data-phone="childitem.phone" :data-appurl="childitem.appurl" :data-appid="childitem.appid">
        <view class="fui-cell-icon" :style="'color:' + diyitem.style.iconcolor" v-if="childitem.iconclass"> <text :class="'icox ' + childitem.iconclass"></text></view>
        <view class="fui-cell-text" :style="'color:' + diyitem.style.textcolor">{{childitem.text}}</view>
        <view class="fui-cell-remark" :style="'color:' + diyitem.style.remarkcolor">{{childitem.remark}}</view>
    </view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									