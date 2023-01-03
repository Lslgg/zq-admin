
<script setup lang='ts'>import { ref } from 'vue'
import { TinymceEdit } from '@/components/tinymceEdit'
import { ProductStore } from '../../shared/product.store'
const activeKey = ref<number>(1)
const showType = ProductStore.ins().showType
const onDetailSubmit = () => {
  const panesContent = panes.value.map(p => p.content)[0]
  const data = {
    detail: {
      data_type: 1,
      content: {
        detail: panesContent
      }
    }
  }
  ProductStore.ins().product$.next(data)
  if (showType === 'add') ProductStore.ins().step$.next(3)
  return true
}
const prevStep = () => ProductStore.ins().step$.next(1)
const panes = ref<{ title: string; content: string; key: number, closable: boolean }[]>([
  { title: '产品详情', content: '', key: 1, closable: false },
])
if (showType === 'edit') {
  panes.value[0].content = ProductStore.ins().product.detail?.content.detail ?? ''
}
// 父类调用的提交数据方法
defineExpose({ onDetailSubmit })
</script>

<template>
  <div class="w-full">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="pane in panes" :key="pane.key">
        <template #tab>
          <span class="flex items-center space-x-3">
            <span>{{ pane.title }}</span>
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div class="flex flex-col">
      <template v-for="pane in panes" :key="pane.key">
        <TinymceEdit :height="350" v-show="pane.key === activeKey" v-model:content="pane.content" :selector="`productContent_${pane.key}`"></TinymceEdit>
      </template>
    </div>
    <div v-if="showType === 'add'" class="flex justify-center items-center p-6 space-x-4">
      <a-button @click="prevStep">上一步</a-button>
      <a-button type="primary" @click="onDetailSubmit">下一步</a-button>
    </div>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
  flex: none;
}
</style>
