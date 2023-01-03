
<script setup lang='ts'>
import { IAttachment, IAttachmentGroup } from '@/api/api.model'
import { Utilts } from '@/util/utilts'
import { PropType, ref } from 'vue'
import { CommonModal } from '@/components/common'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { useVModel } from '@vueuse/core'
const emit = defineEmits([
  'update:attachmentList', 'update:selectTotal',
  'onSelect', 'onDel', 'onMove', 'update:spinning'])
const props = defineProps({
  spinning: Boolean,
  attachmentGroupList: { type: Array as PropType<IAttachmentGroup[]>, default: () => { } },
  attachmentList: { type: Array as PropType<IAttachment[]>, default: () => { } },
  selectTotal: { type: Number, default: 0 },
})
const myAttachmentList = useVModel(props, 'attachmentList', emit)
const mySelectTotal = useVModel(props, 'selectTotal', emit)
const mySpinning = useVModel(props, 'spinning', emit)
const checked = ref<boolean>(false)
const total = myAttachmentList.value.length
const visible = ref<boolean>(false)
const groupId = ref<number>()
const checkAll = (checked = false) => {
  myAttachmentList.value.forEach((item) => item.isSelected = checked)
  mySelectTotal.value = myAttachmentList.value.filter((p) => p.isSelected)?.length ?? 0
  emit('onSelect')
}
const onDel = () => {
  const ids = myAttachmentList.value.filter((p) => p.isSelected)?.map((p) => p.id) ?? []
  Utilts.ins().confirm({
    content: '是否要删除？',
    okCallBack: () => emit('onDel', ids)
  })
}
const onMove = () => visible.value = true
const submit = () => {
  mySpinning.value = true
  const ids = myAttachmentList.value.filter((p) => p.isSelected)?.map((p) => p.id) ?? []
  API.attachment.postAttachmentMove({
    site_id: UseCommon.ins().siteId,
    ids: ids, group_id: groupId.value
  })
    .then((res) => {
      mySpinning.value = false
      emit('onMove', groupId.value, ids)
    }).catch(err => mySpinning.value = false)
  visible.value = false
}
</script>

<template>
  <div>
    <div class="flex justify-start items-center space-x-5 h-10">
      <a-checkbox v-model:checked="checked" @change="checkAll(checked)">全选({{ mySelectTotal }}/{{ total }})</a-checkbox>
      <a-button size="small" @click="onMove">移动</a-button>
      <a-button size="small" @click="onDel">删除</a-button>
      <a-button size="small" @click="checkAll(false)">取消</a-button>
    </div>
    <CommonModal title="文件移动" v-model:visible="visible" :is-auto-close="false" @ok="submit">
      <a-select ref="select" v-model:value="groupId" class="w-full">
        <a-select-option :value="0">根目录</a-select-option>
        <a-select-option v-for="item in attachmentGroupList" :key="item.id" :value="item.id">{{ item.group_name }}</a-select-option>
      </a-select>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
