<script setup lang='ts'>
import { CommonUpload } from '@/components/common'
import ProductType from './productType.vue'
import ProductBaseParams from './productBaseParams.vue'
import { SubmitParamsDataType, UseProductBaseForm } from '../../shared/add.product.service'
import { ProductStore } from '../../shared/product.store'
import { ref, toRaw } from 'vue'
import CommonModal from '@/components/common/commonModal.vue'
import { MaterFileType } from '@/api/api.model'
import { Utilts } from '@/util/utilts'
// 订阅商品类型变化
ProductStore.ins().paramsNameStr$.subscribe(res => {
  paramsNameStr.value = ProductStore.ins().paramsNameStr.value
})
ProductStore.ins().category_ids$.subscribe(ids => {
  modelRef.category_ids = ids
})
const showType = ProductStore.ins().showType
const visible = ref(false)
const paramsRef = ref<SubmitParamsDataType>()
const keyValueList = ref<KeyValue[]>([])
const categoryIds = ref<number[]>([])
const materFileType = MaterFileType
// 父组件调用的提交数据方法
const onBaseSubmit = () => {
  return new Promise((resolve, reject) => {
    validate().then(res => {
      if (res) {
        const data = paramsRef.value?.submitParamsData()
        let param = {}
        if (!data) {
          resolve(false)
        } else {
          param = { param: data }
          ProductStore.ins().product$.next({ ...toRaw(modelRef), ...param })
          resolve(true)
        }
      }
    }).catch(err => {
      resolve(false)
    })
  })
}
defineExpose({ onBaseSubmit })
const {
  modelRule, modelRef, onSubmit, validate
} = await new UseProductBaseForm().useForm(paramsRef)
const paramsNameStr = ref(ProductStore.ins().paramsNameStr.value)
const onSetProdctType = () => {
  if (showType === 'add') ProductStore.ins().step$.next(0)
  else if (showType === 'edit') visible.value = true
}
// 弹出框选择分类
const onSelectSubmit = async () => {
  if (categoryIds.value.length === 0) {
    Utilts.ins().message('请选择分类', 'error')
    return
  }
  const store = ProductStore.ins()
  const names = keyValueList.value
    .filter((p) => categoryIds.value.includes(+p.key))
    .map((p) => p.value)
    .join(',')
  ProductStore.ins().product$.next({ category_ids: categoryIds.value })
  ProductStore.ins().product.category_ids = categoryIds.value
  store.paramsNameStr$.next(names)
  store.category_ids$.next(categoryIds.value)
  if (ProductStore.ins().showType === 'add') store.step$.next(1)
}
</script>

<template>
  <div class="w-full">
    <a-form layout="vertical" autocomplete="off">
      <a-form-item label="产品分类" v-bind="modelRule.category_ids" class="product_type">
        <div class="flex justify-start space-x-4 items-center pl-3">
          <span>{{ paramsNameStr }}</span>
          <a-button @click="onSetProdctType">重新设置产品类别</a-button>
        </div>
      </a-form-item>
      <a-form-item label="产品名称" v-bind="modelRule.title">
        <a-input v-model:value="modelRef.title" :maxlength="150" placeholder="请输入名称，少于150字符，尽量在60个字符最优"
          :showCount="true" />
      </a-form-item>
      <a-form-item label="产品图片" v-bind="modelRule.img">
        <CommonUpload v-model:fileList="modelRef.img" :selectType="materFileType.IMG" :maxNum="8" :max-size="1">
        </CommonUpload>
        <template #extra>
          <div class="text-gray-400 text-xs p-2">
            <span>产品图片最多支持上传8张，</span>
            <span>
              支持jpg、gif、png格式，文件大小不超过1M，建议使用800*800 px的图片；最多支持上8张图，且默认使用第一张图为产品主图。
            </span>
          </div>
        </template>
      </a-form-item>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="产品视频" name="video" v-bind="modelRule.video">
            <CommonUpload v-model:fileList="modelRef.video" :selectType="materFileType.VEDIO" content="主图视频">
            </CommonUpload>
            <template #extra>
              <span class="text-gray-400 text-xs">支持mp4格式，建议上传视频不超过50Mb</span>
            </template>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="视频封面" name="video" v-bind="modelRule.front_cover">
            <CommonUpload v-model:fileList="modelRef.front_cover" :selectType="materFileType.IMG" content="视频封面"
              :max-size="1">
            </CommonUpload>
            <template #extra>
              <span class="text-gray-400 text-xs">
                支持jpg、gif、png格式，文件大小不超过1M，如未提供则自动获取视频画面作为封面图
              </span>
            </template>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="产品简介" v-bind="modelRule.summary">
        <a-textarea :maxlength="3000" show-count placeholder="请输入视频简介最大字符3000" v-model:value="modelRef.summary">
        </a-textarea>
      </a-form-item>
      <a-form-item label="产品参数" v-bind="modelRule.params">
        <div class="w-full">
          <ProductBaseParams ref="paramsRef"></ProductBaseParams>
        </div>
      </a-form-item>
    </a-form>
    <div v-if="showType === 'add'" class="flex justify-center items-center p-2">
      <a-button class="w-[100px]" type="primary" @click="onSubmit">下一步</a-button>
    </div>
    <CommonModal title="选择分类" v-model:visible="visible" @ok="onSelectSubmit">
      <ProductType v-model:categoryIds="categoryIds" v-model:keyValueList="keyValueList" ref="productTypeRef">
      </ProductType>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
:veep(.ant-form-vertical .ant-form-item-label) {
  padding: 0 !important;
}
</style>
