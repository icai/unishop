<template>
<block v-if="diyitem.id == 'tabbar'">
  <view v-if="(diyitem.type != 'stores' || diyitem.type == 'goods') && diyitem.type != ''" class="fui-goods-group block" style="background:#f3f3f3">
    <view class="fui-goods-item" v-for="(item, index) in diyitem.data[index].data" :key="index">
      <navigator :url="'/pages/goods/detail/index?id=' + item.id" :class="'image ' + (diyitem.params.showicon=='1'?diyitem.style.iconstyle:'')" :data-text="diyitem.style.goodsicon" :style="'background-image:url(' + item.thumb + ')'">
      <!--售罄  -->
            <image class="salez" :src="(item.total <= 0?'/static/images/saleout-2.png':diyitem.params.saleout)" v-if="item.total <=0"></image>
      <!--分销佣金  -->
            <view v-if="item.cansee>0 && item.seecommission>0" class="goods-Commission">{{item.seetitle}}￥{{item.seecommission}}</view> 
      </navigator>
      <view class="detail">
        <navigator :url="'/pages/goods/detail/index?id=' + childitem.gid" class="name" :style="'color:' + diyitem.style.titlecolor">
          <text>{{item.title}}</text>
        </navigator>
        <view class="price">
          <text class="text" :style="'color:' + diyitem.style.pricecolor">￥{{item.minprice}}</text>
          <navigator :url="'/pages/goods/detail/index?id=' + item.id">
            <text class="buy buybtnbtn buybtn-1" :style="'color:' + diyitem.style.buybtncolor + ';border-color:' + diyitem.style.buybtncolor" @tap="selectPicker" data-buytype="buy" :data-id="childitem.gid">购买</text>
          </navigator>
        </view>
      </view>
    </view>
           <block v-if="diyitem.status == undefined || diyitem.status == ''">
      <view v-if="diyitem.data[0].showmore != true && diyitem.data[0].data.length > 0" class="getmore" @tap="getstoremore" :data-id="diyitemid" style="text-align: center;line-height: 72rpx;font-size: 26rpx;color: #999;">查看更多</view>
    </block>
    <block v-else>
      <view v-if="diyitem.data[diyitem.status].showmore != true && diyitem.data[diyitem.status].data.length > 0" class="getmore" @tap="getstoremore" :data-id="diyitemid" style="text-align: center;line-height: 72rpx;font-size: 26rpx;color: #999;">查看更多</view>
      </block>
  </view>

   <view class="fui-tabbar-content" v-else-if="diyitem.type == 'stores'">  
    <block v-for="(item, index) in diyitem.data[index].data" :key="index">
      <navigator open-type="navigate" :url="'/pages/order/store/map?id=' + item.id" class="tabbar-list">
        <text>{{ item.storename }}</text>
        <i class="icox icox-dingwei1"></i>
      </navigator>
    </block>
           <block v-if="diyitem.status == undefined || diyitem.status == ''">
      <view v-if="diyitem.data[0].showmore != true && diyitem.data[0].data.length > 0" class="getmore" @tap="getstoremore" :data-id="diyitemid" style="text-align: center;line-height: 72rpx;font-size: 26rpx;color: #999;">查看更多</view>
    </block>
    <block v-else>
      <view v-if="diyitem.data[diyitem.status].showmore != true && diyitem.data[diyitem.status].data.length > 0" class="getmore" @tap="getstoremore" :data-id="diyitemid" style="text-align: center;line-height: 72rpx;font-size: 26rpx;color: #999;">查看更多</view>
      </block>
  </view>
</block>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									