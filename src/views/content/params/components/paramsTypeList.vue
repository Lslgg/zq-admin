
<script setup lang='ts'>
import { PropType } from 'vue'
import { SettingType } from '@/api/api.model'
import { ParamsTypeListService } from '../shared/paramsTypeList.service'
import {
  PlusOutlined, ArrowUpOutlined,
  ArrowDownOutlined, VerticalAlignTopOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
const props = defineProps({
  paramsType: Number,
  checkList: { type: Array as PropType<string[]>, defalut: () => [] },
  settingList: { type: Array as PropType<SettingType[]>, default: () => [] },
})
const emit = defineEmits(['update:settingList', 'update:checkList'])
const service = new ParamsTypeListService(props, emit)
const { mySettingList, myCheckList, onTop, onMoveUp, onMoveDown, onAdd, onDel, onCheck } = service.useOnFun()
</script>

<template>
  <div class="w-full">
    <a-checkbox-group v-model:value="myCheckList" :indeterminate="true" @change="onCheck" class="w-3/5">
      <div v-for="(item, index) in mySettingList" :key="index"
        class="flex justify-start items-center border space-x-3 p-2 bg-gray-100 rounded-sm">
        <a-checkbox v-model:checked="item.isChecked" v-model:value="item.value"></a-checkbox>
        <span class="text-gray-500">设为默认</span>
        <a-input v-model:value="item.value" class="!w-3/5" />
        <arrow-up-outlined class="cursor-pointer" @click="onMoveUp(index)" />
        <arrow-down-outlined class="cursor-pointer" @click="onMoveDown(index)" />
        <vertical-align-top-outlined class="cursor-pointer" @click="onTop(index)" />
        <plus-outlined class="cursor-pointer" @click="onAdd(index)" />
        <delete-outlined class="cursor-pointer" @click="onDel(index)" />
      </div>
    </a-checkbox-group>
  </div>
</template>

<style lang='scss' scoped>
</style>
