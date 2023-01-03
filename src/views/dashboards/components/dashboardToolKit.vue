
<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import {
  AreaChartOutlined, BarChartOutlined,
  PicCenterOutlined, DotChartOutlined,
  FundOutlined, RadarChartOutlined,
} from '@ant-design/icons-vue'
import { computed, reactive } from 'vue'
const list = [
  { name: '近30天访客数', num: 121, icon: reactive({ name: computed(() => AreaChartOutlined) }) },
  { name: '近30天会话数', num: 122, icon: reactive({ name: computed(() => BarChartOutlined) }) },
  { name: '整站收录数', num: 412, icon: reactive({ name: computed(() => PicCenterOutlined) }) },
  { name: '排名词数', num: 152, icon: reactive({ name: computed(() => DotChartOutlined) }) },
  { name: '平均排名', num: 22, icon: reactive({ name: computed(() => FundOutlined) }) },
  { name: '平均会话时长', num: 52, icon: reactive({ name: computed(() => RadarChartOutlined) }) }
]

</script>

<template>
  <TemplateCard title="数据概览" class="h-full">
    <div class="flex justify-between space-x-4">
      <div v-for="(item, index) in list" :key="index"
        class="flex-1 px-[10px] py-[13px] flex flex-col justify-between hover:bg-gray-100 hover:cursor-pointer rounded">
        <span class="flex-1 flex items-center space-x-1">
          <component :is="item.icon?.name" class="text-primary text-xl leading-none"></component>
          <span class=" text-sm">{{ item.name }}</span>
        </span>
        <span class="text-base pl-6 font-bold">{{ item.num }}</span>
      </div>
    </div>
  </TemplateCard>
</template>
