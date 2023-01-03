<script setup lang='ts'>
import { ProductStore } from '../shared/product.store'
import { TemplateCard, TemplateTabCard } from '@/components/template'

import ProductBase from './components/productBase.vue'
import ProductDetail from './components/productDetail.vue'
import ProductSeo from './components/productSeo.vue'
import ProductType from './components/productType.vue'
ProductStore.ins().step$.next(0)
ProductStore.ins().product = {}
ProductStore.ins().product$.next({})
ProductStore.ins().showType = 'add'
const step = ProductStore.ins().step
</script>
<template>
  <div class>
    <div class="flex justify-center pb-6">
      <div class="w-4/5">
        <a-steps :current="step">
          <a-step title="产品分类"></a-step>
          <a-step title="基础信息"></a-step>
          <a-step title="详细信息"></a-step>
          <a-step title="SEO优化"></a-step>
        </a-steps>
      </div>
    </div>
    <TemplateCard title="产品分类" v-show="step === 0">
      <ProductType></ProductType>
    </TemplateCard>
    <TemplateCard v-show="step === 1" title="基础信息">
      <ProductBase class=" pt-3"></ProductBase>
    </TemplateCard>
    <TemplateTabCard v-show="step === 2">
      <ProductDetail></ProductDetail>
    </TemplateTabCard>
    <TemplateCard v-show="step === 3" title="SEO优化">
      <ProductSeo></ProductSeo>
    </TemplateCard>
  </div>
</template>

<style lang='scss' scoped>
</style>
