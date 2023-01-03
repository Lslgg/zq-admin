<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { useVModel } from '@vueuse/core'
// 声明props
const props = defineProps({
  tip: { type: String, default: '' },
  keyword: { type: String, default: '' }
})

// 声明事件
const emit = defineEmits(['onSearch', 'update:keyword'])
const mySearchKey = useVModel(props, 'keyword', emit)
const onSearch = () => {
  emit('onSearch', mySearchKey.value)
}
</script>

<template>
  <div class="common_search">
    <a-input-group>
      <a-input v-model:value="mySearchKey" :placeholder="tip" @keyup.enter.native="onSearch" />
      <search-outlined @click="onSearch" />
    </a-input-group>
  </div>
</template>


<style lang="scss" scoped>
.common_search {
  :deep(.ant-input-group) {
    position: relative;

    .ant-input {
      border-radius: 6px;
      padding-right: 32px;
    }

    .anticon-search {
      font-size: 18px;
      position: absolute;
      right: 8px;
      top: 11px;
      z-index: 10;
    }
  }
}
</style>
