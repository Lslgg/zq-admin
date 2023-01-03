
<script setup lang="ts">
defineProps({
  alt: { type: String, default: '' },
  src: { type: String, default: '/images/icons/media-image-default.svg' },
  fallback: { type: String, default: '/images/icons/media-image-default.svg' },
  width: { type: [String, Number], default: '' },
  height: { type: [String, Number], default: '' },
  placeholder: { type: [Boolean, Object], default: false },
  preview: { type: [Boolean, Object], default: true },
})
</script>

<template>
  <a-image :src="src" :alt="alt" :width="width" :height="height" :fallback="fallback" :placeholder="placeholder"
    :preview="preview" />
</template>

<style lang="scss" scoped>
</style>
