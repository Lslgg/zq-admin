<script setup lang='ts'>
import { FaqOperationService, UseFaqPagationService } from '../shared/useFaq.service'
import { TemplateCard } from '@/components/template'
import { CommonModal } from '@/components/common'

const { paging, getPatationList } = new UseFaqPagationService().usePagin()
const { visible, form, formRef, add, edit, del, submit } = new FaqOperationService(paging, getPatationList).useOperation()
</script>

<template>
  <div class='site-faq'>
    <TemplateCard :soltTitle="true" :hideTopRound="true">
      <template #title>
        <div class=" text-sm">公司FAQ能快速解决访客疑虑，给客户树立专业的感觉，建议最少添加5条。</div>
      </template>
      <template #subtitle>
        <a-button type="primary" @click="add">
          +添加
        </a-button>
      </template>
      <div class="base-table">
        <a-table
          :dataSource="paging.dataSource"
          :columns="paging.columns"
          :pagination="paging.pagination"
          :loading="paging.loading"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <MediaImage :src="record.image" :width="100" />
            </template>
            <template v-if="column.key === 'action'">
              <div class=" flex items-center">
                <a-button type="link" @click="edit(record.id)">编辑</a-button>
                <a-button type="link" @click="del(record.id)">删除</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <CommonModal v-model:visible="visible" title="添加公司FAQ" :isAutoClose="false" @ok="submit">
      <a-form :model="form" name="form" ref="formRef" autocomplete="off" :labelCol="{ span: 2 }" :wrapperCol="{ span: 22 }">
        <a-form-item label="问题" name="question" :rules="[{ required: true, trigger: ['change', 'blur'], message: '内容不能为空' }]">
          <a-input-search v-model:value="form.question" placeholder="请输入你的问题">
            <template #enterButton>
              <a-button type="primary" html-type="button">智能生成</a-button>
            </template>
          </a-input-search>
        </a-form-item>
        <a-form-item label="答案" name="answer" :rules="[{ required: true, trigger: ['change', 'blur'], max: 1000, message: '文案长度少于1000字且不能为空' }]">
          <a-textarea v-model:value="form.answer" show-count :maxlength="1000" :rows="5" placeholder="请输入你的答案"></a-textarea>
        </a-form-item>
      </a-form>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
