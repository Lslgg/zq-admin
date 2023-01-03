import SingletonClass from '@/util/singleClass'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { FormInstance, TableColumnType } from 'ant-design-vue'
import { RuleObject } from 'ant-design-vue/lib/form'
import { ColumnType } from 'ant-design-vue/lib/table'
import { reactive, ref } from 'vue'

export interface IContactList {
  id: number,
  type: number,
  content: string,
  num?: number
}

/** 分页查找条件参数 */
export interface IContactListWhere {
  title?: string
}

/** 联系方式类型 */
export interface IContactType {
  id: number
  name: string
}

/**
 * ContactService
 */
export class ContactService extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): ContactService {
    return super.ins() as ContactService
  }

  /**
   * getContactList
   * @param {number} where
   * @return {anyIContactList}
   */
  public getContactList(
    where: IContactListWhere
  ): Promise<UsePaging<IContactList>> {
    return new Promise(async (resolve, reject) => {
      const list = await this.getInfo(1)
      const info = {
        total: 100,
        pageSize: 10,
        pageIndex: 1,
        list,
      }
      setTimeout(() => {
        resolve(info)
      }, 500)
    })
  }

  /**
   * 描述
   * @date 2022-03-11
   * @return {any}
   */
  public getContactColumn() {
    const columns: ColumnType[] = [
      { title: '序号', dataIndex: 'num', key: 'num', width: 100 },
      {
        title: '联系方式', dataIndex: 'type', key: 'type', filters: [],
        onFilter: (value, record: IContactType) => record.id === value,
      },
      { title: '详细内容', dataIndex: 'content', key: 'content' },
      { title: '操作', key: 'action', width: 210 },
    ]
    // 获取联系类型
    this.getContactType().then((res) => {
      columns[1].filters = res.map((item: IContactType) => {
        return { text: item.name, value: item.id }
      })
    })
    return columns
  }

  /**
   * 获取联系类型
   * @return {IContactType[]}
   */
  public getContactType(): Promise<IContactType[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          { id: 1, name: 'phone' },
          { id: 2, name: 'facebook' },
          { id: 3, name: '传真号码' },
          { id: 4, name: 'whatsapp' },
          { id: 5, name: 'wechat' },
          { id: 6, name: 'email' }
        ]
        resolve(data)
      }, 100)
    })
  }

  /**
   * 获取联系信息
   * @param {any} pageIndex:number
   * @return {any}
   */
  private getInfo(pageIndex: number): Promise<IContactList[]> {
    return new Promise((resolve) => {
      const res = [
        { id: 1, type: 1, content: '+8612231122313' },
        { id: 2, type: 2, content: 'https://test.facebook' },
        { id: 3, type: 4, content: '+8612231122313' },
        { id: 4, type: 5, content: 'https://static.runoob.com/images/demo/demo1.jpg' },
        { id: 5, type: 6, content: '12312231312@qq.com' }
      ]
      const data = res.map((item, index) => {
        return { ...item, num: index }
      })
      resolve(data)
    })
  }
}

/**
 * 表格操作
 * @date 2022-03-10
 */
export class ContactOperationService extends UseTableOperationService<IContactList, IContactListWhere> {
  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const contactTypes = ref<IContactType[]>([])
    const contactTypesObj = reactive<any>({})
    const visible = ref(false)
    const modalTitle = ref('')
    const modalView = ref(0)
    const modalType = ref(0)
    const formRef = ref<FormInstance>()
    const form = reactive({ content: '' })
    const validate = (_rule: RuleObject, value: string) => {
      return Promise.resolve()
    }
    const rules = {
      content: [{ required: true, validator: validate, trigger: 'change' }]
    }
    /**
     * 描述
     * @date 2022-03-11
     */
    const add = () => {
      visible.value = true
      form.content = ''
      modalTitle.value = '添加联系信息'
      modalType.value = 0
      modalView.value = 0
    }

    /**
     * 描述
     * @date 2022-03-11
     * @param {any} id:number
     */
    const edit = (id: number) => {
      const record = this.getInfo(id)
      if (record) {
        modalType.value = record.type
        modalTitle.value = '修改联系信息'
        modalView.value = 1
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
    /** 获取联系分类 */
    const initType = () => {
      ContactService.ins().getContactType().then((res) => {
        contactTypes.value = res
        res.forEach((item: IContactType) => {
          contactTypesObj[item.id] = item.name
        })
      })
    }
    initType()

    return {
      visible,
      modalTitle,
      modalView,
      form,
      formRef,
      rules,
      contactTypes,
      contactTypesObj,
      add,
      edit,
      del
    }
  }
}

/**
 * 列表查找分页
 */
export class UseContactPagationService extends UseTableService<IContactList, IContactListWhere> {
  /**
  * 获取列表数据
  * @date 2022-03-10
  * @param {any} where:PagingParams<IContactListWhere>
  * @return {any}
  */
  public getList(where: IContactListWhere): Promise<UsePaging<IContactList>> {
    return ContactService.ins().getContactList(where)
  }

  /**
   * 获取表格列
   * @date 2022-03-10
   * @return {any}
   */
  public columns(): TableColumnType<any>[] {
    return ContactService.ins().getContactColumn()
  }
}
