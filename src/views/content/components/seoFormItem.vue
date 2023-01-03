
<script setup lang='ts'>
import { useVModel } from '@vueuse/core'
const props = defineProps({
  typeStr: String,
  modelRule: {
    type: Object,
    default: () => ({ title: '', keywords: '', description: '' }),
  },
  modelRef: {
    type: Object,
    default: () => ({ title: '', keywords: '', description: '' }),
  }
})
const emit = defineEmits(['update:modelRef'])
const myModelRef = useVModel(props, 'modelRef', emit)
const onfilter = (value: string[]) => {
  myModelRef.value.seo_keyword = value.filter((item: string) => item.length <= 50)
    .filter((_item, index) => index < 3)
}
let tip = ''
const tipList = [
  '请输入不超过150字符，尽量在40~60字符内最优，可用“关键词+产品主要特性+品牌+型号”的方式编写',
  '请输入不超过150字符，尽量在40~60字符内最优，可采用要推广的核心关键词+品牌名称等的方式编写',
  '请输入不超过150字符，尽量在40~60字符内最优，可采用要推广的核心关键词+品牌名称等的方式编写',
]
if (props.typeStr === '产品') {
  tip = tipList[0]
} else if (props.typeStr === '文章') {
  tip = tipList[1]
} else if (props.typeStr === '视频') {
  tip = tipList[2]
}
</script>

<template>
  <div class="w-full">
    <a-form-item label="SEO标题(Title)" v-bind="modelRule.seo_title">
      <a-input v-model:value="myModelRef.seo_title" :placeholder="tip" :maxlength="150" :showCount="true" />
      <span class="text-gray-400 text-xs">SEO标题即平时看到的浏览器标题，若留空则默认使用“{{ typeStr }}名称”作为浏览器标题</span>
    </a-form-item>
    <a-form-item label="SEO描述(Description)" v-bind="modelRule.seo_description" class="form-textarea">
      <a-textarea v-model:value="myModelRef.seo_description" placeholder="请输入不超过300字符的描述内容，尽量在120字符内最优" :maxlength="300"
        :showCount="true" class="mb-2" :rows="2" />
      <span class="text-gray-400 text-xs">描述可以包含{{ typeStr }}概要和核心关键词</span>
    </a-form-item>
    <a-form-item label="SEO关键词(Keywords)" v-bind="modelRule.seo_keyword">
      <a-select size="large" v-model:value="myModelRef.seo_keyword" mode="tags" style="width: 100%"
        :token-separators="[',']" placeholder="请输入1~3个关键词，每个关键词少于50个字符" @change="onfilter" :open="false"></a-select>
      <span class="text-gray-400 text-xs">建议输入1~3个产品关键词，核心关键词请放最前面，输入关键词后直接按回车键隔开即可自动同步到关键词库。</span>
    </a-form-item>
  </div>
</template>

<style lang='scss' scoped>
:deep(.form-textarea) {
  .ant-form-item-control {
    line-height: normal;
  }
}
</style>
