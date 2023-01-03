import { IActiveCategroy, IVideo } from '@/api/api.model'
import { API } from '@/api/apis'
import router from '@/router'
import { CustomerValidate } from '@/util/customerValidate'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { RuleObject } from 'ant-design-vue/lib/form'
/**
 * 描述
 * @date 2022-03-11
 * @return {any}
 */
export class UseVideoForm extends UseFormService<IVideo> {
  /**
   * 描述
   * @date 2022-03-11
   * @param {IVideo} info
   * @return {IVideo}
   */
  async initForm(): Promise<IVideo> {
    let data: Partial<IVideo> = {}
    let categoryIds: number[] = []
    let seoKeyword: string[] = []
    if (this.id) {
      const res = await API.video.getVideoGet<IVideo>({ id: this.id })
      data = res.data
      if (data.active_in_category?.length) {
        categoryIds = data.active_in_category.map((item: IActiveCategroy) => item.category_id)
      }
      if (!data.front_cover?.id) data.front_cover = undefined
      if (!Array.isArray(data.seo_keyword) && data.seo_keyword) {
        seoKeyword = (data.seo_keyword as string)?.split(',').filter(item => item)
      }
    }
    const info = {
      site_id: UseCommon.ins().siteId,
      id: data.id ?? 0,
      summary: data.summary ?? '',
      revision: data.revision ?? 0,
      is_top: data.is_top ?? 0,
      category_ids: categoryIds,
      front_cover: data.front_cover,
      attachment_id: data.attachment_id ?? 0,
      path: data.path ?? '',
      seo_title: data.seo_title ?? '',
      seo_description: data.seo_description ?? '',
      seo_keyword: seoKeyword ?? [],
      sort_num: data.sort_num ?? 9999,
      title: data.title ?? '',
      video: data.video,
      status: data.status ?? 1,
      detail: data.detail || { data_type: 1, content: { detail: '' } },
    }
    return info
  }
  /**
   * 描述
   * @date 2022-03-11
   * @return {any}
   */
  createRule() {
    return {
      title: [...this.isRequiredAndMax(150, '标题')],
      content: [{ required: true, message: '请输入内容' }],
      video: [{ required: true, message: `请上传视频` }],
      category_ids: [{ required: true, message: '请选择视频分类' }],
      seo_title: [this.isMax(150, 'seo标题')],
      seo_description: [this.isMax(300, 'seo描述')],
      seo_keyword: [{ validator: this.validateKeyword, trigger: ['change', 'blur'] }]
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @param {any} info:any
   */
  async onSubmit(info: any) {
    const params = this.getSubmitParams(info)
    this.spining.value = true
    try {
      if (params.id) {
        await API.video.postVideoUpdate(params)
        Utilts.ins().message('编辑成功', 'success')
        this.goUrl('video', {})
      } else {
        await API.video.postVideoAdd(params)
        Utilts.ins().message('添加成功', 'success')
        this.goUrl('video', {})
      }
    } catch (_err) {
      this.spining.value = false
    }
    this.spining.value = false
  }
  /**
   * 提交参数
   * @date 2022-03-30
   * @param {any} info:any
   * @return {any}
   */
  getSubmitParams(info: IVideo) {
    const params: any = { ...info }
    if (Array.isArray(info.seo_keyword) && info.seo_keyword.length > 0) {
      params.seo_keyword = info.seo_keyword.filter((p: string) => !!p.trim()).map((p: string) => p.trim())
      params.seo_keyword = info.seo_keyword.join(',')
    } else params.seo_keyword = ''
    // 封面
    if (Array.isArray(info.front_cover) && info.front_cover.length > 0) params.front_cover = info.front_cover[0].id
    else if (info.front_cover && info.front_cover.id) params.front_cover = info.front_cover.id
    else if (Array.isArray(info.front_cover) && info.front_cover.length <= 0) params.front_cover = 0
    // 视频
    if (Array.isArray(params.video) && params.video.length > 0) params.attachment_id = params.video[0].id
    else if (params.video && params.video.id) params.attachment_id = params.video.id
    return params
  }
  /**
   * 取消，管理分类
   * @date 2022-03-17
   * @return {any}
   */
  useOtherForm() {
    const onClear = () => router.push({ name: 'video' })
    const onClassify = () => {
      router.push({ name: 'videoClassify', params: { type: 'video' } })
    }
    return {
      onClear,
      onClassify
    }
  }

  /**
   * seo_关键词验证
   * @date 2022-03-17
   * @param {any} _rule:RuleObject
   * @param {any} value:string
   * @return {any}
   */
  async validateKeyword(_rule: RuleObject, value: string[]): Promise<string> {
    return CustomerValidate.ins().validateKeyword(value, 3)
  }
}
