<template>
<!--魔方推荐start-->
<block v-if="item.data.length>0">
    <view class="fui-cube">
        <block v-if="item.data.length==1">
            <navigator :url="item.data[0].url" open-type="navigate">
                <image :src="item.data[0].img" mode="widthFix"></image>
            </navigator>                
        </block>
            
        <block v-if="item.data.length>1">
            <view class="fui-cube-left">
                <navigator :url="item.data[0].url" open-type="navigate">
                    <image :src="item.data[0].img" mode="widthFix"></image>
                </navigator> 
            </view>
            <view class="fui-cube-right">
                <block v-if="item.data.length==2">
                    <navigator :url="item.data[1].url" open-type="navigate">
                        <image :src="item.data[1].img" mode="widthFix"></image>
                    </navigator> 
                </block>
                <block v-if="item.data.length>2">
                    <view class="fui-cube-right1">
                        <navigator :url="item.data[1].url" open-type="navigate">
                            <image :src="item.data[1].img" mode="widthFix"></image>
                        </navigator>
                    </view>
                    <view class="fui-cube-right2">
                        <block v-if="item.data.length==3">
                            <navigator :url="item.data[2].url" open-type="navigate">
                                <image :src="item.data[2].img" mode="widthFix"></image>
                            </navigator>
                        </block>
                        <block v-if="item.data.length>3">
                            <view class="left">
                                <navigator :url="item.data[2].url" open-type="navigate">
                                    <image :src="item.data[2].img" mode="widthFix"></image>
                                </navigator>
                            </view>
                        </block>
                        <block v-if="item.data.length==4">
                            <view class="right">
                                <navigator :url="item.data[3].url" open-type="navigate">
                                    <image :src="item.data[3].img" mode="widthFix"></image>
                                </navigator>
                            </view>
                        </block>
                    </view>
                </block>
            </view>
        </block>
    </view>
</block>
<!--魔方推荐end-->
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									