import httpService from '@/util/httpService'
import SingleClass from '@/util/singleClass'
import { UseCommon } from '@/util/useCommon'

/**
* 公共接口
* @date 6/10/2022
*/
class Config extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Config {
    return super.ins() as Config
  }
  /**
  * 新增配置
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postConfigAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/config/add', method: 'POST', params, showError })
  }
  /**
    * 获取常量
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getConstantGet<T>(params: { constant_name?: any }, showError = true) {
    return httpService<T>({ url: '/constant/get', method: 'GET', params, showError })
  }
  /**
    * 获取所有常量名
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getConstantKeys<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/constant/keys', method: 'GET', params, showError })
  }
  /**
    * 获取配置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getConfigList<T>(params: { name?: any, group?: any, title?: any, tip?: any, type?: any, visible?: any }, showError = true) {
    return httpService<T>({ url: '/config/list', method: 'GET', params, showError })
  }
  /**
    * 获取模板路径
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getTemplateGet<T>(params: { template_name?: any }, showError = true) {
    return httpService<T>({ url: '/template/get', method: 'GET', params, showError })
  }
  /**
    * 获取行业类型
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getIndustryList<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/industry/list', method: 'GET', params, showError })
  }
}


/**
* 关键词规则
* @date 6/10/2022
*/
class Keyword extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Keyword {
    return super.ins() as Keyword
  }
  /**
  * 新增关键词规则
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postKeywordRuleAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/keyword/rule/add', method: 'POST', params, showError })
  }
  /**
    * 更新关键词规则
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordRuleUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/keyword/rule/update', method: 'POST', params, showError })
  }
  /**
    * 获取关键词规则列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getKeywordRuleList<T>(params: { business_model?: any, seo_type?: any, seo_item?: any, status?: any }, showError = true) {
    return httpService<T>({ url: '/keyword/rule/list', method: 'GET', params, showError })
  }
  /**
    * 获取关键词规则详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getKeywordRuleGet<T>(params: { id?: any }, showError = true) {
    return httpService<T>({ url: '/keyword/rule/get', method: 'GET', params, showError })
  }
  /**
    * 获取关键词库列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getKeywordList<T>(params: { site_id?: any, language?: any, current_page?: any, per_page?: any, keyword?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/keyword/list', method: 'GET', params, showError })
  }
  /**
    * 获取关键词库详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getKeywordGet<T>(params: { site_id?: any, id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/keyword/get', method: 'GET', params, showError })
  }
  /**
    * 新增关键词
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordAdd<T>(params: { sit?: any }, showError = true) {
    return httpService<T>({ url: '/keyword/add', method: 'POST', params, showError })
  }
  /**
    * 更新关键词
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/keyword/update', method: 'POST', params, showError })
  }
  /**
    * 删除关键词
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/keyword/delete', method: 'POST', params, showError })
  }
  /**
    * 关键词打标签
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordTag<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/keyword/tag', method: 'POST', params, showError })
  }
  /**
    * 导入关键词
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordImport<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/keyword/import', method: 'POST', params, showError })
  }
  /**
    * 删除标签
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postKeywordDeletetag<T>(params: { tag?: any }, showError = true) {
    return httpService<T>({ url: '/keyword/deleteTag', method: 'POST', params, showError })
  }
}


/**
* GA
* @date 6/10/2022
*/
class Ga extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Ga {
    return super.ins() as Ga
  }
  /**
  * GA测试
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getGaIndex<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/ga/index', method: 'GET', params, showError })
  }
}


/**
* 装修
* @date 6/10/2022
*/
class Design extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Design {
    return super.ins() as Design
  }
  /**
  * 更新公共数据
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postDesignCommonUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/design/common/update', method: 'POST', params, showError })
  }
  /**
    * 更新内容数据
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postDesignContentUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/design/content/update', method: 'POST', params, showError })
  }
}


/**
* 用户
* @date 6/10/2022
*/
class User extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): User {
    return super.ins() as User
  }
  /**
  * 用户信息
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getUserInfo<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/user/info', method: 'GET', params, showError })
  }
}


/**
* 站点
* @date 6/10/2022
*/
class Site extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Site {
    return super.ins() as Site
  }
  /**
  * GA跟踪代码设置
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postSiteSetga<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/setGA', method: 'POST', params, showError })
  }
  /**
    * 删除站点配置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteConfigDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/config/delete', method: 'POST', params, showError })
  }
  /**
    * 新增站点
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/add', method: 'POST', params, showError })
  }
  /**
    * 新增站点设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteConfigAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/config/add', method: 'POST', params, showError })
  }
  /**
    * 更新站点设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteConfigUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/config/update', method: 'POST', params, showError })
  }
  /**
    * 样式代码设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteSetstylecode<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/setStyleCode', method: 'POST', params, showError })
  }
  /**
    * 站点列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getSiteList<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/list', method: 'GET', params, showError })
  }
  /**
    * 获取站点信息
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getSiteGet<T>(params: { language?: any, site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/site/get', method: 'GET', params, showError })
  }
  /**
    * 获取站点设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getSiteConfigList<T>(params: { site_id?: any, name?: any, group?: any, title?: any, tip?: any, type?: any, visible?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/site/config/list', method: 'GET', params, showError })
  }
  /**
    * 询盘跟踪代码设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteSetinquirycode<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/setInquiryCode', method: 'POST', params, showError })
  }
  /**
    * 修改公司基础信息
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSiteUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/site/update', method: 'POST', params, showError })
  }
  /**
    * 获取公司基础信息
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getSiteGetcompanyinfo<T>(params: { language?: any, site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/site/getCompanyInfo', method: 'GET', params, showError })
  }
}


/**
* 统计
* @date 6/10/2022
*/
class Data extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Data {
    return super.ins() as Data
  }
  /**
  * 获取网站概况
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getDataSiteoverview<T>(params: { site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/data/siteOverview', method: 'GET', params, showError })
  }
  /**
    * 获取询盘类型统计
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getDataInquirycountbytype<T>(params: { site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/data/inquiryCountByType', method: 'GET', params, showError })
  }
  /**
    * 获取询盘统计
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getDataInquirycount<T>(params: { site_id?: any, type?: any, start_date?: any, end_date?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/data/inquiryCount', method: 'GET', params, showError })
  }
  /**
    * 获取询盘走势
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getDataInquirytrend<T>(params: { site_id?: any, format?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/data/inquiryTrend', method: 'GET', params, showError })
  }
}


/**
* 栏目
* @date 6/10/2022
*/
class Column extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Column {
    return super.ins() as Column
  }
  /**
  * 删除栏目
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postColumnDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/column/delete', method: 'POST', params, showError })
  }
  /**
    * 变更栏目启用状态
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postColumnStatus<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/column/status', method: 'POST', params, showError })
  }
  /**
    * 新增栏目
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postColumnAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/column/add', method: 'POST', params, showError })
  }
  /**
    * 更新栏目
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postColumnUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/column/update', method: 'POST', params, showError })
  }
  /**
    * 获取子栏目
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getColumnGetchildrenbyids<T>(params: { id?: any, column_type?: any, site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/column/getChildrenByIds', method: 'GET', params, showError })
  }
  /**
    * 获取栏目
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getColumnGet<T>(params: { id?: any, column_type?: any, site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/column/get', method: 'GET', params, showError })
  }
  /**
    * 获取栏目列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getColumnList<T>(params: { site_id?: any, language?: any, current_page?: any, per_page?: any, status?: any, page_type?: any, content_type?: any, pid?: any, with_tree?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/column/list', method: 'GET', params, showError })
  }
}


/**
* 站内优化
* @date 6/10/2022
*/
class Seo extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Seo {
    return super.ins() as Seo
  }
  /**
  * 获取优化列表
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getSeoList<T>(params: { site_id?: any, language?: any, type?: any, current_page?: any, per_page?: any, title?: any, pid?: any, with_tree?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/seo/list', method: 'GET', params, showError })
  }
  /**
    * 获取优化详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getSeoGet<T>(params: { site_id?: any, language?: any, id?: any, type?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/seo/get', method: 'GET', params, showError })
  }
  /**
    * 更新优化
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSeoUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/seo/update', method: 'POST', params, showError })
  }
  /**
    * 自动生成优化
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postSeoGetautotdk<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/seo/getAutoTdk', method: 'POST', params, showError })
  }
}


/**
* 登录注册
* @date 6/10/2022
*/
class C11q1xwtilbnlcqj extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): C11q1xwtilbnlcqj {
    return super.ins() as C11q1xwtilbnlcqj
  }
  /**
  * 注册
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postC11q1xwtilbnlcqj<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/C11Q1XwTiLbnlCQJ', method: 'POST', params, showError })
  }
  /**
    * 登录
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postLogin<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/login', method: 'POST', params, showError })
  }
  /**
    * 登出
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postLogout<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/logout', method: 'POST', params, showError })
  }
  /**
    * 刷新Token
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postRefreshtoken<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/refreshToken', method: 'POST', params, showError })
  }
}


/**
* 素材库
* @date 6/10/2022
*/
class Attachment extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Attachment {
    return super.ins() as Attachment
  }
  /**
  * 素材空间详情
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getAttachmentDiskInfo<T>(params: { site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/attachment/disk/info', method: 'GET', params, showError })
  }
  /**
    * 新增素材分组
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentGroupAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/group/add', method: 'POST', params, showError })
  }
  /**
    * 素材分组列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getAttachmentGroupList<T>(params: { site_id?: any, group_name?: any, pid?: any, current_page?: any, per_page?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/attachment/group/list', method: 'GET', params, showError })
  }
  /**
    * 修改素材分组
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentGroupUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/group/update', method: 'POST', params, showError })
  }
  /**
    * 删除素材分组
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentGroupDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/group/delete', method: 'POST', params, showError })
  }
  /**
    * 文件列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getAttachmentList<T>(params: { site_id?: any, group_id?: any, file_type?: any, file_name?: any, current_page?: any, per_page?: any, columns?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/attachment/list', method: 'GET', params, showError })
  }
  /**
    * 修改文件
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/update', method: 'POST', params, showError })
  }
  /**
    * 删除文件
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/delete', method: 'POST', params, showError })
  }
  /**
    * 移动文件
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentMove<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/move', method: 'POST', params, showError })
  }
  /**
    * 文件详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getAttachmentInfo<T>(params: { id?: any, site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/attachment/info', method: 'GET', params, showError })
  }
  /**
    * 获取文件上传Token
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentUploadGettempkey<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/upload/getTempKey', method: 'POST', params, showError })
  }
  /**
    * 文件上传完成
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postAttachmentUploadComplete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/attachment/upload/complete', method: 'POST', params, showError })
  }
}


/**
* 分类
* @date 6/10/2022
*/
class Category extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Category {
    return super.ins() as Category
  }
  /**
  * 新增分类
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  postCategoryAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/category/add', method: 'POST', params, showError })
  }
  /**
    * 获取子分类
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getCategoryGetchildrenbyids<T>(params: { ids?: any, category_type?: any, site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/category/getChildrenByIds', method: 'GET', params, showError })
  }
  /**
    * 获取父分类
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getCategoryGetparentbyids<T>(params: { ids?: any, category_type?: any, site_id?: any, with_self?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/category/getParentByIds', method: 'GET', params, showError })
  }
  /**
    * 获取分类列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getCategoryList<T>(params: { site_id?: any, language?: any, category_type?: any, pid?: any, status?: any, column_id?: any, with_column?: any, with_tree?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/category/list', method: 'GET', params, showError })
  }
  /**
    * 更新分类
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postCategoryUpdate<T>(params: { category_name?: any, column_id?: any, parent_id?: any, path?: any, status?: any }, showError = true) {
    return httpService<T>({ url: '/category/update', method: 'POST', params, showError })
  }
  /**
    * 删除分类
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postCategoryDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/category/delete', method: 'POST', params, showError })
  }
  /**
    * 获取分类详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getCategoryGet<T>(params: { site_id?: any, language?: any, id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/category/get', method: 'GET', params, showError })
  }
  /**
    * 变更分类启用状态
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postCategoryStatus<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/category/status', method: 'POST', params, showError })
  }
  /**
    * 更改分类排序
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postCategoryOrder<T>(params: { sort_num?: any }, showError = true) {
    return httpService<T>({ url: '/category/order', method: 'POST', params, showError })
  }
  /**
    * 批量设置分类
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postCategorySetbatch<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/category/setBatch', method: 'POST', params, showError })
  }
}


/**
* 产品
* @date 6/10/2022
*/
class Product extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Product {
    return super.ins() as Product
  }
  /**
  * 获取产品参数列表
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getProductParamList<T>(params: { site_id?: any, language?: any, current_page?: any, per_page?: any, category_ids?: any, param_type?: any, is_require?: any, is_allow_img?: any, is_common?: any, status?: any, param_name?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/product/param/list', method: 'GET', params, showError })
  }
  /**
    * 获取产品参数详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getProductParamGet<T>(params: { site_id?: any, id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/product/param/get', method: 'GET', params, showError })
  }
  /**
    * 删除产品参数
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductParamDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/product/param/delete', method: 'POST', params, showError })
  }
  /**
    * 更新产品参数
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductParamUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/product/param/update', method: 'POST', params, showError })
  }
  /**
    * 新增产品参数
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductParamAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/product/param/add', method: 'POST', params, showError })
  }
  /**
    * 变更产品参数启用状态
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductParamStatus<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/product/param/status', method: 'POST', params, showError })
  }
  /**
    * 更改产品参数排序
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductParamOrder<T>(params: { sort_num?: any }, showError = true) {
    return httpService<T>({ url: '/product/param/order', method: 'POST', params, showError })
  }
  /**
    * 获取产品列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getProductList<T>(params: { site_id?: any, language?: any, current_page?: any, per_page?: any, category_ids?: any, is_top?: any, is_publish?: any, title?: any, start_data?: any, end_date?: any, order?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/product/list', method: 'GET', params, showError })
  }
  /**
    * 获取产品所需参数
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getProductGetparam<T>(params: { site_id?: any, category_ids?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/product/getParam', method: 'GET', params, showError })
  }
  /**
    * 获取产品
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getProductGet<T>(params: { site_id?: any, id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/product/get', method: 'GET', params, showError })
  }
  /**
    * 新增产品
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/product/add', method: 'POST', params, showError })
  }
  /**
    * 更新产品
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/product/update', method: 'POST', params, showError })
  }
  /**
    * 删除产品
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/product/delete', method: 'POST', params, showError })
  }
  /**
    * 置顶、取消置顶产品
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductTop<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/product/top', method: 'POST', params, showError })
  }
  /**
    * 变更产品上下架状态
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductStatus<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/product/status', method: 'POST', params, showError })
  }
  /**
    * 更改产品排序
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postProductOrder<T>(params: { sort_num?: any }, showError = true) {
    return httpService<T>({ url: '/product/order', method: 'POST', params, showError })
  }
}


/**
* 文章
* @date 6/10/2022
*/
class Article extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Article {
    return super.ins() as Article
  }
  /**
  * 全文搜索test
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getArticleSearch<T>(params: { site_id?: any, search_word?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/article/search', method: 'GET', params, showError })
  }
  /**
    * 删除文章
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postArticleDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/article/delete', method: 'POST', params, showError })
  }
  /**
    * 变更文章上架状态
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postArticleStatus<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/article/status', method: 'POST', params, showError })
  }
  /**
    * 新增��章
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postArticleAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/article/add', method: 'POST', params, showError })
  }
  /**
    * 更改文章排序
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postArticleOrder<T>(params: { sort_num?: any }, showError = true) {
    return httpService<T>({ url: '/article/order', method: 'POST', params, showError })
  }
  /**
    * 更新文章
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postArticleUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/article/update', method: 'POST', params, showError })
  }
  /**
    * 获取文章列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getArticleList<T>(params: { site_id?: any, language?: any, category_ids?: any, status?: any, is_top?: any, current_page?: any, per_page?: any, title?: any, start_data?: any, end_date?: any, order?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/article/list', method: 'GET', params, showError })
  }
  /**
    * 获取文章详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getArticleGet<T>(params: { language?: any, site_id?: any, id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/article/get', method: 'GET', params, showError })
  }
  /**
    * 设置文章置顶/取消置顶
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postArticleTop<T>(params: { is_top?: any, site_id?: any, ids?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/article/top', method: 'POST', params, showError })
  }
}


/**
* 视频
* @date 6/10/2022
*/
class Video extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Video {
    return super.ins() as Video
  }
  /**
  * 获取视频列表
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getVideoList<T>(params: { site_id?: any, language?: any, category_id?: any, status?: any, is_top?: any, current_page?: any, per_page?: any, title?: any, start_data?: any, end_date?: any, order?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/video/list', method: 'GET', params, showError })
  }
  /**
    * 获取视频详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getVideoGet<T>(params: { site_id?: any, id?: any, language?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    if (!params.language) {
      params.language = UseCommon.ins().language
    }
    return httpService<T>({ url: '/video/get', method: 'GET', params, showError })
  }
  /**
    * 新增视频
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postVideoAdd<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/video/add', method: 'POST', params, showError })
  }
  /**
    * 更新视频
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postVideoUpdate<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/video/update', method: 'POST', params, showError })
  }
  /**
    * 删除视频
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postVideoDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/video/delete', method: 'POST', params, showError })
  }
  /**
    * 置顶视频/取消置顶
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postVideoTop<T>(params: { id?: any, is_top?: any }, showError = true) {
    return httpService<T>({ url: '/video/top', method: 'POST', params, showError })
  }
  /**
    * 变更视频上下架状态
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postVideoStatus<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/video/status', method: 'POST', params, showError })
  }
  /**
    * 更改视频排序
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postVideoOrder<T>(params: { sort_num?: any }, showError = true) {
    return httpService<T>({ url: '/video/order', method: 'POST', params, showError })
  }
}


/**
* 询盘
* @date 6/10/2022
*/
class Inquiry extends SingleClass {
  /**
 * 构造方法
 * @return {any}
 */
  static ins(): Inquiry {
    return super.ins() as Inquiry
  }
  /**
  * 获取询盘列表国家
  * @date 6/10/2022
  * @param {any} params
  * @param {boolean} showError
  * @return {any}
  */
  getInquiryCountry<T>(params: { site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/inquiry/country', method: 'GET', params, showError })
  }
  /**
    * 获取询盘设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getInquirySettingGet<T>(params: { site_id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/inquiry/setting/get', method: 'GET', params, showError })
  }
  /**
    * 询盘通知邮件
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postInquirySettingInquiryemail<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/inquiry/setting/inquiryEmail', method: 'POST', params, showError })
  }
  /**
    * 询盘过滤设置
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postInquirySettingFilter<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/inquiry/setting/filter', method: 'POST', params, showError })
  }
  /**
    * 获取询盘列表
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getInquiryList<T>(params: { site_id?: any, current_page?: any, per_page?: any, status?: any, keyword?: any, start_date?: any, end_date?: any, inquiry_source?: any, inquiry_type?: any, customer_country?: any, is_read?: any, country_code?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/inquiry/list', method: 'GET', params, showError })
  }
  /**
    * 获取询盘详情
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  getInquiryGet<T>(params: { site_id?: any, id?: any }, showError = true) {
    if (!params.site_id) {
      params.site_id = UseCommon.ins().siteId
    }
    return httpService<T>({ url: '/inquiry/get', method: 'GET', params, showError })
  }
  /**
    * 删除询盘
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postInquiryDelete<T>(params: {}, showError = true) {
    return httpService<T>({ url: '/inquiry/delete', method: 'POST', params, showError })
  }
  /**
    * 设置询盘已读
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postInquiryRead<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/inquiry/read', method: 'POST', params, showError })
  }
  /**
    * 设置/还原垃圾询盘
    * @date 6/10/2022
    * @param {any} params
    * @param {boolean} showError
    * @return {any}
    */
  postInquiryStatus<T>(params: { is_publish?: any }, showError = true) {
    return httpService<T>({ url: '/inquiry/status', method: 'POST', params, showError })
  }
}

export const API = {
  config: Config.ins(),
  keyword: Keyword.ins(),
  ga: Ga.ins(),
  design: Design.ins(),
  user: User.ins(),
  site: Site.ins(),
  data: Data.ins(),
  column: Column.ins(),
  seo: Seo.ins(),
  c11q1xwtilbnlcqj: C11q1xwtilbnlcqj.ins(),
  attachment: Attachment.ins(),
  category: Category.ins(),
  product: Product.ins(),
  article: Article.ins(),
  video: Video.ins(),
  inquiry: Inquiry.ins()
}
