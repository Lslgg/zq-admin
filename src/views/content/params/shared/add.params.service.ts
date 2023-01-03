import { Utilts } from '@/util/utilts'
import { API } from '@/api/apis'
import { IProductParam, SettingInfo, SettingType } from '@/api/api.model'
import { UseFormService } from '@/util/useFormService'
import { UseCommon } from '@/util/useCommon'
import { Ref, ref, unref } from 'vue'
type CheckType = {
  settingList: Ref<{ value: string }[]>
  checkList: Ref<string[]>
}
/**
 * 描述
 * @date 2022-03-11
 * @return {any}
 */
export class ParamsForm extends UseFormService<IProductParam> {
  setting?: Ref<SettingType[]>
  checks?: Ref<string[]>
  /**
   * 描述
   * @date 2022-03-11
   * @return {IProduct}
   */
  async initForm(): Promise<IProductParam> {
    let data: Partial<IProductParam> = {}
    const siteId = UseCommon.ins().siteId
    if (this.id) {
      const res = await API.product.getProductParamGet<IProductParam>({
        site_id: siteId,
        id: this.id,
      })
      data = res.data
    }
    const info = {
      id: data.id ?? 0,
      site_id: siteId ?? 0,
      param_name: data.param_name ?? '',
      category_ids: data.category_ids ?? [],
      param_type: data.param_type ?? 1,
      is_require: data.is_require || 0,
      is_allow_img: data.is_allow_img || 0,
      value: data.value ?? '',
      sort_num: data.sort_num ?? 9999,
      status: data.status ?? 0,
      setting: data.setting ?? '',
      is_common: data.is_common || 0,
    }
    // 单选，多选
    if (data.param_type !== 1 && data.setting) {
      this.setSettingList(info)
    } else if (data.param_type === 1 && data.setting) {
      // 文本
      const settingInfo: SettingInfo = info.setting
      info.value = settingInfo.default.length > 0 ? settingInfo.default[0] : ''
    }
    if (data.active_in_category && data.active_in_category.length > 0) {
      info.category_ids = data.active_in_category.map((p) => p.category_id)
    }
    if (data.is_common) {
      info.category_ids.push(0)
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
      param_name: [...this.isRequiredAndMax(100, '参数名称')],
      value: [this.isMax(100, '预设默认值')],
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @param {any} info:any
   * @param {any} otherData:any
   */
  onSubmit(info: IProductParam, otherData: CheckType) {
    const settingList = unref(otherData.settingList)
    const checkList = unref(otherData.checkList)
    this.setSetting(info, settingList, checkList)
    this.saveInfo(info)
  }

  /**
   * 保存或更新
   * @date 2022-03-31
   * @param {any} info
   */
  saveInfo(info: IProductParam) {
    if (info.setting.option?.some((p: any) => !p)) {
      // 检查保存数据时会删除通用0,如果有通用0,则添加
      if (info.is_common) info.category_ids.push(0)
      this.message('请填写选项值!', 'warn')
      return
    }
    if (info.id) {
      API.product.postProductParamUpdate(info).then((res) => {
        if (res.data) {
          Utilts.ins().message('修改成功!')
          this.goUrl('params')
        }
      })
      return
    }
    API.product.postProductParamAdd(info).then((res) => {
      if (res.data) {
        Utilts.ins().message('保存成功!')
        this.goUrl('params')
      }
    })
  }
  /**
   * 参数settting数据
   * @date 2022-03-31
   * @return {any}
   */
  useCustomFrom() {
    const settingList = ref<SettingType[]>([{ value: '', isChecked: false }])
    const checkList = ref<string[]>()
    return { settingList, checkList }
  }
  /**
   * 设参数的setting值
   * @date 2022-03-31
   * @param {any} info:IProductParam
   * @param {any} settingList:{value:string}[]
   * @param {any} checkList:string[]
   * @return {any}
   */
  private setSetting(
    info: IProductParam,
    settingList: { value: string }[],
    checkList: string[]
  ) {
    // 文本
    if (info.param_type === 1) {
      info.setting = { default: [info.value] }
    } else if (info.param_type !== 1) {
      // 单选，多选
      const option = settingList.map((p) => p.value) ?? []
      info.setting = { option, default: checkList }
    }
    info.is_common = info.category_ids?.includes(0)
    // 如果有通用类,删除通用类的0
    info.category_ids = info.category_ids?.filter((str) => str !== 0)
    info.status = info.status ? 1 : 0
    return info
  }
  /**
   * 设置单选，多选值
   * @date 2022-03-31
   * @param {any} info:IProductParam
   */
  private setSettingList(info: IProductParam) {
    info.settingInfo = info.setting
    const settingList: SettingType[] = []
    if (info.settingInfo) {
      const settingItem = info.settingInfo
      if (settingItem.option) {
        settingItem.option.forEach((p) => {
          settingList.push({ value: p, isChecked: false })
        })
        const checks: string[] = []
        if (settingItem.default) {
          settingItem.default.forEach((item) => checks.push(item))
          this.setting = ref(settingList)
          this.checks = ref(checks)
        }
      }
    }
  }
}
