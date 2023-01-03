<script setup lang="ts">
// codemirror 文档
// https://codemirror.net/doc/manual.html
import { useVModel } from '@vueuse/core'
import Codemirror from 'codemirror-editor-vue3'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/theme/dracula.css'
import { ref } from 'vue'
const props = defineProps({
  code: String,
  maxNum: { type: Number, default: 0 },
  mode: { type: String, default: 'javascript' },
  height: { type: String, default: '300' }
})
const emit = defineEmits(['update:code'])
const myCode = useVModel(props, 'code', emit)
const currentNum = ref(0)
const cmOptions = {
  mode: props.mode, // Language mode
  theme: 'default', // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  lineWrapping: true,
  indentUnit: 2, // The smart indent unit is 2 spaces in length
  foldGutter: true, // Code folding
  styleActiveLine: true, // Display the style of the selected row
}
currentNum.value = myCode.value?.length ?? 0
let oldCode = myCode.value ?? ''
// 是否限制最大
const isMax = props.maxNum > 0
// 不能使用v-model:value,会有全选删除不能设置的问题
const change = (instance: any, keyboard: any) => {
  // 有实例时才执行
  if (!instance || !instance.doc) return
  // 获取内容
  const content = instance.getValue()
  // 获取数量
  const num = content.length
  // 如果数量大于最大数量，并且不等于数量，载取最大
  if (isMax && num >= props.maxNum && oldCode?.length !== props.maxNum) {
    oldCode = content
    oldCode = oldCode.substring(0, props.maxNum)
  }
  // 大于了，不管怎样使用最大的旧的数据
  if (isMax && num >= props.maxNum) {
    myCode.value = oldCode
    currentNum.value = props.maxNum
  } else {
    oldCode = ''
    myCode.value = content
    currentNum.value = content.length ?? 0
  }
}
// 设置值
const onReady = (instance: any) => {
  if (instance) instance.setValue(myCode.value)
}
</script>
<template>
  <div class="h-full flex flex-col">
    <div class="flex-1">
      <Codemirror v-model:value="myCode" :options="cmOptions" :height="height" @keyup="change" @ready="onReady" border />
    </div>
    <div class="text-right text-gray-400 px-2">
      {{ currentNum }} <span v-if="maxNum > 0">/ {{ maxNum }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.CodeMirror * {
  font-size: 14px;
}
</style>
