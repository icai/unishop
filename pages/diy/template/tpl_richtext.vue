<template>
<rich-text :nodes="diyitem.params.content" @tap="tap" :style="'background:' + diyitem.style.background + ';padding:' + (diyitem.style.padding==0?0:diyitem.style.padding + 'rpx') + ' ' + (diyitem.style.padding==0?0:diyitem.style.padding + 'rpx') + ';display:block'">
</rich-text>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									