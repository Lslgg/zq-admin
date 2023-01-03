import { UseCommon } from './useCommon'
import { Utilts } from './utilts'
/**
 * 请求方法
 * @date 2022-03-21
 * @param {any} info:{url:string;method:string;params:any}
 * @return {any}
 */
export default async function httpService<T>(info: { url: string; method: string; params: any, showError?: boolean }): Promise<Result<T>> {
  // 判断参数中是否有siteId，如果有并且没有值，则获取站点id
  const hasSiteId = info.params.hasOwnProperty('site_id')
  if (hasSiteId && !info.params.site_id) {
    await UseCommon.ins().getSiteInfo()
    info.params.site_id = UseCommon.ins().siteId
  }
  if (info.method === 'POST') Utilts.ins().trimObjStr(info.params)
  return new Promise((resolve, reject) => {
    globalSdk.request<T>(info).then((res) => {
      resolve(res)
    }).catch((res) => {
      if (info.showError) Utilts.ins().message(res.message, 'error')
      reject(res)
    })
  })
}

