<template>
<!--核销商品start-->
  <view class="fui-cell-group fui-cell-click" v-if="member.haveverifygoods">
    <navigator class="fui-cell external" url="/pages/verifygoods/index">
      <view class="fui-cell-icon"><i class="icox icox-qrcode"></i></view>
      <view class="fui-cell-text">待使用商品信息</view>
      <view class="fui-cell-remark"></view>
    </navigator>
    <block v-if="member.verifygoods.length>0">
      <view class="fui-icon-group selecter" style="overflow-X: scroll;">
        <view class="banner-ul" :style="'width:' + member.verifygoods.length*170 + 'px'">
          <block>
            <!-- <view class="banner-li">
              <navigator url='' open-type='navigate'>
                  <view></view>
                  <span>待使用</span>
                  <image src="" alt=""/>
                  <p>12445</p>
              </navigator>
            </view> -->
             <view v-for="(item, index) in member.verifygoods" :key="index" :class="'banner-li ' + (item.limitnum > 0 ? 'banner-li-blue' : '' )">
              <navigator :url="'/pages/verifygoods/detail/index?id=' + item.id" open-type="navigate">
                  <view></view>
                  <span>待使用</span>
                  <image :src="item.thumb" :alt="item.thumb"></image>
                  <p>{{item.title}}</p>
              </navigator>
            </view>
          </block>
        </view>
      </view>
    </block>
  </view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									