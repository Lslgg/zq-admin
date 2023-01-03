import { UseFormService } from '@/util/useFormService'
import { SiteConfigService } from '@/views/shared/siteConfig.service'
interface IForm {
  cookie_state: string,
  status: number,
}
/**
 * 描述
 * @date 2022-05-20
 * @param {any} info?:IForm
 */
export class CookieService extends UseFormService<IForm> {
  id = 0
  /**
   * 描述
   * @date 2022-05-20
   * @param {any} info?:IForm
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    const resData = await SiteConfigService.ins().getSiteConfigList<IForm>('cookie_state')
    this.id = resData?.id || 0
    const str = 'Privacy & use of cookies. We use cookies to optimise and continuously improve our website for you. Through your continued use of our website, you consent to the use of cookies.'
    return {
      cookie_state: resData?.value.cookie_state || str,
      status: resData?.value.status || 0,
    }
  }
  /**
   * 描述
   * @date 2022-05-20
   * @return {any}
   */
  createRule() {
    return {
      cookie_state: [this.isRequired('验证内容')],
    }
  }
  /**
   * 描述
   * @date 2022-05-20
   * @param {any} info:IForm
   * @param {any} otherInfo:any
   */
  onSubmit(info: IForm) {
    if (info.cookie_state.trim().length === 0) {
      this.message('请输入验证内容', 'warn')
      return
    }
    SiteConfigService.ins().postSiteConfigUpdate(this.id, info)
      .then(res => {
        if (res.data) this.loadInitForm()
      })
  }
}
