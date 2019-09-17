<template>
<view>
<!--图片展播单页展示  --> 
<block v-if="diyitem.params.showtype==0" style>
  <view :class="'fui-pictures single row-' + diyitem.params.rownum" :style="'padding:' + diyitem.style.paddingtop*2 + 'rpx ' + diyitem.style.paddingleft*2 + 'rpx;background:' + diyitem.style.background + ';'">
    <block v-for="(item, index) in diyitem.data" :key="index">
      <view :data-url="item.linkurl" @tap="navigate" class="item" style="padding:10rpx">
          <view class="image" :style="'text-align:' + diyitem.style.titlealign + ';color:' + diyitem.style.titlecolor">
              <image :src="item.imgurl" mode="widthFix"></image>
              <view class="title" :style="'color:' + item.titlecolor">{{item.title}}</view>
          </view>
          <view class="text" :style="'text-align:' + diyitem.style.textalign + ';color:' + diyitem.style.textcolor">{{item.text}}</view>
      </view>
    </block>
  </view>
</block>
<!--图片展播滑动样式  -->
<block v-else>
  <view :style="'overflow:hidden;white-space:nowrap;padding:' + diyitem.style.paddingtop*2 + 'rpx ' + diyitem.style.paddingleft*2 + 'rpx;background:' + diyitem.style.background + ';'">
    <scroll-view :class="'fui-pictures row-' + diyitem.params.rownum" scroll-x>
    <block v-for="(item, index) in diyitem.data" :key="index">
      <view :data-url="item.linkurl" @tap="navigate" class="item" style="padding:10rpx">
        <view class="image" :style="'text-align:' + diyitem.style.titlealign + ';color:' + diyitem.style.titlecolor">
          <image :src="item.imgurl" mode="widthFix"></image>
          <view class="title" :style="'color:' + item.titlecolor">{{item.title}}</view>
        </view>
        <view class="text" :style="'text-align:' + diyitem.style.textalign + ';color:' + diyitem.style.textcolor">{{item.text}}</view>
      </view>  
    </block>  
  </scroll-view> 
  </view>
</block>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									