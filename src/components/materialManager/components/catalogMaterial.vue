
<script setup lang='ts'>
import { IAttachment } from '@/api/api.model'
import {
  EditOutlined, FolderViewOutlined, LinkOutlined,
  DeleteOutlined, ContainerOutlined, PlayCircleFilled,
  VideoCameraOutlined
} from '@ant-design/icons-vue'
import { useVModel } from '@vueuse/core'
import { PropType } from 'vue'
import { MaterialService } from '../shared/material.service'
const emit = defineEmits(['onUpdate', 'onDetail', 'update:attachment', 'onSelect', 'onDel', 'onShowVideo'])
const props = defineProps({
  opationType: { type: String as PropType<MaterialType>, defalut: 'add' },
  attachment: { type: Object as PropType<IAttachment>, default: () => { } }
})
const myAttachment = useVModel(props, 'attachment', emit)
const {
  visible,
  setVisible, onDel,
  editImg, copyBallck, onDetail,
  onSelect, onPlay, onImgSelect
} = new MaterialService().useMaterial(emit)
const onSelectItem = (myAttachment: IAttachment) => {
  // 选择素材操作
  if (props.opationType === 'select') {
    onImgSelect(myAttachment)
  } else {
    // 素材库管理操作，点击素材时视频播放
    if (myAttachment.file_type === 3) {
      onPlay(myAttachment)
      // 素材库管理操作，点击素材时图片预览
    } else if (myAttachment.file_type === 2) {
      setVisible(true)
    }
  }
}
</script>

<template>
  <div>
    <div class="relative group text-center bg-gray-50 rounded-sm h-full">
      <template v-if="myAttachment.file_type === 2">
        <MediaImage :src="myAttachment.url" :preview="{ visible, onVisibleChange: setVisible }"
          class="w-full max-h-full rounded-sm" />
      </template>
      <template v-if="myAttachment.file_type === 3">
        <MediaImage :src="myAttachment.url + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast'"
          :preview="false" class="w-full max-h-full rounded-sm" />
      </template>
      <div @click="onSelectItem(myAttachment)" class="absolute w-full h-full top-0">
        <div class="w-full flex justify-center items-center">
          <play-circle-filled v-if="myAttachment.file_type === 3" @click.stop="onPlay(myAttachment)"
            class="absolute text-white text-3xl leading-none top-[30%]" />
        </div>
      </div>
      <MediaText class="w-full text-center" :text="myAttachment.file_name" :rows="1" />
      <div class="h-6 absolute w-full bottom-0 bg-gray-900 bg-opacity-70 group-hover:block"
        :class="{ 'hidden': !myAttachment.isSelected }">
        <div class="flex justify-between px-1 items-center">
          <a-checkbox v-model:value="myAttachment.id" v-model:checked="myAttachment.isSelected"
            @change.stop="onSelect(myAttachment)"></a-checkbox>
          <edit-outlined @click="editImg(myAttachment.file_name ?? '', myAttachment.id)" class="icon_color" />
          <folder-view-outlined v-if="myAttachment.file_type === 2" @click="() => setVisible(true)"
            class="icon_color" />
          <video-camera-outlined v-if="myAttachment.file_type === 3" @click="() => onPlay(myAttachment)"
            class="icon_color" />
          <link-outlined @click="copyBallck(myAttachment.url)" class="icon_color" />
          <delete-outlined @click="onDel(myAttachment.id)" class="icon_color" />
          <container-outlined @click="onDetail(myAttachment.id)" class="icon_color" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-image) {
  height: 7rem !important;

  .ant-image-img {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

<style lang="scss">
.icon_color {
  color: #fff;
  cursor: pointer;
}

.icon_color:hover {
  color: rgb(96 165 250 / 1);
}
</style>
