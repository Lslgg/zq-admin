import { UseCommon } from '@/util/useCommon'
import { ILoginForm } from '@/api/api.model'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'

/**
 * 描述
 * @date 2022-03-21
 * @param {any} info?:ILoginForm
 * @return {any}
 */
export class UseLoginForm extends UseFormService<ILoginForm> {
  /**
   * 描述
   * @date 2022-03-21
   * @param {any} info?:ILoginForm
   * @return {any}
   */
  async initForm(): Promise<ILoginForm> {
    return {
      account: '', // 13800138000
      password: '', // 123456
      keep: false,
    }
  }
  /**
   * 描述
   * @date 2022-03-21
   * @return {any}
   */
  createRule() {
    return {
      account: [{ required: true, message: '请输入账号' }],
      password: [{ required: true, message: '请输入密码' }]
    }
  }
  /**
   * 描述
   * @date 2022-03-21
   * @param {any} info:ILoginForm
   */
  onSubmit(info: ILoginForm): void {
    info.account = info.account.trim()
    globalSdk.login(info)
      .then((res: any) => {
        UseCommon.ins().getSiteInfo().then(res => {
          if (res) {
            window.location.href = globalSdk.redirect_url || '/'
          } else Utilts.ins().message('账号异常，请与客服联系', 'error')
        })
      })
      .catch((err: any) => {
        Utilts.ins().message(err.message, 'error')
      })
  }
}
