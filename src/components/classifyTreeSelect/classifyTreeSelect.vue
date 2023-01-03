
<script setup lang='ts'>
import { useVModel } from '@vueuse/core'
import { PropType, ref } from 'vue'
import { CommonService } from '@/views/shared/common.service'
import { TreeSelect } from 'ant-design-vue'

const props = defineProps({
  type: { type: Number, default: 1 }, // 产品, 文章，视频 product: 1, article: 2, video: 3
  showType: { type: String as PropType<SelectTreeType>, default: 'SHOW_ALL' }, // 下拉选择的方式
  value: { type: [Number, String, Array] as PropType<number | string | number[]>, default: 0 }, // 选择的值
  isDefaultItem: { type: Boolean, default: true }, // 是否默认选择项
  size: { type: String, default: 'large' },
  defaultFocus: { type: Boolean, default: false },
  isAll: Boolean,
})
const emit = defineEmits(['update:value', 'onSelectTree'])
const myVal = useVModel(props, 'value', emit)
const typeVale = ['产品', '文章', '视频'][props.type - 1]
const treeSelectRef: any = ref()
const open = ref(true)
// 初始化加载数据
const selectData = await CommonService.ins().getTreeList(props.type)
const treeData = ref(selectData.treeList)
// 如果有栏目id只显示当前导航的类别
// 选中改变事件
const onSelect = (key: string, item: ITree) => {
  if (Number(key) === -1) { // 全选
    if (Array.isArray(myVal.value)) {
      const isSelectAll = myVal.value.length === selectData.keyList.length
      if (isSelectAll) myVal.value = []
      else myVal.value = selectData.keyList
    }
  } else emit('onSelectTree', key, item)
}
const onVisibleChange = (visible: boolean) => open.value = visible
// 默认的项
if (props.isDefaultItem) {
  const rootName = Array.isArray(myVal.value) ? '通用类' : '顶级'
  const commitClass: ITree = { key: 0, id: 0, pid: 0, title: rootName, disabled: false, level: 1 }
  treeData.value?.unshift(commitClass)
}
// 选中的值
if (!Array.isArray(myVal.value) && myVal.value !== 0) {
  let info: Partial<ITree> = { key: '' }
  const getTreeData = (list: ITree[]) => {
    list.forEach(p => {
      if (p.id === myVal.value) info = p
      else return getTreeData(p.children || [])
    })
  }
  getTreeData(selectData.treeList)
  // 初始化默认选中改变事件
  emit('onSelectTree', info?.key, info)
}
if (props.isAll) {
  const rootName = '--全选--'
  const commitClass: ITree = { key: -1, id: -1, pid: -1, title: rootName, disabled: false, level: 1 }
  treeData.value?.unshift(commitClass)
}
</script>

<template>
  <a-tree-select ref="treeSelectRef" @select="onSelect" @dropdownVisibleChange="onVisibleChange" :size="size"
    :showCheckedStrategy="TreeSelect.SHOW_ALL" v-model:value="myVal" :multiple="Array.isArray(myVal)"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :fieldNames="{ children: 'children', label: 'title', key: 'id', value: 'id' }" :placeholder="`请选择${typeVale}分类`"
    :tree-data="treeData" tree-default-expand-all show-search allow-clear></a-tree-select>
</template>
