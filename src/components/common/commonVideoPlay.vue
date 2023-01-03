<script setup lang='ts'>
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'
const emit = defineEmits(['update:visible'])
const props = defineProps({
  src: { type: String, default: '' }
})
const mySrc = useVModel(props, 'src', emit)
const visible = ref(true)
const close = () => emit('update:visible')
</script>

<template>
  <a-modal :zIndex="1301" v-model:visible="visible" title="播放视频" width="100%" wrap-class-name="full-modal" destroyOnClose :footer="null" @cancel="close">
    <iframe width="100%" height="100%" :src="mySrc" type="video/mp4"></iframe>
  </a-modal>
</template>

<style lang='scss'>
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    padding: 0;
  }
}
</style>
