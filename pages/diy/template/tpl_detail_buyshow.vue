<template>
<view class="fui-cell-group" v-if="goods.buycontentshow>0">
    <view class="fui-cell">
      <component :wxParseData="wxParseData_buycontent.nodes" :is="wxParse"></component>
    </view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									