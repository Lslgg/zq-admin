import { reactive, ref } from 'vue'
import SingletonClass from '@/util/singleClass'
import { FormInstance, TableColumnType } from 'ant-design-vue'
import { UseTableService } from '@/util/useTableService'
import { UseTableOperationService } from '@/util/useTableOpationService'

interface IAdvantageList {
  num?: number,
  id: number,
  content: string,
  time: string,
}

interface IAdvantageListWhere { }

/**
 * AdvantageService
 */
export class AdvantageService extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): AdvantageService {
    return super.ins() as AdvantageService
  }

  /**
   * getAdvantageList
   * @param {PagingParams} where
   * @return {any}
   */
  public getAdvantageList(where: PagingParams<IAdvantageListWhere>): Promise<UsePaging<IAdvantageList>> {
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
   * addAdvantageList
   * @param {string} content
   * @return {any}
   */
  public addAdvantageList(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('')
    })
  }

  /**
   * updateAdvantageList
   * @param {string} content
   * @param {number} id
   * @return {any}
   */
  public updateAdvantageList(content: string, id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('')
    })
  }

  /**
   * 获取优势信息
   * @param {any} pageIndex:number
   * @return {any}
   */
  private getInfo(pageIndex: number): Promise<IAdvantageList[]> {
    return new Promise((resolve) => {
      const res = [
        { id: 1, content: 'hello world', time: '2022-03-09' },
        { id: 2, content: 'hello world', time: '2022-03-09' },
        { id: 3, content: 'hello world', time: '2022-03-09' },
        { id: 4, content: 'hello world', time: '2022-03-09' },
        { id: 5, content: 'hello world', time: '2022-03-09' }
      ]
      const data = res.map((item, index) => {
        return { ...item, num: index + 1 }
      })
      resolve(data)
    })
  }
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class AdvantageOperationService extends UseTableOperationService<IAdvantageList, IAdvantageListWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const visible = ref(false)
    const form = reactive({ content: '' })
    const formRef: any = ref<FormInstance>()
    const submitType = ref('add')
    let submitRecord: IAdvantageList
    /**
     * 描述
     * @date 2022-03-11
     */
    const add = () => {
      visible.value = true
      submitType.value = 'add'
      form.content = ''
    }

    /**
     * 描述
     * @date 2022-03-11
     * @param {any} id:number
     */
    const edit = (id: number) => {
      const record = this.getInfo(id)
      if (record) {
        submitRecord = reactive(record)
        form.content = record.content
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

    /**
     * 描述
     * @date 2022-03-11
     */
    const submit = () => {
      formRef.value.validate().then((key: any) => {
        if (submitType.value === 'add') {
          AdvantageService.ins().addAdvantageList(form.content).then(() => {
            this.resultList()
            form.content = ''
            visible.value = false
          })
        } else {
          AdvantageService.ins().updateAdvantageList(form.content, submitRecord.id).then(() => {
            submitRecord.content = form.content
            form.content = ''
            visible.value = false
          })
        }
      })
    }

    return {
      visible,
      form,
      formRef,
      add,
      edit,
      del,
      submit
    }
  }
}


/**
 * 列表查找分页
 */
export class UseAdvantagePagationService extends UseTableService<IAdvantageList, IAdvantageListWhere> {
  /**
  * 获取列表数据
  * @date 2022-03-10
  * @param {any} where:PagingParams<IAdvantageListWhere>
  * @return {any}
  */
  public getList(where: PagingParams<IAdvantageListWhere>): Promise<UsePaging<IAdvantageList>> {
    return AdvantageService.ins().getAdvantageList(where)
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    return [
      { title: '序号', dataIndex: 'num', key: 'num', width: 100 },
      { title: '优势说明', dataIndex: 'content', key: 'content', },
      { title: '编辑时间', dataIndex: 'time', key: 'time', sorter: true },
      { title: '操作', key: 'action', width: 210 }
    ]
  }
}
