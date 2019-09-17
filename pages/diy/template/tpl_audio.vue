<template>
<view>
<block v-if="diyitem.params.playerstyle==0">
  <view class="fui-audio style3" :style="'background:' + diyitem.style.background + ';'">
    <view class="img">
      <image :src="diyitem.params.headurl"></image> 
      </view>
    <view class="content">
      <view class="name" :style="'color:' + diyitem.style.textcolor">{{diyitem.params.title}}</view>
      <view class="author" :style="'color:' + diyitem.style.subtitlecolor">{{diyitem.params.subtitle}}</view>
    </view>
    <view class="progress">
      <view class="progressBar" :style="'width:' + audiowidth + ';'"></view>
    </view>
    <view class="time" :style="'color:' + diyitem.style.timecolor">{{audios[diyitemid].audiotime}}</view>
    <view :class="'start icox ' + (audios[diyitemid].status?'icox-weibiaoti519':'icox-bofang')" :data-id="diyitemid" :data-time="audios[diyitemid].seconds || 0" @tap="play" :data-loopplay="diyitem.params.loopplay" :data-pausestop="diyitem.params.pausestop" :data-audio="diyitem.params.audiourl"></view>
  </view>
</block>
<block v-else>
  <view class="fui-audio style1">
    <view class="img">
      <image :src="diyitem.params.headurl"></image> 
      </view>
    <view class="content">
      <view class="name">{{diyitem.params.title}}</view>
      <view class="author">{{diyitem.params.subtitle}}</view>
    </view>
    <view class="progress">
      <view class="progressBar" :style="'width:' + audios[diyitemid].audiowidth + ';'"></view>
    </view>
    <view class="time">{{audios[diyitemid].audiotime}}</view>
    <view :class="'start icox ' + (audios[diyitemid].status?'icox-weibiaoti519':'icox-bofang')" :data-id="diyitemid" :data-time="audios[diyitemid].seconds || 0" @tap="play" :data-loopplay="diyitem.params.loopplay" :data-pausestop="diyitem.params.pausestop" :data-audio="diyitem.params.audiourl"></view>
  </view>
</block>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									