
<script setup lang='ts'>
import { ref } from 'vue'
import { SeoForm } from '../shared/useSeo.service'
import SeoTable from '../components/seoTable.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  visible: Boolean,
  id: { type: Number, default: 0 },
  type: { type: Number, default: 0 }
})

const emit = defineEmits(['update:visible', 'onOk'])
const myVisible = useVModel(props, 'visible', emit)
const confirmLoading = ref(false)
const formSerice = new SeoForm(props, emit, confirmLoading)
const { modelRef, modelRule, onSubmit } = await formSerice.useForm()
const { rebuild } = formSerice.useSeoForm()
const onfilter = (value: string[]) => {
  modelRef.seo_keyword = value.filter((item: string) => item.length <= 50).filter((_item, index) => index < 3)
}
</script>

<template>
  <a-modal @ok="onSubmit" v-model:visible="myVisible" class="!max-w-[600px]">
    <a-form layout="vertical">
      <a-form-item label="SEO关键词" v-bind="modelRule.seo_keyword">
        <template #extra>
          <div class="flex items-center">
            <a-popconfirm :showCancel="false" okText="关闭" overlayClassName="seo-popconfirm">
              <template #icon></template>
              <template #title>
                <SeoTable v-model:keyword="modelRef.seo_keyword"></SeoTable>
              </template>
              <a class="py-2 pr-2 text-primary" href="javascript:;">词库选词</a>
            </a-popconfirm>
            <a class="py-2 text-primary" href="javascript:;" type="link"
              @click="rebuild(modelRef, 'seo_keyword')">重新生成</a>
          </div>
        </template>
        <a-select size="large" v-model:value="modelRef.seo_keyword" mode="tags" style="width: 100%"
          :token-separators="[',']" placeholder="请输入1~3个关键词，每个关键词少于50个字符" @change="onfilter" :open="false"></a-select>
      </a-form-item>
      <a-form-item label="SEO标题">
        <template #extra>
          <div class="py-2 text-primary">
            <a href="javascript:;" type="link" @click="rebuild(modelRef, 'seo_title')">重新生成</a>
          </div>
        </template>
        <a-input v-model:value="modelRef.seo_title" placeholder="请输入不超过150字符，尽量在40~60字符内最优"
          :maxlength="150" :showCount="true"></a-input>
      </a-form-item>
      <a-form-item label="SEO描述">
        <template #extra>
          <div class="py-2 text-primary">
            <a href="javascript:;" type="link" @click="rebuild(modelRef, 'seo_description')">重新生成</a>
          </div>
        </template>
        <a-textarea v-model:value="modelRef.seo_description" show-count :maxlength="300" :rows="4"
          placeholder="请输入不超过300字符的描述内容，尽量在120字符内最优"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang='scss'>
.seo-popconfirm {
  .ant-popover-message-title {
    padding-left: 0;
  }

  .ant-popover-inner-content {
    padding: 0;
  }

  .ant-popover-message {
    padding: 0;
  }

  .ant-popover-buttons {
    margin-bottom: 0;
    padding: 10px;
  }
}
</style>
