<script setup lang="ts">
import { ISiteInfo } from '@/api/api.model'
import { API } from '@/api/apis'
import { ref } from 'vue'
import {
  DashboardTrack, DashboardEffect, DashboardInquiry, DashboardTotal,
  DashboardPieChart, DashboardSchedule,
  // DashboardToolKit
} from './components'
const res = await API.site.getSiteList<ISiteInfo[]>({})
const site = ref(res.data[0] ?? {})
</script>

<template>
  <div class="overflow-hidden">
    <div class="mb-6">
      <DashboardTrack v-model:site="site"></DashboardTrack>
    </div>
    <div class="mb-6">
      <DashboardSchedule v-model:site="site"></DashboardSchedule>
    </div>
    <div class="mb-6">
      <DashboardTotal v-model:site="site"></DashboardTotal>
    </div>
    <!-- <div class="mb-6">
      <DashboardToolKit v-model:site="site"></DashboardToolKit>
    </div> -->
    <div class="mb-6 flex justify-start items-center space-x-6 overflow-x-auto">
      <div class="flex-1">
        <DashboardEffect class="min-w-[680px]"></DashboardEffect>
      </div>
      <div class="flex-none min-w-[380px] w-[380px]">
        <DashboardPieChart></DashboardPieChart>
      </div>
    </div>
    <div class="mb-6">
      <DashboardInquiry></DashboardInquiry>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
