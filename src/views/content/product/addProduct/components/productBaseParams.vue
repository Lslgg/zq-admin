
<script setup lang='ts'>
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { CommonUpload } from '@/components/common'
import { MaterFileType } from '@/api/api.model'
import { ProductParamsService } from '../../shared/product.params.service'
import { ProductStore } from '../../shared/product.store'
const service = new ProductParamsService()
await service.init()
const {
  collectList, onAddText, onDeleteText,
  submitParamsData
} = await service.useData()
// 父组件调用的提交数据方法
defineExpose({ submitParamsData })
const onBlankUrl = () => {
  window.open('/admin/content/params')
}
const onRefresh = () => {
  const categoryIds = ProductStore.ins().product.category_ids
  ProductStore.ins().category_ids$.next(categoryIds || [])
}
</script>

<template>
  <div class="w-full border">
    <div v-if="collectList.length > 0" class="p-4 border">
      <a-form layout="vertical" autocomplete="off">
        <template v-for="(item, i) in collectList" :key="i">
          <!-- 文本 -->
          <template v-if="item.type === 1">
            <a-form-item>
              <template #label>
                <span class="flex justify-start items-center space-x-1">
                  <span>{{ item.name }}</span>
                  <span v-if="item.isRequire" class="text-red-500 leading-none">*</span>
                </span>
              </template>
              <div v-for="(textItem, j) in item.textValue" :key="i + '' + j" class="flex">
                <a-input v-model:value="textItem.text" />
                <a-button class="!rounded-none !shadow-none">
                  <template #icon>
                    <plus-outlined @click="onAddText(item.textValue)" />
                  </template>
                </a-button>
                <a-button v-if="item.textValue.length > 1" class="!rounded-none !shadow-none">
                  <template #icon>
                    <delete-outlined @click="onDeleteText(item.textValue, j)" />
                  </template>
                </a-button>
              </div>
            </a-form-item>
          </template>
          <!-- 单选 -->
          <template v-if="item.type === 2">
            <a-form-item>
              <template #label>
                <span class="flex justify-start items-center space-x-1">
                  <span>{{ item.name }}</span>
                  <span v-if="item.isRequire" class="text-red-500 leading-none">*</span>
                </span>
              </template>
              <a-radio-group v-model:value="item.radioVale" name="radioGroup">
                <div class="flex justify-start -m-3">
                  <div v-for="(checkItem, j) in item.option" :key="`${i}${j}`" class="flex flex-col m-3">
                    <a-radio v-model:value="checkItem.text">{{ checkItem.text }}</a-radio>
                  </div>
                </div>
              </a-radio-group>
            </a-form-item>
          </template>
          <!-- 多选 -->
          <template v-if="item.type === 3">
            <a-form-item>
              <template #label>
                <span class="flex justify-start items-center space-x-1">
                  <span>{{ item.name }}</span>
                  <span v-if="item.isRequire" class="text-red-500 leading-none">*</span>
                </span>
              </template>
              <div class="flex justify-start -m-3 flex-wrap">
                <div v-for="(checkItem, j) in item.option" :key="`${i}${j}`" class="flex flex-col m-3">
                  <a-checkbox v-model:checked="checkItem.checked" :value="checkItem.text">{{ checkItem.text }}</a-checkbox>
                  <CommonUpload
                    v-model:fileList="checkItem.img"
                    v-if="item.isAllowImg && checkItem.checked"
                    :selectType="MaterFileType.IMG"
                    class="mt-1 bg-gray-50 p-1"
                  ></CommonUpload>
                </div>
              </div>
            </a-form-item>
          </template>
        </template>
      </a-form>
    </div>
    <div v-else>
      <a-empty description="暂无参数" />
    </div>
    <div class="w-full flex justify-start space-x-4 border-t p-4">
      <a-button type="primary" @click="onBlankUrl">产品参数设置</a-button>
      <a-button type="default" @click="onRefresh">刷新参数</a-button>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
