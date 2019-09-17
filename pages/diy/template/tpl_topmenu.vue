<template>
<view>
<view class="fui-topmenu fui-tabbar style1" v-if="diyitem.id == 'topmenu' && diyitem.style.showtype == '1'">
  <block v-for="(items, index) in diyitem.data" :key="index">
    <view v-if="diyitem.status == undefined || diyitem.status == '' || !diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (index == 0 ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground +';border-color:' + diyitem.style.activecolor  : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabtopmenu" :data-url="items.linkurl" :id="'m' + index" :data-index="'m' + index">
      {{items.text || '选项'}}
    </view>
    <view v-if="diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (diyitem.status == index ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground + ';border-color:' + diyitem.style.activecolor : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" :id="'m' + index" @tap="tabtopmenu" :data-url="items.linkurl" :data-index="'m' + index">
      {{items.text || '选项'}}
    </view>
  </block>
</view>
<view class="fui-topmenu fui-tabbar style2" v-if="diyitem.id == 'topmenu' && diyitem.style.showtype == '2'">
  <block v-for="(items, index) in diyitem.data" :key="index">
    <view v-if="diyitem.status == undefined || diyitem.status == '' || !diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (index == 0 ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground +';border-color:' + diyitem.style.activecolor  : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabtopmenu" :data-url="items.linkurl">
      {{items.text || '选项'}}
    </view>
    <view v-if="diyitem.status" class="item" :style="(diyitem.data.length <= 4 ? 'flex: 1;': 'flex-shrink:0;') + '' + (diyitem.status == index ? 'color:' + diyitem.style.activecolor + ';background:' + diyitem.style.activebackground + ';border-color:' + diyitem.style.activecolor : 'color:' + diyitem.style.color + ';background:' + diyitem.style.background)" :data-id="diyitemid" :data-type="index" @tap="tabtopmenu" :data-url="items.linkurl">
      {{items.text || '选项'}}
    </view>
  </block>
</view>

<include src="/pages/diy/template/tpl_tablist.wxml"></include>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									