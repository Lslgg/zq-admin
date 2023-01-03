<script setup lang="ts">
import { TemplateCard } from '@/components/template'
import { PropType, ref } from 'vue'
import { FormOutlined } from '@ant-design/icons-vue'
import { UseCommon } from '@/util/useCommon'
import { API } from '@/api/apis'
import { ISiteInfo } from '@/api/api.model'
import CommonModal from '@/components/common/commonModal.vue'
import { Utilts } from '@/util/utilts'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  site: { type: Object as PropType<ISiteInfo>, default: () => { } },
})
const emit = defineEmits(['update:site'])
const mySite = useVModel(props, 'site', emit)
const visible = ref(false)
const onEditSiteName = () => visible.value = true
const onSubmit = () => {
  const params = { site_id: UseCommon.ins().siteId, site_name: mySite.value.site_name }
  API.site.postSiteUpdate(params).then(res => {
    if (res.data) Utilts.ins().message('修改成功!')
  })
}
</script>

<template>
  <div class="w-full">
    <TemplateCard class="dashboard_track">
      <div class="flex flex-row space-x-4 pb-2 pt-4">
        <div class>
          <MediaImage class="h-40 shadow-md max-w-2xl" :src="site.banner?.url" />
        </div>
        <div class="flex-auto flex flex-row justify-between flex-wrap items-center">
          <a-space direction="vertical">
            <a-space class="flex flex-wrap justify-start items-center">
              <span>网站名称:</span>
              <span class="font-bold">{{ site.site_name }}</span>
              <form-outlined class="cursor-pointer leading-none" @click="onEditSiteName" />
            </a-space>
            <a-space class="flex flex-wrap">
              <span>我的网址:</span>
              <a class="block text-black underline" :href="'//' + site.site_host" target="_blank">
                {{
                    site.site_host
                }}
              </a>
            </a-space>
            <a-space class="flex flex-wrap">
              <span>内部网址:</span>
              <a class="block text-black underline" :href="'//' + site.private_host" target="_blank">
                {{
                    site.private_host
                }}
              </a>
            </a-space>
            <a-space class="text-gray-8c8c8c">
              <span>上线时间:</span>
              <span>{{ site.online_time }}</span>
            </a-space>
            <a-space class="flex flex-wrap">
              <span class="text-gray-8c8c8c">到期时间:</span>
              <span class="text-gray-8c8c8c">{{ site.expire_time }}</span>
              <!-- <a class="block" href="#">续费</a> -->
            </a-space>
          </a-space>
          <div>
            <a-button type="primary" size="small" hidden>网站装修</a-button>
          </div>
        </div>
      </div>
    </TemplateCard>
    <CommonModal title="编辑网站名称" v-model:visible="visible" @ok="onSubmit">
      <a-input v-model:value="mySite.site_name" :maxlength="100" placeholder="请输入网站名称" :showCount="true"></a-input>
    </CommonModal>
  </div>
</template>

<style lang="scss" scoped>
.shadow-auto {
  box-shadow: 0px 20px 27px rgb(0 0 0 / 5%);
}
</style>
