<template>
<view v-if="diyform.fields!=null && diyform.fields.length>0" class="fui-cell-group diyform-container" style="margin-top:0px">
    <block v-for="(field, index) in diyform.fields" :key="index">
        <view :class="'fui-cell ' + ( field.tp_must?'must':'' )">
        	<view class="fui-cell-info " v-if="field.data_type == 13">{{ field.tp_name }}</view>
            <view class="fui-cell-label " v-if="field.data_type != 13">{{ field.tp_name }}</view>
            <view class="fui-cell-info wrap" v-if="field.data_type != 13">
                <!-- 单行输入框 -->
                <input wx-height="10rpx" :-height="10rpx" v-if="field.data_type==0" class="fui-input" :placeholder="field.placeholder" :value="diyform.f_data[field.diy_type]" @input="DiyFormHandler" data-type="input" :data-field="field.diy_type"></input>
                <!-- 多行文本 -->
                <textarea v-if="field.data_type==1" :placeholder="field.placeholder" @input="DiyFormHandler" data-type="textarea" :data-field="field.diy_type" :value="diyform.f_data[field.diy_type]"></textarea>
                <!-- 下拉框 -->
                <picker v-if="field.data_type==2" :value="diyform.f_data[field.diy_type][0]" :range="field.tp_text" @change="DiyFormHandler" data-type="picker" :data-field="field.diy_type">
                    <view>{{ diyform.f_data[field.diy_type][1] }}</view>
                </picker>
                <!-- 多选框 -->
                <checkbox-group v-if="field.data_type==3" @change="DiyFormHandler" data-type="checkbox" :data-field="field.diy_type">
                    <label v-for="(item, index2) in field.tp_text" :key="index2" class="checkbox-label">
                        <checkbox color="#ff5555" class="zoom-80 align-middle" :value="item" :checked="diyform.f_data[field.diy_type][item]" :name="item"></checkbox><text class="align-middle">{{ item }}</text>
                    </label>
                </checkbox-group>
                <!-- 上传图片 -->
                <view v-if="field.data_type==5">
                    <view class="fui-images fui-images-sm">
                        <image class="image image-sm" v-for="(item, index2) in diyform.f_data[field.diy_type].images" :key="index2" :src="item.url" @tap="DiyFormHandler" data-type="image-preview" :data-field="field.diy_type">
                            <span class="image-remove" @tap="DiyFormHandler" data-type="image-remove" :data-field="field.diy_type" :data-filename="item.filename"><text class="icox icox-close"></text></span>
                        </image>
                    </view>
                    <view class="fui-uploader fui-uploader-sm" @tap="DiyFormHandler" data-type="image" :data-field="field.diy_type" v-if="diyform.f_data[field.diy_type].count< field.tp_max"></view>
                </view>
                <!-- 身份证号 -->
                <input v-if="field.data_type==6" type="idcard" :value="diyform.f_data[field.diy_type]" placeholder="请输入身份证号码" @input="DiyFormHandler" data-type="input" :data-field="field.diy_type"></input>
                <!-- 日期选择选择 -->
                <picker v-if="field.data_type==7" mode="date" :value="diyform.f_data[field.diy_type]" @change="DiyFormHandler" data-type="date" :data-field="field.diy_type">
                    <view>{{ diyform.f_data[field.diy_type] || "请选择"+field.tp_name }}</view>
                </picker>
                <!-- 日期区间 -->
                <view v-if="field.data_type==8" class="picker-group">
                    <view class="diyform-pulldown2">
                      <picker mode="date" :value="diyform.f_data[field.diy_type][0]" @change="DiyFormHandler" data-type="datestart" :data-field="field.diy_type">
                          <view>{{ diyform.f_data[field.diy_type][0]||"开始日期" }}</view>
                      </picker>
                    </view>
                    <view style="float: left;display: inline-block;margin: 0 .5rem;color: #000;">至</view>
                    <view class="diyform-pulldown2">
                      <picker mode="date" :value="diyform.f_data[field.diy_type][1]" @change="DiyFormHandler" data-type="dateend" :data-field="field.diy_type">
                          <view>{{ diyform.f_data[field.diy_type][1]||"结束日期" }}</view>
                      </picker>
                    </view>
                </view>
                <!-- 城市 -->
                <view v-if="field.data_type==9" @tap="DiyFormHandler" data-type="city" :data-field="field.diy_type" :data-area="diyform.f_data[field.diy_type].province + ' ' + diyform.f_data[field.diy_type].city + ' ' + diyform.f_data[field.diy_type].area" :data-hasarea="field.tp_area">
                    <text v-if="!diyform.f_data[field.diy_type].province||!diyform.f_data[field.diy_type].city">请选择{{ field.tp_name }}</text>
                    <text v-else>{{ diyform.f_data[field.diy_type].province+" "+diyform.f_data[field.diy_type].city }} {{ field.tp_area==1?diyform.f_data[field.diy_type].area:'' }}</text>
                </view>
                <!-- 重复确认 -->
                <view v-if="field.data_type==10">
                    <input class="fui-input" :placeholder="field.tp_name" :value="diyform.f_data[field.diy_type].name1" @input="DiyFormHandler" data-type="input" :data-field="field.diy_type" data-name="name1" data-datatype="10"></input>
                </view>
                <!-- 时间选择 -->
                <picker v-if="field.data_type==11" mode="time" :value="diyform.f_data[field.diy_type]" @change="DiyFormHandler" data-type="time" :data-field="field.diy_type">
                    <view>{{ diyform.f_data[field.diy_type] || "请选择"+field.tp_name }}</view>
                </picker>
                <!-- 时间区间 -->
                <view v-if="field.data_type==12" class="picker-group">
                    <picker mode="time" :value="diyform.f_data[field.diy_type][0]" @change="DiyFormHandler" data-type="timestart" :data-field="field.diy_type">
                        <view>{{ diyform.f_data[field.diy_type][0] || "请选择"+field.tp_name[0] }}</view>
                    </picker>
                    <picker mode="time" :value="diyform.f_data[field.diy_type][0]" @change="DiyFormHandler" data-type="timeend" :data-field="field.diy_type">
                        <view>{{ diyform.f_data[field.diy_type][1] || "请选择"+field.tp_name[1] }}</view>
                    </picker>
                </view>
                <radio-group v-if="field.data_type==14" @change="DiyFormHandler" data-type="radio" :data-field="field.diy_type">
                    <label v-for="(item, index2) in field.tp_text" :key="index2" class="radiolabel">
                        <radio color="#ff5555" class="align-middle" :value="item" :checked="diyform.f_data[field.diy_type] == item" :name="item"></radio><text class="align-middle">{{ item }}</text>
                    </label>
                </radio-group>
            </view>
        </view>
        <view :class="'fui-cell ' + ( field.tp_must?'must':'' )" v-if="field.data_type==10">
            <view class="fui-cell-label">{{ field.tp_name2 }}
            </view>
            <view class="fui-cell-info">
                <input class="fui-input" :placeholder="field.tp_name2" :value="diyform.f_data[field.diy_type].name2" @input="DiyFormHandler" data-type="input" :data-field="field.diy_type" data-name="name2" data-datatype="10"></input>
            </view>
        </view>
    </block>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									