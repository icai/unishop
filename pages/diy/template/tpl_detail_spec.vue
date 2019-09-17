<template>
<view>
<block v-if="goods.canbuy">
            <view class="fui-cell-group fui-cell-click" @tap="selectPicker" :data-id="goods.id" data-class="select-picker" :data-tap="active" data-buytype="select" :style="'background:' + diyitem.style.background + ';margin-top:' + (diyitem.style.margintop==0?0:diyitem.style.margintop + 'rpx') + ';margin-bottom:' + (diyitem.style.marginbottom==0?0:diyitem.style.marginbottom + 'rpx') + ';'">
                <view class="fui-cell" v-if="!isSelected">
                    <view class="fui-cell-text option-selector" :style="'color:' + diyitem.style.textcolor + ';'">请选择
                    <block v-if="goods.spec_titles">{{goods.spec_titles}}等</block>
                    <block v-else>数量</block></view>
                    <view class="fui-cell-remark"></view>
                </view>
                <view class="fui-cell" v-else>
                   <view class="fui-cell-info" :style="'color:' + diyitem.style.textcolor + ';'">已选：数量x{{total}} {{specsTitle}}</view>
                </view>
            </view>
        </block>
        <block v-else>
            <view class="fui-cell-group fui-cell-click">
                <view class="fui-cell">
                    <view class="fui-cell-text">
                        <block v-if="goods.userbuy==0">您已经超出最大{{goods.usermaxbuy}}件购买量</block>
                        <block v-else-if="goods.levelbuy==0">您当前会员等级没有购买权限</block>
                        <block v-else-if="goods.groupbuy==0">您所在的用户组没有购买权限</block>
                        <block v-else-if="goods.timebuy==-1">未到开始抢购时间!</block>
                        <block v-else-if="goods.timebuy==1">抢购时间已经结束!</block>
                        <block v-else-if="goods.total<=0">商品已经售罄!</block>
                    </view>
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
									