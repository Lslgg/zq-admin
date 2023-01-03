<script setup lang='ts'>
import { PlusOutlined } from '@ant-design/icons-vue'
import { TemplateCard } from '@/components/template'
import { UseClassifyOperation, UseClassifyPagation, UseClassifyService } from './shared/classify.service'
import AddClassify from './components/addClassify.vue'
import { PropType } from 'vue'
import { UseCommon } from '@/util/useCommon'
const props = defineProps({
  type: { required: true, type: String as PropType<CategoryType>, default: 'product' }
})
const categoryType = UseCommon.ins().getClassifyValue(props.type)
const { columns } = await new UseClassifyService(categoryType).useService()
const { paging, getPatationList } = new UseClassifyPagation(categoryType, columns).usePagin()
const useClassify = new UseClassifyOperation(paging, getPatationList, categoryType).useOperation()
const {
  visible, category, activeKey,
  onEdit, onDel, onAdd, onChangeStatus, onAddSuccess
} = useClassify
activeKey.value = columns?.[0].id || 0
</script>

<template>
  <div class="w-full">
    <TemplateCard :hideTopRound="true">
      <div class="py-4">
        <div class="flex items-center justify-between pb-4">
          <span>分类添加支持到三级</span>
          <a-button class="flex items-center" type="primary" @click="onAdd(0)" size="small">
            <template #icon>
              <PlusOutlined></PlusOutlined>
            </template>
            <span>添加分类</span>
          </a-button>
        </div>
        <a-table :dataSource="paging.dataSource" :columns="paging.columns" :pagination="false" rowKey="id"
          :defaultExpandAllRows="true" @change="getPatationList">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-switch v-model:checked="record.status" :checkedValue="1" :unCheckedValue="0" checked-children="已启用"
                un-checked-children="已禁用" @change="onChangeStatus(record)" />
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex items-center space-x-3">
                <a v-if="record.deep !== 2" type="link" @click="onAdd(record.id)">添加</a>
                <a type="link" @click="onEdit(record.id)">编辑</a>
                <a type="link" @click="onDel(record.id, categoryType)">删除</a>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <AddClassify v-if="visible" v-model:visible="visible" :type="categoryType" v-model:category="category"
      @onOk="onAddSuccess"></AddClassify>
  </div>
</template>
