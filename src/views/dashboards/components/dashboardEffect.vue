<script setup lang="ts">
import { TemplateCard } from '@/components/template'
import { LineChart } from '@/components/chart'
import { API } from '@/api/apis'
const resDate = await API.data.getDataInquirytrend<{ date: string; num: number }[]>({})
const list = Array.isArray(resDate.data) ? resDate.data : []
const listData = [
  {
    name: '询盘',
    type: 'line',
    smooth: true,
    data: [...(list.map((p) => p.num) || [])],
  },
]
const xData = [...(list.map((p) => p.date) || [])]
</script>

<template>
  <div class="w-full">
    <TemplateCard title="询盘走势">
      <LineChart class="h-60" :listData="listData" :xData="xData" :legend="{ show: false }"></LineChart>
    </TemplateCard>
  </div>
</template>
<style lang="scss" scoped>
</style>
