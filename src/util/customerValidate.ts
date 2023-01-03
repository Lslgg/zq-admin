import SingletonClass from './singleClass'

/**
 * 自定义表单验证
 * @date 2022-04-13
 * @return {any}
 */
export class CustomerValidate extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): CustomerValidate {
    return super.ins() as CustomerValidate
  }

  /**
   * 关键词验证
   * @date 2022-04-13
   * @param {any} value:string
   * @param {any} limit:number
   * @return {any}
   */
  async validateKeyword(value: string[], limit: number): Promise<string> {
    const arr = value
    let bool = true
    bool = arr.filter((item: string) => item).filter((item: string) => item.length > 50).length === 0
    if (bool) bool = arr.length <= limit
    if (!bool) {
      return Promise.reject(new Error(`数量不超过${limit}个且关键词少于50字符`))
    } else {
      return Promise.resolve('')
    }
  }
}
