import router from '@/router'
import { Utilts } from '@/util/utilts'
import { useForm } from 'ant-design-vue/lib/form'
import { reactive, ref, toRaw, } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 表单操作
 * @date 2022-03-11
 * @return {any}
 */
export abstract class UseFormService<T extends object> {
  /** ID */
  id: number
  spining = ref(false)
  /** 表单数据用于刷新 */
  modelRef = reactive<T>({} as any)
  /**
   * 构造
   * @date 2022-03-21
   * @param {any} id:number
   */
  constructor() {
    const route = useRoute()
    this.id = +(route.params.id ?? '0')
  }
  /**
  * 创建表单数据
  * @date 2022-03-11
  * @returns {any}
  */
  abstract initForm(info?: T): Promise<T>
  /**
   * 创建表单验证
   * @date 2022-03-11
   * @returns {any}
   */
  abstract createRule(): any
  /**
   * 提交表单位
   * @date 2022-03-11
   * @param {any} info:any
   * @param {any} otherInfo:null
   * @returns {any}
   */
  abstract onSubmit(info: T, otherInfo: any): any
  /**
   * 提交表单错误
   * @date 2022-03-11
   * @param {any} err:any
   */
  onSubmitError(err: any) {
    console.log('err', err)
    Utilts.ins().message(err.errorFields?.[0].errors[0] || '请完成必填信息的填写', 'error')
  }
  /**
   * 返回表单操作
   * @date 2022-03-11
   * @param {any} info 最好是响应式数据
   * @return {any}
   */
  async useForm(info?: any) {
    const modelRef = reactive<T>(await this.initForm())
    const { resetFields, validate, validateInfos } = useForm(
      modelRef,
      reactive(this.createRule()),
    )
    this.modelRef = modelRef
    const modelRule = validateInfos
    const modelInfo: any = toRaw(modelRef)
    const onSubmit = () => {
      validate()
        .then((res) => {
          this.spining.value = true
          this.onSubmit(modelInfo, info)
        })
        .catch((res) => {
          this.spining.value = false
          this.onSubmitError(res)
        })
    }
    const reset = () => resetFields()
    const onBack = () => window.history.go(-1)
    return {
      modelRule,
      modelRef,
      spining: this.spining,
      reset,
      onBack,
      onSubmit,
      validate,
    }
  }
  /**
   * 是否必填
   * @param {string} message
   * @return {any}
   */
  public isRequired(message: string) {
    return { required: true, message: `请填写${message}` }
  }
  /**
  * 最大字符
  * @param {number} max
  * @param {string} message
  * @return {any}
  */
  public isMax(max: number, message: string) {
    return { max, message: `${message}不能超过${max}字符` }
  }
  /**
  * 必填并且最大字符
  * @param {number} max
  * @param {string} message
  * @return {any}
  */
  public isRequiredAndMax(max: number, message: string) {
    return [
      this.isRequired(message),
      this.isMax(max, message)
    ]
  }
  /**
   * 提示
   * @date 2022-03-23
   * @param {string} text
   * @param {string} type:"success"|"info"|"warn"|"error"
   */
  message(text: string, type: 'success' | 'info' | 'warn' | 'error' = 'success') {
    Utilts.ins().message(text, type)
  }
  /**
   * 跳转url
   * @date 2022-03-21
   * @param {any} name:string
   * @param {any} params
   * @param {any} type
   */
  goUrl(name: string, params?: any, type: '_self' | '_blank' = '_self') {
    if (type === '_self') router.push({ name, params })
    else {
      setTimeout(() => {
        window.open(router.resolve({ name, params }).href, type)
      }, 100)
    }
  }

  /**
   * 重新加载formData数据
   * @param {any} str
   * @date 2022-05-20
   */
  loadInitForm(str = '提交成功') {
    this.initForm().then(data => Object.assign(this.modelRef, data))
    if (str) this.message(str)
  }
}
