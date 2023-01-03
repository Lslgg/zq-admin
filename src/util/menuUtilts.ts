import { routeList } from '@/router'
import SingletonClass from './singleClass'

export interface IRouter {
  id: number
  path: string
  name: string
  layout?: string
  icon: string
  pid: number
  hidden: boolean
  redirect?: any
  meta?: IMeta
  component?: () => Promise<typeof import('*.vue')>
}

export interface IMeta {
  title: string
  sidebarMap: string[]
  breadcrumbs: string[]
}

export interface IMenu {
  id: number
  name: string
  key: string
  url: string
  icon: string
  pid: number
  subMenu?: IMenu[]
}

/** MenuUtilts */
export class MenuUtilts extends SingletonClass {
  /**
   * 构造方法
   * @return {any}
   */
  static ins(): MenuUtilts {
    return super.ins() as MenuUtilts
  }

  /**
   * 生成路由
   * @date 2022-03-15
   * @param {any} id:number
   * @param {any} pid:number
   * @param {any} path:string
   * @param {any} title:string
   * @param {any} icon=''
   * @param {any} hidden=false
   * @param {any} name=''
   * @param {any} layout='dashboard'
   * @return {any}
   */
  getRoute(
    id = 0, pid = 0, path: string, title: string,
    icon = '', hidden = false, name = '', layout = 'dashboard'
  ) {
    const meta = { title, sidebarMap: ['admin', path], breadcrumbs: ['首页', title], pid, id }
    const pathList = path.split('/')
    if (!name) {
      if (pathList.length >= 2) name = pathList[pathList.length - 1]
      else if (pathList.length === 1) name = pathList[0]
    }
    return { id, path: `/admin/${path}`, name, layout, icon, pid, hidden, meta }
  }

  /**
   * 获取菜单项
   */
  get menuList(): IMenu[] {
    let menuList: IMenu[] = []
    menuList =
      routeList
        .filter((p) => p.pid === 0 && !p.hidden)
        ?.map((p) => this.getMenuInfo(p)) ?? []
    menuList.forEach((p) => {
      p.subMenu =
        routeList
          .filter((pp) => pp.pid === p.id && !pp.hidden)
          ?.map((p) => this.getMenuInfo(p)) ?? []
    })
    return menuList
  }

  /**
   * 路由转换成菜单项
   * @param {IRouter} p
   * @return {any}
   */
  private getMenuInfo(p: IRouter) {
    return {
      id: p.id,
      name: p.meta?.title ?? p.name,
      key: p.name,
      url: p.path,
      icon: p.icon,
      pid: p.pid,
      subMenu: [],
    }
  }
}
