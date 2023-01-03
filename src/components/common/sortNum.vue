
<script setup lang='ts'>
import { useVModel } from '@vueuse/core'
const props = defineProps({
  value: { type: Number, default: 1 }
})
const emit = defineEmits(['update:value'])
const myValue = useVModel(props, 'value', emit)
</script>

<template>
  <div class="w-full">
    <a-input-number v-model:value="myValue" :min="1" :max="9999" :controls="false" class="!w-full !max-w-[173px]" />
    <span class="text-gray-400 pl-3 text-xs">数字越小越靠前最大(9999)</span>
  </div>
</template>

<style lang='scss' scoped>
</style>
