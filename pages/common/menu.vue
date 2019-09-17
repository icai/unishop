<template>
<view>
<view class="fui-navbar" hidden>
    <navigator :class="'nav-item ' + route!='home'||'active'" hover-class="none" url="/pages/index/index" open-type="reLaunch">
        <image class="icon" :src="(route=='home'?icons.home_red:icons.home)"></image>
        <text class="label">商城首页</text>
    </navigator>
    <navigator :class="'nav-item ' + route!='category'||'active'" hover-class="none" url="/pages/shop/caregory/index" open-type="reLaunch">
        <image class="icon" :src="(route=='category'?icons.cate_red:icons.cate)"></image>
        <text class="label">全部分类</text>
    </navigator>
    <navigator :class="'nav-item ' + route!='cart'||'active'" hover-class="none" url="/pages/member/cart/index" open-type="reLaunch">
        <view class="badge" v-if="cartcount>0">{{ cartcount }}</view>
        <image class="icon" :src="(route=='cart'?icons.cart_red:icons.cart)"></image>
        <text class="label">购物车</text>
    </navigator>
    <navigator :class="'nav-item ' + route!='member'||'active'" hover-class="none" url="/pages/member/index/index" open-type="reLaunch">
        <image class="icon" :src="(route=='member'?icons.people_red:icons.people)"></image>
        <text class="label">会员中心</text>
    </navigator>
</view>
<view :class="'fui-toast ' + (FoxUIToast.show?'in':'out')"><view class="text">{{FoxUIToast.text}}</view></view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									