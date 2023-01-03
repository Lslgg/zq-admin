
<script setup lang='ts'>
import { ref } from 'vue'
import { EditProductService } from '../shared/edit.product.service'
import { ProductStore } from '../shared/product.store'
import ProductBase from './components/productBase.vue'
import ProductDetail from './components/productDetail.vue'
import ProductSeo from './components/productSeo.vue'
// 初始化数据
ProductStore.ins().step$.next(0)
ProductStore.ins().product = {}
ProductStore.ins().product$.next({})
ProductStore.ins().showType = 'edit'
const activeKey = ref<number[]>([0, 1, 2, 3])
const baseRef = ref() // 基本信息
const detailRef = ref() // 详情
const seoRef = ref() // SEO
const editService = new EditProductService()
await editService.setProduct()
const onSubmit = () => editService.onSubmit(baseRef, detailRef, seoRef)
const onClear = () => window.history.go(-1)
const toggleCollapse = (val: number) => {
  if (activeKey.value.includes(val)) {
    activeKey.value = activeKey.value.filter(item => item !== val)
  } else activeKey.value.push(val)
}
</script>

<template>
  <a-form layout="vertical" autocomplete="off">
    <a-collapse v-model:activeKey="activeKey" expandIconPosition="right" collapsible="disabled" ghost>
      <a-collapse-panel key="0" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3">
        <template #header>
          <span class="text-lg font-bold text-black">基本信息</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(0)">{{ activeKey.includes(0) ? '收起' : '展开' }}</span>
        </template>
        <ProductBase ref="baseRef"></ProductBase>
      </a-collapse-panel>
      <a-collapse-panel key="1" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3">
        <template #header>
          <span class="text-lg font-bold text-black">详细信息</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(1)">{{ activeKey.includes(1) ? '收起' : '展开' }}</span>
        </template>
        <ProductDetail ref="detailRef"></ProductDetail>
      </a-collapse-panel>
      <a-collapse-panel key="2" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3">
        <template #header>
          <span class="text-lg font-bold text-black">SEO优化</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(2)">{{ activeKey.includes(2) ? '收起' : '展开' }}</span>
        </template>
        <ProductSeo ref="seoRef"></ProductSeo>
      </a-collapse-panel>
    </a-collapse>
    <div class="mt-5 flex justify-center space-x-3 mb-6">
      <a-button class=" w-[100px]" @click="onClear">取消</a-button>
      <a-button class=" w-[100px]" type="primary" @click="onSubmit">保存</a-button>
    </div>
  </a-form>
</template>

<style lang='scss' scoped>
</style>

