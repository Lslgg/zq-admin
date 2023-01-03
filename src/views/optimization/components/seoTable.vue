<script lang='ts' setup>
import { Utilts } from '@/util/utilts'
import { useVModel } from '@vueuse/core'
import { PropType } from 'vue'
import { UseSeoListPagationService, SeoListOperationService } from '../shared/useSeo.service'

const props = defineProps({
  keyword: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
const emit = defineEmits(['update:keyword'])
const keywords = useVModel(props, 'keyword', emit)
const { paging, getPatationList } = new UseSeoListPagationService().usePagin()
const { el } = new SeoListOperationService(paging, getPatationList).useOperation()
const add = (key: string) => {
  const bool = keywords.value.length < 3
  if (bool) {
    keywords.value.push(key)
  } else {
    Utilts.ins().message('关键词数量不能超过三个', 'error')
  }
}
</script>

<template>
  <div ref="el" class="w-[400px] h-[300px] m-auto overflow-y-auto overflow-x-hidden relative">
    <a-table :dataSource="paging.dataSource" :columns="paging.columns" :pagination="false" :loading="paging.loading"
      :scroll="{ y: 240 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="flex items-center">
            <span class="text-green-500" v-if="keywords.includes(record.keyword)">已添加</span>
            <a class="text-primary" v-else type="link" @click="add(record.keyword)">添加</a>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang='scss' scoped>
</style>
