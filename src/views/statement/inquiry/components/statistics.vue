<script setup lang="ts">
import { UseStatisticsService } from '../shared/useStatistics.service'
import { LineChart, PieChart, WorldChart } from '@/components/chart'
import TemplateCard from '@/components/template/templateCard.vue'
const {
  dateList,
  filters,
  list,
  sourceData,
  typeData,
  trendData,
  worldData,
  terminalData,
  isChange,
  onFilters
} = await new UseStatisticsService().useStatistics()
</script>

<template>
  <div class="overflow-hidden">
    <div class="flex items-center pb-4">
      <label>时间筛选：</label>
      <div>
        <a-select v-model:value="filters.date" @change="onFilters">
          <a-select-option v-for="item in dateList" :key="item.value" :value="item.value">{{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="px-2">
        <a-range-picker v-show="filters.date === 'auto'" v-model:value="filters.customerDate" />
      </div>
    </div>
    <div class="flex space-x-6 overflow-x-auto">
      <div class="flex-1">
        <div class="flex justify-between items-center space-x-4 mb-6">
          <div class="flex-1 flex justify-around items-center p-4 bg-white rounded-md shadow-md"
            v-for="(item, index) in list" :key="index">
            <div class="flex flex-col">
              <span class="font-bold text-xl">{{ item.num }}</span>
              <span class="text-gray-400">{{ item.title }}</span>
            </div>
            <div class="h-12 w-12 flex justify-center items-center rounded-full" :class="item.bg">
              <component :is="item.icon?.name" class="text-white text-2xl leading-none"></component>
            </div>
          </div>
        </div>
        <TemplateCard title="询盘来源统计" class="mb-6 h-[24rem]">
          <LineChart v-if="isChange" class="h-80" :listData="sourceData.list" :legend="sourceData.legend"
            :grid="sourceData.grid" :xData="sourceData.xAxis">
          </LineChart>
        </TemplateCard>
        <TemplateCard title="询盘国家发布TOP10" class="mb-6 h-[22rem]">
          <WorldChart v-if="isChange" class="h-72" :listData="worldData.list"></WorldChart>
        </TemplateCard>
      </div>
      <div class="flex-none min-w-[400px]">
        <TemplateCard title="询盘类型统计" class="mb-6 h-[30.5rem]">
          <PieChart v-if="isChange" :listData="typeData.list" class="h-[26.5rem]" :legend="typeData.legend"
            radius="60%">
          </PieChart>
        </TemplateCard>
        <TemplateCard title="询盘使用设备">
          <div class="flex items-center justify-between py-5 px-8">
            <div class="flex items-center">
              <MediaImage
                src="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/desktop.png"
                :height="80" :preview="false"/>
              <span class="text-lg pl-5">PC端</span>
            </div>
            <div class="text-green-500 text-lg">{{ terminalData.pcNum }}</div>
          </div>
          <a-divider />
          <div class="flex items-center justify-between py-5 px-8">
            <div class="flex items-center">
              <MediaImage
                src="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/mobile.png"
                :height="80" :preview="false"/>
              <span class="text-lg pl-5">移动端</span>
            </div>
            <div class="text-green-500 text-lg">{{ terminalData.mobileNum }}</div>
          </div>
        </TemplateCard>
      </div>
    </div>
    <TemplateCard :title="`询盘走势(${trendData.subTitle})`" class="mb-6">
      <LineChart class="h-72" :listData="trendData.listTrendData" :xData="trendData.xTrendData"
        :legend="{ show: false }"></LineChart>
    </TemplateCard>
  </div>
</template>
