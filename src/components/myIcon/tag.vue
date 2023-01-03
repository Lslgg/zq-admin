
<script setup lang='ts'>
import { PropType } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'

interface ITag {
  key: number
  value: string
  show?: boolean
}

defineProps({
  tags: { type: Array as PropType<ITag[]>, default: () => [] },
  className: { type: String, default: '' },
  closable: { type: Boolean, default: false },
  exclude: { type: Array as PropType<number[]> } // 排除部分不能关闭的按钮
})
const emit = defineEmits(['onClose'])
// const colors = [
//   '#F5222D', '#FA541C', '#FA8C16', '#FAAD14', '#FADB14',
//   '#A0D911', '#52C41A', '#13C2C2', '#08979C', '#40A9FF',
//   '#597EF7', '#2F54EB', '#722ED1', '#B37FEB', '#531DAB',
//   '#EB2F96', '#F759AB', '#FF7A45', '#1890FF', '#D46B08'
// ]
const close = (key: number) => emit('onClose', key)
</script>

<template>
  <div :class="[className, 'flex', 'items-center', 'flex-wrap']">
    <div class="py-1 px-2 m-1 flex items-center rounded-sm border bg-[#fafafa] group" v-for="item in tags" :key="item.value">
      <span>{{ item.value }}</span>
      <template v-if="!exclude?.includes(item.key) && closable">
        <close-outlined class="pl-1 cursor-pointer text-[10px] text-[#d9d9d9] group-hover:text-gray-500" @click="close(item.key)" />
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
