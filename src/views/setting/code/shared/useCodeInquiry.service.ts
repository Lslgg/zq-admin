import { UseFormService } from '@/util/useFormService'
import { SiteConfigService } from '@/views/shared/siteConfig.service'

interface IForm {
  inquiry_code: string
}

/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseInquiryForm extends UseFormService<IForm> {
  id = 0
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    type TValue = { inquiry_code: string }
    const resData = await SiteConfigService.ins().getSiteConfigList<TValue>('inquiry_trace_code')
    this.id = resData?.id || 0
    return {
      inquiry_code: resData?.value.inquiry_code || '',
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
    if (info.inquiry_code.length > 3000) {
      this.message('已经超过最大字符数3000', 'warn')
      return
    }
    SiteConfigService.ins().postSiteConfigUpdate(this.id, { inquiry_code: info.inquiry_code })
      .then(res => {
        if (res.data) {
          this.initForm().then(data => Object.assign(this.modelRef, data))
          this.message('提交成功')
        }
      })
  }
}
