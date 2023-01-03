<script setup lang="ts">
import { API } from '@/api/apis'
import { CommonSearch } from '@/components/common'
import router from '@/router'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import {
  PlusOutlined,
  // UploadOutlined, DownloadOutlined
} from '@ant-design/icons-vue'
import { PropType, ref } from 'vue'
const props = defineProps({
  selectKey: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
})
const emit = defineEmits(['onOperate', 'onKeyword'])
// 批量操作变量
const status = ref()
const keyword = ref('')

const addProduct = () => {
  router.push({ name: 'addVideo' })
}
const onClassify = () => {
  router.push({ name: 'videoClassify', params: { type: 'video' } })
}
const onKeyword = (keyword: string) => {
  emit('onKeyword', keyword)
}
// 批量操作
const handleChange = () => {
  if (props.selectKey.length === 0) {
    Utilts.ins().message('未选内容', 'error')
    return
  }
  const params: any = {
    site_id: UseCommon.ins().siteId,
    ids: [...props.selectKey],
  }
  if (status.value < 2) {
    // 上下架
    params.status = status.value
    API.video.postVideoStatus(params).then((res) => {
      if (res.data) {
        Utilts.ins().message(`${status.value ? '上架' : '下架'}成功`)
        emit('onOperate')
      }
    })
  } else if (status.value === 2) {
    Utilts.ins().confirm({
      okCallBack: () => {
        API.video.postVideoDelete(params).then((res) => {
          if (res.data) {
            Utilts.ins().message('删除成功')
            emit('onOperate')
          }
        })
      },
    })
  } else if (status.value === 3 || status.value === 4) {
    // 置顶或取消
    params.is_top = status.value === 3 ? 1 : 0
    API.video.postVideoTop(params).then((res) => {
      if (res.data) {
        Utilts.ins().message('操作成功')
        emit('onOperate')
      }
    })
  }
}
</script>

<template>
  <div class="flex justify-between">
    <div class="flex justify-start items-center space-x-4">
      <CommonSearch tip="请输入视频名称" v-model:keyword="keyword" @on-search="onKeyword"></CommonSearch>
      <a-button @click="addProduct" class="flex items-center leading-no" type="primary">
        <template #icon>
          <PlusOutlined class="text-sm leading-no" />
        </template>
        添加视频
      </a-button>
      <a-button class="hidden items-center leading-no" @click="onClassify">视频分类</a-button>
    </div>
    <div class="flex justify-start items-center space-x-4">
      <!-- <a-button class="flex items-center" size="small">
        <template #icon>
          <DownloadOutlined />
        </template>
        导入
      </a-button>
      <a-button class="flex items-center" size="small">
        <template #icon>
          <UploadOutlined />
        </template>
        导出
      </a-button>-->
      <a-select size="large" placeholder="批量操作" ref="select" v-model:value="status" @select="handleChange">
        <a-select-option :value="1">上架</a-select-option>
        <a-select-option :value="0">下架</a-select-option>
        <a-select-option :value="2">删除</a-select-option>
        <a-select-option :value="3">置顶</a-select-option>
        <a-select-option :value="4">取消置顶</a-select-option>
      </a-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
