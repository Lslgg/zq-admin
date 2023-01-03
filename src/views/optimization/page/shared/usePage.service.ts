import { ESeoType, IColumn } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { TableColumnType } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { IForm } from '../../shared/useSeo.service'

interface IPageWhere {
  with_tree: number,
  type: number, // 2-product, 3-文章, 4-视频
  current_page: number,
  per_page: number,
  title?: string
}

/**
 * 列表查找分页
 */
export class UsePageListPagationService extends UseTableService<IColumn, IPageWhere> {
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} where:PagingParams<IPageWhere>
   * @return {any}
   */
  getList(where: IPageWhere): Promise<UsePaging<IColumn>> {
    return new Promise(async (resolve, reject) => {
      const params: IPageWhere = {
        with_tree: 1,
        type: where.type ?? 2, // 2-product, 3-文章, 4-视频
        current_page: this.pageIndex,
        per_page: this.pageSize
      }
      if (where.title) params.title = where.title
      const res = await API.seo.getSeoList<ResPagingData<IColumn>>(params)
      const list = res.data?.data ?? []
      resolve({
        total: res.data.total || 0,
        pageSize: res.data.per_page,
        pageIndex: res.data.current_page,
        list,
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
      { ...this.getColumns('序号', 'rowIndex'), customRender: ({ index }) => `${index + 1}`, width: 60 },
      { ...this.getColumns('名称', 'title'), width: 150 },
      { ...this.getColumns('SEO关键词', 'seo_keyword'), width: 150 },
      { ...this.getColumns('SEO标题', 'seo_title'), width: 150 },
      { ...this.getColumns('SEO描述', 'seo_description') },
      { ...this.getColumns('URL', 'path'), width: 150 },
      { ...this.getColumns('操作', 'action'), width: 150, fixed: 'right' },
    ]
  }
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class PageListOperationService extends UseTableOperationService<IColumn, IPageWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const tabList = [
      { title: '产品', value: 2 },
      { title: '文章', value: 3 },
      { title: '视频', value: 4 }
    ]
    const activeTab = ref(tabList[0].value)
    const filters = reactive({
      search: ''
    })
    const visible = ref<boolean>(false)
    const seoId = ref(0)

    const onChangeTab = () => {
      this.getPatationList({ ...this.paging.where, type: activeTab.value, title: '', current: 1 })
    }

    const onEdit = (record: IColumn) => {
      visible.value = true
      seoId.value = record.id
    }

    const onBuild = async (record: IColumn) => {
      const query = {
        site_id: UseCommon.ins().siteId,
        id: record.id,
        type: record.type,
        seo_keyword: record.seo_keyword,
        seo_item: ESeoType.seo_tdk
      } as any
      this.paging.loading = true
      const res = await API.seo.postSeoGetautotdk<IForm>(query)
      const data = res.data
      const params = { ...data, id: record.id, type: record.type, site_id: UseCommon.ins().siteId }
      API.seo.postSeoUpdate(params).then((_res) => {
        Utilts.ins().sleep(500)
        Utilts.ins().message('自动生成TDK成功', 'success')
        this.getPatationList({})
      })
    }

    const onSearch = () => {
      this.getPatationList({ ...this.paging.where, title: filters.search, current: 1 })
    }
    return {
      tabList,
      activeTab,
      filters,
      visible,
      seoId,
      onEdit,
      onBuild,
      onChangeTab,
      onSearch
    }
  }
}
