import { IIndustry, ISiteInfo } from '@/api/api.model'
import { API } from '@/api/apis'
import { Constant } from '@/util/constant'
import { CustomerValidate } from '@/util/customerValidate'
import { GlobalStore } from '@/util/globalStore'
import SingletonClass from '@/util/singleClass'
import { UseCommon } from '@/util/useCommon'
import { UseFormService } from '@/util/useFormService'
import { Utilts } from '@/util/utilts'
import { useFavicon } from '@vueuse/core'
import { RuleObject } from 'ant-design-vue/lib/form'
import dayjs from 'dayjs'


/**
 * 描述
 * @date 2022-03-11
 */
export class CompanyService extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): CompanyService {
    return super.ins() as CompanyService
  }

  /**
   * 获取选项值
   * @date 2022-04-12
   * @param {any} key:string
   * @return {any}
   */
  getConstantOption(key: string): Promise<KeyValue[]> {
    return new Promise((resolve) => {
      API.config.getConstantGet({ constant_name: key })
        .then((res: any) => resolve(res.data))
        .catch((_err) => resolve([]))
    })
  }

  /**
 * 获取行业
 * @return {Promise<IIndustry[]>}
 */
  getIndustry(): Promise<IIndustry[]> {
    return new Promise((resolve) => {
      API.config.getIndustryList({})
        .then((res: any) => resolve(res.data))
        .catch((_err) => resolve([]))
    })
  }
  /**
   * 行业数据处理
   * @param {IIndustry[]} option
   * @return {IIndustry[]}
   */
  calcIndustry(option: IIndustry[] = []) {
    const arr = JSON.parse(JSON.stringify(option))
    arr.forEach((item: IIndustry) => {
      const target = arr.find((son: IIndustry) => son.id === item.pid)
      if (!target) return
      target.children = target.children || []
      target.children.push(item)
    })
    return arr.filter((item: IIndustry) => !item.pid)
  }

  /**
   * 获取行业值转化
   * @date 2022-04-12
   * @param {any} key:number
   * @param {any} source:number
   * @return {any}
   */
  calcIndustryValue(key: number, source: IIndustry[]) {
    const arr: number[] = []
    const data = source.find(item => item.id === key)
    if (data && data.pid !== 0) {
      const x = this.calcIndustryValue(data.pid, source)
      arr.unshift(...x)
    }
    if (key !== 0) arr.push(key)
    return arr
  }
}

/**
 * 描述
 * @date 2022-03-11
 * @return {any}
 */
