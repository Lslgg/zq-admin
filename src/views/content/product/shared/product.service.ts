import { Utilts } from '@/util/utilts'
import { IActiveCategroy, IPagationWhere, IProduct } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { TableColumnType } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { ContentService } from '../../shared/content.service'

type IproductTable = IProduct & {
  active_in_category: IActiveCategroy[]
  tags: KeyValue[]
  classify: string
  productUrl: string
  old_sort_num: number
  category: string
}
/**
 * 表格操作
 * @date 2022-03-10
 */
export class ProductOperationService extends UseTableOperationService<IproductTable, IPagationWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const onEdit = (id: number) => this.goUrl('editProduct', { id })
    let sortTimeout: any = null
    /**
     * 删除数据
     * @date 2022-03-10
     * @param {any} id:number
     */
    const onDel = (id: number) => {
      this.delConfirm(() => {
        API.product
          .postProductDelete({ site_id: UseCommon.ins().siteId, ids: [id] })
          .then((res) => {
            if (res.data) {
              this.delInfo(id)
              this.resultList()
            }
          })
      })
    }
    const onTop = (id: number, is_top: boolean) => {
      const params: any = {
        site_id: UseCommon.ins().siteId,
        ids: [id],
        is_top: is_top ? 1 : 0,
      }
      API.product.postProductTop(params).then((res) => {
        if (res.data) {
          Utilts.ins().message('操作成功')
          this.resultList()
        }
      })
    }
    const onPublish = (id: number, status: boolean) => {
      const params: any = {
        site_id: UseCommon.ins().siteId,
        ids: [id],
        status: status ? 1 : 0,
      }
      API.product.postProductStatus(params).then((res) => {
        if (res.data) {
          Utilts.ins().message('操作成功')
          this.resultList()
        }
      })
    }
    const onResultList = () => {
      this.paging.selectedRowKeys = []
      this.resultList()
    }
    const onSearch = (keyword: string) => {
      this.getPatationList({ ...this.paging.where, title: keyword, current: 1 })
    }
    const onChangeSort = (record: IproductTable) => {
      const info = this.paging.dataSource?.find((p) => p.id === record.id)
      if (info) {
        if (sortTimeout) clearTimeout(sortTimeout)
        sortTimeout = setTimeout(() => {
          if (info.old_sort_num === info.sort_num) return
          if (record.sort_num > 9999) record.sort_num = 9999
          const ids = [{ id: record.id, sort_num: record.sort_num }]
          const params = { site_id: UseCommon.ins().siteId, ids }
          API.product.postProductOrder(params as any).then((res) => {
            info.old_sort_num = info.sort_num
            Utilts.ins().message('更改成功', 'success')
            this.resultList()
          })
        }, 1000)
      }
    }
    return {
      onSearch,
      onResultList,
      onEdit,
      onDel,
      onTop,
      onPublish,
      onChangeSort,
    }
  }
}

/**
 * 列表查找分页
 */
export class UseProductPagationService extends UseTableService<IproductTable, IPagationWhere> {
  /**
   * 获取列表数据
   * @date 2022-03-10
   * @param {any} where: IPagationWhere
   * @return {any}
   */
  public getList(where: IPagationWhere): Promise<UsePaging<IproductTable>> {
    return new Promise(async (resolve, reject) => {
      const params: IPagationWhere = {
        current_page: this.pageIndex,
        per_page: this.pageSize,
        title: where.title || '',
      }
      if (!params.title) delete params.title
      const otherParams = ContentService.ins().getOtherParams(where)
      const whereParams = { ...params, ...otherParams }
      const resData = await API.product.getProductList<UsePaging<IproductTable>>(whereParams)
      const data = resData.data || []
      const privateUrl = await UseCommon.ins().getPrivateUrl()
      // 设置显示的栏目名和分类名
      const list = data.data?.map((p) => {
        const classifyList: string[] = []
        const categorys = p.active_in_category || []
        p.tags = categorys.map((item: any) => ({ key: item.category_id, value: item.category_name }))
        categorys.forEach((pp) => {
          classifyList.push(pp.category_name)
        })
        p.classify = classifyList.join(',')
        p.productUrl = `//${privateUrl}${p.path}${p.suffix}`
        return p
      })
      resolve({
        total: data.total,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        list: list,
      })
    })
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    const columns: ColumnType[] = [
      { ...this.getColumns('序号', 'rowIndex') },
      { ...this.getColumns('产品名称', 'title') },
      { ...this.getColumns('分类', 'category'), customFilterDropdown: true },
      { ...this.getColumns('创建时间', 'created_at'), customFilterDropdown: true },
      { ...this.getColumns('上下架', 'status'), customFilterDropdown: true },
      { ...this.getColumns('更新时间', 'updated_at', true) },
      { ...this.getColumns('排序', 'sort_num', true) },
      { ...this.getColumns('操作', 'action'), width: 150, fixed: 'right' },
    ]
    return columns
  }
}
