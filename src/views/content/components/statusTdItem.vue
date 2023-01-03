
<script setup lang='ts'>
defineProps({ status: { type: Number, default: 1 } })
</script>

<template>
  <a-tag :color="status === 1 ? 'green' : 'red'">
    {{ status === 1 ? '已上架' : '已下架' }}
  </a-tag>
</template>
