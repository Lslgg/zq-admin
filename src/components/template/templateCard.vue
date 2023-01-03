<template>
  <div class="template_card">
    <a-card :bordered="bordered" class="h-full" :class="{ 'header-solid': !showTitleSolid, '!rounded-t-none': hideTopRound }">
      <template v-if="title" #title>
        <span>{{ title }}</span>
        <span @click="onMore" v-if="subTitle" class="template_card__sub_title">{{ subTitle }}</span>
        <slot name="subtitle"></slot>
      </template>
      <template v-else-if="soltTitle" #title>
        <slot name="title"></slot>
        <slot name="subtitle"></slot>
      </template>
      <div class="template_card__content px-2">
        <slot></slot>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  soltTitle: { type: Boolean, default: false },
  subTitle: { type: String, default: '' },
  bordered: { type: Boolean, defalut: false },
  showTitleSolid: { type: Boolean, defalut: false },
  hideTopRound: { type: Boolean, defalut: false }
})
// 声明事件
const emit = defineEmits(['onMore'])
const onMore = () => emit('onMore')
</script>

<style lang="scss" scoped>
:deep(.ant-card-head-title) {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.template_card__sub_title {
  color: var(--color);
  font-size: 10px;
}
.template_card__content {
  overflow-x: auto;
}
</style>
