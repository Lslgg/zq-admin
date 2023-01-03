<script setup lang='ts'>
import { ref } from 'vue'
import { CodeStatistics } from './components'
import { CommonTab } from '@/components/common/'
import CodeValidation from './components/codeValidation.vue'
import CodeCookie from './components/codeCookie.vue'
const activeTab = ref(1)
const tabList = [
  { title: 'Cookie声明', value: 1 },
  { title: '搜索引擎验证', value: 2 },
  { title: '扩展代码', value: 3 }
]
</script>

<template>
  <div class=''>
    <CommonTab v-model:activeTab="activeTab" :tab-list="tabList">
      <div class="">
        <CodeCookie v-if="activeTab === 1"></CodeCookie>
        <CodeValidation v-if="activeTab === 2"></CodeValidation>
        <CodeStatistics v-if="activeTab === 3"></CodeStatistics>
      </div>
    </CommonTab>
  </div>
</template>

<style lang='scss' scoped>
</style>
