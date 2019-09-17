<template>
<view class="fui-menu-group" :style="'background:' + diyitem.style.background + ';margin-top:' + (diyitem.style.margintop==0?0:diyitem.style.margintop + 'rpx')">
    <navigator class="fui-menu-item" v-for="(childitem, index) in diyitem.data" :key="index" :data-url="childitem.linkurl" :data-phone="childitem.phone" @tap="navigate">
        <i :class="'icox ' + childitem.iconclass" :style="'color:' + childitem.iconcolor + ';'"> </i> 
        <text :style="'color:' + childitem.textcolor + ';'">{{childitem.text}}</text>
    </navigator>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									