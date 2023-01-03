import SingleClass from '@/util/singleClass'
/**
 * 描述
 * @date 2022-06-01
 */
export class UseTreeService extends SingleClass {
  /**
  * 构造方法
  * @return {any}
  */
  static ins(): UseTreeService {
    return super.ins() as UseTreeService
  }

  /**
   * 将树形转换成一级列表
   * @date 2022-06-01
   * @param {any} tree:ITree[]
   * @return {any}
   */
  getListTree(tree: ITree[]) {
    const listTree: ITree[] = []
    const setList = (children: any[]) => {
      if (children && children.length > 0) {
        children.forEach(p => {
          listTree.push(p)
          setList(p.children)
        })
      }
    }
    setList(tree)
    return listTree
  }

  /**
   * 禁用当前节点下的所有节点
   * @date 2022-06-01
   * @param {any} tree:ITree[]
   * @param {any} level:number
   */
  setNowTreeLevelInfo(tree: ITree | undefined) {
    if (tree && tree.children && tree.children.length > 0) {
      tree.children?.forEach(p => {
        p.disabled = true
        if (p.children && p.children.length > 0) {
          this.setNowTreeLevelInfo(p)
        }
      })
    }
  }

  /**
   * 获取当前树形最大层级
   * @param {any} paramsArr
   * @return {any}
   */
  calculationLevel(paramsArr: any) {
    let maxLevel = 0
    const multiArr = (arr: ITree[], level: number) => {
      ++level
      maxLevel = Math.max(level, maxLevel)
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item.children && item.children.length > 0) {
          multiArr(item.children, level)
        } else {
          delete item.children
        }
      }
    }
    multiArr(paramsArr, 0)
    return maxLevel
  }
  /**
  * 删除空子集, 并且设置等级
  * @date 2022-04-15
  * @param {any} level:number
  * @param {any} list?:icategroy[]
  */
  public delChildrenEmity(level: number, list?: ITree[]) {
    if (!list) return
    for (let index = 0; index < list.length; index++) {
      const p = list[index]
      p.level = level
      if (p.children?.length === 0) {
        delete p.children
      } else this.delChildrenEmity(level + 1, p.children)
    }
  }
}
