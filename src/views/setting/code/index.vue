
<script setup lang='ts'>
import { CommonTab } from '@/components/common'
import { UseCodeService } from './shared/useCode.service'
import {
  CodeGa,
  // CodeAd,
  CodeInquiry
} from './components'

const { tabList, activeTab } = new UseCodeService().useCode()
</script>

<template>
  <div class=''>
    <CommonTab :tabList="tabList" v-model:activeTab="activeTab"></CommonTab>
    <CodeGa v-if="activeTab === 'ga'"></CodeGa>
    <!-- <CodeAd v-else-if="activeTab === 'ad'"></CodeAd> -->
    <CodeInquiry v-else-if="activeTab === 'inquiry'"></CodeInquiry>
  </div>
</template>

<style lang='scss' scoped>
</style>
