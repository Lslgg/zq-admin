import { UseTreeService } from '@/util/useTreeService'
import { API } from '@/api/apis'
import { INavigation } from '@/api/api.model'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { TableColumnType } from 'ant-design-vue'
import { ref } from 'vue'
import { UseCommon } from '@/util/useCommon'
import { Utilts } from '@/util/utilts'

export interface INavigationWhere { }
/**
 * 列表查找分页
 */
export class NavigationTable extends UseTableService<INavigation, INavigationWhere> {
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} where:PagingParams<INavigationWhere>
   * @return {any}
   */
  getList(where: any): Promise<UsePaging<INavigation>> {
    return new Promise(async (resolve, reject) => {
      API.column.getColumnList<{ nav: INavigation[] }>({ with_tree: 1, per_page: 10000 })
        .then(res => {
          const list = res.data.nav.length ? res.data.nav : []
          UseTreeService.ins().delChildrenEmity(1, list)
          resolve({
            total: 0,
            pageSize: 0,
            pageIndex: 0,
            list,
          })
        })
    })
  }

  /**
   * 描述
   * @date 2022-03-16
   * @return {any}
   */
  columns(): TableColumnType<any>[] {
    return [
      { ...this.getColumns('页面名称', 'title') },
      { ...this.getColumns('页面类型', 'content_type_text') },
      { ...this.getColumns('绑定分类', 'active_in_category'), width: '280px' },
      { ...this.getColumns('URL地址', 'path') },
      { ...this.getColumns('启用状态', 'status') },
      { ...this.getColumns('排序', 'sort_num') },
      { ...this.getColumns('修改时间', 'updated_at') },
      { ...this.getColumns('操作', 'action'), width: 150, fixed: 'right' },
    ]
  }
}

/**
 * 分类表格操作
 * @date 2022-03-10
 */
export class NavigationOperation extends UseTableOperationService<INavigation, INavigationWhere> {
  /**
   * 获取分类详情
   * @date 2022-03-26
   * @param {any} id:number
   * @return {any}
   */
  getDetail(id: number) {
    return new Promise((resolve, reject) => {
      resolve(null)
    })
  }

  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const addVisible = ref<boolean>(false)
    const id = ref<number>(0)
    const pid = ref<number>(0)
    let sortTimeout: any = null
    const onAdd = () => {
      id.value = 0
      addVisible.value = true
    }
    const onChangeStatus = (info: INavigation) => {
      const status = info.status
      API.column.postColumnUpdate({ id: info.id, site_id: info.site_id, status })
        .then(res => {
          Utilts.ins().message('修改成功')
        })
    }
    const onEdit = (editId: number) => {
      addVisible.value = true
      id.value = editId
    }
    const onDel = (id: number) => {
      const treeList = UseTreeService.ins().getListTree(this.paging.dataSource as INavigation[])
      Utilts.ins().confirm({
        title: '删除后不可恢复，确定要删除吗？',
        okCallBack: () => {
          const info = treeList.find(p => p.id === id)
          if ((info?.children?.length || 0) > 0) {
            Utilts.ins().message('带有子集的导航页面只能修改,不能删除!', 'warn')
            return
          }
          API.column.postColumnDelete({ site_id: UseCommon.ins().siteId, ids: [id] })
            .then(res => {
              Utilts.ins().message('删除成功!')
              this.resultList()
            })
        }
      })
    }
    const onAddNext = (addPid: number) => {
      id.value = 0
      pid.value = addPid
      addVisible.value = true
    }
    const onAddSubmit = () => {
      this.resultList()
      addVisible.value = false
    }
    const onChangeSort = (info: INavigation) => {
      if (info) {
        // 如果未改变不更新
        if (info.old_sort_num === info.sort_num) return
        // 节流
        if (sortTimeout) clearTimeout(sortTimeout)
        sortTimeout = setTimeout(() => {
          // 最大 9999
          if ((info.sort_num ?? 0) > 9999) info.sort_num = 9999
          const params = { site_id: UseCommon.ins().siteId, id: info.id, sort_num: info.sort_num }
          API.column.postColumnUpdate(params as any).then((res) => {
            info.old_sort_num = info.sort_num
            Utilts.ins().message('更改成功', 'success')
            this.resultList()
          })
        }, 1000)
      }
    }
    return {
      id,
      pid,
      addVisible,
      onAdd,
      onAddNext,
      onChangeStatus,
      onEdit,
      onDel,
      onAddSubmit,
      onChangeSort
    }
  }
}

