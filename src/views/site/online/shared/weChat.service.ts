import { IAttachment } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { Ref } from 'vue'
type WeChatType = { id?: number, wechat: IAttachment[], status: number }
/**
 * 表单操作
 * @date 2022-03-11
 * @return {any}
 */
export class WeChatService extends UseFormService<WeChatType> {
  id = 0
  /**
   * 初始化表单
   * @date 2022-03-11
   * @return {WeChatType}
   */
  async initForm(): Promise<WeChatType> {
    const resData = await SiteConfigService.ins().getSiteConfigList<WeChatType>('wechat')
    this.id = resData?.id || 0
    return {
      id: this.id,
      wechat: resData?.value?.wechat || [],
      status: resData?.value?.status || 0
    }
  }
  /**
   * 数据检查
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
      wechat: [{ required: true, message: `请上传微信二维码` }]
    }
  }
  /**
   * 提交表单
   * @date 2022-03-15
   * @param {any} info:any
   * @param {any} isEdit:any
   */
  onSubmit(info: WeChatType, isEdit: Ref<boolean>) {
    isEdit.value = true
    if (!this.modelRef.id) {
      this.addWeChat(info)
      return
    }
    delete info.id
    const imgIds: any = [info.wechat?.[0]?.id]
    info.wechat = imgIds
    SiteConfigService.ins().postSiteConfigUpdate(this.id, info)
      .then(res => {
        Utilts.ins().message('保存成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }

  /**
   * 描述
   * @param {any} info
   * @date 2022-05-23
   */
  addWeChat(info: WeChatType) {
    const imgIds: any = [info.wechat?.[0]?.id]
    const params = {
      site_id: UseCommon.ins().siteId,
      name: 'wechat',
      value: { wechat: imgIds, status: info.status },
    }
    API.site.postSiteConfigAdd<{ id: number }>(params)
      .then(res => {
        Utilts.ins().message('添加成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }
}
