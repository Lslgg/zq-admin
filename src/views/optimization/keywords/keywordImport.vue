
<script setup lang='ts'>
import { API } from '@/api/apis'
import { TemplateCard } from '@/components/template'
import { ICustomRequest } from '@/util/customUpload'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { CloudDownloadOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
// 下载模板
const onDownloadTemplate = () => {
  // API 下载模板
  type Template = { template_name: string, template_url: string }
  API.config.getTemplateGet<Template>({ template_name: 'keyword_import' })
    .then(res => {
      if (res.data && res.data.template_url) {
        window.open(res.data.template_url)
      }
    })
}
// 导入关键词
const onUpload = (info: ICustomRequest) => {
  const { file } = info
  if (!file) return
  const ext = Utilts.ins().getFileExt(file.name)
  if (!ext || !['xlsx', 'xls'].includes(ext.toLocaleLowerCase())) {
    Utilts.ins().message('文件格不正确！', 'error')
    return
  }
  if (file.size > 1024 * 1024 * 5) {
    Utilts.ins().message('文件大小不能超过5M', 'error')
    return
  }
  // 文件转换成formdata
  const formData = new FormData()
  formData.append('file', file)
  formData.append('site_id', UseCommon.ins().siteId)
  // API 上传文件
  API.keyword.postKeywordImport<{
    fail: number,
    fail_info: string[],
    success: number,
    total: number
  }>(formData)
    .then(res => {
      if (res.data) {
        const info = res.data
        let tip: any = `共导入${info.total}总数, 成功${info.success}条`
        if (info.fail > 0) {
          const content = `${tip}, <br>失败${info.fail}条：<br>${info.fail_info.join('<br>')}`
          tip = createVNode('div', { class: 'bar', innerHTML: content }) // props []
        }
        Utilts.ins().confirm({
          content: tip, title: '导入结果', okText: '确定',
          okCallBack: () => {
            // UseCommon.ins().goUrlName('keywords')
          }
        })
      }
    })
}
// 跳转到关键词列表
const onPageKeywords = () => UseCommon.ins().goUrlName('keywords')
</script>

<template>
  <TemplateCard title="关键词导入">
    <template #subtitle>
      <a-button type="primary" size="small" @click="onPageKeywords">返回</a-button>
    </template>
    <div class="py-4">
      <div class="flex justify-between items-center bg-gray-50 px-10 py-2 mb-6 rounded-md">
        <div class="flex justify-start items-center space-x-3">
          <div>
            <span class="flex justify-center items-center rounded-full bg-primary h-8 w-8 text-white">1</span>
          </div>
          <div>
            <span>下载导入模板</span>
          </div>
        </div>
        <div>
          <a-button size="small" @click="onDownloadTemplate">下载模板</a-button>
        </div>
      </div>
      <div class="flex justify-between items-center bg-gray-50 px-10 py-2 rounded-md">
        <div class="flex justify-start items-center space-x-3">
          <div>
            <span class="flex justify-center items-center rounded-full bg-primary h-8 w-8 text-white">2</span>
          </div>
          <div class="flex flex-col">
            <span>支持上传xls、xlsx后缀的文件.</span>
            <span class="text-xs text-gray-999">备注：一次导入不可超过1000个关键词</span>
          </div>
        </div>
        <div>
          <a-upload name="file" :showUploadList="false" :customRequest="onUpload">
            <a-button class="flex justify-center items-center" size="small">
              <cloud-download-outlined />
              导入
            </a-button>
          </a-upload>
        </div>
      </div>
    </div>
  </TemplateCard>
</template>

<style lang='scss' scoped>
</style>
