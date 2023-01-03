/** 单例类 */
export default class SingletonClass {
  /** 构造方法 */
  protected constructor() { }
  private static _ins: SingletonClass
  /**
   * 获取实例
   * @date 2022-01-17
   * @return {any}
   */
  public static ins() {
    if (!this._ins) {
      this._ins = new this()
      this._ins.init()
    }
    return this._ins
  }
  /** init */
  init() { }
}
