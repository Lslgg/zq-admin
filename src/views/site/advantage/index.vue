<script setup lang='ts'>
import { UseAdvantage } from './shared/useAdvantage.service'
import { CommonTab } from '@/components/common'
import { SiteAdvantage, SiteHonor, SiteFaq } from './components'

const { tabList, activeTab } = UseAdvantage()
</script>

<template>
  <div class>
    <CommonTab :tabList="tabList" v-model:activeTab="activeTab"></CommonTab>
    <SiteAdvantage v-if="activeTab === 'advantage'"></SiteAdvantage>
    <SiteHonor v-else-if="activeTab === 'honor'"></SiteHonor>
    <SiteFaq v-else-if="activeTab === 'faq'"></SiteFaq>
  </div>
</template>

<style lang='scss' scoped>
</style>
