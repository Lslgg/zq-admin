
<script setup lang='ts'>
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { MaterFileType } from '@/api/api.model'
import { WeChatService } from '../shared/weChat.service'
import CommonUpload from '@/components/common/commonUpload.vue'
import { ref } from 'vue'
const isEdit = ref(true)
const weChatService = new WeChatService()
const { modelRef, modelRule, onSubmit } = await weChatService.useForm(isEdit)
const isAdd = ref(false)
isEdit.value = !isAdd.value
isAdd.value = modelRef.id ? false : true
const onShowAdd = () => {
  isAdd.value = false
  isEdit.value = false
}
// 取消添加Messager
const onClear = () => {
  // 未保存取消
  if (!modelRef.id) {
    isEdit.value = false
    isAdd.value = true
    return
  }
  // 有数据取消
  if (modelRef.id && !isEdit.value) {
    weChatService.initForm().then(data => Object.assign(modelRef, data))
    isEdit.value = true
    return
  }
  Utilts.ins().confirm({
    title: '提示',
    content: '确定要删除WeChat吗？',
    okCallBack: () => {
      API.site.postSiteConfigDelete({ site_id: UseCommon.ins().siteId, ids: [modelRef.id] })
        .then(res => {
          isEdit.value = false
          modelRef.id = 0
          modelRef.wechat = []
          isAdd.value = true
        })
    }
  })
}
</script>

<template>
  <div class='messages min-h-[420px]'>
    <div class="flex items-center justify-between">
      <span class="flex items-center justify-between space-x-2">
        <span class="text-xl leading-none text-green-600">
          <MediaImage class="h-10" src="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/WeChat.svg"
            :preview="false" />
        </span>
        <span>
          添加后客户可通过扫描WeChat二维码，添加你为好友并发起聊天。
        </span>
      </span>
    </div>
    <a-empty v-if="isAdd" class="p-8" :description="null"
      image="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/WeChat.svg" :imageStyle="{ 'margin': 'auto' }"
      :preview="false">
      <a-button type="primary" @click="onShowAdd">立即添加</a-button>
    </a-empty>
    <a-form v-if="!isAdd" autocomplete="off" :labelCol="{ span: 4 }" :wrapperCol="{ span: 15 }">
      <div class="py-3 pt-6">
        <a-form-item label="二维码名片" v-bind="modelRule.messenger">
          <CommonUpload v-if="!isEdit" v-model:fileList="modelRef.wechat" tip="二维码名片" :selectType="MaterFileType.IMG">
          </CommonUpload>
          <MediaImage v-if="isEdit" class="h-28" :src="modelRef.wechat[0]?.url" :preview="false" />
        </a-form-item>
        <a-form-item label="启用状态" v-bind="modelRule.status">
          <a-switch v-if="!isEdit" v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0"
            checked-children="是" un-checked-children="否" />
          <span v-if="isEdit">
            {{ modelRef.status ? '已启用' : '已禁用' }}
          </span>
        </a-form-item>
        <div class="flex justify-center space-x-4">
          <a-button v-if="isEdit" class="w-[100px]" type="primary" @click="isEdit = false" size="small">
            编辑
          </a-button>
          <a-button v-else class="w-[100px]" type="primary" @click="onSubmit" size="small">
            保存
          </a-button>
          <a-button class="w-[100px]" @click="onClear" size="small">
            {{ modelRef.id && isEdit ? '删除' : '取消' }}
          </a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-empty-image) {
  img {
    margin: auto;
    opacity: 0.5;
  }
}
</style>
