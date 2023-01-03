
<script setup lang='ts'>
import { PropType, ref, watch, } from 'vue'
import { CommonModal } from '@/components/common'
import { IFormState, MaterialUpdateService } from '../shared/materialUpdate.service'
const emit = defineEmits(['update:visible', 'update:formState', 'onUpdateMaterial'])
const props = defineProps({
  visible: { type: Boolean, default: false },
  formState: { type: Object as PropType<IFormState>, default: () => { } }
})
const {
  myVisible, myFormState, submit
} = new MaterialUpdateService(props, emit).useService()
const title = ref('文件')
watch(props.formState, (data) => {
  if (data.type === 2) title.value = '文件'
  else title.value = '文件夹'
})
</script>

<template>
  <CommonModal :zIndex="1301" class-name="!min-w-[580px]" :title="`修改${title}`" v-model:visible="myVisible"
    :is-auto-close="false" @ok="submit">
    <a-form ref="formUpdateRef" :model="myFormState" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
      autocomplete="off">
      <a-form-item :label="`${title}名称`" name="name" :rules="[{ required: true, message: `请输入${title}名!` }]">
        <a-input v-model:value="myFormState.name" />
      </a-form-item>
    </a-form>
  </CommonModal>
</template>

