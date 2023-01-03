
<script setup lang='ts'>
import { API } from '@/api/apis'
import { ContryCodeList } from '@/util/countrycode'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { ref } from 'vue'
import { WhatsappService } from '../shared/whatsapp.service'
const isEdit = ref(true)
const whatsApp = new WhatsappService()
const { modelRef, modelRule, onSubmit } = await whatsApp.useForm(isEdit)
const contryCodeList = ContryCodeList
const isAdd = ref(false)
isEdit.value = !isAdd.value
isAdd.value = modelRef.id ? false : true
const onShowAdd = () => {
  isAdd.value = false
  isEdit.value = false
}
const onClear = () => {
  // 未保存取消
  if (!modelRef.id) {
    isEdit.value = false
    isAdd.value = true
    return
  }
  // 保存有数据取消
  if (modelRef.id && !isEdit.value) {
    whatsApp.initForm().then(data => Object.assign(modelRef, data))
    isEdit.value = true
    return
  }
  Utilts.ins().confirm({
    title: '提示',
    content: '确定要删除Whatsapp吗？',
    okCallBack: () => {
      API.site.postSiteConfigDelete({ site_id: UseCommon.ins().siteId, ids: [modelRef.id] })
        .then(res => {
          isEdit.value = false
          modelRef.id = 0
          isAdd.value = true
          modelRef.global_roaming = '中国+86'
          modelRef.mobile = ''
          modelRef.welcome_word = ''
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
          <MediaImage class="h-10" src="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/WhatsApp.svg"
            :preview="false" />
        </span>
        <span>
          添加你的WhatsApp 帐号，客户可在网站与您发起即时聊天。
        </span>
      </span>
    </div>
    <a-empty v-if="isAdd" class="p-8" :description="null" :preview="false"
      image="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/WhatsApp.svg" :imageStyle="{ 'margin': 'auto' }">
      <a-button type="primary" @click="onShowAdd">立即添加</a-button>
    </a-empty>
    <div v-else class="flex flex-start overflow-x-auto">
      <div class="flex-1 min-w-[650px]">
        <a-form class="flex-1" autocomplete="off" :labelCol="{ span: 4 }" :wrapperCol="{ span: 15 }">
          <div class="py-3 pt-6">
            <a-form-item label="WhatsApp号码" v-bind="modelRule.global_roaming">
              <div class="flex justify-start items-center space-x-2">
                <a-select show-search v-if="!isEdit" size="large" class="min-w-[240px] max-w-[240px]"
                  v-model:value="modelRef.global_roaming">
                  <a-select-option v-for="(item, index) in contryCodeList" :key="index"
                    :value="`${item.cn}${item.phone_code}`">
                    {{ `${item.cn}${item.phone_code}` }}
                  </a-select-option>
                </a-select>
                <a-input v-if="!isEdit" v-model:value="modelRef.mobile" :maxlength="11" placeholder="请输入Whatsapp注册的手机号码"
                  :showCount="true" />
                <span v-if="isEdit">
                  {{ whatsApp.getRoaming(modelRef.global_roaming) }} {{ modelRef.mobile }}
                </span>
              </div>
            </a-form-item>
            <a-form-item label="欢迎语" v-bind="modelRule.global_roaming">
              <a-textarea v-if="!isEdit" :maxlength="500" show-count v-model:value="modelRef.welcome_word"
                placeholder="请输入欢迎语最大字符500" />
              <span v-if="isEdit">{{ modelRef.welcome_word }}</span>
            </a-form-item>
            <a-form-item label="启用状态" v-bind="modelRule.messenger">
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
      <div v-if="isEdit" class="flex-none p-2 w-96">
        <div class="flex flex-start items-center p-3 bg-[#1ebea4] text-white rounded-tl-md rounded-tr-md">
          <MediaImage class="h-6" src="https://xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/WhatsApp.svg"
            :preview="false" />
          <span>Shared on WhatsApp</span>
        </div>
        <div class="flex flex-col text-center items-center h-32 justify-center border border-b-0 space-y-3">
          <div class="text-gray-400"> Chat on WhatsApp with </div>
          <div class="font-bold">【{{ whatsApp.getRoaming(modelRef.global_roaming) }}】【{{ modelRef.mobile }}】</div>
          <div class=" bg-primary p-2 rounded-md text-white">
            Continue to Chat
          </div>
        </div>
        <div class="bg-[#edf7f4] p-2 border rounded-bl-md rounded-br-md">
          【{{ modelRef.welcome_word }}】
        </div>
      </div>
    </div>
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
