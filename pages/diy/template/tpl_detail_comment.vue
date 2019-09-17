<template>
<view :class="'goods-detail-comment ' + comment">
    <view class="fui-icon-group col-5 ">
        <view v-for="(item, index) in stararr" :key="index" class="fui-icon-col" data-level="item" @tap="comentTap" :data-type="index+1"><view :class="(commentObjTab==index+1?'text-danger':'')">{{index==0?'全部':''}}{{index==1?'好评':''}}{{index==2?'中评':''}}{{index==3?'差评':''}}{{index==4?'晒图':''}}<view :class="'count ' + (commentObjTab==index+1?'text-danger':'')">{{commentObj.count[item]}}</view></view></view>
    </view>
    <view class="fui-loading" v-if="loading">
        <view class="icon"></view>
        <view class="text">正在加载</view>
    </view>
    <view class="container" id="comments-all">
        <view class="fui-cell-group fui-comment-group">
            <block v-for="(item, index) in commentList" :key="index">
                <view class="fui-cell">
                    <view class="fui-cell-text comment ">
                        <view class="info head">
                            <view class="img"><image :src="item.headimgurl"></image></view>
                            <view class="nickname">{{item.nickname}}</view>
                            <view class="date">{{item.createtime}}</view>
                            <view class="star star1">
                                  <text v-for="(item2, index2) in stararr" :key="index2" :class="(item.level>=idx2+1?'shine':'')">★</text>
                            </view>
                        </view>
                        <view class="remark">{{item.content}}</view>
                        <view class="remark img">
                            <block v-for="(image, index2) in item.images" :key="index2">
                                <view class="img"><image :src="image" @tap="preview" :data-src="image" :data-urls="item.images"></image></view>
                            </block>
                        </view>
                        <block v-if="item.reply_content">
                            <view class="reply-content" style="background:#EDEDED;">
                                掌柜回复：{{item.reply_content}}
                                <view class="remark img">
                                    <block v-for="(replyImage, index2) in item.reply_images" :key="index2">
                                        <view class="img"><image :src="replyImage"></image></view>
                                    </block>
                                </view>
                            </view>
                        </block>
                        <block v-if="item.append_content && item.replychecked==0">
                            <view class="remark reply-title">用户追加评价</view>
                            <view class="remark">{{item.append_content}}</view>
                        </block>
                        <block v-if="item.append_reply_content">
                            <view class="reply-content" style="background:#EDEDED;">
                                掌柜回复：{{item.append_reply_content}}
                                <view class="remark img">
                                    <block v-for="(appendReplyImage, index2) in item.append_reply_images" :key="index2">
                                        <view class="img"><image :src="appendReplyImage"></image></view>
                                    </block>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </block>
        </view>
        <view class="fui-cell-group fui-comment-group"></view>
    </view>
    <view class="content-empty" :style="(commentEmpty?'display:block':'display:none')">暂时没有任何评价</view>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									