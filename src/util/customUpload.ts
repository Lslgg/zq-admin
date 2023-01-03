import { UseCommon } from '@/util/useCommon'
import { IAttachment } from '@/api/api.model'

/** 自定义上传参数 */
export interface ICustomRequest {
  onProgress: (event: { percent: number }) => void
  onError: (event: Error, body?: Object) => void
  onSuccess: (body: Object) => void
  data: Object
  filename: String
  file: File
  withCredentials: Boolean
  action: String
  headers: Object
}

/**
 * 上传
 * @date 2022-03-25
 * @param {any} info:ICustomRequest
 * @param {any} groupId:0
 * @return {any}
 */
export function customUpload(info: ICustomRequest, groupId = 0) {
  return globalSdk.upload<Result<IAttachment>>({
    file: info.file,
    site_id: UseCommon.ins().siteId,
    group_id: groupId,
  })
}
