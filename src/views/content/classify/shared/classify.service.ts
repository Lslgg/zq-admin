import { ICategroy, IClassifyForm, IColumn } from '@/api/api.model'
import { API } from '@/api/apis'
import { Paging } from '@/util/paging'
import { UseCommon } from '@/util/useCommon'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { TableColumnType } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { reactive, ref } from 'vue'

export interface IWhere {
  columnId: number
}
/**
 * 描述
 * @date 2022-03-28
 * @return {any}
 */
export class UseClassifyService {
  categoryType: number
  /**
   * 描述
   * @date 2022-03-28
   * @param {any} categoryType:number
   */
  constructor(categoryType: number) {
    this.categoryType = categoryType
  }
  /**
   * 获取栏目列表
   * @date 2022-03-28
   * @return {any}
   */
  public getColumnList(): Promise<Result<{ nav: IColumn[]; other: IColumn[] }>> {
    return new Promise((resolve, reject) => {
      const arr = ['product', 'article', 'video']
      const params = {
        current_page: 1,
        per_page: 1000,
        page_type: 'list',
        pid: 0,
        content_type: arr[this.categoryType - 1],
      }
      API.column.getColumnList(params).then((res: any) => resolve(res))
    })
  }

  /**
   * 描述
   * @date 2022-03-28
   * @return {any}
   */
  public async useService() {
    const res: Result<{ nav: IColumn[]; other: IColumn[] }> =
      await this.getColumnList()
    const columns = res.data.nav
    return { columns }
  }
}

/**
 * 分类表格列表
 */
export class UseClassifyPagation extends UseTableService<ICategroy, IWhere> {
  categoryType: number
  myColumns: IColumn[]
  /**
   * 描述
   * @date 2022-03-26
   * @param {any} categoryType:number
   * @param {IColumn[]} columns
   */
  constructor(categoryType: number, columns: IColumn[]) {
    super(1, 10)
    this.categoryType = categoryType
    this.myColumns = columns
  }
  /**
   * 获取列表数据
   * @date 2022-03-10
   * @param {any} where:PagingParams<IWhere>
   * @return {any}
   */
  public getList(where: IWhere): Promise<UsePaging<ICategroy>> {
    return new Promise(async (resolve, reject) => {
      const params = {
        category_type: this.categoryType,
        with_tree: 1,
      }
      const res = await API.category.getCategoryList<ICategroy[]>(params)
      const list = res.data.length ? res.data : []
      this.delChildrenEmity(0, list)
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
   * @param {any} deep:number
   * @param {any} list?:ICategroy[]
   */
  public delChildrenEmity(deep: number, list?: ICategroy[]) {
    if (!list) return
    for (let index = 0; index < list.length; index++) {
      const p = list[index]
      p.deep = deep
      if (p.children?.length === 0) {
        delete p.children
      } else this.delChildrenEmity(deep + 1, p.children)
    }
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    const columns: ColumnType[] = [
      { ...this.getColumns('分类名称', 'category_name') },
      { ...this.getColumns('启用状态', 'status') },
      { ...this.getColumns('操作', 'action'), width: 210 },
    ]
    return columns
  }
}

/**
 * 分类表格操作
 * @date 2022-03-10
 */
export class UseClassifyOperation extends UseTableOperationService<
  ICategroy,
  IWhere
> {
  categoryType: number
  /**
   * 描述
   * @date 2022-03-30
   * @param {any} paging:Paging<IList[]IWhere>
   * @param {any} getPatationList:Function
   * @param {any} categoryType
   */
  constructor(
    paging: Paging<ICategroy[], IWhere>,
    getPatationList: (payload: any, filters?: {}, sorter?: {}) => void,
    categoryType: number
  ) {
    super(paging, getPatationList)
    this.categoryType = categoryType
  }
  /**
   * 获取分类详情
   * @date 2022-03-26
   * @param {any} id:number
   * @return {any}
   */
  getDetail(id: number) {
    return new Promise((resolve, reject) => {
      API.category.getCategoryGet({ id }).then((res: any) => resolve(res))
    })
  }
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const activeKey = ref<number>(1)
    const visible = ref<boolean>(false)
    const category = reactive<Partial<IClassifyForm>>({
      id: 0,
      pid: 0,
      category_name: '',
    })
    // 删除数据
    const onDel = (ids: number | number[], categoryType: number) => {
      const params: any = {
        site_id: UseCommon.ins().siteId ?? 0,
        category_type: categoryType,
      }
      params.ids = Array.isArray(ids) ? ids : [ids]
      Utilts.ins().confirm({
        title: '是否确认删除此分类',
        okCallBack: () => {
          API.category
            .postCategoryDelete(params)
            .then((res: any) => {
              this.resultList()
            })
        },
      })
    }

    const setCategory = (info: ICategroy) => {
      category.id = info.id ?? 0
      category.pid = info.pid
      category.category_name = info.category_name
      category.category_type = this.categoryType
      visible.value = true
    }

    const onAdd = (id?: number) => {
      setCategory({ pid: id } as any)
    }

    const onEdit = async (id: number) => {
      const res: any = await this.getDetail(id)
      if (!res.data) return
      const info = res.data
      setCategory(info)
    }

    const onBack = () => window.history.go(-1)

    const onChangeStatus = (record: ICategroy) => {
      const params = {
        site_id: UseCommon.ins().siteId,
        ids: [record.id],
        status: record.status,
      }
      API.category.postCategoryStatus(params as any).then((res) => {
        Utilts.ins().message('更改成功', 'success')
      })
    }

    const onAddSuccess = () => this.resultList()
    return {
      activeKey,
      visible,
      category,
      onBack,
      onAdd,
      onEdit,
      onDel,
      onChangeStatus,
      onAddSuccess,
    }
  }
}
