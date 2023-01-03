import { reactive, ref } from 'vue'
import SingletonClass from '@/util/singleClass'
import { FormInstance, TableColumnType } from 'ant-design-vue'
import { UseTableService } from '@/util/useTableService'
import { UseTableOperationService } from '@/util/useTableOpationService'

interface IFaqList {
  id: number,
  question: string,
  answer: string,
  editTime: string
}

interface IFaqListWhere { }

/**
 * 描述
 * @date 2022-03-10
 * @return {any}
 */
export class FaqService extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): FaqService {
    return super.ins() as FaqService
  }

  /**
   * getFaqList
   * @param {PagingParams} where
   * @return {any}
   */
  public getFaqList(where: PagingParams<IFaqListWhere>): Promise<UsePaging<IFaqList>> {
    return new Promise(async (resolve, reject) => {
      const list = await this.getInfo(where.pageIndex)
      const info = {
        total: 100,
        pageSize: where.pageSize,
        pageIndex: where.pageIndex,
        list,
      }
      setTimeout(() => {
        resolve(info)
      }, 500)
    })
  }

  /**
   * 获取优势信息
   * @param {any} pageIndex:number
   * @return {any}
   */
  private getInfo(pageIndex: number): Promise<IFaqList[]> {
    return new Promise((resolve) => {
      const res = [
        { id: 1, question: '问题1', answer: '答案1', editTime: '2021-11-05 16:08:43' },
      ]
      resolve(res)
    })
  }
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class FaqOperationService extends UseTableOperationService<IFaqList, IFaqListWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const visible = ref(false)
    const form = reactive({
      question: '',
      answer: '',
    })
    const formRef: any = ref<FormInstance>()
    const submitType = ref('add')
    // let submitRecord: IFaqList

    const add = () => {
      form.question = ''
      form.answer = ''
      visible.value = true
      submitType.value = 'add'
    }

    const edit = (id: number) => {
      const record = this.getInfo(id)
      if (record) {
        submitType.value = 'edit'
        // submitRecord = reactive(record)
        form.answer = record.answer
        form.question = record.question
      }
      visible.value = true
    }

    /**
     * 删除数据
     * @date 2022-03-10
     * @param {any} id:number
     */
    const del = (id: number) => {
      this.delInfo(id)
      this.resultList()
    }

    const submit = () => {
      formRef.value.validate()
        .then((key: any) => {
          if (submitType.value === 'edit') {
            formRef.value.resetFields()
            visible.value = false
          }
        })
        .catch((err: any) => console.log(err))
    }

    return {
      visible,
      form,
      formRef,
      add,
      edit,
      submit,
      del
    }
  }
}

/**
 * 列表查找分页
 */
export class UseFaqPagationService extends UseTableService<IFaqList, IFaqListWhere> {
  /**
  * 获取列表数据
  * @date 2022-03-10
  * @param {any} where:PagingParams<IFaqListWhere>
  * @return {any}
  */
  public getList(where: PagingParams<IFaqListWhere>): Promise<UsePaging<IFaqList>> {
    return FaqService.ins().getFaqList(where)
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    return [
      { title: '序号', dataIndex: 'rowIndex', key: 'rowIndex', customRender: ({ index }) => `${index + 1}`, width: 100 },
      { title: '问题', dataIndex: 'question', key: 'question' },
      { title: '答案', dataIndex: 'answer', key: 'answer' },
      { title: '编辑时间', dataIndex: 'editTime', key: 'editTime', sorter: true },
      { title: '操作', key: 'action', width: 210 }
    ]
  }
}
