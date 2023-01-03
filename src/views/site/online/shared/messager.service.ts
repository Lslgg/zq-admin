import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { Ref } from 'vue'
type MessengerType = { id?: number, messenger: string, status: number }
/**
 * 表单操作
 * @date 2022-03-11
 * @return {any}
 */
export class MessagerService extends UseFormService<MessengerType> {
  id = 0
  /**
   * 初始化表单
   * @date 2022-03-11
   * @return {MessengerType}
   */
  async initForm(): Promise<MessengerType> {
    const resData = await SiteConfigService.ins().getSiteConfigList<MessengerType>('messenger')
    this.id = resData?.id || 0
    return {
      id: this.id,
      messenger: resData?.value.messenger || '',
      status: resData?.value.status || 0
    }
  }
  /**
   * 数据检查
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
      messenger: [this.isRequired('Messenger')]
    }
  }
  /**
   * 提交表单
   * @date 2022-03-15
   * @param {any} info:any
   * @param {any} isEdit:any
   */
  onSubmit(info: MessengerType, isEdit: Ref<boolean>) {
    if (info.messenger.trim().length === 0) {
      this.message('请输入Messenger', 'warn')
      return
    }
    isEdit.value = true
    if (!this.modelRef.id) {
      this.onAddMessager(info)
      return
    }
    delete info.id
    SiteConfigService.ins().postSiteConfigUpdate(this.id, info)
      .then(res => {
        Utilts.ins().message('保存成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }

  /**
 * 添加Messager
 * @param {WhatsappType} info
 * @date 2022-05-23
 */
  onAddMessager(info: MessengerType) {
    const params = {
      site_id: UseCommon.ins().siteId,
      name: 'messenger',
      value: { messenger: info.messenger, status: info.status }
    }
    API.site.postSiteConfigAdd<{ id: number }>(params)
      .then(res => {
        Utilts.ins().message('添加成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }
}
