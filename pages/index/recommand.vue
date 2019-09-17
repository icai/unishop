<template>
<!--为您推荐start-->
<block v-if="item.data.length>0">
    <view class="fui-line" style="background: #f4f4f4;">
        <view class="text text-danger"><text class="icox icox-likefill"></text> 为您推荐</view>
    </view>
    <view :class="'fui-goods-group ' + (shop.goodsstyle>0?'':'block') + ' border'">  <!--{if empty($goodsstyle)} block{/if}-->
        <block v-for="(item, index) in item.data" :key="index">
            <view class="fui-goods-item" :data-goodsid="item.id" :data-type="item.type">
                <navigator :url="'/pages/goods/detail/index?id=' + item.id + '&frommyshop=1'" open-type="navigate">
                    <view class="image" :style="'background-image:url('' + item.thumb + '');'">
                        <block v-if="item.total<=0">
                        <view class="salez" style="background-image: url('{php echo tomedia($_W['shopset']['shop']['saleout'])}'); "></view> 
                        </block>
                        
                    </view>
                </navigator>
                <view class="detail">
                    <navigator :url="'/pages/goods/detail/index?id=' + item.id + '&frommyshop=1'" open-type="navigate">
                        <view class="name">
                            <block v-if="item.ispresell==1">
                            <text class="fui-tag fui-tag-danger">预售</text>
                            </block>
                            {{item.title}}
                        </view>
                    </navigator>
                    <view class="price">
                        <text class="text">￥{{item.minprice}}</text>
                    </view>
                </view>
            </view>
        </block>
    </view>
</block>
<!--为您推荐end-->
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									