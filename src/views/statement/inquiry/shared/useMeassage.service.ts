import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { IInquiryFilter } from '@/api/api.model'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { RuleObject } from 'ant-design-vue/lib/form'
/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseMesssageForm extends UseFormService<Partial<IInquiryFilter>> {
  id = 0
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<Partial<IInquiryFilter>> {
    const resData = await SiteConfigService.ins().getSiteConfigList<{ inquiry_email: [] }>('inquiry_email')
    const inquiry_email = resData?.value?.inquiry_email.join('\n')
    this.id = resData?.id || 0
    return {
      inquiry_email: inquiry_email || '',
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
      inquiry_email: [
        { required: true, message: '内容不能为空', trigger: ['change', 'blur'] },
        { validator: this.validateMessage, trigger: ['change', 'blur'] }
      ]
    }
  }

  /**
   * 描述
   * @date 2022-03-18
   * @param {any} _rule:RuleObject
   * @param {any} value:string
   * @return {any}
   */
  async validateMessage(_rule: RuleObject, value: string): Promise<string> {
    const arr = value.trim().split('\n').filter((item: string) => item)
    const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
    let bool = true
    bool = arr.filter((item: string) => !reg.test(item)).length === 0
    if (!bool) return Promise.reject(new Error('邮箱格式不正确'))
    if (arr.length > 20) return Promise.reject(new Error('最多支持20个邮箱'))
    return Promise.resolve('')
  }
  /**
   * 描述
   * @date 2022-03-15
   * @param {any} info:IForm
   */
  onSubmit(info: Partial<IInquiryFilter>): void {
    if (typeof info.inquiry_email === 'string') {
      info.inquiry_email = info.inquiry_email?.split('\n')
      info.inquiry_email = info.inquiry_email.filter(p => p)
    }
    let isOk = true
    if (Array.isArray(info.inquiry_email)) {
      const tempList: string[] = []
      info.inquiry_email.forEach(p => {
        if (!tempList.includes(p)) {
          tempList.push(p)
        } else {
          isOk = false
          Utilts.ins().message(`${p}重复了`, 'warn')
        }
      })
    }
    if (!isOk) {
      info.inquiry_email = info.inquiry_email?.join('\n')
      console.log('info.inquiry_email', info.inquiry_email)
      return
    }
    SiteConfigService.ins().postSiteConfigUpdate(this.id, { inquiry_email: info.inquiry_email ?? [] })
      .then(res => {
        if (res.data) {
          this.message('保存成功')
          this.initForm().then(data => Object.assign(this.modelRef, data))
        }
      })
  }
}
