import { API } from '@/api/apis'
import SingletonClass from '@/util/singleClass'
import { ref } from 'vue'

interface IInquiryMenu {
  title: string
  value: string,
  icon?: string,
  num?: number
}

/**
 * 描述
 * @date 2022-03-14
 */
export class UseInquryService extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): UseInquryService {
    return super.ins() as UseInquryService
  }
  /**
   * 获取国家
   * @date 2022-03-14
   * @return {any}
   */
  public getCountry(): Promise<KeyValue[]> {
    return new Promise((resolve, reject) => {
      type CountryType = {
        country_code: string
        customer_country: string
        customer_country_text: string
      }
      API.inquiry.getInquiryCountry<CountryType[]>({}).then(res => {
        const data = res.data.filter(item => item.country_code)
          .map(item => {
            return {
              key: item.country_code,
              value: item.customer_country_text
            }
          })
        resolve(data || [])
      })
    })
  }

  /**
   * 获取询盘类型
   * @date 2022-03-14
   * @return {any}
   */
  public getInquiryTypeList() {
    const data = [
      { key: 1, value: '网站询盘' },
      { key: 2, value: '产品询盘' },
      { key: 3, value: '文章询盘' },
      { key: 4, value: '广告询盘' },
      { key: 5, value: '视频询盘' }
    ] as const
    return data
  }

  /**
   * 获取询盘来源
   * @date 2022-03-14
   * @return {any}
   */
  public getInquirySource() {
    const data = [
      { key: 1, value: '自然询盘' },
      { key: 2, value: 'Google广告' },
      { key: 3, value: 'Facebook广告' },
    ] as const
    return data
  }

  /**
   * 描述
   * @date 2022-03-14
   * @return {any}
   */
  static useInqury() {
    const tabList: IInquiryMenu[] = [
      { title: '询盘列表', value: 'list', icon: '', num: 10 },
      { title: '垃圾询盘', value: 'trash', icon: '', num: 0 },
      { title: '询盘过滤', value: 'filter', icon: '', num: 0 },
      { title: '询盘统计', value: 'statistics', icon: '', num: 0 },
    ]
    const activeTab = ref('statistics')
    return {
      tabList,
      activeTab
    }
  }
}
