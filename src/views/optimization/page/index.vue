<script setup lang='ts'>
import { CommonTab, CommonSearch } from '@/components/common'
import { TemplateCard } from '@/components/template'
import SeoModal from '../components/seoModal.vue'
import { PageListOperationService, UsePageListPagationService } from './shared/usePage.service'
const { paging, getPatationList } = new UsePageListPagationService().usePagin()
const { tabList, activeTab, filters, visible, seoId, onEdit, onBuild, onChangeTab, onSearch } = new PageListOperationService(paging, getPatationList).useOperation()
</script>

<template>
  <div class>
    <CommonTab :tabList="tabList" v-model:activeTab="activeTab" @onChange="onChangeTab"></CommonTab>
    <TemplateCard :soltTitle="true" :hideTopRound="true">
      <template #title>
        <div class="flex items-center">
          <CommonSearch tip="请输入" v-model:keyword="filters.search" @onSearch="onSearch"></CommonSearch>
        </div>
      </template>
      <div class="pt-2">
        <a-table
          :dataSource="paging.dataSource"
          :columns="paging.columns"
          :pagination="paging.pagination"
          :loading="paging.loading"
          tableLayout="fixed"
          @change="getPatationList"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'name'">
              <div class="flex items-center">
                <MediaImage :src="record.image" :width="100" />
                <MediaText class="pl-2" :text="text" />
              </div>
            </template>
            <template v-if="column.key === 'path'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'title'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'seo_keyword'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'seo_title'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'seo_description'">
              <MediaText :text="text" :rows="3" />
            </template>
            <template v-if="column.key === 'action'">
              <MediaLink class="mb-2 mr-2" @click="onEdit(record)">编辑</MediaLink>
              <MediaLink @click="onBuild(record)">自动生成TDK</MediaLink>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <SeoModal v-if="visible" v-model:visible="visible" :id="seoId" :type="activeTab" @onOk="getPatationList"></SeoModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
