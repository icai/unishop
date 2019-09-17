<template>
<view class="inner">
		<view class="title">用户未授权</view>
		<view class="subtitle">您需要先允许【用户授权】，才能进行后续操作哦~</view>
		<view class="model-btns">
			<view class="cancel" @tap="cancelclick">取消</view>
      <button @getuserinfo="userinfo" @tap="confirmclick" open-type="getUserInfo">去授权</button>
		</view>
	</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									