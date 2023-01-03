import { SettingType } from '@/api/api.model'
import { computed, ExtractPropTypes, PropType, watch } from 'vue'

type MyPropType = Readonly<ExtractPropTypes<{
  paramsType: NumberConstructor
  checkList: {
    type: PropType<string[]>
    defalut: () => never[]
  }
  settingList: {
    type: PropType<SettingType[]>
    default: () => never[]
  }
}>>

type MyEmitType = (event: 'update:settingList' | 'update:checkList', ...args: any[]) => void
/**
 * 描述
 * @date 2022-03-30
 */
export class ParamsTypeListService {
  props: MyPropType
  emit: MyEmitType
  /**
   * 描述
   * @date 2022-03-30
   * @param {any} props:MyPropType
   * @param {any} emit:MyEmitType
   */
  constructor(props: MyPropType, emit: MyEmitType) {
    this.props = props
    this.emit = emit
  }

  /**
   * 描述
   * @date 2022-03-30
   * @return {any}
   */
  useOnFun() {
    const { mySettingList, myCheckList } = this.useMyProps()
    const onAdd = (index: number) => {
      mySettingList.value.splice(index + 1, 0, { value: '', isChecked: false })
    }
    const onDel = (index: number) => {
      if (mySettingList.value.length === 1) {
        mySettingList.value = [{ value: '', isChecked: false }]
        return
      }
      mySettingList.value = mySettingList.value.filter((_, i) => i !== index)
    }
    const onCheck = (checkedValue: any[]) => {
      myCheckList.value = checkedValue
      if (this.props.paramsType === 2 && checkedValue.length > 1) {
        myCheckList.value = [checkedValue[checkedValue.length - 1]]
      }
    }
    // array move up
    const onMoveUp = (index: number) => {
      if (index === 0) return
      const temp = mySettingList.value[index - 1]
      mySettingList.value[index - 1] = mySettingList.value[index]
      mySettingList.value[index] = temp
    }
    // array move down
    const onMoveDown = (index: number) => {
      if (index === mySettingList.value.length - 1) return
      const temp = mySettingList.value[index + 1]
      mySettingList.value[index + 1] = mySettingList.value[index]
      mySettingList.value[index] = temp
    }
    // array on top
    const onTop = (index: number) => {
      if (index === 0) return
      const temp = mySettingList.value[index]
      mySettingList.value.splice(index, 1)
      mySettingList.value.unshift(temp)
    }
    watch(() => this.props.paramsType,
      (val) => {
        if (val === 2) {
          myCheckList.value = []
        }
      }
    )
    return { mySettingList, myCheckList, onTop, onMoveUp, onMoveDown, onAdd, onDel, onCheck }
  }

  /**
   * 描述
   * @date 2022-03-30
   * @return {any}
   */
  private useMyProps() {
    const self = this
    const mySettingList = computed<SettingType[]>({
      get() {
        return self.props.settingList
      },
      set(val) {
        self.emit('update:settingList', val)
      }
    })
    const myCheckList = computed<string[]>({
      get() {
        return self.props.checkList ?? []
      },
      set(val) {
        self.emit('update:checkList', val)
      }
    })
    return { mySettingList, myCheckList }
  }
}
