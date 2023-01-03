import { IAttachment, IProductParam, SettingInfo } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'
import { ref } from 'vue'
import { ProductStore } from './product.store'

// 处理的所有的数据集合
type CollectList = {
  id: number
  type: number
  name: string
  // 文本值,用数组来存储，因为可以动态添加多个
  textValue: { text: string }[]
  radioVale: string // 单选值
  // checked主要用于多选，因为用Checkbox Group添加素才图片时会有bug,点击图片，checkbox没有选中
  option: { checked: boolean; text: string; img: IAttachment[] }[]
  isAllowImg: number | boolean
  isRequire: number | boolean
}

/**
 * ProductParamsService
 */
export class ProductParamsService {
  collectList = ref<CollectList[]>([])
  /**
   * constructor
   */
  constructor() {}

  /**
   * 初始化数据,监听修改类别
   * 如果有修改类型得新加载数据
   * 如果是修改,第一次直接加载数据
   * 同时也监听修改类别
   */
  async init() {
    if (ProductStore.ins().showType === 'edit') {
      await this.initData()
    }
    ProductStore.ins().category_ids$.subscribe(async (ids: number[]) => {
      ProductStore.ins().product.category_ids = ids
      await this.initData()
    })
  }
  /**
   * useData
   * @return {any}
   */
  async useData() {
    // 父组件调用的提交数据方法
    const submitParamsData = () => {
      if (!checkForm()) return false
      // 过滤数据
      const param = this.getSaveData()
      ProductStore.ins().product$.next({ param })
      return param
    }
    // 添加文本值
    const onAddText = (textValue: { text: string }[]) => {
      textValue.push({ text: '' })
    }
    // 删除文本值
    const onDeleteText = (textValue: { text: string }[], index: number) => {
      // 保留一个
      if (textValue.length <= 1) return
      textValue.splice(index, 1)
    }
    // 检查数据完整性
    const checkForm = () => {
      let isOk = true
      this.collectList.value.forEach((item) => {
        // 根据isRequire判断是否必填
        if (item.isRequire) {
          if (item.type === 1) {
            // 如果是文本值，则判断是否有值
            if (item.textValue.length === 0) {
              Utilts.ins().message(`请填写产品参数${item.name}`, 'warn')
              isOk = false
            } else {
              // 如果是文本值，则判断text是否有值
              item.textValue.forEach((v) => {
                if (!v.text) {
                  Utilts.ins().message(`请填写产品参数${item.name}`, 'warn')
                  isOk = false
                  return
                }
              })
            }
          } else if (item.type === 2 && item.radioVale === '') {
            Utilts.ins().message(`请选择产品参数${item.name}`, 'warn')
            isOk = false
          } else if (item.type === 3) {
            const checkList = item.option.filter((v) => v.checked)
            if (checkList.length === 0) {
              Utilts.ins().message(`请选择产品参数${item.name}`, 'warn')
              isOk = false
            } else if (item.isAllowImg && item.isRequire) {
              const isHasImg = checkList.some((p) => p.img.length === 0)
              if (isHasImg) {
                Utilts.ins().message(`请上传产品参数${item.name}图片`, 'warn')
                isOk = false
              }
            }
          }
        }
      })
      return isOk
    }
    return {
      collectList: this.collectList,
      submitParamsData,
      onAddText,
      onDeleteText,
      checkForm,
    }
  }

  /**
   * 获取要保存的数据[{param_id: number, param_value: string}]
   * @return {any}
   */
  private getSaveData() {
    const list = this.collectList.value
    const param: { param_id: number; value: any }[] = []
    list.filter((item) => {
      const param_id = item.id
      let value: { text: string; img?: number }[] = []
      if (item.type === 1) {
        value = item.textValue
      } else if (item.type === 2) {
        value = [{ text: item.radioVale }]
      } else if (item.type === 3) {
        value = item.option
          .filter((v) => v.checked)
          .map((v) => ({
            text: v.text,
            img: v.img && v.img.length > 0 ? v.img[0].id : undefined,
          }))
      }
      param.push({ param_id, value: value })
    })
    return param
  }

  /**
   * 初始化数据
   */
  private async initData() {
    const productParams = ProductStore.ins().product.product_param ?? []
    // API 获取产品所需参数
    const resData = await API.product.getProductGetparam<IProductParam[]>({
      site_id: UseCommon.ins().siteId,
      category_ids: ProductStore.ins().product.category_ids ?? [],
    })
    // 处理数据为自己想要的格式
    const paramList = resData.data
    if (!Array.isArray(paramList)) {
      this.collectList.value = []
      return
    }
    // 这里不能用this.collectList.value.push
    // push 不会响应,所以要用赋值
    const list = paramList.map((item) => {
      const defaultValue: any =
        productParams.find((v) => v.param_id === item.id)?.value || []
      // 产品参数详情
      const settingInfo: SettingInfo = item.setting || {}
      let textValue: { text: string }[] = []
      let radioVale = ''
      // 取文本值 和 单选值
      if (item.param_type === 1) {
        textValue = settingInfo?.default.map((v: string) => ({ text: v })) ?? []
        if (ProductStore.ins().showType === 'edit') {
          textValue = defaultValue.length === 0 ? textValue : defaultValue
        }
      } else if (item.param_type === 2) {
        radioVale = settingInfo?.default[0] ?? ''
        if (ProductStore.ins().showType === 'edit' && defaultValue.length > 0) {
          radioVale = defaultValue[0].text ?? radioVale
        }
      }
      // 设置参数选项
      let optionStr: any[] = []
      if (settingInfo?.option) {
        optionStr = settingInfo.option.map((v: string) => {
          // checked in default,多选根据默认值来选中
          let checked = settingInfo.default.includes(v)
          let img: IAttachment[] = []
          // 多选,并且是修改时，设置多选默认值
          if (
            item.param_type === 3 &&
            defaultValue.length > 0 &&
            ProductStore.ins().showType === 'edit'
          ) {
            const info = defaultValue.find((val: any) => val.text === v)
            if (info) {
              checked = true
              img = info.img ? [info.img] : []
            } else {
              checked = false
            }
          }
          return { checked, text: v, img }
        })
      }
      const info: CollectList = {
        id: item.id ?? 0,
        name: item.param_name,
        type: item.param_type,
        option: optionStr,
        isAllowImg: item.is_allow_img ?? 0,
        isRequire: item.is_require ?? 0,
        textValue,
        radioVale,
      }
      return info
    })
    this.collectList.value = list
  }
}
