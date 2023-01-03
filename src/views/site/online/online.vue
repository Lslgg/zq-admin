
<script setup lang='ts'>
import { CommonTab } from '@/components/common'
import { Messager, WeChat, Whatsapp } from './components'
import { ref } from 'vue'
const tabList = [
  { title: 'Messenger', value: 1 },
  { title: 'Whatsapp', value: 2 },
  { title: 'WeChat', value: 3 },
]
const activeTab = ref(1)
</script>

<template>
  <div class='online'>
    <CommonTab :tabList="tabList" v-model:activeTab="activeTab">
      <div class="online-content p-8">
        <Messager v-if="activeTab === 1" />
        <Whatsapp v-if="activeTab === 2" />
        <WeChat v-if="activeTab === 3" />
      </div>
    </CommonTab>
  </div>
</template>

<style lang='scss' scoped>
</style>
