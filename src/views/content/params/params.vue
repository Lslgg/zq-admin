<script setup lang='ts'>
import { PlusOutlined } from '@ant-design/icons-vue'
import { TemplateCard } from '@/components/template'
import { ParamsOperationService, ParamsTableService } from './shared/params.service'
const { paging, getPatationList } = new ParamsTableService().usePagin()
const { onEdit, onDel, onChangeStatus } = new ParamsOperationService(paging, getPatationList).useOperation()
</script>

<template>
  <TemplateCard>
    <div class="flex justify-between items-center p-4">
      <span>产品参数能反映出产品的特性、功能、规格等,如产品的材质、尺寸、规格,性能、颜色等,如参数名称:Color,参数值:Blue,Red。</span>
      <a-button @click="onEdit(0)" class="flex items-center" size="small" type="primary">
        <template #icon>
          <PlusOutlined />
        </template>
        <span>添加</span>
      </a-button>
    </div>
    <div class="p-4 pt-0">
      <a-table
        :dataSource="paging.dataSource"
        :columns="paging.columns"
        :pagination="paging.pagination"
        :loading="paging.loading"
        @change="getPatationList"
        tableLayout="fixed"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.key === 'param_name'">
            <MediaText :text="text" :rows="3" />
          </template>
          <template v-if="column.key === 'categoryName'">
            <MediaText :text="text" :rows="3" />
          </template>
          <template v-if="column.key === 'column'">
            <MediaText :text="text" :rows="3" />
          </template>
          <template v-if="column.key === 'opation'">
            <MediaText :text="text" :rows="3" />
          </template>
          <template v-if="column.key === 'defalutValue'">
            <MediaText :text="text" :rows="3" />
          </template>
          <template v-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="1"
              :unCheckedValue="0"
              checked-children="启用"
              un-checked-children="禁用"
              @change="onChangeStatus(record)"
            />
          </template>
          <template v-if="column.key === 'action'">
            <MediaLink class="mb-2 mr-2" @click="onEdit(record.id)">编辑</MediaLink>
            <MediaLink @click="onDel(record.id)">删除</MediaLink>
          </template>
        </template>
      </a-table>
    </div>
  </TemplateCard>
</template>

<style lang='scss' scoped>
</style>
