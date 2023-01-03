<script setup lang='ts'>
import { API } from '@/api/apis'
import { CodeMirror } from '@/components/codemirror'
import { Utilts } from '@/util/utilts'
import { CodeDesignTable } from '../shared/codeDesign.service'
const props = defineProps({
  type: Number
})
const pageItems = await new CodeDesignTable().getList(props.type ?? 0)
const onSubmit = () => {
  pageItems.forEach(p => {
    const name = p.name
    if (p.content) {
      try {
        API.design.postDesignContentUpdate({ ...p, content: JSON.parse(p.content) })
          .then(() => Utilts.ins().message(`${name}保存成功`))
      } catch (error) {
        Utilts.ins().message(`${name}内容格式有问题`, 'error')
      }
    }
  })
}
</script>

<template>
  <a-form autocomplete="off" layout="vertical">
    <TemplateCard :hideTopRound="true">
      <div class="py-3 pt-6 flex flex-wrap">
        <a-form-item v-for="(item, index) in pageItems" :key="index" :label="item.name">
          <CodeMirror v-model:code="item.content" :maxNum="50000" height="300"></CodeMirror>
        </a-form-item>
      </div>
      <div class="flex justify-center pb-4">
        <a-button class="w-[100px]" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </TemplateCard>
  </a-form>
</template>

<style lang='scss' scoped>
:deep(.ant-form-item) {
  width: 100%;
  padding: 0 20px;
  margin-bottom: 0;
}
@media(min-width:1366px) {
  :deep(.ant-form-item) {
    width: 50%;
  }
}
</style>
