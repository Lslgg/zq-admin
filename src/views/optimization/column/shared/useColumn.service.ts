import { ESeoType, IColumn } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { TableColumnType } from 'ant-design-vue'
import { ref } from 'vue'
import { IForm } from '../../shared/useSeo.service'

interface IColumnWhere { }

/**
 * 描述
 * @date 2022-03-16
 * @return {any}
 */
export class UseColumnService {
  /**
   * 描述
   * @date 2022-03-16
   * @return {any}
   */
  public getColumn(): Promise<IColumn[]> {
    return new Promise((resolve, reject) => {
      API.column.getColumnList({ per_page: 20, pid: 0 })
        .then((res: any) => {
          resolve(res.data.nav)
        })
        .catch(err => console.error(err))
    })
  }

  /**
   * 描述
   * @date 2022-04-06
   * @return {any}
   */
  async useService() {
    const columnList = await this.getColumn()

    return {
      columnList
    }
  }
}


/**
 * 列表查找分页
 */
export class UseColumnListPagationService extends UseTableService<IColumn, IColumnWhere> {
  columnList: IColumn[]
  /**
   * 描述
   * @date 2022-04-06
   * @param {any} params:{pageIndex:number
   * @param {any} pageSize:number
   * @param {any} title:string}
   */
  constructor(params: { pageIndex: number, pageSize: number, columnList: IColumn[] }) {
    super(params.pageIndex, params.pageSize)
    this.columnList = params.columnList
  }
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} where:PagingParams<IColumnWhere>
   * @return {any}
   */
  getList(where: any): Promise<UsePaging<IColumn>> {
    return new Promise(async (resolve, reject) => {
      const columnId = this.columnList[0].id || 0
      const params = {
        pid: where?.columnId ?? columnId,
        with_tree: 1,
        type: 1
      }
      const res = await API.seo.getSeoList<any>(params)
      const list = res.data?.nav ?? []
      this.delChildrenEmity(list)
      resolve({
        total: 0,
        pageSize: 0,
        pageIndex: 0,
        list,
      })
    })
  }

  /**
   * 删除空子集
   * @date 2022-04-15
   * @param {any} list?:ICategroy[]
   */
  public delChildrenEmity(list?: IColumn[]) {
    if (!list) return
    for (let index = 0; index < list.length; index++) {
      const p = list[index]
      if (p.children?.length === 0) {
        delete p.children
      } else this.delChildrenEmity(p.children)
    }
  }

  /**
   * 描述
   * @date 2022-03-16
   * @return {any}
   */
  columns(): TableColumnType<any>[] {
    return [
      { ...this.getColumns('名称', 'title'), width: 150 },
      { ...this.getColumns('SEO关键词', 'seo_keyword'), width: 150 },
      { ...this.getColumns('SEO标题', 'seo_title'), width: 150 },
      { ...this.getColumns('SEO描述', 'seo_description'), width: 150 },
      { ...this.getColumns('URL', 'path'), width: 150 },
      { ...this.getColumns('操作', 'action'), width: 150, fixed: 'right' },
    ]
  }
}


/**
 * 表格操作
 * @date 2022-03-10
 */
export class ColumnListOperationService extends UseTableOperationService<IColumn, IColumnWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public async useOperation() {
    const currentMenu = ref(0)
    const visible = ref<boolean>(false)
    const tipsVisible = ref<boolean>(false)
    const seoId = ref(0)

    const onChangeTab = () => {
      this.getPatationList({ ...this.paging.where, columnId: currentMenu.value })
    }

    const onEdit = (record: IColumn) => {
      visible.value = true
      seoId.value = record.id
    }

    const onBuild = async (record: IColumn) => {
      const query = {
        site_id: UseCommon.ins().siteId,
        id: record.id,
        type: 1,
        seo_keyword: record.seo_keyword,
        seo_item: ESeoType.seo_tdk
      } as any
      this.paging.loading = true
      const res = await API.seo.postSeoGetautotdk<IForm>(query)
      const data = res.data
      const params = { ...data, id: record.id, type: 1, site_id: UseCommon.ins().siteId }
      API.seo.postSeoUpdate(params).then(async (_res) => {
        Utilts.ins().message('自动生成TDK成功', 'success')
        await Utilts.ins().sleep(500)
        this.getPatationList({})
      }).catch(p => this.paging.loading = false)
    }

    return {
      currentMenu,
      visible,
      tipsVisible,
      seoId,
      onEdit,
      onBuild,
      onChangeTab
    }
  }
}
