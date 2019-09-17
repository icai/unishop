<template>

          <view class="fui-goods-item" :data-goodsid="item.id" :data-type="item.type">
              <navigator :url="( item.bargain > 0?'../../bargain/detail/detail?id='+item.bargain : '/pages/goods/detail/index?id='+item.id)" open-type="navigate">
                  <view class="image" :style="'background-image:url('' + item.thumb + '');'">
                      <block v-if="item.total<=0">
                      <view class="salez" style="background-image: url('{php echo tomedia($_W['shopset']['shop']['saleout'])}'); "></view></block>
                  </view>
              </navigator>
              <view class="detail">
                  <navigator :url="( item.bargain > 0?'../../bargain/detail/detail?id='+item.bargain : '/pages/goods/detail/index?id='+item.id)" open-type="navigate">
                      <view class="name">
                          <image src="/static/images/label.png" class="bargain_label" v-if="item.bargain > 0"></image>
                          <block v-if="item.ispresell==1"><text class="fui-tag fui-tag-danger">预售</text></block>
                          {{item.title}}
                      </view>
                  </navigator>
                  <view class="index_price price">
                      <text class="text">¥{{item.minprice}}</text>
                  </view>
              </view>
          </view>
      
</template>

<script>
    export default {
    		name: "tpl_list",
    		props: ["item"]
    	}
</script>
