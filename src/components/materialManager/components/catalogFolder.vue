
<script setup lang='ts'>
import { IAttachment, IAttachmentGroup } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { FolderFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { PropType } from 'vue'
defineProps({
  attachment: {
    type: Object as PropType<IAttachmentGroup>,
    default: () => { }
  }
})
const emit = defineEmits(['onUpdate', 'delFolder', 'loadImg'])
const loadImg = (id: number) => emit('loadImg', id)
const updateFolder = (folderName: string, id: number) => emit('onUpdate', folderName, id, 1)
const delFolder = (id: number) => {
  Utilts.ins().confirm({
    content: '是否要删除？',
    okCallBack: async () => {
      const res = await API.attachment.getAttachmentList<
        ResPagingData<IAttachment>
      >({
        site_id: UseCommon.ins().siteId,
        group_id: id,
        current_page: 1,
        per_page: 5000,
      })
      if (res.data.data.length > 0) {
        Utilts.ins().message('为确保您的素材文件不被误删除，含有文件的文件夹不可删除', 'warn')
        return
      }
      API.attachment.postAttachmentGroupDelete({ site_id: UseCommon.ins().siteId, ids: [id] })
        .then((res) => {
          emit('delFolder', id)
        }).catch(() => {
          Utilts.ins().message('删除失败!', 'error')
        })
    }
  })
}
</script>

<template>
  <div class="flex flex-col items-center cursor-pointer">
    <div class="relative group">
      <folder-filled class="text-orange-300 text-9xl leading-none" @click="loadImg(attachment.id)" />
      <div class="absolute h-7 w-[90%] bottom-[12px] left-[5px] hidden group-hover:block">
        <div class="flex bg-gray-900 bg-opacity-50 justify-center space-x-4">
          <edit-outlined @click="updateFolder(attachment.group_name, attachment.id)"
            class="text-xl text-white cursor-pointer hover:!text-blue-400" />
          <delete-outlined @click="delFolder(attachment.id)"
            class="text-xl text-white cursor-pointer hover:!text-blue-400" />
        </div>
      </div>
    </div>
    <MediaText class="w-full text-center" :text="attachment.group_name" :rows="1" @click="loadImg(attachment.id)" />
  </div>
</template>

<style lang='scss' scoped>
</style>
