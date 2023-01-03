import { Utilts } from './utilts'
import router from '@/router'
import { Paging } from './paging'

/**
 * 表格操作
 * @date 2022-03-10
 * @return {any}
 */
export abstract class UseTableOperationService<IList, IWhere> {
  public getPatationList: (payload: any, filters?: {}, sorter?: {}) => void
  public paging: Paging<IList[], IWhere>
  /**
   * 描述
   * @date 2022-03-10
   * @param {any} paging:Paging<IList,IWhere>
   * @param {any} getPatationList:Function
   */
  constructor(paging: Paging<IList[], IWhere>, getPatationList: (payload: any, filters?: {}, sorter?: {}) => void) {
    this.getPatationList = getPatationList
    this.paging = paging
  }

  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  abstract useOperation(): any

  /**
   * 获取当前选中的数据
   * @date 2022-03-10
   * @param {any} id:number
   * @return {any}
   */
  getInfo(id: number) {
    const info = this.paging.dataSource?.find((p: any) => {
      return p.id === id
    })
    return info
  }

  /**
   * 跳转url
   * @date 2022-03-21
   * @param {any} name:string
   * @param {any} params
   */
  goUrl(name: string, params: any) {
    router.push({ name, params })
  }

  /**
   * 删除表格数据
   * @date 2022-03-10
   * @param {any} id:number
   */
  delInfo(id: number) {
    this.paging.dataSource = this.paging.dataSource?.filter((p: any) => p.id !== id)
    Utilts.ins().message('删除成功')
  }

  /**
   * 重置表格
   * @date 2022-03-10
   */
  resultList() {
    this.paging.pageIndex = 1
    this.paging.dataSource = []
    this.getPatationList({ ...this.paging.where, current: 1 }, {}, {})
  }

  /**
   * 删除提示
   * @date 2022-03-21
   * @param {any} okCallBack:any
   * @param {any} cancelCallBack:any
   */
  delConfirm(okCallBack: () => void, cancelCallBack?: () => void) {
    Utilts.ins().confirm({ cancelCallBack, okCallBack })
  }
}
