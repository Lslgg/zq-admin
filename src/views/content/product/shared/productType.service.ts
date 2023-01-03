import { Utilts } from '@/util/utilts'
import router from '@/router'
import { ExtractPropTypes, PropType, Ref } from 'vue'
import { API } from '@/api/apis'
import { ECategoryType, ICategroy } from '@/api/api.model'
import { ProductStore } from './product.store'

type TypeProps = Readonly<ExtractPropTypes<{
  categoryIds: {
    type: ArrayConstructor
    default: () => never[]
  }
  keyValueList: {
    type: PropType<KeyValue[]>
    default: () => never[]
  }
}>>

type EmitType = (event: 'update:categoryIds' | 'update:keyValueList', ...args: any[]) => void
/**
 * 描述
 * @date 2022-04-02
 */
export class ProductTypeService {
  props: TypeProps
  emit: EmitType
  /**
   * 描述
   * @param {TypeProps} props
   * @param {EmitType} emit
   * @date 2022-04-02
   */
  constructor(props: TypeProps, emit: EmitType) {
    this.props = props
    this.emit = emit
  }

  /**
   * 描述
   * @date 2022-04-02
   * @return {any}
   */
  getData() {
    return new Promise<{ treeData: ITree[]; keyValueList: KeyValue[] }>(
      (resolve, reject) => {
        API.category
          .getCategoryList<ICategroy[]>({
            category_type: ECategoryType.product,
            with_column: 1,
          })
          .then((resData) => {
            const keyValueList: KeyValue[] = []
            const newListData: ITree[] = []
            resData.data.forEach((p) => {
              const info: ITree = {
                key: p.id,
                id: p.id,
                pid: p.pid,
                title: p.category_name,
                tag: p.root_column_id,
                disabled: false,
                children: [],
                level: 1
              }
              keyValueList.push({ key: p.id, value: p.category_name })
              newListData.push(info)
            })
            const listToTree = (pid: number | string) => {
              const list = newListData.filter((p) => p.pid === pid)
              if (list.length === 0) return []
              else {
                list.forEach((p) => (p.children = listToTree(p.id)))
                return list
              }
            }
            const listTree = listToTree(0)
            resolve({ treeData: listTree, keyValueList })
          })
      }
    )
  }
  /**
   * 描述
   * @date 2022-04-02
   * @param {Ref<number[]>} selectedKeys: number
   * @return {any}
   */
  async useProductType(selectedKeys: Ref<number[]>) {
    const { treeData, keyValueList } = await this.getData()
    this.emit('update:keyValueList', keyValueList)
    if (selectedKeys.value.length === 0) {
      selectedKeys.value = ProductStore.ins().product.category_ids ?? []
    }
    this.emit('update:categoryIds', selectedKeys.value)
    const onSubmit = () => {
      this.checkProductType(selectedKeys, keyValueList)
    }
    const onProductType = () =>
      router.push({ name: 'productClassify', params: { type: 'product' } })

    const onSelect = () => {
      this.emit('update:categoryIds', selectedKeys.value)
    }
    return {
      selectedKeys,
      treeData,
      onProductType,
      onSubmit,
      onSelect
    }
  }

  /**
   * checkProductType
   * @param {Ref<number>} selectedKeys
   * @param {KeyValue[]} keyValueList
   */
  checkProductType(selectedKeys: Ref<number[]>, keyValueList: KeyValue[]) {
    const categoryIds = selectedKeys.value ?? []
    if (categoryIds.length === 0) {
      Utilts.ins().message('请选择分类', 'error')
      return
    }
    const store = ProductStore.ins()
    const names = keyValueList
      .filter((p) => categoryIds.includes(+p.key))
      .map((p) => p.value)
      .join(',')
    ProductStore.ins().product$.next({ category_ids: categoryIds })
    ProductStore.ins().product.category_ids = categoryIds
    store.paramsNameStr$.next(names)
    store.category_ids$.next(categoryIds)
    if (ProductStore.ins().showType === 'add') store.step$.next(1)
  }
}
