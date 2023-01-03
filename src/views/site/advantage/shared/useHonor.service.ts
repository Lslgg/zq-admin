import { reactive, ref } from 'vue'
import SingletonClass from '@/util/singleClass'
import { FormInstance, TableColumnType } from 'ant-design-vue'
import { UseTableService } from '@/util/useTableService'
import { UseTableOperationService } from '@/util/useTableOpationService'

interface IHonorList {
  num?: number,
  id: number,
  image: string,
  name: string,
  agency: string,
  updateTime: string
}

interface IHonorListWhere {}

/**
 * 描述
 * @date 2022-03-10
 * @return {any}
 */
export class HonorService extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): HonorService {
    return super.ins() as HonorService
  }

  /**
   * getHonorList
   * @param {PagingParams} where
   * @return {any}
   */
  public getHonorList(where: PagingParams<IHonorListWhere>): Promise<ResultData<IHonorList[]>> {
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
   * getInfo
   * @param {any} pageIndex:number
   * @return {any}
   */
  private getInfo(pageIndex: number): Promise<IHonorList[]> {
    return new Promise((resolve) => {
      const res = [
        { id: 1, name: 'hello world', image: 'https://marketplace.canva.cn/EAEGnxK4Mg4/2/0/1600w/canva-087CDsBScS8.jpg', agency: 'hello world机构', updateTime: '2022-03-09' },
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
export class HonorOperationService extends UseTableOperationService<IHonorList, IHonorListWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const visible = ref(false)
    const form = reactive({
      name: '',
      agency: '',
      image: []
    })
    const formRef: any = ref<FormInstance>()
    const submitType = ref('add')
    let submitRecord: IHonorList

    const add = () => {
      visible.value = true
      submitType.value = 'add'
      form.name = ''
      form.agency = ''
    }

    const edit = (id: number) => {
      const record = this.getInfo(id)
      if (record) {
        submitRecord = reactive(record)
        form.name = submitRecord.name
        form.agency = submitRecord.agency
        submitType.value = 'edit'
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
            submitRecord.name = form.name
            submitRecord.agency = form.agency
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
export class UseHonorPagationService extends UseTableService<IHonorList, IHonorListWhere> {
  /**
  * 获取列表数据
  * @date 2022-03-10
  * @param {any} where:PagingParams<IHonorListWhere>
  * @return {any}
  */
  public getList(where: PagingParams<IHonorListWhere>): Promise<ResultData<IHonorList[]>> {
    return HonorService.ins().getHonorList(where)
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    return [
      { title: '序号', dataIndex: 'num', key: 'num', width: 100 },
      { title: '证书图片', dataIndex: 'image', key: 'image' },
      { title: '证书名称', dataIndex: 'name', key: 'name' },
      { title: '发证机构', dataIndex: 'agency', key: 'agency' },
      { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', sorter: true },
      { title: '操作', key: 'action', width: 210 }
    ]
  }
}
