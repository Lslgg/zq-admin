
<script setup lang='ts'>
import router from '@/router'
import { Utilts } from '@/util/utilts'
import { UseProductSeoForm } from '../../shared/add.product.service'
import { ProductStore } from '../../shared/product.store'
import { toRaw } from 'vue'
import { SortNum } from '@/components/common'
import { SeoFormItem } from '@/views/content/components'
const showType = ProductStore.ins().showType
const onSeoSubmit = () => {
  return new Promise((resolve, reject) => {
    validate().then(res => {
      if (res) {
        ProductStore.ins().product$.next({ ...toRaw(modelRef) })
        const product = ProductStore.ins().product
        product.img = product.img?.map(item => item.id) as any
        product.video = product.video?.map(item => item.id) as any
        if (Array.isArray(product.front_cover) && product.front_cover.length > 0) {
          product.front_cover = product.front_cover[0].id
        } else if (Array.isArray(product.front_cover) && product.front_cover.length === 0) {
          (product as any).front_cover = 0
        }
        if (Array.isArray(product.seo_keyword)) {
          product.seo_keyword = product.seo_keyword.filter(p => !!p.trim()).map(p => p.trim())
          product.seo_keyword = product.seo_keyword.join(',')
        } else if (Array.isArray(product.seo_keyword) && product.seo_keyword.length === 0) {
          product.seo_keyword = ''
        }
        ProductStore.ins().product$.next({ ...product })
        resolve(true)
      }
    }).catch(err => {
      resolve(false)
    })
  })
}
// 父组件调用的提交数据方法
defineExpose({ onSeoSubmit })
const { modelRule, modelRef, onSubmit, validate } = await new UseProductSeoForm().useForm()
const onPrev = () => {
  ProductStore.ins().step$.next(2)
}
const onClear = () => {
  Utilts.ins().confirm({
    content: '确定要取消吗？编辑数据将不保存。', okCallBack: () => {
      router.push({ name: 'product' })
    }
  })
}
</script>

<template>
  <div class="w-full">
    <a-form layout="vertical" autocomplete="off">
      <SeoFormItem v-model:modelRef="modelRef" :modelRule="modelRule" typeStr="产品"></SeoFormItem>
      <a-form-item label="排序" v-bind="modelRule.sort_num">
        <SortNum v-model:value="modelRef.sort_num"></SortNum>
      </a-form-item>
      <a-form-item label="是否上架" v-bind="modelRule.status">
        <a-switch v-model:checked="modelRef.status" checked-children="是" un-checked-children="否" :checkedValue="1"
          :unCheckedValue="0" />
      </a-form-item>
    </a-form>
    <div v-if="showType === 'add'" class="flex justify-center items-center py-2 space-x-4">
      <a-button class="w-[100px]" @click="onPrev">上一步</a-button>
      <a-button class="w-[100px]" type="primary" @click="onSubmit">保存</a-button>
      <a-button class="w-[100px]" @click="onClear">取消</a-button>
    </div>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-form-item-control) {
  line-height: 32px;
}
</style>
