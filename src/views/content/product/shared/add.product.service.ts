import { UseCommon } from '@/util/useCommon'
import { API } from '@/api/apis'
import { ProductStore } from './product.store'
import { IProduct } from '@/api/api.model'
import { UseFormService } from '@/util/useFormService'
import { Ref } from 'vue'
import { RuleObject } from 'ant-design-vue/lib/form'
import { CustomerValidate } from '@/util/customerValidate'

export type SubmitParamsDataType = {
  submitParamsData: () => false | { param_id: number; value: string }[]
}
/**
 * 描述
 * @date 2022-03-11
 * @return {any}
 */
export class UseProductBaseForm extends UseFormService<Partial<IProduct>> {
  /**
   * 描述
   * @date 2022-03-14
   * @param {any} step:any
   */
  constructor() {
    super()
  }

  /**
   * 描述
   * @date 2022-03-11
   * @return {IProduct}
   */
  async initForm(): Promise<Partial<IProduct>> {
    const store = ProductStore.ins()
    const category_ids = store.product.category_ids ?? []
    const info: Partial<IProduct> = {
      category_ids: category_ids,
      title: '',
      img: [],
      video: [],
      summary: '',
      param: [],
      front_cover: undefined
    }
    if (store.showType === 'edit') {
      info.title = store.product.title
      info.img = store.product.img
      info.video = store.product.video
      info.summary = store.product.summary
      info.param = store.product.param
      info.front_cover = store.product.front_cover
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
      category_ids: [{ required: true, message: '请选择产品分类' }],
      title: [...this.isRequiredAndMax(150, '产品名称')],
      img: [{ required: true, message: '请上传产品图片' }],
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @param {any} info:any
   * @param {any} form:any
   */
  onSubmit(info: IProduct, form: Ref<SubmitParamsDataType>) {
    const data = form.value.submitParamsData()
    if (data) {
      info = { ...info, param: data }
      ProductStore.ins().product$.next(info)
      ProductStore.ins().step$.next(2)
    }
  }
}

/**
 * 描述
 * @date 2022-03-11
 * @return {any}
 */
export class UseProductSeoForm extends UseFormService<Partial<IProduct>> {
  /**
   * 描述
   * @date 2022-03-14
   * @param {any} step:Ref<number>
   */
  constructor() {
    super()
  }
  /**
   * 描述
   * @date 2022-03-11
   * @return {IProduct}
   */
  async initForm(): Promise<Partial<IProduct>> {
    const product = ProductStore.ins().product
    if (product.seo_keyword && typeof product.seo_keyword === 'string') {
      product.seo_keyword = product.seo_keyword?.split(',').filter(item => item)
      product.seo_keyword = product.seo_keyword.filter(p => p)
    }
    return {
      seo_title: product.seo_title ?? '',
      seo_description: product.seo_description ?? '',
      seo_keyword: product.seo_keyword || [],
      sort_num: product.sort_num ?? 9999,
      status: product.status ?? 0,
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @return {any}
   */
  createRule() {
    return {
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
  onSubmit(info: IProduct) {
    ProductStore.ins().product$.next(info)
    const product = ProductStore.ins().product
    product.img = product.img?.map((item) => item.id) as any
    product.video = product.video?.map((item) => item.id) as any
    if (Array.isArray(product.front_cover) && product.front_cover.length > 0) {
      product.front_cover = product.front_cover[0].id
    } else if (Array.isArray(product.front_cover) && product.front_cover.length === 0) {
      product.front_cover = 0
    }
    product.status = product.status ? 1 : 0
    if (Array.isArray(product.seo_keyword) && product.seo_keyword.length > 0) {
      product.seo_keyword = product.seo_keyword.filter(p => !!p.trim()).map(p => p.trim())
      product.seo_keyword = product.seo_keyword.join(',')
    } else if (Array.isArray(product.seo_keyword) && product.seo_keyword.length === 0) {
      product.seo_keyword = ''
    }
    // API 新增产品
    API.product
      .postProductAdd({ ...product, site_id: UseCommon.ins().siteId })
      .then((res) => {
        if (res.data) this.message('添加成功')
        this.goUrl('product')
      })
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
