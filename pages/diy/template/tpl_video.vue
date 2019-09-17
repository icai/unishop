<template>
<block>
   <view class="video_cover" :style="'height:' + (diyitem.style.ratio==0?screenWidth/8*9:'') + '' + (diyitem.style.ratio==1?screenWidth/2*3:'') + '' + (diyitem.style.ratio==2?screenWidth*2:'') + 'rpx;'" v-if="cover!=diyitemid" @load="videoHeight">
    <image class="bg" :src="diyitem.params.poster" style="height:100%;width:100%"></image>
    <image class="play" :src="play" style :data-cover="diyitemid" @tap="startplay"></image>
  </view>
   <video v-else id="Video" :src="diyitem.params.videourl" @pause="bindpause" controls :style="'height:' + (diyitem.style.ratio==0?screenWidth/8*9:'') + '' + (diyitem.style.ratio==1?screenWidth/2*3:'') + '' + (diyitem.style.ratio==2?screenWidth*2:'') + 'rpx;width:100%'" :muted="soundpic">   
    <cover-image :src="(sound?voice:mute)" class="voice" @tap="changevoice"></cover-image>   
    </video>      
</block>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									