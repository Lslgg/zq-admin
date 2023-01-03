
<script setup lang='ts'>
import AddNavigation from './components/addNavigation.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { NavigationOperation, NavigationTable } from './shared/navigation.service'
const { paging, getPatationList } = await new NavigationTable().usePagin()
const nav = new NavigationOperation(paging, getPatationList).useOperation()
const { addVisible, id, pid } = nav
</script>

<template>
  <div class='navigation'>
    <TemplateCard :hideTopRound="true">
      <div class="py-4">
        <div class="flex items-center justify-between pb-4">
          <span>导航添加支持到三级</span>
          <a-button class="flex items-center" type="primary" @click="nav.onAdd()" size="small">
            <template #icon>
              <PlusOutlined></PlusOutlined>
            </template>
            <span>新建页面</span>
          </a-button>
        </div>
        <a-table :dataSource="paging.dataSource" :columns="paging.columns" :pagination="false" rowKey="id"
          :defaultExpandAllRows="true" @change="getPatationList" tableLayout="fixed" :scroll="{ x: 'max-content' }">
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'title'">
              <MediaText class="w-60" :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'content_type_text'">
              {{ text === '自定义页' ? '单页' : `${text}列表` }}
            </template>
            <template v-if="column.key === 'path'">
              <MediaText class="w-60" :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'active_in_category'">
              <div v-if="record.active_in_category && record.active_in_category.length > 0">
                <a-tag v-for="(item, index) in record.active_in_category.map((p: any) => p.category_name)" :key="index">
                  {{ item }}</a-tag>
              </div>
            </template>
            <template v-if="column.key === 'status'">
              <template v-if="record.content_type !== 'home'">
                <a-switch v-model:checked="record.status" :checkedValue="1" :unCheckedValue="0" checked-children="已启用"
                  un-checked-children="已禁用" @change="nav.onChangeStatus(record)" />
              </template>
              <template v-else>
                {{ record.status === 1 ? '已启用' : '已禁用' }}
              </template>
            </template>
            <template v-if="column.key === 'sort_num'">
              <a-input-number v-if="record.content_type !== 'home'" size="small" v-model:value="record.sort_num"
                :min="1" :max="9999" class="!w-20" @change="nav.onChangeSort(record)"
                @pressEnter="nav.onChangeSort(record)" :controls="false" />
              <span v-else>{{text}}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex items-start flex-wrap">
                <a v-if="record.level !== 4 && record.content_type !== 'home'" type="link" class="mb-2 mr-2"
                  @click="nav.onAddNext(record.id)">添加下级</a>
                <a class="mb-2 mr-2" type="link" @click="nav.onEdit(record.id)">编辑</a>
                <a v-if="record.content_type !== 'home'" class="mb-2 mr-2" type="link"
                  @click="nav.onDel(record.id)">删除</a>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <AddNavigation v-if="addVisible" @onAddSubmit="nav.onAddSubmit" v-model:visible="addVisible"
      :nav-list="paging.dataSource" :id="id" :pid="pid">
    </AddNavigation>
  </div>
</template>

<style lang='scss' scoped>
</style>
