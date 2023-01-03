import { IArticle, } from '@/api/api.model'
import { API } from '@/api/apis'
import { CustomerValidate } from '@/util/customerValidate'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { RuleObject } from 'ant-design-vue/lib/form'
import dayjs from 'dayjs'
/**
 * UseMyForm
 * @date 2022-03-11
 * @return {any}
 */
export class UseMyForm extends UseFormService<IArticle> {
  /**
   * initForm
   * @date 2022-03-11
   * @return {IArticle}
   */
  async initForm(): Promise<IArticle> {
    let data: Partial<IArticle> = {}
    let categoryIds: number[] = []
    let seoKeyword: string[] = []
    if (this.id) {
      const res = await API.article.getArticleGet<IArticle>({ id: this.id, site_id: UseCommon.ins().siteId })
      data = res.data
      if (data.active_in_category?.length) {
        categoryIds = data.active_in_category?.map((item) => item.category_id) ?? []
      }
      if (!Array.isArray(data.seo_keyword) && data.seo_keyword) {
        seoKeyword = (data.seo_keyword as string)?.split(',').filter(item => item)
      }
    }
    const info = {
      site_id: UseCommon.ins().siteId,
      id: data.id ?? 0,
      is_top: data.is_top ?? 0,
      title: data.title ?? '',
      summary: data.summary ?? '',
      category_ids: categoryIds,
      detail: data.detail || { data_type: 1, content: { detail: '' } },
      seo_title: data.seo_title ?? '',
      seo_description: data.seo_description ?? '',
      seo_keyword: seoKeyword || [],
      show_date: dayjs(data.show_date || new Date()),
      sort_num: data.sort_num ?? 9999,
      status: data.status ?? 1,
      front_cover: data.front_cover
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
      category_ids: [{ required: true, message: '请选择文章分类' }],
      front_cover: [{ required: true, message: '请选择封面图' }],
      seo_title: [this.isMax(150, 'seo标题')],
      seo_description: [this.isMax(300, 'seo描述')],
      show_date: [this.isRequired('网站显示日期')],
      seo_keyword: [{ validator: this.validateKeyword, trigger: ['change', 'blur'] }]
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @param {IArticle} info:IArticle
   */
  async onSubmit(info: IArticle) {
    const params = this.getSubmitParams(info)
    this.spining.value = true
    try {
      if (params.id) {
        await API.article.postArticleUpdate(params)
        Utilts.ins().message('编辑成功', 'success')
        this.goUrl('article', {})
      } else {
        await API.article.postArticleAdd(params)
        Utilts.ins().message('添加成功', 'success')
        this.goUrl('article', {})
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
  getSubmitParams(info: any): IArticle {
    const params: any = { ...info }
    params.is_google_include = info.is_google_include || 0
    params.infocategory_ids = info.category_ids || []
    if (Array.isArray(info.seo_keyword) && info.seo_keyword.length > 0) {
      params.seo_keyword = info.seo_keyword.filter((p: string) => !!p.trim()).map((p: string) => p.trim())
      params.seo_keyword = info.seo_keyword.join(',')
    } else params.seo_keyword = ''
    if (!(typeof info.show_date === 'string')) {
      params.show_date = info.show_date.format('YYYY-MM-DD') || ''
    }
    if (Array.isArray(info.front_cover) && info.front_cover.length > 0) {
      params.front_cover = info.front_cover[0].id
    } else if (info.front_cover && info.front_cover.id) {
      params.front_cover = info.front_cover.id
    }
    return params
  }
  /**
  * 取消，管理分类
  * @date 2022-03-17
  * @return {any}
  */
  useOtherForm() {
    return {
      onClear: () => this.goUrl('article', {}),
      onClassify: () => this.goUrl('articleClassify', { type: 'article' }, '_blank')
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
