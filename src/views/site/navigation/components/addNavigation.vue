
<script setup lang='ts'>
import { INavigation } from '@/api/api.model'
import { UseTreeService } from '@/util/useTreeService'
import { useVModel } from '@vueuse/core'
import { TreeSelect } from 'ant-design-vue'
import { ref, computed, PropType } from 'vue'
import { AddNavigationService } from '../shared/add.navigation.service'
const props = defineProps({
  id: Number,
  pid: Number,
  navList: { type: Array as PropType<INavigation[]>, default: () => [] }, // 上级导航列表
  visible: Boolean,
})
// 是否显示
const emit = defineEmits(['update:visible', 'onAddSubmit'])
// 添加导航
const navService = new AddNavigationService(props.id || 0, props.pid || 0, emit)
const { modelRef, modelRule, onSubmit } = await navService.useForm()
const myVisible = useVModel(props, 'visible', emit)
// 页面类型id
const content_type_id = ref()
// 获取页面类型
const typeList = await navService.getConstantList()
// 根据详情id获取页面类型
const typeInfo = typeList.find(p => p.content_type === modelRef.content_type &&
  p.page_type === modelRef.page_type)
if (typeInfo) content_type_id.value = typeInfo.key
// 根据页面类型id获取页面类型名称和内容类型
const onContentType = () => {
  const contentTypeInfo = typeList.find(p => p.key === content_type_id.value)
  if (contentTypeInfo) {
    modelRef.content_type = contentTypeInfo.content_type || ''
    modelRef.page_type = contentTypeInfo.page_type || ''
  }
}
// 导航上级不显示home,编辑的时候最大层级控制和不能编辑为自己或自己以下的导航
const myNavList = computed(() => {
  const list = props.navList.filter((p: any) => p.content_type !== 'home')
  // 将树形转换成列表
  const treeList = UseTreeService.ins().getListTree(props.navList)
  // 所有的数据不禁用
  treeList.forEach(p => p.disabled = false)
  if (props.id) {
    // 编辑的时候不能选择自己和自己的子级
    const navInfo = treeList.find(p => p.id === props.id)
    if (navInfo) navInfo.disabled = true
    UseTreeService.ins().setNowTreeLevelInfo(navInfo)
    // 获取当前最大层级
    const maxLevel = UseTreeService.ins().calculationLevel([navInfo])
    const setDisable = (filterLevel: number) => {
      treeList.filter(p => p.level >= filterLevel).forEach(p => p.disabled = true)
    }
    // 四级不能添加到任何层级下，只能在顶级
    if (maxLevel === 4) treeList.forEach(p => p.disabled = true)
    else if (maxLevel === 3) setDisable(2)
    else if (maxLevel === 2) setDisable(3)
    else if (maxLevel === 1) setDisable(4)
  }
  list.unshift({ id: 0, title: '顶级' } as any)
  return list
})
</script>

<template>
  <div class="w-full">
    <CommonModal class-name="min-w-[580px]" v-model:visible="myVisible" :title="`${modelRef.id ? '编辑' : '添加'}导航`"
      @ok="onSubmit" :isAutoClose="false">
      <a-form :wrapperCol="{ span: 19 }" :labelCol="{ span: 5 }" autocomplete="off" :hideRequiredMark="true">
        <a-form-item label="页面名称" class="!mb-3" v-bind="modelRule.title">
          <a-input v-model:value="modelRef.title" :maxlength="100" size="small" :showCount="true" />
        </a-form-item>
        <a-form-item v-show="modelRef.content_type!== 'home'" label="页面类型" class="!mb-3" v-bind="modelRule.pageType">
          <a-select ref="select" v-model:value="content_type_id" class="w-full" @change="onContentType">
            <a-select-option v-for="item in typeList" :key="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="modelRef.content_type!== 'home'" label="上级导航" class="!mb-3" v-bind="modelRule.pid">
          <a-tree-select ref="treeSelectRef" :showCheckedStrategy="TreeSelect.SHOW_ALL" v-model:value="modelRef.pid"
            :multiple="false" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :fieldNames="{ children: 'children', label: 'title', key: 'id', value: 'id' }" :placeholder="`请选择上级导航`"
            :tree-data="myNavList" tree-default-expand-all show-search allow-clear>
          </a-tree-select>
        </a-form-item>
        <a-form-item v-show="modelRef.content_type!== 'home'" v-if="content_type_id && content_type_id !== 0" label="绑定分类" class="!mb-3"
          v-bind="modelRule.category_ids">
          <ClassifyTreeSelect :key="content_type_id" v-model:value="modelRef.category_ids" :type="content_type_id"
            :isDefaultItem="false" :isAll="true">
          </ClassifyTreeSelect>
        </a-form-item>
        <a-form-item v-show="modelRef.content_type!== 'home'" label="启用状态" class="!mb-3" v-bind="modelRule.status">
          <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" checked-children="启用"
            un-checked-children="禁用" />
        </a-form-item>
      </a-form>
    </CommonModal>
  </div>
</template>
