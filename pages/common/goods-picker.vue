<template>
<block v-if="tempname=='select-picker' && !cycledate">
  <view :class="'fui-modal goods-picker ' + slider + ' ' + (minpicker=='quickbuy'?'goodslist':minpicker) + '  ' + iphonexnavbar">
    <view class="option-picker">
      <view class="option-picker-inner">
        <view class="option-picker-cell goodinfo" v-if="minpicker == 'goodsdetail'">
          <view class="closebtn" @tap="emptyActive">
            <i class="icox icox-guanbi1" style="font-size:44rpx"></i>
          </view>
          <view class="img">
            <image class="thumb" style="width:100%;height:100%;" :src="goods.thumb"></image>
          </view>
          <view class="info info-price text-danger">
            <span style="vertical-align: middle;">¥
              <span class="price">
                <block v-if="goods.ispresell>0 && (goods.preselltimeend == 0 || goods.preselltimeend > goods.thistime)">{{goods.presellprice}}</block>
                <block v-else-if="goods.isdiscount!=0 && goods.isdiscount_time >= now">{{goods.minprice}}</block>
                <block v-else>
                  <block v-if="goods.maxprice == goods.minprice">{{goods.marketprice}} </block>
                  <block v-else>{{goods.minprice}}~{{goods.maxprice}}</block>
                </block>
              </span>
            </span>
            <text class="cycle-tip" style="margin-left: 10rpx;position: reletive;top:-20rpx;" v-if="goods.type == 9">周期购</text>
            <!--分销佣金  -->
            <view v-if="goods.cansee>0 && goods.seecommission>0 && (!goods.seckillinfo || ( goods.seckillinfo && goods.seckillinfo.status==1))" :class="'option-Commission ' + (optionCommission?'show':'')">
           {{goods.seetitle}}￥{{goods.seecommission}}
            </view>
          </view>
          <view class="info info-total">
            <block v-if="!goods.seckillinfo || ( goods.seckillinfo && goods.seckillinfo.status==1)">
              <block v-if="goods.showtotal==1">
                库存
                <text class="total text-danger">{{goods.total}}</text>件
              </block>
            </block>
          </view>
          <view class="info info-titles">
            <block v-if="pickerOption.specs.length>0">{{specsTitle==''?'请选择规格':'已选 '+specsTitle}}</block>
          </view>
        </view>
        <view v-else class="fui-list">
          <view class="fui-list-media">
            <image class="thumb" :src="goods.thumb"></image>
          </view>
          <view class="fui-list-inner">
            <view class="subtitle">
              {{goods.title}}
            </view>
            <view class="price">
              <span>¥
                <span class="price">
                  <block v-if="goods.ispresell>0 && (goods.preselltimeend == 0 || goods.preselltimeend > goods.thistime)">
                    <text v-if="goods.hasoption == 1 && goods.maxprice != goods.minprice">{{ goods.minprice }}~{{ goods.maxprice }}</text>
                    <text v-else>{{goods.presellprice}}</text>
                  </block>
                  <block v-else>
                    <block v-if="goods.maxprice == goods.minprice">{{goods.marketprice}}</block>
                    <block v-else>{{goods.minprice}}~{{goods.maxprice}}</block>
                  </block>
                </span>
              </span>
            </view>
          </view>

        </view>
        <view class="option-picker-options">
          <block v-for="(spec, index) in pickerOption.specs" :key="index">
            <view class="option-picker-cell option spec">
              <view class="title">{{spec.title}}</view>
              <view class="select">
                <block v-for="(item, index2) in spec.items" :key="index2">
                  <a href="javascript:;" :class="'btn btn-default btn-sm nav spec-item ' + (specsData[idx].id==item.id?'btn-danger':'')" :data-id="item.id" :data-thumb="item.thumb" @tap="specsTap" :data-idx="idx" :data-title="item.title">{{item.title}}</a>
                </block>
              </view>
            </view>
          </block>
          
          <!--周期购 预计送达时间 start  -->
          <view class="option-picker-cell option" v-if="goods.type == 9">
            <view class="title">预计送达时间</view>
            <view style="font-size:24rpx;color:#999;">买家需要提前{{ goods.ahead_goods }}天下单，才能在最近的配送周期送达</view>
            <view class="select">
              <block>
                <a href="javascript:;" class="btn btn-default btn-sm nav spec-item btn-danger" data-id data-thumb @tap="specsTap" :data-idx="idx" data-title>{{currentDate}}</a>
                <text class="btn-sm nav spec-item" style="line-height: 52rpx;color: #ff5555;" @tap="editdate">修改</text>
              </block>
            </view>
          </view>
          <!--周期购 预计送达时间 end  -->

          <include src="/pages/common/diyform.wxml"></include>
          <view class="fui-cell-group nomargin" v-if="goods.type != 9 && (!goods.seckillinfo || (seckillinfo && seckillinfo.status==1))">
            <view class="fui-cell">
              <view class="fui-cell-label">数量</view>
              <view class="fui-cell-info"></view>
              <view class="fui-cell-mask noremark">
                <view class="fui-number" @tap="number" :data-min="goods.minbuy" :data-value="total" :data-max="goods.maxbuy" :data-id="goods.id">
                  <view :class="'minus ' + (total*1<=goods.minbuy*1 || total<=1 ?'disabled':'' )" data-action="minus">-</view>
                  <input class="num" type="number" name @blur="inputNumber" :value="total"></input>
                  <view :class="'plus ' + (total*1>=goods.maxbuy*1 && goods.maxbuy!=0?'disabled':'')" data-action="plus">+</view>
                </view>
              </view>
            </view>
          </view>

          <view class="fui-cell-group fui-sale-group" v-if="goods.giftinfo">
              <view class="fui-cell">
                <view class="fui-cell-label" style="color:#000;width:98rpx">赠品</view>
                <radio-group>
                  <view class="gift-list flex" style="align-items: center;border-top: 1px solid #eee" v-for="(item, index) in goods.giftinfo" :key="index" @tap="chooseGift" :data-id="item.id">
                    <view class="radio">
                      <radio color="#ff5555" value="1" class="fui-radio fui-radio-danger" :data-id="item.id" :checked="(giftid==item.id?'checked':'')"></radio>
                    </view>
                    <view class="flex1">
                      <view v-for="(item, index2) in item.gift" :key="index2" class="fui-list" style="background: #fff;">
                        <view class="flex gift-goods-group">
                          <image :src="item.thumb"></image>
                          <view class="gift-title">{{item.title}}</view>
                          <view class="subtitle">￥{{item.marketprice}}</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </radio-group>
              </view>
            </view>
        </view>
      </view>
      <view :class="'fui-navbar ' + iphonexnavbar">
        <!-- 快速购买picker -->
        <block v-if="pagepicker=='quickbuy'">
          <a href class="nav-item btn cartbtn" @tap="getCart" v-if="modeltakeout!='cantaddcart'">加入购物车</a>
          <a href class="nav-item btn buybtn" @tap="buyNow" data-type="goods_detail" v-if="modeltakeout=='shopmodel'||modeltakeout=='cantaddcart'">立刻购买</a>
        </block>
        <block v-if="pagepicker=='goodslist'">
          <a href class="nav-item btn cartbtn" @tap="getCart" v-if="!goods.giftinfo">加入购物车</a>
          <a href class="nav-item btn buybtn" @tap="buyNow" data-type="goods_detail">立刻购买</a>
        </block>
        <block v-if="pagepicker!='goodslist' && pagepicker!='quickbuy'">
          <a href="javascript:;" :class="'nav-item btn confirmbtn ' + (canBuy!=''?'disabled':'')" @tap="canBuy==''&&buyType=='cart'?'getCart':''{{canBuy==''&&buyType=='buy'?'buyNow':''}}{{canBuy==''&&buyType=='select'?'select':''}}" :data-id="goods.id" :data-hasoption="goods.hasoption" :data-optionid="optionid" :data-total="total">{{canBuy==''?'确定':'库存不足'}}</a>
        </block>
      </view>
       <view v-if="pagepicker=='goodslist' ||pagepicker=='quickbuy'" class="icox icox-guanbi-copy" style="color:#fff;text-align:center;font-size:60rpx;margin-top:30rpx;" @tap="emptyActive"> </view> 
    </view>

  </view>
</block>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									