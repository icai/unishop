<template>
<view>
<view class="fui-tabbar style1" v-if="diyitem.id == 'tabbar' && diyitem.style.showtype == '1'">
  <block v-for="(items, index) in diyitem.data" :key="index">
    <view v-if="diyitem.status == undefined || diyitem.status == '' || !diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (index == 0 ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground +';border-color:' + diyitem.style.activecolor  : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabwidget" :data-url="items.linkurl">
      {{items.text || '选项'}}
    </view>
    <view v-if="diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (diyitem.status == index ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground + ';border-color:' + diyitem.style.activecolor : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabwidget" :data-url="items.linkurl">
      {{items.text || '选项'}}
    </view>
  </block>
</view>
<view class="fui-tabbar style2" v-if="diyitem.id == 'tabbar' && diyitem.style.showtype == '2'">
  <block v-for="(items, index) in diyitem.data" :key="index">
    <view v-if="diyitem.status == undefined || diyitem.status == '' || !diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (index == 0 ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground +';border-color:' + diyitem.style.activecolor  : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabwidget" :data-url="items.linkurl">
      {{items.text || '选项'}}
    </view>
    <view v-if="diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (diyitem.status == index ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground + ';border-color:' + diyitem.style.activecolor : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabwidget" :data-url="items.linkurl">
      {{items.text || '选项'}}
    </view>
  </block>
</view>
<block v-for="(items, index) in diyitem.data" :key="index">
  <view v-if="diyitem.status == '' || diyitem.status == undefined">
    <include v-if="index == 0" src="/pages/diy/template/tpl_tabbarlist.wxml"></include>
  </view>
  <view v-else>
    <include v-if="diyitem.status == index" src="/pages/diy/template/tpl_tabbarlist.wxml"></include>
  </view>
  
</block>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									