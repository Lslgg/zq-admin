<script setup lang='ts'>
/** 产品，文章，视频表格公共的查询组件 */
import { PropType, ref, watch } from 'vue'
import { ECategoryType, IPagationWhere } from '@/api/api.model'
import { ClassifyTreeSelect } from '@/components/classifyTreeSelect'
import { Dayjs } from 'dayjs'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  classType: { type: Object as PropType<ECategoryType>, default: () => ECategoryType.product }, // 分类类型
  columnKey: String, // 列表的key
  paging: Object, // 分页对象
  getList: { type: Function }, // 分页方法
  pagingWhere: { // 分页查询条件
    type: Object as PropType<Partial<IPagationWhere>>,
    default: () => ({
      status: [],
    })
  }
})
const emit = defineEmits(['pagingWhere'])
const myPagingWhere = useVModel(props, 'pagingWhere', emit)
const status = ref() // 状态
const category_ids = ref([]) // 分类id
const start_date = ref<Dayjs>() // 开始时间
const end_date = ref<Dayjs>() // 结束时间
// 分类查找
const onClassifyTree = (keys: number[], item: string[]) => {
  if (!props.getList) return
  const params = { ...props.paging?.where || {}, category_ids: category_ids.value, category_names: item, current: 1 }
  props.getList(params)
  myPagingWhere.value.category_ids = keys
  myPagingWhere.value.category_names = item
}
// 日期查找
const onDate = () => {
  let startDate = ''
  let endDate = ''
  // 如果开始时间和结束时间都存在
  if (start_date.value) {
    startDate = start_date.value.format('YYYY-MM-DD') + ' 00:00:00'
  }
  if (end_date.value) {
    endDate = end_date.value.format('YYYY-MM-DD') + ' 23:59:59'
  }
  if (!props.getList) return
  const parmas = { ...props.paging?.where || {}, start_date: startDate, end_date: endDate, current: 1 }
  props.getList(parmas)
  myPagingWhere.value.start_date = startDate
  myPagingWhere.value.end_date = endDate
}
// 状态查找
const onStatus = () => {
  if (!props.getList) return
  let myStatus = -1
  // 如果状态存在,并且只选中了一个
  if (Array.isArray(status.value) && status.value.length === 1) {
    myStatus = status.value[0]
  } else if (Array.isArray(status.value) && (status.value.length === 0)) { // 如果状态不存在
    myStatus = -1
  } else if (Array.isArray(status.value) && (status.value.length === 2)) { // 如果状态存在,并且选中了两个
    myStatus = -2
  }
  props.getList({ ...props.paging?.where || {}, status: myStatus, current: 1 })
  myPagingWhere.value.status = myStatus
}
const disabledStartDate = (current: Dayjs) => {
  if (!end_date.value) return false
  return current && current >= end_date.value.endOf('day')
}
const disabledEndDate = (current: Dayjs) => {
  if (!start_date.value) return false
  const start = start_date.value.add(-1, 'day')
  return current && current <= start.endOf('day')
}
// 开始时间
watch(() => props.pagingWhere.start_date, (val) => {
  if (!val) start_date.value = undefined
})
// 结束时间
watch(() => props.pagingWhere.end_date, (val) => {
  if (!val) end_date.value = undefined
})
// 状态
watch(() => props.pagingWhere.status, (val) => {
  if ((val ?? -1) >= -1) status.value = [val]
})
</script>

<template>
  <div class="w-full">
    <template v-if="columnKey === 'category'">
      <div class="p-4 w-[15rem]">
        <ClassifyTreeSelect @onSelectTree="onClassifyTree" v-model:value="category_ids" :type="classType"
          :isDefaultItem="false" class="!w-full" size="default" />
      </div>
    </template>
    <template v-if="columnKey === 'created_at'">
      <div class="p-4 w-[24rem]">
        <div class="time">
          <a-date-picker v-model:value="start_date" placeholder="开始日期" @change="onDate"
            :disabled-date="disabledStartDate" />
          <span class="px-3">至</span>
          <a-date-picker v-model:value="end_date" placeholder="结束日期" @change="onDate"
            :disabled-date="disabledEndDate" />
        </div>
      </div>
    </template>
    <template v-if="columnKey === 'status'">
      <div class="p-2 w-[12rem]">
        <a-checkbox-group v-model:value="status" @change="onStatus">
          <a-checkbox :value="1">已上架</a-checkbox>
          <a-checkbox :value="0">已下架</a-checkbox>
        </a-checkbox-group>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
</style>
