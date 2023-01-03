import { UseCommon } from '@/util/useCommon'
import { IAttachment, IAttachmentGroup, MaterFileType } from '@/api/api.model'
import { API } from '@/api/apis'
import { TreeProps } from 'ant-design-vue'
import { computed, ExtractPropTypes, PropType, reactive, ref, WritableComputedRef } from 'vue'

interface FormState {
  id: number
  name: string
  type: number
}

type MyPropType = Readonly<ExtractPropTypes<{
  opationType: {
    type: PropType<MaterialType>
    defalut: string
  }
  selectData: {
    type: PropType<IAttachment[]>
    default: () => never[]
  }
  selectType: {
    type: PropType<MaterFileType>
    default: MaterFileType.ALL
  }
}>
>

type MyEmit = (event: 'update:selectData', ...args: any[]) => void
/**
 * 素材管理
 */
export class MaterialGroupService {
  props: MyPropType
  emit: MyEmit
  mySelectData: WritableComputedRef<IAttachment[]>
  groupId = ref<number>(0)
  keyword = ''
  file_type = 0
  spinning = ref(false)
  /**
   * 描述
   * @date 2022-03-28
   * @param {any} props:MyPropType
   * @param {any} emit:MyEmit
   */
  constructor(props: MyPropType, emit: MyEmit) {
    this.props = props
    this.emit = emit
    this.mySelectData = computed<IAttachment[]>({
      get() {
        return props.selectData
      },
      set(val) {
        emit('update:selectData', val)
      },
    })
  }
  /**
   * 获取文件
   * @date 2022-03-24
   * @param {number} pageIndex:1
   * @return {any}
   */
  async getAttachmentGroupList(pageIndex = 1): Promise<IAttachmentGroup[]> {
    try {
      const params = { group_name: this.keyword, current_page: pageIndex, per_page: 50 }
      const res = await API.attachment.getAttachmentGroupList<Result<IAttachmentGroup[]>>(params)
      return res.data.data
    } catch (error) {
      return []
    }
  }

  /**
   * 获取素材
   * @date 2022-03-24
   * @param {number} pageIndex:1
   * @return {any}
   */
  async getAttachmentList(pageIndex = 1): Promise<IAttachment[]> {
    try {
      let fileType: any = {}
      if (this.props.selectType === MaterFileType.ALL) {
        if (this.file_type) fileType = { file_type: this.file_type }
      } else {
        fileType = { file_type: this.props.selectType }
      }
      const params = {
        ...fileType,
        file_name: this.keyword,
        group_id: this.groupId.value,
        current_page: pageIndex,
        per_page: 50,
      }
      const res = await API.attachment.getAttachmentList<ResPagingData<IAttachment>>(params)
      res.data.data = res.data.data.map((item) => {
        item.isSelected = false
        return item
      })
      return res.data.data
    } catch (error) {
      return []
    }
  }

  /**
   * 文件操作相关变量
   * @date 2022-03-26
   * @return {any}
   */
  useRefGroupInfo() {
    const formState = reactive<FormState>({ name: '', id: 0, type: 1 })
    const visible = ref<boolean>(false)
    const isRoot = ref<boolean>(true)
    const selectedKeys = ref<number[]>([0])
    // 文件组id
    return {
      formState,
      visible,
      isRoot,
      selectedKeys,
      groupId: this.groupId,
    }
  }

  /**
   * 文件操作
   * @date 2022-03-24
   * @return {any}
   */
  async useMaterialGroup() {
    const { formState, visible, isRoot, selectedKeys, groupId } =
      this.useRefGroupInfo()
    // 根目录文件夹
    const list = await this.getAttachmentGroupList()
    const attachmentGroupList = ref<IAttachmentGroup[]>(list)
    // 素材管理树形列表数据
    const children = ref(attachmentGroupList.value.map((p) => ({
      title: p.group_name,
      key: p.id,
    })))
    const treeData = ref<TreeProps['treeData']>([
      { title: '素材管理', key: 0, children: children.value },
    ])
    // 显示修改
    const onUpdate = (name: string, id: number, type: number) => {
      formState.name = name
      formState.id = id
      formState.type = type
      visible.value = true
    }
    // 修改名称
    const onUpdateMaterial = async (attachmentList: IAttachment[]) => {
      // 修改文件夹名
      if (formState.type === 1) {
        attachmentGroupList.value.forEach((item) => {
          if (item.id === formState.id) item.group_name = formState.name
        })
        // 修改树形文件夹名称
        if (treeData.value) {
          treeData.value[0].children?.forEach((item) => {
            if (item.key === formState.id) item.title = formState.name
          })
        }
      } else if (formState.type === 2) {
        // 修改文件名
        attachmentList.forEach((item) => {
          if (item.id === formState.id) item.file_name = formState.name
        })
      }
    }
    // 删除文件
    const delFolder = (id: number) => {
      attachmentGroupList.value = attachmentGroupList.value
        .filter((item) => item.id !== id)
      if (!treeData.value) return
      const index = treeData.value[0].children?.findIndex(p => p.key === id) || 0
      if (index > -1) treeData.value[0].children?.splice(index, 1)
    }
    /**
     * 添加文件
     * @date 2022-03-24
     * @param {any} data:IAttachmentGroup
     */
    const addCatalog = (data: IAttachmentGroup) => {
      attachmentGroupList.value.push(data)
      if (!treeData.value) return
      treeData.value[0].children?.push({ key: data.id, title: data.group_name })
    }
    // 点击文件夹加载文件
    const loadImg = (id: number) => {
      if (selectedKeys.value.length === 0) {
        selectedKeys.value = [0]
        groupId.value = 0
      }
      isRoot.value = !id
      groupId.value = id
      selectedKeys.value = [id ?? 0]
      this.keyword = ''
    }

    const selectTree = (keys: number[]) => {
      if (selectedKeys.value.length === 0) {
        selectedKeys.value = [0]
        groupId.value = 0
      }
      isRoot.value = !keys[0]
      loadImg(keys[0])
    }

    const onBack = () => {
      isRoot.value = true
      onSearchGroup('')
    }
    const onSearchGroup = async (keyword: string) => {
      this.keyword = keyword
      const list = await this.getAttachmentGroupList()
      attachmentGroupList.value = list
      if (treeData.value) {
        const num = treeData.value[0].children?.length
        treeData.value[0].children?.splice(0, num)
      }
      attachmentGroupList.value.forEach((item) => {
        if (treeData.value) {
          treeData.value[0].children?.push({ key: item.id, title: item.group_name })
        }
      })
    }
    const getAttachmentGroupList = (pageIndex: number) => {
      return this.getAttachmentGroupList(pageIndex)
    }
    return {
      visible,
      formState,
      groupId,
      attachmentGroupList,
      treeData,
      isRoot,
      selectedKeys,
      onUpdate,
      delFolder,
      addCatalog,
      loadImg,
      selectTree,
      onBack,
      onUpdateMaterial,
      onSearchGroup,
      getAttachmentGroupList
    }
  }

