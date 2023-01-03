import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { UseFormService } from '@/util/useFormService'

interface IForm {
  style_code: string,
  script_code: string,
}

/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseStyleForm extends UseFormService<IForm> {
  id = 0
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    const resData = await SiteConfigService.ins().getSiteConfigList<{ style_code: string, script_code: string }>('extend_code')
    this.id = resData?.id || 0
    return {
      style_code: resData?.value.style_code || '',
      script_code: resData?.value?.script_code || '',
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
   * 描述
   * @date 2022-03-15
   * @param {any} info:IGaForm
   */
  onSubmit(info: IForm) {
    const value = { style_code: info.style_code, script_code: info.script_code }
    SiteConfigService.ins().postSiteConfigUpdate(this.id, value)
      .then(res => {
        if (res.data) {
          this.initForm().then(data => Object.assign(this.modelRef, data))
          this.message('提交成功')
        }
      })
  }
}
