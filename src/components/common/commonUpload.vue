<script setup lang='ts'>
import { IAttachment, MaterFileType } from '@/api/api.model'
import { PlusOutlined, CloseOutlined, PlayCircleFilled } from '@ant-design/icons-vue'
import { computed, PropType, ref } from 'vue'
import draggable from 'vuedraggable'
import SelectMaterial from '../materialManager/selectMaterial/selectMaterial.vue'
import { CommonVideoPlay } from '@/components/common'
import { Utilts } from '@/util/utilts'
/** 属性 */
const props = defineProps({
  fileList: { type: [Array, Object] as PropType<IAttachment | IAttachment[]>, default: () => [] },
  tip: { type: String, default: '' },
  content: { type: String, default: '上传图片' },
  maxNum: { type: Number, default: 1 },
  // 选择素材类型
  selectType: { type: Number as PropType<MaterFileType>, default: MaterFileType.ALL },
  /** 素材大小单位mb */
  maxSize: { type: Number, default: 0 },
})
const emit = defineEmits(['update:fileList'])
const myFileList = computed<IAttachment[]>({
  get() {
    if (Array.isArray(props.fileList)) {
      return props.fileList
    } else {
      // 如果传过来的有数据但没有地址默认返回空
      if (!props.fileList.url) return []
      return [props.fileList as IAttachment]
    }
  },
  set(list: IAttachment[]) {
    emit('update:fileList', list)
  }
})
myFileList.value = myFileList.value.filter(p => p.url)
const visible = ref(false)
const videoVisible = ref(false)
const videSrc = ref('')

const onShowMaterial = () => visible.value = true
const onSelectMaterial = (list: IAttachment[]) => {
  let allNum = list.length
  if (myFileList.value.length === 0) {
    myFileList.value.push(...list)
  } else {
    myFileList.value.push(...list)
    allNum = myFileList.value.length
  }
  if (allNum > props.maxNum) {
    let newList: IAttachment[] = []
    if (props.maxNum === 1) newList = [list[0]]
    else newList = myFileList.value.filter((item, index) => index < props.maxNum)
    myFileList.value = newList
    Utilts.ins().message('最多只能上传' + props.maxNum + '张图片')
  }
}
const onPlay = (item: IAttachment) => {
  videoVisible.value = true
  videSrc.value = item.url
}
const onDel = (id: number) => {
  myFileList.value = myFileList.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="w-full bg-[#FAFAFA] p-3">
    <div class="flex w-full">
      <draggable class="flex space-x-2 pr-2" v-if="myFileList.length > 0" v-model="myFileList" item-key="id">
        <template #item="{ element, index }">
          <div
            class="relative group w-28 h-28 flex items-center bg-white overflow-hidden border border-dotted rounded-sm cursor-move">
            <MediaImage v-if="element.file_type === 3 && element.url"
              :src="element.url + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast'" class="w-full" />
            <MediaImage v-else-if="element.file_type === 2 && element.url" :key="index" :src="element.url"
              class="w-full" />
            <div v-if="element.file_type === 3" class="w-full absolute h-full" @click.stop="onPlay(element)">
              <play-circle-filled class="absolute text-white text-3xl leading-none left-[35%] top-[35%]" />
            </div>
            <span class="absolute top-0 right-0 cursor-pointer hidden group-hover:block">
              <div class="w-7 h-7 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <CloseOutlined @click="onDel(element.id)" class="text-white leading-none"></CloseOutlined>
              </div>
            </span>
          </div>
        </template>
      </draggable>
      <div v-if="myFileList.length < maxNum"
        class="flex flex-col flex-shrink-0 justify-center items-center w-28 h-28 border border-dotted rounded-sm cursor-pointer"
        @click="onShowMaterial">
        <plus-outlined class="text-3xl text-gray-400"></plus-outlined>
        <div class="ant-upload-text pt-2 text-gray-400">{{ content }}</div>
      </div>
      <div v-if="myFileList.length <= 0" class="flex-auto text-xs">
        <div v-if="tip" class="p-2 text-gray-400">{{ tip }}</div>
        <template v-else>
          <slot name="tip"></slot>
        </template>
      </div>
    </div>
    <SelectMaterial v-if="visible" v-model:visible="visible" @onSelectMaterial="onSelectMaterial"
      :select-type="selectType" :maxSize="maxSize"></SelectMaterial>
    <CommonVideoPlay v-model:visible="videoVisible" :src="videSrc"></CommonVideoPlay>
  </div>
</template>

