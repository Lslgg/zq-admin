<template>
  <div class="template_tap_card">
    <a-card :bordered="false" class="header-solid h-full">
      <div class="template_tap_card__tab">
        <slot></slot>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.template_tap_card__tab {
  padding: 8px;
}
:deep(.ant-tabs-top) {
  margin: 0 -16px;
}
:deep(.ant-tabs-nav) {
  padding: 0 16px;
  // margin-bottom: 0;
}
</style>
