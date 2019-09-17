<template>
<view>
<view :class="'fui-modal ' + ( code?'show':'hidden' )">
</view>
<view :class="'fui-modal-info ' + ( code?'show':'hidden' )">
    <view class="close">
        <image src="/static/images/icon-white/round_close-48.png" @tap="close"></image>
    </view>
    <image class="code" :src="qrcode"></image>
    <view class="tap">
        <view>如果无法扫描?</view>
        <view>请使用消费码或自提码核销</view>
        <view>(请将此二维码出示给店员进行核销)</view>
    </view>
</view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									