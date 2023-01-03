<script setup lang="ts">
import { TemplateCard } from '@/components/template'
import { MyTag } from '@/components/myIcon'
import { CustomFilter, FilterItem, StatusTdItem } from '../components'
import ArticleSearch from './components/articleSearch.vue'
import { UseOperation, UsePagation } from './shared/article.service'
import { ECategoryType } from '@/api/api.model'

const { paging, getPatationList, onSelectChange } = new UsePagation().usePagin()
const {
  onEdit,
  onDel,
  onTop,
  onPublish,
  onOperate,
  onChangeSort,
  onKeyword,
} = new UseOperation(paging, getPatationList).useOperation()
</script>

<template>
  <div class="w-full">
    <TemplateCard>
      <ArticleSearch class="p-5" @onOperate="onOperate" @onKeyword="onKeyword" :selectKey="paging.selectedRowKeys"></ArticleSearch>
      <div class="p-5 pt-0">
        <FilterItem v-model:pagingWhere="paging.where" :getList="getPatationList"></FilterItem>
        <a-table
          :row-selection="{ selectedRowKeys: paging.selectedRowKeys, onChange: onSelectChange }"
          :dataSource="paging.dataSource"
          :columns="paging.columns"
          :pagination="paging.pagination"
          :loading="paging.loading"
          rowKey="id"
          @change="getPatationList"
          tableLayout="fixed"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <div class="flex space-x-2 items-center">
                <div class="shrink-0 w-24" v-if="record.front_cover">
                  <a-badge-ribbon v-if="record.is_top" text="Top" color="volcano" placement="start">
                    <MediaImage :src="record.front_cover.url" width="100%" />
                  </a-badge-ribbon>
                  <MediaImage v-else :src="record.front_cover.url" width="100%" />
                </div>
                <a-typography-link :href="record.articleUrl" target="_blank" class="w-[200px]">{{ record.title }}</a-typography-link>
              </div>
            </template>
            <template v-if="column.key === 'category'">
              <div class="fielx justify-start items-center flex-wrap max-w-[280px]">
                <MyTag v-if="record.tags" :tags="record.tags"></MyTag>
              </div>
            </template>
            <template v-if="column.key === 'status'">
              <StatusTdItem :status="record.status"></StatusTdItem>
            </template>
            <template v-if="column.key === 'is_google_include'">
              <span v-if="record.is_google_include">已收录</span>
              <span v-else>未收录</span>
            </template>
            <template v-if="column.key === 'sort_num'">
              <a-input-number
                size="small"
                v-model:value="record.sort_num"
                :min="1"
                :max="9999"
                class="!w-20"
                @change="onChangeSort(record)"
                @pressEnter="onChangeSort(record)"
                :controls="false"
              />
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex items-center flex-wrap">
                <MediaLink class="mb-2 mr-2" @click="onEdit(record.id)">编辑</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onDel(record.id)">删除</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onTop(record.id, record.is_top === 1 ? 0 : 1)" :danger="record.is_top">{{ record.is_top ? '取消置顶' : '置顶' }}</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onPublish(record.id, record.status === 1 ? 0 : 1)" :danger="record.status">{{ record.status ? '下架' : '上架' }}</MediaLink>
              </div>
            </template>
          </template>
          <template #customFilterDropdown="{ column }">
            <CustomFilter v-model:pagingWhere="paging.where" :columnKey="column.key" :paging="paging" :getList="getPatationList" :classType="ECategoryType.article"></CustomFilter>
          </template>
        </a-table>
      </div>
    </TemplateCard>
  </div>
</template>
