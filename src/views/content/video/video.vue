<script setup lang="ts">
import { ref } from 'vue'
import TemplateCard from '@/components/template/templateCard.vue'
import VideoSearch from './components/videoSearch.vue'
import { MyTag } from '@/components/myIcon'
import { UseOperation, UsePagation } from './shared/video.service'
import { CommonVideoPlay } from '@/components/common'
import { PlayCircleFilled } from '@ant-design/icons-vue'
import { CustomFilter, FilterItem, StatusTdItem } from '../components'
import { ECategoryType } from '@/api/api.model'
const { paging, getPatationList, onSelectChange } = new UsePagation().usePagin()
const {
  onEdit,
  onKeyword,
  onDel,
  onTop,
  onPublish,
  onOperate,
  onChangeSort,
} = new UseOperation(paging, getPatationList).useOperation()
const videoSrc = ref('')
const visible = ref(false)
const onPlay = (video: any) => {
  videoSrc.value = video.url
  visible.value = true
}
</script>

<template>
  <div class="w-full">
    <TemplateCard>
      <VideoSearch class="p-5" @onOperate="onOperate" @onKeyword="onKeyword" :selectKey="paging.selectedRowKeys">
      </VideoSearch>
      <div class="p-5 pt-0">
        <FilterItem v-model:pagingWhere="paging.where" :getList="getPatationList"></FilterItem>
        <a-table @change="getPatationList"
          :row-selection="{ selectedRowKeys: paging.selectedRowKeys, onChange: onSelectChange, }"
          :dataSource="paging.dataSource" :columns="paging.columns" :pagination="paging.pagination"
          :loading="paging.loading" rowKey="id" tableLayout="fixed" :scroll="{ x: 'max-content' }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <div class="flex space-x-2 items-center">
                <div class="shrink-0 w-24 relative" v-if="record.imgUrl">
                  <a-badge-ribbon v-if="record.is_top" text="Top" color="volcano" placement="start">
                    <MediaImage :src="record.imgUrl" width="100%" />
                  </a-badge-ribbon>
                  <MediaImage v-else :src="record.imgUrl" width="100%" />
                  <div class="w-full absolute h-full top-0 left-0" @click.stop="onPlay(record.video)">
                    <play-circle-filled class="absolute text-white text-3xl leading-none left-[35%] top-[20%]" />
                  </div>
                </div>
                <a-typography-link :href="record.videoUrl" target="_blank" class="w-[200px]">{{ record.title }}
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
            <template v-if="column.key === 'sort_num'">
              <a-input-number size="small" v-model:value="record.sort_num" :min="1" :max="9999" class="!w-20"
                @change="onChangeSort(record)" @pressEnter="onChangeSort(record)" :controls="false" />
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex items-center flex-wrap">
                <MediaLink class="mb-2 mr-2" @click="onEdit(record.id)">编辑</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onDel(record.id)">删除</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onTop(record.id, !record.is_top)" :danger="record.is_top">{{
                    record.is_top ? '取消置顶' : '置顶'
                }}</MediaLink>
                <MediaLink class="mb-2 mr-2" @click="onPublish(record.id, !record.status)" :danger="record.status">{{
                    record.status ? '下架' : '上架'
                }}</MediaLink>
              </div>
            </template>
          </template>
          <template #customFilterDropdown="{ column }">
            <CustomFilter v-model:pagingWhere="paging.where" :columnKey="column.key" :paging="paging"
              :getList="getPatationList" :classType="ECategoryType.video"></CustomFilter>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <CommonVideoPlay v-model:visible="visible" :src="videoSrc"></CommonVideoPlay>
  </div>
</template>

<style lang="scss" scoped>
</style>
