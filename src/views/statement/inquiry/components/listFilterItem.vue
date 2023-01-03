
<script setup lang='ts'>
import { useVModel } from '@vueuse/core'
import { computed, PropType } from 'vue'
import { UseInquryService } from '../shared/useInquiry.service'
import { IInquiryListWhere } from '../shared/useList.service'
const props = defineProps({
  pagingWhere: { // 分页查询条件
    type: Object as PropType<IInquiryListWhere>,
    default: () => { }
  },
  getList: { type: Function }, // 分页方法
  inqueryCountryList: { // 询盘国家列表
    type: Array as PropType<KeyValue[]>,
    default: () => []
  },
})
const emit = defineEmits(['pagingWhere', 'onClearWhere'])
const myPagingWhere = useVModel(props, 'pagingWhere', emit)
// 询盘类型
const inqueryTypeList = UseInquryService.ins().getInquiryTypeList()
// 询盘来源
const inquerySourceList = UseInquryService.ins().getInquirySource()

// 获取条件数
const total = computed(() => {
  let count = 0
  const where = props.pagingWhere
  if (where?.is_read === 0 || where?.is_read === 1) {
    count = count + 1
  }
  if ((where?.inquiry_type > 0)) {
    count = count + 1
  }
  if ((where?.inquiry_source > 0)) {
    count = count + 1
  }
  if ((where?.country_code && where?.country_code !== '-1')) {
    count = count + 1
  }
  return count
})
// 清空条件事件
const onClear = () => {
  myPagingWhere.value.is_read = -1
  myPagingWhere.value.inquiry_type = -1
  myPagingWhere.value.inquiry_source = -1
  myPagingWhere.value.country_code = ''
  emit('onClearWhere', 'is_read')
  emit('onClearWhere', 'inquiry_type')
  emit('onClearWhere', 'inquiry_source')
  emit('onClearWhere', 'customer_country')
  if (props.getList) props.getList({ ...props.pagingWhere, current: 1 })
}
const onClose = (name: keyof IInquiryListWhere) => {
  if (name === 'is_read') {
    myPagingWhere.value.is_read = -1
    emit('onClearWhere', 'is_read')
  } else if (name === 'inquiry_type') {
    myPagingWhere.value.inquiry_type = -1
    emit('onClearWhere', 'inquiry_type')
  } else if (name === 'inquiry_source') {
    myPagingWhere.value.inquiry_source = -1
    emit('onClearWhere', 'inquiry_source')
  } else if (name === 'country_code') {
    myPagingWhere.value.country_code = ''
    emit('onClearWhere', 'country_code')
  }
  if (props.getList) props.getList({ ...props.pagingWhere, current: 1 })
}
const getName = (list: any, key: number | string) => {
  return list.find((p: any) => p.key === key)?.value ?? ''
}
</script>

<template>
  <div v-if="total > 0" class="flex justify-between bg-gray-50 p-2 rounded mb-1">
    <div class="grow flex-1 leading-8 text-gray-500">
      <span>已选 {{ total }} 项</span>
      <span v-show="myPagingWhere?.is_read === 0 || myPagingWhere?.is_read === 1">
        <span>状态： </span>
        <a-tag closable @close="onClose('is_read')">{{ myPagingWhere?.is_read ? '已读' : '未读' }}</a-tag>
      </span>
      <span v-if="myPagingWhere?.inquiry_type">
        <span>询盘类型：</span>
        <a-tag closable @close="onClose('inquiry_type')">{{
            getName(inqueryTypeList, myPagingWhere.inquiry_type)
        }}</a-tag>
      </span>
      <span v-if="myPagingWhere?.inquiry_source">
        <span>来源：</span>
        <a-tag closable @close="onClose('inquiry_source')">{{
            getName(inquerySourceList, myPagingWhere.inquiry_source)
        }}</a-tag>
      </span>
      <span v-if="myPagingWhere?.country_code">
        <span>国家：</span>
        <a-tag closable @close="onClose('country_code')">{{
            getName(props.inqueryCountryList, myPagingWhere.country_code)
        }}</a-tag>
      </span>
    </div>
    <div class="w-10 text-right leading-8">
      <a-typography-link @click="onClear">清空</a-typography-link>
    </div>
  </div>
</template>
