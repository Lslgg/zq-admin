<script setup lang="ts">
import { DiskInfo } from '@/api/api.model'
import { API } from '@/api/apis'
const res = await API.attachment.getAttachmentDiskInfo<DiskInfo>({})
let rate = res.data.used_rate
if (res.data.used_rate < 0.5) rate = 1
else if (res.data.used_rate > 100) rate = 100
const widthCss = `width:${rate}%`
</script>

<template>
  <div class="relative border rounded-2xl bg-gray-E7E7E7 overflow-hidden">
    <div
      class="bg-[#33963D] bg-opacity-60 absolute h-7 z-10 rounded-tl-2xl rounded-bl-2xl"
      :style="widthCss"
      :class="{ 'rounded-2xl': rate === 100 }"
    ></div>
    <div class="flex justify-around items-center h-7 z-10 leading-7">
      <span>已用空间{{ res.data.used_human }}/{{ res.data.total_human }}</span>
      <span>{{ rate }}%</span>
    </div>
  </div>
</template>
