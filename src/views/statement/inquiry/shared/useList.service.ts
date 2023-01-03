import { Utilts } from '@/util/utilts'
import { UseCommon } from '@/util/useCommon'
import { IInquiry } from '@/api/api.model'
import { API } from '@/api/apis'
import { Paging } from '@/util/paging'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { TableColumnType } from 'ant-design-vue'
import { Dayjs } from 'dayjs'
import { reactive } from 'vue'
// import { UseInquryService } from './useInquiry.service'

export interface IInquiryListWhere {
  status: number
  current_page: number
  per_page: number
  order: string
  is_read: number
  start_date: string
  end_date: string
  keyword: string
  inquiry_type: number
  inquiry_source: number
  country_code: string
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class InquryListOperationService extends UseTableOperationService<IInquiry, IInquiryListWhere> {
  pageType: NormalOrTrash = 'normal'
  /**
   * 构造
   * @date 2022-04-08
   * @param {any} paging:Paging<IInquiry[], IInquiryListWhere>
   * @param {any} getPatationList:PagingFun
   * @param {any} pageType:NormalOrTrash
   */
  constructor(paging: Paging<IInquiry[], IInquiryListWhere>, getPatationList: PagingFun, pageType: NormalOrTrash) {
    super(paging, getPatationList)
    this.pageType = pageType
  }
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const dateList = [
      { label: '所有日期', value: 'all' },
      { label: '最近7天', value: '6' },
      { label: '最近30天', value: '29' },
      { label: '最近60天', value: '59' },
      { label: '最近90天', value: '89' },
      { label: '最近1年', value: '364' },
      // { label: '自定义', value: 'auto' },
    ]

    const filters: { date: string, customerDate: Dayjs[], searchKey: string } = reactive({
      date: 'all',
      customerDate: [],
      searchKey: ''
    })

    const onRangeChange = (date: [Dayjs, Dayjs]) => {
      filters.customerDate = date
    }

    const onSetInquiry = (status: boolean, ids: number[] = []) => {
      if (ids.length === 0) {
        Utilts.ins().message('请选择要操作的数据', 'warn')
        return
      }
      const params: any = { site_id: UseCommon.ins().siteId, status: status ? 1 : 0, ids: ids }
      API.inquiry.postInquiryStatus(params)
        .then(() => {
          this.resultList()
        })
    }

    const onDel = (ids: number | number[]) => {
      if (Array.isArray(ids) && ids.length === 0) {
        Utilts.ins().message('请选择要操作的数据!', 'warn')
        return
      }
      this.delConfirm(() => {
        API.inquiry.postInquiryDelete({ site_id: UseCommon.ins().siteId, ids })
          .then(() => {
            this.resultList()
          })
      })
    }

    const onSearch = (keyword: string) => {
      this.getPatationList({ ...this.paging.where, keyword, current: 1 })
    }

    const onFilters = () => {
      let start_date = ''
      let end_date = ''
      if (filters.date !== 'all') {
        start_date = Utilts.ins().getNearDays(+filters.date)
        end_date = Utilts.ins().getNearDays(0)
        this.getPatationList({ ...this.paging.where, start_date, end_date, current: 1 })
      } else if (filters.date === 'all') {
        start_date = ''
        end_date = ''
        this.getPatationList({ ...this.paging.where, start_date, end_date, current: 1 })
      }
    }
    return {
      dateList,
      filters,
      onRangeChange,
      onSetInquiry,
      onDel,
      onSearch,
      onFilters
    }
  }
}

/**
 * 列表查找分页
 */
export class UseInquryListPagationService extends UseTableService<IInquiry, IInquiryListWhere> {
  pageType: NormalOrTrash = 'normal'

  /**
   * 描述
   * @date 2022-04-08
   * @param {any} pageType:NormalOrTrash
   */
  constructor(pageType: NormalOrTrash) {
    super()
    this.pageType = pageType
  }
  /**
  * 获取列表数据
  * @date 2022-03-10
  * @param {any} where:PagingParams<IInquiryListWhere>
  * @return {any}
  */
  public getList(where: IInquiryListWhere): Promise<UsePaging<IInquiry>> {
    return new Promise(async (resolve, reject) => {
      const params = this.getParams(where)
      API.inquiry.getInquiryList<UsePaging<IInquiry>>(params).then((res) => {
        resolve({
          total: res.data.total,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          list: res.data.data,
        })
      }).catch(err => reject(err))
    })
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    return [
      { ...this.getColumns('序号', 'rowIndex'), width: 60 },
      { ...this.getColumns('状态', 'is_read'), width: 60, customFilterDropdown: true },
      { ...this.getColumns('询盘邮箱', 'customer_email'), width: 150 },
      { ...this.getColumns('询盘内容', 'inquiry_content') },
      { ...this.getColumns('询盘URL', 'inquiry_url'), width: 150 },
      { ...this.getColumns('询盘时间', 'created_at'), width: 160 },
      { ...this.getColumns('国家', 'customer_country'), width: 90, customFilterDropdown: true },
      { ...this.getColumns('询盘类型', 'inquiry_type_text'), width: 90, customFilterDropdown: true },
      { ...this.getColumns('来源', 'inquiry_source_text'), width: 90, customFilterDropdown: true },
      { title: '操作', key: 'action', width: this.pageType === 'trash' ? 130 : 90, fixed: 'right' }
    ]
  }

  /**
   * 描述
   * @date 2022-05-25
   * @param {any} where:IInquiryListWhere
   * @return {any}
   */
  private getParams(where: Partial<IInquiryListWhere>) {
    const params: Partial<IInquiryListWhere> = {
      current_page: this.pageIndex,
      per_page: this.pageSize,
      keyword: where?.keyword ?? '',
      status: this.pageType === 'normal' ? 1 : 0
    }
    // 判断时间开始
    if (where?.start_date) params.start_date = where.start_date + ' 00:00:00'
    else delete params.start_date
    // 判断时间结束
    if (where?.end_date) params.end_date = where.end_date + ' 23:59:59'
    else delete params.end_date
    // 判断状态
    if (where?.is_read === 0) params.is_read = 0
    else if (where?.is_read === 1) params.is_read = 1
    else delete params.is_read
    // 判断类型
    if ((where?.inquiry_type ?? 0) <= 0) delete params.inquiry_type
    else params.inquiry_type = where.inquiry_type
    // 判断来源
    if ((where?.inquiry_source ?? 0) <= 0) delete params.inquiry_source
    else params.inquiry_source = where.inquiry_source
    // 判断国家
    if (!where?.country_code) delete params.country_code
    else params.country_code = where.country_code
    return params
  }
}
