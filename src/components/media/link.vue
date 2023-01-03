<script setup lang="ts">
defineProps({
  href: { type: String, default: 'javascript:;' },
  target: { type: String, default: '_self' },
  danger: { type: [Boolean, Number], default: false },
})
</script>
<template>
  <a class="media-link" :class="danger ? 'danger' : ''" :href="href" :target="target">
    <slot />
  </a>
</template>

<style lang="scss">
.media-link {
  color: var(--color);

  &.danger {
    color: red;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>
