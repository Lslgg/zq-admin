import { API } from '@/api/apis'
import { INavigation } from '@/api/api.model'
import { UseTreeService } from '@/util/useTreeService'
import { UseCommon } from '@/util/useCommon'


export interface DesignContent {
  name: string
  page_type: string
  content_type: string
  page_id: number
  site_id: number
  content: string
}
/**
 * 列表查找分页
 */
export class CodeDesignTable {
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} type
   * @return {any}
   */
  getList(type: number): Promise<DesignContent[]> {
    return new Promise(async (resolve, reject) => {
      const designList = []
      const getPage = (name: string, page_type: string, content_type: string) => ({
        name, page_type, content_type, page_id: 0, site_id: UseCommon.ins().siteId, content: ''
      })
      switch (type) {
      case 1:
        designList.push(getPage('产品列表', 'list', 'product'))
        designList.push(getPage('产品详情', 'detail', 'product'))
        designList.push(getPage('文章列表', 'list', 'article'))
        designList.push(getPage('文章详情', 'detail', 'article'))
        designList.push(getPage('视频列表', 'list', 'video'))
        designList.push(getPage('视频详情', 'detail', 'video'))
        resolve(designList)
        break
      case 2:
        designList.push(getPage('404', 'system', '404'))
        designList.push(getPage('询盘成功', 'system', 'inquiry-success'))
        resolve(designList)
        break
      default:
        API.column.getColumnList<{ nav: INavigation[] }>({ with_tree: 1, per_page: 10000 })
          .then(res => {
            const list = res.data.nav.length ? res.data.nav : []
            const items = UseTreeService.ins().getListTree(list)
            const customerItems = items.filter((p: any) => p.page_type === 'customize') as any[]
            const designList = customerItems.map(p => ({
              name: p.title,
              page_type: p.page_type,
              content_type: p.content_type,
              page_id: p.page_id,
              site_id: UseCommon.ins().siteId,
              content: '',
            }))
            resolve(designList)
          })
        break
      }
    })
  }
}
