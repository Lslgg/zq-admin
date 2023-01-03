import { UseFormService } from '@/util/useFormService'
interface IForm {
  gaCode: string
  faceCode: string
}

/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseAdForm extends UseFormService<IForm> {
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    return {
      gaCode: '',
      faceCode: ''
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {}
  }
  /**
   * 描述
   * @date 2022-03-15
   * @param {any} info:IForm
   */
  onSubmit(info: IForm): void {
    throw new Error('Method not implemented.')
  }
}
