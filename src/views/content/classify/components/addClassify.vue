
<script setup lang='ts'>
import { CommonModal } from '@/components/common'
import { ClassifyTreeSelect } from '@/components/classifyTreeSelect'
import { PropType, ref } from 'vue'
import { UseClassifyForm } from '../shared/addClassify.service'
import { IClassifyForm } from '@/api/api.model'
const props = defineProps({
  visible: Boolean,
  category: { type: Object as PropType<Partial<IClassifyForm>>, default: () => { } }
})
const confirmLoading = ref(false)
const myItem = ref<Partial<ITree>>({})
const emit = defineEmits(['update:visible', 'update:pid', 'update:confirmLoading', 'onOk'])
const classifyForm = new UseClassifyForm(props, emit, confirmLoading)
const { myVisible } = classifyForm.useMyProps()
const { modelRule, modelRef, onSubmit } = await classifyForm.useForm(myItem)
const onSelectTree = (key: string, item: ITree) => {
  myItem.value = item
}

</script>

<template>
  <div class="w-full">
    <CommonModal class-name="min-w-[580px]" v-model:visible="myVisible" :confirmLoading="confirmLoading"
      :title="`${modelRef.id ? '编辑' : '添加'}分类`" @ok="onSubmit" :isAutoClose="false">
      <a-form :wrapperCol="{ span: 19 }" :labelCol="{ span: 5 }" autocomplete="off" :hideRequiredMark="true">
        <a-form-item label="分类名称" class="!mb-3" v-bind="modelRule.category_name">
          <a-input v-model:value="modelRef.category_name" :maxlength="50" size="small" />
        </a-form-item>
        <a-form-item label="选择上级分类" class="!mb-3" v-bind="modelRule.category_type">
          <ClassifyTreeSelect v-model:value="modelRef.pid" :type="category.category_type" @onSelectTree="onSelectTree" :isDefaultItem="true">
          </ClassifyTreeSelect>
        </a-form-item>
        <a-form-item label="启用状态" class="!mb-3" v-bind="modelRule.status">
          <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" checked-children="启用"
            un-checked-children="禁用" />
        </a-form-item>
      </a-form>
    </CommonModal>
  </div>
</template>
