import { UseCommon } from '@/util/useCommon'
import { API } from '@/api/apis'
import { UseFormService } from '@/util/useFormService'
interface IForm {
  id: number
  site_id: number
  header: string
  footer: string
  copyright: string
  setting: string
}

/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class CodeAllService extends UseFormService<IForm> {
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    return {
      id: 0,
      site_id: UseCommon.ins().siteId,
      header: '',
      footer: '',
      copyright: '',
      setting: '',
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
    }
  }
  /**
   * 保存
   * @date 2022-03-15
   * @param {any} info:IForm
   */
  onSubmit(info: IForm): void {
    const saveInfo: any = {}
    try {
      if (info.header) saveInfo.header = JSON.parse(info.header)
      if (info.footer) saveInfo.footer = JSON.parse(info.footer)
      if (info.copyright) saveInfo.copyright = JSON.parse(info.copyright)
      if (info.setting) saveInfo.setting = JSON.parse(info.setting)
      saveInfo.site_id = info.site_id
      API.design.postDesignCommonUpdate(saveInfo)
        .then(() => this.message('保存成功!'))
    } catch (error) {
      this.message('输入格式有问题', 'error')
    }
  }
}
