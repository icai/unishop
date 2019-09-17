import Vue from 'vue';
import App from './App';

import wxparse from "./components/wxParse.vue";
Vue.component('wxparse', wxparse);

import diyform from "./components/diyform.vue";
Vue.component('diyform', diyform);

import tpl_list from "./components/tpl_list.vue";
Vue.component('tpl_list', tpl_list);

import wxparsevideo from "./components/wxParseVideo.vue";
Vue.component('wxparsevideo', wxparsevideo);

import wxparseimg from "./components/wxParseImg.vue";
Vue.component('wxparseimg', wxparseimg);

import wxemojiview from "./components/WxEmojiView.vue";
Vue.component('wxemojiview', wxemojiview);

import wxparsebr from "./components/WxParseBr.vue";
Vue.component('wxparsebr', wxparsebr);

import wxparse0 from "./components/wxParse0.vue";
Vue.component('wxparse0', wxparse0);

import wxparse1 from "./components/wxParse1.vue";
Vue.component('wxparse1', wxparse1);

import wxparse2 from "./components/wxParse2.vue";
Vue.component('wxparse2', wxparse2);

import wxparse3 from "./components/wxParse3.vue";
Vue.component('wxparse3', wxparse3);

import wxparse4 from "./components/wxParse4.vue";
Vue.component('wxparse4', wxparse4);

import wxparse5 from "./components/wxParse5.vue";
Vue.component('wxparse5', wxparse5);

import wxparse6 from "./components/wxParse6.vue";
Vue.component('wxparse6', wxparse6);

import wxparse7 from "./components/wxParse7.vue";
Vue.component('wxparse7', wxparse7);

import wxparse8 from "./components/wxParse8.vue";
Vue.component('wxparse8', wxparse8);

import wxparse9 from "./components/wxParse9.vue";
Vue.component('wxparse9', wxparse9);

import wxparse10 from "./components/wxParse10.vue";
Vue.component('wxparse10', wxparse10);

import wxparse11 from "./components/wxParse11.vue";
Vue.component('wxparse11', wxparse11);

import undefined from "./components/undefined.vue";
Vue.component('undefined', undefined);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
