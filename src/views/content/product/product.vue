<script setup lang="ts">
import TemplateCard from '@/components/template/templateCard.vue'
import ProductSearch from './components/productSearch.vue'
import { MyTag } from '@/components/myIcon'
import { ProductOperationService, UseProductPagationService } from './shared/product.service'
import { CustomFilter, FilterItem, StatusTdItem } from '../components'
const { paging, getPatationList, onSelectChange } = new UseProductPagationService().usePagin()
const {
  onSearch, onEdit, onDel, onTop,
  onPublish, onResultList, onChangeSort
} = new ProductOperationService(paging, getPatationList).useOperation()
</script>

<template>
  <div class="w-full">
    <TemplateCard>
      <ProductSearch class="p-5" :selectKey="paging.selectedRowKeys" @onPublish="onResultList" @onSearch="onSearch">
      </ProductSearch>
      <div class="p-5 pt-0">
        <FilterItem v-model:pagingWhere="paging.where" :getList="getPatationList"></FilterItem>
        <a-table :row-selection="{ selectedRowKeys: paging.selectedRowKeys, onChange: onSelectChange }"
          :dataSource="paging.dataSource" :columns="paging.columns" :pagination="paging.pagination"
          @change="getPatationList" rowKey="id" tableLayout="fixed" :scroll="{ x: 'max-content' }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'sort_num'">
              <a-input-number size="small" v-model:value="record.sort_num" :min="1" :max="9999" class="!w-20"
                @change="onChangeSort(record)" @pressEnter="onChangeSort(record)" :controls="false" />
            </template>
            <template v-if="column.key === 'title'">
              <div class="flex space-x-2 items-center">
                <div class="shrink-0 w-24" v-if="record.img && record.img.length > 0">
                  <a-badge-ribbon v-if="record.is_top" text="Top" color="volcano" placement="start">
                    <MediaImage :src="record.img[0].url" width="100%" />
                  </a-badge-ribbon>
                  <MediaImage v-else :src="record.img[0].url" width="100%" />
                </div>
                <a-typography-link :href="record.productUrl" target="_blank" class="w-[200px]">{{ record.title }}
                </a-typography-link>
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
            <template v-if="column.key === 'action'">
              <div class="flex items-center flex-wrap">
                <MediaLink class="mb-2 mr-2" @click="onEdit(record.id)">编辑</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onDel(record.id)">删除</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onTop(record.id, !record.is_top)" :danger="record.is_top"> {{ record.is_top ? '取消置顶' : '置顶' }} </MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onPublish(record.id, !record.status)" :danger="record.status"> {{ record.status ? '下架' : '上架' }} </MediaLink>
              </div>
            </template>
          </template>
          <template #customFilterDropdown="{ column }">
            <CustomFilter v-model:pagingWhere="paging.where" :columnKey="column.key" :paging="paging"
              :getList="getPatationList"></CustomFilter>
          </template>
        </a-table>
      </div>
    </TemplateCard>
  </div>
</template>
