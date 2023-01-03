<script setup lang="ts">
import { TemplateCard } from '@/components/template'
import { PieChart } from '@/components/chart'
import { API } from '@/api/apis'
// import { UseCommon } from '@/util/useCommon'
import { IInquiryPiceData } from '@/api/api.model'

const resData = await API.data.getDataInquirycount<{ inquiry_type: IInquiryPiceData[] }>({ type: 'inquiry_type' })
const picDataList = resData.data.inquiry_type || []
const picData = picDataList.filter(p => p.num > 0).map((p) => ({
  value: p.num,
  name: p.inquiry_type_text,
}))
// const goUrl = () => UseCommon.ins().goUrlName('statistics')
</script>

<template>
  <TemplateCard title="询盘类型统计">
    <template #subtitle>
      <!-- <a-button size="small" type="primary" @click="goUrl">了解更多</a-button> -->
    </template>
    <PieChart :list-data="picData" class="h-60" :legend="{ show: false }" radius="70%"></PieChart>
  </TemplateCard>
</template>

<style lang="scss" scoped>
</style>
