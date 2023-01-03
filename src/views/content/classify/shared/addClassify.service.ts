import { IClassifyForm } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { computed, ExtractPropTypes, PropType, Ref, ref } from 'vue'

type ClassIfyProps = Readonly<ExtractPropTypes<{
  visible: BooleanConstructor
  type: NumberConstructor
  category: {
    type: PropType<Partial<IClassifyForm>>
    default: () => void
  }
}>>
type ClassifyEmit = (event: 'update:visible' | 'update:pid' | 'onOk', ...args: any[]) => void
/**
 * 分类表单操作
 */
export class UseClassifyForm extends UseFormService<IClassifyForm> {
  porps: ClassIfyProps
  emit: ClassifyEmit
  confirmLoading = ref<Boolean>(false)
  /**
   * 描述
   * @date 2022-03-26
   * @param {ClassIfyProps} porps: ClassIfyProps
   * @param {ClassifyEmit} emit: ClassifyEmit
   * @param {boolean} confirmLoading: boolean
   */
  constructor(porps: ClassIfyProps, emit: ClassifyEmit, confirmLoading: Ref<boolean>) {
    super()
    this.porps = porps
    this.emit = emit
    this.confirmLoading = confirmLoading
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<IClassifyForm> {
    const { myCategory } = this.useMyProps()
    return {
      site_id: UseCommon.ins().siteId ?? 0,
      category_type: myCategory.value.category_type ?? 0,
      category_name: myCategory.value.category_name ?? '',
      pid: myCategory.value.pid ?? 0,
      id: myCategory.value.id ?? 0,
      status: 1,
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
      category_name: [...this.isRequiredAndMax(100, '分类名称')],
      category_type: [this.isRequired('上级分类')],
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @param {IClassifyForm} info
   * @param {ITree} pItem
   */
  async onSubmit(info: IClassifyForm, pItem: Ref<ITree>) {
    const pItemInfo = pItem.value
    if (pItemInfo.level === 4) {
      this.message('只能添加三级分类', 'warn')
      return
    } else if (info.id !== 0 && info.id === info.pid) {
      this.message('父类不能为自己!', 'warn')
      return
    }
    const { myVisible } = this.useMyProps()
    this.confirmLoading.value = true
    try {
      if (info.id) {
        await API.category.postCategoryUpdate(info) // 编辑
        Utilts.ins().message('编辑成功', 'success')
      } else {
        await API.category.postCategoryAdd(info) // 新增
        Utilts.ins().message('新增成功', 'success')
      }
    } catch (error) {
      this.confirmLoading.value = false
      myVisible.value = false
      this.emit('onOk')
    }
    this.confirmLoading.value = false
    myVisible.value = false
    this.emit('onOk')
  }
  /**
   * 描述
   * @date 2022-03-30
   * @return {any}
   */
  useMyProps() {
    const self = this
    const myVisible = computed<boolean>({
      get() {
        return self.porps.visible
      },
      set(val) {
        self.emit('update:visible', val)
      }
    })
    const myCategory = computed<Partial<IClassifyForm>>({
      get() {
        return self.porps.category
      },
      set(val: Partial<IClassifyForm>) {
        self.emit('update:pid', val)
      }
    })
    return { myVisible, myCategory }
  }
}
