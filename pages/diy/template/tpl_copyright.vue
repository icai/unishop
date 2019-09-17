<template>
<view>
<block v-if="!copyright">
  <block v-if="diyitem.style.showtype != 0">
    <view class="fui-copyright-group">
      <image :src="diyitem.params.imgurl" v-if="diyitem.params.showimg == 1"></image>
      <span class="copyright_cover" style="text-align:left; font-size: 24rpx; vertical-align: middle;max-width:530rpx;display:inline-block;">
        {{diyitem.params.copyright}}
      </span>
    </view>
  </block>
  <block v-if="diyitem.style.showtype == 0">
    <view class="fui-copyright2-group">
      <image :src="diyitem.params.imgurl" v-if="diyitem.params.showimg == 1" style="width: 60rpx;height: 60rpx;"></image>
      <view class="copyright_cover" style="font-size: 24rpx;line-height: 60rpx;">{{diyitem.params.copyright}}</view>
    </view>
  </block>
</block>


<!--下面版权，只适用于商品详情页  -->
<block v-else>
  <block v-if="copyright.style.showtype != 0">
    <view class="fui-copyright-group">
      <image :src="copyright.params.imgurl" v-if="copyright.params.showimg == 1"></image>
      <span class="copyright_cover" style="text-align:left; font-size: 24rpx; vertical-align: middle;max-width:530rpx;display:inline-block;">
        {{copyright.params.copyright}}
      </span>
    </view>
  </block>
  <block v-if="copyright.style.showtype == 0">
    <view class="fui-copyright2-group">
      <image :src="copyright.params.imgurl" v-if="copyright.params.showimg == 1" style="width: 60rpx;height: 60rpx;"></image>
      <view class="copyright_cover" style="font-size: 24rpx;line-height: 60rpx;">{{copyright.params.copyright}}</view>
    </view>
  </block>
</block>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									