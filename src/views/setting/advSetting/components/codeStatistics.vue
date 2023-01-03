<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { UseStyleForm } from '../shared/useStyle.service'
import { CodeMirror } from '@/components/codemirror'

const { modelRef, modelRule, onSubmit } = await new UseStyleForm().useForm()
</script>

<template>
  <div class=''>
    <TemplateCard title="">
      <div class="py-3">
        <a-form autocomplete="off" layout="vertical" class="flex justify-between space-x-2">
          <a-form-item label="样式代码" v-bind="modelRule.style_code" class="flex-1 max-w-[50%]">
            <CodeMirror v-model:code="modelRef.style_code" mode="css" height="620" :maxNum="30000"></CodeMirror>
          </a-form-item>
          <a-form-item label="脚本代码" v-bind="modelRule.script_code" class="flex-1 max-w-[50%]">
            <CodeMirror v-model:code="modelRef.script_code" mode="javascript" height="620" :maxNum="30000"></CodeMirror>
          </a-form-item>
        </a-form>
        <div class="flex justify-center">
          <a-button class="w-[100px]" type="primary" @click="onSubmit" size="small">保存</a-button>
        </div>
      </div>
    </TemplateCard>
  </div>
</template>

<style lang='scss' scoped>
</style>
