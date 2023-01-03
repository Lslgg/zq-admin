import { IPagationWhere } from '@/api/api.model'
import { IActiveCategroy, IVideo } from '@/api/api.model'
import { API } from '@/api/apis'
import { UseCommon } from '@/util/useCommon'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { TableColumnType } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { ContentService } from '../../shared/content.service'

type IVideoTable = IVideo & {
  videoUrl: string
  imgUrl: string
  old_sort_num: number
  active_in_category: IActiveCategroy[]
  tags: KeyValue[]
  classify: string
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class UseOperation extends UseTableOperationService<
  IVideoTable,
  IPagationWhere
> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const onEdit = (id: number) => this.goUrl('editVideo', { id })
    let sortTimeout: any = null
    /**
     * 删除数据
     * @date 2022-03-10
     * @param {any} id:number
     */
    const onDel = (id: number | number[]) => {
      const ids = Array.isArray(id) ? id : [id]
      this.delConfirm(() => {
        API.video
          .postVideoDelete<{ id: number }>({
            site_id: UseCommon.ins().siteId,
            ids,
          })
          .then((res) => this.resultList())
          .catch((err) => {
            Utilts.ins().message(err.mssage, 'error')
            console.error(err)
          })
      })
    }
    /**
     * 置顶
     * @date 2022-03-10
     * @param {any} id:number
     * @param {any} isTop:number
     */
    const onTop = (id: number | number[], isTop: boolean) => {
      const ids = Array.isArray(id) ? id : [id]
      const params = {
        site_id: UseCommon.ins().siteId,
        ids,
        is_top: isTop ? 1 : 0,
      }
      API.video
        .postVideoTop(params)
        .then(() => this.resultList())
        .catch((err) => {
          Utilts.ins().message(err.mssage, 'error')
          console.error(err)
        })
    }
    /**
     * 上下架
     * @date 2022-03-10
     * @param {number} id: number[]
     * @param {any} status:number
     */
    const onPublish = (id: number | number[], status: boolean) => {
      const ids = Array.isArray(id) ? id : [id]
      const params = {
        site_id: UseCommon.ins().siteId,
        ids,
        status: status ? 1 : 0,
      }
      API.video
        .postVideoStatus(params)
        .then(() => this.resultList())
        .catch((err) => {
          Utilts.ins().message(err.mssage, 'error')
          console.error(err)
        })
    }

    /**
     * 批量操作
     * @date 2022-03-25
     * @param {any} val:string
     */
    const onOperate = (val: string) => {
      this.paging.selectedRowKeys = []
      this.resultList()
    }

    const onChangeSort = (record: IVideo) => {
      const info = this.paging.dataSource?.find((p) => p.id === record.id)
      if (sortTimeout) clearTimeout(sortTimeout)
      if (info) {
        sortTimeout = setTimeout(() => {
          if (info.old_sort_num === info.sort_num) return
          if (record.sort_num > 9999) record.sort_num = 9999
          const ids = [{ id: record.id, sort_num: record.sort_num }]
          const params = { site_id: UseCommon.ins().siteId, ids }
          API.video.postVideoOrder(params as any).then((res) => {
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
      onTop,
      onPublish,
      onEdit,
      onDel,
      onOperate,
      onChangeSort,
      onKeyword,
    }
  }
}

/**
 * 列表查找分页
 */
export class UsePagation extends UseTableService<IVideoTable, IPagationWhere> {
  /**
   * 获取列表数据
   * @date 2022-03-10
   * @param {any} where:PagingParams< IPagationWhere>
   * @return {any}
   */
  public getList(where: IPagationWhere): Promise<UsePaging<IVideoTable>> {
    return new Promise(async (resolve, reject) => {
      const params: IPagationWhere = {
        current_page: this.pageIndex,
        per_page: this.pageSize,
        title: where.keyword ?? '',
        order: '-is_top,sort_num',
      }
      if (!params.title) delete params.title
      const otherParams = ContentService.ins().getOtherParams(where)
      const whereParams = { ...params, ...otherParams }
      API.video
        .getVideoList<ResPagingData<IVideoTable>>(whereParams)
        .then(async (res) => {
          const privateUrl = await UseCommon.ins().getPrivateUrl()
          res.data.data = res.data.data.map((p) => {
            const classifyList: string[] = []
            const categoryList = p.active_in_category || []
            p.tags = categoryList.map((item: any) => ({ key: item.category_id, value: item.category_name }))
            categoryList.forEach((pp) => {
              classifyList.push(pp.category_name)
            })
            p.classify = classifyList.join(',')
            p.videoUrl = `//${privateUrl}${p.path}${p.suffix}`
            if (p.front_cover?.url) p.imgUrl = p.front_cover.url
            else if (p.video?.url) p.imgUrl = Utilts.ins().getVideoImg(p.video.url)
            else p.imgUrl = ''
            return p
          })
          resolve({
            total: res.data.total,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            list: res.data.data,
          })
        })
    })
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @param {Boolean} filterVisible
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    const columns: ColumnType[] = [
      { ...this.getColumns('序号', 'rowIndex') },
      { ...this.getColumns('标题', 'title'), width: 200 },
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
