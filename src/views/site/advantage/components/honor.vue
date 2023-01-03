<script setup lang='ts'>
import { HonorOperationService, UseHonorPagationService } from '../shared/useHonor.service'
import { TemplateCard } from '@/components/template'
import { CommonModal, CommonUpload } from '@/components/common'
const { paging, getPatationList } = new UseHonorPagationService().usePagin()
const { visible, form, formRef, add, edit, del, submit } = new HonorOperationService(paging, getPatationList).useOperation()
</script>

<template>
  <div class='site-honor'>
    <TemplateCard :soltTitle="true" :hideTopRound="true">
      <template #title>
        <div class=" text-sm">商业交易都是源于信任，塑造网站的公信力让访问的客户相信我们，网站实力展示方面资质证书与荣誉证书是最有公信力的证明，能提高对公司及产品的信任。</div>
      </template>
      <template #subtitle>
        <a-button type="primary" @click="add">
          +添加
        </a-button>
      </template>
      <div class="base-table">
        <a-table
          :dataSource="paging.dataSource"
          :columns="paging.columns"
          :pagination="paging.pagination"
          :loading="paging.loading"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <MediaImage :src="record.image" :width="100" />
            </template>
            <template v-if="column.key === 'action'">
              <div class=" flex items-center">
                <a-button type="link" @click="edit(record.id)">编辑</a-button>
                <a-button type="link" @click="del(record.id)">删除</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </TemplateCard>
    <CommonModal v-model:visible="visible" title="添加资质荣誉" :isAutoClose="false" @ok="submit">
      <a-form :model="form" name="form" ref="formRef" autocomplete="off" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-form-item label="证书名称" name="name" :rules="[{ required: true, trigger: ['change', 'blur'], message: '内容不能为空' }]">
          <a-input v-model:value="form.name" placeholder="请输入资质与荣誉证书的名称" />
        </a-form-item>
        <a-form-item label="发证机构" name="agency">
          <a-input v-model:value="form.agency" placeholder="请输入发证机构名称" />
        </a-form-item>
        <a-form-item name="image" label="证书图片" :rules="[{ required: false, message: '请上传证书图片' }]" >
          <CommonUpload v-model:fileList="form.image" tip="只支持扩展名： .png，.jpg, .jpeg，.gif，.svg..." direction="horizontal"></CommonUpload>
        </a-form-item>
      </a-form>
    </CommonModal>
  </div>
</template>

<style lang='scss' scoped>
</style>
