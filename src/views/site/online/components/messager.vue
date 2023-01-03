
<script setup lang='ts'>
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { ref } from 'vue'
import { MessagerService } from '../shared/messager.service'
const isEdit = ref(true)
const messagerService = new MessagerService()
const { modelRef, modelRule, onSubmit } = await messagerService.useForm(isEdit)
const visible = ref(false)
const isAdd = ref(false)
isEdit.value = !isAdd.value
isAdd.value = modelRef.id ? false : true
const onShowAdd = () => {
  isAdd.value = false
  isEdit.value = false
}
const onShowTips = () => visible.value = true
// 取消添加Messager
const onClear = () => {
  // 未保存时取消
  if (!modelRef.id) {
    isEdit.value = false
    isAdd.value = true
    return
  }
  // 有数据时取消
  if (modelRef.id && !isEdit.value) {
    messagerService.initForm().then(data => Object.assign(modelRef, data))
    isEdit.value = true
    return
  }
  Utilts.ins().confirm({
    title: '提示',
    content: '确定要删除Messager吗？',
    okCallBack: () => {
      API.site.postSiteConfigDelete({ site_id: UseCommon.ins().siteId, ids: [modelRef.id] })
        .then(res => {
          isEdit.value = false
          modelRef.id = 0
          modelRef.messenger = ''
          isAdd.value = true
        })
    }
  })
}
</script>

<template>
  <div class='messages min-h-[420px]'>
    <div class="flex items-center justify-between">
      <div>
        <span class="flex items-center justify-between space-x-4">
          <span class="text-xl leading-none text-green-600">
            <MediaImage class="h-10" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/Messenge.png"
              :preview="false" />
          </span>
          <span>
            添加你的Messenger链接，会让客户前往到你的Facebook公共主页与你进行在线聊天。
          </span>
        </span>
      </div>
      <div>
        <a class="text-green-500 px-2" @click="onShowTips">查看链接获取方法</a>
      </div>
    </div>
    <a-empty v-if="isAdd" class="p-8" :description="null" :preview="false"
      image="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/Messenge.png" :imageStyle="{ 'margin': 'auto' }">
      <a-button type="primary" @click="onShowAdd">立即添加</a-button>
    </a-empty>
    <a-form v-else autocomplete="off" :labelCol="{ span: 4 }" :wrapperCol="{ span: 15 }">
      <div class="py-3 pt-6">
        <a-form-item label="Messenger 链接" v-bind="modelRule.messenger">
          <a-input v-if="!isEdit" v-model:value="modelRef.messenger" :maxlength="100" placeholder="请输入Messenger链接"
            :showCount="true" />
          <span v-else>{{ modelRef.messenger }}</span>
        </a-form-item>
        <a-form-item label="启用状态" v-bind="modelRule.status">
          <a-switch v-if="!isEdit" v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0"
            checked-children="是" un-checked-children="否" />
          <span v-else>
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
    <a-modal class="min-w-[760px] !max-w-[960px]" width="80%" v-model:visible="visible" title="获取方法" :footer="null">
      <div class="max-h-[60vh] overflow-auto">
        <div class="bg-blue-100 text-opacity-50 p-2 my-4 rounded-sm">
          1. 登录Facebook，并创建主页 https://www.facebook.com/pages/creation (若已有主页，请忽略此步）
        </div>
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/facebookMessenger.png"
          :preview="false" />
        <div class="bg-blue-100  text-opacity-50 p-2 my-4 rounded-sm">
          2. 进入主页，点击“设置”
        </div>
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/facebookMessenger22.png"
          :preview="false" />
        <div class="bg-blue-100  text-opacity-50 p-2 my-4 rounded-sm">
          3. 进入“消息”，点击“你的Messenger网址”复制链接
        </div>
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/facebookMessenger3.png"
          :preview="false" />
      </div>
    </a-modal>
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
