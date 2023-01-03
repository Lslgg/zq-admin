/* eslint-disable no-unused-vars */

/** 分页ui下一页参数类型 */
declare type PagType = {
  current: number
  pageSize: number
  total: number
}
/**
 * 返回结果
 */
declare interface Result<T> {
  code: string
  message: string
  timestamp: string
  data: T
}
/** 分页查找参数 */
declare interface PagingParams<T> {
  pageIndex: number
  pageSize: number
  where?: T
}
/** 使用分页结果 */
declare interface UsePaging<T> {
  total: number
  pageIndex: number
  pageSize: number
  list?: T[]
  data?: T[]
}
/**
 * importMetaEnv
 */
declare interface importMetaEnv {
  VITE_MODE_NAME: string
  VITE_BASE_URL: string
}
declare type MetaEnv = 'VITE_MODE_NAME' | 'VITE_BASE_URL'
declare interface SDK {
  request<T>(info: { url: string, method: string, params: any, mock?: boolean }): Promise<Result<T>>
  /** 登录 */
  login(info: { account: string, password: string, keep: boolean })
  /** 登出 */
  logout()
  /** 初始化 */
  init(): Promise<any>
  /** 上传 */
  upload<T>({ file: any, site_id: number, group_id = 0 }): Promise<T>
  /** 重定向地址 */
  redirect_url: string
}
declare const globalSdk: SDK
declare const tinymce: any
declare const globalData: {
  [index: string]: any
}
/**
 * 分页返回原结果
 */
declare interface ResPagingData<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}
declare interface ITree {
  id: number | string
  key?: number | string
  pid: number | string
  title: string
  disabled?: Boolean
  tag?: number | string
  column_id?: number
  children?: ITree[]
  level: number
  status?: number
  disabled?: boolean
}
declare type KeyValue = { key: number | string, value: string }
declare type PagingFun = (payload: any, filters?: {}, sorter?: {}) => void
/** 分类类别 */
declare type CategoryType = 'product' | 'article' | 'video'
/** 素材操作类型，添加或选择 */
declare type MaterialType = 'select' | 'add'
/** 下拉选择树形方式 */
type SelectTreeType = 'SHOW_ALL' | 'SHOW_CHILD' | 'SHOW_PARENT'
/** 正常或者垃圾 */
type NormalOrTrash = 'normal' | 'trash'

