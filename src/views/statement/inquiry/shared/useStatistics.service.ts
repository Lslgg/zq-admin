import { Utilts } from '@/util/utilts'
import { Dayjs } from 'dayjs'
import { computed, reactive, ref } from 'vue'
import {
  TrophyFilled,
  EnvironmentFilled,
  CustomerServiceFilled,
} from '@ant-design/icons-vue'
import { API } from '@/api/apis'
import { IInquiryPiceData, IInquirySourceData } from '@/api/api.model'

/**
 * 描述
 * @date 2022-03-15
 * @return {any}
 */
export class UseStatisticsService {
  start_date: string = ''
  end_date: string = ''
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  public async useStatistics() {
    const dateList = [
      { label: '所有日期', value: 'all' },
      { label: '最近7天', value: '6' },
      { label: '最近30天', value: '29' },
      { label: '最近60天', value: '59' },
      { label: '最近90天', value: '89' },
      { label: '最近1年', value: '364' },
      // { label: '自定义', value: 'auto' },
    ]
    const filters: { date: string; customerDate: Dayjs[] } = reactive({
      date: 'all',
      customerDate: [],
    })
    const summary = await this.getInquirySummaryData()
    const list = [
      { title: '询盘总数', num: summary.inquiry_total_num, bg: 'bg-blue-300', icon: reactive({ name: computed(() => TrophyFilled) }), },
      { title: '本月询盘', num: summary.inquiry_this_month_num, bg: 'bg-red-300', icon: reactive({ name: computed(() => EnvironmentFilled) }), },
      { title: '今日询盘', num: summary.inquiry_today_num, bg: 'bg-lime-300', icon: reactive({ name: computed(() => CustomerServiceFilled) }), },
    ]
    const isChange = ref(true)
    let worldData = reactive(await this.getInquiryWorldData())
    let sourceData = reactive(await this.getInquirySourceData())
    let typeData = reactive(await this.getInquiryTypeData())
    let terminalData = reactive(await this.getInquiryTerminalData())
    const trendData = await this.getDataInquirytrend()
    // 查找报表
    const onFilters = async () => {
      isChange.value = false
      if (filters.date !== 'all') {
        this.start_date = Utilts.ins().getNearDays(+filters.date) + ' 00:00:00'
        this.end_date = Utilts.ins().getNearDays(0) + ' 23:59:59'
      } else if (filters.date === 'all') {
        this.start_date = ''
        this.end_date = ''
      }
      terminalData = Object.assign(terminalData, reactive(await this.getInquiryTerminalData()))
      worldData = Object.assign(worldData, reactive(await this.getInquiryWorldData()))
      sourceData = Object.assign(sourceData, reactive(await this.getInquirySourceData()))
      typeData = Object.assign(typeData, reactive(await this.getInquiryTypeData()))
      isChange.value = true
    }
    return {
      dateList,
      filters,
      list,
      sourceData,
      typeData,
      trendData,
      worldData,
      terminalData,
      isChange,
      onFilters
    }
  }

  /**
   * 询盘来源统计
   * @return {any}
  */
  public async getInquirySummaryData() {
    type SummaryType = {
      inquiry_mui_en_num: number
      inquiry_mui_other_num: number
      inquiry_this_month_num: number
      inquiry_today_num: number
      inquiry_total_num: number
    }
    const resData = await API.data.getDataInquirycount<{ summary: SummaryType }>({ type: 'summary', ...this.dateInfo })
    const summary = resData.data.summary || {}
    return summary
  }

  /**
   * 询盘来源统计
   * @return {any}
  */
  public async getInquirySourceData() {
    // const list = [
    //   { name: '自然询盘', type: 'line', smooth: true, data: [0, 0, 0, 0, 0, 0, 0], },
    //   { name: '谷歌询盘', type: 'line', smooth: true, data: [0, 0, 0, 0, 0, 0, 0], },
    //   { name: 'facebook询盘', type: 'line', smooth: true, data: [0, 0, 0, 0, 0, 0, 0], },
    // ]
    const resData = await API.data.getDataInquirycount<{ inquiry_source: IInquirySourceData[] }>({ type: 'inquiry_source', ...this.dateInfo })
    const resDataList = resData.data.inquiry_source || []
    const grid = { top: 40, left: 42, right: 0, bottom: 30 }
    if (resDataList.length === 0) return { list: [], legend: {}, grid }
    const xAxis: string[] = []
    const list: { name: string, type: string, smooth: boolean, data: number[] }[] = []
    resDataList.forEach((p, index) => {
      xAxis.push(p.date)
      if (p.data) {
        p.data.forEach((pData, pDataIndex) => {
          const info = list.find(p => p.name === pData.inquiry_source_text)
          const num = pData.num // + Utilts.ins().getRandomNum() * 10
          if (info) info.data.push(num)
          else {
            list.push({
              name: pData.inquiry_source_text,
              type: 'line',
              smooth: true,
              data: [num]
            })
          }
        })
      }
    })
    const legend = { show: true }
    return { list, legend, grid, xAxis }
  }

