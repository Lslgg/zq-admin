/* eslint-disable no-unused-vars */
import type { Dayjs } from 'dayjs'

/**
 * 栏目
 */
export interface IColumn {
  content_type?: string
  content_type_text?: string
  children?: IColumn[]
  created_at?: string
  id: number
  in_category?: number[]
  is_google_include?: number
  merchant_id?: number
  page_id?: number
  page_type?: string
  page_type_text?: string
  path: string
  pid?: number
  seo_description: string
  seo_keyword: string
  seo_title: string
  site_id?: number
  sort_num?: number
  status?: number
  status_text?: string
  suffix?: string
  title: string
  type?: number
  updated_at?: string
}

/**
 * 行业类型
 */
export interface IIndustry {
  id: number,
  industry_name: string,
  industry_enname: string,
  pid: number,
  children?: IIndustry[]
}

/**
 * 分类
 */
export interface ICategroy {
  category_name: string
  category_type: number
  category_type_text: string
  children?: ICategroy[]
  created_at: string
  id: number
  merchant_id: number
  pid: number
  site_id: number
  sort_num: number
  status: number
  status_text: string
  updated_at: string
  root_column_id?: number
  root_column_name?: string
  title?: string
  deep?: number
}

export enum ECategoryType {
  product = 1,
  article,
  video,
}

export type TCategory = keyof typeof ECategoryType

/**
 * tdk
 */
export enum ESeoType {
  seo_tdk = 0,
  seo_title,
  seo_description,
  seo_keyword,
}

/**
 * 关键词
 */
export interface IKeyword {
  active_in_category: {
    article: IActiveCategroy[]
    product: IActiveCategroy[]
    video: IActiveCategroy[]
  }
  competition_degree: string
  created_at: string
  id: number
  keyword: string
  merchant_id: number
  month_search_times: string
  site_id: number
  tags: { tag_type: number; tag: string }[]
  updated_at: string
  usage_times: string
  isMainKey?: boolean
}

/**
 * 文章
 */
export interface IArticle {
  active_in_category?: IActiveCategroy[]
  category_ids?: number[]
  created_at?: string
  front_cover?: IAttachment
  id: number
  is_google_include?: number
  status: number
  is_top: number
  path?: string
  suffix: string
  revision?: number
  seo_description?: string
  seo_keyword?: string | string[]
  seo_title?: string
  show_date?: string | Dayjs
  site_id?: number
  sort_num: number
  summary?: string
  title?: string
  updated_at?: string
  category?: any
  detail: {
    data_type: number
    content: {
      detail: string
    }
  }
}

export interface IAttachmentParams {
  attachment_id?: number
  file_name?: string
  revision?: string
  url?: string
}

export interface IActiveCategroy {
  category_id: number
  category_name: string
  category_type: number
  category_type_text: string
  column_id: number
  title: string
  root_column_name?: string
  id?: number
}

/**
 * 视频
 */
export interface IVideo {
  active_in_category?: IActiveCategroy[]
  site_id?: number
  id: number
  revision?: number
  is_top: number
  status: number
  is_google_include?: number
  category_ids?: number[]
  front_cover?: IAttachment
  video?: IAttachment
  attachment_id: number
  path: string
  suffix?: string
  seo_title?: string
  seo_description?: string
  seo_keyword?: string | string[]
  sort_num: number
  title?: string
  summary?: string
  created_at?: string
  updated_at?: string
  category?: any
  detail: {
    data_type: number
    content: {
      detail: string
    }
  }
}
/**
 * 公司信息
 */
export interface ISiteInfo {
  address: string
  annual_yield: string
  brand: string
  business_model: number
  city: string
  company_enname: string
  company_name: string
  company_short_enname: string
  company_short_name: string
  company_type: number
  district: string
  employees_num: number
  export_market: number[] | string
  formation_date: string | Dayjs
  industry_type: number | number[]
  summary: string
  keyword: string | string[]
  view_id?: string
  media_id?: string
  memory_size?: number
  updated_at?: string
  created_at?: string
  expire_time?: string
  ga_code?: string
  icon?: IAttachment
  logo?: IAttachment
  banner?: IAttachment
  id?: number
  inquiry_email?: string
  leadership: string
  merchant_id?: number
  online_time?: string
  private_host?: string
  province?: string
  revision?: number
  site_name?: string
  site_host?: string
  inquiry_code?: string
  style_code?: string
  script_code?: string
  site_status?: {
    base_info: number
    design: number
    product: number
    article: 0
    seo: number
    [index: string]: number
  }
}

export interface ISiteTotal {
  article_total_num: number
  inquiry_this_month_num: number
  inquiry_total_num: number
  product_total_num: number
  video_total_num: number
}

/**
 * 登录
 */
export interface ILoginForm {
  account: string
  password: string
  keep: boolean
}

/**
 * 素材文件
 */
export interface IAttachmentGroup {
  created_at: string
  group_name: string
  id: number
  merchant_id: number
  pid: number
  site_id: number
  updated_at: string
}

