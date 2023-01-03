import { IProduct } from '@/api/api.model'
import { ProductStore } from './product.store'
import { useRoute } from 'vue-router'
import { API } from '@/api/apis'
import { Utilts } from '@/util/utilts'
import { UseCommon } from '@/util/useCommon'
export type SubmitParamsDataType = {
  submitParamsData: () => { param_id: number; value: string }[] | false
}

/**
 * 编辑产品
 * @date 2022-03-11
 * @return {any}
 */
export class EditProductService {
  id = 0
  /**
   * 构造方法
   * @date 2022-03-14
   */
  constructor() {
    const route = useRoute()
    this.id = +(route.params.id ?? '0')
  }

  /**
   * 获取产品信息
   * @date 2022-03-11
   */
  async setProduct() {
    const res = await API.product.getProductGet<IProduct>({ id: this.id })
    const product = res.data
    product.category_ids =
      product.active_in_category?.map((p) => p.category_id) ?? []
    const info = {
      id: product.id,
      category_ids: product.category_ids,
      detail: product.detail,
      img: product.img ?? [],
      status: product.status,
      param: product.param,
      path: product.path,
      seo_description: product.seo_description,
      seo_keyword: product.seo_keyword,
      seo_title: product.seo_title,
      site_id: product.site_id,
      sort_num: product.sort_num,
      summary: product.summary,
      title: product.title,
      video: product.video ?? [],
      front_cover: product.front_cover,
      product_param: product.product_param ?? [],
    }
    const paramsNameStr =
      product.active_in_category?.map((p) => p.category_name).join(',') ?? ''
    ProductStore.ins().product$.next(info)
    ProductStore.ins().paramsNameStr$.next(paramsNameStr)
    ProductStore.ins().category_ids$.next(product.category_ids)
  }
  /**
   * baseRef
   * @date 2022-03-11
   * @param {any} baseRef:any
   * @param {any} detailRef:any
   * @param {any} seoRef:any
   */
  async onSubmit(baseRef: any, detailRef: any, seoRef: any) {
    if (baseRef.value.onBaseSubmit) {
      try {
        const isTrue1 = await baseRef.value.onBaseSubmit()
        const isTrue2 = await detailRef.value.onDetailSubmit()
        const isTrue3 = await seoRef.value.onSeoSubmit()
        if (!(isTrue1 && isTrue2 && isTrue3)) return
        const product = ProductStore.ins().product
        product.status = product.status ? 1 : 0
        delete product.active_in_category
        delete product.product_param
        console.log(1, product)
        // 修改产品
        API.product.postProductUpdate(product).then((res) => {
          if (res.data) {
            Utilts.ins().message('修改成功')
            UseCommon.ins().goUrlName('product')
          }
        })
      } catch (error) {
        Utilts.ins().message(JSON.stringify(error), 'error')
      }
    }
  }
}
