<template>
<view>

  <block v-for="(item, index) in wxParseData" :key="index">
    <component :item="item" :is="wxParse0"></component>
  </block>

</view>
</template>

<script>
    export default {
    		name: "wxParse",
    		props: ["item"]
    	}
</script>
