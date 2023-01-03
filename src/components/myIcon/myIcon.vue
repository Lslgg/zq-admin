<template>
  <IconFont :type="name" />
</template>

<script setup lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
// 声明props
defineProps({
  name: { type: String, default: 'icon-a-Group45' },
})
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3266842_0s6qrtqc5tje.js', // 在 iconfont.cn 上生成
})
</script>
