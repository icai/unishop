<template>
<view :class="'picker-modal city-picker ' + ( showPicker?'in':'out' ) + ' ' + iphonexnavbar">
    <view class="picker-control">
        <view class="cancel" @tap="onCancel">取消</view>
        <view class="confirm" @tap="onConfirm">确定</view>
    </view>
    <picker-view class="picker" indicator-style="height: 40px;" :value="pval" @change="bindChange" v-if="!noArea">
        <picker-view-column>
            <view class="item" v-for="(item, index) in areas" :key="index">{{ item.name }}</view>
        </picker-view-column>
        <picker-view-column>
            <view class="item" v-for="(item, index) in areas[pval[0]].city" :key="index">{{ item.name }}</view>
        </picker-view-column>
        <picker-view-column>
            <view class="item" v-for="(item, index) in areas[pval[0]].city[pval[1]].area" :key="index">{{ item.name }}</view>
        </picker-view-column>
    </picker-view>
    <picker-view class="picker" indicator-style="height: 40px;" :value="pval" @change="bindChange" v-if="noArea">
        <picker-view-column>
            <view class="item" v-for="(item, index) in areas" :key="index">{{ item.name }}</view>
        </picker-view-column>
        <picker-view-column>
            <view class="item" v-for="(item, index) in areas[pval[0]].city" :key="index">{{ item.name }}</view>
        </picker-view-column>
    </picker-view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									