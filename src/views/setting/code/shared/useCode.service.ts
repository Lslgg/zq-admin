import { ref } from 'vue'

interface IMenu {
  title: string
  value: string,
  icon?: string,
  num?: number
}


/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseCodeService {
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  public useCode() {
    const tabList: IMenu[] = [
      { title: 'GA流量跟踪', value: 'ga', icon: '', num: 0 },
      { title: '询盘跟踪', value: 'inquiry', icon: '', num: 0 },
      // { title: '广告跟踪', value: 'ad', icon: '', num: 0 },
    ]
    const activeTab = ref('ga')
    return {
      tabList,
      activeTab
    }
  }
}
