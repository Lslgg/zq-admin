<script setup lang="ts">
import { API } from '@/api/apis'
import { CommonSearch } from '@/components/common'
import router from '@/router'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
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
const addArticle = () => router.push({ name: 'addArticle' })
const onClassify = () =>
  router.push({ name: 'articleClassify', params: { type: 'article' } })
const onKeyword = () => emit('onKeyword', keyword.value)
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
    API.article.postArticleStatus(params).then((res) => {
      if (res.data) {
        Utilts.ins().message(`${status.value ? '上架' : '下架'}成功`)
        emit('onOperate')
      }
    })
  } else if (status.value === 2) {
    Utilts.ins().confirm({
      okCallBack: () => {
        API.article.postArticleDelete(params).then((res) => {
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
    API.article.postArticleTop(params).then((res) => {
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
      <CommonSearch tip="请输入文章名称" v-model:keyword="keyword" @onSearch="onKeyword"></CommonSearch>
      <a-button @click="addArticle" class="flex items-center" type="primary">
        <template #icon>
          <PlusOutlined class="text-sm" />
        </template>
        添加文章
      </a-button>
      <a-button class="hidden items-center" @click="onClassify">文章分类</a-button>
    </div>
    <div class="flex justify-start items-center space-x-4">
      <a-button class="items-center hidden">
        <template #icon>
          <DownloadOutlined />
        </template>
        导入
      </a-button>
      <a-button class="items-center hidden">
        <template #icon>
          <UploadOutlined />
        </template>
        导出
      </a-button>
      <a-select size="large" placeholder="批量操作" ref="select" v-model:value="status" style="width: 120px"
        @select="handleChange">
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
