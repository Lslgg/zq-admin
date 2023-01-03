
<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { UsePagation } from '../shared/inquiry.service'
import { UseCommon } from '@/util/useCommon'
const { paging, getPatationList } = new UsePagation(1, 2).usePagin()
</script>

<template>
  <TemplateCard title="最新询盘">
    <template #subtitle>
      <a-button size="small" type="primary" @click="UseCommon.ins().goUrlName('inquiryList')">查看更多</a-button>
    </template>
    <div class="p-2 px-0">
      <a-table
        :dataSource="paging.dataSource"
        :columns="paging.columns"
        :pagination="false"
        :loading="paging.loading"
        @change="getPatationList"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'inquiry_content'">
            <MediaText :text="text" :rows="3" />
          </template>
          <template v-if="column.dataIndex === 'is_read'">
            <MediaStatus :status="text == 1" />
          </template>
        </template>
      </a-table>
    </div>
  </TemplateCard>
</template>
