
<script setup lang='ts'>
import { PropType } from 'vue'
import { CommonModal } from '@/components/common'
import { IAttachment } from '@/api/api.model'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  visible: { type: Boolean, default: false },
  detail: { type: Object as PropType<Partial<IAttachment>>, default: () => { } }
})
const emit = defineEmits(['update:visible'])
const myVisible = useVModel(props, 'visible', emit)
</script>

<template>
  <CommonModal :zIndex="1301" class-name="!w-[680px]" title="属性" v-model:visible="myVisible" okText="关闭">
    <div class="container">
      <div class="flex leading-8">
        <div class="w-24">名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</div>
        <div class="flex-1 w-64">{{ detail.file_name }}.{{ detail.file_ext }}</div>
      </div>
      <div class="flex leading-8">
        <div class="w-24">大&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小:</div>
        <div class="flex-1 w-64">{{ detail.file_size_human }}</div>
      </div>
      <div class="flex leading-8">
        <div class="w-24">上传时间:</div>
        <div class="flex-1 w-64">{{ detail.created_at }}</div>
      </div>
      <div class="flex leading-8">
        <div class="w-24">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址:</div>
        <div class="flex-1 w-64">
          <MediaText :rows="3" :text="detail.url"></MediaText>
        </div>
      </div>
    </div>
  </CommonModal>
</template>

<style lang='scss' scoped>
</style>
