/**
 * 分页信息
 * @date 2022-01-19
 * @param {any} pageIndex:number
 * @param {any} pageSize:number
 * @return {any}
 */
export class Paging<TData, TWhere> {
  pageIndex = 1
  pageSize = 10
  total = 0
  where?: TWhere
  dataSource?: TData
  loading = false
  pagination: {
    total: number
    current: number
    pageSize: number
    showQuickJumper: boolean
    showTotal: (total: number) => string
  }
  selectedRowKeys: number[] = []
  columns: any[] = []
  // 数据加载完后回调方法
  loadDataCallBack?: (data: TData) => {}
  /**
   * 构造方法
   * @date 2022-01-19
   * @param {any} pageIndex:number
   * @param {any} pageSize:number
   */
  constructor(pageIndex: number, pageSize: number) {
    this.pageIndex = pageIndex
    this.pageSize = pageSize
    this.pagination = {
      current: this.pageIndex,
      pageSize: this.pageSize,
      showQuickJumper: true,
      total: 0,
      showTotal: (total: number) => `共 ${total} 条 当前第 ${this.pageIndex} 页`,
    }
  }

  /**
   * 请求处理分页数据
   * @param {Function} funPaging
   */
  public async requestPaging(funPaging: (params?: any) => any) {
    const where = {
      ...this.where,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    this.loading = true
    try {
      this.selectedRowKeys = []
      const myData = await funPaging(where)
      this.dataSource = myData.list
      if (this.loadDataCallBack) this.loadDataCallBack(myData.list)
      this.pagination.total = myData.total
      this.pagination.current = myData.pageIndex
      this.pagination.pageSize = myData.pageSize
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }
}
