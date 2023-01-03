<script setup lang='ts'>
import {
  CataLogTree, CatalogMaterial, CatalogUpload,
  CatalogAdd, CatalogFolder, CatalogUse,
  CatalogCheckAll, MaterialAttr
} from './components'
import { MaterialGroupService } from './shared/materialGroup.service'
import MaterialUpdate from './components/materialUpdate.vue'
import { PropType, onMounted, ref } from 'vue'
import { CommonVideoPlay } from '@/components/common'
import { IAttachment, MaterFileType } from '@/api/api.model'
import { UseCommon } from '@/util/useCommon'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  opationType: { type: String as PropType<MaterialType>, defalut: 'add' }, // 添加或选择素材
  selectData: { type: Array as PropType<IAttachment[]>, default: () => [] }, // 选中的素材
  parentSinning: { type: Boolean, default: false }, // 弹出框的加载状态
  selectType: { // 选择素材类型
    type: Number as PropType<MaterFileType>,
    default: MaterFileType.ALL
  }
})
const emit = defineEmits(['update:selectData', 'update:parentSinning'])
const myParentSinning = useVModel(props, 'parentSinning', emit)
const material = new MaterialGroupService(props, emit)

// 文件操作
const {
  visible, attachmentGroupList, treeData, isRoot, formState, selectedKeys, groupId, getAttachmentGroupList,
  selectTree, onBack, onUpdate, onUpdateMaterial, delFolder, addCatalog, loadImg, onSearchGroup,
} = await material.useMaterialGroup()
// 素材操作
const {
  attachmentList, isShowSearch, selectTotal, videoViible, videSrc, materialDetail, attrVisible, spinning,
  getAttachmentList, onShowVideo, onDetail, onMove, onSelect, onUpload, onDel, selectTreeMaterial, onSearch
} = await material.useMateral()

const onSelectTree = (keys: number[]) => {
  selectTree(keys)
  selectTreeMaterial(keys)
}
const onSearchAll = (keyword: string, type: number) => {
  onSearch(keyword, type)
  onSearchGroup(keyword)
}
onMounted(() => myParentSinning.value = false)
let treeHeight = '100vh - 200px'
let fileHeight = '100vh - 200px'
if (props.opationType === 'add') {
  treeHeight = '100vh - 100px'
  fileHeight = '100vh - 220px'
}
let attachmentIndex = 1
let groupIndex = 1
let isCompile = true
let isGroupCompile = true
const scrollRef = ref<HTMLElement | null>(null)
const scrollRef2 = ref<HTMLElement | null>(null)
// 素材滚动加载
UseCommon.ins().useOnScroll(scrollRef, async () => {
  if (isCompile) {
    attachmentIndex++
    spinning.value = true
    const data = await getAttachmentList(attachmentIndex)
    spinning.value = false
    if (data.length > 0) {
      attachmentList.value.push(...data)
    } else isCompile = false
  }
})
// 文件滚动加载
UseCommon.ins().useOnScroll(scrollRef2, async () => {
  if (isGroupCompile) {
    groupIndex++
    spinning.value = true
    const groupData = await getAttachmentGroupList(groupIndex)
    spinning.value = false
    if (groupData.length > 0) {
      groupData.forEach(item => {
        attachmentGroupList.value.push(item)
        if (treeData.value) {
          treeData.value[0].children?.push({ key: item.id, title: item.group_name })
        }
      })
    } else isGroupCompile = false
  }
})
</script>
<template>
  <a-spin :spinning="spinning" wrapperClassName="max-w-full overflow-y-auto overflow-hidden">
    <div class="flex justify-start rounded overflow-y-auto border overflow-hidden">
      <div ref="scrollRef2" class="w-[240px] p-4 bg-[#EBECF0] min-h-[18.25rem] overflow-y-auto"
        :style="`max-height:calc(${treeHeight})`">
        <!-- 已用空间 -->
        <CatalogUse></CatalogUse>
        <div class="py-4">
          <!-- 素材库树 -->
          <CataLogTree :treeData="treeData" v-model:selectedKeys="selectedKeys" @selectTree="onSelectTree">
          </CataLogTree>
        </div>
      </div>
      <div class="flex-1 p-4 bg-white">
        <!-- 本地上传 -->
        <CatalogUpload v-if="isShowSearch" v-model:isRoot="isRoot" v-model:groupId="groupId" :selectType="selectType"
          v-model:spinning="spinning" @onUpload="onUpload" @onBack="() => { onBack(); selectTreeMaterial([0]) }"
          @onSearch="onSearchAll" class="pb-3"></CatalogUpload>
        <!-- 全选，删除，移动 -->
        <CatalogCheckAll v-if="!isShowSearch" v-model:spinning="spinning" :attachmentGroupList="attachmentGroupList"
          v-model:attachmentList="attachmentList" v-model:selectTotal="selectTotal"
          @onDel="(ids: number[]) => { onDel(ids); isShowSearch = true }" @onSelect="onSelect" @onMove="onMove">
        </CatalogCheckAll>
        <div ref="scrollRef" :style="`max-height:calc(${fileHeight});min-height:calc(${fileHeight});padding-bottom:60px`"
          class="overflow-y-auto">
          <div class="max-w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 gap-4 sm:grid-cols-2">
            <template v-if="isRoot">
              <!-- 添加目录 -->
              <CatalogAdd v-if="opationType === 'add'" :attachmentGroupList="attachmentGroupList"
                @addCatalog="addCatalog" class="p-3 w-full min-w-[10px]"></CatalogAdd>
              <!-- 目录 -->
              <CatalogFolder v-for="item in attachmentGroupList" :key="item.id" :attachment="item" @onUpdate="onUpdate"
                @delFolder="delFolder" @loadImg="(key: number) => { loadImg(key); selectTreeMaterial([key]) }"
                class="p-3 w-full bg-gray-50"></CatalogFolder>
            </template>
            <!-- 素材 -->
            <CatalogMaterial v-for="item in attachmentList" :key="item.id" @onUpdate="onUpdate" @onDetail="onDetail"
              :opationType="opationType" @onSelect="onSelect" @onDel="onDel" @onShowVideo="onShowVideo"
              :attachment="item" class="p-3 w-full bg-gray-50"></CatalogMaterial>
          </div>
        </div>
        <div v-show="spinning" class="flex justify-center">
          <a-typography-link> 加载更多 </a-typography-link>
        </div>
      </div>
    </div>
    <!-- 修改素材和文件名 -->
    <MaterialUpdate v-model:visible="visible" @onUpdateMaterial="() => onUpdateMaterial(attachmentList)"
      v-model:formState="formState"></MaterialUpdate>
    <!-- 素材详情 -->
    <MaterialAttr v-model:visible="attrVisible" v-model:detail="materialDetail"></MaterialAttr>
    <CommonVideoPlay v-model:visible="videoViible" :src="videSrc"></CommonVideoPlay>
  </a-spin>
</template>

<style lang='scss' scoped>
:deep(.ant-spin-container) {
  height: inherit;
}
</style>
