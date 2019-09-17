<template>
<view class="assembly-container">
    <view class="assembly" :style="'width:' + room_num*170 + 'rpx'">
        <view v-for="(room, index) in rooms" :key="index" :class="( roomid==room.id?'active':'' )" @tap="selected" :data-id="room.id">{{room.title}}</view>
    </view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									