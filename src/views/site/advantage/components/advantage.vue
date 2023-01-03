<script setup lang='ts'>
import { AdvantageOperationService, UseAdvantagePagationService } from '../shared/useAdvantageInner.service'
import { TemplateCard } from '@/components/template'
import { CommonModal } from '@/components/common'
const { paging, getPatationList } = new UseAdvantagePagationService().usePagin()
const { visible, form, formRef, add, edit, del, submit } = new AdvantageOperationService(paging, getPatationList).useOperation()
</script>

<template>
  <div class='site-advantage'>
    <TemplateCard :soltTitle="true" :hideTopRound="true">
      <template #title>
        <div class=" text-sm"></div>
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
    <CommonModal v-model:visible="visible" title="添加公司优势" :isAutoClose="false" @ok="submit">
      <a-form :model="form" name="form" ref="formRef" layout="vertical" autocomplete="off">
        <a-form-item label="优势说明" name="content" :rules="[{ required: true, trigger: ['change', 'blur'], max: 1000, message: '文案长度少于1000字且不能为空' }]">
          <a-textarea v-model:value="form.content" show-count :maxlength="1000" :rows="5"></a-textarea>
        </a-form-item>
      </a-form>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
