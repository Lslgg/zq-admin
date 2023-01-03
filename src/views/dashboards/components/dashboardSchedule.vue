<script setup lang="ts">
import { PropType } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { ISiteInfo } from '@/api/api.model'
import { TemplateCard } from '@/components/template'
import { UseCommon } from '@/util/useCommon'
const props = defineProps({
  site: { type: Object as PropType<ISiteInfo>, default: () => { } },
})
const list = [
  { key: 'base_info', index: 1, name: '完善基础信息', title: '去完善', status: false },
  { key: 'design', index: 2, name: '网站装修', title: '', status: false },
  { key: 'product', index: 3, name: '发布产品', title: '去发布', status: false },
  { key: 'article', index: 4, name: '发布文章', title: '去发布', status: false },
  { key: 'seo', index: 5, name: '站内优化', title: '去优化', status: false },
  { key: 'online', index: 6, name: '网站上线', title: '', status: false },
]
list.forEach((p) => (p.status = !!props.site.site_status?.[p.key]))
const onGoPage = (key: string) => {
  if (key === 'base_info') UseCommon.ins().goUrlName('webSiteBase')
  else if (key === 'product') UseCommon.ins().goUrlName('addProduct')
  else if (key === 'article') UseCommon.ins().goUrlName('addArticle')
  else if (key === 'seo') UseCommon.ins().goUrlName('column')
}
</script>

<template>
  <TemplateCard title="网站进度" class="h-full">
    <div class="flex justify-between items-center space-x-4 py-4 min-w-[860px]">
      <div v-for="item in list" :key="item.index" class="flex-1 relative">
        <div class="bg-[#FAFAFA] flex-1 border rounded-lg hover:bg-[#EAF1F9] group h-28 pl-10">
          <div class="text-xl pt-4 pb-1">{{ item.index }}</div>
          <div class="text-[16px]  font-bold pb-1 group-hover:text-primary">{{ item.name }}</div>
          <div>
            <a @click="onGoPage(item.key)"
              class="text-primary hidden group-hover:inline-block group-hover:underline text-sm">
              {{ item.title }}
            </a>
          </div>
        </div>
        <div :class="{ '!bg-[#33963D]': item.status }"
          class="absolute w-7 h-7 border border-[#EAF1F9] top-0 left-0 rounded-tl-lg rounded-br-lg bg-gray-200 flex items-center justify-center text-sm text-white">
          <check-outlined />
        </div>
      </div>
    </div>
  </TemplateCard>
</template>

<style lang="scss" scoped>
</style>
