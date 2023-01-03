import { UseCommon } from './../../../util/useCommon'
import { API } from '@/api/apis'
import { Utilts } from '@/util/utilts'
import { FormInstance } from 'ant-design-vue'
import { computed, ExtractPropTypes, PropType, ref } from 'vue'
export interface IFormState {
  id: number
  name: string
  type: number
}
type MyEmitType = (
  event: 'update:visible' | 'update:formState' | 'onUpdateMaterial',
  ...args: any[]
) => void
type MyProps = Readonly<
  ExtractPropTypes<{
    visible: {
      type: BooleanConstructor
      default: boolean
    }
    formState: {
      type: PropType<IFormState>
      default: () => void
    }
  }>
>
/**
 * 描述
 * @date 2022-03-25
 */
export class MaterialUpdateService {
  prop: MyProps
  emit: MyEmitType
  /**
   * 描述
   * @date 2022-03-25
   * @param {any} prop:Props
   * @param {any} emit:EmitType
   */
  constructor(prop: MyProps, emit: MyEmitType) {
    this.prop = prop
    this.emit = emit
  }

  /**
   * 描述
   * @date 2022-03-25
   * @return {any}
   */
  useService() {
    const self = this
    const myVisible = computed<boolean>({
      get() {
        return self.prop.visible
      },
      set(val) {
        self.emit('update:visible', val)
      },
    })
    const myFormState = computed<IFormState>({
      get() {
        return self.prop.formState
      },
      set(val) {
        self.emit('update:formState', val)
      },
    })
    const formUpdateRef: any = ref<FormInstance>()
    // 添加文件组
    const submit = async () => {
      try {
        await formUpdateRef.value?.validateFields()
        //  修改文件夹名
        if (myFormState.value.type === 1) {
          const data = {
            site_id: UseCommon.ins().siteId,
            id: myFormState.value.id,
            group_name: myFormState.value.name,
          }
          const res = await API.attachment.postAttachmentGroupUpdate(data)
          if (res.data) {
            Utilts.ins().message('修改成功!')
            this.emit('onUpdateMaterial', myFormState.value)
          }
        } else if (myFormState.value.type === 2) {
          // 修改文件名
          const data1 = {
            site_id: UseCommon.ins().siteId,
            id: myFormState.value.id,
            file_name: myFormState.value.name,
          }
          const res2 = await API.attachment.postAttachmentUpdate(data1)
          if (res2.data) {
            Utilts.ins().message('修改成功!')
            this.emit('onUpdateMaterial', myFormState.value)
          }
        }
        myVisible.value = false
      } catch (error) {
        formUpdateRef.value.resetFields()
      }
    }

    return {
      myVisible,
      myFormState,
      formUpdateRef,
      submit,
    }
  }
}
