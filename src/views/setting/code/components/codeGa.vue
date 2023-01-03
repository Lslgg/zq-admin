<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { UseGaForm } from '../shared/useCodeGa.service'
import { CodeMirror } from '@/components/codemirror'
import { ref } from 'vue'
const { modelRef, modelRule, onSubmit } = await new UseGaForm().useForm()
const visible = ref(false)
const onShowModal = (e: any) => {
  visible.value = true
}
const visible2 = ref(false)
const onShowModal2 = (e: any) => {
  visible2.value = true
}
</script>

<template>
  <div class>
    <a-form autocomplete="off" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }">
      <TemplateCard title="Google Analytics 跟踪代码" :hideTopRound="true">
        <div class="py-3">
          <a-form-item label="跟踪代码" v-bind="modelRule.ga_code">
            <CodeMirror v-model:code="modelRef.ga_code" :maxNum="500" mode="htmlmixed"></CodeMirror>
            <template #extra>
              <span>提示：复制并保存Google Analytics 跟踪代码后，才能获取网站流量等的实时数据。</span>
              <a @click="onShowModal" class="text-primary ml-4">如何获取？</a>
            </template>
          </a-form-item>
        </div>
      </TemplateCard>
      <TemplateCard title="Google Analytics 帐号绑定" class="mt-3">
        <div class="py-3">
          <a-form-item label="媒体资源 ID" v-bind="modelRule.media_id">
            <a-input v-model:value="modelRef.media_id" placeholder="请输入媒体资源ID" :showCount="true" :maxlength="150">
            </a-input>
            <template #extra>
              <span>通过站点的Google Analytics媒体资源ID，才能获取网站流量报表数据，如 268668411。</span>
              <a @click="onShowModal2" class="text-primary ml-4">如何获取？</a>
            </template>
          </a-form-item>
        </div>
      </TemplateCard>
      <div class="mt-5 flex justify-center">
        <a-button class="w-[100px]" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </a-form>
    <a-modal class="min-w-[760px] !max-w-[960px]" width="80%" v-model:visible="visible" title="获取Google Analytics跟踪代码" :footer="null">
      <div class="max-h-[60vh] overflow-auto">
        <div class="bg-blue-100 text-opacity-50 p-2 my-4 rounded-sm">
          登录Google Analytics，打开【管理】-【数据流】-【网站】，点击网站地址，弹出网站数据流详情弹层页面，找到”代码添加说明“模块内的全局网站代码（gtag.js）的跟踪代码，点击右侧复制按钮复制全局网站代码。
        </div>
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/gaCode1.png" :preview="false" />
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/gaCode2.png" :preview="false" />
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/gaCode3.png" :preview="false" />
      </div>
    </a-modal>
    <a-modal class="min-w-[760px] !max-w-[960px]" width="80%" v-model:visible="visible2" title="获取媒体资源ID" :footer="null">
      <div class="max-h-[60vh] overflow-auto">
        <div class="bg-blue-100 text-opacity-50 p-2 my-4 rounded-sm">
          登录Google Analytics，打开【管理】-【媒体资源设置】，复制右侧媒体资源ID
        </div>
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/gaCodeId2.png"
          :preview="false" />
        <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/gaCodeId2.png"
          :preview="false" />
      </div>
    </a-modal>
  </div>
</template>

<style lang='scss' scoped>
</style>
