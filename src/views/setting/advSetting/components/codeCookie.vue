<script setup lang='ts'>
import { CookieService } from '../shared/cookie.service'
const { modelRef, modelRule, onSubmit } = await new CookieService().useForm()
</script>

<template>
  <TemplateCard title="">
    <div class="py-3">
      <div class="flex justify-between pb-4">
        <span>
          网站会使用 cookies 收集客户信息，如果您想要开发欧盟国家的客户，根据欧盟的数据保护条例和隐私指令规定建议您开启声明，您可以自定义设置声明提示语。
        </span>
      </div>
      <a-form class="code_cookie" autocomplete="off" :label-col="{ span: 2 }">
        <a-form-item label="启用状态" v-bind="modelRule.messenger" class="flex-1">
          <div class="flex flex-start items-center space-x-4">
            <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" checked-children="是"
              un-checked-children="否" />
            <span class="gray-999 text-xs">启用后将会在网页底部显示cookie声明，需要用户点击“Accept”才关闭。</span>
          </div>
        </a-form-item>
        <a-form-item label="声明提示语" v-bind="modelRule.cookie_state" class="flex-1">
          <a-textarea class="h-36" v-model:value="modelRef.cookie_state" :showCount="true" :maxlength="500">
          </a-textarea>
        </a-form-item>
      </a-form>
      <div class="flex justify-center">
        <a-button class="w-[100px]" type="primary" @click="onSubmit" size="small">保存</a-button>
      </div>
    </div>
  </TemplateCard>
</template>


<style lang='scss' scoped>
.code_cookie {
  :deep(.ant-form-item-label) {
    min-width: 140px;
  }
}
</style>
