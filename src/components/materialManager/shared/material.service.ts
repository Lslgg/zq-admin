import { IAttachment } from '@/api/api.model'
import { Utilts } from '@/util/utilts'
import { useClipboard } from '@vueuse/core'
import { ref } from 'vue'

/**
 * 素材操作
 */
export class MaterialService {
  /**
   * 描述
   * @date 2022-03-24
   * @param {any} emit:any
   * @return {any}
   */
  useMaterial(emit: any) {
    const { copy, copied } = useClipboard()
    const visible = ref<boolean>(false)
    // const videoVisible = ref<boolean>(false)
    const setVisible = (bool: boolean) => visible.value = bool
    // 删除图片
    const onDel = (id: number) => Utilts.ins().confirm({ okCallBack: () => emit('onDel', [id]) })
    const onDetail = (id: number) => emit('onDetail', id)
    const editImg = (name: string, id: number) => emit('onUpdate', name, id, 2)
    const copyBallck = (text: string) => {
      copy(text).then(() => {
        const text = copied.value ? '复制成功' : '复制失败'
        const type = copied.value ? 'success' : 'error'
        Utilts.ins().message(text, type)
      })
    }
    const onSelect = (info: IAttachment) => emit('onSelect', info)
    const onImgSelect = (info: IAttachment) => {
      info.isSelected = !info.isSelected
      onSelect(info)
    }
    const onPlay = (info: IAttachment) => {
      // videoVisible.value = true
      emit('onShowVideo', info)
    }
    return {
      visible,
      // videoVisible,
      setVisible,
      onDel,
      editImg,
      onDetail,
      copyBallck,
      onSelect,
      onImgSelect,
      onPlay,
    }
  }
}
