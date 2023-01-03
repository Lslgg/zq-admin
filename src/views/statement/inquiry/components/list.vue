<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { PropType, reactive, ref } from 'vue'
import { InquryListOperationService, UseInquryListPagationService, IInquiryListWhere } from '../shared/useList.service'
import { CommonSearch } from '@/components/common'
import ListFilterItem from './listFilterItem.vue'
import { UseInquryService } from '../shared/useInquiry.service'
import { Utilts } from '@/util/utilts'
const props = defineProps({
  pageType: { type: String as PropType<NormalOrTrash>, required: true }
})
// 分页表格
const { paging, getPatationList, onSelectChange } = new UseInquryListPagationService(props.pageType).usePagin()
// 表格操作
const service = new InquryListOperationService(paging, getPatationList, props.pageType).useOperation()
// 是否显示过滤原因
const visible = ref(false)
// 过滤原因
const reasonStr = ref('')
// 询盘类型
const inqueryTypeList = UseInquryService.ins().getInquiryTypeList()
// 询盘来源
const inquerySourceList = UseInquryService.ins().getInquirySource()
// 询盘国家列表
const inqueryCountryList = await UseInquryService.ins().getCountry()

// 查询条件
const where: Partial<IInquiryListWhere> = reactive(paging.where || {})
// 手动设置为垃圾询盘
const onReason = (reason: string) => {
  reasonStr.value = reason || '手动设置为垃圾询盘'
  visible.value = true
}
// 查询条件改变事件
const onChangeStatus = (paramsName: keyof IInquiryListWhere) => {
  const value = Utilts.ins().getValueByObjName<Partial<IInquiryListWhere>>(where, paramsName)
  const params = { ...paging?.where || {}, current: 1 }
  const newInfo = Utilts.ins().setValueByObjName<Partial<IInquiryListWhere>>(where, paramsName, value)
  const paramWhere = { ...params, ...newInfo }
  getPatationList(paramWhere)
}
// 清空条件
const onClearWhere = (paramsName: keyof IInquiryListWhere) => {
  Utilts.ins().setValueByObjName<Partial<IInquiryListWhere>>(where, paramsName, undefined)
}
</script>

<template>
  <div class="w-full">
    <TemplateCard :soltTitle="true" :hideTopRound="true">
      <template #title>
        <div class="flex items-center">
          <div>
            <a-select v-model:value="service.filters.date" size="large" @change="service.onFilters">
              <a-select-option v-for="item in service.dateList" :key="item.value" :value="item.value">{{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <div class="px-2">
            <a-range-picker v-show="service.filters.date === 'auto'" v-model:value="service.filters.customerDate" />
          </div>
          <div>
            <CommonSearch tip="请输入" v-model:keyword="service.filters.searchKey" @on-search="service.onSearch">
            </CommonSearch>
          </div>
        </div>
      </template>
      <template #subtitle>
        <div class="px-2 flex justify-start space-x-4">
          <a-button v-if="pageType === 'trash'" @click="service.onDel(paging.selectedRowKeys)" size="small">删除
          </a-button>
          <a-button type="primary" @click="service.onSetInquiry(pageType === 'trash', paging.selectedRowKeys)"
            size="small">
            {{ pageType === 'trash' ? '还原询盘' : '设为垃圾询盘' }}
          </a-button>
        </div>
      </template>
      <div class="inquiry-table">
        <ListFilterItem v-model:pagingWhere="paging.where" :getList="getPatationList"
          :inqueryCountryList="inqueryCountryList" @onClearWhere="onClearWhere">
        </ListFilterItem>
        <a-table @change="getPatationList"
          :row-selection="{ selectedRowKeys: paging.selectedRowKeys, onChange: onSelectChange }"
          :dataSource="paging.dataSource" :columns="paging.columns" :pagination="paging.pagination"
          :loading="paging.loading" rowKey="id" tableLayout="fixed" :scroll="{ x: 1200 }">
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'is_read'">
              <MediaStatus :status="text == 1" />
            </template>
            <template v-if="column.key === 'inquiry_content'">
              <MediaText :text="text" :rows="3" />
            </template>
            <template v-if="column.key === 'customer_email'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'inquiry_url'">
              <a :href="text" target="__blank">
                <MediaText :text="text" :rows="2" />
              </a>
            </template>
            <template v-if="column.key === 'action'">
              <MediaLink class="mb-2" @click="$router.push({ name: 'inquiryDetail', params: { id: record.id } })">查看详情
              </MediaLink>
              <div v-if="pageType === 'trash'">
                <MediaLink class="mb-2 mr-2" @click="service.onSetInquiry(pageType === 'trash', [record.id])">恢复
                </MediaLink>
                <MediaLink @click="onReason(record.filter_reason_text)">过滤原因</MediaLink>
              </div>
            </template>
          </template>
          <template #customFilterDropdown="{ column }">
            <template v-if="column.key === 'is_read'">
              <div class="p-2 radio-group_item">
                <a-radio-group v-model:value="where.is_read" button-style="solid" @change="onChangeStatus('is_read')">
                  <a-radio-button :value="-1">全部</a-radio-button>
                  <a-radio-button :value="1">已读</a-radio-button>
                  <a-radio-button :value="0">未读</a-radio-button>
                </a-radio-group>
              </div>
            </template>
            <template v-if="column.key === 'inquiry_type_text'">
              <div class="p-2 radio-group_item">
                <a-radio-group v-model:value="where.inquiry_type" button-style="solid"
                  @change="onChangeStatus('inquiry_type')">
                  <a-radio-button :value="-1">全部</a-radio-button>
                  <a-radio-button v-for="item in inqueryTypeList" :key="item.key" :value="item.key">{{ item.value }}
                  </a-radio-button>
                </a-radio-group>
              </div>
            </template>
            <template v-if="column.key === 'inquiry_source_text'">
              <div class="p-2 radio-group_item">
                <a-radio-group v-model:value="where.inquiry_source" button-style="solid"
                  @change="onChangeStatus('inquiry_source')">
                  <a-radio-button :value="-1">全部</a-radio-button>
                  <a-radio-button v-for="item in inquerySourceList" :key="item.key" :value="item.key">{{ item.value }}
                  </a-radio-button>
                </a-radio-group>
              </div>
            </template>
            <template v-if="column.key === 'customer_country'">
              <div class="p-2 radio-group_item h-80 overflow-y-auto">
                <a-radio-group v-model:value="where.country_code" button-style="solid"
                  @change="onChangeStatus('country_code')">
                  <a-radio-button value="">全部</a-radio-button>
                  <a-radio-button v-for="item in inqueryCountryList" :key="item.key" :value="item.key">{{ item.value }}
                  </a-radio-button>
                </a-radio-group>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <a-modal v-model:visible="visible" title="过滤原因" :footer="null">
      <div>{{ reasonStr }}</div>
      <hr class="-mx-6 mt-5">
    </a-modal>
  </div>
</template>

<style lang='scss' scoped>
.radio-group_item {
  .ant-radio-group {
    display: flex;
    flex-direction: column;

    .ant-radio-button-wrapper {
      border: 0;
    }

    .ant-radio-button-wrapper:not(:first-child)::before {
      display: none;
    }

    .ant-radio-button-wrapper:first-child {
      border-radius: 0;
    }

    .ant-radio-button-wrapper:last-child {
      border-radius: 0;
    }

    .ant-radio-button-wrapper {
      line-height: 28px;
      height: 28px;
    }

    .ant-radio-button-wrapper:focus-within {
      box-shadow: none;
    }
  }

  :deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
    color: white !important;
  }
}
</style>
