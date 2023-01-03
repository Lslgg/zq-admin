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
export class DesignCodeService {
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  public useCode() {
    const tabList: IMenu[] = [
      { title: '全局配置', value: 'global', icon: '', num: 0 },
      { title: '列表详情页', value: 'list-detail', icon: '', num: 0 },
      { title: '系统页', value: 'system', icon: '', num: 0 },
      { title: '单页', value: 'single', icon: '', num: 0 },
    ]
    const activeTab = ref('global')
    return {
      tabList,
      activeTab
    }
  }
}
