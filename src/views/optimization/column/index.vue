<script setup lang='ts'>
import {
  UseColumnService,
  ColumnListOperationService,
  UseColumnListPagationService
} from './shared/useColumn.service'
import { TemplateCard } from '@/components/template'
import SeoModal from '../components/seoModal.vue'
import { CommonModal, CommonTab } from '@/components/common'

const { columnList } = await new UseColumnService().useService()
const tabList = columnList.map(p => ({ title: p.title, value: p.id }))
const { paging, getPatationList, onSelectChange } = new UseColumnListPagationService({ pageIndex: 1, pageSize: 10, columnList }).usePagin()
const service = await new ColumnListOperationService(paging, getPatationList).useOperation()
const { currentMenu, visible, tipsVisible, seoId } = service
currentMenu.value = columnList?.[0].id ?? 0
</script>

<template>
  <div class="w-full">
    <CommonTab :tabList="tabList" v-model:activeTab="currentMenu" @onChange="service.onChangeTab"></CommonTab>
    <TemplateCard :hideTopRound="true">
      <div class="py-2">
        <a type="link" class="text-green-500" @click="tipsVisible = true">点击了解SEO与TDK</a>
      </div>
      <div class="py-2">
        <a-table
          :row-selection="{ selectedRowKeys: paging.selectedRowKeys, onChange: onSelectChange }"
          :dataSource="paging.dataSource"
          :columns="paging.columns"
          :pagination="false"
          :loading="paging.loading"
          @change="getPatationList"
          tableLayout="fixed"
          :defaultExpandAllRows="true"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'title'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'seo_title'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'seo_description'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'path'">
              <MediaText :text="text" :rows="2" />
            </template>
            <template v-if="column.key === 'action'">
              <MediaLink class="mb-2 mr-2" @click="service.onEdit(record)">编辑</MediaLink>
              <MediaLink @click="service.onBuild(record)">自动生成TDK</MediaLink>
            </template>
          </template>
        </a-table>
        <div class="text-gray-500 pt-5" v-if="currentMenu === columnList?.[0].id">
          提示：首页的SEO标题即网站将会在搜索引擎搜索结果和浏览器标签显示的标题名称，
          <span class="font-bold">非常重要</span>
          <a-popover title="网站ICON示例图" placement="bottom">
            <template #content>
              <div class="text-center">
                <MediaImage src="/images/myImg/seo_show.png" />
              </div>
            </template>
            <a href="javascript:;" class="text-green-500 px-2">查看示例</a>
          </a-popover>
        </div>
      </div>
    </TemplateCard>
    <SeoModal v-if="visible" v-model:visible="visible" :id="seoId" :type="1" @onOk="getPatationList"></SeoModal>
    <CommonModal v-model:visible="tipsVisible" title="了解SEO与TDK" class-name="!max-w-[960px]" :footer="true">
      <div>
        <p class="font-bold">什么是SEO？</p>
        <p class="text-sm pt-2 pb-4 text-gray-500">SEO是英文 Search Engine Optimization 的缩写，即“搜索引擎优化”。SEO是指在了解搜索引擎自然排名机制的基础上，对网站进行内部及外部的调整优化，提高网站关键词搜索排名获取更多展示，然后从自然搜索结果获得更多网站流量的过程。</p>
        <p class="font-bold">什么是TDK？</p>
        <p class="text-sm pt-2 pb-4 text-gray-500">TDK是网站的标题（Title）、描述（Description）和关键词（Keyword）的英文首字母，是网站优化中最重要的元素之一，搜索引擎蜘蛛爬取你的网站之后最先看到的东西就是TDK了，所以，怎么设置TDK对网站的优化起到的作用是非常重要的。</p>
        <p class="font-bold">标题如何设置比较好？</p>
        <p
          class="text-sm pt-2 pb-4 text-gray-500"
        >Title是网站最重要的元素！对标题怎么写做最深思熟虑的考虑，而且title写好之后，就不建议经常更改了。标题需要简洁但需要突出这个页面需要描述的最重要的信息，是对整个网页的最精华的概括，没有意义的词语最好就不需要写，避免搜索引擎的内容识别干扰。标题的长度虽然可以识别在70个字符以内，但是建议不要超过40个字符，避免显示不完全。</p>
        <p class="font-bold">描述如何设置比较好？</p>
        <p class="text-sm pt-2 pb-4 text-gray-500">Description是网页seo中第二重要的元素了，它是对title的一个补充，用一段话描述页面的内容，要涵盖页面的主要内容和特色，并且要包含页面主要关键词，description可以输入在200个字符的限制内，我们建议在120字符内最优。</p>
        <p class="font-bold">关键词如何设置比较好？</p>
        <p class="text-sm pt-2 pb-4 text-gray-500">keywords(关键词) 主要告知搜索引擎页面内容与哪些关键词相关，建议填写1-3个关键词，keywords可以输入在150个字符的限制内.</p>
      </div>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
