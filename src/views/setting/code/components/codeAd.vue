<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { UseAdForm } from '../shared/useCodeAd.service'

const { modelRef, onSubmit } = await new UseAdForm().useForm()
</script>

<template>
  <div class=''>
    <a-form autocomplete="off" :labelCol="{ span: 2 }" :wrapperCol="{ span: 18 }">
      <TemplateCard title="Google 广告跟踪代码" :hideTopRound="true" >
        <div class="py-3">
          <a-form-item label="跟踪代码">
            <a-textarea v-model:value="modelRef.gaCode" :autoSize="{ minRows: 10 }"></a-textarea>
          </a-form-item>
        </div>
      </TemplateCard>
      <TemplateCard title="Facebook 广告跟踪代码" class=" mt-3">
        <div class="py-3">
          <a-form-item label="跟踪代码">
            <a-textarea v-model:value="modelRef.faceCode" :autoSize="{ minRows: 10 }"></a-textarea>
          </a-form-item>
        </div>
      </TemplateCard>
      <div class=" mt-5 flex justify-end">
        <a-button class="w-[100px]" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </a-form>
  </div>
</template>

<style lang='scss' scoped>
</style>
