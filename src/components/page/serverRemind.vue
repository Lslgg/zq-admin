
<script setup lang='ts'>
// 服务提醒
import { CloseOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div class="flex justify-between items-center bg-white p-4 rounded-md shadow-lg">
    <div class="flex-1 flex justify-center items-center">
      <span>服务提醒，</span>
      <span class="mr-1">🎁🎁</span>
      <span>您有一个产品【我的网站 Lumussolem.com 】将 2022-02-30 18:00 到期，待续费</span>
    </div>
    <div class="basis-0 flex justify-between items-center space-x-4">
      <a-button
        class="bg-black text-white hover:bg-black focus:bg-black hover:border-black focus:border-block"
      >去续费</a-button>
      <close-outlined class="cursor-pointer" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
