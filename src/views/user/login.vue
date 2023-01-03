<script setup lang='ts'>
import { UseLoginForm } from './shared/useLogin.service'
const { modelRef, modelRule, onSubmit } = await new UseLoginForm().useForm()
</script>

<template>
  <div class=' flex justify-center items-center h-[100vh]'>
    <div class=" w-[720px] rounded-lg overflow-hidden bg-white">
      <a-row>
        <a-col :span="8">
          <div class="w-full h-full bg-[url('/images/mylogo/bg-login.png')] bg-center bg-no-repeat bg-cover">
            <div class="pt-20 text-center w-full">
              <MediaImage src="/images/mylogo/logo-white.svg" :width="150" />
            </div>
          </div>
        </a-col>
        <a-col :span="16">
          <div class="p-5">
            <h1 class="text-3xl text-center py-14 font-bold">登录</h1>
            <a-form layout="vertical" hideRequiredMark>
              <a-form-item label="账号" name="account" v-bind="modelRule.account">
                <a-input size="large" v-model:value="modelRef.account" @keyup.enter.native="onSubmit"></a-input>
              </a-form-item>
              <a-form-item label="密码" name="password" v-bind="modelRule.password">
                <a-input-password size="large" v-model:value="modelRef.password" @keyup.enter.native="onSubmit">
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <a-button @click="onSubmit" @keyup.enter.native="onSubmit" size="large"
                  class="bg-red-700 border-red-700 text-white hover:bg-red-500 hover:border-red-500 focus:bg-red-500 focus:border-red-500"
                  block>登录</a-button>
              </a-form-item>
              <div class="border-b w-full my-5"></div>
              <a-form-item class="text-center">
                <a-checkbox v-model:checked="modelRef.keep">下次自动登录</a-checkbox>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
