
<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { CommonModal } from '@/components/common'
import { MyTag } from '@/components/myIcon'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { UseKeywordsPagationService, KeywordsOperationService, KeywordsForm } from './shared/useKeywords.service'
import CommonSearch from '@/components/common/commonSearch.vue'

const { paging, getPatationList, onSelectChange } = new UseKeywordsPagationService().usePagin()
const service = new KeywordsOperationService(paging, getPatationList)
const { tagList, disableKey } = await service.getTagCategroy()
const {
  keywordVisible, tagVisible, tags, category_ids, searchKey,
  addKeyword, addTags, setTags, closeTags, filterTags, onDel, onSearch, onImportPage
} = service.useOperation()
const { modelRef, modelRule, onSubmit } = await new KeywordsForm().useForm(() => {
  searchKey.value = ''
  getPatationList({ keyword: '', current: 1 })
  keywordVisible.value = false
  modelRef.keywords = []
})
const onfilter = (value: string[]) => {
  modelRef.keywords = value.filter((item: string) => item.length <= 50)
    .filter((_item, index) => index < 20)
}
</script>

<template>
  <div class>
    <TemplateCard :soltTitle="true">
      <template #title>
        <CommonSearch v-model:keyword="searchKey" tip="请输入查找关健词搜索" @on-search="onSearch"></CommonSearch>
      </template>
      <template #subtitle>
        <div class="flex items-center">
          <a-button class="mx-1" @click="addTags()">打标签</a-button>
          <a-button class="mx-1" @click="onImportPage()">导入</a-button>
          <a-button class="mx-1" type="primary" @click="addKeyword">添加关键词</a-button>
        </div>
      </template>
      <div ref="table">
        <a-table @change="getPatationList"
          :row-selection="{ selectedRowKeys: paging.selectedRowKeys, onChange: onSelectChange }" rowKey="id"
          :dataSource="paging.dataSource" :columns="paging.columns" :pagination="paging.pagination"
          :loading="paging.loading" tableLayout="fixed" :scroll="{ x: 'max-content' }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'tags'">
              <MyTag ref="tagRefs" :tags="filterTags(record)" :closable="true" :exclude="[disableKey]"
                @onClose="(key) => closeTags(key, record)"></MyTag>
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex items-center">
                <a class="pr-3 py-2" type="link" @click="addTags(record)">打标签</a>
                <a-dropdown v-if="!record.isMainKey" :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    <ellipsis-outlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="0">
                        <a @click="onDel(record.id)">删除</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <CommonModal v-model:visible="keywordVisible" :isAutoClose="false" class-name="!w-[80%] !max-w-[600px]" title="添加关键词"
      @ok="onSubmit">
      <a-form autocomplete="off">
        <a-form-item label="关键词" name="keywords" v-bind="modelRule.keywords"
          extra="支持添加多个关键词，按回车一个，每次批量添加不超过20个且关键词少于50字符">
          <a-select size="large" v-model:value="modelRef.keywords" mode="tags" style="width: 100%"
            :token-separators="[',']" placeholder="请输入关键词" :open="false" @change="onfilter" allowClear></a-select>
        </a-form-item>
      </a-form>
    </CommonModal>
    <CommonModal wrapClassName="keyword-modal" v-model:visible="tagVisible"
      class-name="!w-[580px] !max-w-[980px]" title="打标签" @ok="setTags">
      <div>
        <p>勾选下列标签，可为关键词与标签建立关联关系</p>
        <!-- 标签 -->
        <a-checkbox-group v-model:value="tags" class="!block overflow-hidden">
          <div class="py-2 -m-2">
            <div class="p-2 pt-4 font-bold">{{ tagList[0].title }}</div>
            <div class="flex flex-wrap">
              <div class="flex-[33%] p-2" v-for="tag in tagList[0].content" :key="tag.key">
                <a-checkbox :value="tag.key" :disabled="tag.key === disableKey">{{ tag.value }}</a-checkbox>
              </div>
            </div>
          </div>
        </a-checkbox-group>
        <!-- 分类 -->
        <a-checkbox-group v-model:value="category_ids" class="!block overflow-hidden">
          <template v-for="item in tagList">
            <div :key="item.id" class="py-2 -m-2" v-if="item.id !== 0">
              <div class="p-2 pt-4 font-bold">{{ item.title }}</div>
              <div class="grid grid-cols-3">
                <div class="p-2" v-for="tag in item.content" :key="tag.key">
                  <a-checkbox :value="tag.key">
                    <MediaText class="max-w-[8rem]" :text="tag.value" :rows="1" />
                  </a-checkbox>
                </div>
              </div>
            </div>
          </template>
        </a-checkbox-group>
      </div>
    </CommonModal>
  </div>
</template>

<style lang='scss'>
.keyword-modal {
  .ant-modal-body {
    max-height: 50vh;
    overflow-y: auto;
  }
}
</style>
