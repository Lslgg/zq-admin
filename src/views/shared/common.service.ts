import SingletonClass from '@/util/singleClass'
import { API } from '@/api/apis'
import { ICategroy } from '@/api/api.model'

/**
 * 描述
 * @date 2022-05-16
 */
export class CommonService extends SingletonClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): CommonService {
    return super.ins() as CommonService
  }

  /**
 * 描述
 * @date 2022-04-25
 * @param {any} type:any
 * @return {any}
 */
  async getTreeList(type: any): Promise<{ keyList: number[], treeList: ITree[] }> {
    const resInfo = await API.category.getCategoryList<ICategroy[]>(
      { category_type: type, with_column: 1 }
    )
    // 将数据转换成ITree[]
    if (!Array.isArray(resInfo.data)) return { keyList: [], treeList: [] }
    const dataTreeList = resInfo.data.map(p => {
      const info: ITree = {
        key: p.id, id: p.id, pid: p.pid, title: p.category_name,
        disabled: false, children: [], level: 1,
      }
      return info
    })
    const keyList = dataTreeList.map(p => (+p.id) || 0)
    // 将数据递归为树形
    const listToTree = (pid: number | string, level: number) => {
      const list = dataTreeList.filter(p => p.pid === pid)
      if (list.length === 0) return
      else {
        list.forEach(p => {
          p.level += level
          p.children = listToTree(p.id, p.level)
        })
        return list
      }
    }
    const treeList = listToTree(0, 0) ?? []
    return { keyList, treeList }
  }
}
