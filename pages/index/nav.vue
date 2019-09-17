<template>
<!--导航菜单start-->
<block v-if="item.data.length>0">
    <view class="fui-icon-group col-4 noborder circle">
        <block v-for="(item, index) in item.data" :key="index">
            <navigator class="fui-icon-col" :url="item.url" open-type="navigate">
                <view><image :src="item.icon"></image></view>
                <view class="navs-navname">{{item.navname}}</view>
            </navigator>
        </block>
    </view>
</block>
<!--导航菜单end-->
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									