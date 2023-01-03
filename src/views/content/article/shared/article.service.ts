import { IActiveCategroy, IArticle, IPagationWhere } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { TableColumnType } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { ContentService } from '../../shared/content.service'

type IArticleTable = IArticle & {
  articleUrl: string
  old_sort_num: number
  active_in_category: IActiveCategroy[]
  tags: KeyValue[]
  classify: string
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class UseOperation extends UseTableOperationService<IArticleTable, IPagationWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    let sortTimeout: any = null
    const onEdit = (id: number) => this.goUrl('editArticle', { id })
    /**
     * 删除数据
     * @date 2022-03-10
     * @param {any} id:number
     */
    const onDel = (id: number) => {
      this.delConfirm(() => {
        API.article
          .postArticleDelete<{ id: number }>({
            site_id: UseCommon.ins().siteId,
            ids: [id],
          })
          .then((res) => this.resultList())
      })
    }
    /**
     * 置顶
     * @date 2022-03-10
     * @param {any} id:number
     * @param {any} isTop:number
     */
    const onTop = (id: number | number[], isTop: number) => {
      const ids = Array.isArray(id) ? id : [id]
      const params = { ids, is_top: isTop }
      API.article.postArticleTop(params).then(() => this.resultList())
    }
    /**
     * 上下架
     * @date 2022-03-10
     * @param {number} id: number[]
     * @param {any} status:number
     */
    const onPublish = (id: number | number[], status: number) => {
      const ids = Array.isArray(id) ? id : [id]
      const params: any = {
        site_id: UseCommon.ins().siteId,
        ids,
        status: status,
      }
      API.article.postArticleStatus(params).then(() => this.resultList())
    }

    /**
     * 批量操作后更新数据
     * @date 2022-03-25
     * @param {any} val:string
     */
    const onOperate = () => {
      this.paging.selectedRowKeys = []
      this.resultList()
    }

    const onChangeSort = (record: IArticle) => {
      const info = this.paging.dataSource?.find((p) => p.id === record.id)
      if (info) {
        if (info.old_sort_num === info.sort_num) return
        if (sortTimeout) clearTimeout(sortTimeout)
        sortTimeout = setTimeout(() => {
          if (record.sort_num > 9999) record.sort_num = 9999
          const ids = [{ id: record.id, sort_num: record.sort_num }]
          const params = { site_id: UseCommon.ins().siteId, ids }
          API.article.postArticleOrder(params as any).then((res) => {
            info.old_sort_num = info.sort_num
            Utilts.ins().message('更改成功', 'success')
            this.resultList()
          })
        }, 1000)
      }
    }

    const onKeyword = (keyword: string) => {
      this.getPatationList({ ...this.paging.where, keyword, current: 1 })
    }

    return {
      onEdit,
      onDel,
      onTop,
      onPublish,
      onOperate,
      onKeyword,
      onChangeSort,
    }
  }
}

/**
 * 列表查找分页
 */
export class UsePagation extends UseTableService<IArticleTable, IPagationWhere> {
  /**
   * 获取列表数据
   * @date 2022-03-10
   * @param {any} where:PagingParams<IPagationWhere>
   * @return {any}
   */
  public getList(where: IPagationWhere): Promise<UsePaging<IArticleTable>> {
    return new Promise(async (resolve, reject) => {
      const params: IPagationWhere = {
        current_page: this.pageIndex,
        per_page: this.pageSize,
        title: where?.keyword ?? '',
        order: '-is_top,sort_num',
      }
      if (!params.title) delete params.title
      const otherParams = ContentService.ins().getOtherParams(where)
      const whereParams = { ...params, ...otherParams }
      API.article
        .getArticleList<ResPagingData<IArticleTable>>(whereParams)
        .then(async (res) => {
          const privateUrl = await UseCommon.ins().getPrivateUrl()
          res.data.data = res.data.data.map((p) => {
            const classifyList: string[] = []
            p.tags = p.active_in_category.map((item: any) => ({ key: item.category_id, value: item.category_name }))
            p.active_in_category.forEach((pp) => {
              classifyList.push(pp.category_name)
            })
            p.classify = classifyList.join(',')
            p.old_sort_num = p.sort_num
            p.articleUrl = `//${privateUrl}${p.path}${p.suffix}`
            return p
          })
          resolve({
            total: res.data.total,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            list: res.data.data,
          })
        })
        .catch((err) => reject(err))
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
      { ...this.getColumns('标题', 'title') },
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
