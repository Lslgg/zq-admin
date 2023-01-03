
<script setup lang='ts'>import { IPagationWhere } from '@/api/api.model'
import { useVModel } from '@vueuse/core'
import { computed, PropType, ref } from 'vue'
const props = defineProps({
  pagingWhere: { // 分页查询条件
    type: Object as PropType<IPagationWhere>,
    default: () => { }
  },
  getList: { type: Function }, // 分页方法
})
const emit = defineEmits(['pagingWhere'])
const myPagingWhere = useVModel(props, 'pagingWhere', emit)
// 获取条件数
const total = computed(() => {
  const count = ref(0)
  if ((props.pagingWhere?.category_ids?.length || 0) > 0) count.value = count.value + 1
  if (props.pagingWhere?.start_date) count.value = count.value + 1
  if (props.pagingWhere?.end_date) count.value = count.value + 1
  if (props.pagingWhere?.status !== undefined && props.pagingWhere?.status > -1) count.value = count.value + 1
  return count.value
})
// 关闭类别事件
const onCategoryClose = (index: number) => {
  if (!myPagingWhere.value) return
  myPagingWhere.value.category_ids?.splice(index, 1)
  myPagingWhere.value.category_names?.splice(index, 1)
  if (props.getList) props.getList({ ...props.pagingWhere })
}
// 关闭时间事件
const onDateClose = (name: keyof IPagationWhere) => {
  if (name === 'status') myPagingWhere.value.status = -1
  else if (name === 'start_date') myPagingWhere.value.start_date = ''
  else if (name === 'end_date') myPagingWhere.value.end_date = ''
  if (props.getList) props.getList({ ...props.pagingWhere, current: 1 })
}
// 清空条件事件
const onClear = () => {
  myPagingWhere.value.status = -1
  myPagingWhere.value.start_date = ''
  myPagingWhere.value.end_date = ''
  const num = myPagingWhere.value?.category_ids?.length ?? 0
  myPagingWhere.value.category_ids?.splice(0, num)
  myPagingWhere.value.category_names?.splice(0, num)
  if (props.getList) props.getList({ ...props.pagingWhere, current: 1 })
}
</script>

<template>
  <div v-if="total > 0" class="flex justify-between bg-gray-50 p-2 rounded mb-1">
    <div class="grow flex-1 leading-8 text-gray-500">
      <span>已选 {{ total }} 项</span>
      <span v-show="myPagingWhere?.category_ids && myPagingWhere?.category_ids.length > 0">
        <span>分类：</span>
        <a-tag v-for="(item, index) in myPagingWhere?.category_ids" :key="item" closable
          @close="onCategoryClose(index)">{{ myPagingWhere?.category_names?.[index] }}</a-tag>
      </span>
      <span v-if="myPagingWhere?.start_date">
        <span>开始时间：</span>
        <a-tag closable @close="onDateClose('start_date')">{{ myPagingWhere?.start_date }}</a-tag>
      </span>
      <span v-if="myPagingWhere?.end_date">
        <span>结束时间：</span>
        <a-tag closable @close="onDateClose('end_date')">{{ myPagingWhere?.end_date }}</a-tag>
      </span>
      <span v-if="(myPagingWhere?.status ?? -1) > -1">
        <span>上架状态：</span>
        <a-tag closable @close="onDateClose('status')">{{ myPagingWhere?.status ? '已上架' : '已下架' }}</a-tag>
      </span>
    </div>
    <div class="w-10 text-right leading-8">
      <a-typography-link @click="onClear">清空</a-typography-link>
    </div>
  </div>
</template>
