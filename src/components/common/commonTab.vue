<script setup lang='ts'>
import { PropType, ref } from 'vue'

interface ITabItem {
  title: string,
  value: string | number,
  icon?: string,
  num?: number
}

const props = defineProps({
  visible: Boolean,
  tabList: {
    type: Array as PropType<ITabItem[]>,
    default: () => []
  },
  activeTab: {
    type: [String, Number],
  }
})
const emit = defineEmits(['update:activeTab', 'onChange'])
const activeValue = ref(props.activeTab || props.tabList[0].value)
const change = () => {
  emit('update:activeTab', activeValue.value)
  emit('onChange')
}
</script>

<template>
  <div class='tab bg-white px-4'>
    <a-tabs v-model:activeKey="activeValue" size="large" @change="change">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <template #tab>
          <div class=" text-center">
            <div class="tab-icon" v-if="item.icon" v-html="item.icon"></div>
            <a-badge :count="item.num" v-if="item.num" :offset="[10, -10]">
              <div class="tab-txt px-3">{{ item.title }}</div>
            </a-badge>
            <div class="tab-txt px-3" v-else>{{ item.title }}</div>
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <slot></slot>
  </div>
</template>

<style lang='scss' scoped>
.tab-txt {
  font-size: 16px;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
