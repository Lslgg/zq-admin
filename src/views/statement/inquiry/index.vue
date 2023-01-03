<script setup lang='ts'>
import { CommonTab } from '@/components/common'
import { UseInquryService } from './shared/useInquiry.service'
import { InquiryList, InquiryTrash, InquiryFilter, InquiryStatistics } from './components'

const { tabList, activeTab } = UseInquryService.useInqury()
</script>

<template>
  <div class>
    <CommonTab :tabList="tabList" v-model:activeTab="activeTab"></CommonTab>
    <InquiryList v-if="activeTab === 'list'" pageType="normal"></InquiryList>
    <InquiryTrash v-else-if="activeTab === 'trash'"></InquiryTrash>
    <InquiryFilter v-else-if="activeTab === 'filter'"></InquiryFilter>
    <InquiryStatistics v-else-if="activeTab === 'statistics'"></InquiryStatistics>
  </div>
</template>

<style lang='scss' scoped>
</style>
