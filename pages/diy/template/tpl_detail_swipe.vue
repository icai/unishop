<template>
<view>
<!--轮播start-->      
        <view :style="'height:' + advHeight + 'rpx;position:relative;display:' + (showvideo?'block':'none')" v-if="goods.video">
          <view v-if="cover">
            <image class="bg" :src="goods.thumb" style="height:100%;width:100%"></image>
            <image class="play" :src="play" style="width:150rpx;height:140rpx" @tap="startplay"></image>
            <view class="mc">
                <view class="video_btn active" @tap="showvideo">视频</view>
                <view class="pic_btn" @tap="showpic">图片</view>
            </view>
          </view>
          <video id="myVideo" :src="goods.video" @pause="bindpause" controls :style="'width:100%;height:' + advHeight + 'rpx;'" :class="'video ' + (showpic||cover?'none':'block')" :muted="soundpic" @fullscreenchange="bindfullscreenchange">
             <cover-image :src="(sound?voice:mute)" class="voice" @tap="changevoice"></cover-image>   
            <cover-view class="mc" v-if="success">
                <cover-view class="video_btn active">视频</cover-view>
                <cover-view class="pic_btn" @tap="showpic">图片</cover-view>  
            </cover-view>
          </video>        
        </view> 
        <view :class="'goods-advs ' + (showpic || goods.video == ''?'block':'none')" style="width:100%;height:auto;position:relative">
             <swiper class="index-adcs-sqiper" :indicator-dots="indicatorDots" :interval="interval" :duration="duration" :circular="circular" :style="'width:100%;height:' + advHeight + 'rpx;'">
                <block v-for="(item, index) in goods.thumbs" :key="index">
                    <swiper-item>
                        <image :src="item" class="goodsadvimg"></image>          
                    </swiper-item>
                </block>
            </swiper> 
            <view class="mc">
              <view class="video_btn" @tap="showvideo" v-if="goods.video">视频</view>
              <view class="pic_btn active" @tap="showpic" v-if="goods.video">图片</view>
          </view>
        </view>
<!--轮播end-->
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									