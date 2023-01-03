import { IProduct } from '@/api/api.model'
import SingleClass from '@/util/singleClass'
import { Subject } from 'rxjs'
import { ref } from 'vue'
/**
 * 描述
 * @date 2022-03-29
 */
export class ProductStore extends SingleClass {
  product$ = new Subject<Partial<IProduct>>()
  category_ids$ = new Subject<number[]>()
  step$ = new Subject<number>()
  paramsNameStr$ = new Subject<string>()
  product: Partial<IProduct> = {}
  paramsNameStr = ref<String>('')
  step = ref<number>(0)
  showType: 'add' | 'edit' = 'add'
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): ProductStore {
    return super.ins() as ProductStore
  }

  /**
   * 描述
   * @date 2022-03-29
   */
  init() {
    // 设置产品值
    this.product$.subscribe((info: Partial<IProduct>) => {
      this.product = { ...this.product, ...info }
    })
    this.step$.subscribe((step: number) => {
      this.step.value = step
    })
    this.paramsNameStr$.subscribe((paramsNameStr: string) => {
      this.paramsNameStr.value = paramsNameStr
    })
  }
}
