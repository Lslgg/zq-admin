<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { CodeMirror } from '@/components/codemirror'
import { CodeAllService } from '../shared/codeAll.service'

const { modelRef, modelRule, onSubmit } = await new CodeAllService().useForm()
</script>

<template>
  <a-form autocomplete="off" layout="vertical">
    <TemplateCard :hideTopRound="true">
      <div class="py-3 pt-6 flex flex-wrap">
        <a-form-item label="头部代码" v-bind="modelRule.header">
          <CodeMirror v-model:code="modelRef.header" :maxNum="50000" height="300"></CodeMirror>
        </a-form-item>
        <a-form-item label="版权代码" v-bind="modelRule.copyright">
          <CodeMirror v-model:code="modelRef.copyright" :maxNum="50000" height="300"></CodeMirror>
        </a-form-item>
        <a-form-item label="底部代码" v-bind="modelRule.footer">
          <CodeMirror v-model:code="modelRef.footer" :maxNum="50000" height="300"></CodeMirror>
        </a-form-item>
        <a-form-item label="全局代码" v-bind="modelRule.setting">
          <CodeMirror v-model:code="modelRef.setting" :maxNum="50000" height="300"></CodeMirror>
        </a-form-item>
      </div>
      <div class="flex justify-center pb-4">
        <a-button class="w-[100px]" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </TemplateCard>
  </a-form>
</template>

<style lang='scss' scoped>
:deep(.ant-form-item) {
  width: 100%;
  padding: 0 20px;
  margin-bottom: 0;
}
@media(min-width:1366px) {
  :deep(.ant-form-item) {
    width: 50%;
  }
}
</style>
