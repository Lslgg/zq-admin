
<script setup lang="ts">
import { useVModel } from '@vueuse/core'
/** 属性 */
const props = defineProps({
  /** 关闭弹窗 */
  visible: { type: Boolean, default: false, },
  /** 标题 */
  title: { type: String, default: '', },
  /** 自定义脚部 */
  footer: { type: [Boolean, Object], default: false, },
  /** 确认按钮文本 */
  okText: { type: String, default: '确认', },
  /** 取消按钮文本 */
  cancelText: { type: String, default: '取消', },
  /** 对话框外层类名 */
  wrapClassName: { type: String, default: '', },
  /** 内容类名 */
  className: { type: String, default: '', },
  /** 是否自动关闭 */
  isAutoClose: { type: Boolean, default: true, },
  /** 是否禁用确认 */
  disableOk: { type: Boolean, default: false, },
  /** 是否禁用取消 */
  disableCancel: { type: Boolean, default: false, },
  /** 是否禁用取消 */
  confirmLoading: { type: Boolean, default: false, },
  zIndex: { type: Number, default: 1000, },
})
const emit = defineEmits(['update:visible', 'ok', 'cancel'])
const myVisible = useVModel(props, 'visible', emit)
const handleOk = () => {
  emit('ok')
  if (props.isAutoClose) {
    emit('update:visible', false)
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>
<template>
  <div class="common_modal">
    <a-modal @ok="handleOk" @cancel="handleCancel" v-model:visible="myVisible" :wrapClassName="wrapClassName"
      :ok-text="okText" :cancel-text="cancelText" :class="className" :zIndex="zIndex" :confirm-loading="confirmLoading"
      :ok-button-props="{ disabled: disableOk }" :cancel-button-props="{ disabled: disableCancel }">
      <template v-if="title" #title>
        <div v-html="title"></div>
      </template>
      <template v-else #title>
        <slot name="modal_title"></slot>
      </template>
      <div class="common_modal__content">
        <slot></slot>
      </div>
      <template v-if="footer" #footer></template>
    </a-modal>
  </div>
</template>

