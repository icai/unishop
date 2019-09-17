<template>
<!--广告start-->
<block v-if="startadv.status == 1">
    <view :class="startadv.params.style" v-if="adveradmin">
		<view class="adver-time" v-if="startadv.params.style == 'default' && startadv.params.canclose == 1">
		  <view @tap="adverclose">跳过</view>
		  <view class="time">{{clock}}s</view>
		</view>
		<view class="adver-time" v-if="startadv.params.style == 'default' && startadv.params.canclose == 0">
		  <view class="time" style="line-height: 64rpx;">{{clock}}s</view>
		</view>
		<swiper :indicator-dots="indicatorDotss" indicator-active-color="#fff" circular="true" indicator-color="rgba(255,255,255,0.6)" :autoplay="autoplays" :interval="intervals" :duration="durations">
		  <block v-for="(item, index) in startadv.data" :key="index">
		    <swiper-item>
		      <image :src="item.imgurl" v-if="item.click == 0" class="slide-image" width="100%" height="100%" @tap="indexChangebtn" :data-type="item.linkurl"></image>
		      <image :src="item.imgurl" v-if="item.click == 1" class="slide-image" width="100%" height="100%" @tap="adverclose"></image>
		    </swiper-item>
		  </block>
		</swiper>
		<view v-if="startadv.params.style == 'small-bot'" class="small-bot-close" @tap="adverclose">
			<i class="icox icox-guanbi-copy"></i>
		</view>
	</view>
	<view v-if="adveradmin && startadv.params.style == 'small-bot'" :style="'opacity: ' + startadv.style.opacity + '; background: ' + startadv.style.background + ';width: 100%;height: 100%; position: fixed;top: 0;left: 0; z-index: 19;'"></view>
</block>
<!--广告end-->
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									