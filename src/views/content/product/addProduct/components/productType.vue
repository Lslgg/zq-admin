
<script setup lang='ts'>
import { PropType, ref } from 'vue'
import { ProductStore } from '../../shared/product.store'
import { ProductTypeService } from '../../shared/productType.service'
const props = defineProps({
  categoryIds: {
    type: Array,
    default: () => []
  },
  keyValueList: {
    type: Array as PropType<KeyValue[]>,
    default: () => []
  }
})
const emit = defineEmits(['update:categoryIds', 'update:keyValueList'])
const selectedKeys = ref<number[]>([])
const typeService = new ProductTypeService(props, emit)
const useInfo = await typeService.useProductType(selectedKeys)
const showType = ProductStore.ins().showType
if (showType === 'edit') {
  useInfo.selectedKeys.value = ProductStore.ins().product.category_ids ?? []
}
</script>

<template>
  <div class="w-full">
    <div class="w-full p-4 pb-2">
      <div class="flex space-x-6">
        <div class="py-2">产品分类：</div>
        <div class="flex-1 h-[69vh] overflow-y-auto">
          <a-tree
            @select="useInfo.onSelect"
            v-model:selectedKeys="selectedKeys"
            :tree-data="useInfo.treeData"
            multiple
            :fieldNames="{ children: 'children', title: 'title', key: 'key' }"
            class="!bg-gray-400"
            defaultExpandAll
          ></a-tree>
        </div>
        <div v-if="showType === 'add'">
          <a-button size="small" @click="useInfo.onProductType">设置产品分类</a-button>
        </div>
      </div>
    </div>
    <div v-if="showType === 'add'" class="flex justify-center items-center p-6">
      <a-button size="small" class="w-68" type="primary" @click="useInfo.onSubmit">选好了，去填写产品信息</a-button>
    </div>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-tree-list) {
  @apply p-4 bg-gray-50;
}
</style>
