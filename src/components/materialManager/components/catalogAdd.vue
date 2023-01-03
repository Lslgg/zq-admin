
<script setup lang='ts'>
import { IAttachmentGroup } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { PlusOutlined } from '@ant-design/icons-vue'
import { FormInstance } from 'ant-design-vue'
import { PropType, reactive, ref } from 'vue'
import CommonModal from '../../common/commonModal.vue'

const props = defineProps({
  attachmentGroupList: {
    type: Array as PropType<IAttachmentGroup[]>,
    default: () => { }
  }
})
const emit = defineEmits(['addCatalog'])
const formRef = ref<FormInstance>()
const formState = reactive<any>({ group_name: '' })
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
// 显示添加弹出框
const addFolder = () => visible.value = true
/** 提交添加文件 */
const onSubmit = async () => {
  try {
    confirmLoading.value = true
    const values = await formRef.value?.validateFields()
    const isSame = props.attachmentGroupList.find(p => p.group_name === values?.['group_name'])
    if (isSame) {
      confirmLoading.value = true
      Utilts.ins().message('文件夹名称已存在，请重新命名', 'warn')
      return
    }
    API.attachment.postAttachmentGroupAdd({ site_id: UseCommon.ins().siteId, ...values, pid: 0 })
      .then((res) => {
        confirmLoading.value = false
        if (res.data) {
          visible.value = false
          formRef.value?.resetFields()
          Utilts.ins().message('添加成功!')
          emit('addCatalog', res.data)
        }
      }).catch(() => Utilts.ins().message('添加失败', 'error'))
  } catch (errorInfo) {
    confirmLoading.value = false
    Utilts.ins().message('添加失败!', 'error')
  }
}
</script>

<template>
  <div class="max-full">
    <div @click="addFolder" class="flex justify-center items-center h-32 border rounded-md flex-col cursor-pointer hover:text-blue-500">
      <plus-outlined class="text-xl" />
      <span>新建文件夹</span>
    </div>
    <CommonModal :zIndex="1031" class-name="!min-w-[580px]" title="新建文件" v-model:visible="visible" :is-auto-close="false" v-model:confirmLoading="confirmLoading" @ok="onSubmit">
      <a-form ref="formRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" autocomplete="off">
        <a-form-item label="文件夹名称" name="group_name" :rules="[{ required: true, message: '请输入文件名' }]">
          <a-input v-model:value="formState.group_name" />
        </a-form-item>
      </a-form>
    </CommonModal>
  </div>
</template>
