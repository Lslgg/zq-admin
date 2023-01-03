import { Paging } from '@/util/paging'
import { ColumnType } from 'ant-design-vue/lib/table'
import { reactive, Ref } from 'vue'

/**
 * AdvantageService
 */
export abstract class UseTableService<IDataList, IWhere> {
  public pageIndex = 1
  public pageSize = 10
  /**
   * 构造
   * @date 2022-03-10
   * @param {any} pageIndex=1
   * @param {any} pageSize=10
   */
  constructor(pageIndex = 1, pageSize = 10) {
    this.pageIndex = pageIndex
    this.pageSize = pageSize
  }
  /**
   * 查找分页数据
   * @param {IWhere} where
   */
  abstract getList(where: IWhere): Promise<UsePaging<IDataList>>

  /**
   * 表格列
   */
  abstract columns(refData?: Ref<any>): ColumnType[]
  /**
   * 导出数据
   * @param {其它数据} refData
   * @return {any}
   */
  public usePagin(refData?: Ref<any>) {
    // 初始化分页器
    const paging = reactive(new Paging<IDataList[], IWhere>(this.pageIndex, this.pageSize))
    // 初始化表格列
    paging.columns = this.columns(refData)
    // 获取列表数据方法
    const getList = () => paging.requestPaging(this.getList.bind(this))
    // 获取列表数据
    const getPatationList = (payload: any, filters: any = {}, sorter: any = {}) => {
      paging.pageIndex = payload?.current ?? this.pageIndex
      this.pageIndex = paging.pageIndex
      paging.pageSize = payload?.pageSize ?? this.pageSize
      this.pageSize = paging.pageSize
      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (!filters[key]) delete filters[key]
        })
      }
      paging.where = { ...(paging.where as Object ?? {}), ...payload, ...filters, ...sorter }
      getList()
    }
    // 多选改变事件
    const onSelectChange = (selectedRowKeys: number[]) => {
      paging.selectedRowKeys = selectedRowKeys
    }
    getList()
    return {
      paging,
      onSelectChange,
      getPatationList,
    }
  }

  /**
   * 描述
   * @date 2022-03-15
   * @param {any} title:string
   * @param {any} key:string
   * @param {any} sorter:false
   * @return {any}
   */
  public getColumns(title: string, key: keyof IDataList | 'action' | 'rowIndex', sorter = false) {
    if (key === 'rowIndex') {
      return {
        title, dataIndex: key, key, sorter, width: 60,
        customRender: (opt: any) =>
          `${(this.pageIndex - 1) * this.pageSize + opt.index + 1}`,
      }
    } else return { title, dataIndex: key, key, sorter }
  }
}
