import { UseFormService } from '@/util/useFormService'
import { SiteConfigService } from '@/views/shared/siteConfig.service'
interface IForm {
  search_engine_validation: string,
}

/**
 * 描述
 * @date 2022-05-20
 * @param {any} info?:IForm
 */
export class CodeValidationService extends UseFormService<IForm> {
  id = 0
  /**
   * 描述
   * @date 2022-05-20
   * @param {any} info?:IForm
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    type IRes = { search_engine_validation: string }
    const resData = await SiteConfigService.ins().getSiteConfigList<IRes>('search_engine_validation')
    this.id = resData?.id || 0
    return {
      search_engine_validation: resData?.value.search_engine_validation || '',
    }
  }
  /**
   * 描述
   * @date 2022-05-20
   * @return {any}
   */
  createRule() {
    return {}
  }
  /**
   * 描述
   * @date 2022-05-20
   * @param {any} info:IForm
   * @param {any} otherInfo:any
   */
  onSubmit(info: IForm) {
    SiteConfigService.ins().postSiteConfigUpdate(this.id, info)
      .then(res => {
        if (res.data) this.loadInitForm()
      })
  }
}