export class UseCompanyForm extends UseFormService<ISiteInfo> {
  industryList: IIndustry[]
  /**
   * 描述
   * @date 2022-04-12
   * @param {any} info
   */
  constructor(info: IIndustry[]) {
    super()
    this.industryList = info
  }
  /**
   * 描述
   * @date 2022-03-11
   * @return {IProduct}
   */
  async initForm(): Promise<ISiteInfo> {
    let data: Partial<ISiteInfo> = {}
    const res = await API.site.getSiteGetcompanyinfo<ISiteInfo>({})
    let industry_type: number[] = []
    let export_market: number[] = []
    if (res.data) {
      data = res.data
      industry_type = CompanyService.ins().calcIndustryValue(data.industry_type as number ?? 0, this.industryList)
      if (typeof data.export_market === 'string') {
        if (data.export_market) {
          export_market = data.export_market.split(',').map(item => Number(item)) || []
        }
      }
    }
    return {
      address: data.address || '',
      annual_yield: data.annual_yield || '',
      brand: data.brand || '',
      business_model: data.business_model || 0,
      city: data.city || '',
      company_enname: data.company_enname || '',
      company_name: data.company_name || '',
      company_short_name: data.company_short_name || '',
      company_short_enname: data.company_short_enname || '',
      company_type: data.company_type || 0,
      district: data.district || '',
      employees_num: data.employees_num || 0,
      export_market: export_market,
      formation_date: data.formation_date ? dayjs(data.formation_date, 'YYYY') : '',
      leadership: data.leadership || '',
      province: data.province || '',
      summary: data.summary || '',
      keyword: data.keyword || '',
      icon: data.icon,
      logo: data.logo,
      industry_type,
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @return {any}
   */
  createRule() {
    return {
      company_name: [{ required: true, message: '请填写公司中文名称' }],
      company_short_name: [{ required: true, message: '请填写公司中文简称' }],
      company_enname: [{ required: true, message: '请填写公司英文名称' }],
      industry_type: [{ required: true, message: '请选择行业类型' }],
      brand: [{ required: true, message: '请填写品牌名称' }],
      address: [{ required: true, message: '请选择公司地址' }],
      keyword: [
        { required: true, message: '请填写核心关键词' },
        { validator: this.validateKeyword, trigger: ['change', 'blur'] }
      ],
      logo: [{ required: true, message: '请上传logo' }],
      icon: [{ required: true, message: '请上传icon' }],
      business_model: [{ required: true, message: '请选择业务模式' }]
    }
  }
  /**
   * 描述
   * @date 2022-03-11
   * @param {any} info:any
   */
  onSubmit(info: any) {
    const params = this.getSubmitParams(info)
    API.site.postSiteUpdate(params)
      .then((_res: any) => {
        // 重新缓存站点信息
        Utilts.ins().message('保存成功')
        this.initForm().then(data => {
          // 重新缓存站点信息
          GlobalStore.ins().removeItem(Constant.SITEINFO)
          GlobalStore.ins().setSiteInfo$(data)
          Object.assign(this.modelRef, data)
          if (data.icon?.url) useFavicon(data.icon?.url)
        })
      })
  }
  /**
   * 描述
   * @date 2022-04-15
   * @param {any} info:any
   * @return {any}
   */
  getSubmitParams(info: any) {
    const params = { ...info, site_id: UseCommon.ins().siteId }
    // icon 图片
    if (Array.isArray(info.icon)) params.icon = info.icon.length > 0 ? info.icon[0].id : 0
    else params.icon = info.icon?.id ?? 0
    // logo 图片
    if (Array.isArray(info.logo)) params.logo = info.logo.length > 0 ? info.logo[0].id : 0
    else params.logo = info.logo?.id ?? 0
    // 行业类型
    params.industry_type = info.industry_type[info.industry_type.length - 1]
    // 成立时间
    if (params.formation_date) params.formation_date = info.formation_date.format('YYYY')
    else params.formation_date = ''
    // 出口市场
    if (typeof info.export_market === 'string') {
      params.export_market = info.export_market?.split(',')?.map((item: string) => Number(item)) || []
    } else {
      params.export_market = info.export_market
    }
    return params
  }
  /**
   * 公司关键词验证
   * @date 2022-03-17
   * @param {any} _rule:RuleObject
   * @param {any} value:string
   * @return {any}
   */
  async validateKeyword(_rule: RuleObject, value: string[]): Promise<string> {
    return CustomerValidate.ins().validateKeyword(value, 5)
  }
}

/**
 * 描述
 * @date 2022-03-18
 * @return {any}
 */
export class UseCompanyOperation {
  businessList: KeyValue[]
  companyTypeList: KeyValue[]
  marketList: KeyValue[]
  employeesList: KeyValue[]
  industryList: IIndustry[]
  /**
   * 描述
   * @date 2022-04-12
   */
  constructor() {
    this.businessList = []
    this.industryList = []
    this.companyTypeList = []
    this.marketList = []
    this.employeesList = []
  }
  /**
   * 描述
   * @date 2022-03-18
   * @return {any}
   */
  async useCompany() {
    await Promise.all([
      this.initIndustry(),
      this.initBusiness(),
      this.initCompanyType(),
      this.initEmployees(),
      this.initMarket()
    ])
    return {
      businessList: this.businessList,
      industrySource: this.industryList, // 行业类型原数据
      industryList: CompanyService.ins().calcIndustry(this.industryList), // 行业类型转化后的数据
      companyTypeList: this.companyTypeList,
      marketList: this.marketList,
      employeesList: this.employeesList
    }
  }
  /**
   * 行业类型
   * @date 2022-04-12
   * @return {any}
   */
  initIndustry() {
    return new Promise(async (resolve) => {
      this.industryList = await CompanyService.ins().getIndustry()
      resolve('')
    })
  }
  /**
   * 业务模式
   * @date 2022-04-12
   * @return {any}
   */
  initBusiness() {
    return new Promise(async (resolve) => {
      this.businessList = await CompanyService.ins().getConstantOption('BusinessModel')
      resolve('')
    })
  }
  /**
   * 企业类型
   * @date 2022-04-12
   * @return {any}
   */
  initCompanyType() {
    return new Promise(async (resolve) => {
      this.companyTypeList = await CompanyService.ins().getConstantOption('CompanyType')
      this.companyTypeList.unshift({ key: 0, value: '请选择' })
      resolve('')
    })
  }
  /**
   * 出口市场
   * @date 2022-04-12
   * @return {any}
   */
  initMarket() {
    return new Promise(async (resolve) => {
      this.marketList = await CompanyService.ins().getConstantOption('ExportMarket')
      resolve('')
    })
  }
  /**
   * 员工数量
   * @date 2022-04-12
   * @return {any}
   */
  initEmployees() {
    return new Promise(async (resolve) => {
      this.employeesList = await CompanyService.ins().getConstantOption('EmployeesNum')
      this.employeesList.unshift({ key: 0, value: '请选择' })
      resolve('')
    })
  }
}
