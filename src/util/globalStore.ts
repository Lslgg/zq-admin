import { ISiteInfo } from './../api/api.model'
import SingleClass from '@/util/singleClass'
import { Subject } from 'rxjs'
/**
 * 全局状态管理
 */
export class GlobalStore extends SingleClass {
  private siteInfo$ = new Subject<Partial<ISiteInfo>>()
  private inquiryMessage$ = new Subject<boolean>()
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): GlobalStore {
    return super.ins() as GlobalStore
  }

  /**
   * 设置站点信息
   * @param {ISiteInfo} siteInfo
   */
  public setSiteInfo$(siteInfo: Partial<ISiteInfo>) {
    this.siteInfo$.next(siteInfo)
  }

  /**
   * 获取站点信息
   * @return {Observable<Partial<ISiteInfo>>}
   */
  public getSiteInfo$() {
    return this.siteInfo$.asObservable()
  }

  /**
   * 通知查看了询盘未读信息消息
   * @date 2022-05-16
   * @param {any} value:boolean
   */
  public setInquiryMessage(value: boolean) {
    this.inquiryMessage$.next(value)
  }

  /**
   * 监听询盘未读信息
   * @date 2022-05-16
   * @return {any}
   */
  public getInquiryMessage$() {
    return this.inquiryMessage$.asObservable()
  }

  /**
   * 从window.globalData[name]获取值
   * @param {string} name
   * @param {string} value
   * @return {any}
   */
  public getItem(name: string) {
    return globalData[name] || ''
  }

  /**
   * 设置window.globalData[name]
   * @param {string} name
   * @param {string} value
   */
  public setItem(name: string, value: any) {
    globalData[name] = value
  }

  /**
   * 从window.globalData[name]删除值
   * @param {string} name
   */
  public removeItem(name: string) {
    delete globalData[name]
  }
}
