
<script setup lang='ts'>
import { ref } from 'vue'
import { UseVideoForm } from '../shared/add.video.service'
import { CommonUpload, SortNum } from '@/components/common'
import { TinymceEdit } from '@/components/tinymceEdit'
import { ClassifyTreeSelect } from '@/components/classifyTreeSelect'
import { ECategoryType, MaterFileType } from '@/api/api.model'
import { SeoFormItem } from '../../components'
const activeKey = ref<number[]>([0, 1, 2, 3])
const myForm = new UseVideoForm()
const { modelRule, modelRef, onSubmit, spining } = await myForm.useForm()
const { onClassify, onClear } = myForm.useOtherForm()
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
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(0)">{{ activeKey.includes(0) ? '收起' : '展开' }}</span>
        </template>
        <div class="w-full">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="标题" v-bind="modelRule.title">
                <a-input v-model:value="modelRef.title" :maxlength="150" placeholder="请输入标题，少于150字符，尽量在60个字符最优" :showCount="true"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="视频简介" v-bind="modelRule.summary">
                <a-textarea :maxlength="3000" show-count v-model:value="modelRef.summary" placeholder="请输入视频简介最大字符3000" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="视频分类" v-bind="modelRule.category_ids">
                <div class="flex items-center space-x-6">
                  <ClassifyTreeSelect :is-default-item="false" v-model:value="modelRef.category_ids" :type="ECategoryType.video"></ClassifyTreeSelect>
                  <a-button @click="onClassify">管理视频分类</a-button>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="视频" v-bind="modelRule.video">
                <CommonUpload class="mt-3" direction="horizontal" v-model:fileList="modelRef.video" :selectType="MaterFileType.VEDIO" content="上传视频"></CommonUpload>
                <template #extra>
                  <div class="text-gray-400 text-xs p-2">
                    <span>支持mp4格式，建议上传视频不超过50M</span>
                  </div>
                </template>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="封面图" v-bind="modelRule.front_cover">
                <CommonUpload class="mt-3" v-model:fileList="modelRef.front_cover" :selectType="MaterFileType.IMG" :max-size="0.5"></CommonUpload>
                <template #extra>
                  <div class="text-gray-400 text-xs p-2">
                    <span>视频封面建议采用尺寸：1920 * 1080 或16 : 9大小的图片，如未提供封面图片则自动获取视频画面作为视频封面图</span>
                  </div>
                </template>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="1" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">视频描述</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(1)">{{ activeKey.includes(1) ? '收起' : '展开' }}</span>
        </template>
        <div class="w-full">
          <a-form-item label v-bind="modelRule.content">
            <TinymceEdit v-model:content="modelRef.detail.content.detail" :height="500" selector="videoContent"></TinymceEdit>
          </a-form-item>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">SEO优化</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(2)">{{ activeKey.includes(2) ? '收起' : '展开' }}</span>
        </template>
        <div class="w-full">
          <SeoFormItem v-model:modelRef="modelRef" :modelRule="modelRule" typeStr="视频"></SeoFormItem>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="3" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
        <template #header>
          <span class="text-lg font-bold text-black">其它</span>
        </template>
        <template #extra>
          <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse(3)">{{ activeKey.includes(3) ? '收起' : '展开' }}</span>
        </template>
        <div class="w-full">
          <a-form-item label="排序" v-bind="modelRule.sort_num">
            <SortNum v-model:value="modelRef.sort_num"></SortNum>
          </a-form-item>
          <a-form-item label="是否上架" v-bind="modelRule.status">
            <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" checked-children="是" un-checked-children="否" />
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

