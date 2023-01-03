import SingleClass from '@/util/singleClass'

/**
 * ContentService
 */
export class ContentService extends SingleClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): ContentService {
    return super.ins() as ContentService
  }

  /**
  * 产品，文章，视频列表查找条件
  * @param {IWhere} params
  * @return {IWhere}
  */
  public getOtherParams(params: any) {
    const myParams: { [index: string]: any } = {}
    // 上下架
    if (params.status !== null && params.status > -1) myParams.status = params.status
    else if (params.status <= -1) delete myParams.status
    else if (params.status === undefined) delete myParams.status
    // 分类
    if (!params.category_ids || params.category_ids.length === 0) {
      delete myParams.category_ids
    } else if (params.category_ids.length > 0) {
      myParams.category_ids = params.category_ids
    }
    // 开始时间
    if (params.start_date) {
      myParams.start_date = params.start_date
    } else if (!params.start_date) {
      delete myParams.start_date
    }
    // 结束时间
    if (params.end_date) {
      myParams.end_date = params.end_date
    } else if (!params.end_date) {
      delete myParams.end_date
    }
    // 排序
    if (params.field && params.order) {
      myParams.order = params.order === 'ascend' ? '' : '-'
      myParams.order += params.field
      myParams.order = `-is_top,${myParams.order}`
    } else {
      myParams.order = '-is_top,sort_num'
    }
    return myParams
  }
}
