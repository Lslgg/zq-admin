
<script setup lang='ts'>
import { CommonTab } from '@/components/common'
import { DesignCodeService } from './shared/designCode.service'
import CodeAll from './components/codeAll.vue'
import CodeDesign from './components/codeDesign.vue'
const { tabList, activeTab } = new DesignCodeService().useCode()
</script>

<template>
  <div class=''>
    <CommonTab :tabList="tabList" v-model:activeTab="activeTab" />
    <CodeAll v-if="activeTab === 'global'" />
    <CodeDesign v-else-if="activeTab === 'list-detail'" :type="1" />
    <CodeDesign v-else-if="activeTab === 'system'" :type="2" />
    <CodeDesign v-else-if="activeTab === 'single'" :type="0" />
  </div>
</template>

<style lang='scss' scoped>
</style>
