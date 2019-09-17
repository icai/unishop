<template>

    <view class="fui-cell-group diyform-container" style="margin-top:0">
        <block v-for="(field, index) in diyform.diyformfields" :key="index">
            <view class="fui-cell">
                <view class="fui-cell-label ">{{ field.tp_name }}</view>
                <view class="fui-cell-info">
                   
                </view>
                <view class="fui-cell-remark noremark"> 
                    <view v-if="field.data_type==0 || field.data_type==1 || field.data_type==2 || field.data_type==6 || field.data_type==7 || field.data_type==14">{{ diyform.diyformdata[field.diy_type] }}</view>
                    <view v-if>{{ diyform.diyformdata[field.diy_type] }}</view>
                    <view v-if="field.data_type==3">
                        <text v-for="(item, index2) in diyform.diyformdata[field.diy_type]" :key="index2">{{ item }} </text>
                    </view>
                    <view v-if="field.data_type==5">
                        <view class="fui-images fui-images-sm">
                            <image class="image image-sm" v-for="(item, index2) in diyform.diyformdata[field.diy_type]" :key="index2" :src="item"></image>
                        </view>
                    </view>
                    <view v-if="field.data_type==8">{{ diyform.diyformdata[field.diy_type][0] }} 至 {{ diyform.diyformdata[field.diy_type][1] }}</view>
                    <view v-if="field.data_type==9">{{ diyform.diyformdata[field.diy_type].province+" "+diyform.diyformdata[field.diy_type].city  }}</view>
                    <view v-if="field.data_type==10">{{ diyform.diyformdata[field.diy_type].name1 }}</view>
                     <view v-if="field.data_type==11">{{ diyform.diyformdata[field.diy_type] }}</view>
                </view>
            </view>
        </block>
    </view>

</template>

<script>
    export default {
    		name: "diyform",
    		props: ["item"]
    	}
</script>
