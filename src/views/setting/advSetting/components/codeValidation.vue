<script setup lang='ts'>
import { TemplateCard } from '@/components/template'
import { CodeMirror } from '@/components/codemirror'
import { CodeValidationService } from '../shared/codeValidation.service'
import { ref } from 'vue'
const { modelRef, modelRule, onSubmit } = await new CodeValidationService().useForm()
const visible = ref(false)
const onShowModal = () => visible.value = true
</script>

<template>
  <TemplateCard title="">
    <div class="py-3">
      <div class="flex justify-between pb-4">
        <div>
          <span>登录搜索引擎站长工具获取"meta"标记内容粘贴到此处进行验证，验证成功后获得相应的工具权限。</span>
        </div>
        <div>
          <a @click="onShowModal" class="text-green-500 px-2">如何获取meta标记内容</a>
        </div>
      </div>
      <a-form autocomplete="off" class="flex justify-between space-x-2">
        <a-form-item label="验证内容" v-bind="modelRule.search_engine_validation" class="flex-1">
          <CodeMirror v-model:code="modelRef.search_engine_validation" mode="css" height="320" :maxNum="3000">
          </CodeMirror>
        </a-form-item>
      </a-form>
      <div class="flex justify-center">
        <a-button class="w-[100px]" type="primary" @click="onSubmit" size="small">保存</a-button>
      </div>
    </div>
    <a-modal class="min-w-[760px] !max-w-[960px]" width="80%" v-model:visible="visible" title="如何获取meta标记内容"
      :footer="null">
      <div class="max-h-[60vh] overflow-auto p-2">
        <div class="bg-blue-100 text-opacity-50 p-2 my-4 rounded-sm">
          以Google为例，登录Google Search Console官网上有详细的Search Console 培训视频 ，您可以点击下图到YouTube观看官方教学视频。
        </div>
        <div class="text-center">
          <a href="https://www.youtube.com/watch?v=N4PmE3LysUM&list=PLKoqnv2vTMUOnQn-lNDfT38X9gA_CHxTo&index=9"
            target="_blank">
            <MediaImage width="320px" :preview="false"
              src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover.png" />
          </a>
        </div>
        <div class="bg-blue-100  text-opacity-50 p-2 my-4 rounded-sm">
          根据官方视频，获取Google 验证的
          "meta"标记的重点流程截图如下，并请留意图片上的鼠标光标、指针及字幕：
        </div>
        <div class="text-center">
          <MediaImage width="100%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover1.png"
            :preview="false" />
        </div>
        <div class="text-center">
          <MediaImage width="90%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover2.png"
            :preview="false" />
        </div>
        <div class="text-center">
          <MediaImage width="90%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover3.png"
            :preview="false" />
        </div>
        <div class="text-center">
          <MediaImage width="90%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover4.png"
            :preview="false" />
        </div>
        <div class="text-center">
          <MediaImage width="90%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover5.png"
            :preview="false" />
        </div>
        <div class="text-center">
          <MediaImage width="90%" src="//xxxxxx-www.oss-cn-shenzhen.aliyuncs.com/admin/advSetting_popover6.png"
            :preview="false" />
        </div>
        <div class="bg-blue-100 text-opacity-50 p-2 my-4 rounded-sm">
          复制这个"mata"标记的内容，并复制到验证内容文本框内即可。
        </div>
      </div>
    </a-modal>
  </TemplateCard>
</template>

<style lang='scss' scoped>
</style>
