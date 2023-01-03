import SingletonClass from '@/util/singleClass'
import { message, Modal, ModalFuncProps } from 'ant-design-vue'
import { createVNode } from 'vue'
import dayjs from 'dayjs'
/** ConfrimInfo */
export interface ConfirmInfo {
  title?: string
  okText?: string
  width?: number | string
  cancelText?: string
  content?: any
  icon?: any
  okCallBack?: any
  cancelCallBack?: any
}

/**
 * 工具类
 */
export class Utilts extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): Utilts {
    return super.ins() as Utilts
  }

  /**
   * 确认框
   * @date 2022-02-11
   * @param {any} params:ConfirmInfo
   */
  confirm({
    title = '提示',
    okText = '确认',
    cancelText = '取消',
    content = '是否要删除？',
    icon = null,
    width = 520,
    okCallBack = () => { },
    cancelCallBack = () => { },
  }: ConfirmInfo) {
    let confirmInfo: ModalFuncProps = {
      title: title,
      okText: okText,
      cancelText: cancelText,
      width: width,
      zIndex: 1301,
      onOk() {
        if (okCallBack) okCallBack()
      },
      onCancel() {
        if (cancelCallBack) cancelCallBack()
      },
    }
    if (icon) {
      confirmInfo = { ...confirmInfo, icon: createVNode(icon) }
    }
    if (content) {
      confirmInfo = { ...confirmInfo, content: content }
    }
    Modal.confirm(confirmInfo)
  }
  /**
   * 获取环境变量
   * @date 2022-02-16
   * @param {any} name:string
   * @return {any}
   */
  public getEnvValue(name: string) {
    const meta: any = import.meta
    if (meta.env[name]) {
      return meta.env[name]
    } else {
      return ''
    }
  }

  /**
   * 信息提示
   * @param {string} text
   * @param {string} type
   */
  public message(
    text: string,
    type: 'success' | 'info' | 'warn' | 'error' = 'success'
  ) {
    if (type === 'info') message.info(text)
    else if (type === 'error') message.error(text)
    else if (type === 'success') message.success(text)
    else if (type === 'warn') message.warn(text)
  }

  /**
   * 获取视频的第一帧图片显示
   * @param {string} url
   * @param {number} w:800
   * @param {number} h:600
   * @return {any}
   */
  public getVideoImg(url: string, w = 800, h = 600) {
    return `${url}?x-oss-process=video/snapshot,t_7000,f_jpg,w_${w},h_${h},m_fast`
  }

  /**
   * 支持上传的文件后缀
   */
  public get fileExtList() {
    return [
      'jpg',
      'png',
      'jpeg',
      'gif',
      'pdf',
      'txt',
      'xlsx',
      'csv',
      'svg',
      'pps',
      'mp4',
      'wav',
    ]
  }

  /**
   * 获取后缀
   * @param {string} name
   * @return {any}
   */
  public getFileExt(name: string) {
    if (!name) return ''
    const index = name.lastIndexOf('.')
    const ext = name.substring(index + 1) || ''
    return ext
  }

  /**
   * 去除对象中字符类型前后空格
   * @param {Ojbect} obj
   */
  public trimObjStr(obj: any) {
    if (typeof obj === 'object' && typeof obj !== 'undefined' && obj !== null) {
      const list = Object.keys(obj)
      if (list && list.length > 0) {
        Object.keys(obj).forEach((key) => {
          // 如果是字符串类型
          if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim()
          } else if (typeof obj[key] === 'object') {
            // 如果是对象类型
            this.trimObjStr(obj[key])
          }
        })
      }
    }
  }

  /**
   * 检查上传文件是否合法
   * @param {File} file
   * @return {boolean}
   */
  public checkFile(file: File) {
    const ext = this.getFileExt(file.name)
    if (!this.fileExtList.includes(ext.toLocaleLowerCase())) {
      this.message('不支持这种类型的文件, 请重选择要上传的文件', 'error')
      return false
    }
    // 判断文件大小
    if (file.size > 1024 * 1024 * 50) {
      this.message('文件超过50Mb', 'error')
      return false
    }
    const imgType = ['jpg', 'png', 'jpeg', 'gif'].includes(ext.toLocaleLowerCase())
    if (imgType && file.size > 1024 * 1024 * 5) {
      this.message('图片文件超过5Mb', 'error')
      return false
    }
    return true
  }

  /**
   * 格式化日期
   * @param {string} date
   * @param {string} format
   * @return {string}
   */
  public formatDate(date: any, format: string = 'YYYY-MM-DD') {
    return dayjs(date || dayjs(new Date()).format('YYYY-MM-DD'), 'YYYY-MM-DD')
  }

  /**
   * 根据数字获取最近天数
   * @param {number} num
   * @return {string}
   */
  public getNearDays(num: number) {
    return dayjs().add(-num, 'day').format('YYYY-MM-DD')
  }

  /**
   * 获取随机0-9的数字
   * @return {number}
   */
  public getRandomNum() {
    return Math.floor(Math.random() * 10)
  }

  /**
   * sleep
   * @param {number} ms
   * @return {any}
   */
  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 根据[name]获取字段值
   * @date 2022-05-25
   * @param {any} obj:T
   * @param {any} name:keyofT
   * @return {any}
   */
  public getValueByObjName<T extends Object>(obj: T, name: keyof T) {
    return obj[name]
  }

  /**
   * 根据[name]设置字段值
   * @date 2022-05-25
   * @param {any} obj:T
   * @param {any} name:keyof
   * @param {any} value:any
   * @return {any}
   */
  public setValueByObjName<T extends Object>(obj: T, name: keyof T, value: any) {
    obj[name] = value
    return obj
  }

  /**
 * 根据[name]设置字段值
 * @date 2022-05-25
 * @param {any} obj:T
 * @param {any} name:keyof
 * @param {any} value:any
 */
  public removeValueByObjName<T extends Object>(obj: T, name: keyof T) {
    delete obj[name]
  }

  /**
   * 比较两个对象是否相等
   * @param {T} obj1
   * @param {T} obj2
   * @return {boolean}
   */
  public compareObj<T extends Object>(obj1: T, obj2: T) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }
}
