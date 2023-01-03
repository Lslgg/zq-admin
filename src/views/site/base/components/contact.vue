<script setup lang='ts'>
import { ContactOperationService, UseContactPagationService } from '../shared/useContact.service'
import { TemplateCard } from '@/components/template'
import { CommonModal } from '@/components/common'
const { paging, getPatationList } = new UseContactPagationService().usePagin()
const { contactTypes, contactTypesObj, visible, form, rules, modalTitle, modalView, add, edit, del } = new ContactOperationService(paging, getPatationList).useOperation()

</script>

<template>
  <div class='base-contact'>
    <TemplateCard :soltTitle="true" :hideTopRound="true">
      <template #title>
        <div class=" text-sm">联系信息是能让客户找到你的至关重要的信息，提供给客户的联系方式可以是电话、邮箱、即时聊天帐号、社交媒体帐号等。</div>
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
            <template v-if="column.key === 'type'">
              <p>{{ contactTypesObj[record.type] }}</p>
            </template>
            <template v-else-if="column.key === 'content'">
              <div v-if="record.type !== 5">
                {{ record.content }}
              </div>
              <div class=" w-28" v-else>
                <MediaImage :src="record.content" alt="" />
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <div class=" flex items-center">
                <a-button type="link" @click="edit(record.id)">编辑</a-button>
                <a-button type="link" @click="del(record.id)">删除</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <CommonModal v-model:visible="visible" :title="modalTitle">
      <div v-if="modalView === 0">
        <div>请先选择联系方式</div>
        <div class="pt-5 flex flex-wrap -m-2">
          <div class="p-2" v-for="item in contactTypes" :key="item.id">
            <a-button>{{ item.name }}</a-button>
          </div>
        </div>
      </div>
      <div v-if="modalView === 1">
        <a-form ref="formRef" :modal="form" :rules="rules" name="contact-form">
          <a-form-item has-feedback label="联系电话" name="content">
            <a-input v-model:value="form.content" />
          </a-form-item>
        </a-form>
      </div>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
