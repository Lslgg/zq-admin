import { API } from '@/api/apis'
import { ContryCodeList } from '@/util/countrycode'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { SiteConfigService } from '@/views/shared/siteConfig.service'
import { Ref } from 'vue'
type WhatsappType = {
  id?: number,
  global_roaming: string,
  mobile: string,
  welcome_word: string,
  status: number
}
/**
 * 表单操作
 * @date 2022-03-11
 * @return {any}
 */
export class WhatsappService extends UseFormService<WhatsappType> {
  id = 0
  /**
   * 初始化表单
   * @date 2022-03-11
   * @return {WhatsappType}
   */
  async initForm(): Promise<WhatsappType> {
    const resData = await SiteConfigService.ins().getSiteConfigList<WhatsappType>('whats_app')
    this.id = resData?.id || 0
    let global_roaming = ''
    const roaming = resData?.value?.global_roaming || '+86'
    const info = ContryCodeList.find(p => p.phone_code === roaming)
    if (info) global_roaming = `${info.cn}${info.phone_code}`
    return {
      id: this.id,
      global_roaming: global_roaming,
      mobile: resData?.value?.mobile || '',
      welcome_word: resData?.value?.welcome_word || '',
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
      global_roaming: [this.isRequired('国际区号')],
      mobile: [this.isRequired('手机号码')],
      welcome_word: [this.isRequired('欢迎语')],
    }
  }
  /**
   * 提交表单
   * @date 2022-03-15
   * @param {any} info:any
   * @param {any} isEdit:any
   * @return {any}
   */
  onSubmit(info: WhatsappType, isEdit: Ref<boolean>) {
    if (info.global_roaming.trim().length === 0) {
      this.message('请输入国际区号', 'error')
      return
    }
    if (info.mobile.trim().length === 0) {
      this.message('请输入手机号码', 'error')
      return
    }
    console.log(info.welcome_word)
    if (info.welcome_word.trim().length === 0) {
      this.message('请输入欢迎语', 'error')
      return
    }
    isEdit.value = true
    info.global_roaming = this.getRoaming(info.global_roaming)
    if (!this.modelRef.id) return this.addWhatsapp(info)
    delete info.id
    SiteConfigService.ins().postSiteConfigUpdate(this.id, info)
      .then(res => {
        Utilts.ins().message('保存成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }

  /**
   * 描述
   * @date 2022-05-23
   * @param {any} info
   */
  addWhatsapp(info: WhatsappType) {
    const params = {
      site_id: UseCommon.ins().siteId,
      name: 'whats_app',
      value: {
        global_roaming: info.global_roaming,
        mobile: info.mobile,
        welcome_word: info.welcome_word,
        status: info.status
      },
    }
    API.site.postSiteConfigAdd<{ id: number }>(params)
      .then(res => {
        Utilts.ins().message('添加成功')
        this.initForm().then(data => Object.assign(this.modelRef, data))
      })
  }

  /**
   * 获取要保存的区号
   * @date 2022-05-24
   * @param {any} global_roaming:string
   * @return {any}
   */
  getRoaming(global_roaming: string) {
    let roaming = ''
    const roamingList = global_roaming.split('+')
    if (roamingList.length === 2) roaming = `+${roamingList[1]}`
    return roaming
  }
}
