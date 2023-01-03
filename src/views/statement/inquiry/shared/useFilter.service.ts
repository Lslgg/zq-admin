import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { UseFormService } from '@/util/useFormService'
import { IInquiryFilter } from '@/api/api.model'
/**
 * 表单操作
 * @date 2022-03-11
 * @return {any}
 */
export class InquirtFilterForm extends UseFormService<IInquiryFilter> {
  id = 0
  /**
   * 初始化表单
   * @date 2022-03-11
   * @return {IInquiryFilter}
   */
  async initForm(): Promise<IInquiryFilter> {
    const resData = await SiteConfigService.ins().getSiteConfigList<{
      status: number,
      filter_email: []
      filter_ip: []
      filter_keyword: []
    }>('inquiry_filter')
    this.id = resData?.id || 0
    const status = resData?.value.status || 0
    const filter_email = resData?.value?.filter_email.join('\n') || ''
    const filter_ip = resData?.value?.filter_ip.join('\n') || ''
    const filter_keyword = resData?.value?.filter_keyword.join('\n') || ''
    return {
      filter_email: filter_email,
      filter_keyword: filter_keyword,
      filter_ip: filter_ip,
      status: status,
    }
  }
  /**
   * 数据检查
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {}
  }
  /**
   * 提交表单
   * @date 2022-03-15
   * @param {any} info:any
   */
  onSubmit(info: IInquiryFilter) {
    const getFilter = (list: string[] | string) => {
      if (typeof list === 'string') {
        list = list.split('\n')?.filter(p => p)
      }
      return list
    }
    info.filter_email = getFilter(info.filter_email)
    info.filter_ip = getFilter(info.filter_ip)
    info.filter_keyword = getFilter(info.filter_keyword)
    SiteConfigService.ins().postSiteConfigUpdate(this.id, info)
      .then(() => {
        this.message('保存成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }
}
