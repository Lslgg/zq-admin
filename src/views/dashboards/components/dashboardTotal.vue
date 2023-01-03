<script setup lang="ts">
import { UseCommon } from '@/util/useCommon'
import { MyIcon } from '@/components/myIcon'
import { API } from '@/api/apis'
import { ISiteTotal } from '@/api/api.model'
const use = UseCommon.ins()
const itemList = [
  { key: 'inquiry_total_num', name: '询盘总数', num: 0, icon: 'icon-sysj2', goPage: () => use.goUrlName('inquiryList') },
  { key: 'inquiry_this_month_num', name: '本月询盘', num: 0, icon: 'icon-sysj1', goPage: () => use.goUrlName('inquiryList') },
  { key: 'product_total_num', name: '产品总数', num: 0, icon: 'icon-sysj5', goPage: () => use.goUrlName('product') },
  { key: 'article_total_num', name: '文章总数', num: 0, icon: 'icon-sysj4', goPage: () => use.goUrlName('article') },
  { key: 'video_total_num', name: '视频总数', num: 0, icon: 'icon-sysj3', goPage: () => use.goUrlName('video') },
]
const resItem = await API.data.getDataSiteoverview<ISiteTotal[]>({})
const siteItem: any = resItem.data[0] || {
  article_total_num: 0,
  inquiry_this_month_num: 0,
  inquiry_total_num: 0,
  product_total_num: 0,
  video_total_num: 0,
}
itemList.forEach((p) => (p.num = siteItem?.[p.key] || 0))
</script>

<template>
  <div class="w-full">
    <div class="p-4 text-[16px] pt-0 font-bold">网站概况</div>
    <div class="flex justify-flex items-center flex-wrap space-x-4">
      <template v-for="(item, index) in itemList" :key="index">
        <div
          class="flex-1 flex flex-col items-center justify-center shadow-auto bg-white p-5 rounded-lg space-y-3 group">
          <span @click="item.goPage"
            class="bg-primary w-10 h-10 flex items-center justify-center rounded-xl shadow-xl leading-none opacity-50 cursor-pointer"
            :class="{ '!opacity-100': item.num > 0 }">
            <MyIcon class="text-white text-xl leading-none" :name="item.icon"></MyIcon>
          </span>
          <span @click="item.goPage"
            class="text-center group-hover:text-primary text-gray-500 text-sm cursor-pointer">{{ item.name }}</span>
          <span @click="item.goPage" class="text-center font-bold text-xl cursor-pointer hover:text-primary">{{ item.num
          }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shadow-auto {
  box-shadow: 0px 20px 27px rgb(0 0 0 / 5%);
}
</style>