  /**
   * 询盘类型统计
   * @return {any}
   */
  public async getInquiryTypeData() {
    const resData = await API.data.getDataInquirycount<{ inquiry_type: IInquiryPiceData[] }>({ type: 'inquiry_type', ...this.dateInfo })
    const picDataList = resData.data.inquiry_type || []
    const picList = picDataList.filter(p => p.num > 0).map((p, index) => ({
      value: p.num,
      name: p.inquiry_type_text,
    })) || []
    const picLegend = {
      type: 'plain',
      show: true,
      orient: 'vertical',
      bottom: 0,
      left: 0,
      icon: 'circle',
      formatter: (params: any) => params,
    }
    return { list: picList, legend: picLegend }
  }

  /**
  * 询盘国家统计
  * @return {any}
  */
  public async getInquiryWorldData() {
    type WorldData = { customer_country: { customer_country: string, customer_country_text: string, num: number }[] }
    const resData = await API.data.getDataInquirycount<WorldData>({ type: 'customer_country', ...this.dateInfo })
    const picDataList = resData.data.customer_country || []
    // console.log('picDataList', picDataList)
    const list = picDataList.map((p, index) => ({
      name_zh: p.customer_country_text || p.customer_country,
      name_en: p.customer_country,
      value: p.num,
    })) || []
    // test data
    // list.push(...[
    //   { name_zh: 'Afghanistan', value: 28397 },
    //   { name_zh: 'Angola', value: 19549 },
    //   { name_zh: 'Albania', value: 3150 },
    //   { name_zh: 'United Arab Emirates', value: 8441 },
    //   { name_zh: 'Argentina', value: 40374 },
    //   { name_zh: 'Armenia', value: 2963 },
    //   { name_zh: 'Australia', value: 22404 },
    //   { name_zh: 'Austria', value: 8401 },
    //   { name_zh: 'Azerbaijan', value: 9094 },
    //   { name_zh: 'Burundi', value: 9232 },
    // ])
    return { list }
  }

  /**
   * 询盘终端统计
   * @return {any}
   */
  public async getInquiryTerminalData() {
    type WorldData = { terminal: { terminal: number, terminal_text: string, num: number }[] }
    const resData = await API.data.getDataInquirycount<WorldData>({ type: 'terminal', ...this.dateInfo })
    const picDataList = resData.data.terminal || []
    const pc = picDataList.find(p => p.terminal === 1) || { num: 0 }
    const mobile = picDataList.find(p => p.terminal === 2) || { num: 0 }
    return { pcNum: pc.num ?? 0, mobileNum: mobile.num ?? 0 }
  }

  /**
   * 询盘趋势
   * @return {any}
   */
  public async getDataInquirytrend() {
    const resDate = await API.data.getDataInquirytrend<{ date: string; num: number }[]>({})
    const subTitle = resDate.data.length <= 90 ? '最近三个月' : '最近半年'
    const listTrendData = [
      {
        name: '询盘趋势', type: 'line', smooth: true,
        data: [...(resDate.data.map((p) => p.num) || [])],
      },
    ]
    const xTrendData = [...(resDate.data.map((p) => p.date) || [])]
    return {
      subTitle,
      listTrendData,
      xTrendData
    }
  }

  /**
   * 日期参数
   * @return {any}
   */
  get dateInfo() {
    type DateWhereType = { start_date?: string, end_date?: string }
    const dateInfo: DateWhereType = {
      start_date: this.start_date,
      end_date: this.end_date,
    }
    if (!this.start_date) delete dateInfo.start_date
    if (!this.end_date) delete dateInfo.end_date
    return dateInfo
  }
}
