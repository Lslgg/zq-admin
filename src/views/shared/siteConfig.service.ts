import SingletonClass from '@/util/singleClass'
import { ISiteConfig } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'

/**
 * 描述
 * @date 2022-05-16
 */
export class SiteConfigService extends SingletonClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): SiteConfigService {
    return super.ins() as SiteConfigService
  }

  /**
   * 获取站点配置
   * @date 2022-05-16
   * @param {string} name:any
   * @return {any}
   */
  async getSiteConfigList<T>(name: string) {
    type IRes = ISiteConfig<T>[]
    const resData = await API.site.getSiteConfigList<IRes>({ name })
    if (Array.isArray(resData.data)) {
      return resData.data[0]
    } else return null
  }

  /**
   * 描述
   * @date 2022-05-16
   * @param {any} id:any
   * @param {any} value:any
   * @param {any} status:any
   * @return {any}
   */
  postSiteConfigUpdate(id: any, value: any) {
    const parmas = { language: UseCommon.ins().language, site_id: UseCommon.ins().siteId, id: id, value: value }
    return API.site.postSiteConfigUpdate(parmas)
  }
}
