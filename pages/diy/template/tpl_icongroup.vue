<template>
<view :class="'fui-icon-group noborder col-' + diyitem.params.rownum" :style="'background:' + diyitem.style.background">
    <block v-for="(item, index) in diyitem.data" :key="index">
      <navigator :data-url="item.linkurl" @tap="navigate" class="fui-icon-col">
          <view class="badge" v-if="item.dotnum>0" :style="'background:' + diyitem.style.dotcolor">{{item.dotnum}}</view>
          <view class="icon icon-green radius"><i :class="'icox ' + item.iconclass" :style="'color:' + diyitem.style.iconcolor"></i></view>
          <view class="text" :style="'color:' + diyitem.style.textcolor">{{item.text}}</view>
      </navigator>
    </block>
  </view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									