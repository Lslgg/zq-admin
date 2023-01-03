import { GlobalStore } from './globalStore'
import { ISiteInfo } from '@/api/api.model'
import { API } from '@/api/apis'
import router from '@/router'
import SingletonClass from '@/util/singleClass'
import { useScroll } from '@vueuse/core'
import { toRefs, watch } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { Constant } from './constant'
import { Utilts } from './utilts'
/**
 * 描述
 * @date 2022-03-17
 */
export class UseCommon extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): UseCommon {
    return super.ins() as UseCommon
  }
  /**
   * 站点id
   * @date 2022-03-26
   * @return {any}
   */
  get siteId(): any {
    const id = GlobalStore.ins().getItem(Constant.SITEID)
    if (id) return +id
    else undefined
  }


  /**
   * 站点id
   * @date 2022-03-26
   * @return {any}
   */
  get siteInfo(): ISiteInfo | Partial<ISiteInfo> {
    const siteInfo = GlobalStore.ins().getItem(Constant.SITEINFO)
    if (siteInfo) return siteInfo
    else {
      return {}
    }
  }

  /**
   * 获取语言
   * @date 2022-04-04
   * @return {any}
   */
  get language() {
    return GlobalStore.ins().getItem(Constant.LANGUAGE) || 'en'
  }

  /**
   * 获取二级域名
   * @date 2022-04-04
   * @return {any}
   */
  async getPrivateUrl() {
    let url = GlobalStore.ins().getItem(Constant.PRIVATEURL) ?? ''
    if (!url) {
      const isTrue = await this.getSiteInfo()
      if (isTrue) url = GlobalStore.ins().getItem(Constant.PRIVATEURL) ?? ''
    }
    return url
  }

  /**
   * 获取二级域名
   * @date 2022-04-04
   * @return {any}
   */
  async getSiteUrl() {
    let url = GlobalStore.ins().getItem(Constant.SITEURL) ?? ''
    if (!url) {
      const isTrue = await this.getSiteInfo()
      if (isTrue) url = GlobalStore.ins().getItem(Constant.SITEURL) ?? ''
    }
    return url
  }

  /**
   * 获取分类类别的值
   * @date 2022-03-26
   * @param {any} type:CategoryType
   * @return {any}
   */
  getClassifyValue(type: CategoryType) {
    type = type || 'product'
    const keyValue = { product: 1, article: 2, video: 3 }
    return keyValue[type]
  }

  /**
   * 跳转url
   * @date 2022-03-21
   * @param {any} name:string
   * @param {any} params
   */
  goUrlName(name: string, params: any = {}) {
    router.push({ name, params })
  }

  /**
   * 退出登录
   * @date 2022-04-07
   */
  logOut() {
    globalSdk
      .logout()
      .then(() => {
        GlobalStore.ins().removeItem(Constant.SITEID)
        GlobalStore.ins().removeItem(Constant.PRIVATEURL)
        GlobalStore.ins().removeItem(Constant.SITEURL)
        GlobalStore.ins().removeItem(Constant.LANGUAGE)
        GlobalStore.ins().removeItem(Constant.SITEINFO)
        location.href = '/admin/login'
      })
      .catch((res: any) => {
        Utilts.ins().message(res.messages, 'error')
      })
  }

  /**
   * 获取站口信息,并缓存相关站点信息
   * @return {any}
   */
  getSiteInfo() {
    return new Promise<boolean>((resolve, reject) => {
      API.site.getSiteList<ISiteInfo[]>({}).then((res) => {
        if (res.data && res.data.length > 0) {
          GlobalStore.ins().setItem(Constant.SITEID, res.data[0].id)
          GlobalStore.ins().setItem(Constant.PRIVATEURL, res.data[0].private_host)
          GlobalStore.ins().setItem(Constant.SITEURL, res.data[0].site_host)
          GlobalStore.ins().setItem(Constant.SITEINFO, res.data[0])
          const language = GlobalStore.ins().getItem(Constant.LANGUAGE) || 'en'
          GlobalStore.ins().setItem(Constant.LANGUAGE, language)
          resolve(true)
        } else resolve(false)
      })
    })
  }

  /**
   * 获取路由id
   * @date 2022-04-08
   * @return {any}
   */
  get id() {
    const route = useRoute()
    const id = +(route.params.id ?? '0')
    return id
  }
  /**
   * 滚动分页
   * @date 2022-03-17
   * @param {any} scrollRef:string
   * @param {any} getPatationList:string
   */
  public useOnScroll(scrollRef: any, getPatationList: any) {
    const { arrivedState } = useScroll(scrollRef)
    const { bottom } = toRefs(arrivedState)
    let sortTimeout = 0
    // 滚动到最下面时请求数据
    watch(bottom, (val: boolean) => {
      if (val && getPatationList) {
        if (sortTimeout) clearTimeout(sortTimeout)
        sortTimeout = setTimeout(() => getPatationList(), 0)
      }
    })
  }

  /**
   * 描述
   * @date 2022-05-27
   * @param {any} isTrue:any
   */
  public routeLeaveTip(isTrue: boolean) {
    const content = '您是否确认离开此页面-您输入的数据可能不会被保存'
    onBeforeRouteLeave((to, from, next) => {
      if (!isTrue) {
        Utilts.ins().confirm({
          content: content,
          okCallBack: () => next(),
          cancelCallBack: () => next(false)
        })
      } else next()
    })
    window.onbeforeunload = (e: any) => content
    window.onunload = (e: any) => content
  }
}
