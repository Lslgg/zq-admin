
<script setup lang='ts'>
import { PropType } from 'vue'
import { FolderFilled } from '@ant-design/icons-vue'
import { TreeProps } from 'ant-design-vue'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  treeData: { type: Array as PropType<TreeProps['treeData']>, default: () => [], required: true },
  selectedKeys: { type: Array as PropType<number[]>, default: () => [] }
})
const emit = defineEmits(['selectTree', 'update:selectedKeys'])
const mySelectedKeys = useVModel(props, 'selectedKeys', emit)
const selectTree = (keys: number[]) => {
  emit('selectTree', keys)
}
</script>

<template>
  <div class>
    <a-tree @select="selectTree" v-model:selectedKeys="mySelectedKeys" :tree-data="treeData" show-icon
      default-expand-all>
      <template #icon>
        <folder-filled class="text-orange-300 text-xl leading-none" />
      </template>
    </a-tree>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-tree-list-holder-inner) {
  background: #ebecf0;
}
</style>
