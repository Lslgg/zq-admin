
<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { ParamsForm } from '../shared/add.params.service'
import { ClassifyTreeSelect } from '@/components/classifyTreeSelect'
import { ECategoryType, } from '@/api/api.model'
import ParamsTypeList from '../components/paramsTypeList.vue'
import SortNum from '@/components/common/sortNum.vue'
const paramsForm = new ParamsForm()
const { settingList, checkList } = paramsForm.useCustomFrom()
const params = { settingList, checkList }
const { modelRule, modelRef, onSubmit, onBack } = await paramsForm.useForm(params)
settingList.value = paramsForm.setting?.value || [{ value: '', isChecked: false }]
checkList.value = paramsForm.checks?.value || []
</script>

<template>
  <div class="w-full">
    <TemplateCard title="添加产品参数" class="mt-6">
      <div class="p-4">
        <a-form autocomplete="off">
          <a-form-item label="产品分类" class="!mb-3" v-bind="modelRule.category_ids">
            <span class="flex justify-start items-center space-x-4">
              <ClassifyTreeSelect v-model:value="modelRef.category_ids" :type="ECategoryType.product" class="!w-1/2">
              </ClassifyTreeSelect>
              <span class="text-xs text-gray-999">备注：如选择“通用类”则该参数适用于所有产品</span>
            </span>
          </a-form-item>
          <a-form-item label="参数名称" class="!mb-3" v-bind="modelRule.param_name">
            <a-input v-model:value="modelRef.param_name" class="!w-1/2" :maxLength="100" />
          </a-form-item>
          <a-form-item label="展示方式" class="!mb-3" v-bind="modelRule.showType">
            <a-select class="!w-1/2" ref="select" v-model:value="modelRef.param_type">
              <a-select-option :value="1">文本</a-select-option>
              <a-select-option :value="2">单选</a-select-option>
              <a-select-option :value="3">多选</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="modelRef.param_type === 1" label="预设默认值" class="!mb-3" v-bind="modelRule.value">
            <a-input v-model:value="modelRef.value" class="!w-1/2" :maxLength="100" :showCount="true" />
          </a-form-item>
          <a-form-item v-if="modelRef.param_type !== 1" label="属性值" class="!mb-3" v-bind="modelRule.value">
            <ParamsTypeList v-model:settingList="settingList" v-model:checkList="checkList"
              :paramsType="modelRef.param_type"></ParamsTypeList>
          </a-form-item>
          <a-form-item v-if="modelRef.param_type === 3" label="允许图片展示" class="!mb-3" v-bind="modelRule.is_allow_img">
            <a-switch v-model:checked="modelRef.is_allow_img" :checkedValue="1" :unCheckedValue="0" checked-children="是"
              un-checked-children="否" />
          </a-form-item>
          <a-form-item label="是否必填" class="!mb-3" v-bind="modelRule.is_require">
            <a-switch v-model:checked="modelRef.is_require" :checkedValue="1" :unCheckedValue="0" checked-children="是"
              un-checked-children="否" />
          </a-form-item>
          <a-form-item label="状态" class="!mb-3" v-bind="modelRule.status">
            <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" checked-children="启用"
              un-checked-children="禁用" />
          </a-form-item>
          <a-form-item label="排序" class="!mb-3" v-bind="modelRule.sort_num">
            <SortNum v-model:value="modelRef.sort_num"></SortNum>
          </a-form-item>
          <a-form-item>
            <div class="space-x-4 text-center">
              <a-button type="primary" @click="onSubmit">确定</a-button>
              <a-button @click="onBack">取消</a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </TemplateCard>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-form-horizontal .ant-form-item-label) {
  min-width: 100px;
}

:deep(.ant-select-selection-item) {
  display: flex;
  align-items: center;
}
</style>
