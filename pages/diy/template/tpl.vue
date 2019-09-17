<template>
<view>
<include src="/pages/diy/template/tpl_fixedsearch.wxml" v-if="diyitem.id=='fixedsearch' && istopmenu != true"></include> 
   <include src="/pages/diy/template/tpl_banner.wxml" v-if="diyitem.id=='banner'"></include>  
  <include src="/pages/diy/template/tpl_search.wxml" v-if="diyitem.id=='search'"></include> 
  <include src="/pages/diy/template/tpl_notice.wxml" v-if="diyitem.id=='notice'"></include> 
  <include src="/pages/diy/template/tpl_line.wxml" v-if="diyitem.id=='line'"></include> 
  <include src="/pages/diy/template/tpl_blank.wxml" v-if="diyitem.id=='blank'"></include> 
  <include src="/pages/diy/template/tpl_title.wxml" v-if="diyitem.id=='title'"></include> 
  <include src="/pages/diy/template/tpl_menu.wxml" v-if="diyitem.id=='menu'"></include> 
  <include src="/pages/diy/template/tpl_menu2.wxml" v-if="diyitem.id=='menu2'"></include> 
  <include src="/pages/diy/template/tpl_listmenu.wxml" v-if="diyitem.id=='listmenu'"></include> 
  <include src="/pages/diy/template/tpl_picture.wxml" v-if="diyitem.id=='picture'"></include>
  <include src="/pages/diy/template/tpl_picturew.wxml" v-if="diyitem.id=='picturew'"></include>  
  <include src="/pages/diy/template/tpl_coupon.wxml" v-if="diyitem.id=='coupon'"></include>  
  <include src="/pages/diy/template/tpl_goods.wxml" v-if="diyitem.id=='goods'"></include>  
  <include src="/pages/diy/template/tpl_richtext.wxml" v-if="diyitem.id=='richtext'"></include> 
    <include src="/pages/diy/template/tpl_video.wxml" v-if="diyitem.id=='video'"></include>
    <include src="/pages/diy/template/tpl_copyright.wxml" v-if="diyitem.id=='copyright' && !copyright"></include>
    <include src="/pages/diy/template/tpl_topmenu.wxml" v-if="diyitem.id == 'topmenu'"></include>
    <include src="/pages/diy/template/tpl_tabbar.wxml" v-if="diyitem.id=='tabbar'"></include>
  <include src="/pages/diy/template/tpl_seckillgroup.wxml" v-if="diyitem.id=='seckillgroup'"></include>
  <!-- 会员中心 -->
    <include src="/pages/diy/template/tpl_memberhead.wxml" v-if="diyitem.id=='member'"></include>
    <include src="/pages/diy/template/tpl_bindmobile.wxml" v-if="diyitem.id=='bindmobile'"></include>
    <include src="/pages/diy/template/tpl_logout.wxml" v-if="diyitem.id=='logout'"></include>
    <include src="/pages/diy/template/tpl_verifygoods.wxml" v-if="diyitem.id=='verify'"></include>
    <include src="/pages/diy/template/tpl_pictures.wxml" v-if="diyitem.id=='pictures'"></include>
    <include src="/pages/diy/template/tpl_icongroup.wxml" v-if="diyitem.id=='icongroup'"></include>
    <include src="/pages/diy/template/tpl_audio.wxml" v-if="diyitem.id=='audio'"></include>
      <!-- 商品详情 -->
  <include src="/pages/diy/template/tpl_detail_swipe.wxml" v-if="diyitem.id=='detail_swipe'"></include>
  <include src="/pages/diy/template/tpl_detail_info.wxml" v-if="diyitem.id=='detail_info'"></include>
  <include src="/pages/diy/template/tpl_detail_sale.wxml" v-if="diyitem.id=='detail_sale'"></include>
  <include src="/pages/diy/template/tpl_detail_spec.wxml" v-if="diyitem.id=='detail_spec'"></include>
  <include src="/pages/diy/template/tpl_detail_package.wxml" v-if="diyitem.id=='detail_package'"></include>
  <include src="/pages/diy/template/tpl_detail_shop.wxml" v-if="diyitem.id=='detail_shop'"></include>
  <include src="/pages/diy/template/tpl_detail_buyshow.wxml" v-if="diyitem.id=='detail_buyshow'"></include>
  <include src="/pages/diy/template/tpl_detail_comment.wxml" v-if="diyitem.id=='detail_comment'"></include>
  <include src="/pages/diy/template/tpl_detail_navbar.wxml" v-if="diyitem.id=='detail_navbar'"></include>
  <include src="/pages/diy/template/tpl_detail_seckill.wxml" v-if="diyitem.id=='detail_seckill'"></include>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									