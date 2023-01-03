
<script setup lang='ts'>
import { ref } from 'vue'
import { UseMyForm } from '../shared/add.article.service'
import { CommonUpload } from '@/components/common'
import { TinymceEdit } from '@/components/tinymceEdit'
import { ClassifyTreeSelect } from '@/components/classifyTreeSelect'
import { ECategoryType, MaterFileType } from '@/api/api.model'
import { SeoFormItem } from '../../components'
import SortNum from '@/components/common/sortNum.vue'

const activeKey = ref<number[]>([0, 1, 2, 3])
const useMyForm = new UseMyForm()
const { modelRule, modelRef, onSubmit, spining } = await useMyForm.useForm()
const { onClassify, onClear } = useMyForm.useOtherForm()
const toggleCollapse = (val: number) => {
  if (activeKey.value.includes(val)) {
    activeKey.value = activeKey.value.filter(item => item !== val)
  } else activeKey.value.push(val)
}
</script>

<template>
  <a-form layout="vertical" autocomplete="off">
    <a-collapse v-model:activeKey="activeKey" expandIconPosition="right" collapsible="disabled" ghost>
      <a-collapse-panel key="0" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">基本信息</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(0)">{{ activeKey.includes(0) ? '收起'
              : '展开'
          }}</span>
        </template>
        <div class="w-full">
          <a-form-item label="标题" v-bind="modelRule.title">
            <a-input v-model:value="modelRef.title" :maxlength="150" placeholder="请输入摘要，少于150字符，尽量在60个字符最优"
              :showCount="true" />
          </a-form-item>
          <a-form-item label="文章简介" v-bind="modelRule.summary">
            <a-textarea :maxlength="3000" show-count v-model:value="modelRef.summary" placeholder="请输入文章简介最大字符3000" />
          </a-form-item>
          <a-form-item label="文章分类" v-bind="modelRule.category_ids">
            <div class="flex items-center space-x-6">
              <ClassifyTreeSelect v-model:value="modelRef.category_ids" :type="ECategoryType.article"
                :isDefaultItem="false"></ClassifyTreeSelect>
              <a-button @click="onClassify">管理文章分类</a-button>
            </div>
          </a-form-item>
          <a-form-item label="封面图" v-bind="modelRule.front_cover">
            <CommonUpload class="mt-3" tip="支持jpg，gif，png格式的图片，建议：请尽量上传400×300px的图片，且最大不超过500KB"
              v-model:fileList="modelRef.front_cover" :selectType="MaterFileType.IMG" :max-size="0.5"></CommonUpload>
          </a-form-item>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="1" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">正文内容</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(1)">{{ activeKey.includes(1) ? '收起'
              : '展开'
          }}</span>
        </template>
        <div class="w-full">
          <a-form-item label v-bind="modelRule.content">
            <TinymceEdit v-model:content="modelRef.detail.content.detail" :height="500" selector="articleContent">
            </TinymceEdit>
          </a-form-item>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">SEO优化</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(2)">{{ activeKey.includes(2) ? '收起'
              : '展开'
          }}</span>
        </template>
        <SeoFormItem v-model:modelRef="modelRef" :modelRule="modelRule" typeStr="文章"></SeoFormItem>
      </a-collapse-panel>
      <a-collapse-panel key="3" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">其它</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(3)">{{ activeKey.includes(3) ? '收起'
              : '展开'
          }}</span>
        </template>
        <div class="w-full">
          <a-form-item label="网站显示日期" v-bind="modelRule.show_date">
            <a-date-picker size="large" v-model:value="modelRef.show_date" />
            <span class="text-gray-400 pl-3 text-xs">如设置显示日期的文章前台页面按设置的日期显示 ，否则默认显示文章的创建日期</span>
          </a-form-item>
          <a-form-item label="排序" v-bind="modelRule.sort_num">
            <SortNum v-model:value="modelRef.sort_num"></SortNum>
          </a-form-item>
          <a-form-item label="是否上架" v-bind="modelRule.status">
            <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" checked-children="是"
              un-checked-children="否" />
          </a-form-item>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <div class="mt-5 flex justify-center space-x-3 mb-6">
      <a-button class="w-[100px]" @click="onClear">取消</a-button>
      <a-button class="w-[100px]" type="primary" @click="onSubmit" :loading="spining">保存</a-button>
    </div>
  </a-form>
</template>

<style lang='scss' scoped>
:deep(.ant-form-item-control) {
  line-height: 32px;
}
</style>

