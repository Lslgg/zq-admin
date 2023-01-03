
<script setup lang='ts'>
import { IInquiry } from '@/api/api.model'
import { API } from '@/api/apis'
import { TemplateCard } from '@/components/template'
import { GlobalStore } from '@/util/globalStore'
import { UseCommon } from '@/util/useCommon'

const res = await API.inquiry.getInquiryGet<IInquiry>({ id: UseCommon.ins().id })
const inquiry = res.data || {}
if (!inquiry.is_read) {
  const params: any = { site_id: UseCommon.ins().siteId, ids: [UseCommon.ins().id] }
  API.inquiry.postInquiryRead(params).then(res => {
    // 发送查看了详情的消息
    GlobalStore.ins().setInquiryMessage(true)
  })
}
// 产品，文章，视频显示页面信息
const isShowPage = inquiry.inquiry_type === 2 ||
  inquiry.inquiry_type === 3 ||
  inquiry.inquiry_type === 5
</script>

<template>
  <TemplateCard :soltTitle="true">
    <template #title>
      <span class="text-lg">询盘信息</span>
    </template>
    <template #subtitle>
      <a-button type="primary" @click="$router.go(-1)" size="small">返回</a-button>
    </template>
    <div class="inquiry-detail_card py-2 mt-3">
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>姓名:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.customer_name }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>邮箱:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.customer_email }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3" v-if="inquiry.telephone">
        <div :span="3" class="text-right w-36">
          <label>电话:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.telephone }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>询盘内容:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.inquiry_content }}</span>
        </div>
      </div>
    </div>
    <div class="py-2">
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>询盘国家:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.customer_country }}({{ inquiry.customer_ip }})</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>询盘来源:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.inquiry_source_text }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>询盘类型:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.inquiry_type_text }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>询盘URL:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.inquiry_url }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div :span="3" class="text-right w-36">
          <label>询盘时间:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.created_at }}</span>
        </div>
      </div>
      <div class="flex justify-start py-3">
        <div class="text-right w-36">
          <label>终端:</label>
        </div>
        <div class="flex-1 w-64 pl-4">
          <span>{{ inquiry.terminal_text }}</span>
        </div>
      </div>
    </div>
    <!-- 产品信息 隐藏 -->
    <div v-if="isShowPage" class="p-3">
      <div class="text-lg font-bold pb-3">页面信息</div>
      <div class="border rounded p-5">
        <div class="flex justify-start  space-x-4">
          <div>
            <MediaImage class="h-24" v-if="inquiry.page_img && inquiry.page_img.url" :src="inquiry.page_img.url" />
          </div>
          <div>
            <a :href="`//${inquiry.page_path}`" target="_blank">
              {{ inquiry.page_title }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </TemplateCard>
</template>

<style lang='scss' scoped>
.inquiry-detail_card {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, .1);
  background-color: rgba(56, 125, 255, 0.03);
  border-radius: 8px;
}
</style>
