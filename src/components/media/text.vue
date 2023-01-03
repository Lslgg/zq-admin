<template>
  <a-tooltip>
    <template #title>{{ text }}</template>
    <span class="media-text" :style="`--rows:${rows}`">{{ text }}</span>
  </a-tooltip>
</template>

<script lang="ts">
import { prop, Vue } from 'vue-class-component'

/** 属性 */
class PropsInfo {
  text = prop({ type: String, default: '' })
  rows = prop({ type: Number, default: 0 })
}

/** MediaText */
export default class MediaText extends Vue.with(PropsInfo) {}
</script>

<style lang="scss">
.media-text {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: var(--rows);
  -webkit-box-orient: vertical;
}
</style>