/** 素材 */
export interface IAttachment {
  id: number
  url: string
  file_type?: number
  created_at?: string
  driver?: string
  file_ext?: string
  file_mime?: string
  file_name?: string
  file_path?: string
  file_size?: number
  file_size_human?: string
  file_type_text?: string
  group_id?: number
  merchant_id?: number
  site_id?: number
  status?: number
  updated_at?: string
  user_id?: number
  isSelected?: boolean
}

/** 素材空间信息 */
export interface DiskInfo {
  site_id: number
  total: number
  total_human: string
  used: number
  used_human: string
  used_rate: number
}

export type SettingInfo = {
  option: string[]
  default: string[]
  value: string | string[]
}

export interface IProductParam {
  id?: number
  category_ids: number[]
  active_in_category?: IActiveCategroy[]
  param_name: string
  site_id: number
  setting: any
  settingInfo?: SettingInfo
  value: string
  sort_num: number
  status: number | boolean
  is_require: number | boolean
  is_allow_img: number | boolean
  is_common: number | boolean
  param_type: number
  action?: boolean
}

export type ProductParam = {
  param_id: number
  param_name: string
  param_type: number
  param_type_text: string
  value: string | string[]
}

/** 产品 */
export interface IProduct {
  id: number
  site_id: number
  seo_description: string
  active_in_category?: IActiveCategroy[]
  seo_title: string
  seo_keyword: string | string[]
  is_top: boolean
  is_publish: boolean
  path: string
  suffix: string
  title: string
  is_google_include: boolean
  sort_num: number
  category_ids: number[]
  summary: string
  video: IAttachment[]
  img: IAttachment[]
  front_cover?: IAttachment
  param: { param_id: number; value: string }[]
  product_param?: ProductParam[]
  param_id: number
  value: string
  status: number
  detail: {
    data_type: number
    content: {
      detail: string
    }
  }
  created_at?: string
  updated_at?: string
}

/** 分类 */
export interface IClassifyForm {
  site_id: number
  category_type: number
  category_name: string
  id: number
  pid: number
  sort_num?: number
  status: number
}

/** 产品参数，类别项,文本，单选，多选 */
export interface SettingType {
  id?: number
  type?: number
  isChecked?: boolean
  value?: string
}

/** 素材类型 */
export enum MaterFileType {
  ALL = 0,
  IMG = 2,
  VEDIO = 3,
}

export interface IInquiry {
  created_at: string
  customer_country: string
  customer_device: string
  customer_email: string
  customer_ip: string
  customer_name: string
  filter_reason: number
  filter_reason_text: string
  id: number
  inquiry_url: string
  inquiry_content: string
  inquiry_group: number
  inquiry_manager: number
  inquiry_source: number
  inquiry_source_text: string
  inquiry_type: number
  inquiry_type_text: string
  is_read: number
  is_read_text: string
  merchant_id: number
  mui: string
  page_id: number
  site_id: number
  status: number
  status_text: string
  updated_at: string
  os: string
  telephone: string
  terminal: number
  terminal_text: string
  page_img: IAttachment
  page_title: string
  page_path: string
}

export interface IInquiryFilter {
  filter_email: string | string[]
  inquiry_email?: string | string[]
  filter_keyword: string | string[]
  filter_ip: string | string[]
  status?: number
}

/**  询盘类型统计 */
export interface IInquiryPiceData {
  inquiry_type: number
  inquiry_type_text: string
  inquiry_source_text: string
  num: number
}

/** 询盘来源统计 */
export interface IInquirySourceData {
  data: IInquiryPiceData[]
  date: string
}

/** 分页查找条件 */
export interface IPagationWhere {
  current_page: number
  per_page: number
  order?: string
  title?: string
  keyword?: string
  is_top?: number
  start_date?: string
  end_date?: string
  status?: number
  category_ids?: number[]
  category_names?: string[]
  field?: string
  [index: string]: any
}

/**
 * Echarts IGrid
 */
export interface IGrid {
  x?: number
  x2?: number
  y?: number
  y2?: number
  top?: number
  left?: number
  bottom?: number
  right?: number
}
/** 站点配置 */
export interface ISiteConfig<T> {
  content: string
  created_at: string
  extend: string
  group: string
  id: number
  merchant_id: string
  name: string
  rule: string
  setting: string
  site_id: string
  status: number
  tip: string
  title: string
  type: string
  updated_at: string
  value: T
  visible: string
}

/**
 * 导航管理
 */
export interface INavigation extends ITree {
  id: number
  site_id: number
  pid: number
  title: string
  content_type: number | string
  content_type_text?: string
  category_ids: number[]
  active_in_category?: IActiveCategroy[]
  path?: string
  status: number
  sort_num?: number
  seo_keyword?: string
  is_google_include?: string
  seo_description?: string
  seo_title?: string
  page_type?: string
  updated_at?: string
  children?: INavigation[]
  deep?: number
  jsonContent?: string
  level: number
  old_sort_num?: number
}

/**
 * 页面类型
 */
export interface IColumnPageType {
  key: number
  value: string
  page_type: string
  content_type: string
}
