import { API } from '@/api/apis'
import { UseTableService } from '@/util/useTableService'
import { TableColumnType } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { IInquiry } from '@/api/api.model'

interface IWhere {
  keyword: string
}

/**
 * 列表查找分页
 */
export class UsePagation extends UseTableService<IInquiry, IWhere> {
  /**
  * 获取列表数据
  * @date 2022-03-10
  * @param {any} where:PagingParams<IWhere>
  * @return {any}
  */
  public getList(where: IWhere): Promise<UsePaging<IInquiry>> {
    return new Promise(async (resolve, reject) => {
      API.inquiry.getInquiryList<UsePaging<IInquiry>>({
        current_page: this.pageIndex,
        per_page: 2,
        status: 1
      }).then((res) => {
        resolve({
          total: res.data.total,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          list: res.data.data,
        })
      }).catch(err => reject(err))
    })
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    const columns: ColumnType[] = [
      { ...this.getColumns('序号', 'rowIndex'), width: 60 },
      { ...this.getColumns('询盘邮箱', 'customer_email') },
      { ...this.getColumns('询盘内容', 'inquiry_content') },
      { ...this.getColumns('询盘类型', 'inquiry_type_text'), width: 90 },
      { ...this.getColumns('国家', 'customer_country'), width: 90 },
      { ...this.getColumns('询盘来源', 'inquiry_source_text'), width: 90 },
      { ...this.getColumns('状态', 'is_read'), width: 60 },
      { ...this.getColumns('询盘时间', 'created_at'), width: 160 },
    ]
    return columns
  }
}