  /**
   * 素材相关变量
   * @date 2022-03-26
   * @return {any}
   */
  useRefInfo() {
    // 是否显示详情
    const attrVisible = ref<boolean>(false)
    // 是否显示素材头部查找
    const isShowSearch = ref<boolean>(true)
    // 详情的内容
    const materialDetail = reactive<Partial<IAttachment>>({})
    // 选择素材时选中的数量
    const selectTotal = ref<number>(0)
    const videoViible = ref(false)
    const videSrc = ref('')

    return {
      attrVisible,
      videoViible,
      videSrc,
      isShowSearch,
      materialDetail,
      selectTotal,
    }
  }

  /**
   * 素材
   * @date 2022-03-24
   * @return {any}
   */
  async useMateral() {
    const {
      attrVisible,
      isShowSearch,
      materialDetail,
      selectTotal,
      videoViible,
      videSrc,
    } = this.useRefInfo() // 素材
    const list = await this.getAttachmentList()
    const attachmentList = ref<IAttachment[]>(list)
    // 素材选中事件
    const onSelect = (attachment: IAttachment) => {
      const info = attachmentList.value.find(
        (item) => attachment && item.id === attachment.id
      )
      if (info) info.isSelected = attachment.isSelected
      selectTotal.value =
        attachmentList.value.filter((item) => item.isSelected)?.length ?? 0
      isShowSearch.value = !attachmentList.value.some((p) => p.isSelected)
      this.mySelectData.value = attachmentList.value.filter(
        (item) => item.isSelected
      )
    }
    // 上传素材以后添加素材
    const onUpload = async (data: IAttachment) => {
      attachmentList.value.push(data)
      this.spinning.value = false
    }
    // 显示素材详情
    const onDetail = (id: number) => {
      const info = attachmentList.value.find((p) => p.id === id)
      if (info) {
        materialDetail.file_name = info.file_name
        materialDetail.file_size_human = info.file_size_human
        materialDetail.created_at = info.created_at
        materialDetail.file_ext = info.file_ext
        materialDetail.url = info.url
      }
      attrVisible.value = true
    }
    // 删除素材
    const onDel = (ids: number[]) => {
      API.attachment.postAttachmentDelete({ site_id: UseCommon.ins().siteId, ids: ids }).then(() => {
        attachmentList.value = attachmentList.value.filter(
          (p) => !ids.includes(p.id)
        )
        this.mySelectData.value = attachmentList.value.filter(
          (item) => item.isSelected
        )
      })
    }
    // 根据目录查找素材
    const selectTreeMaterial = async (keys: number[]) => {
      attachmentList.value = []
      isShowSearch.value = true
      const groupId = keys.length == 0 ? 0 : keys[0]
      this.groupId.value = groupId
      const list = await this.getAttachmentList()
      attachmentList.value = list
    }
    // 移动素材，重新查找当前目录下的素材
    const onMove = async () => {
      const list = await this.getAttachmentList()
      attachmentList.value = list
      this.mySelectData.value = attachmentList.value.filter(
        (item) => item.isSelected
      )
    }
    const onSearch = async (keyword: string, type: number) => {
      this.keyword = keyword
      this.file_type = type
      const list = await this.getAttachmentList()
      attachmentList.value = list
      this.mySelectData.value = attachmentList.value.filter(
        (item) => item.isSelected
      )
    }
    const onShowVideo = (info: any) => {
      videoViible.value = true
      videSrc.value = info.url
    }
    const getAttachmentList = (pageIndex: number) => {
      return this.getAttachmentList(pageIndex)
    }
    return {
      materialDetail,
      isShowSearch,
      attachmentList,
      videoViible,
      videSrc,
      selectTotal,
      attrVisible,
      spinning: this.spinning,
      onShowVideo,
      selectTreeMaterial,
      onDetail,
      onUpload,
      onSelect,
      onDel,
      onMove,
      onSearch,
      getAttachmentList
    }
  }
}
