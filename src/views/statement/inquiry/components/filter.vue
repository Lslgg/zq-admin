<script setup lang='ts'>
import { InquirtFilterForm } from '../shared/useFilter.service'
const { modelRef, onSubmit } = await new InquirtFilterForm().useForm()
</script>

<template>
  <div class="bg-white p-5">
    <div class="bg-gray-100 py-3 px-6">
      <p class="leading-relaxed text-green-500">提示：设置垃圾询盘的过滤规则，可以助您屏蔽一些广告邮件、钓鱼邮件及无用的垃圾信息。</p>
    </div>
    <div class="inquiry-form py-3">
      <a-form autocomplete="off" layout="vertical">
        <a-form-item name="isOpen" label="是否启用过滤">
          <a-switch v-model:checked="modelRef.status" :checkedValue="1" :unCheckedValue="0" />
          <span
            class="pl-3 align-bottom text-gray-999 text-xs"
          >即使你不启用自定义的过滤规则，系统也有一套垃圾询盘的过滤机制，有可能部分信息被系统自动过滤</span>
        </a-form-item>
        <a-form-item name="email" label="邮箱黑名单" extra="请输入邮箱地址、邮箱后缀（支持添加多个，按回车键一行一个）">
          <a-textarea
            v-model:value="modelRef.filter_email"
            placeholder="请输入邮箱地址或邮箱后缀"
            :autoSize="{ minRows: 5 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item name="key" label="关键词黑名单" extra="请输入关键词（支持添加多个，按回车键一行一个）">
          <a-textarea
            v-model:value="modelRef.filter_keyword"
            placeholder="请输入关键词，每个关键词少于150字符"
            :autoSize="{ minRows: 5 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item name="ip" label="设置您不希望收到的IP地址或IP段" extra="IP段如：192.168.（支持添加多个，按回车键一行一个）">
          <a-textarea
            v-model:value="modelRef.filter_ip"
            placeholder="设置您不希望收到的IP地址或IP段"
            :autoSize="{ minRows: 5 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item class="text-center">
          <a-button type="primary" @click="onSubmit" size="small">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
