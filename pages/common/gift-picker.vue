<template>
<view :class="'picker-modal ' + (gift?'in':'out') + ' ' + iphonexnavbar">
    <view class="gift-picker">
        <radio-group class="radio-group">
        <view class="option-picker-inner gift-picker">
          <view class="gifttitle" :style="(goods.gifts.length==1?'margin-bottom:15rpx':'')" @tap="emptyActive">{{goods.gifts.length>1?'选择':''}}赠品 <text class="icox icox-close pull-right"></text> </view>
          <view class="gift-list-group">
            <view class="gift-list" v-for="(item, index) in goods.gifts" :key="index">
              <label class="radio" v-if="goods.gifts.length>1 && item.canchose == 1" :data-giftgoodsid="item.id" :data-title="item.title" @tap="radioChange">
                <radio :value="item.id" checked color="red"></radio>{{item.title}}
              </label>
              <label class="radio" v-if="goods.gifts.length>1 && item.canchose == 0">
               {{item.title}}
              </label>
              <navigator v-for="(val, index2) in item.gift" :key="index2" :url="'/pages/goods/detail/index?id=' + val.id">
                <view class="fui-list" style="background: #f9f9f9">
                <view class="sold-out-gift" v-if="val.total == 0">已售罄</view>
                  <view class="fui-list-media">
                      <image :src="val.thumb"></image>
                  </view>
                  <view class="fui-list-inner">
                      <view class="subtitle">{{val.title}}</view>
                      <view class="row">
                          <view class="row-text">{{val.marketprice}}</view>
                      </view> 
                  </view>
                </view>
              </navigator>
            </view>
          </view>
        </view>     
      </radio-group>
      <view class="fui-navbar" @tap="emptyActive"><view class="nav-item btn" style="background:#ff5555">确定</view></view>
    </view>
	</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									