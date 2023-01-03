import { ICategroy, IKeyword } from '@/api/api.model'
import { API } from '@/api/apis'
import { CustomerValidate } from '@/util/customerValidate'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { UseTableOperationService } from '@/util/useTableOpationService'
import { UseTableService } from '@/util/useTableService'
import { Utilts } from '@/util/utilts'
import { TableColumnType } from 'ant-design-vue'
import { RuleObject } from 'ant-design-vue/lib/form'
import { createVNode, ref } from 'vue'

interface IKeywordWhere {
  keyword: string
}

interface IFormItem {
  keywords: string[]
}

interface ITag {
  id: number
  title: string
  content: { key: number, value: string }[]
}

/**
 * 列表查找分页
 */
export class UseKeywordsPagationService extends UseTableService<IKeyword, IKeywordWhere> {
  /**
   * 描述
   * @date 2022-03-16
   * @param {any} where:PagingParams<IKeywordWhere>
   * @return {any}
   */
  getList(where: IKeywordWhere): Promise<UsePaging<IKeyword>> {
    return new Promise(async (resolve, reject) => {
      const params: any = { current_page: this.pageIndex, per_page: this.pageSize, keyword: where.keyword || '' }
      const res = await API.keyword.getKeywordList<ResPagingData<IKeyword>>(params)
      res.data.data.forEach(p => {
        p.isMainKey = p.tags.some(pp => pp.tag_type === 1)
      })
      const info = {
        total: res.data.total ?? 0,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        list: res.data.data ?? [],
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
      { ...this.getColumns('序号', 'rowIndex') },
      { ...this.getColumns('关键词', 'keyword') },
      { ...this.getColumns('标签', 'tags') },
      // { ...this.getColumns('使用次数', 'usage_times') },
      // { ...this.getColumns('月均搜索量', 'month_search_times') },
      // { ...this.getColumns('竞争程度', 'competition_degree') },
      { ...this.getColumns('操作', 'action'), width: 120, fixed: 'right' },
    ]
  }
}


/**
 * 表格操作
 * @date 2022-03-10
 */
export class KeywordsOperationService extends UseTableOperationService<IKeyword, IKeywordWhere> {
  /**
   * 获取分类和相关标签
   * @return {any}
   */
  async getTagCategroy() {
    const tagList: ITag[] = [
      { id: 0, title: '默认标签', content: [] },
      { id: 1, title: '产品分类', content: [] },
      { id: 2, title: '文章分类', content: [] },
      { id: 3, title: '视频分类', content: [] },
    ]
    const disableKey = ref(0)
    /**
    * 获取标签
    * @date 2022-04-07
    * @return {any}
    */
    const initTag = () => {
      return new Promise((resolve, reject) => {
        API.config.getConstantGet({ constant_name: 'KeywordTags' })
          .then((res: any) => {
            tagList[0].content = res.data.filter((item: any) => !(item.value === '产品' || item.value === '文章' || item.value === '视频'))
            const mainKey = res.data.find((item: any) => item.value === '主营关键词')
            disableKey.value = mainKey.key
            resolve('')
          })
          .catch(err => {
            reject(err)
          })
      })
    }

    /**
     * 获取分类
     * @date 2022-04-07
     * @param {any} type:number
     * @return {any}
     */
    const initCategroy = (type: number) => {
      return new Promise((resolve, reject) => {
        API.category.getCategoryList({ category_type: type })
          .then((res: any) => {
            tagList[type].content = res.data.map((item: ICategroy) => {
              return { value: item.category_name, key: item.id }
            })
            resolve('')
          })
          .catch(err => {
            reject(err)
          })
      })
    }

    await Promise.all([initTag(), initCategroy(1), initCategroy(2), initCategroy(3)]).then(() => { })
    return { tagList, disableKey }
  }

  /**
   * 表格操作
   * @date 2022-03-10
   * @return {any}
   */
  public useOperation() {
    const keywordVisible = ref(false)
    const searchKey = ref('')
    const tagVisible = ref(false)
    const tags = ref<number[]>([])
    const category_ids = ref<number[]>([])
    const ids = ref<number[]>([])
    /**
     * 打开标签弹窗
     * @date 2022-04-07
     * @param {any} record?:IKeyword
     */
    const addTags = (record?: IKeyword) => {
      if (record) ids.value = [record.id] // 单独打标签
      else {
        ids.value = this.paging.selectedRowKeys // 多个打标签
        if (ids.value.length === 0) {
          Utilts.ins().message('请勾选要打标签的关键词!', 'error')
          return
        }
      }
      tags.value = []
      category_ids.value = []
      const setCategoryIds = (category: any) => {
        if (!category_ids.value.includes(category.category_id)) category_ids.value.push(category.category_id)
      }
      this.paging.dataSource?.filter(item => ids.value.includes(item.id)).forEach(item => {
        // 文章
        item.active_in_category.article.forEach(category => setCategoryIds(category))
        // 产品
        item.active_in_category.product.forEach(category => setCategoryIds(category))
        // 视频
        item.active_in_category.video.forEach(category => setCategoryIds(category))
        // 标签
        if (item.tags) {
          item.tags.forEach(tag => {
            if (!tags.value.includes(tag.tag_type)) tags.value.push(tag.tag_type)
          })
        }
      })
      tagVisible.value = true
    }

    /**
     * 设置标签
     * @date 2022-04-07
     */
    const setTags = () => {
      API.keyword.postKeywordTag({ site_id: UseCommon.ins().siteId, ids: ids.value, category_ids: category_ids.value, tags: tags.value })
        .then(res => {
          Utilts.ins().message('打标签成功')
          this.getPatationList({})
          tagVisible.value = false
        })
    }

    const closeTags = (key: number, record: IKeyword) => {
      const ids = [record.id]
      const category_ids: number[] = []
      let tags: number[] = []
      if (record.tags) tags = record.tags.filter(item => item.tag_type === key).map(item => item.tag_type)
      if (tags.length === 0) category_ids.push(key)

      this.delConfirm(() => {
        API.keyword.postKeywordDeletetag({ site_id: UseCommon.ins().siteId, ids, tags, category_ids } as any)
          .then(_res => {
            Utilts.ins().message('删除标签成功')
            this.getPatationList({})
          })
      })
    }

    const addKeyword = () => {
      keywordVisible.value = true
    }

    const filterTags = (record: IKeyword) => {
      const tags: { key: number, value: string }[] = []
      if (record.tags) record.tags.forEach(item => tags.push({ key: item.tag_type, value: item.tag }))
      const getTags = (item: any) => ({ key: item.category_id, value: item.category_name })
      record.active_in_category.article.forEach(item => tags.push(getTags(item)))
      record.active_in_category.product.forEach(item => tags.push(getTags(item)))
      record.active_in_category.video.forEach(item => tags.push(getTags(item)))
      return tags
    }
    const onSearch = () => {
      this.getPatationList({ ...this.paging.where, keyword: searchKey.value, current: 1 })
    }

    const onImportPage = () => this.goUrl('keywordImport', {})

    const onDel = (id: number) => {
      const html = [
        `删除关键词，可能导致内容页面的SEO关键词与关键词库里的不一致，
        还会影响SEO的TDK自动生成的调用，请谨慎处理此操作！`,
        '删除后不可恢复，你确定还是要继续删除此关键词吗？',
      ]
      const content = createVNode('div', { class: 'bar', innerHTML: html.join('<br><br>') })
      Utilts.ins().confirm({
        content,
        okCallBack: () => {
          API.keyword.postKeywordDelete({ site_id: UseCommon.ins().siteId, ids: [id] })
            .then(res => {
              this.getPatationList({ keyword: '', current: 1 })
              Utilts.ins().message('删除成功')
            })
        }
      })
    }

    return {
      keywordVisible,
      tagVisible,
      tags,
      category_ids,
      searchKey,
      filterTags,
      addKeyword,
      setTags,
      addTags,
      closeTags,
      onDel,
      onSearch,
      onImportPage
    }
  }
}


/**
 * 描述
 * @date 2022-03-11
 * @return {any}
 */
export class KeywordsForm extends UseFormService<IFormItem> {
  /**
   * 描述
   * @date 2022-03-11
   * @return {IFormItem}
   */
  async initForm(): Promise<IFormItem> {
    return {
      keywords: []
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @return {any}
   */
  createRule() {
    return {
      keywords: [
        { required: true, message: '内容不能为空', trigger: ['change', 'blur'] },
        { validator: this.validateKeyword, trigger: ['change', 'blur'] }
      ]
    }
  }
  /**
   * 描述
   * @date 2022-03-15
   * @param {any} info:any
   * @param {any} callback
   */
  onSubmit(info: IFormItem, callback: () => void) {
    const keywords = info.keywords || []
    if (keywords.length === 0) return
    API.keyword.postKeywordAdd({ site_id: UseCommon.ins().siteId, keywords } as any)
      .then((_res) => {
        Utilts.ins().message('添加关键词成功')
        if (callback) callback()
      })
  }
  /**
   * 关键词验证
   * @date 2022-03-17
   * @param {any} _rule:RuleObject
   * @param {any} value:string
   * @return {any}
   */
  async validateKeyword(_rule: RuleObject, value: string[]): Promise<string> {
    return CustomerValidate.ins().validateKeyword(value, 20)
  }
}
