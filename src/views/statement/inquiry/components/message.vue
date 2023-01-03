<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { UseMesssageForm } from '../shared/useMeassage.service'
const { modelRef, modelRule, onSubmit } = await new UseMesssageForm().useForm()
</script>

<template>
  <div class>
    <TemplateCard :soltTitle="true">
      <template #title>
        <div>
          <div class="text-lg font-bold text-black">询盘通知邮箱</div>
          <div class="text-gray-500 text-xs mt-2">设置询盘通知的接收邮箱，网站收到询盘后系统将第一时间发送询盘邮件提醒通知。</div>
        </div>
      </template>
      <div class="pt-5">
        <a-form>
          <a-form-item extra="支持输入多个邮箱，一行一个，不超过20个" name="email" v-bind="modelRule.inquiry_email">
            <a-textarea :autoSize="{ minRows: 10 }" v-model:value="modelRef.inquiry_email" :showCount="true"
              :maxlength="3000"></a-textarea>
          </a-form-item>
          <a-form-item class="text-center">
            <a-button type="primary" @click="onSubmit" size="small">保存</a-button>
          </a-form-item>
        </a-form>
      </div>
    </TemplateCard>
  </div>
</template>

<style lang='scss' scoped>
</style>
