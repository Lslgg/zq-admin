import { ESeoType, IColumn, IKeyword } from '@/api/api.model'
import { API } from '@/api/apis'
import { CustomerValidate } from '@/util/customerValidate'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { useScroll } from '@vueuse/core'
import { TableColumnType } from 'ant-design-vue'
import { RuleObject } from 'ant-design-vue/lib/form'
import { ExtractPropTypes, ref, toRefs, watch } from 'vue'

export interface IForm {
  id?: number,
  type?: number,
  seo_keyword: string[],
  seo_title: string,
  seo_description: string
}

interface ISeoListWhere { }

type TEmit = (event: 'update:visible' | 'onOk', ...args: any[]) => void

type TProps = Readonly<ExtractPropTypes<{
  visible: BooleanConstructor
  type: NumberConstructor
  id: NumberConstructor
}>>
/**
 * 弹窗表单
 * @date 2022-03-16
 * @return {any}
 */
export class SeoForm extends UseFormService<IForm> {
  emit: TEmit
  porps: TProps
  confirmLoading = ref<Boolean>(false)
  /**
   * 描述
   * @date 2022-04-06
   * @param {any} porps:TProps
   * @param {any} emit:TEmit
   * @param {boolean} confirmLoading: boolean
   */
  constructor(porps: TProps, emit: TEmit, confirmLoading = ref<Boolean>(false)) {
    super()
    this.porps = porps
    this.emit = emit
    this.confirmLoading = confirmLoading
  }
  /**
   * 描述
   * @date 2022-03-16
   * @param {IForm} info
   * @return {any}
   */
  async initForm(): Promise<IForm> {
    const res = await API.seo.getSeoGet<IColumn>({ id: this.porps.id, type: this.porps.type })
    let seo_keyword: string[] = []
    if (res.data.seo_keyword) {
      seo_keyword = res.data?.seo_keyword?.split(',').filter(item => item)
    }
    return {
      seo_keyword: seo_keyword,
      seo_title: res.data?.seo_title ?? '',
      seo_description: res.data?.seo_description ?? '',
      type: this.porps.type,
      id: this.porps.id
    }
  }
  /**
   * 描述
   * @date 2022-03-16
   * @return {any}
   */
  createRule() {
    return {
      seo_keyword: [{ validator: this.validateKeyword, trigger: ['change', 'blur'] }]
    }
  }
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} info:IForm
   */
  onSubmit(info: IForm): void {
    const params: any = { ...info, site_id: UseCommon.ins().siteId }
    params.seo_keyword = (info.seo_keyword as string[]).filter(item => item).join(',')
    this.confirmLoading.value = true
    API.seo.postSeoUpdate(params)
      .then((_res) => {
        Utilts.ins().message('更新成功', 'success')
        this.confirmLoading.value = false
        this.emit('onOk')
        this.emit('update:visible', false)
      })
      .catch(_err => {
        this.confirmLoading.value = false
      })
  }
  /**
   * seo_关键词验证
   * @date 2022-03-17
   * @param {any} _rule:RuleObject
   * @param {any} value:string
   * @return {any}
   */
  async validateKeyword(_rule: RuleObject, value: string[]): Promise<string> {
    return CustomerValidate.ins().validateKeyword(value, 3)
  }

  /**
   * 描述
   * @date 2022-04-13
   * @return {any}
   */
  useSeoForm() {
    let buildTimeOut: any = null
    const rebuild = (record: IForm, key: keyof IForm) => {
      const params = { site_id: UseCommon.ins().siteId, id: record.id, type: record.type, seo_keyword: record.seo_keyword.join(',') } as any
      if (key === 'seo_title') params.seo_item = ESeoType.seo_title
      else if (key === 'seo_description') params.seo_item = ESeoType.seo_description
      else params.seo_item = ESeoType.seo_keyword
      if (buildTimeOut) clearTimeout(buildTimeOut)
      buildTimeOut = setTimeout(() => {
        API.seo.postSeoGetautotdk(params)
          .then((res: any) => {
            const data = res.data
            const seo_keyword = (data.seo_keyword as string).split(',').filter((item: string) => item)
            let msg = ''
            if (key === 'seo_keyword') {
              record.seo_keyword = seo_keyword
              msg = 'SEO关键词'
            } else if (key === 'seo_title') {
              record.seo_title = data[key]
              msg = 'SEO标题'
              if (record.seo_keyword.length === 0) record.seo_keyword = seo_keyword
            } else {
              record.seo_description = data[key]
              msg = 'SEO描述'
              if (record.seo_keyword.length === 0) record.seo_keyword = seo_keyword
            }
            Utilts.ins().message(msg + '更新成功')
          })
      }, 500)
    }
    return {
      rebuild
    }
  }
}

/**
 * 列表查找分页
 */
export class UseSeoListPagationService extends UseTableService<IKeyword, ISeoListWhere> {
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} where:PagingParams<ISeoListWhere>
   * @return {any}
   */
  getList(where: PagingParams<ISeoListWhere>): Promise<UsePaging<IKeyword>> {
    return new Promise(async (resolve, reject) => {
      const res = await API.keyword.getKeywordList<ResPagingData<IKeyword>>({ current_page: where.pageIndex, per_page: where.pageSize })
      const info = {
        total: res.data?.total ?? 0,
        pageSize: where.pageSize,
        pageIndex: where.pageIndex,
        list: res.data?.data ?? [],
      }
      resolve(info)
    })
  }
  /**
   * 描述
   * @date 2022-03-16
   * @return {any}
   */
  columns(): TableColumnType<any>[] {
    return [
      { title: '关键词', dataIndex: 'keyword', key: 'keyword' },
      // { title: '月均搜索量', dataIndex: 'month_search_times', key: 'month_search_times', width: 100 },
      // { title: '竞争程度', dataIndex: 'competition_degree', key: 'competition_degree', width: 80 },
      // { title: '使用次数', dataIndex: 'usage_times', key: 'usage_times', width: 80 },
      { title: '操作', key: 'action', width: 80 },
    ]
  }
}


/**
 * 描述
 * @date 2022-03-17
 * @return {any}
 */
export class SeoListOperationService extends UseTableOperationService<IKeyword, ISeoListWhere> {
  /**
   * 描述
   * @date 2022-03-17
   * @return {any}
   */
  public useOperation() {
    const el = ref<HTMLElement | null>(null)
    const { arrivedState } = useScroll(el)
    const { bottom } = toRefs(arrivedState)
    let isAll = false
    // 滚动到最下面时请求数据
    watch(bottom, (val: boolean) => {
      let pageSize = this.paging.pagination.pageSize + 10
      if (pageSize > this.paging.pagination.total) pageSize = this.paging.pagination.total
      if (val && !isAll) {
        this.getPatationList({ pageSize: pageSize })
        // 最后一页了
        if (pageSize === this.paging.pagination.total) isAll = true
      }
    })

    return {
      el,
    }
  }
}
