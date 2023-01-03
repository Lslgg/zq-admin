
<script setup lang='ts'>
import { CommonModal } from '../../common'
import { PropType, ref } from 'vue'
import MaterialManager from '../materialManager.vue'
import { IAttachment, MaterFileType } from '@/api/api.model'
import { Utilts } from '@/util/utilts'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  visible: Boolean,
  // 选择素材类型
  selectType: { type: Number as PropType<MaterFileType>, default: MaterFileType.ALL },
  /** 素材大小单位mb */
  maxSize: { type: Number, default: 0 },
})
const spinning = ref(true)
const selectData = ref<IAttachment[]>([])
const emit = defineEmits(['update:visible', 'onSelectMaterial'])
const myVisible = useVModel(props, 'visible', emit)
const submit = () => {
  for (let i = 0; i < selectData.value.length; i++) {
    const p = selectData.value[i]
    // 如果maxSize大于0则进行大小校验
    if (props.maxSize > 0 && (p.file_size || 0) > (props.maxSize * 1024 * 1024)) {
      Utilts.ins().message('文件大小不能超过' + props.maxSize + 'Mb', 'error')
      // delete current item
      selectData.value.splice(i, 1)
    }
  }
  emit('onSelectMaterial', selectData.value)
}
</script>

<template>
  <div class="w-full overflow-hidden">
    <CommonModal :zIndex="1300" class-name="!top-[40px] !w-[80%] !max-w-[80%]  material-modal overflow-hidden" v-model:visible="myVisible"
      title="选择素材" @ok="submit">
      <a-spin :spinning="spinning" wrapperClassName="overflow-hidden !min-h-[760px]">
        <MaterialManager v-model:parentSinning="spinning" v-model:selectData="selectData" :select-type="selectType"
          opation-type="select"></MaterialManager>
      </a-spin>
    </CommonModal>
  </div>
</template>

<style lang='scss'>
.material-modal {
  .ant-modal-body {
    padding: 0;
    max-height: calc(100vh - 200px);
    overflow: hidden;
  }
}
.ant-image-preview-mask {
  z-index: 1300;
}
.ant-image-preview-wrap {
  z-index: 1300;
}
</style>
