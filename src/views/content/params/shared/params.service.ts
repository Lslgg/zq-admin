import { UseCommon } from '@/util/useCommon'
import { API } from '@/api/apis'
import { IProductParam } from '@/api/api.model'
import router from '@/router'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { TableColumnType } from 'ant-design-vue'

interface IParamsWhere { }
type IProductTable = IProductParam & {
  is_allow_img_text: string,
  is_common_text: string,
  is_require_text: string,
  param_type_text: string,
  status_text: string,
  column: string
  opation: string
  defalutValue: string
  categoryName:string
}
/**
 * 表格列表
 * @date 2022-03-15
 * @param {any} where:PagingParams<IParamsWhere>
 */
export class ParamsTableService extends UseTableService<IProductTable, IParamsWhere> {
  /**
   * 描述
   * @date 2022-03-15
   * @param {any} where:PagingParams<IParamsWhere>
   * @return {any}
   */
  getList(where: PagingParams<IParamsWhere>): Promise<UsePaging<IProductTable>> {
    return new Promise(async (resolve, reject) => {
      const res = await API.product.getProductParamList<UsePaging<IProductTable>>(
        { site_id: UseCommon.ins().siteId, current_page: where.pageIndex, per_page: where.pageSize }
      )
      const list = res.data.data?.map((item) => {
        item.settingInfo = item.setting
        if (item.setting) {
          item.opation = item.settingInfo?.option?.join(',') ?? ''
          item.defalutValue = item.settingInfo?.default?.join(',') ?? ''
        }
        const columnList = item.active_in_category?.map((item: any) => item.title) ?? []
        const columns = [...new Set(columnList)]
        item.column = columns.join(',')
        const categoryNames = item.active_in_category?.map((item)=>item.category_name) ?? []
        if (item.is_common) categoryNames.push(item.is_common_text)
        const categoryName = categoryNames.join(',')
        item.categoryName = categoryName
        return item
      })
      resolve({
        total: res.data.total,
        pageIndex: res.data.pageIndex,
        pageSize: res.data.pageSize,
        list
      })
    })
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  columns(): TableColumnType<any>[] {
    return [
      { ...this.getColumns('参数名称', 'param_name'), width: 150 },
      { ...this.getColumns('产品分类', 'categoryName'), width: 150 },
      { ...this.getColumns('栏目', 'column'), width: 150 },
      { ...this.getColumns('参数值', 'opation') },
      { ...this.getColumns('展示方式', 'param_type_text'), width: 80 },
      { ...this.getColumns('必填', 'is_require_text'), width: 80 },
      { ...this.getColumns('默认值', 'defalutValue'), width: 150 },
      { ...this.getColumns('状态', 'status'), width: 90 },
      { ...this.getColumns('排序', 'sort_num'), width: 60 },
      { ...this.getColumns('操作', 'action'), width: 100, fixed: 'right' }
    ]
  }
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class ParamsOperationService extends UseTableOperationService<IProductTable, IParamsWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const onEdit = (id: number) => {
      if (id) router.push({ name: 'editParams', params: { id } })
      else router.push({ name: 'addParams' })
    }
    /**
     * 删除数据
     * @date 2022-03-10
     * @param {any} id:number
     */
    const onDel = (id: number) => {
      this.delConfirm(() => {
        const params = { site_id: UseCommon.ins().siteId, ids: [id] }
        API.product.postProductParamDelete(params)
          .then((res) => {
            this.delInfo(id)
            this.resultList()
          })
      })
    }
    const onChangeStatus = (record: IProductParam) => {
      const status = !record.status ? 0 : 1
      const ids = [record.id]
      const params: any = { site_id: UseCommon.ins().siteId, ids, status }
      API.product.postProductParamStatus(params)
    }

    return { onEdit, onDel, onChangeStatus }
  }
}

