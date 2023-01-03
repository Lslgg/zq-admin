import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'

interface IGaForm {
  ga_code: string
  media_id: string
}

/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseGaForm extends UseFormService<IGaForm> {
  id: number = 0
  view_id = ''
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<IGaForm> {
    type TValue = { ga_code: string, media_id: string, view: string }
    const resData = await SiteConfigService.ins().getSiteConfigList<TValue>('ga_trace_code')
    this.id = resData?.id || 0
    this.view_id = resData?.value?.view || ''
    return {
      ga_code: resData?.value?.ga_code || '',
      media_id: resData?.value?.media_id || '',
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
  onSubmit(info: IGaForm): void {
    if (info.ga_code.length > 3000) {
      this.message('已经超过最大字符数3000', 'warn')
      return
    }
    const value = { ...info, view: this.view_id }
    SiteConfigService.ins().postSiteConfigUpdate(this.id, value)
      .then(res => {
        Utilts.ins().message('GA代码保存成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }
}
