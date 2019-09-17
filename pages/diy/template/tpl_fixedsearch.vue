<template>
<!--固定搜索框-->
<block>
    <view class="diy-fixedsearch fixed">
        <view class="background" :style="'background:' + diyitem.style.background + ';opacity:' + diyitem.style.opacity"></view>
        <view class="inner">
            <view :data-url="diyitem.params.leftnavlink" @tap="navigate" class="leftnav" v-if="diyitem.params.leftnav>0">
                <text :class="'icox ' + diyitem.params.leftnavicon" :style="'color:' + diyitem.style.leftnavcolor" v-if="diyitem.params.leftnav==1"></text>
                <image :src="diyitem.params.leftnavimg" v-if="diyitem.params.leftnav==2"></image>
            </view>
            <navigator :class="'center ' + diyitem.params.searchstyle" data-url="/pages/goods/index/index?fromsearch=1" @tap="navigate">
              <view :style="'background:' + diyitem.style.searchbackground + ';color:' + diyitem.style.searchtextcolor">
                {{diyitem.params.placeholder}}
              </view>
            </navigator>
            <view class="rightnav" :data-url="diyitem.params.rightnavlink" @tap="navigate" v-if="diyitem.params.rightnav>0">
              <text :class="'icox ' + diyitem.params.rightnavicon" :style="'color:' + diyitem.style.rightnavcolor" v-if="diyitem.params.rightnav==1"></text>
              <image :src="diyitem.params.rightnavimg" v-if="diyitem.params.rightnav==2"></image>
            </view>
        </view>
    </view>
</block>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									