<template>
<view class="fui-cell-group fui-comment-group" v-if="packagegoods">
         <navigator :url="'/pages/goods/package/index?id=' + packagegoodsid">
          <view class="fui-cell fui-cell-click">
              <view class="fui-cell-text desc">{{packageList.title}}</view>
              <text class="fui-cell-text desc label" :url="'/pages/goods/package/index?id=' + packagegoodsid">更多套餐</text>
              <view class="fui-cell-remark"></view>
          </view>
          </navigator>
          <view id="package">
            <navigator id="package_list" hover-class="none" :style="'width:' + packageList.goods.length*220-20 + 'rpx'" :url="'/pages/goods/package/detail/index?id=' + packageList.id">
              <view class="package-goods package-goods3" v-for="(item, index) in packageList.goods" :key="index">
                <image class="package-goods-img" :src="item.thumb"></image>
                <p>{{item.title}}</p>
                <text class="icox icox-tianjiazhuanhuan"></text>
              </view>
            </navigator>
          </view>
        </view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									