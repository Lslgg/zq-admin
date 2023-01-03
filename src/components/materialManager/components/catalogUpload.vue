<script setup lang="ts">
import { PropType, ref } from 'vue'
import { CommonSearch } from '@/components/common'
import { customUpload, ICustomRequest } from '@/util/customUpload'
import { LeftOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { MaterFileType } from '@/api/api.model'
import { Utilts } from '@/util/utilts'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  isRoot: Boolean,
  spinning: Boolean,
  groupId: Number,
  selectType: {
    type: Number as PropType<MaterFileType>,
    default: MaterFileType.ALL,
  },
})
const emit = defineEmits(['onBack', 'onUpload', 'onSearch', 'update:groupId', 'update:spinning'])
const mySpinning = useVModel(props, 'spinning', emit)
const myGroupId = useVModel(props, 'groupId', emit)
const materialType = ref<number>()
const keyword = ref<string>('')
const upload = (info: ICustomRequest) => {
  const { file } = info
  if (!Utilts.ins().checkFile(file)) return
  mySpinning.value = true
  customUpload(info, myGroupId.value).then((res) => {
    emit('onUpload', res.data)
  }).catch(res => {
    mySpinning.value = false
    Utilts.ins().message(res.message, 'error')
  })
}
const onBack = () => emit('onBack')
const onSearch = (key: string) => emit('onSearch', keyword.value, materialType.value)
const onSearchType = () => emit('onSearch', keyword.value, materialType.value)
</script>

<template>
  <div class>
    <div class="flex justify-between">
      <div class="flex justify-start items-center space-x-4">
        <a-button v-if="!isRoot" class="flex items-center leading-none" @click="onBack">
          <template #icon>
            <left-outlined class="leading-none" />
          </template>
          返回
        </a-button>
        <CommonSearch v-model:keyword="keyword" tip="输入关健词查找" @onSearch="onSearch"></CommonSearch>
        <a-select v-if="selectType === MaterFileType.ALL" size="large" ref="select" placeholder="全部"
          v-model:value="materialType" @change="onSearchType" style="width: 120px">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option :value="2">图片</a-select-option>
          <a-select-option :value="3">视频</a-select-option>
        </a-select>
      </div>
      <a-upload name="file" :showUploadList="false" :customRequest="upload" :multiple="true">
        <a-button type="primary" class="flex items-center leading-none">
          <upload-outlined></upload-outlined>
          <span>本地上传</span>
        </a-button>
      </a-upload>
    </div>
  </div>
</template>
