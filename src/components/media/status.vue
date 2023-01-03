<template>
  <a-tooltip>
    <template #title>{{ status ? '已读' : '未读' }}</template>
    <span :class="`media-status media-status--${status ? 'on' : 'off'}`"></span>
  </a-tooltip>
</template>

<script lang="ts">
import { prop, Vue } from 'vue-class-component'

/** 属性 */
class PropsInfo {
  status = prop({ type: Boolean, default: false })
}

/** MediaStatus */
export default class MediaStatus extends Vue.with(PropsInfo) {}
</script>

<style lang="scss">
.media-status {
  margin: auto;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  display: block;
  background-color: red;
  &.media-status--on {
    background-color: green;
  }
}
</style>
