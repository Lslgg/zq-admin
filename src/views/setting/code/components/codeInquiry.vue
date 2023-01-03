<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { UseInquiryForm } from '../shared/useCodeInquiry.service'
import { CodeMirror } from '@/components/codemirror'

const { modelRef, modelRule, onSubmit } = await new UseInquiryForm().useForm()
</script>

<template>
  <a-form autocomplete="off" :labelCol="{ span: 2 }" :wrapperCol="{ span: 18 }">
    <TemplateCard :hideTopRound="true">
      <div class="py-3 pt-6">
        <a-form-item label="跟踪代码" v-bind="modelRule.inquiry_code">
          <CodeMirror v-model:code="modelRef.inquiry_code" :maxNum="3000" mode="htmlmixed"></CodeMirror>
        </a-form-item>
        <div class="flex justify-center">
          <a-button class="w-[100px]" type="primary" @click="onSubmit">保存</a-button>
        </div>
      </div>
    </TemplateCard>
  </a-form>
</template>

<style lang='scss' scoped>
</style>
