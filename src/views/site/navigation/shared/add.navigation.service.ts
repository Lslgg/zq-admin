import { UseCommon } from '@/util/useCommon'
import { API } from '@/api/apis'
import { IColumnPageType, INavigation } from '@/api/api.model'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'

type emitType = (event: 'update:visible' | 'onAddSubmit', ...args: any[]) => void
/**
 * 分类表单操作
 */
export class AddNavigationService extends UseFormService<INavigation> {
  id = 0
  pid = 0
  emit: emitType
  /**
   * 描述
   * @date 2022-06-01
   * @param {any} id:number
   * @param {any} pid:number
   * @param {any} emit:number
   * @param {any} visible:emitType
   */
  constructor(id: number, pid: number, emit: emitType) {
    super()
    this.id = id
    this.pid = pid
    this.emit = emit
  }
  /**
   * 描述
   * @date 2022-03-15
   * @param {number} info
   * @return {any}
   */
  async initForm(): Promise<INavigation> {
    let res: any = {}
    if (this.id) {
      res = await API.column.getColumnGet<INavigation>({ id: this.id ?? 0 })
    }
    const info: INavigation = res.data || {}
    const pid = info.pid || this.pid
    const category_ids = info.active_in_category?.filter(p => p.id)?.map(item => item.id ?? 0) || []
    return {
      id: info.id,
      site_id: UseCommon.ins().siteId,
      title: info.title,
      content_type: info.content_type,
      page_type: info.page_type,
      status: info.status || 0,
      pid,
      category_ids,
      level: 0
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
      content_type: [this.isRequired('页面类型')],
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @param {INavigation} info
   * @param {ITree} pItem
   */
  async onSubmit(info: INavigation) {
    Utilts.ins().removeValueByObjName(info, 'level')
    if (info.title.trim() === '') {
      this.message('请填写标题', 'warn')
      return
    }
    if (this.modelRef.id) {
      API.column.postColumnUpdate(info)
        .then(res => {
          this.message(res.data ? '修改成功' : '修改失败', 'success')
          this.emit('onAddSubmit')
        })
    } else {
      API.column.postColumnAdd(info)
        .then(res => {
          this.message(res.data ? '添加成功' : '添加失败', 'success')
          this.emit('onAddSubmit')
        })
    }
  }

  /**
   * 获取页面类型
   * @date 2022-05-31
   * @return {any}
   */
  getConstantList(): Promise<IColumnPageType[]> {
    return new Promise((resolve, reject) => {
      API.config.getConstantGet<IColumnPageType[]>({ constant_name: 'columnPageType' })
        .then(res => {
          resolve(res.data)
        })
    })
  }
}
