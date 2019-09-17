<template>
<view>
<view class="wxParse" :style="'width: 100%;' + ( copyright['bgcolor'] ? 'background: '+copyright['bgcolor'] : '' )">
        <component :wxParseData="wxParseData.nodes" :is="wxParse"></component>
</view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									